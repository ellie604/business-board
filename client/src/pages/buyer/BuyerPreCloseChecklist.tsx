import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buyerService } from '../../services/buyer';
import type { BuyerProgress } from '../../services/buyer';
import ProgressBar from '../../components/ProgressBar';
import StepGuard from '../../components/StepGuard';
import PreCloseChecklist from '../../components/PreCloseChecklist';

const BuyerPreCloseChecklist: React.FC = () => {
  const [progress, setProgress] = useState<BuyerProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentListing, setCurrentListing] = useState<any>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const navigate = useNavigate();
  
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
    const fetchData = async () => {
      try {
        const progressRes = await buyerService.getProgress();
        setProgress(progressRes.progress);
        
        // Get current listing
        const listingRes = await buyerService.getCurrentListing();
        setCurrentListing(listingRes.listing);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMarkAsFinished = async () => {
    setIsCompleting(true);
    try {
      // For buyer, we'll use updateStep to mark step 8 as completed
      // This is a simplified version - in a full implementation, you might want
      // specific logic for marking the pre-close checklist step as complete
      if (stepCompleted) {
        // If currently completed, we could implement mark as incomplete logic here
        alert('Step is already completed.');
      } else {
        // Mark step 8 as completed
        await buyerService.updateStep(8);
        alert('Pre-Close Checklist marked as completed successfully!');
      }
      
      // Refresh progress
      const progressRes = await buyerService.getProgress();
      setProgress(progressRes.progress);
    } catch (err) {
      console.error('Failed to toggle step completion:', err);
      alert('Failed to update step status. Please try again.');
    } finally {
      setIsCompleting(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  const stepCompleted = progress?.steps[8]?.completed;
  const currentStepIndex = progress?.currentStep || 0;
  const isCurrentStep = currentStepIndex === 8;
  const isAccessible = currentStepIndex >= 8;

  return (
    <StepGuard stepName="Pre Close Checklist">
      <div className="max-w-6xl mx-auto">
        {/* Progress Bar */}
        <ProgressBar currentStep={progress?.currentStep || 0} steps={steps} />
        
        {/* Step Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Step 9: Pre Close Checklist</h1>
              <p className="text-gray-600 mt-2">Complete all required tasks before the closing date</p>
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
              ) : isAccessible ? (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  Available - Click "Mark as Finished" below
                </span>
              ) : (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                  Not Available
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-900">Debug Info:</h4>
            <p className="text-sm text-gray-700">Current Step: {currentStepIndex}</p>
            <p className="text-sm text-gray-700">Step 8 Completed: {stepCompleted ? 'Yes' : 'No'}</p>
            <p className="text-sm text-gray-700">Is Accessible: {isAccessible ? 'Yes' : 'No'}</p>
            <p className="text-sm text-gray-700">Show Button: {(currentListing && !stepCompleted && isAccessible) ? 'Yes' : 'No'}</p>
          </div>
        )}

        {/* Closing Timeline */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <svg className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-blue-800">Closing Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-blue-600">Scheduled Closing Date</p>
              <p className="font-medium text-blue-800">TBD</p>
            </div>
            <div>
              <p className="text-sm text-blue-600">Current Listing</p>
              <p className="font-medium text-blue-800">{currentListing?.title || 'No listing selected'}</p>
            </div>
            <div>
              <p className="text-sm text-blue-600">Closing Location</p>
              <p className="font-medium text-blue-800">TBD</p>
            </div>
          </div>
        </div>

        {/* Pre-Close Checklist Component */}
        {currentListing ? (
          <PreCloseChecklist
            listingId={currentListing.id}
            userRole="BUYER"
            className="mb-6"
          />
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <div className="flex items-center">
              <svg className="h-6 w-6 text-yellow-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h4 className="font-medium text-yellow-900">No Listing Selected</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Please select a listing first to access the pre-close checklist.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Manual Completion Section - Show when step is accessible */}
        {currentListing && isAccessible && (
          <div className={`rounded-lg shadow-md p-6 mb-6 border-2 ${
            stepCompleted 
              ? 'bg-green-50 border-green-200' 
              : 'bg-white border-orange-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-lg font-semibold ${
                  stepCompleted ? 'text-green-900' : 'text-gray-900'
                }`}>
                  {stepCompleted ? 'Step Completed' : 'Mark Step as Complete'}
                </h3>
                <p className={`mt-1 ${
                  stepCompleted ? 'text-green-700' : 'text-gray-600'
                }`}>
                  {stepCompleted 
                    ? 'You have successfully completed the Pre-Close Checklist step.'
                    : 'Once you have reviewed and completed all checklist items above, click the button below to mark this step as finished.'
                  }
                </p>
                {!stepCompleted && (
                  <p className="text-sm text-orange-600 mt-2 font-medium">
                    ⚠️ This step requires manual completion by clicking the button below.
                  </p>
                )}
              </div>
              {!stepCompleted && (
                <button
                  onClick={handleMarkAsFinished}
                  disabled={isCompleting}
                  className="px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-lg font-semibold bg-green-600 text-white hover:bg-green-700"
                >
                  {isCompleting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Marking Complete...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Mark as Complete
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Important Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
          <div className="flex items-start">
            <svg className="h-6 w-6 text-yellow-600 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h4 className="font-medium text-yellow-900">Critical Deadline</h4>
              <p className="text-sm text-yellow-700 mt-1">
                All required tasks must be completed before the closing date. This checklist allows 
                real-time collaboration between you, the seller, and your agent/broker. 
                Contact your agent immediately if you need assistance with any tasks.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate('/buyer/due-diligence')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Previous: Due Diligence
          </button>
          <button
            onClick={() => navigate('/buyer/closing-docs')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Next: Closing Docs
          </button>
        </div>
      </div>
    </StepGuard>
  );
};

export default BuyerPreCloseChecklist; 