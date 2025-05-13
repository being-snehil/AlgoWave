
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ProcessForm, { Process } from '@/components/ProcessForm';
import GanttChart, { GanttItem } from '@/components/GanttChart';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAlgorithmDetails } from '@/utils/getAlgorithmDetails';
import {
  executeFirstComeFirstServe,
  executeShortestJobFirst,
  executeLongestJobFirst,
  executeShortestRemainingTimeFirst,
  executeHighestResponseRatioNext,
  executeRoundRobin,
  executePriorityScheduling,
  executeBankersAlgorithm
} from '@/utils/algorithms';

const Algorithm = () => {
  const { algorithmId } = useParams<{ algorithmId: string }>();
  const [processes, setProcesses] = useState<Process[]>([]);
  const [ganttItems, setGanttItems] = useState<GanttItem[]>([]);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [results, setResults] = useState<{ waitingTime: number; turnaroundTime: number; }>({
    waitingTime: 0,
    turnaroundTime: 0,
  });
  const [timeQuantum, setTimeQuantum] = useState<number>(2); // For Round Robin
  const { toast } = useToast();

  // Determine if we need to show additional inputs based on algorithm
  const needsTimeQuantum = algorithmId === 'rr';
  const needsPriority = algorithmId === 'priority';

  // Execute algorithm based on the selected algorithm ID
  const handleCalculate = () => {
    try {
      let result;

      switch (algorithmId) {
        case 'fcfs':
          result = executeFirstComeFirstServe(processes);
          break;
        case 'sjf':
          result = executeShortestJobFirst(processes);
          break;
        case 'ljf':
          result = executeLongestJobFirst(processes);
          break;
        case 'srtf':
          result = executeShortestRemainingTimeFirst(processes);
          break;
        case 'hrrn':
          result = executeHighestResponseRatioNext(processes);
          break;
        case 'rr':
          result = executeRoundRobin(processes, timeQuantum);
          break;
        case 'priority':
          result = executePriorityScheduling(processes);
          break;
        case 'banker':
          try {
            result = executeBankersAlgorithm();
          } catch (error) {
            toast({
              title: "Banker's Algorithm",
              description: "This algorithm requires resource matrices which are not currently implemented in the UI. It will be available in a future update.",
            });
            return;
          }
          break;
        default:
          toast({
            title: "Coming Soon",
            description: `${getAlgorithmDetails(algorithmId).title} implementation will be available soon!`,
          });
          result = executeFirstComeFirstServe(processes);
          break;
      }

      setGanttItems(result.ganttItems);
      setTotalTime(result.totalTime);
      setResults(result.results);
      setIsAnimating(true);

    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: "An unknown error occurred.",
          variant: "destructive"
        });
      }
    }
  };

  // Reset animation state when done
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isAnimating) {
      timer = setTimeout(() => {
        setIsAnimating(false);
      }, ganttItems.length * 2500); // Approximately how long animation takes
    }
    return () => clearTimeout(timer);
  }, [isAnimating, ganttItems.length]);

  const { title, description } = getAlgorithmDetails(algorithmId);

  return (
    <div className="container py-10 font-gilroy">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground mt-2">{description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ProcessForm 
            processes={processes} 
            setProcesses={setProcesses} 
            onCalculate={handleCalculate}
            showPriority={needsPriority}
            timeQuantum={timeQuantum}
            setTimeQuantum={setTimeQuantum}
            showTimeQuantum={needsTimeQuantum}
          />
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Visualization</CardTitle>
              <CardDescription>
                See how processes are scheduled over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {ganttItems.length > 0 ? (
                <>
                  <GanttChart 
                    items={ganttItems} 
                    totalTime={totalTime} 
                    isAnimating={isAnimating} 
                  />
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">Results</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Average Waiting Time</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">{results.waitingTime}</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Average Turnaround Time</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">{results.turnaroundTime}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-60 text-center">
                  <p className="text-muted-foreground mb-4">
                    Add processes and click "Visualize" to see the scheduling in action.
                  </p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-muted-foreground/50"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <path d="M7 8h10" />
                    <path d="M7 12h10" />
                    <path d="M7 16h10" />
                  </svg>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Algorithm;
