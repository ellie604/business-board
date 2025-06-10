import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sellerService } from '../../services/seller';
import type { SellerProgress } from '../../services/seller';
import ProgressBar from '../../components/ProgressBar';
import StepGuard from '../../components/StepGuard';

const SellerClosingDocs: React.FC = () => {
  const [progress, setProgress] = useState<SellerProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [signingStatus, setSigningStatus] = useState<'pending' | 'ready' | 'completed'>('ready');
  const navigate = useNavigate();
  
  const steps = [
    'Home',
    'Messages',
    'Listing Agreement',
    'Questionnaire',
    'Financials',
    'Buyer Activity',
    'Purchase Agreement',
    'Due Diligence',
    'Pre Close Checklist',
    'Closing Docs',
    'After The Sale'
  ];

  // Mock closing documents
  const closingDocuments = [
    {
      id: '1',
      name: 'Final Asset Purchase Agreement',
      description: 'Complete executed purchase agreement with all amendments',
      fileName: 'Final_Asset_Purchase_Agreement.pdf',
      status: 'ready',
      required: true,
      signatureRequired: true
    },
    {
      id: '2',
      name: 'Bill of Sale',
      description: 'Official transfer document for business assets',
      fileName: 'Bill_of_Sale.pdf',
      status: 'ready',
      required: true,
      signatureRequired: true
    },
    {
      id: '3',
      name: 'Closing Statement (HUD-1)',
      description: 'Detailed breakdown of all closing costs and settlements',
      fileName: 'Closing_Statement_HUD1.pdf',
      status: 'ready',
      required: true,
      signatureRequired: false
    },
    {
      id: '4',
      name: 'Assignment of Contracts',
      description: 'Transfer of all business contracts to buyer',
      fileName: 'Assignment_of_Contracts.pdf',
      status: 'ready',
      required: true,
      signatureRequired: true
    },
    {
      id: '5',
      name: 'Non-Compete Agreement',
      description: 'Post-sale competition restrictions',
      fileName: 'Non_Compete_Agreement.pdf',
      status: 'ready',
      required: true,
      signatureRequired: true
    },
    {
      id: '6',
      name: 'Key Transfer Receipt',
      description: 'Record of all keys, codes, and access transfers',
      fileName: 'Key_Transfer_Receipt.pdf',
      status: 'ready',
      required: true,
      signatureRequired: true
    },
    {
      id: '7',
      name: 'Employment Transition Agreement',
      description: 'Terms for employee transitions and consulting arrangements',
      fileName: 'Employment_Transition_Agreement.pdf',
      status: 'ready',
      required: false,
      signatureRequired: true
    },
    {
      id: '8',
      name: 'Wire Transfer Authorization',
      description: 'Authorization for final funds transfer',
      fileName: 'Wire_Transfer_Authorization.pdf',
      status: 'ready',
      required: true,
      signatureRequired: true
    }
  ];

  // Mock closing details
  const closingDetails = {
    buyerName: 'Michael Brown',
    company: 'Brown Industries',
    salePrice: 485000,
    closingDate: '2024-02-28',
    closingTime: '2:00 PM EST',
    location: 'SecureTitle Escrow Services',
    address: '123 Business Center Dr, Suite 500',
    escrowOfficer: 'Jennifer Martinez'
  };

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

  const handleDownloadDocument = async (document: any) => {
    try {
      setDownloading(true);
      // Record the download
      await sellerService.recordStepDownload(9);
      
      // Simulate download
      const link = window.document.createElement('a');
      link.href = '#'; // In real app, this would be the actual file URL
      link.download = document.fileName;
      link.click();
      
    } catch (err) {
      console.error('Failed to download:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadAll = async () => {
    try {
      setDownloading(true);
      
      // Simulate downloading all documents
      for (const doc of closingDocuments) {
        const link = window.document.createElement('a');
        link.href = '#';
        link.download = doc.fileName;
        link.click();
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      await sellerService.updateStep(9);
      
      // Refresh progress
      const progressRes = await sellerService.getProgress();
      setProgress(progressRes.progress);
    } catch (err) {
      console.error('Failed to download:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleCompleteClosing = async () => {
    try {
      setSigningStatus('completed');
      await sellerService.updateStep(9);
      
      // Refresh progress
      const progressRes = await sellerService.getProgress();
      setProgress(progressRes.progress);
    } catch (err) {
      console.error('Failed to complete closing:', err);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  const stepCompleted = progress?.steps[9]?.completed || signingStatus === 'completed';
  const currentStepIndex = progress?.currentStep || 0;
  const isCurrentStep = currentStepIndex === 9;
  const isAccessible = currentStepIndex >= 9;

  return (
    <StepGuard stepName="Closing Docs">
      <div className="max-w-6xl mx-auto">
        {/* Progress Bar */}
        <ProgressBar currentStep={progress?.currentStep || 0} steps={steps} />
        
        {/* Step Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Step 10: Closing Docs</h1>
              <p className="text-gray-600 mt-2">Review, sign, and download your final closing documents</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Step 10 of 11
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

        {/* Closing Details */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <svg className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 9a2 2 0 11-4 0 2 2 0 014 0zm8 0a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-blue-800">Closing Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-blue-600">Closing Date & Time</p>
              <p className="font-medium text-blue-800">{closingDetails.closingDate}</p>
              <p className="text-sm text-blue-700">{closingDetails.closingTime}</p>
            </div>
            <div>
              <p className="text-sm text-blue-600">Buyer</p>
              <p className="font-medium text-blue-800">{closingDetails.buyerName}</p>
              <p className="text-sm text-blue-700">{closingDetails.company}</p>
            </div>
            <div>
              <p className="text-sm text-blue-600">Location</p>
              <p className="font-medium text-blue-800">{closingDetails.location}</p>
              <p className="text-sm text-blue-700">{closingDetails.address}</p>
            </div>
            <div>
              <p className="text-sm text-blue-600">Escrow Officer</p>
              <p className="font-medium text-blue-800">{closingDetails.escrowOfficer}</p>
              <p className="text-sm text-blue-700">Lead Closing Agent</p>
            </div>
          </div>
        </div>

        {/* Document Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Document Actions</h2>
            <div className="flex space-x-4">
              <button
                onClick={handleDownloadAll}
                disabled={downloading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {downloading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Downloading...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download All Documents
                  </>
                )}
              </button>
              
              {!stepCompleted && (
                <button
                  onClick={handleCompleteClosing}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Complete Closing
                </button>
              )}
            </div>
          </div>

          {stepCompleted && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <svg className="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-medium text-green-800">Closing Completed Successfully!</p>
              </div>
              <p className="text-sm text-green-700 mt-1">
                All documents have been signed and executed. Sale proceeds will be transferred within 24 hours.
              </p>
            </div>
          )}
        </div>

        {/* Document List */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-6">Closing Documents</h2>
          
          <div className="space-y-4">
            {closingDocuments.map((document) => (
              <div key={document.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium text-gray-900">{document.name}</h3>
                      <div className="flex space-x-2">
                        {document.required && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                            Required
                          </span>
                        )}
                        {document.signatureRequired && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                            Signature Required
                          </span>
                        )}
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          document.status === 'ready' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {document.status === 'ready' ? 'Ready' : 'Pending'}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{document.description}</p>
                    <p className="text-xs text-gray-500">{document.fileName}</p>
                  </div>
                  
                  <div className="ml-4 flex space-x-2">
                    <button
                      onClick={() => handleDownloadDocument(document)}
                      disabled={downloading || document.status !== 'ready'}
                      className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center text-sm"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download
                    </button>
                    
                    {document.signatureRequired && (
                      <button
                        disabled={document.status !== 'ready' || stepCompleted}
                        className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 flex items-center text-sm"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        {stepCompleted ? 'Signed' : 'Sign'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Important Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <svg className="h-6 w-6 text-yellow-600 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h4 className="font-medium text-yellow-900">Closing Day Instructions</h4>
              <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                <li>• Arrive 15 minutes early to the closing location</li>
                <li>• Bring government-issued photo ID</li>
                <li>• Review all documents carefully before signing</li>
                <li>• Ask questions if anything is unclear</li>
                <li>• Keep copies of all signed documents for your records</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate('/seller/pre-close-checklist')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Previous: Pre Close Checklist
          </button>
          <button
            onClick={() => navigate('/seller/after-sale')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Next: After The Sale
          </button>
        </div>
      </div>
    </StepGuard>
  );
};

export default SellerClosingDocs; 