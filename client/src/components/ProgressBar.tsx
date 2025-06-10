import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  steps: string[];
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, steps }) => {
  const getStepColor = (index: number) => {
    if (index < currentStep) {
      return 'bg-green-500 text-white'; // 已完成：绿色
    } else if (index === currentStep) {
      return 'bg-yellow-500 text-white'; // 当前步骤：黄色
    } else {
      return 'bg-gray-300 text-gray-600'; // 未来步骤：灰色
    }
  };

  const progressPercentage = Math.round((currentStep / (steps.length - 1)) * 100);

  return (
    <div className="mb-6">
      <div className="text-center mb-3">
        <h3 className="text-sm font-medium text-gray-700">
          Transaction Progress
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Step {currentStep + 1} of {steps.length}
        </p>
      </div>
      
      {/* 进度条 */}
      <div className="relative">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="h-2 rounded-full transition-all duration-500"
            style={{ 
              width: `${progressPercentage}%`,
              backgroundColor: '#10B981' // 已完成部分始终是绿色
            }}
          ></div>
        </div>
        
        {/* 步骤指示器 */}
        <div className="flex justify-between mt-2">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-medium ${getStepColor(index)} 
                           border-2 border-white shadow-sm`}
              >
                {index < currentStep ? (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              {/* 只在较大屏幕上显示步骤标签 */}
              <span className="hidden lg:block text-xs text-gray-600 mt-1 text-center max-w-16 truncate">
                {step.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* 当前步骤描述 */}
      <div className="mt-3 text-center">
        <p className="text-sm font-medium text-gray-900">
          {steps[currentStep]}
        </p>
      </div>
    </div>
  );
};

export default ProgressBar; 