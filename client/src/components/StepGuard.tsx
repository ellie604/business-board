import React from 'react';
import { useLocation } from 'react-router-dom';

interface StepGuardProps {
  children: React.ReactNode;
  stepName: string;
}

const StepGuard: React.FC<StepGuardProps> = ({ children, stepName }) => {
  const location = useLocation();
  const state = location.state as any;
  
  const isAccessible = state?.stepAccessible !== false;
  const stepCompleted = state?.stepCompleted || false;
  const currentStep = state?.currentStep || 0;
  const stepId = state?.stepId;
  
  if (!isAccessible) {
    return (
      <div className="max-w-6xl mx-auto">
        {/* Enhanced warning message */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-yellow-800">
                Step Not Yet Available: {stepName}
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  You are currently viewing <strong>Step {(stepId || 0) + 1}</strong>, but you need to complete the previous steps first to unlock this functionality.
                </p>
                <p className="mt-2">
                  <strong>Current Progress:</strong> You are on Step {currentStep + 1}. Complete Step {currentStep + 1} to unlock Step {(stepId || 0) + 1}.
                </p>
                <p className="mt-2 text-xs">
                  💡 <em>You can view this page to understand what's required, but actions are disabled until you reach this step.</em>
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Display content but disable interaction */}
        <div className="relative">
          <div className="opacity-70 pointer-events-none select-none">
            {children}
          </div>
          {/* Subtle overlay to indicate disabled state */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-50/20 to-yellow-50/40 pointer-events-none"></div>
          
          {/* Floating indicator */}
          <div className="fixed top-20 right-4 bg-yellow-100 border border-yellow-300 rounded-lg p-3 shadow-lg z-50">
            <div className="flex items-center space-x-2">
              <svg className="h-4 w-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-yellow-800">
                Preview Mode
              </span>
            </div>
            <p className="text-xs text-yellow-600 mt-1">
              Complete previous steps to unlock
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
};

export default StepGuard; 