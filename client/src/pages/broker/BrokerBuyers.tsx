import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDownIcon, ChevronRightIcon, DocumentArrowUpIcon, FolderOpenIcon } from '@heroicons/react/24/solid';
import { userService } from '../../services/listing';
import { apiGet, makeAuthenticatedRequest } from '../../utils/apiHelper';
import { API_BASE_URL } from '../../config';
import { brokerService } from '../../services/broker';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  status: string;
  createdAt: string;
}

interface Buyer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  isActive: boolean;
  createdAt: string;
  buyingListings: Listing[];
}

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
  };
}

const BrokerBuyers: React.FC = () => {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedBuyers, setExpandedBuyers] = useState<Set<string>>(new Set());
  const [expandedListings, setExpandedListings] = useState<Set<string>>(new Set());
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
  const [listingDocuments, setListingDocuments] = useState<Record<string, Document[]>>({});
  const navigate = useNavigate();

  const fetchBuyers = async () => {
    try {
      setLoading(true);
      const data = await apiGet('/broker/buyers');
      setBuyers(data.buyers);
      setError(null);
    } catch (err) {
      setError('Failed to fetch buyers');
      console.error('Error fetching buyers:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchListingDocuments = async (listingId: string) => {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/broker/listings/${listingId}/documents`);
      const data = await response.json();
      setListingDocuments(prev => ({
        ...prev,
        [listingId]: data.documents || []
      }));
    } catch (error) {
      console.error('Error fetching listing documents:', error);
    }
  };

  useEffect(() => {
    fetchBuyers();
  }, []);

  const toggleBuyer = (buyerId: string) => {
    const newExpanded = new Set(expandedBuyers);
    if (newExpanded.has(buyerId)) {
      newExpanded.delete(buyerId);
    } else {
      newExpanded.add(buyerId);
    }
    setExpandedBuyers(newExpanded);
  };

  const toggleListingFiles = (listingId: string) => {
    const newExpanded = new Set(expandedListings);
    if (newExpanded.has(listingId)) {
      newExpanded.delete(listingId);
    } else {
      newExpanded.add(listingId);
      // 获取该listing的文档
      if (!listingDocuments[listingId]) {
        fetchListingDocuments(listingId);
      }
    }
    setExpandedListings(newExpanded);
  };

  const navigateToBuyerProgress = (buyerId: string, listingId: string) => {
    navigate(`/broker/buyers/${buyerId}/${listingId}`);
  };

  const handleFileUpload = async (listingId: string, file: File, documentType: string) => {
    setUploadingFiles(prev => new Set(prev).add(listingId));
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', documentType);

      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/broker/listings/${listingId}/documents`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        alert(`Successfully uploaded ${file.name} for listing`);
        // 刷新该listing的文档列表
        fetchListingDocuments(listingId);
      } else {
        const errorData = await response.json();
        alert(`Upload failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploadingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(listingId);
        return newSet;
      });
    }
  };

  const deleteDocument = async (listingId: string, documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/broker/listings/${listingId}/documents/${documentId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Document deleted successfully');
        fetchListingDocuments(listingId);
      } else {
        const errorData = await response.json();
        alert(`Delete failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Delete failed. Please try again.');
    }
  };

  const handleArchiveBuyer = async (buyerId: string) => {
    if (!confirm('Are you sure you want to archive this buyer?')) return;
    
    try {
      await userService.archiveBuyer(buyerId);
      await fetchBuyers(); // 重新加载数据
    } catch (err) {
      console.error('Failed to archive buyer:', err);
      setError('Failed to archive buyer. Please try again later.');
    }
  };

  const handleReactivateBuyer = async (buyerId: string) => {
    if (!confirm('Are you sure you want to reactivate this buyer?')) return;
    
    try {
      await userService.reactivateBuyer(buyerId);
      await fetchBuyers(); // 重新加载数据
    } catch (err) {
      console.error('Failed to reactivate buyer:', err);
      setError('Failed to reactivate buyer. Please try again later.');
    }
  };

  const handleDeleteBuyer = async (buyerId: string) => {
    if (!confirm('Are you sure you want to delete this buyer?')) return;

    try {
      await brokerService.deleteBuyer(buyerId);
      await fetchBuyers(); // 重新加载数据
    } catch (err) {
      console.error('Failed to delete buyer:', err);
      setError('Failed to delete buyer. Please try again later.');
    }
  };

  const filteredBuyers = buyers.filter(buyer => 
    buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    buyer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6 p-4 lg:p-0">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <h1 className="text-2xl lg:text-3xl font-bold">Buyers Management</h1>
        <input
          type="text"
          placeholder="Search buyers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full lg:w-auto max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {filteredBuyers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No buyers found</div>
      ) : (
        <div className="space-y-4">
          {filteredBuyers.map((buyer) => (
            <div key={buyer.id} className="border rounded-lg bg-white shadow">
              <button
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                onClick={() => toggleBuyer(buyer.id)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-4">
                    <span className="font-medium">{buyer.name || buyer.email}</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      buyer.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {buyer.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {buyer.buyingListings.length} interested listing{buyer.buyingListings.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      Joined: {new Date(buyer.createdAt).toLocaleDateString()}
                    </span>
                    {expandedBuyers.has(buyer.id) ? (
                      <ChevronDownIcon className="h-5 w-5" />
                    ) : (
                      <ChevronRightIcon className="h-5 w-5" />
                    )}
                  </div>
                </div>
              </button>
              
              {expandedBuyers.has(buyer.id) && (
                <div className="border-t p-4 space-y-4">
                  {/* Buyer Info */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Email:</span> {buyer.email}
                      </div>
                      {buyer.phone && (
                        <div>
                          <span className="font-medium text-gray-700">Phone:</span> {buyer.phone}
                        </div>
                      )}
                    </div>
                    <div className="mt-3 flex space-x-2">
                      {buyer.isActive ? (
                        <>
                          <button
                            onClick={() => handleArchiveBuyer(buyer.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                          >
                            Archive Buyer
                          </button>
                          <button
                            onClick={() => handleDeleteBuyer(buyer.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                          >
                            Delete Buyer
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleReactivateBuyer(buyer.id)}
                            className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
                          >
                            Reactivate Buyer
                          </button>
                          <button
                            onClick={() => handleDeleteBuyer(buyer.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                          >
                            Delete Buyer
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Interested Listings */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-800">Interested Listings:</h4>
                    {buyer.buyingListings.length === 0 ? (
                      <div className="text-gray-500 text-sm">No interested listings for this buyer</div>
                    ) : (
                      buyer.buyingListings.map((listing) => (
                        <div key={listing.id} className="border rounded-lg bg-gray-50">
                          <div className="p-3 space-y-2">
                            <div 
                              className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                              onClick={() => navigateToBuyerProgress(buyer.id, listing.id)}
                            >
                              <div className="font-medium text-gray-900">{listing.title}</div>
                              <div className="text-sm text-gray-600 mt-1">
                                <div>Price: ${listing.price.toLocaleString()}</div>
                                <div>Status: {listing.status}</div>
                                <div>Listed: {new Date(listing.createdAt).toLocaleDateString()}</div>
                              </div>
                            </div>
                            
                            {/* 文件管理区域 */}
                            <div className="border-t pt-2">
                              <button
                                className="flex items-center gap-2 text-sm text-green-600 hover:text-green-800"
                                onClick={() => toggleListingFiles(listing.id)}
                              >
                                <FolderOpenIcon className="h-4 w-4" />
                                Broker Files for this Listing
                                {expandedListings.has(listing.id) ? (
                                  <ChevronDownIcon className="h-4 w-4" />
                                ) : (
                                  <ChevronRightIcon className="h-4 w-4" />
                                )}
                              </button>
                              
                              {expandedListings.has(listing.id) && (
                                <div className="mt-2 p-3 bg-white rounded border">
                                  <div className="space-y-3">
                                    {/* 文件上传区域 */}
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                      <div className="text-center">
                                        <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                                        <div className="mt-2">
                                          <label htmlFor={`file-upload-${listing.id}`} className="cursor-pointer">
                                            <span className="mt-2 block text-sm font-medium text-gray-900">
                                              Upload files for {listing.title}
                                            </span>
                                            <span className="mt-1 block text-xs text-gray-500">
                                              PDF, DOC, DOCX files up to 10MB
                                            </span>
                                          </label>
                                          <select 
                                            className="mt-2 block mx-auto text-sm border border-gray-300 rounded"
                                            id={`doc-type-${listing.id}`}
                                          >
                                            <option value="NDA">Non-Disclosure Agreement</option>
                                            <option value="FINANCIAL_STATEMENT">Financial Statement</option>
                                            <option value="CBR_CIM">CBR/CIM</option>
                                            <option value="PURCHASE_CONTRACT">Purchase Contract</option>
                                            <option value="DUE_DILIGENCE">Due Diligence</option>
                                            <option value="PRE_CLOSE_CHECKLIST">Pre-Close Checklist</option>
                                            <option value="CLOSING_DOCS">Closing Documents</option>
                                            <option value="UPLOADED_DOC">Other Document</option>
                                          </select>
                                          <input
                                            id={`file-upload-${listing.id}`}
                                            type="file"
                                            className="sr-only"
                                            accept=".pdf,.doc,.docx"
                                            onChange={(e) => {
                                              const file = e.target.files?.[0];
                                              if (file) {
                                                const select = document.getElementById(`doc-type-${listing.id}`) as HTMLSelectElement;
                                                const documentType = select.value;
                                                handleFileUpload(listing.id, file, documentType);
                                              }
                                            }}
                                          />
                                        </div>
                                        {uploadingFiles.has(listing.id) && (
                                          <div className="mt-2">
                                            <div className="text-sm text-green-600">Uploading...</div>
                                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                              <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    
                                    {/* 已上传文件列表 */}
                                    <div className="space-y-2">
                                      <h4 className="text-sm font-medium text-gray-700">Files available for buyer download:</h4>
                                      <div className="space-y-1">
                                        {listingDocuments[listing.id]?.length > 0 ? (
                                          listingDocuments[listing.id].map((doc) => (
                                            <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                              <div>
                                                <span className="text-sm text-gray-600">{doc.fileName}</span>
                                                <span className="text-xs text-gray-400 ml-2">({doc.type})</span>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-400">
                                                  {new Date(doc.uploadedAt).toLocaleDateString()}
                                                </span>
                                                <button
                                                  onClick={() => deleteDocument(listing.id, doc.id)}
                                                  className="text-red-600 hover:text-red-800 text-xs"
                                                >
                                                  Delete
                                                </button>
                                              </div>
                                            </div>
                                          ))
                                        ) : (
                                          <div className="text-sm text-gray-500">No files uploaded yet</div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrokerBuyers;