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
  
  if (!isAccessible) {
    return (
      <div className="max-w-6xl mx-auto">
        {/* Warning message */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Please complete previous steps first
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  You need to complete the previous steps in order to access the "{stepName}" feature. Please complete the previous steps first.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Display content but disable interaction */}
        <div className="relative">
          <div className="opacity-60 pointer-events-none">
            {children}
          </div>
          {/* Overlay to prevent interaction */}
          <div className="absolute inset-0 bg-gray-100 bg-opacity-30 z-10"></div>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
};

export default StepGuard; 