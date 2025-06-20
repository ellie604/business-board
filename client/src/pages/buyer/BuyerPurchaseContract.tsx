import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { buyerService } from '../../services/buyer';
import ProgressBar from '../../components/ProgressBar';
import StepGuard from '../../components/StepGuard';
import { API_BASE_URL } from '../../config';

const BuyerPurchaseContract: React.FC = () => {
  const [downloading, setDownloading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [downloadMessage, setDownloadMessage] = useState<string>('');
  const [uploadMessage, setUploadMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [uploadMessageType, setUploadMessageType] = useState<'success' | 'error' | ''>('');
  const [progressData, setProgressData] = useState<any>(null);
  const [contractDocuments, setContractDocuments] = useState<any[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [documentsLoading, setDocumentsLoading] = useState(false);
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

      // 如果有选中的listing，获取购买合同文档和已上传文件
      if (progressRes.progress?.selectedListingId) {
        setDocumentsLoading(true);
        
        // 获取broker/agent上传的购买合同文档
        const response = await fetch(`${API_BASE_URL}/buyer/listings/${progressRes.progress.selectedListingId}/agent-documents`, {
          method: 'GET',
          credentials: 'include'
        });
        
        if (response.ok) {
          const documentsData = await response.json();
          console.log('=== Debug: Agent Purchase Contract Documents Response ===');
          console.log('Full response:', documentsData);
          console.log('Documents array:', documentsData.documents);
          
          const contractDocuments = documentsData.documents?.filter(
            (doc: any) => doc.type === 'PURCHASE_CONTRACT'
          ) || [];
          
          console.log('Filtered Purchase Contract documents:', contractDocuments);
          console.log('Contract documents URLs:', contractDocuments.map((doc: any) => ({ id: doc.id, url: doc.url, fileName: doc.fileName })));
          
          setContractDocuments(contractDocuments);
        } else {
          console.error('Failed to fetch documents:', response.status, response.statusText);
          setContractDocuments([]);
        }

        // 获取buyer已上传的签完字的购买合同文件
        await refreshUploadedFiles(progressRes.progress.selectedListingId);
        setDocumentsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setContractDocuments([]);
      setDocumentsLoading(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshUploadedFiles = useCallback(async (selectedListingId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/buyer/listings/${selectedListingId}/documents`, {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        // Filter for signed purchase contract uploads (step 6 uploads)
        const signedContracts = data.documents?.filter((doc: any) => 
          doc.stepId === 6 && 
          doc.operationType === 'UPLOAD' &&
          (doc.type === 'PURCHASE_CONTRACT' || doc.type === 'UPLOADED_DOC')
        ) || [];
        setUploadedFiles(signedContracts);
      }
    } catch (error) {
      console.error('Error fetching uploaded files:', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const downloadContractFile = (contractDoc: any) => {
    try {
      // 检查文件URL是否有效
      if (!contractDoc.url) {
        setDownloadMessage('File URL not available');
        setMessageType('error');
        return;
      }

      // 创建下载链接
      const link = document.createElement('a');
      link.href = contractDoc.url;
      link.download = contractDoc.fileName || 'Purchase_Contract.pdf';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // 尝试下载
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // 记录下载到数据库
      recordDownload(contractDoc);
      
      setDownloadMessage('Purchase Contract downloaded successfully!');
      setMessageType('success');
    } catch (error) {
      console.error('Download error:', error);
      setDownloadMessage('Download failed. Please try again.');
      setMessageType('error');
    }
  };

  const recordDownload = async (contractDoc: any) => {
    try {
      if (progressData?.selectedListingId) {
        // 使用现有的download API来记录下载
        const response = await fetch(`${API_BASE_URL}/buyer/download-agent-document/${contractDoc.id}`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ stepId: 6 }),
        });
        
        if (!response.ok) {
          console.error('Failed to record download');
        }
      }
    } catch (error) {
      console.error('Failed to record download:', error);
      // 不影响下载流程，静默处理错误
    }
  };

  const handleDownload = useCallback(async () => {
    try {
      setDownloading(true);
      setDownloadMessage('');
      setMessageType('');
      
      if (!contractDocuments || contractDocuments.length === 0) {
        setDownloadMessage('No Purchase Contract available for download');
        setMessageType('error');
        return;
      }

      downloadContractFile(contractDocuments[0]);
      
    } catch (error: any) {
      console.error('Download error:', error);
      setDownloadMessage(error.message || 'Download failed');
      setMessageType('error');
    } finally {
      setDownloading(false);
    }
  }, [contractDocuments]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadMessage('');
      setUploadMessageType('');
      
      if (!progressData?.selectedListingId) {
        setUploadMessage('Please select a listing first');
        setUploadMessageType('error');
        return;
      }
      
      // Upload file using real API
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', 'PURCHASE_CONTRACT');
      formData.append('stepId', '6'); // Step 6 for Purchase Contract

      const response = await fetch(`${API_BASE_URL}/buyer/listings/${progressData.selectedListingId}/documents`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Upload failed: ${errorData.message}`);
      }

      const data = await response.json();
      console.log('Uploaded signed purchase contract:', data.document);
      
      // Refresh the file list from backend
      await refreshUploadedFiles(progressData.selectedListingId);
      
      // Mark step as completed after successful upload
      await buyerService.updateStep(6);
      
      // Refresh progress
      const progressRes = await buyerService.getProgress();
      setProgressData(progressRes.progress);
      
      setUploadMessage('Signed Purchase Contract uploaded successfully!');
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
      if (!progressData?.selectedListingId) {
        alert('No listing selected');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/buyer/listings/${progressData.selectedListingId}/documents/${fileId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Delete failed: ${errorData.message}`);
      }

      // Refresh file list and progress
      await refreshUploadedFiles(progressData.selectedListingId);
      const progressRes = await buyerService.getProgress();
      setProgressData(progressRes.progress);
      
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

  // Memoize step calculations
  const stepStatus = useMemo(() => {
    if (!progressData) return { stepCompleted: false, currentStepIndex: 0, isStepFinished: false, isCurrentStep: false, isAccessible: false };
    
    const stepCompleted = progressData.steps[6]?.completed || false;
    const currentStepIndex = progressData.currentStep || 0;
    const isStepFinished = stepCompleted || currentStepIndex > 6;
    const isCurrentStep = currentStepIndex === 6;
    const isAccessible = currentStepIndex >= 6;

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

  const hasContractDocument = contractDocuments && contractDocuments.length > 0;

  return (
    <StepGuard stepName="Purchase Contract">
      <div className="max-w-6xl mx-auto">
        {/* Progress Bar */}
        <ProgressBar currentStep={progressData?.currentStep || 0} steps={steps} />
        
        {/* Step Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Step 7: Purchase Contract</h1>
              <p className="text-gray-600 mt-2">Download, sign, and upload your purchase contract</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Step 7 of 11
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
            <p>Step 6 Completed: {stepStatus.stepCompleted ? 'Yes' : 'No'}</p>
            <p>Has Contract Document: {hasContractDocument ? 'Yes' : 'No'}</p>
            <p>Documents Loading: {documentsLoading ? 'Yes' : 'No'}</p>
            <p>Selected Listing: {progressData?.selectedListingId}</p>
            <p>Uploaded Files: {uploadedFiles.length}</p>
          </div>
        )}

        {/* Purchase Contract Overview */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-orange-800 mb-4">Purchase Contract Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-orange-700 mb-2">Contract Type</h3>
              <p className="text-orange-600">Business Purchase Agreement</p>
            </div>
            <div>
              <h3 className="font-medium text-orange-700 mb-2">Financing Terms</h3>
              <p className="text-orange-600">As per loan approval</p>
            </div>
            <div>
              <h3 className="font-medium text-orange-700 mb-2">Due Diligence Period</h3>
              <p className="text-orange-600">30 days from contract signing</p>
            </div>
            <div>
              <h3 className="font-medium text-orange-700 mb-2">Closing Timeline</h3>
              <p className="text-orange-600">45-60 days typical</p>
            </div>
          </div>
        </div>

        {/* Key Contract Terms */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Key Contract Terms</h2>
          
          <div className="space-y-4">
            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="font-medium text-gray-900">Purchase Price</h3>
              <p className="text-gray-600 text-sm mt-1">
                Total acquisition price including assets, goodwill, and any adjustments for working capital.
              </p>
            </div>
            
            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="font-medium text-gray-900">Payment Terms</h3>
              <p className="text-gray-600 text-sm mt-1">
                Down payment, financing arrangements, and payment schedule details.
              </p>
            </div>
            
            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="font-medium text-gray-900">Contingencies</h3>
              <p className="text-gray-600 text-sm mt-1">
                Due diligence period, financing approval, and other conditions that must be met.
              </p>
            </div>
            
            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="font-medium text-gray-900">Closing Conditions</h3>
              <p className="text-gray-600 text-sm mt-1">
                Requirements that must be satisfied before the transaction can close.
              </p>
            </div>
          </div>
        </div>

        {/* Download and Upload Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Download Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">1. Download Purchase Contract</h2>
          
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              
              <h3 className="mt-4 text-lg font-medium text-gray-900">Business Purchase Contract</h3>
              <p className="mt-2 text-sm text-gray-500">
                {hasContractDocument 
                  ? 'Complete purchase agreement with all terms and conditions'
                  : 'Waiting for broker/agent to provide purchase contract'
                }
              </p>
              
              {documentsLoading ? (
                <div className="mt-6 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
              ) : hasContractDocument ? (
                <div className="mt-6 flex justify-center space-x-4">
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        Download Contract
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="mt-6">
                  <div className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-md text-gray-500 bg-gray-50 cursor-not-allowed">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Waiting for Contract
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Your broker or agent will provide the purchase contract once an offer is accepted.
                  </p>
                </div>
              )}
              
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
            <h2 className="text-xl font-semibold mb-4">2. Upload Signed Contract</h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              
              <h3 className="mt-4 text-lg font-medium text-gray-900">Upload Signed Contract</h3>
              <p className="mt-2 text-sm text-gray-500">
                After signing the purchase contract, upload the completed document here
              </p>
              
              <div className="mt-6">
                <label htmlFor="signed-contract-upload" className="cursor-pointer">
                  <span className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
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
                        Upload Signed Contract
                      </>
                    )}
                  </span>
                </label>
                <input
                  id="signed-contract-upload"
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
            <h2 className="text-xl font-semibold mb-4">Uploaded Signed Contracts</h2>
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

        {/* Important Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
          <div className="flex items-start">
            <svg className="h-6 w-6 text-yellow-600 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h4 className="font-medium text-yellow-900">Important</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Please download, carefully review, sign, and upload the purchase contract. 
                This is a legally binding agreement. Consider having an attorney review the contract before signing.
                The contract becomes effective once both parties have signed and all contingencies are met.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate('/buyer/upload-docs')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Previous: Upload Docs
          </button>
          <button
            onClick={() => stepStatus.stepCompleted ? navigate('/buyer/due-diligence') : null}
            disabled={!stepStatus.stepCompleted}
            className={`px-4 py-2 rounded-lg ${
              stepStatus.stepCompleted 
                ? 'bg-orange-600 text-white hover:bg-orange-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Next: Due Diligence
          </button>
        </div>
      </div>
    </StepGuard>
  );
};

export default BuyerPurchaseContract;