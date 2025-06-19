import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { DocumentArrowUpIcon, FolderOpenIcon, TrashIcon, UserIcon } from '@heroicons/react/24/solid';
import { API_BASE_URL } from '../../config';
import ProgressSteps from '../ProgressSteps';
import PreCloseChecklist from '../PreCloseChecklist';

interface Document {
  id: string;
  fileName: string;
  fileSize: number;
  type: string;
  uploadedAt: string;
  url: string;
  uploader: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  listing?: {
    id: string;
    title: string;
    seller: {
      id: string;
      name: string;
      email: string;
    };
  };
}

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  status: string;
  seller: {
    id: string;
    name: string;
    email: string;
  };
}

interface Buyer {
  id: string;
  name: string;
  email: string;
}

// Document type options for broker uploads
const documentTypeOptions = [
  { value: 'NDA', label: 'Non-Disclosure Agreement' },
  { value: 'FINANCIAL_STATEMENT', label: 'Financial Statement' },
  { value: 'CBR_CIM', label: 'CBR/CIM' },
  { value: 'PURCHASE_CONTRACT', label: 'Purchase Contract' },
  { value: 'DUE_DILIGENCE', label: 'Due Diligence' },
  { value: 'PRE_CLOSE_CHECKLIST', label: 'Pre-Close Checklist' },
  { value: 'CLOSING_DOCS', label: 'Closing Documents' },
  { value: 'AFTER_SALE', label: 'After Sale Information' },
  { value: 'UPLOADED_DOC', label: 'Other Document' }
];

const BuyerProgressView: React.FC = () => {
  const { buyerId, listingId } = useParams<{ buyerId: string; listingId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [listing, setListing] = useState<Listing | null>(null);
  const [buyer, setBuyer] = useState<Buyer | null>(null);
  const [brokerDocuments, setBrokerDocuments] = useState<Document[]>([]);
  const [buyerDocuments, setBuyerDocuments] = useState<Document[]>([]);
  const [buyerProgress, setBuyerProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] = useState('NDA');
  const [isViewingSelectedListing, setIsViewingSelectedListing] = useState(true);
  const isBroker = location.pathname.startsWith('/broker/');
  const isAgent = location.pathname.startsWith('/agent/');
  const isUserCanUpload = isBroker || isAgent;

  useEffect(() => {
    if (listingId && buyerId) {
      fetchListingData();
      fetchBuyerData();
      fetchBrokerDocuments();
      fetchBuyerDocuments();
      fetchBuyerProgress();
    }
  }, [listingId, buyerId]);

  const fetchListingData = async () => {
    try {
      // Determine the correct API endpoint based on the current path
      const apiEndpoint = location.pathname.startsWith('/broker/') 
        ? `${API_BASE_URL}/broker/listings`
        : `${API_BASE_URL}/agent/listings`;
        
      const response = await fetch(apiEndpoint, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        const currentListing = data.listings.find((l: Listing) => l.id === listingId);
        setListing(currentListing || null);
      }
    } catch (error) {
      console.error('Error fetching listing data:', error);
    }
  };

  const fetchBuyerData = async () => {
    try {
      // Get buyers list and find the specific buyer
      const apiEndpoint = location.pathname.startsWith('/broker/') 
        ? `${API_BASE_URL}/broker/buyers`
        : `${API_BASE_URL}/agent/buyers`;
        
      const response = await fetch(apiEndpoint, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        const currentBuyer = data.buyers.find((b: Buyer) => b.id === buyerId);
        setBuyer(currentBuyer || null);
      } else {
        console.log('Failed to fetch buyer data');
        setBuyer(null);
      }
    } catch (error) {
      console.error('Error fetching buyer data:', error);
      setBuyer(null);
    }
  };

  const fetchBrokerDocuments = async () => {
    try {
      // Determine the correct API endpoint based on the current path
      const apiEndpoint = location.pathname.startsWith('/broker/') 
        ? `${API_BASE_URL}/broker/listings/${listingId}/documents`
        : `${API_BASE_URL}/agent/listings/${listingId}/documents`;
        
      const response = await fetch(apiEndpoint, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setBrokerDocuments(data.documents || []);
      }
    } catch (error) {
      console.error('Error fetching broker documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBuyerDocuments = async () => {
    try {
      // Use the new broker/agent API endpoint to get buyer documents
      const apiEndpoint = location.pathname.startsWith('/broker/') 
        ? `${API_BASE_URL}/broker/buyers/${buyerId}/listings/${listingId}/documents`
        : `${API_BASE_URL}/agent/buyers/${buyerId}/listings/${listingId}/documents`;
        
      const response = await fetch(apiEndpoint, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setBuyerDocuments(data.documents || []);
      } else {
        console.log('Failed to fetch buyer documents - may not have access or buyer has no documents');
        setBuyerDocuments([]);
      }
    } catch (error) {
      console.error('Error fetching buyer documents:', error);
      setBuyerDocuments([]);
    }
  };

  const refreshBuyerDocuments = async () => {
    setRefreshing(true);
    try {
      await fetchBuyerDocuments();
    } finally {
      setRefreshing(false);
    }
  };

  const fetchBuyerProgress = async () => {
    try {
      // Determine the correct API endpoint based on the current path
      const apiEndpoint = location.pathname.startsWith('/broker/') 
        ? `${API_BASE_URL}/broker/buyers/${buyerId}/listings/${listingId}/progress`
        : `${API_BASE_URL}/agent/buyers/${buyerId}/listings/${listingId}/progress`;
        
      const response = await fetch(apiEndpoint, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setBuyerProgress(data.progress || null);
        setIsViewingSelectedListing(data.progress?.isViewingSelectedListing ?? false);
      } else {
        console.error('Failed to fetch buyer progress:', response.status);
        setBuyerProgress(null);
        setIsViewingSelectedListing(false);
      }
    } catch (error) {
      console.error('Error fetching buyer progress:', error);
      setBuyerProgress(null);
      setIsViewingSelectedListing(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!selectedDocumentType) {
      alert('Please select a document type');
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', selectedDocumentType);
      // No need for buyerId since we're already in the context of this specific buyer
      // The buyerId can be passed via the URL parameter if needed

      // Determine the correct API endpoint based on the current path
      const apiEndpoint = location.pathname.startsWith('/broker/') 
        ? `${API_BASE_URL}/broker/listings/${listingId}/documents`
        : `${API_BASE_URL}/agent/listings/${listingId}/documents`;

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Successfully uploaded ${file.name}`);
        fetchBrokerDocuments(); // Refresh documents list
        setShowUploadForm(false);
        setSelectedDocumentType('NDA');
      } else {
        const errorData = await response.json();
        alert(`Upload failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const deleteDocument = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      // Determine the correct API endpoint based on the current path
      const apiEndpoint = location.pathname.startsWith('/broker/') 
        ? `${API_BASE_URL}/broker/listings/${listingId}/documents/${documentId}`
        : `${API_BASE_URL}/agent/listings/${listingId}/documents/${documentId}`;

      const response = await fetch(apiEndpoint, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        alert('Document deleted successfully');
        fetchBrokerDocuments();
      } else {
        const errorData = await response.json();
        alert(`Delete failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Delete failed. Please try again.');
    }
  };

  const formatFileSize = (bytes: number) => {
    // 处理NaN、null、undefined和0的情况
    if (!bytes || bytes === 0 || isNaN(bytes)) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const downloadBuyerFile = (doc: any) => {
    // 直接下载真实文件
    if (doc.url) {
      try {
        const link = document.createElement('a');
        link.href = doc.url;
        link.download = doc.fileName || `document_${doc.id}.pdf`;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Download error:', error);
        alert('Download failed. Please try again.');
      }
    } else {
      alert('File URL not available');
    }
  };

  const downloadBrokerFile = (doc: any) => {
    // 下载broker/agent上传的文件
    if (doc.url) {
      try {
        const link = document.createElement('a');
        link.href = doc.url;
        link.download = doc.fileName || `document_${doc.id}.pdf`;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Download error:', error);
        alert('Download failed. Please try again.');
      }
    } else {
      alert('File URL not available');
    }
  };

  const handleBackToList = () => {
    if (location.pathname.startsWith('/broker/')) {
      navigate('/broker/buyers');
    } else if (location.pathname.startsWith('/agent/')) {
      navigate('/agent/buyers');
    } else {
      navigate('/broker/buyers');
    }
  };

  const renderDocumentIcon = (type: string) => {
    return (
      <div className="text-blue-500">
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
        </svg>
      </div>
    );
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Buyer Progress</h1>
          {listing && (
            <div className="mt-2 text-gray-600">
              <p className="text-lg font-medium">{listing.title}</p>
              {buyer && (
                <p>Buyer: {buyer.name} ({buyer.email})</p>
              )}
              {listing.seller && (
                <p>Seller: {listing.seller.name} ({listing.seller.email})</p>
              )}
              <p>Price: ${listing.price?.toLocaleString() || 'N/A'}</p>
            </div>
          )}
        </div>
        <button
          onClick={handleBackToList}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Back to Buyer List
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side: Progress Steps */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <div className="h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center">
              <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            Buyer Progress Steps
          </h3>
          
          {/* Warning when buyer hasn't selected this listing */}
          {!isViewingSelectedListing && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-yellow-800">Buyer hasn't selected this listing yet</p>
                  <p className="text-xs text-yellow-600 mt-1">
                    The progress shown below reflects their actual selected listing.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {buyerProgress ? (
            <div className="space-y-3">
              {buyerProgress.steps.map((step: any, index: number) => (
                <div key={step.id} className={`flex items-center gap-3 p-3 rounded-lg ${
                  step.completed 
                    ? 'bg-blue-50 border border-blue-200' 
                    : step.accessible 
                      ? 'bg-yellow-50 border border-yellow-200'
                      : 'bg-gray-50 border border-gray-200'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.completed 
                      ? 'bg-blue-600 text-white' 
                      : step.accessible 
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-400 text-white'
                  }`}>
                    {step.completed ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span className="text-sm font-semibold">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      step.completed 
                        ? 'text-blue-800' 
                        : step.accessible 
                          ? 'text-yellow-800'
                          : 'text-gray-600'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {step.completed ? 'Completed' : step.accessible ? 'Available' : 'Locked'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <p className="text-sm">Loading progress...</p>
            </div>
          )}
        </div>

        {/* Middle: Buyer Uploaded Files */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <UserIcon className="h-6 w-6 text-blue-600" />
              Buyer Uploaded Files
            </h3>
            <button
              onClick={refreshBuyerDocuments}
              disabled={refreshing}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
              title="Refresh buyer documents"
            >
              <svg 
                className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Documents uploaded by the buyer during their process.
          </p>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {buyerDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
              >
                <div className="flex items-center space-x-3">
                  {renderDocumentIcon(doc.type)}
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{doc.fileName}</p>
                    <p className="text-xs text-gray-500">
                      {doc.type} • {new Date(doc.uploadedAt).toLocaleDateString()} • {formatFileSize(doc.fileSize)}
                    </p>
                  </div>
                </div>
                <button
                  className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                  title="Download"
                  onClick={() => downloadBuyerFile(doc)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>
            ))}
            {buyerDocuments.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <p className="text-sm">No documents uploaded yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Right side: Broker File Management */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <DocumentArrowUpIcon className="h-6 w-6 text-green-600" />
              Upload Files
            </h3>
            {isUserCanUpload && (
              <button
                onClick={() => setShowUploadForm(!showUploadForm)}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex items-center gap-1"
              >
                <DocumentArrowUpIcon className="h-4 w-4" />
                Upload
              </button>
            )}
          </div>

          {/* Upload Form */}
          {isUserCanUpload && showUploadForm && (
            <div className="mb-4 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
              <h4 className="font-medium mb-3 text-sm">Upload Document for Buyer</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Document Type *
                  </label>
                  <select 
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    value={selectedDocumentType}
                    onChange={(e) => setSelectedDocumentType(e.target.value)}
                  >
                    {documentTypeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Select File *
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(file);
                      }
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX up to 10MB</p>
                </div>
              </div>
              {uploading && (
                <div className="mt-3">
                  <div className="text-sm text-green-600">Uploading...</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Documents List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            <p className="text-xs text-gray-600">
              Files available for buyer download during their process. 
              <span className="block mt-1 text-purple-600">🏢 Broker uploads take priority • 👤 Agent uploads are also available</span>
            </p>
            {brokerDocuments.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <FolderOpenIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No documents uploaded yet</p>
                {isUserCanUpload && (
                  <div className="text-xs mt-1">
                    <p>Upload documents to help the buyer.</p>
                    <p className="text-purple-600 mt-1">🏢 Brokers and 👤 Agents can collaborate here</p>
                  </div>
                )}
              </div>
            ) : (
              brokerDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                >
                  <div className="flex items-center space-x-3">
                    {renderDocumentIcon(doc.type)}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{doc.fileName}</p>
                      <p className="text-xs text-gray-500">
                        {doc.type} • {formatFileSize(doc.fileSize)}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          doc.uploader?.role === 'BROKER' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {doc.uploader?.role === 'BROKER' ? '🏢 Broker' : '👤 Agent'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {doc.uploader?.name || 'Unknown'} • {new Date(doc.uploadedAt).toLocaleDateString()} {new Date(doc.uploadedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                      {doc.listing && (
                        <p className="text-xs text-green-600 mt-1">
                          📋 For listing: {doc.listing.title}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => downloadBrokerFile(doc)}
                      className="p-1 text-green-600 hover:text-green-800 transition-colors"
                      title="Download"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                    {isUserCanUpload && (
                      <button
                        onClick={() => deleteDocument(doc.id)}
                        className="p-1 text-red-600 hover:text-red-800 transition-colors"
                        title="Delete"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Pre-Close Checklist - Show when buyer reaches step 8 */}
      {buyerProgress && buyerProgress.currentStep >= 8 && listingId && (
        <div className="mt-8">
          <PreCloseChecklist
            listingId={listingId}
            userRole="BUYER"
            currentUserName={buyer?.name}
            className="shadow-lg"
          />
        </div>
      )}

      {/* Pre-Close Checklist - Available for Broker/Agent editing */}
      {listingId && (isBroker || isAgent) && (
        <div className="mt-8">
          <PreCloseChecklist
            listingId={listingId}
            userRole={isBroker ? "BROKER" : "AGENT"}
            currentUserName={undefined} // Will use default from session
            className="shadow-lg"
          />
        </div>
      )}
    </div>
  );
};

export default BuyerProgressView; 