import { Cpu, Clock, ArrowRight, Database, List, Layers, ArrowUp, GitGraph, Route, Shuffle } from "lucide-react";
import AlgorithmCard from "./AlgorithmCard";

const FeatureSection = () => {
  const cpuSchedulingAlgorithms = [
    {
      title: "First Come First Serve",
      description: "Non-preemptive scheduling based on arrival order",
      icon: <Clock size={24} />,
      path: "/algorithm/fcfs"
    },
    {
      title: "Shortest Job First",
      description: "Non-preemptive scheduling based on burst time",
      icon: <ArrowRight size={24} />,
      path: "/algorithm/sjf"
    },
    {
      title: "Longest Job First",
      description: "Non-preemptive scheduling with largest burst time first",
      icon: <ArrowUp size={24} />,
      path: "/algorithm/ljf"
    },
    {
      title: "Shortest Remaining Time First",
      description: "Preemptive version of SJF algorithm",
      icon: <Layers size={24} />,
      path: "/algorithm/srtf"
    },
    {
      title: "Highest Response Ratio Next",
      description: "Non-preemptive scheduling based on response ratio",
      icon: <List size={24} />,
      path: "/algorithm/hrrn"
    },
    {
      title: "Round Robin",
      description: "Preemptive scheduling with fixed time quantum",
      icon: <Clock size={24} />,
      path: "/algorithm/rr"
    },
    {
      title: "Priority Scheduling",
      description: "Scheduling based on process priority",
      icon: <Cpu size={24} />,
      path: "/algorithm/priority"
    },
    {
      title: "Banker's Algorithm",
      description: "Resource allocation and deadlock avoidance",
      icon: <Database size={24} />,
      path: "/bankers"
    }
  ];

  const sortingAlgorithms = [
    {
      title: "Sorting Algorithms",
      description: "Visualize different sorting techniques",
      icon: <Shuffle size={24} />,
      path: "/sorting"
    }
  ];

  const pathfindingAlgorithms = [
    {
      title: "Pathfinding Algorithms",
      description: "Find the shortest path between nodes",
      icon: <Route size={24} />,
      path: "/pathfinding"
    }
  ];

  const graphAlgorithms = [
    {
      title: "Graph Algorithms",
      description: "Explore graph traversal techniques",
      icon: <GitGraph size={24} />,
      path: "/graph"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4 gradient-text font-gilroy">Explore CPU Scheduling Algorithms</h2>
          <p className="text-muted-foreground mb-8 font-gilroy">
            Visualize how different CPU scheduling algorithms work with our interactive tools. 
            Select an algorithm below to get started.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-gilroyr">
          {cpuSchedulingAlgorithms.map((algorithm, index) => (
            <AlgorithmCard
              key={index}
              title={algorithm.title}
              description={algorithm.description}
              icon={algorithm.icon}
              path={algorithm.path}
            />
          ))}
        </div>

        <div className="mt-16">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4 gradient-text font-gilroy">More Algorithms</h2>
            <p className="text-muted-foreground mb-8 font-gilroy">
              Explore additional algorithm categories beyond CPU scheduling.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-gilroyr">
            {sortingAlgorithms.map((algorithm, index) => (
              <AlgorithmCard
                key={`sorting-${index}`}
                title={algorithm.title}
                description={algorithm.description}
                icon={algorithm.icon}
                path={algorithm.path}
              />
            ))}
            
            {pathfindingAlgorithms.map((algorithm, index) => (
              <AlgorithmCard
                key={`pathfinding-${index}`}
                title={algorithm.title}
                description={algorithm.description}
                icon={algorithm.icon}
                path={algorithm.path}
              />
            ))}
            
            {graphAlgorithms.map((algorithm, index) => (
              <AlgorithmCard
                key={`graph-${index}`}
                title={algorithm.title}
                description={algorithm.description}
                icon={algorithm.icon}
                path={algorithm.path}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;