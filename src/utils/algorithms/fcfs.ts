
import { Process } from "@/components/ProcessForm";
import { GanttItem } from "@/components/GanttChart";

export const executeFirstComeFirstServe = (
  processes: Process[]
): {
  ganttItems: GanttItem[];
  totalTime: number;
  results: { waitingTime: number; turnaroundTime: number };
} => {
  if (processes.length === 0) {
    throw new Error("Please add at least one process.");
  }

  // Sort processes by arrival time
  const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);

  let currentTime = sortedProcesses[0].arrivalTime;
  let ganttChart: GanttItem[] = [];
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;

  sortedProcesses.forEach((process) => {
    // If there's idle time before this process
    if (process.arrivalTime > currentTime) {
      currentTime = process.arrivalTime;
    }

    // Calculate waiting time for this process
    const waitingTime = currentTime - process.arrivalTime;
    totalWaitingTime += waitingTime;

    // Add to Gantt chart
    ganttChart.push({
      processId: process.id,
      startTime: currentTime,
      endTime: currentTime + process.burstTime
    });

    // Update currentTime for next process
    currentTime += process.burstTime;

    // Calculate turnaround time
    const turnaroundTime = waitingTime + process.burstTime;
    totalTurnaroundTime += turnaroundTime;
  });

  // Calculate averages
  const avgWaitingTime = totalWaitingTime / sortedProcesses.length;
  const avgTurnaroundTime = totalTurnaroundTime / sortedProcesses.length;

  return {
    ganttItems: ganttChart,
    totalTime: currentTime,
    results: {
      waitingTime: parseFloat(avgWaitingTime.toFixed(2)),
      turnaroundTime: parseFloat(avgTurnaroundTime.toFixed(2))
    }
  };
};
