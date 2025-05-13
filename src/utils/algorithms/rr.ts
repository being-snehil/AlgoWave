
import { Process } from "@/components/ProcessForm";
import { GanttItem } from "@/components/GanttChart";

export const executeRoundRobin = (
  processes: Process[],
  timeQuantum: number
): {
  ganttItems: GanttItem[];
  totalTime: number;
  results: { waitingTime: number; turnaroundTime: number };
} => {
  if (processes.length === 0) {
    throw new Error("Please add at least one process.");
  }

  if (timeQuantum <= 0) {
    throw new Error("Time quantum must be greater than zero.");
  }

  // Create a copy of processes for manipulation
  const processesCopy = [...processes];
  
  // Sort by arrival time
  processesCopy.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  // Initialize variables
  let currentTime = processesCopy[0].arrivalTime;
  let remainingProcesses = processesCopy.map(p => ({ 
    ...p, 
    remainingTime: p.burstTime,
    completionTime: 0,
    firstExecution: true
  }));
  let ganttChart: GanttItem[] = [];
  let completed = 0;
  let queue: number[] = []; // Process indices in the ready queue
  
  // Run until all processes are completed
  while (completed < processesCopy.length) {
    // Add newly arrived processes to the queue
    for (let i = 0; i < remainingProcesses.length; i++) {
      if (remainingProcesses[i].arrivalTime <= currentTime && 
          remainingProcesses[i].remainingTime > 0 && 
          !queue.includes(i)) {
        queue.push(i);
      }
    }
    
    // If queue is empty, jump to next arrival time
    if (queue.length === 0) {
      let nextArrival = Infinity;
      for (const process of remainingProcesses) {
        if (process.remainingTime > 0 && 
            process.arrivalTime > currentTime && 
            process.arrivalTime < nextArrival) {
          nextArrival = process.arrivalTime;
        }
      }
      currentTime = nextArrival;
      continue;
    }
    
    // Get next process from queue
    const processIndex = queue.shift()!;
    const currentProcess = remainingProcesses[processIndex];
    
    // Calculate execution time for this quantum
    const executionTime = Math.min(timeQuantum, currentProcess.remainingTime);
    
    // Add to Gantt chart
    ganttChart.push({
      processId: currentProcess.id,
      startTime: currentTime,
      endTime: currentTime + executionTime
    });
    
    // Update process status
    currentProcess.remainingTime -= executionTime;
    currentTime += executionTime;
    
    // Check if process is complete
    if (currentProcess.remainingTime === 0) {
      completed++;
      currentProcess.completionTime = currentTime;
    } else {
      // Add process back to queue (only if it's not completed)
      // Check for any new arrivals before re-adding this process
      for (let i = 0; i < remainingProcesses.length; i++) {
        if (remainingProcesses[i].arrivalTime <= currentTime && 
            remainingProcesses[i].remainingTime > 0 && 
            !queue.includes(i) &&
            i !== processIndex) {
          queue.push(i);
        }
      }
      queue.push(processIndex);
    }
  }
  
  // Calculate waiting and turnaround times
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  
  for (const process of remainingProcesses) {
    const turnaroundTime = process.completionTime - process.arrivalTime;
    const waitingTime = turnaroundTime - process.burstTime;
    
    totalTurnaroundTime += turnaroundTime;
    totalWaitingTime += waitingTime;
  }
  
  // Calculate averages
  const avgWaitingTime = totalWaitingTime / processesCopy.length;
  const avgTurnaroundTime = totalTurnaroundTime / processesCopy.length;
  
  return {
    ganttItems: ganttChart,
    totalTime: currentTime,
    results: {
      waitingTime: parseFloat(avgWaitingTime.toFixed(2)),
      turnaroundTime: parseFloat(avgTurnaroundTime.toFixed(2))
    }
  };
};
