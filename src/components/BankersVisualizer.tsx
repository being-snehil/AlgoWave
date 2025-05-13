import { useState, useEffect } from 'react';
import { BankersStep } from '@/utils/algorithms/banker';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BankersVisualizerProps {
  safeSequence: number[] | null;
  steps: BankersStep[];
}

const BankersVisualizer = ({ safeSequence, steps }: BankersVisualizerProps) => {
  const [currentStep, setCurrentStep] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animate through the steps
  useEffect(() => {
    if (isAnimating && currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    } else if (isAnimating && currentStep >= steps.length - 1) {
      setIsAnimating(false);
    }
  }, [isAnimating, currentStep, steps.length]);

  const startAnimation = () => {
    setCurrentStep(0);
    setIsAnimating(true);
  };

  const stopAnimation = () => {
    setIsAnimating(false);
  };

  const resetAnimation = () => {
    setIsAnimating(false);
    setCurrentStep(-1);
  };

  const navigateStep = (step: number) => {
    setIsAnimating(false);
    setCurrentStep(step);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Banker's Algorithm Result</CardTitle>
          <CardDescription>
            {safeSequence 
              ? 'A safe sequence was found!' 
              : 'No safe sequence exists - system is in an unsafe state.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {safeSequence ? (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Safe Sequence:</h3>
              <div className="flex items-center gap-2 flex-wrap">
                {safeSequence.map((processId, index) => (
                  <div key={index} className="flex items-center">
                    <span 
                      className={cn(
                        "inline-flex items-center justify-center p-2 rounded-md font-medium",
                        currentStep >= index ? "bg-green-500/20 text-green-600" : "bg-muted text-muted-foreground"
                      )}
                    >
                      P{processId}
                    </span>
                    {index < safeSequence.length - 1 && (
                      <ArrowRight className="mx-1 h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mb-6 flex items-center text-red-600">
              <AlertCircle className="mr-2 h-5 w-5" />
              <span>The system is in an unsafe state and could lead to deadlock!</span>
            </div>
          )}

          <div className="flex gap-2 mb-6">
            <Button 
              onClick={startAnimation} 
              disabled={isAnimating || !safeSequence}
              variant="default"
            >
              Animate Sequence
            </Button>
            <Button 
              onClick={stopAnimation} 
              disabled={!isAnimating}
              variant="outline"
            >
              Pause
            </Button>
            <Button 
              onClick={resetAnimation} 
              disabled={currentStep === -1}
              variant="outline"
            >
              Reset
            </Button>
          </div>

          {/* Step navigation */}
          {safeSequence && steps.length > 0 && (
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {steps.map((step, index) => (
                <Button 
                  key={index}
                  variant={currentStep === index ? "default" : "outline"} 
                  size="sm"
                  onClick={() => navigateStep(index)}
                >
                  Step {index + 1}
                </Button>
              ))}
            </div>
          )}

          {/* Current step visualization */}
          {currentStep >= 0 && currentStep < steps.length && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                Executing Process P{steps[currentStep].processId}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Process Details</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Resource</TableHead>
                        <TableHead>Allocation</TableHead>
                        <TableHead>Max</TableHead>
                        <TableHead>Need</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>A</TableCell>
                        <TableCell>{steps[currentStep].allocation[0]}</TableCell>
                        <TableCell>{steps[currentStep].max[0]}</TableCell>
                        <TableCell>{steps[currentStep].need[0]}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>B</TableCell>
                        <TableCell>{steps[currentStep].allocation[1]}</TableCell>
                        <TableCell>{steps[currentStep].max[1]}</TableCell>
                        <TableCell>{steps[currentStep].need[1]}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>C</TableCell>
                        <TableCell>{steps[currentStep].allocation[2]}</TableCell>
                        <TableCell>{steps[currentStep].max[2]}</TableCell>
                        <TableCell>{steps[currentStep].need[2]}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Resource Changes</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Resource</TableHead>
                        <TableHead>Available Before</TableHead>
                        <TableHead>
                          <span className="flex items-center">
                            <span>Available After</span>
                            <CheckCircle2 className="ml-1 h-4 w-4 text-green-500" />
                          </span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>A</TableCell>
                        <TableCell>{steps[currentStep].availableBefore[0]}</TableCell>
                        <TableCell className="font-medium text-green-600">{steps[currentStep].availableAfter[0]}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>B</TableCell>
                        <TableCell>{steps[currentStep].availableBefore[1]}</TableCell>
                        <TableCell className="font-medium text-green-600">{steps[currentStep].availableAfter[1]}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>C</TableCell>
                        <TableCell>{steps[currentStep].availableBefore[2]}</TableCell>
                        <TableCell className="font-medium text-green-600">{steps[currentStep].availableAfter[2]}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              <div className="p-4 bg-muted rounded-md">
                <p className="text-sm">
                  <span className="font-medium">Step {currentStep + 1}:</span> Process P{steps[currentStep].processId} can safely execute because its resource needs
                  (Need: {steps[currentStep].need.join(', ')}) are satisfied by the available resources
                  (Available: {steps[currentStep].availableBefore.join(', ')}). 
                  After execution, it releases its allocated resources 
                  (Allocation: {steps[currentStep].allocation.join(', ')}), making them available for other processes.
                  The new available resources become {steps[currentStep].availableAfter.join(', ')}.
                </p>
              </div>
            </div>
          )}
          
          {currentStep === -1 && (
            <div className="flex flex-col items-center justify-center h-60 text-center">
              <p className="text-muted-foreground mb-4">
                {safeSequence 
                  ? "Click 'Animate Sequence' to visualize the execution steps" 
                  : "The system cannot proceed safely with the given resource allocation"
                }
              </p>
              {safeSequence ? (
                <CheckCircle2 className="h-16 w-16 text-green-500/50" />
              ) : (
                <AlertCircle className="h-16 w-16 text-red-500/50" />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BankersVisualizer; 