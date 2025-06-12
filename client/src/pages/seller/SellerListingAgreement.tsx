import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sellerService } from '../../services/seller';
import type { SellerProgress } from '../../services/seller';
import ProgressBar from '../../components/ProgressBar';
import StepGuard from '../../components/StepGuard';
import { API_BASE_URL } from '../../config';

const SellerListingAgreement: React.FC = () => {
  const [progress, setProgress] = useState<SellerProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
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

  const handleDownload = async () => {
    try {
      setDownloading(true);
      // Record the download
      await sellerService.recordStepDownload(2);
      // Update step completion
      await sellerService.updateStep(2);
      
      // 尝试获取broker为当前用户的listing上传的文件
      try {
        // 先获取用户的listing信息
        const progressRes = await sellerService.getProgress();
        const selectedListingId = progressRes.progress?.selectedListingId;
        
        if (selectedListingId) {
          // 获取该listing的broker文件
          const documentsResponse = await fetch(`${API_BASE_URL}/broker/listings/${selectedListingId}/documents`, {
            method: 'GET',
            credentials: 'include'
          });
          
          if (documentsResponse.ok) {
            const documentsData = await documentsResponse.json();
            const listingAgreements = documentsData.documents?.filter(
              (doc: any) => doc.type === 'LISTING_AGREEMENT'
            );
            
            if (listingAgreements && listingAgreements.length > 0) {
              // 下载broker上传的文件
              const agreementDoc = listingAgreements[0];
              const link = document.createElement('a');
              link.href = agreementDoc.url;
              link.download = agreementDoc.fileName;
              link.target = '_blank';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            } else {
              // 如果没有broker上传的文件，提供示例PDF
              await downloadExamplePDF();
            }
          } else {
            await downloadExamplePDF();
          }
        } else {
          await downloadExamplePDF();
        }
      } catch (downloadError) {
        console.error('Download error:', downloadError);
        await downloadExamplePDF();
      }
      
      // Refresh progress
      const progressRes = await sellerService.getProgress();
      setProgress(progressRes.progress);
    } catch (err) {
      console.error('Failed to download:', err);
      alert('Failed to download document. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const downloadExamplePDF = async () => {
    // 创建示例PDF作为备用
    const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length 100 >>
stream
BT
/F1 12 Tf
72 720 Td
(Business Listing Agreement) Tj
0 -20 Td
(This is your listing agreement document.) Tj
0 -20 Td
(Please contact your broker for the official document.) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f
0000000010 00000 n
0000000079 00000 n
0000000173 00000 n
0000000301 00000 n
0000000380 00000 n
trailer
<< /Size 6 /Root 1 0 R >>
startxref
529
%%EOF`;
    
    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'listing_agreement.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  const stepCompleted = progress?.steps[2]?.completed;
  const currentStepIndex = progress?.currentStep || 0;
  const isCurrentStep = currentStepIndex === 2;
  const isAccessible = currentStepIndex >= 2;

  return (
    <StepGuard stepName="Listing Agreement">
      <div className="max-w-6xl mx-auto">
        {/* Progress Bar */}
        <ProgressBar currentStep={progress?.currentStep || 0} steps={steps} />
        
        {/* Step Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Step 3: Listing Agreement</h1>
              <p className="text-gray-600 mt-2">Download and review your business listing agreement</p>
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

        {/* Agreement Overview */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">Listing Agreement Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-blue-700 mb-2">Agreement Type</h3>
              <p className="text-blue-600">Exclusive Business Listing Agreement</p>
            </div>
            <div>
              <h3 className="font-medium text-blue-700 mb-2">Listing Period</h3>
              <p className="text-blue-600">6 months (renewable)</p>
            </div>
            <div>
              <h3 className="font-medium text-blue-700 mb-2">Commission Rate</h3>
              <p className="text-blue-600">10% of final sale price</p>
            </div>
            <div>
              <h3 className="font-medium text-blue-700 mb-2">Marketing Scope</h3>
              <p className="text-blue-600">Multiple listing networks & private databases</p>
            </div>
          </div>
        </div>

        {/* Key Terms */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Key Agreement Terms</h2>
          
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-medium text-gray-900">Exclusive Representation</h3>
              <p className="text-gray-600 text-sm mt-1">
                Elite Business Brokers will serve as your exclusive agent for selling your business during the listing period.
              </p>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-medium text-gray-900">Marketing & Advertising</h3>
              <p className="text-gray-600 text-sm mt-1">
                Your business will be marketed through our network, online platforms, and direct outreach to qualified buyers.
              </p>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-medium text-gray-900">Confidentiality</h3>
              <p className="text-gray-600 text-sm mt-1">
                All business information will be kept strictly confidential. Buyers must sign NDAs before receiving details.
              </p>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-medium text-gray-900">Commission Structure</h3>
              <p className="text-gray-600 text-sm mt-1">
                Commission is due only upon successful closing. No upfront fees or charges.
              </p>
            </div>
          </div>
        </div>

        {/* Download Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Download Agreement</h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            
            <h3 className="mt-4 text-lg font-medium text-gray-900">Business Listing Agreement</h3>
            <p className="mt-2 text-sm text-gray-500">
              Complete agreement document including all terms, conditions, and commission structure
            </p>
            
            <div className="mt-6">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    Download Agreement
                  </>
                )}
              </button>
            </div>
            
            {stepCompleted && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">
                  ✓ Downloaded on {new Date().toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
          <div className="flex items-start">
            <svg className="h-6 w-6 text-yellow-600 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h4 className="font-medium text-yellow-900">Important</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Please review the agreement carefully. If you have any questions or concerns, contact your agent before signing. 
                The signed agreement should be returned within 48 hours to begin the listing process.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate('/seller/messages')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Previous: Messages
          </button>
          <button
            onClick={() => stepCompleted ? navigate('/seller/questionnaire') : null}
            disabled={!stepCompleted}
            className={`px-4 py-2 rounded-lg ${
              stepCompleted 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Next: Questionnaire
          </button>
        </div>
      </div>
    </StepGuard>
  );
};

export default SellerListingAgreement; 