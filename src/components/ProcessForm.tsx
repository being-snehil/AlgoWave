
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

export interface Process {
  id: number;
  arrivalTime: number;
  burstTime: number;
  priority?: number; // Optional priority field for priority scheduling
}

interface ProcessFormProps {
  processes: Process[];
  setProcesses: (processes: Process[]) => void;
  onCalculate: () => void;
  showPriority?: boolean; // Whether to show priority input
  showTimeQuantum?: boolean; // Whether to show time quantum input
  timeQuantum?: number; // Time quantum for Round Robin
  setTimeQuantum?: (quantum: number) => void; // Function to update time quantum
}

const ProcessForm = ({ 
  processes, 
  setProcesses, 
  onCalculate, 
  showPriority = false,
  showTimeQuantum = false,
  timeQuantum = 2,
  setTimeQuantum = () => {}
}: ProcessFormProps) => {
  const { toast } = useToast();
  const [newProcess, setNewProcess] = useState<{ arrivalTime: string, burstTime: string, priority: string }>({
    arrivalTime: '',
    burstTime: '',
    priority: ''
  });

  const addProcess = () => {
    // Validate inputs
    if (!newProcess.arrivalTime || !newProcess.burstTime) {
      toast({
        title: "Validation Error",
        description: "Please enter both arrival time and burst time.",
        variant: "destructive"
      });
      return;
    }

    const arrivalTime = parseInt(newProcess.arrivalTime);
    const burstTime = parseInt(newProcess.burstTime);
    const priority = newProcess.priority ? parseInt(newProcess.priority) : undefined;

    if (isNaN(arrivalTime) || isNaN(burstTime) || arrivalTime < 0 || burstTime <= 0) {
      toast({
        title: "Validation Error",
        description: "Arrival time must be non-negative and burst time must be positive.",
        variant: "destructive"
      });
      return;
    }

    if (showPriority && !newProcess.priority) {
      toast({
        title: "Validation Error",
        description: "Priority value is required for priority scheduling.",
        variant: "destructive"
      });
      return;
    }

    const newProcessObj = {
      id: processes.length + 1,
      arrivalTime,
      burstTime,
      priority
    };

    setProcesses([...processes, newProcessObj]);
    setNewProcess({ arrivalTime: '', burstTime: '', priority: '' });
  };

  const removeProcess = (id: number) => {
    const updatedProcesses = processes.filter(p => p.id !== id).map((p, idx) => ({
      ...p,
      id: idx + 1
    }));
    setProcesses(updatedProcesses);
  };

  const handleTimeQuantumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setTimeQuantum(value);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-medium mb-4">Add Process</h3>
        
        {showTimeQuantum && (
          <div className="mb-4">
            <Label htmlFor="timeQuantum">Time Quantum</Label>
            <Input
              id="timeQuantum"
              type="number"
              min="1"
              value={timeQuantum}
              onChange={handleTimeQuantumChange}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Time slice for Round Robin scheduling
            </p>
          </div>
        )}
        
        <div className={`grid grid-cols-1 ${showPriority ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4 mb-4`}>
          <div className="space-y-2">
            <Label htmlFor="arrivalTime">Arrival Time</Label>
            <Input
              id="arrivalTime"
              type="number"
              min="0"
              placeholder="Enter arrival time"
              value={newProcess.arrivalTime}
              onChange={(e) => setNewProcess({ ...newProcess, arrivalTime: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="burstTime">Burst Time</Label>
            <Input
              id="burstTime"
              type="number"
              min="1"
              placeholder="Enter burst time"
              value={newProcess.burstTime}
              onChange={(e) => setNewProcess({ ...newProcess, burstTime: e.target.value })}
            />
          </div>
          {showPriority && (
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Input
                id="priority"
                type="number"
                min="1"
                placeholder="Enter priority"
                value={newProcess.priority}
                onChange={(e) => setNewProcess({ ...newProcess, priority: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Lower value = higher priority
              </p>
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <Button onClick={addProcess}>Add Process</Button>
        </div>
      </div>

      {processes.length > 0 && (
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-4">Process Table</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Process ID</TableHead>
                  <TableHead>Arrival Time</TableHead>
                  <TableHead>Burst Time</TableHead>
                  {showPriority && <TableHead>Priority</TableHead>}
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processes.map((process) => (
                  <TableRow key={process.id}>
                    <TableCell>P{process.id}</TableCell>
                    <TableCell>{process.arrivalTime}</TableCell>
                    <TableCell>{process.burstTime}</TableCell>
                    {showPriority && <TableCell>{process.priority}</TableCell>}
                    <TableCell className="text-right">
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => removeProcess(process.id)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-end mt-4">
            <Button className="gradient-bg" onClick={onCalculate}>
              Visualize
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessForm;
