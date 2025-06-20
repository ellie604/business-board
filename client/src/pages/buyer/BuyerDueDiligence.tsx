import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { buyerService } from '../../services/buyer';
import ProgressBar from '../../components/ProgressBar';
import StepGuard from '../../components/StepGuard';
import DueDiligenceManager from '../../components/DueDiligenceManager';

const BuyerDueDiligence: React.FC = () => {
  const [progressData, setProgressData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const steps = useMemo(() => [
    'Select Listing',
    'Messages',
    'Non Disclosure',
    'Financial Statement',
    'CBR/CIM',
    'Upload Docs',
    'Purchase Contract',
    'Due Diligence',
    'Pre Close Checklist',
    'Closing Docs',
    'After The Sale'
  ], []);

  // 获取数据的主函数
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // 获取进度数据
      const progressRes = await buyerService.getProgress();
      setProgressData(progressRes.progress);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStepComplete = async () => {
    try {
      // Mark step as completed
      await buyerService.updateStep(7);
      
      // Refresh progress
      const progressRes = await buyerService.getProgress();
      setProgressData(progressRes.progress);
    } catch (error) {
      console.error('Error completing step:', error);
    }
  };

  // Memoize step calculations
  const stepStatus = useMemo(() => {
    if (!progressData) return { stepCompleted: false, currentStepIndex: 0, isStepFinished: false, isCurrentStep: false, isAccessible: false };
    
    const stepCompleted = progressData.steps[7]?.completed || false;
    const currentStepIndex = progressData.currentStep || 0;
    const isStepFinished = stepCompleted || currentStepIndex > 7;
    const isCurrentStep = currentStepIndex === 7;
    const isAccessible = currentStepIndex >= 7;

    console.log('Step status:', { stepCompleted, currentStepIndex, isStepFinished, isCurrentStep, isAccessible });
    return { stepCompleted, currentStepIndex, isStepFinished, isCurrentStep, isAccessible };
  }, [progressData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <StepGuard stepName="Due Diligence">
      <div className="max-w-6xl mx-auto">
        {/* Progress Bar */}
        <ProgressBar currentStep={progressData?.currentStep || 0} steps={steps} />
        
        {/* Step Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Step 8: Due Diligence</h1>
              <p className="text-gray-600 mt-2">Request and download due diligence documents</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Step 8 of 11
              </span>
              {stepStatus.stepCompleted ? (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Finished
                </span>
              ) : stepStatus.isCurrentStep ? (
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

        {/* Debug Information - 仅在开发环境显示 */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-gray-100 rounded-lg p-4 mb-6 text-xs">
            <h3 className="font-bold mb-2">Debug Info:</h3>
            <p>Current Step: {progressData?.currentStep}</p>
            <p>Step 7 Completed: {stepStatus.stepCompleted ? 'Yes' : 'No'}</p>
            <p>Selected Listing: {progressData?.selectedListingId}</p>
          </div>
        )}

        {/* Due Diligence Overview */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-purple-800 mb-4">Due Diligence Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-purple-700 mb-2">Purpose</h3>
              <p className="text-purple-600">Thorough examination of business records and documents</p>
            </div>
            <div>
              <h3 className="font-medium text-purple-700 mb-2">Timeline</h3>
              <p className="text-purple-600">Typically 30-45 days from contract signing</p>
            </div>
            <div>
              <h3 className="font-medium text-purple-700 mb-2">Document Review</h3>
              <p className="text-purple-600">Financial, legal, and operational records</p>
            </div>
            <div>
              <h3 className="font-medium text-purple-700 mb-2">Professional Help</h3>
              <p className="text-purple-600">Consider hiring accountants and attorneys</p>
            </div>
          </div>
        </div>

        {/* Key Areas to Review */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Key Areas to Review</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-medium text-gray-900">Financial Records</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Profit & loss statements, balance sheets, cash flow, tax returns
                </p>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-medium text-gray-900">Legal Documents</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Contracts, leases, licenses, litigation history, compliance records
                </p>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-medium text-gray-900">Operational Data</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Customer lists, supplier agreements, inventory, equipment
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-medium text-gray-900">Human Resources</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Employee agreements, benefit plans, organizational structure
                </p>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-medium text-gray-900">Assets & Liabilities</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Asset valuations, debt obligations, contingent liabilities
                </p>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-medium text-gray-900">Market Position</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Competitive analysis, market share, growth projections
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Due Diligence Manager Component */}
        {progressData?.selectedListingId && progressData?.buyerId && (
          <DueDiligenceManager
            listingId={progressData.selectedListingId}
            buyerId={progressData.buyerId}
            userRole="BUYER"
            userId={progressData.buyerId}
            onStepComplete={handleStepComplete}
            className="shadow-lg"
          />
        )}

        {/* Important Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
          <div className="flex items-start">
            <svg className="h-6 w-6 text-yellow-600 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h4 className="font-medium text-yellow-900">Important</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Due diligence is your opportunity to verify all aspects of the business before finalizing the purchase. 
                Take time to thoroughly review all documents and consider hiring professional advisors. 
                You may have the right to terminate the agreement if significant issues are discovered during this period.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate('/buyer/purchase-contract')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Previous: Purchase Contract
          </button>
          <button
            onClick={() => stepStatus.stepCompleted ? navigate('/buyer/pre-close-checklist') : null}
            disabled={!stepStatus.stepCompleted}
            className={`px-4 py-2 rounded-lg ${
              stepStatus.stepCompleted 
                ? 'bg-purple-600 text-white hover:bg-purple-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Next: Pre Close Checklist
          </button>
        </div>
      </div>
    </StepGuard>
  );
};

export default BuyerDueDiligence; 