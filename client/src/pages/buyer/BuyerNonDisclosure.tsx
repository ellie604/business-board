import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sellerService } from '../../services/seller';
import type { SellerProgress } from '../../services/seller';
import ProgressBar from '../../components/ProgressBar';
import StepGuard from '../../components/StepGuard';

const BuyerNonDisclosure: React.FC = () => {
  const [progress, setProgress] = useState<SellerProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [signed, setSigned] = useState(false);
  const navigate = useNavigate();
  
  const steps = [
    'Home',
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
  ];

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const progressRes = await sellerService.getProgress();
        setProgress(progressRes.progress);
        setSigned(progressRes.progress?.steps[2]?.completed || false);
      } catch (err) {
        console.error('Failed to fetch progress:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await sellerService.recordStepDownload(2);
      
      const link = document.createElement('a');
      link.href = '#';
      link.download = 'non_disclosure_agreement.pdf';
      link.click();
    } catch (err) {
      console.error('Failed to download:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleSign = async () => {
    try {
      await sellerService.updateStep(2);
      setSigned(true);
      const progressRes = await sellerService.getProgress();
      setProgress(progressRes.progress);
    } catch (err) {
      console.error('Failed to sign NDA:', err);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  const stepCompleted = progress?.steps[2]?.completed || signed;
  const currentStepIndex = progress?.currentStep || 0;
  const isCurrentStep = currentStepIndex === 2;
  const isAccessible = currentStepIndex >= 2;

  return (
    <StepGuard stepName="Non Disclosure">
      <div className="max-w-6xl mx-auto">
        <ProgressBar currentStep={progress?.currentStep || 0} steps={steps} />
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Step 3: Non Disclosure</h1>
              <p className="text-gray-600 mt-2">Sign the Non-Disclosure Agreement to access business information</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Step 3 of 11
              </span>
              {stepCompleted ? (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Signed
                </span>
              ) : (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  Requires Signature
                </span>
              )}
            </div>
          </div>
        </div>

        {/* NDA Overview */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-purple-800 mb-4">Non-Disclosure Agreement Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-purple-700 mb-2">Purpose</h3>
              <p className="text-purple-600">Protect confidential business information during the evaluation process</p>
            </div>
            <div>
              <h3 className="font-medium text-purple-700 mb-2">Duration</h3>
              <p className="text-purple-600">2 years from signing date</p>
            </div>
            <div>
              <h3 className="font-medium text-purple-700 mb-2">Scope</h3>
              <p className="text-purple-600">All financial, operational, and strategic business information</p>
            </div>
            <div>
              <h3 className="font-medium text-purple-700 mb-2">Penalties</h3>
              <p className="text-purple-600">Legal remedies for breach of confidentiality</p>
            </div>
          </div>
        </div>

        {/* Key Terms */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Key NDA Terms</h2>
          
          <div className="space-y-4">
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-medium text-gray-900">Confidential Information</h3>
              <p className="text-gray-600 text-sm mt-1">
                All financial statements, customer lists, business processes, trade secrets, and proprietary information.
              </p>
            </div>
            
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-medium text-gray-900">Use Restrictions</h3>
              <p className="text-gray-600 text-sm mt-1">
                Information may only be used for evaluating the business acquisition opportunity.
              </p>
            </div>
            
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-medium text-gray-900">Return of Information</h3>
              <p className="text-gray-600 text-sm mt-1">
                All materials must be returned or destroyed if the transaction does not proceed.
              </p>
            </div>
          </div>
        </div>

        {/* NDA Document */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">NDA Document</h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5-8a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2h10z" />
            </svg>
            
            <h3 className="mt-4 text-lg font-medium text-gray-900">Non-Disclosure Agreement</h3>
            <p className="mt-2 text-sm text-gray-500">
              Standard NDA for business acquisition due diligence
            </p>
            
            <div className="mt-6 flex justify-center space-x-4">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download NDA
              </button>
              
              {!signed && (
                <button
                  onClick={handleSign}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Sign Electronically
                </button>
              )}
            </div>
            
            {signed && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">
                  ✓ NDA signed on {new Date().toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
          <div className="flex items-start">
            <svg className="h-6 w-6 text-yellow-600 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h4 className="font-medium text-yellow-900">Important</h4>
              <p className="text-sm text-yellow-700 mt-1">
                By signing this NDA, you agree to maintain strict confidentiality of all business information. 
                Breach of this agreement may result in legal action and damages.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate('/buyer/messages')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Previous: Messages
          </button>
          <button
            onClick={() => navigate('/buyer/financial-statement')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Next: Financial Statement
          </button>
        </div>
      </div>
    </StepGuard>
  );
};

export default BuyerNonDisclosure; 