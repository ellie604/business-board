import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sellerService } from '../../services/seller';
import type { SellerProgress } from '../../services/seller';
import ProgressBar from '../../components/ProgressBar';
import StepGuard from '../../components/StepGuard';
import { API_BASE_URL } from '../../config';

const SellerDueDiligence: React.FC = () => {
  const [progress, setProgress] = useState<SellerProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
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

  // Due diligence document categories for reference
  const documentCategories = [
    {
      category: 'Legal Documents',
      items: [
        'Articles of Incorporation',
        'Operating Agreements',
        'Material Contracts',
        'Employment Agreements',
        'Lease Agreements'
      ]
    },
    {
      category: 'Financial Records',
      items: [
        'Detailed Financial Statements',
        'Bank Statements (6 months)',
        'Accounts Receivable Aging',
        'Accounts Payable Listing',
        'Inventory Reports'
      ]
    },
    {
      category: 'Operational Information',
      items: [
        'Customer Lists',
        'Supplier Information',
        'Equipment Lists & Warranties',
        'Insurance Policies',
        'Permits & Licenses'
      ]
    },
    {
      category: 'HR & Benefits',
      items: [
        'Employee Handbook',
        'Payroll Records',
        'Benefits Information',
        'Training Documentation',
        'Organizational Chart'
      ]
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const progressRes = await sellerService.getProgress();
        setProgress(progressRes.progress);
        
        // Fetch uploaded due diligence files from backend
        const dashboardData = await sellerService.getDashboardStats();
        const selectedListingId = dashboardData.stats.selectedListingId;
        
        if (selectedListingId) {
          const response = await fetch(`${API_BASE_URL}/seller/listings/${selectedListingId}/documents`, {
            credentials: 'include'
          });
          
          if (response.ok) {
            const data = await response.json();
            // Filter to show all documents for step 7 (due diligence documents)
            const dueDiligenceFiles = data.documents?.filter((doc: any) => 
              doc.stepId === 7 && doc.category === 'SELLER_UPLOAD'
            ) || [];
            
            // Map the database document structure to match our UI structure
            const mappedFiles = dueDiligenceFiles.map((doc: any) => ({
              id: doc.id,
              fileName: doc.fileName,
              fileSize: doc.fileSize,
              uploadedAt: doc.uploadedAt,
              url: doc.url,
              type: doc.type
            }));
            
            console.log('Fetched due diligence files from backend:', mappedFiles);
            setUploadedFiles(mappedFiles);
          }
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const refreshFileList = async () => {
    try {
      const dashboardData = await sellerService.getDashboardStats();
      const selectedListingId = dashboardData.stats.selectedListingId;
      
      if (selectedListingId) {
        const response = await fetch(`${API_BASE_URL}/seller/listings/${selectedListingId}/documents`, {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          // Filter to show all documents for step 7 (due diligence documents)
          const dueDiligenceFiles = data.documents?.filter((doc: any) => 
            doc.stepId === 7 && doc.category === 'SELLER_UPLOAD'
          ) || [];
          
          // Map the database document structure to match our UI structure
          const mappedFiles = dueDiligenceFiles.map((doc: any) => ({
            id: doc.id,
            fileName: doc.fileName,
            fileSize: doc.fileSize,
            uploadedAt: doc.uploadedAt,
            url: doc.url,
            type: doc.type
          }));
          
          console.log('Refreshed due diligence files from backend:', mappedFiles);
          setUploadedFiles(mappedFiles);
        }
      }
    } catch (err) {
      console.error('Failed to refresh file list:', err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    try {
      setUploading(true);
      
      // Get seller's selected listing first
      const dashboardData = await sellerService.getDashboardStats();
      const selectedListingId = dashboardData.stats.selectedListingId;
      
      if (!selectedListingId) {
        alert('Please select a listing first');
        return;
      }
      
      // Check if this was the first upload by checking current state before upload
      const wasEmpty = uploadedFiles.length === 0;
      
      for (const file of files) {
        // Upload file using real API
        const formData = new FormData();
        formData.append('file', file);
        formData.append('documentType', 'DUE_DILIGENCE');
        formData.append('stepId', '7');

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
        console.log('Uploaded due diligence file data:', data.document);
      }
      
      // Refresh the file list from backend to ensure consistency
      await refreshFileList();
      
      // Mark step as completed after first successful upload
      if (wasEmpty) {
        await sellerService.updateStep(7);
        // Refresh progress
        const progressRes = await sellerService.getProgress();
        setProgress(progressRes.progress);
      }
    } catch (err) {
      console.error('Failed to upload:', err);
      alert(`Upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
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

      // Remove from UI list after successful deletion
      setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
      
      alert('File deleted successfully');
    } catch (err) {
      console.error('Failed to delete file:', err);
      alert(`Delete failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files) {
      const fakeEvent = {
        target: { files }
      } as React.ChangeEvent<HTMLInputElement>;
      handleFileUpload(fakeEvent);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  const stepCompleted = progress?.steps[7]?.completed;
  const currentStepIndex = progress?.currentStep || 0;
  const isCurrentStep = currentStepIndex === 7;
  const isAccessible = currentStepIndex >= 7;

  return (
    <StepGuard stepName="Due Diligence">
      <div className="max-w-6xl mx-auto">
        {/* Progress Bar */}
        <ProgressBar currentStep={progress?.currentStep || 0} steps={steps} />
        
        {/* Step Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Step 8: Due Diligence</h1>
              <p className="text-gray-600 mt-2">Provide additional documentation for the buyer's due diligence review</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Step 8 of 11
              </span>
              {stepCompleted ? (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Completed
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

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Document Categories Reference */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Due Diligence Document Categories
            </h2>
            <p className="text-gray-600 mb-6">
              The buyer may request documents from the following categories. Please upload any relevant documents you have available.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {documentCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">{category.category}</h3>
                  <ul className="space-y-1">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-sm text-gray-600 flex items-center">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Upload Area */}
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white bg-blue-600 px-4 py-2 rounded-md">
                Upload Due Diligence Documents
              </h3>
              <span className="text-sm text-gray-600">
                {uploadedFiles.length} files uploaded
              </span>
            </div>
            
            <div 
              className="border-2 border-dashed border-blue-300 rounded-lg p-12 text-center bg-white"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              
              <p className="text-lg font-medium text-gray-900 mb-2">
                Drop your files here or{' '}
                <label htmlFor="file-upload" className="text-blue-600 hover:text-blue-800 cursor-pointer underline">
                  browse for files
                </label>
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Select multiple files for due diligence review
              </p>
              
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                disabled={uploading}
              />
              
              {uploading && (
                <div className="mt-4">
                  <div className="inline-flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-blue-600">Uploading...</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Uploaded Due Diligence Documents ({uploadedFiles.length})
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{file.fileName}</p>
                          <p className="text-sm text-gray-500">
                            {file.fileSize && file.fileSize > 0 ? 
                              (file.fileSize < 1024 * 1024 ? 
                                `${(file.fileSize / 1024).toFixed(1)} KB` : 
                                `${(file.fileSize / (1024 * 1024)).toFixed(2)} MB`
                              ) : 'Unknown size'} • {' '}
                            {file.uploadedAt ? new Date(file.uploadedAt).toLocaleDateString() : 'Invalid Date'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteFile(file.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
          <div className="flex items-start">
            <svg className="h-6 w-6 text-yellow-600 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h4 className="font-medium text-yellow-900">Important Reminder</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Upload documents as requested by the buyer during their due diligence period. 
                The buyer may request additional documents throughout this process. 
                Ensure all information is accurate and up-to-date.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate('/seller/purchase-agreement')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Previous: Purchase Agreement
          </button>
          <button
            onClick={() => navigate('/seller/pre-close-checklist')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Next: Pre Close Checklist
          </button>
        </div>
      </div>
    </StepGuard>
  );
};

export default SellerDueDiligence; 