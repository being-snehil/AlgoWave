import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

export interface BankersProcess {
  id: number;
  allocation: [number, number, number]; // Resources A, B, C
  max: [number, number, number]; // Max need of resources A, B, C
}

interface BankersFormProps {
  processes: BankersProcess[];
  setProcesses: (processes: BankersProcess[]) => void;
  available: [number, number, number]; // Available resources A, B, C
  setAvailable: (available: [number, number, number]) => void;
  onCalculate: () => void;
}

// Default values from the C++ example
const defaultAllocation: [number, number, number][] = [
  [0, 1, 0], // P0
  [2, 0, 0], // P1
  [3, 0, 2], // P2
  [2, 1, 1], // P3
  [0, 0, 2]  // P4
];

const defaultMax: [number, number, number][] = [
  [7, 5, 3], // P0
  [3, 2, 2], // P1
  [9, 0, 2], // P2
  [2, 2, 2], // P3
  [4, 3, 3]  // P4
];

const defaultAvailable: [number, number, number] = [3, 3, 2];

const BankersForm = ({
  processes,
  setProcesses,
  available,
  setAvailable,
  onCalculate
}: BankersFormProps) => {
  const { toast } = useToast();
  const [newProcess, setNewProcess] = useState<{
    allocationA: string;
    allocationB: string;
    allocationC: string;
    maxA: string;
    maxB: string;
    maxC: string;
    availableA: string;
    availableB: string;
    availableC: string;
  }>({
    allocationA: '',
    allocationB: '',
    allocationC: '',
    maxA: '',
    maxB: '',
    maxC: '',
    availableA: available[0].toString(),
    availableB: available[1].toString(),
    availableC: available[2].toString(),
  });

  const addProcess = () => {
    // Validate inputs
    if (
      !newProcess.allocationA || !newProcess.allocationB || !newProcess.allocationC ||
      !newProcess.maxA || !newProcess.maxB || !newProcess.maxC
    ) {
      toast({
        title: "Validation Error",
        description: "Please enter all allocation and max values.",
        variant: "destructive"
      });
      return;
    }

    const allocationA = parseInt(newProcess.allocationA);
    const allocationB = parseInt(newProcess.allocationB);
    const allocationC = parseInt(newProcess.allocationC);
    const maxA = parseInt(newProcess.maxA);
    const maxB = parseInt(newProcess.maxB);
    const maxC = parseInt(newProcess.maxC);

    if (
      isNaN(allocationA) || isNaN(allocationB) || isNaN(allocationC) ||
      isNaN(maxA) || isNaN(maxB) || isNaN(maxC) ||
      allocationA < 0 || allocationB < 0 || allocationC < 0 ||
      maxA < 0 || maxB < 0 || maxC < 0
    ) {
      toast({
        title: "Validation Error",
        description: "All values must be non-negative integers.",
        variant: "destructive"
      });
      return;
    }

    // Check if max >= allocation for each resource
    if (maxA < allocationA || maxB < allocationB || maxC < allocationC) {
      toast({
        title: "Validation Error",
        description: "Max values must be greater than or equal to allocation values.",
        variant: "destructive"
      });
      return;
    }

    // If this is process P0, also collect available resources
    if (processes.length === 0) {
      if (!newProcess.availableA || !newProcess.availableB || !newProcess.availableC) {
        toast({
          title: "Validation Error",
          description: "Please enter available resources for P0.",
          variant: "destructive"
        });
        return;
      }

      const availableA = parseInt(newProcess.availableA);
      const availableB = parseInt(newProcess.availableB);
      const availableC = parseInt(newProcess.availableC);

      if (
        isNaN(availableA) || isNaN(availableB) || isNaN(availableC) ||
        availableA < 0 || availableB < 0 || availableC < 0
      ) {
        toast({
          title: "Validation Error",
          description: "Available resources must be non-negative integers.",
          variant: "destructive"
        });
        return;
      }

      setAvailable([availableA, availableB, availableC]);
    }

    const newProcessObj: BankersProcess = {
      id: processes.length,
      allocation: [allocationA, allocationB, allocationC],
      max: [maxA, maxB, maxC]
    };

    setProcesses([...processes, newProcessObj]);
    
    // Reset input fields but keep Available if more processes needed
    setNewProcess({
      allocationA: '',
      allocationB: '',
      allocationC: '',
      maxA: '',
      maxB: '',
      maxC: '',
      availableA: newProcess.availableA,
      availableB: newProcess.availableB,
      availableC: newProcess.availableC,
    });
  };

  const removeProcess = (id: number) => {
    // If removing P0, also reset available resources
    if (id === 0) {
      setAvailable([0, 0, 0]);
    }
    
    const updatedProcesses = processes.filter(p => p.id !== id);
    // Reindex process IDs
    const reindexedProcesses = updatedProcesses.map((p, idx) => ({
      ...p,
      id: idx
    }));
    
    setProcesses(reindexedProcesses);
  };

  const loadExampleData = () => {
    // Clear existing processes
    setProcesses([]);

    // Set example available resources
    setAvailable(defaultAvailable);

    // Add all five processes with default data
    for (let i = 0; i < 5; i++) {
      setProcesses(prev => [
        ...prev,
        {
          id: i,
          allocation: defaultAllocation[i],
          max: defaultMax[i]
        }
      ]);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Banker's Algorithm Input</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={loadExampleData}
              disabled={processes.length > 0}
            >
              Load Example
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-2">
                <Label htmlFor="allocationA">Allocation A</Label>
                <Input
                  id="allocationA"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={newProcess.allocationA}
                  onChange={(e) => setNewProcess({ ...newProcess, allocationA: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="allocationB">Allocation B</Label>
                <Input
                  id="allocationB"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={newProcess.allocationB}
                  onChange={(e) => setNewProcess({ ...newProcess, allocationB: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="allocationC">Allocation C</Label>
                <Input
                  id="allocationC"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={newProcess.allocationC}
                  onChange={(e) => setNewProcess({ ...newProcess, allocationC: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-2">
                <Label htmlFor="maxA">Max Need A</Label>
                <Input
                  id="maxA"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={newProcess.maxA}
                  onChange={(e) => setNewProcess({ ...newProcess, maxA: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxB">Max Need B</Label>
                <Input
                  id="maxB"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={newProcess.maxB}
                  onChange={(e) => setNewProcess({ ...newProcess, maxB: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxC">Max Need C</Label>
                <Input
                  id="maxC"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={newProcess.maxC}
                  onChange={(e) => setNewProcess({ ...newProcess, maxC: e.target.value })}
                />
              </div>
            </div>

            {processes.length === 0 && (
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="availableA">Available A</Label>
                  <Input
                    id="availableA"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={newProcess.availableA}
                    onChange={(e) => setNewProcess({ ...newProcess, availableA: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="availableB">Available B</Label>
                  <Input
                    id="availableB"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={newProcess.availableB}
                    onChange={(e) => setNewProcess({ ...newProcess, availableB: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="availableC">Available C</Label>
                  <Input
                    id="availableC"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={newProcess.availableC}
                    onChange={(e) => setNewProcess({ ...newProcess, availableC: e.target.value })}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {processes.length === 0 
                ? "Adding P0 (include Available resources)" 
                : `Adding P${processes.length}`}
              {processes.length >= 5 && " (Maximum 5 processes)"}
            </div>
            <Button 
              onClick={addProcess}
              disabled={processes.length >= 5}
            >
              Add Process
            </Button>
          </div>
        </CardContent>
      </Card>

      {processes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Process Table</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Process</TableHead>
                    <TableHead>Allocation (A,B,C)</TableHead>
                    <TableHead>Max (A,B,C)</TableHead>
                    <TableHead>Need (A,B,C)</TableHead>
                    {processes.length > 0 && processes[0].id === 0 && (
                      <TableHead>Available (A,B,C)</TableHead>
                    )}
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processes.map((process) => (
                    <TableRow key={process.id}>
                      <TableCell>P{process.id}</TableCell>
                      <TableCell>{process.allocation.join(', ')}</TableCell>
                      <TableCell>{process.max.join(', ')}</TableCell>
                      <TableCell>
                        {[0, 1, 2].map(i => process.max[i] - process.allocation[i]).join(', ')}
                      </TableCell>
                      {process.id === 0 && (
                        <TableCell>{available.join(', ')}</TableCell>
                      )}
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
            
            {processes.length === 5 && (
              <div className="flex justify-end mt-4">
                <Button onClick={onCalculate}>
                  Run Banker's Algorithm
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BankersForm; 