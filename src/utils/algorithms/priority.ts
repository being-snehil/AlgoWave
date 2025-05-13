
import { Process } from "@/components/ProcessForm";
import { GanttItem } from "@/components/GanttChart";

export const executePriorityScheduling = (
  processes: Process[]
): {
  ganttItems: GanttItem[];
  totalTime: number;
  results: { waitingTime: number; turnaroundTime: number };
} => {
  if (processes.length === 0) {
    throw new Error("Please add at least one process.");
  }

  // Check if all processes have priority
  const hasPriority = processes.every(p => p.priority !== undefined);
  if (!hasPriority) {
    throw new Error("All processes must have a priority value for this algorithm.");
  }

  // Create a copy of processes for manipulation
  const processesCopy = [...processes];
  
  // Sort initially by arrival time
  processesCopy.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  let currentTime = processesCopy[0].arrivalTime;
  let completed = 0;
  let ganttChart: GanttItem[] = [];
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  
  // Mark all processes as incomplete
  const remainingProcesses = processesCopy.map(p => ({ 
    ...p, 
    completed: false,
    priority: p.priority || 0 // Default priority to 0 if undefined
  }));
  
  // Continue until all processes are completed
  while (completed < processesCopy.length) {
    // Find available processes at current time
    const availableProcesses = remainingProcesses
      .filter(p => !p.completed && p.arrivalTime <= currentTime);
    
    // If no process is available, jump to the next arriving process
    if (availableProcesses.length === 0) {
      const nextProcess = remainingProcesses
        .filter(p => !p.completed)
        .sort((a, b) => a.arrivalTime - b.arrivalTime)[0];
        
      currentTime = nextProcess.arrivalTime;
      continue;
    }
    
    // Find the process with highest priority (lower number means higher priority)
    const highestPriorityProcess = availableProcesses.reduce(
      (prev, curr) => (prev.priority || 0) < (curr.priority || 0) ? prev : curr
    );
    
    // Calculate waiting time for this process
    const waitingTime = currentTime - highestPriorityProcess.arrivalTime;
    totalWaitingTime += waitingTime;
    
    // Add to Gantt chart
    ganttChart.push({
      processId: highestPriorityProcess.id,
      startTime: currentTime,
      endTime: currentTime + highestPriorityProcess.burstTime
    });
    
    // Update current time
    currentTime += highestPriorityProcess.burstTime;
    
    // Calculate turnaround time
    const turnaroundTime = waitingTime + highestPriorityProcess.burstTime;
    totalTurnaroundTime += turnaroundTime;
    
    // Mark process as completed
    const index = remainingProcesses.findIndex(p => p.id === highestPriorityProcess.id);
    remainingProcesses[index].completed = true;
    completed++;
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
