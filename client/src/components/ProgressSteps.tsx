import React from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

interface Step {
  title: string;
  completed: boolean;
}

interface ProgressStepsProps {
  steps: Step[];
  type: 'seller' | 'buyer';
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({ steps, type }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Progress Steps</h3>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6">
              {step.completed ? (
                <CheckCircleIcon className="w-6 h-6 text-green-500" />
              ) : (
                <XCircleIcon className="w-6 h-6 text-red-500" />
              )}
            </div>
            <span className={`${step.completed ? 'text-green-700' : 'text-gray-700'} flex-grow`}>
              {step.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressSteps; 