import React, { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../config';

interface DueDiligenceDocument {
  id: string;
  name: string;
  type: string;
  requested: boolean;
  fileId?: string;
  fileName?: string;
  fileUrl?: string;
  uploadedAt?: string;
  uploadedBy?: string;
  uploaderName?: string;
  fileSize?: number;
}

interface DueDiligenceManagerProps {
  listingId: string;
  buyerId: string;
  userRole: 'BUYER' | 'BROKER' | 'AGENT';
  userId: string;
  onStepComplete?: () => void;
  className?: string;
}

const DueDiligenceManager: React.FC<DueDiligenceManagerProps> = ({
  listingId,
  buyerId,
  userRole,
  userId,
  onStepComplete,
  className = ""
}) => {
  const [documents, setDocuments] = useState<DueDiligenceDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 预定义的尽职调查文档类型
  const predefinedDocuments = [
    'Financial Statements (3 years)',
    'Tax Returns (2 years)', 
    'Customer Contracts',
    'Supplier Agreements',
    'Lease Agreements',
    'Insurance Policies',
    'Bank Statements',
    'Accounts Receivable',
    'Accounts Payable',
    'Inventory Records',
    'Equipment List',
    'Employee Records',
    'Legal Documents',
    'Environmental Reports',
    'Intellectual Property',
    'Business Licenses'
  ];

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      
      // 根据用户角色使用不同的API端点
      let apiUrl = '';
      if (userRole === 'BUYER') {
        apiUrl = `${API_BASE_URL}/buyer/listings/${listingId}/due-diligence`;
      } else if (userRole === 'BROKER') {
        apiUrl = `${API_BASE_URL}/broker/buyers/${buyerId}/listings/${listingId}/due-diligence`;
      } else if (userRole === 'AGENT') {
        apiUrl = `${API_BASE_URL}/agent/buyers/${buyerId}/listings/${listingId}/due-diligence`;
      }

      const response = await fetch(apiUrl, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        const requestedDocs = data.requests || [];
        const uploadedFiles = data.documents || [];
        
        // 合并预定义文档和已请求的文档
        const allDocuments: DueDiligenceDocument[] = predefinedDocuments.map((docName, index) => {
          const requested = requestedDocs.find((req: any) => req.documentName === docName);
          const uploaded = uploadedFiles.find((file: any) => file.documentName === docName);
          
          return {
            id: `doc-${index}`,
            name: docName,
            type: docName.toLowerCase().replace(/\s+/g, '_'),
            requested: !!requested,
            fileId: uploaded?.id,
            fileName: uploaded?.fileName,
            fileUrl: uploaded?.url,
            uploadedAt: uploaded?.uploadedAt,
            uploadedBy: uploaded?.uploadedBy,
            uploaderName: uploaded?.uploaderName,
            fileSize: uploaded?.fileSize
          };
        });
        
        setDocuments(allDocuments);
      } else {
        console.error('Failed to fetch due diligence data:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching due diligence data:', error);
    } finally {
      setLoading(false);
    }
  }, [listingId, buyerId, userRole]);

  useEffect(() => {
    fetchDocuments();
    
    // 移除自动轮询，只在组件挂载时加载一次
    // 实时更新通过用户操作后的fetchDocuments()调用来实现
  }, [fetchDocuments]);

  const handleDocumentRequest = async (docName: string, requested: boolean) => {
    try {
      const response = await fetch(`${API_BASE_URL}/buyer/listings/${listingId}/due-diligence/request`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentName: docName,
          requested
          // Removed buyerId since backend uses authenticated user's ID
        }),
      });

      if (response.ok) {
        await fetchDocuments();
        setMessage({
          type: 'success',
          text: requested ? 'Document requested successfully' : 'Document request removed'
        });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({
          type: 'error',
          text: 'Failed to update document request'
        });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error('Error updating document request:', error);
      setMessage({
        type: 'error',
        text: 'Failed to update document request'
      });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleFileUpload = async (docName: string, file: File) => {
    try {
      setUploading(docName);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentName', docName);
      formData.append('documentType', 'DUE_DILIGENCE');
      formData.append('stepId', '7');
      formData.append('buyerId', buyerId);

      // 根据用户角色选择正确的API端点
      let uploadUrl = '';
      if (userRole === 'BROKER') {
        uploadUrl = `${API_BASE_URL}/broker/listings/${listingId}/due-diligence/upload`;
      } else if (userRole === 'AGENT') {
        uploadUrl = `${API_BASE_URL}/agent/listings/${listingId}/due-diligence/upload`;
      } else {
        throw new Error('Invalid user role for upload');
      }

      const response = await fetch(uploadUrl, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (response.ok) {
        await fetchDocuments();
        setMessage({
          type: 'success',
          text: 'File uploaded successfully'
        });
        setTimeout(() => setMessage(null), 3000);
        
        // Check if all requested documents are now uploaded
        const updatedDocs = documents.map(doc => 
          doc.name === docName ? { ...doc, fileId: 'temp' } : doc
        );
        const requestedDocs = updatedDocs.filter(doc => doc.requested);
        const uploadedDocs = updatedDocs.filter(doc => doc.requested && doc.fileId);
        
        if (requestedDocs.length > 0 && requestedDocs.length === uploadedDocs.length && onStepComplete) {
          onStepComplete();
        }
      } else {
        const errorData = await response.json();
        setMessage({
          type: 'error',
          text: `Upload failed: ${errorData.message}`
        });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage({
        type: 'error',
        text: 'Upload failed'
      });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setUploading(null);
    }
  };

  const handleFileDownload = async (doc: DueDiligenceDocument) => {
    try {
      if (!doc.fileUrl) {
        setMessage({ type: 'error', text: 'File URL not available' });
        setTimeout(() => setMessage(null), 3000);
        return;
      }

      // Create download link
      const link = document.createElement('a');
      link.href = doc.fileUrl;
      link.download = doc.fileName || `${doc.name}.pdf`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Record download (only for buyers)
      if (userRole === 'BUYER') {
        await fetch(`${API_BASE_URL}/buyer/listings/${listingId}/due-diligence/download`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            documentId: doc.fileId,
            stepId: 7
          }),
        });
      }

      setMessage({
        type: 'success',
        text: 'File downloaded successfully'
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error downloading file:', error);
      setMessage({
        type: 'error',
        text: 'Download failed'
      });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderActionButtons = (doc: DueDiligenceDocument) => {
    return (
      <div className="flex items-center space-x-2">
        {/* Request Checkbox (Only for buyers) */}
        {userRole === 'BUYER' && (
          <input
            type="checkbox"
            checked={doc.requested}
            onChange={(e) => handleDocumentRequest(doc.name, e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            title="Request this document"
          />
        )}

        {/* Upload Button (For all roles when no file exists) */}
        {!doc.fileId && (
          <label className="cursor-pointer">
            <input
              type="file"
              className="sr-only"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (userRole === 'BUYER') {
                    // For buyers, show a message that they can't upload
                    setMessage({
                      type: 'error',
                      text: 'Only brokers and agents can upload documents'
                    });
                    setTimeout(() => setMessage(null), 3000);
                  } else {
                    handleFileUpload(doc.name, file);
                  }
                }
              }}
              disabled={uploading === doc.name || userRole === 'BUYER'}
            />
            <span className={`inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white ${
              userRole === 'BUYER' ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            } disabled:opacity-50`}>
              {uploading === doc.name ? (
                <>
                  <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  {userRole === 'BUYER' ? 'Upload (Disabled)' : 'Upload'}
                </>
              )}
            </span>
          </label>
        )}

        {/* Download Button (For all roles when file is available) */}
        {doc.fileId && (
          <button
            onClick={() => handleFileDownload(doc)}
            className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700"
            title="Download file"
          >
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </button>
        )}

        {/* Status Indicators */}
        {doc.requested && !doc.fileId && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>
        )}
        {doc.requested && doc.fileId && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Available
          </span>
        )}
        {!doc.requested && userRole !== 'BUYER' && (
          <span className="text-gray-400 text-xs">Not requested</span>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Due Diligence Documents</h3>
        <div className="text-sm text-blue-800">
          {userRole === 'BUYER' && (
            <p>Check the boxes for documents you would like to request. Download them once uploaded by your broker/agent. You can see all available upload and download options but can only download files.</p>
          )}
          {(userRole === 'BROKER' || userRole === 'AGENT') && (
            <p>Upload the requested documents for the buyer's due diligence review. You can upload documents even when not specifically requested. All parties can see real-time updates.</p>
          )}
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <p className={`text-sm ${message.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
            {message.type === 'success' ? '✓ ' : '⚠ '}
            {message.text}
          </p>
        </div>
      )}

      {/* Documents Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Due Diligence Documents</h3>
          <p className="text-sm text-gray-600 mt-1">
            Collaborative document management for due diligence process
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {documents.map((doc, index) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {doc.requested ? (
                        doc.fileId ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ✅ Available
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            ⏳ Requested
                          </span>
                        )
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          ➖ Not requested
                        </span>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    {doc.fileId ? (
                      <div className="text-sm text-gray-900">
                        <div className="font-medium">{doc.fileName}</div>
                        <div className="text-gray-500">
                          {formatFileSize(doc.fileSize)} • {doc.uploadedAt && new Date(doc.uploadedAt).toLocaleDateString()}
                        </div>
                        {doc.uploaderName && (
                          <div className="text-green-600 text-xs">Uploaded by {doc.uploaderName}</div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">No file uploaded</div>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderActionButtons(doc)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Requested: </span>
            <span className="text-blue-600">{documents.filter(doc => doc.requested).length}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Available: </span>
            <span className="text-green-600">{documents.filter(doc => doc.requested && doc.fileId).length}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Pending: </span>
            <span className="text-orange-600">{documents.filter(doc => doc.requested && !doc.fileId).length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DueDiligenceManager; 