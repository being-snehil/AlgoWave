
import { Process } from "@/components/ProcessForm";
import { GanttItem } from "@/components/GanttChart";

export const executeShortestRemainingTimeFirst = (
  processes: Process[]
): {
  ganttItems: GanttItem[];
  totalTime: number;
  results: { waitingTime: number; turnaroundTime: number };
} => {
  if (processes.length === 0) {
    throw new Error("Please add at least one process.");
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
    startTime: -1, // First time process starts execution
    finishTime: -1, // Time when process completes
    lastExecutionStart: -1 // Last time the process started a burst
  }));
  let ganttChart: GanttItem[] = [];
  let completed = 0;
  let currentProcess: number | null = null;
  let isAnyProcessRunning = false;
  
  // Run until all processes are completed
  while (completed < processesCopy.length) {
    // Find the process with shortest remaining time among arrived processes
    let shortestRemainingTime = Infinity;
    let processIndex = -1;
    
    for (let i = 0; i < remainingProcesses.length; i++) {
      const process = remainingProcesses[i];
      // Check if process has arrived and not completed
      if (process.arrivalTime <= currentTime && process.remainingTime > 0) {
        if (process.remainingTime < shortestRemainingTime) {
          shortestRemainingTime = process.remainingTime;
          processIndex = i;
        }
      }
    }
    
    // If no process is found, advance time to next process arrival
    if (processIndex === -1) {
      // Find the next arriving process
      let nextArrival = Infinity;
      for (let i = 0; i < remainingProcesses.length; i++) {
        if (remainingProcesses[i].remainingTime > 0 && 
            remainingProcesses[i].arrivalTime > currentTime &&
            remainingProcesses[i].arrivalTime < nextArrival) {
          nextArrival = remainingProcesses[i].arrivalTime;
        }
      }
      currentTime = nextArrival;
      continue;
    }
    
    // Selected process for execution
    const selectedProcess = remainingProcesses[processIndex];
    
    // If this is a context switch (different process than what was running)
    if (currentProcess !== selectedProcess.id && isAnyProcessRunning) {
      // Add the previous process execution to Gantt chart
      if (currentProcess !== null) {
        const prevProcess = remainingProcesses.find(p => p.id === currentProcess);
        if (prevProcess && prevProcess.lastExecutionStart !== -1) {
          ganttChart.push({
            processId: currentProcess,
            startTime: prevProcess.lastExecutionStart,
            endTime: currentTime
          });
          prevProcess.lastExecutionStart = -1; // Reset for next execution
        }
      }
    }
    
    // If this process is starting or resuming after preemption
    if (currentProcess !== selectedProcess.id) {
      // Mark first start time if not set
      if (selectedProcess.startTime === -1) {
        selectedProcess.startTime = currentTime;
      }
      
      // Set the last execution start time
      selectedProcess.lastExecutionStart = currentTime;
      currentProcess = selectedProcess.id;
    }
    
    // Execute for 1 time unit 
    currentTime++;
    selectedProcess.remainingTime--;
    isAnyProcessRunning = true;
    
    // Check if process completed
    if (selectedProcess.remainingTime === 0) {
      // Process has completed
      selectedProcess.finishTime = currentTime;
      completed++;
      
      // Add final execution segment to Gantt chart
      ganttChart.push({
        processId: selectedProcess.id,
        startTime: selectedProcess.lastExecutionStart,
        endTime: currentTime
      });
      
      // Reset current process
      currentProcess = null;
      isAnyProcessRunning = false;
    } else if (processIndex !== -1) {
      // Check if preemption will occur in next step
      let willPreempt = false;
      
      // Check if any process with shorter remaining time will arrive at next time unit
      for (let i = 0; i < remainingProcesses.length; i++) {
        const process = remainingProcesses[i];
        if (process.arrivalTime === currentTime && 
            process.remainingTime < selectedProcess.remainingTime) {
          willPreempt = true;
          break;
        }
      }
      
      // If preemption will happen, add current execution segment to Gantt chart
      if (willPreempt && selectedProcess.lastExecutionStart !== -1) {
        ganttChart.push({
          processId: selectedProcess.id,
          startTime: selectedProcess.lastExecutionStart,
          endTime: currentTime
        });
        selectedProcess.lastExecutionStart = -1; // Reset for next execution
        currentProcess = null;
      }
    }
  }
  
  // Calculate waiting and turnaround times
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  
  for (const process of remainingProcesses) {
    const turnaroundTime = process.finishTime - process.arrivalTime;
    const waitingTime = turnaroundTime - process.burstTime;
    
    totalTurnaroundTime += turnaroundTime;
    totalWaitingTime += waitingTime;
  }
  
  // Calculate averages
  const avgWaitingTime = totalWaitingTime / processesCopy.length;
  const avgTurnaroundTime = totalTurnaroundTime / processesCopy.length;
  
  // Consolidate consecutive gantt items with same process ID
  const consolidatedGantt: GanttItem[] = [];
  ganttChart.forEach((item, index) => {
    if (index > 0 && consolidatedGantt.length > 0) {
      const prevItem = consolidatedGantt[consolidatedGantt.length - 1];
      if (prevItem.processId === item.processId && prevItem.endTime === item.startTime) {
        // Merge with previous item
        prevItem.endTime = item.endTime;
      } else {
        consolidatedGantt.push(item);
      }
    } else {
      consolidatedGantt.push(item);
    }
  });
  
  return {
    ganttItems: consolidatedGantt,
    totalTime: currentTime,
    results: {
      waitingTime: parseFloat(avgWaitingTime.toFixed(2)),
      turnaroundTime: parseFloat(avgTurnaroundTime.toFixed(2))
    }
  };
};
