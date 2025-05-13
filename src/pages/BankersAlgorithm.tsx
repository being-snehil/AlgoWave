import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import BankersForm, { BankersProcess } from '@/components/BankersForm';
import BankersVisualizer from '@/components/BankersVisualizer';
import { executeBankersAlgorithm, BankersResult } from '@/utils/algorithms/banker';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';

// Known correct safe sequence based on the example data
const EXPECTED_SEQUENCE = [1, 3, 4, 0, 2];

const BankersAlgorithm = () => {
  const [processes, setProcesses] = useState<BankersProcess[]>([]);
  const [available, setAvailable] = useState<[number, number, number]>([0, 0, 0]);
  const [result, setResult] = useState<BankersResult | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  useEffect(() => {
    if (result && result.safeSequence) {
      // Check if our sequence matches the expected one
      const sequenceMatches = 
        result.safeSequence.length === EXPECTED_SEQUENCE.length &&
        result.safeSequence.every((val, idx) => val === EXPECTED_SEQUENCE[idx]);
      setIsCorrect(sequenceMatches);
      
      // Log sequences for debugging
      console.log("Expected sequence:", EXPECTED_SEQUENCE.map(n => `P${n}`).join(", "));
      console.log("Actual sequence:", result.safeSequence.map(n => `P${n}`).join(", "));
    } else {
      setIsCorrect(null);
    }
  }, [result]);

  const handleCalculate = () => {
    // Ensure we have exactly 5 processes
    if (processes.length !== 5) {
      alert("Banker's Algorithm requires exactly 5 processes (P0 to P4).");
      return;
    }
    
    // Execute the Banker's Algorithm
    const algorithmResult = executeBankersAlgorithm(processes, available);
    setResult(algorithmResult);
  };

  const handleRefresh = () => {
    setRefreshKey(prevKey => prevKey + 1);
    window.location.reload();
  };

  return (
    <div className="container py-10 font-gilroy" key={refreshKey}>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Banker's Algorithm</h1>
          <p className="text-muted-foreground mt-2">
            A deadlock avoidance algorithm that tests for safety by simulating allocation of all resources.
          </p>
        </div>
        {/* <Button variant="outline" onClick={handleRefresh} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button> */}
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-2">About Banker's Algorithm</h2>
          <p className="mb-4">
            Banker's Algorithm is a resource allocation and deadlock avoidance algorithm. It tests for safety by simulating allocation
            of resources to processes up to their maximum. It requires the following data:
          </p>
          <ul className="list-disc list-inside mb-4 text-sm space-y-1">
            <li><strong>Available Resources:</strong> The number of available resources of each type (A, B, C)</li>
            <li><strong>Max Resources:</strong> The maximum number of resources of each type a process may need</li>
            <li><strong>Allocation:</strong> The number of resources of each type currently allocated to each process</li>
            <li><strong>Need:</strong> The number of resources still needed (Max - Allocation)</li>
          </ul>
          <p className="text-sm">
            The algorithm works by finding a "safe sequence" where all processes can finish execution without deadlock.
            It simulates allocating resources to processes and checks if all processes can complete.
          </p>
          <p className="mt-2 text-sm font-medium">Expected Safe Sequence for Example Data: P1, P3, P4, P0, P2</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <BankersForm
            processes={processes}
            setProcesses={setProcesses}
            available={available}
            setAvailable={setAvailable}
            onCalculate={handleCalculate}
          />
        </div>

        <div className="lg:col-span-2">
          {result ? (
            <>
              {isCorrect !== null && (
                <Alert className={`mb-4 ${isCorrect ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'}`}>
                  {isCorrect ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <AlertTitle className="text-green-500">Correct Sequence</AlertTitle>
                      <AlertDescription>
                        The algorithm found the correct safe sequence: P1, P3, P4, P0, P2
                      </AlertDescription>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <AlertTitle className="text-red-500">Incorrect Sequence</AlertTitle>
                      <AlertDescription>
                        The algorithm produced a sequence that doesn't match the expected result.
                        Expected: P1, P3, P4, P0, P2
                      </AlertDescription>
                    </>
                  )}
                </Alert>
              )}
              <BankersVisualizer
                safeSequence={result.safeSequence}
                steps={result.steps}
              />
            </>
          ) : (
            <div className="bg-card rounded-lg p-6 shadow-sm flex flex-col items-center justify-center h-60 text-center">
              {processes.length === 5 ? (
                <>
                  <p className="text-muted-foreground mb-4">
                    Click "Run Banker's Algorithm" to check if a safe sequence exists with the provided data.
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
                </>
              ) : (
                <Alert className="border-amber-500 bg-amber-500/10">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <AlertTitle className="text-amber-500">Required Input</AlertTitle>
                  <AlertDescription>
                    Please add all 5 processes (P0 to P4) to run the Banker's Algorithm simulation.
                    {processes.length > 0 && (
                      <span className="block mt-2">
                        Current progress: {processes.length}/5 processes added
                      </span>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BankersAlgorithm; 