
import { Process } from "@/components/ProcessForm";
import { GanttItem } from "@/components/GanttChart";

export const executeLongestJobFirst = (
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
  
  // Sort initially by arrival time to determine which processes are available first
  processesCopy.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  let currentTime = processesCopy[0].arrivalTime;
  let completed = 0;
  let ganttChart: GanttItem[] = [];
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  
  // Mark all processes as incomplete
  const remainingProcesses = processesCopy.map(p => ({ ...p, completed: false }));
  
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
    
    // Find the process with the longest burst time among available processes
    const longestJob = availableProcesses.reduce(
      (prev, curr) => prev.burstTime > curr.burstTime ? prev : curr
    );
    
    // Calculate waiting time for this process
    const waitingTime = currentTime - longestJob.arrivalTime;
    totalWaitingTime += waitingTime;
    
    // Add to Gantt chart
    ganttChart.push({
      processId: longestJob.id,
      startTime: currentTime,
      endTime: currentTime + longestJob.burstTime
    });
    
    // Update current time
    currentTime += longestJob.burstTime;
    
    // Calculate turnaround time
    const turnaroundTime = waitingTime + longestJob.burstTime;
    totalTurnaroundTime += turnaroundTime;
    
    // Mark process as completed
    const index = remainingProcesses.findIndex(p => p.id === longestJob.id);
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
