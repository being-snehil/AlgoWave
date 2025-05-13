import { useState, useEffect } from 'react';

export interface GanttItem {
  processId: number;
  startTime: number;
  endTime: number;
}

interface GanttChartProps {
  items: GanttItem[];
  totalTime: number;
  isAnimating: boolean;
}

interface ProcessColor {
  [key: number]: string;
}

const GanttChart = ({ items, totalTime, isAnimating }: GanttChartProps) => {
  const [progress, setProgress] = useState<number[]>(Array(items.length).fill(0));
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  
  // Generate colors for each process ID
  const colors: ProcessColor = {};
  const baseColors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-amber-500',
    'bg-rose-500',
    'bg-cyan-500',
    'bg-emerald-500',
    'bg-indigo-500',
    'bg-pink-500',
    'bg-yellow-500'
  ];
  
  items.forEach((item) => {
    if (!colors[item.processId]) {
      const index = (item.processId - 1) % baseColors.length;
      colors[item.processId] = baseColors[index];
    }
  });

  useEffect(() => {
    if (!isAnimating) {
      setProgress(Array(items.length).fill(100));
      return;
    }
    
    setProgress(Array(items.length).fill(0));
    setCurrentIndex(-1);
    
    let currentItemIndex = 0;
    
    const animateGantt = () => {
      if (currentItemIndex < items.length) {
        setCurrentIndex(currentItemIndex);
        
        // Animate the current item
        const animationInterval = setInterval(() => {
          setProgress(prevProgress => {
            const newProgress = [...prevProgress];
            if (newProgress[currentItemIndex] < 100) {
              newProgress[currentItemIndex] += 1;
              return newProgress;
            } else {
              clearInterval(animationInterval);
              currentItemIndex++;
              setTimeout(animateGantt, 500); // Small pause between processes
              return newProgress;
            }
          });
        }, 20); // Speed of the animation
      }
    };
    
    setTimeout(animateGantt, 500); // Initial delay before animation starts
    
    return () => {
      setProgress(Array(items.length).fill(0));
      setCurrentIndex(-1);
    };
  }, [isAnimating, items]);

  // Generate timeline markers
  const generateTimelineMarkers = () => {
    const markers = [];
    for (let i = 0; i <= totalTime; i++) {
      const position = (i / totalTime) * 100;
      markers.push(
        <div key={i} style={{ left: `${position}%` }} className="timeline-marker">
          <div className="timeline-label">{i}</div>
        </div>
      );
    }
    return markers;
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-4 font-gilroy">Gantt Chart</h3>
      
      {/* Gantt Chart */}
      <div className="gantt-chart-container">
        {items.map((item, idx) => {
          const width = ((item.endTime - item.startTime) / totalTime) * 100;
          const left = (item.startTime / totalTime) * 100;
          const displayWidth = isAnimating 
            ? ((progress[idx] / 100) * width) 
            : width;
          
          return (
            <div
              key={idx}
              className={`gantt-bar ${colors[item.processId]}`}
              style={{
                left: `${left}%`,
                width: `${displayWidth}%`,
                opacity: currentIndex === idx || currentIndex === -1 ? 1 : 0.7
              }}
            >
              P{item.processId}
            </div>
          );
        })}
      </div>
      
      {/* Timeline */}
      <div className="timeline w-full">
        {generateTimelineMarkers()}
      </div>
      
      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4">
        {Object.entries(colors).map(([processId, colorClass]) => (
          <div key={processId} className="flex items-center">
            <div className={`w-4 h-4 ${colorClass} rounded`}></div>
            <span className="ml-2 text-sm">P{processId}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GanttChart;
