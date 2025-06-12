import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDownIcon, ChevronRightIcon, DocumentArrowUpIcon, FolderOpenIcon } from '@heroicons/react/24/solid';
import { API_BASE_URL } from '../config';

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

const SellerPanel: React.FC = () => {
  const navigate = useNavigate();
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSellers, setExpandedSellers] = useState<Set<string>>(new Set());
  const [expandedListings, setExpandedListings] = useState<Set<string>>(new Set());
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
  const [listingDocuments, setListingDocuments] = useState<Record<string, Document[]>>({});

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/broker/sellers`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setSellers(data.sellers || []);
      } else {
        console.error('Failed to fetch sellers');
      }
    } catch (error) {
      console.error('Error fetching sellers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchListingDocuments = async (listingId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/broker/listings/${listingId}/documents`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setListingDocuments(prev => ({
          ...prev,
          [listingId]: data.documents || []
        }));
      }
    } catch (error) {
      console.error('Error fetching listing documents:', error);
    }
  };

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

      const response = await fetch(`${API_BASE_URL}/broker/listings/${listingId}/documents`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
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
      const response = await fetch(`${API_BASE_URL}/broker/listings/${listingId}/documents/${documentId}`, {
        method: 'DELETE',
        credentials: 'include'
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

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading sellers...</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-6">Sellers Management</h2>
      {sellers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No sellers found</div>
      ) : (
      <div className="space-y-4">
          {sellers.map((seller) => (
          <div key={seller.id} className="border rounded-lg bg-white shadow">
            <button
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
              onClick={() => toggleSeller(seller.id)}
            >
                <span className="font-medium">{seller.name || seller.email}</span>
              {expandedSellers.has(seller.id) ? (
                <ChevronDownIcon className="h-5 w-5" />
              ) : (
                <ChevronRightIcon className="h-5 w-5" />
              )}
            </button>
            {expandedSellers.has(seller.id) && (
              <div className="border-t p-4 space-y-3">
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
            )}
          </div>
        ))}
      </div>
      )}
    </div>
  );
};

export default SellerPanel; 