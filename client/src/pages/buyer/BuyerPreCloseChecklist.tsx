import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sellerService } from '../../services/seller';
import type { SellerProgress } from '../../services/seller';
import ProgressBar from '../../components/ProgressBar';
import StepGuard from '../../components/StepGuard';

const BuyerPreCloseChecklist: React.FC = () => {
  const [progress, setProgress] = useState<SellerProgress | null>(null);
  const [loading, setLoading] = useState(true);

  const steps = [
    'Home',
    'Contact your agent via messages',
    'Fill out a Non Disclosure agreement online',
    'Fill out a simple financial statement online',
    'Download a CBR or CIM for the business your interested in',
    'Upload documents for loan pre-approval',
    'Download your purchase contract (once we have an accepted offer)',
    'Request & Download Due Diligence documents',
    'Pre Close Checklist: Check off your to do list',
    'Download Closing document once we are closed',
    'After the Sale: Tips to make your transition smoother'
  ];

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const progressRes = await sellerService.getProgress();
        setProgress(progressRes.progress);
      } catch (err) {
        console.error('Failed to fetch progress:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  const stepCompleted = progress?.steps[8]?.completed;
  const currentStepIndex = progress?.currentStep || 0;
  const isCurrentStep = currentStepIndex === 8;
  const isAccessible = currentStepIndex >= 8;

  return (
    <StepGuard stepName="Pre Close Checklist">
      <div className="max-w-6xl mx-auto">
        <ProgressBar currentStep={progress?.currentStep || 0} steps={steps} />
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Step 9: Pre Close Checklist</h1>
              <p className="text-gray-600 mt-2">Check off your to do list. See if others have done theirs</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Step 9 of 11
              </span>
              {stepCompleted ? (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Finished
                </span>
              ) : isCurrentStep ? (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  In Progress
                </span>
              ) : (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                  Not Available
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Buyer Checklist */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">Your Checklist (Buyer)</h2>
            <div className="space-y-3">
              {[
                { task: 'Final loan approval secured', completed: true },
                { task: 'Business license transfer initiated', completed: true },
                { task: 'Insurance policies transferred', completed: false },
                { task: 'Closing funds ready', completed: true },
                { task: 'Final walkthrough scheduled', completed: false }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    className="w-5 h-5 text-blue-600"
                    readOnly
                  />
                  <span className={item.completed ? 'text-green-600' : 'text-gray-600'}>
                    {item.task}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Seller Checklist */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-green-800">Seller Checklist</h2>
            <div className="space-y-3">
              {[
                { task: 'Final financial statements provided', completed: true },
                { task: 'Asset transfer documents prepared', completed: true },
                { task: 'Employee notifications sent', completed: false },
                { task: 'Vendor/supplier notifications', completed: false },
                { task: 'Keys and access cards ready', completed: true }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    item.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                  }`}>
                    {item.completed && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className={item.completed ? 'text-green-600' : 'text-gray-600'}>
                    {item.task}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Progress Summary */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-purple-800 mb-3">Closing Progress Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">3/5</div>
              <div className="text-sm text-gray-600">Your tasks completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">3/5</div>
              <div className="text-sm text-gray-600">Seller tasks completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">3 days</div>
              <div className="text-sm text-gray-600">Until scheduled closing</div>
            </div>
          </div>
        </div>
      </div>
    </StepGuard>
  );
};

export default BuyerPreCloseChecklist; 