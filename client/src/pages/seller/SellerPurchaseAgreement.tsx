import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sellerService } from '../../services/seller';
import type { SellerProgress } from '../../services/seller';
import ProgressBar from '../../components/ProgressBar';
import StepGuard from '../../components/StepGuard';
import { API_BASE_URL } from '../../config';

const SellerPurchaseAgreement: React.FC = () => {
  const [progress, setProgress] = useState<SellerProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [downloadMessage, setDownloadMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [contractAvailable, setContractAvailable] = useState(false);
  const [availableContract, setAvailableContract] = useState<any>(null);
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
        
        // Check if purchase agreement is available
        await checkContractAvailability(progressRes.progress?.selectedListingId);
      } catch (err) {
        console.error('Failed to fetch progress:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const checkContractAvailability = async (selectedListingId?: string | null) => {
    if (!selectedListingId) {
      setContractAvailable(false);
      return;
    }

    try {
      // 获取该listing的broker文件 - 使用seller专用的端点
      const documentsResponse = await fetch(`${API_BASE_URL}/seller/listings/${selectedListingId}/broker-documents`, {
        method: 'GET',
        credentials: 'include'
      });
      
      if (documentsResponse.ok) {
        const documentsData = await documentsResponse.json();
        
        // 扩展检查逻辑：不仅检查类型，还检查文件名
        const purchaseAgreements = documentsData.documents?.filter((doc: any) => {
          // 检查文档类型
          const typeMatches = [
            'PURCHASE_AGREEMENT', 
            'PURCHASE_CONTRACT', 
            'UPLOADED_DOC'
          ].includes(doc.type);
          
          // 检查文件名是否包含purchase相关关键词
          const fileName = (doc.fileName || '').toLowerCase();
          const nameMatches = fileName.includes('purchase') || 
                             fileName.includes('contract') || 
                             fileName.includes('agreement');
          
          // 如果类型是PURCHASE_AGREEMENT或PURCHASE_CONTRACT，直接匹配
          if (doc.type === 'PURCHASE_AGREEMENT' || doc.type === 'PURCHASE_CONTRACT') {
            return true;
          }
          
          // 如果类型是UPLOADED_DOC，需要文件名也匹配
          if (doc.type === 'UPLOADED_DOC' && nameMatches) {
            return true;
          }
          
          return false;
        });
        
        console.log('Purchase agreement check:', {
          allDocuments: documentsData.documents,
          filteredAgreements: purchaseAgreements
        });
        
        if (purchaseAgreements && purchaseAgreements.length > 0) {
          // 优先选择broker上传的文件，其次是agent的
          const brokerAgreements = purchaseAgreements.filter((doc: any) => doc.uploader?.role === 'BROKER');
          const agentAgreements = purchaseAgreements.filter((doc: any) => doc.uploader?.role === 'AGENT');
          
          const selectedAgreement = brokerAgreements.length > 0 ? brokerAgreements[0] : agentAgreements[0];
          
          console.log('Selected purchase agreement:', selectedAgreement);
          
          setContractAvailable(true);
          setAvailableContract(selectedAgreement);
        } else {
          console.log('No purchase agreements found');
          setContractAvailable(false);
          setAvailableContract(null);
        }
      } else {
        console.error('Failed to fetch documents:', documentsResponse.status);
        setContractAvailable(false);
        setAvailableContract(null);
      }
    } catch (error) {
      console.error('Error checking contract availability:', error);
      setContractAvailable(false);
      setAvailableContract(null);
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

      if (!availableContract) {
        setDownloadMessage('Purchase agreement not available yet. Please contact your broker or agent.');
        setMessageType('error');
        return;
      }

      // Record the download and update step completion
      await sellerService.recordStepDownload(6);
      await sellerService.updateStep(6);
      
      // 下载文件 - 修改下载逻辑避免弹窗阻止
      const link = document.createElement('a');
      link.href = availableContract.url;
      link.download = availableContract.fileName || 'purchase_agreement.pdf';
      // 不使用 target="_blank" 来避免弹窗阻止
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setDownloadMessage('Purchase agreement downloaded successfully!');
      setMessageType('success');
      
      // Refresh progress
      const newProgressRes = await sellerService.getProgress();
      setProgress(newProgressRes.progress);
    } catch (err) {
      console.error('Failed to download:', err);
      setDownloadMessage('Failed to download purchase agreement. Please try again or contact your broker/agent.');
      setMessageType('error');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  const stepCompleted = progress?.steps[6]?.completed;
  const currentStepIndex = progress?.currentStep || 0;
  const isCurrentStep = currentStepIndex === 6;
  const isAccessible = currentStepIndex >= 6;

  return (
    <StepGuard stepName="Purchase Agreement">
      <div className="max-w-6xl mx-auto">
        {/* Progress Bar */}
        <ProgressBar currentStep={progress?.currentStep || 0} steps={steps} />
        
        {/* Step Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Step 7: Purchase Agreement</h1>
              <p className="text-gray-600 mt-2">Download your purchase agreement with the accepted buyer offer</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Step 7 of 11
              </span>
              {stepCompleted ? (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Finished
                </span>
              ) : isCurrentStep ? (
                contractAvailable ? (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Agreement Ready
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

        {contractAvailable ? (
          <>
            {/* Agreement Download */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Purchase Agreement</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Document Download */}
                <div>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      {availableContract?.fileName || 'Purchase Agreement.pdf'}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Purchase agreement prepared by your broker/agent
                    </p>
                    {availableContract?.uploader && (
                      <p className="mt-1 text-xs text-gray-400">
                        Provided by: {availableContract.uploader.name} ({availableContract.uploader.role})
                      </p>
                    )}
                    <div className="mt-4">
                      <button
                        onClick={handleDownload}
                        disabled={downloading}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    
                    {stepCompleted && (
                      <div className="mt-4 p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-700">
                          ✓ Downloaded on {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Information */}
                <div>
                  <h3 className="text-lg font-medium mb-4">About This Document</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                      <p className="text-gray-700">This is your official purchase agreement prepared by your broker or agent</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                      <p className="text-gray-700">Review all terms and conditions carefully before proceeding</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                      <p className="text-gray-700">Contact your broker or agent if you have any questions</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900">Next Steps</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      After downloading and reviewing the purchase agreement, the buyer will begin their due diligence process. 
                      You'll need to provide additional documentation in the next step.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* No Purchase Agreement Available */
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center py-12">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 4h6m-6 4h6" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Purchase Agreement Not Available Yet</h3>
              <p className="mt-2 text-gray-500">
                Once you accept a buyer's offer and your broker/agent prepares the purchase agreement, it will be available here for download.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => navigate('/seller/buyer-activity')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  View Buyer Activity
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate('/seller/buyer-activity')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Previous: Buyer Activity
          </button>
          <button
            onClick={() => navigate('/seller/due-diligence')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Next: Due Diligence
          </button>
        </div>
      </div>
    </StepGuard>
  );
};

export default SellerPurchaseAgreement; 