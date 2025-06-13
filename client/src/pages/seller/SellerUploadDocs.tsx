import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sellerService } from '../../services/seller';
import type { SellerProgress } from '../../services/seller';
import ProgressBar from '../../components/ProgressBar';
import StepGuard from '../../components/StepGuard';
import { API_BASE_URL } from '../../config';

const SellerUploadDocs: React.FC = () => {
  const [progress, setProgress] = useState<SellerProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const navigate = useNavigate();
  
  const steps = [
    'Home',
    'Email Agent',
    'Listing Agreement',
    'Questionnaire',
    'Upload Docs',
    'Buyer Activity',
    'Purchase Contract',
    'Due Diligence',
    'Pre Close Checklist',
    'Closing Docs',
    'After The Sale'
  ];

  const requiredDocuments = [
    '3 years of P&Ls, & Balance sheets. (Excel files preferred)',
    'List of FF&Es furniture, fixtures, and equipment with estimated value (Excel file preferred)',
    'Brochures, product/service description.',
    'Past business plans, business valuations and/or performance reports',
    'Organizational chart.',
    'Accounts Receivable Aging Report.',
    'Lease of the Premises.',
    'Projections with key assumptions (if available), if not we may have to do some projections together',
    'Pictures of equipment/facilities (digital if available)'
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const progressRes = await sellerService.getProgress();
        setProgress(progressRes.progress);
        
        // Fetch uploaded files from backend - only get UPLOADED_DOC files for this step
        const dashboardData = await sellerService.getDashboardStats();
        const selectedListingId = dashboardData.stats.selectedListingId;
        
        if (selectedListingId) {
          const response = await fetch(`${API_BASE_URL}/seller/listings/${selectedListingId}/documents`, {
            credentials: 'include'
          });
          
          if (response.ok) {
            const data = await response.json();
            // Filter to only show UPLOADED_DOC type documents (current step documents)
            const currentStepFiles = data.documents?.filter((doc: any) => doc.type === 'UPLOADED_DOC') || [];
            
            // Map the database document structure to match our UI structure
            const mappedFiles = currentStepFiles.map((doc: any) => ({
              id: doc.id,
              fileName: doc.fileName,
              fileSize: doc.fileSize,
              uploadedAt: doc.uploadedAt,
              url: doc.url,
              type: doc.type
            }));
            
            console.log('Fetched files from backend:', mappedFiles); // Debug log
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
          // Filter to only show UPLOADED_DOC type documents (current step documents)
          const currentStepFiles = data.documents?.filter((doc: any) => doc.type === 'UPLOADED_DOC') || [];
          
          // Map the database document structure to match our UI structure
          const mappedFiles = currentStepFiles.map((doc: any) => ({
            id: doc.id,
            fileName: doc.fileName,
            fileSize: doc.fileSize,
            uploadedAt: doc.uploadedAt,
            url: doc.url,
            type: doc.type
          }));
          
          console.log('Refreshed files from backend:', mappedFiles); // Debug log
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
      
      for (const file of files) {
        // Upload file using real API
        const formData = new FormData();
        formData.append('file', file);
        formData.append('documentType', 'UPLOADED_DOC');

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
        
        console.log('Uploaded file data:', data.document); // Debug log to check fileSize
        
        // Don't manually add to state, refresh from backend instead
        // setUploadedFiles(prev => [newFile, ...prev]);
      }
      
      // Refresh the file list from backend to ensure consistency
      await refreshFileList();
      
      // Mark step as completed after first successful upload
      if (uploadedFiles.length === 0) {
        await sellerService.updateStep(4);
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

  const stepCompleted = progress?.steps[4]?.completed;
  const currentStepIndex = progress?.currentStep || 0;
  const isCurrentStep = currentStepIndex === 4;
  const isAccessible = currentStepIndex >= 4;

  return (
    <StepGuard stepName="Upload Docs">
      <div className="max-w-6xl mx-auto">
        {/* Progress Bar */}
        <ProgressBar currentStep={progress?.currentStep || 0} steps={steps} />
        
        {/* Step Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Step 5: Upload Documents</h1>
              <p className="text-gray-600 mt-2">Please upload the requested documents</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Step 5 of 11
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
          {/* Required Documents List */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Please Provide The Following:
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requiredDocuments.map((doc, index) => (
                <div key={index} className="flex items-start">
                  <span className="font-medium text-gray-900 mr-2">
                    {index + 1}.
                  </span>
                  <span className="text-gray-700">{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upload Area */}
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white bg-blue-600 px-4 py-2 rounded-md">
                New Documents
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
                Select up to 100 files
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
                Uploaded Files ({uploadedFiles.length})
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

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate('/seller/questionnaire')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Previous: Questionnaire
          </button>
          <button
            onClick={() => navigate('/seller/buyer-activity')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Next: Buyer Activity
          </button>
        </div>
      </div>
    </StepGuard>
  );
};

export default SellerUploadDocs; 