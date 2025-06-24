import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buyerService } from '../../services/buyer';
import type { BuyerProgress } from '../../services/buyer';
import ProgressBar from '../../components/ProgressBar';
import StepGuard from '../../components/StepGuard';
import { API_BASE_URL } from '../../config';

const BuyerClosingDocs: React.FC = () => {
  const [progress, setProgress] = useState<BuyerProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [downloadMessage, setDownloadMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [closingDocsAvailable, setClosingDocsAvailable] = useState(false);
  const [availableClosingDocs, setAvailableClosingDocs] = useState<any[]>([]);
  const [currentListing, setCurrentListing] = useState<any>(null);
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

  // Mock closing details
  const closingDetails = {
    sellerName: 'John Smith',
    company: 'Smith Business Solutions',
    salePrice: 485000,
    closingDate: '2024-02-28',
    closingTime: '2:00 PM EST',
    location: 'SecureTitle Escrow Services',
    address: '123 Business Center Dr, Suite 500',
    escrowOfficer: 'Jennifer Martinez'
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const progressRes = await buyerService.getProgress();
        setProgress(progressRes.progress);
        
        // Get current listing
        const listingRes = await buyerService.getCurrentListing();
        setCurrentListing(listingRes.listing);
        
        // Check if closing documents are available
        await checkClosingDocsAvailability(listingRes.listing?.id);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const checkClosingDocsAvailability = async (selectedListingId?: string | null) => {
    if (!selectedListingId) {
      setClosingDocsAvailable(false);
      return;
    }

    try {
      // Get broker/agent provided documents for this listing
      const documentsResponse = await fetch(`${API_BASE_URL}/buyer/listings/${selectedListingId}/agent-documents`, {
        method: 'GET',
        credentials: 'include'
      });
      
      if (documentsResponse.ok) {
        const documentsData = await documentsResponse.json();
        
        // Look for closing documents
        const closingDocuments = documentsData.documents?.filter((doc: any) => {
          // Check document type
          const typeMatches = [
            'CLOSING_DOCS', 
            'CLOSING_DOCUMENTS',
            'UPLOADED_DOC'
          ].includes(doc.type);
          
          // Check file name for closing-related keywords
          const fileName = (doc.fileName || '').toLowerCase();
          const nameMatches = fileName.includes('closing') || 
                             fileName.includes('close') || 
                             fileName.includes('final');
          
          // If type is CLOSING_DOCS or CLOSING_DOCUMENTS, direct match
          if (doc.type === 'CLOSING_DOCS' || doc.type === 'CLOSING_DOCUMENTS') {
            return true;
          }
          
          // If type is UPLOADED_DOC, also check filename
          if (doc.type === 'UPLOADED_DOC' && nameMatches) {
            return true;
          }
          
          return false;
        });
        
        console.log('Closing docs check:', {
          allDocuments: documentsData.documents,
          filteredClosingDocs: closingDocuments
        });
        
        if (closingDocuments && closingDocuments.length > 0) {
          // Prioritize broker uploaded files, then agent files
          const brokerDocs = closingDocuments.filter((doc: any) => doc.uploader?.role === 'BROKER');
          const agentDocs = closingDocuments.filter((doc: any) => doc.uploader?.role === 'AGENT');
          
          const selectedDocs = brokerDocs.length > 0 ? brokerDocs : agentDocs;
          
          console.log('Selected closing documents:', selectedDocs);
          
          setClosingDocsAvailable(true);
          setAvailableClosingDocs(selectedDocs);
        } else {
          console.log('No closing documents found');
          setClosingDocsAvailable(false);
          setAvailableClosingDocs([]);
        }
      } else {
        console.error('Failed to fetch documents:', documentsResponse.status);
        setClosingDocsAvailable(false);
        setAvailableClosingDocs([]);
      }
    } catch (error) {
      console.error('Error checking closing docs availability:', error);
      setClosingDocsAvailable(false);
      setAvailableClosingDocs([]);
    }
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      setDownloadMessage('');
      setMessageType('');
      
      if (!currentListing) {
        setDownloadMessage('No listing selected. Please contact your broker or agent.');
        setMessageType('error');
        return;
      }

      if (!closingDocsAvailable || availableClosingDocs.length === 0) {
        setDownloadMessage('Closing documents not available yet. Nothing will happen when clicked until the closing documents are attached by the broker after the sale.');
        setMessageType('error');
        return;
      }

      // Record the download and update step completion for buyer
      // For buyer, we'll use the updateStep method to mark step 9 as completed
      await buyerService.updateStep(9, true);
      
      // Download all available closing documents
      for (const doc of availableClosingDocs) {
        const link = document.createElement('a');
        link.href = doc.url;
        link.download = doc.fileName || 'closing_document.pdf';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      setDownloadMessage('Your Documents are downloading. Please check your downloads folder after the download is complete. Thank You!');
      setMessageType('success');
      
      // Refresh progress
      const newProgressRes = await buyerService.getProgress();
      setProgress(newProgressRes.progress);
    } catch (err) {
      console.error('Failed to download:', err);
      setDownloadMessage('Failed to download closing documents. Please try again or contact your broker/agent.');
      setMessageType('error');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  const stepCompleted = progress?.steps[9]?.completed;
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
              <p className="text-gray-600 mt-2">Download your final closing documents</p>
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
                closingDocsAvailable ? (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Documents Ready
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    In Progress
                  </span>
                )
              ) : (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                  Not Available
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-6">Download Closing Documents</h2>
            
            <div className="max-w-2xl mx-auto mb-8">
              <p className="text-gray-700 mb-4">
                This will just be a download button. When clicked it will download the Closing Documents.
              </p>
              <p className="text-gray-600 text-sm">
                Nothing will happen when clicked until the closing documents are attached by the broker after the sale.
              </p>
            </div>

            {closingDocsAvailable ? (
              <>
                {/* Available Documents */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-medium text-blue-900 mb-4">Available Closing Documents</h3>
                  <div className="space-y-2">
                    {availableClosingDocs.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-blue-800">{doc.fileName || 'Closing Document'}</span>
                        {doc.uploader && (
                          <span className="text-blue-600">
                            Provided by: {doc.uploader.name} ({doc.uploader.role})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Download Button */}
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {downloading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download Closing Documents
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                {/* No Documents Available */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 mb-6">
                  <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Closing Documents Not Available Yet</h3>
                  <p className="text-gray-600 mb-6">
                    Your closing documents will be available here once they are prepared and uploaded by your broker after the sale.
                  </p>
                  
                  {/* Disabled Download Button */}
                  <button
                    disabled
                    className="inline-flex items-center px-8 py-4 bg-gray-300 text-gray-500 text-lg font-medium rounded-lg cursor-not-allowed"
                  >
                    <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Closing Documents
                  </button>
                </div>
              </>
            )}

            {/* Download Message */}
            {downloadMessage && (
              <div className={`mt-6 p-4 rounded-lg ${
                messageType === 'success' 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <p className={`text-sm ${
                  messageType === 'success' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {messageType === 'success' && '✓ '}
                  {messageType === 'error' && '⚠ '}
                  {downloadMessage}
                </p>
              </div>
            )}
            
            {stepCompleted && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">
                  ✓ Downloaded on {new Date().toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Important Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
          <div className="flex items-start">
            <svg className="h-6 w-6 text-yellow-600 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h4 className="font-medium text-yellow-900">Important Note</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Your closing documents will only be available after your purchase has been completed and your broker has finalized all paperwork. 
                Keep copies of all documents for your records.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate('/buyer/pre-close-checklist')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Previous: Pre Close Checklist
          </button>
          <button
            onClick={() => navigate('/buyer/after-sale')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Next: After The Sale
          </button>
        </div>
      </div>
    </StepGuard>
  );
};

export default BuyerClosingDocs; 