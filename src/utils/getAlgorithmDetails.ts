
interface AlgorithmDetails {
  title: string;
  description: string;
}

export const getAlgorithmDetails = (
  algorithmId: string | undefined
): AlgorithmDetails => {
  const algorithms: { [key: string]: AlgorithmDetails } = {
    fcfs: {
      title: 'First Come First Serve (FCFS)',
      description: 'A non-preemptive scheduling algorithm that executes processes in order of their arrival time.'
    },
    sjf: {
      title: 'Shortest Job First (SJF)',
      description: 'A non-preemptive scheduling algorithm that executes the process with the smallest burst time first.'
    },
    ljf: {
      title: 'Longest Job First (LJF)',
      description: 'A non-preemptive scheduling algorithm that executes the process with the largest burst time first.'
    },
    srtf: {
      title: 'Shortest Remaining Time First (SRTF)',
      description: 'A preemptive version of SJF where the process with the smallest remaining time is selected for execution.'
    },
    hrrn: {
      title: 'Highest Response Ratio Next (HRRN)',
      description: 'A non-preemptive scheduling algorithm that selects the process with highest response ratio next.'
    },
    rr: {
      title: 'Round Robin (RR)',
      description: 'A preemptive scheduling algorithm that assigns a fixed time slice to each process in a circular queue.'
    },
    priority: {
      title: 'Priority Scheduling',
      description: 'A scheduling algorithm that selects the process with the highest priority for execution next.'
    },
    banker: {
      title: 'Banker\'s Algorithm',
      description: 'A deadlock avoidance algorithm that tests for safety by simulating allocation of all resources.'
    }
  };

  return algorithms[algorithmId || 'fcfs'] || {
    title: 'Unknown Algorithm',
    description: 'Algorithm details not found.'
  };
};
