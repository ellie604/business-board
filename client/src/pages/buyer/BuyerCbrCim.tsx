import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { buyerService } from '../../services/buyer';
import ProgressBar from '../../components/ProgressBar';
import StepGuard from '../../components/StepGuard';
import { API_BASE_URL } from '../../config';
import { apiGet } from '../../utils/apiHelper';

const BuyerCbrCim: React.FC = () => {
  const [downloading, setDownloading] = useState(false);
  const [downloadMessage, setDownloadMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [progressData, setProgressData] = useState<any>(null);
  const [cbrCimDocuments, setCbrCimDocuments] = useState<any[]>([]);
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

      // 如果有选中的listing，获取CBR/CIM文档
      if (progressRes.progress?.selectedListingId) {
        setDocumentsLoading(true);
        
        // 获取broker/agent上传的CBR/CIM文档
        const documentsData = await apiGet(`/buyer/listings/${progressRes.progress.selectedListingId}/agent-documents`);
        
        console.log('=== Debug: Agent CBR/CIM Documents Response ===');
        console.log('Full response:', documentsData);
        console.log('Documents array:', documentsData.documents);
        
        const cbrCimDocuments = documentsData.documents?.filter(
          (doc: any) => doc.type === 'CBR_CIM'
        ) || [];
        
        console.log('Filtered CBR/CIM documents:', cbrCimDocuments);
        console.log('CBR/CIM documents URLs:', cbrCimDocuments.map((doc: any) => ({ id: doc.id, url: doc.url, fileName: doc.fileName })));
        
        setCbrCimDocuments(cbrCimDocuments);
        setDocumentsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setCbrCimDocuments([]);
      setDocumentsLoading(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const downloadCbrCimFile = (cbrCimDoc: any) => {
    try {
      // 检查文件URL是否有效
      if (!cbrCimDoc.url) {
        setDownloadMessage('File URL not available');
        setMessageType('error');
        return;
      }

      // 创建下载链接
      const link = document.createElement('a');
      link.href = cbrCimDoc.url;
      link.download = cbrCimDoc.fileName || 'CBR_CIM_Document.pdf';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // 尝试下载
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // 记录下载到数据库并完成步骤
      recordDownloadAndCompleteStep(cbrCimDoc);
      
      setDownloadMessage('CBR/CIM document downloaded successfully!');
      setMessageType('success');
    } catch (error) {
      console.error('Download error:', error);
      setDownloadMessage('Download failed. Please try again.');
      setMessageType('error');
    }
  };

  const recordDownloadAndCompleteStep = async (cbrCimDoc: any) => {
    try {
      if (progressData?.selectedListingId) {
        // 使用现有的download API来记录下载
        const response = await fetch(`${API_BASE_URL}/buyer/download-agent-document/${cbrCimDoc.id}`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ stepId: 4 }),
        });
        
        if (response.ok) {
          // 标记步骤完成
          await buyerService.updateStep(4, true);
          
          // 刷新进度数据
          const progressRes = await buyerService.getProgress();
          setProgressData(progressRes.progress);
        } else {
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
      
      if (!cbrCimDocuments || cbrCimDocuments.length === 0) {
        setDownloadMessage('No CBR/CIM document available for download');
        setMessageType('error');
        return;
      }

      downloadCbrCimFile(cbrCimDocuments[0]);
      
    } catch (error: any) {
      console.error('Download error:', error);
      setDownloadMessage(error.message || 'Download failed');
      setMessageType('error');
    } finally {
      setDownloading(false);
    }
  }, [cbrCimDocuments]);

  // Memoize step calculations
  const stepStatus = useMemo(() => {
    if (!progressData) return { stepCompleted: false, currentStepIndex: 0, isStepFinished: false, isCurrentStep: false, isAccessible: false };
    
    const stepCompleted = progressData.steps[4]?.completed || false;
    const currentStepIndex = progressData.currentStep || 0;
    const isStepFinished = stepCompleted || currentStepIndex > 4;
    const isCurrentStep = currentStepIndex === 4;
    const isAccessible = currentStepIndex >= 4;

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

  const hasCbrCimDocument = cbrCimDocuments && cbrCimDocuments.length > 0;

  return (
    <StepGuard stepName="CBR/CIM">
      <div className="max-w-6xl mx-auto p-4 lg:p-0">
        {/* Progress Bar */}
        <ProgressBar currentStep={progressData?.currentStep || 0} steps={steps} />
        
        {/* Header - Mobile Responsive */}
        <div className="bg-white rounded-lg shadow-md p-4 lg:p-6 mb-4 lg:mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Step 5: CBR/CIM</h1>
              <p className="text-gray-600 mt-1 lg:mt-2">Download Confidential Business Review or Confidential Information Memorandum</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 lg:gap-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Step 5 of 11
              </span>
              {stepStatus.stepCompleted ? (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Downloaded
                </span>
              ) : stepStatus.isCurrentStep ? (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  Available
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
            <p>Step 4 Completed: {stepStatus.stepCompleted ? 'Yes' : 'No'}</p>
            <p>Has CBR/CIM Document: {hasCbrCimDocument ? 'Yes' : 'No'}</p>
            <p>Documents Loading: {documentsLoading ? 'Yes' : 'No'}</p>
            <p>Selected Listing: {progressData?.selectedListingId}</p>
          </div>
        )}

        {/* CBR/CIM Overview */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-indigo-800 mb-4">CBR/CIM Document Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-indigo-700 mb-2">CBR - Confidential Business Review</h3>
              <p className="text-indigo-600">High-level business overview including key metrics, market position, and growth opportunities</p>
            </div>
            <div>
              <h3 className="font-medium text-indigo-700 mb-2">CIM - Confidential Information Memorandum</h3>
              <p className="text-indigo-600">Detailed business analysis with financial statements, operational details, and strategic information</p>
            </div>
          </div>
        </div>

        {/* Key Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">What You'll Find in CBR/CIM</h2>
          
          <div className="space-y-4">
            <div className="border-l-4 border-indigo-500 pl-4">
              <h3 className="font-medium text-gray-900">Business Overview</h3>
              <p className="text-gray-600 text-sm mt-1">
                Company history, mission, products/services, and market position.
              </p>
            </div>
            
            <div className="border-l-4 border-indigo-500 pl-4">
              <h3 className="font-medium text-gray-900">Financial Performance</h3>
              <p className="text-gray-600 text-sm mt-1">
                Revenue trends, profitability analysis, cash flow, and financial projections.
              </p>
            </div>
            
            <div className="border-l-4 border-indigo-500 pl-4">
              <h3 className="font-medium text-gray-900">Operations & Management</h3>
              <p className="text-gray-600 text-sm mt-1">
                Organizational structure, key personnel, operational processes, and systems.
              </p>
            </div>
            
            <div className="border-l-4 border-indigo-500 pl-4">
              <h3 className="font-medium text-gray-900">Growth Opportunities</h3>
              <p className="text-gray-600 text-sm mt-1">
                Market analysis, competitive landscape, and potential expansion strategies.
              </p>
            </div>
          </div>
        </div>

        {/* Download Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Download CBR/CIM Document</h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            
            <h3 className="mt-4 text-lg font-medium text-gray-900">Business Information Document</h3>
            <p className="mt-2 text-sm text-gray-500">
              {hasCbrCimDocument 
                ? 'Confidential business report containing detailed company information'
                : 'Waiting for broker/agent to provide CBR/CIM document'
              }
            </p>
            
            {documentsLoading ? (
              <div className="mt-6 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              </div>
            ) : hasCbrCimDocument ? (
              <div className="mt-6 flex justify-center space-x-4">
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      Download CBR/CIM
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
                  Waiting for Document
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Your broker or agent will provide the CBR/CIM document for this listing.
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

        {/* Important Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
          <div className="flex items-start">
            <svg className="h-6 w-6 text-yellow-600 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h4 className="font-medium text-yellow-900">Important</h4>
              <p className="text-sm text-yellow-700 mt-1">
                The CBR/CIM contains confidential business information protected by your signed NDA. 
                Review the document carefully as it contains detailed information needed for your investment decision.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate('/buyer/financial-statement')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Previous: Financial Statement
          </button>
          <button
            onClick={() => stepStatus.stepCompleted ? navigate('/buyer/upload-docs') : null}
            disabled={!stepStatus.stepCompleted}
            className={`px-4 py-2 rounded-lg ${
              stepStatus.stepCompleted 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Next: Upload Docs
          </button>
        </div>
      </div>
    </StepGuard>
  );
};

export default BuyerCbrCim; 