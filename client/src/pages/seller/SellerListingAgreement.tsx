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
  const [uploading, setUploading] = useState(false);
  const [downloadMessage, setDownloadMessage] = useState<string>('');
  const [uploadMessage, setUploadMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [uploadMessageType, setUploadMessageType] = useState<'success' | 'error' | ''>('');
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
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
        await refreshUploadedFiles();
      } catch (err) {
        console.error('Failed to fetch progress:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const refreshUploadedFiles = async () => {
    try {
      const dashboardData = await sellerService.getDashboardStats();
      const selectedListingId = dashboardData.stats.selectedListingId;
      
      if (!selectedListingId) return;

      const response = await fetch(`${API_BASE_URL}/seller/listings/${selectedListingId}/documents`, {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        // Filter for signed listing agreements (step 2 uploads)
        const signedAgreements = data.documents?.filter((doc: any) => 
          doc.stepId === 2 && 
          doc.operationType === 'UPLOAD' &&
          (doc.type === 'LISTING_AGREEMENT' || doc.type === 'UPLOADED_DOC')
        ) || [];
        setUploadedFiles(signedAgreements);
      }
    } catch (error) {
      console.error('Error fetching uploaded files:', error);
    }
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      setDownloadMessage('');
      setMessageType('');
      
      // 先获取用户的listing信息
      const progressRes = await sellerService.getProgress();
      const selectedListingId = progressRes.progress?.selectedListingId;
      
      if (!selectedListingId) {
        setDownloadMessage('No listing selected. Please contact your broker or agent.');
        setMessageType('error');
        return;
      }

      // 获取该listing的broker文件 - 使用seller专用的端点
      const documentsResponse = await fetch(`${API_BASE_URL}/seller/listings/${selectedListingId}/broker-documents`, {
        method: 'GET',
        credentials: 'include'
      });
      
      if (!documentsResponse.ok) {
        setDownloadMessage('Please contact broker or agent for available listing agreement.');
        setMessageType('error');
        return;
      }

      const documentsData = await documentsResponse.json();
      const listingAgreements = documentsData.documents?.filter(
        (doc: any) => doc.type === 'LISTING_AGREEMENT'
      );
      
      if (listingAgreements && listingAgreements.length > 0) {
        // 有broker上传的文件，进行下载
        const agreementDoc = listingAgreements[0];
        
        // 下载文件 - 修改下载逻辑避免弹窗阻止
        const link = document.createElement('a');
        link.href = agreementDoc.url;
        link.download = agreementDoc.fileName || 'listing_agreement.pdf';
        // 不使用 target="_blank" 来避免弹窗阻止
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setDownloadMessage('Listing agreement downloaded successfully!');
        setMessageType('success');
      } else {
        // 没有broker上传的文件，显示提示信息
        setDownloadMessage('Please contact broker or agent for available listing agreement.');
        setMessageType('error');
      }
    } catch (err) {
      console.error('Failed to download:', err);
      setDownloadMessage('Please contact broker or agent for available listing agreement.');
      setMessageType('error');
    } finally {
      setDownloading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadMessage('');
      setUploadMessageType('');
      
      // Get seller's selected listing first
      const dashboardData = await sellerService.getDashboardStats();
      const selectedListingId = dashboardData.stats.selectedListingId;
      
      if (!selectedListingId) {
        setUploadMessage('Please select a listing first');
        setUploadMessageType('error');
        return;
      }
      
      // Upload file using real API
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', 'LISTING_AGREEMENT');
      formData.append('stepId', '2'); // Step 2 for listing agreement

      const response = await fetch(`${API_BASE_URL}/seller/listings/${selectedListingId}/documents`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Upload failed: ${errorData.message}`);
      }

      const data = await response.json();
      console.log('Uploaded signed listing agreement:', data.document);
      
      // Refresh the file list from backend
      await refreshUploadedFiles();
      
      // Mark step as completed after successful upload
      await sellerService.updateStep(2);
      
      // Refresh progress
      const progressRes = await sellerService.getProgress();
      setProgress(progressRes.progress);
      
      setUploadMessage('Signed listing agreement uploaded successfully!');
      setUploadMessageType('success');
      
      // Clear the file input
      if (e.target) {
        e.target.value = '';
      }
    } catch (err) {
      console.error('Failed to upload:', err);
      setUploadMessage(`Upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setUploadMessageType('error');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) {
      return;
    }

    try {
      // Get seller's selected listing first
      const dashboardData = await sellerService.getDashboardStats();
      const selectedListingId = dashboardData.stats.selectedListingId;
      
      if (!selectedListingId) {
        alert('No listing selected');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/seller/listings/${selectedListingId}/documents/${fileId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Delete failed: ${errorData.message}`);
      }

      // Refresh file list and progress
      await refreshUploadedFiles();
      const progressRes = await sellerService.getProgress();
      setProgress(progressRes.progress);
      
      alert('File deleted successfully');
    } catch (err) {
      console.error('Failed to delete file:', err);
      alert(`Delete failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const formatFileSize = (bytes: number | null | undefined) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
              <p className="text-gray-600 mt-2">Download, sign, and upload your business listing agreement</p>
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

        {/* Download and Upload Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Download Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">1. Download Agreement</h2>
            
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
                      Checking for agreement...
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
              
              {/* Download Message */}
              {downloadMessage && (
                <div className={`mt-4 p-3 rounded-lg ${
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
            </div>
          </div>

          {/* Upload Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">2. Upload Signed Agreement</h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              
              <h3 className="mt-4 text-lg font-medium text-gray-900">Upload Signed Agreement</h3>
              <p className="mt-2 text-sm text-gray-500">
                After signing the agreement, upload the completed document here
              </p>
              
              <div className="mt-6">
                <label htmlFor="signed-agreement-upload" className="cursor-pointer">
                  <span className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    {uploading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Upload Signed Agreement
                      </>
                    )}
                  </span>
                </label>
                <input
                  id="signed-agreement-upload"
                  type="file"
                  className="sr-only"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
                <p className="text-xs text-gray-500 mt-2">PDF, DOC, DOCX up to 10MB</p>
              </div>
              
              {/* Upload Message */}
              {uploadMessage && (
                <div className={`mt-4 p-3 rounded-lg ${
                  uploadMessageType === 'success' 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <p className={`text-sm ${
                    uploadMessageType === 'success' ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {uploadMessageType === 'success' && '✓ '}
                    {uploadMessageType === 'error' && '⚠ '}
                    {uploadMessage}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Uploaded Signed Agreements</h2>
            <div className="space-y-3">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-3">
                    <div className="text-green-500">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{file.fileName}</p>
                      <p className="text-xs text-gray-500">
                        Uploaded: {new Date(file.uploadedAt).toLocaleDateString()} • {formatFileSize(file.fileSize)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => window.open(file.url, '_blank')}
                      className="p-2 text-green-600 hover:text-green-800 transition-colors"
                      title="View file"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteFile(file.id)}
                      className="p-2 text-red-600 hover:text-red-800 transition-colors"
                      title="Delete file"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Important Notes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
          <div className="flex items-start">
            <svg className="h-6 w-6 text-yellow-600 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h4 className="font-medium text-yellow-900">Important</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Please download, review, sign, and upload the agreement to complete this step. 
                The signed agreement should be uploaded within 48 hours to begin the listing process.
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