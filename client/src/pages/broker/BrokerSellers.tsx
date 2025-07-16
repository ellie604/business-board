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

interface Seller {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  isActive: boolean;
  createdAt: string;
  listings: Listing[];
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

const BrokerSellers: React.FC = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSellers, setExpandedSellers] = useState<Set<string>>(new Set());
  const [expandedListings, setExpandedListings] = useState<Set<string>>(new Set());
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
  const [listingDocuments, setListingDocuments] = useState<Record<string, Document[]>>({});
  const navigate = useNavigate();

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const data = await apiGet('/broker/sellers');
      setSellers(data.sellers);
      setError(null);
    } catch (err) {
      setError('Failed to fetch sellers');
      console.error('Error fetching sellers:', err);
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
    fetchSellers();
  }, []);

  const toggleSeller = (sellerId: string) => {
    const newExpanded = new Set(expandedSellers);
    if (newExpanded.has(sellerId)) {
      newExpanded.delete(sellerId);
    } else {
      newExpanded.add(sellerId);
    }
    setExpandedSellers(newExpanded);
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

  const navigateToListing = (sellerId: string, listingId: string) => {
    navigate(`/broker/sellers/${sellerId}/${listingId}`);
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

  const handleArchiveSeller = async (sellerId: string) => {
    if (!confirm('Are you sure you want to archive this seller?')) return;
    
    try {
      await userService.archiveSeller(sellerId);
      await fetchSellers(); // 重新加载数据
    } catch (err) {
      console.error('Failed to archive seller:', err);
      setError('Failed to archive seller. Please try again later.');
    }
  };

  const handleReactivateSeller = async (sellerId: string) => {
    if (!confirm('Are you sure you want to reactivate this seller?')) return;
    
    try {
      await userService.reactivateSeller(sellerId);
      await fetchSellers(); // 重新加载数据
    } catch (err) {
      console.error('Failed to reactivate seller:', err);
      setError('Failed to reactivate seller. Please try again later.');
    }
  };

  const handleDeleteSeller = async (sellerId: string) => {
    if (!confirm('Are you sure you want to delete this seller? This action cannot be undone and will also delete all their listings.')) {
      return;
    }
    
    try {
      await brokerService.deleteSeller(sellerId);
      await fetchSellers(); // Refresh the data
    } catch (err: any) {
      console.error('Error deleting seller:', err);
      setError(`Failed to delete seller: ${err.message || 'Unknown error'}`);
    }
  };

  const filteredSellers = sellers.filter(seller => 
    seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seller.email.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h1 className="text-2xl lg:text-3xl font-bold">Sellers Management</h1>
        <input
          type="text"
          placeholder="Search sellers..."
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

      {filteredSellers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No sellers found</div>
      ) : (
        <div className="space-y-4">
          {filteredSellers.map((seller) => (
            <div key={seller.id} className="border rounded-lg bg-white shadow">
              <button
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                onClick={() => toggleSeller(seller.id)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-4">
                    <span className="font-medium">{seller.name || seller.email}</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      seller.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {seller.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {seller.listings.length} listing{seller.listings.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      Joined: {new Date(seller.createdAt).toLocaleDateString()}
                    </span>
                    {expandedSellers.has(seller.id) ? (
                      <ChevronDownIcon className="h-5 w-5" />
                    ) : (
                      <ChevronRightIcon className="h-5 w-5" />
                    )}
                  </div>
                </div>
              </button>
              
              {expandedSellers.has(seller.id) && (
                <div className="border-t p-4 space-y-4">
                  {/* Seller Info */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Email:</span> {seller.email}
                      </div>
                      {seller.phone && (
                        <div>
                          <span className="font-medium text-gray-700">Phone:</span> {seller.phone}
                        </div>
                      )}
                    </div>
                    <div className="mt-3 flex space-x-2">
                      {seller.isActive ? (
                        <>
                          <button
                            onClick={() => handleArchiveSeller(seller.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                          >
                            Archive Seller
                          </button>
                          <button
                            onClick={() => handleDeleteSeller(seller.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                          >
                            Delete Seller
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleReactivateSeller(seller.id)}
                            className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
                          >
                            Reactivate Seller
                          </button>
                          <button
                            onClick={() => handleDeleteSeller(seller.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                          >
                            Delete Seller
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Listings */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-800">Listings:</h4>
                    {seller.listings.length === 0 ? (
                      <div className="text-gray-500 text-sm">No listings for this seller</div>
                    ) : (
                      seller.listings.map((listing) => (
                        <div key={listing.id} className="border rounded-lg bg-gray-50">
                          <div className="p-3 space-y-2">
                            <div 
                              className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                              onClick={() => navigateToListing(seller.id, listing.id)}
                            >
                              <div className="font-medium text-gray-900">{listing.title}</div>
                              <div className="text-sm text-gray-600 mt-1">
                                <div>Price: ${listing.price.toLocaleString()}</div>
                                <div>Status: {listing.status}</div>
                                <div>Created: {new Date(listing.createdAt).toLocaleDateString()}</div>
                              </div>
                            </div>
                            
                            {/* 文件管理区域 */}
                            <div className="border-t pt-2">
                              <button
                                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
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
                                            <option value="LISTING_AGREEMENT">Listing Agreement</option>
                                            <option value="PURCHASE_AGREEMENT">Purchase Agreement</option>
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
                                            <div className="text-sm text-blue-600">Uploading...</div>
                                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    
                                    {/* 已上传文件列表 */}
                                    <div className="space-y-2">
                                      <h4 className="text-sm font-medium text-gray-700">Files available for seller download:</h4>
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

export default BrokerSellers;