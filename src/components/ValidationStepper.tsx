import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ValidationStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'warning';
  progress: number;
}

interface ValidationStepperProps {
  steps: ValidationStep[];
  currentStep: string;
  onStepSelect: (stepId: string) => void;
}

export const ValidationStepper: React.FC<ValidationStepperProps> = ({
  steps,
  currentStep,
  onStepSelect
}) => {
  return (
    <div className="space-y-4">
      {steps.map((step) => (
        <Card
          key={step.id}
          className={`cursor-pointer transition-colors ${currentStep === step.id ? 'border-blue-500 bg-blue-50' : ''}`}
          onClick={() => onStepSelect(step.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${step.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'}`}
                    style={{ width: `${step.progress}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{step.progress}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};