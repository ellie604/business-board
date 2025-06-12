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
  const [uploadedDocs, setUploadedDocs] = useState<any[]>([]);
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

  // Due diligence document categories
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
        
        // Mock uploaded documents
        setUploadedDocs([
          {
            id: '1',
            fileName: 'Operating_Agreement_2024.pdf',
            category: 'Legal Documents',
            uploadDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            size: '1.2 MB'
          },
          {
            id: '2',
            fileName: 'Bank_Statements_Q4_2023.pdf',
            category: 'Financial Records',
            uploadDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            size: '3.5 MB'
          }
        ]);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, category: string) => {
    const files = e.target.files;
    if (!files) return;

    try {
      setUploading(true);
      const file = files[0];
      
      // Get seller's selected listing first
      const dashboardData = await sellerService.getDashboardStats();
      const selectedListingId = dashboardData.stats.selectedListingId;
      
      if (!selectedListingId) {
        alert('Please select a listing first');
        return;
      }
      
      // Upload file using real API
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', 'DUE_DILIGENCE');

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
      
      const newDoc = {
        id: data.document.id,
        fileName: file.name,
        category,
        uploadDate: new Date().toISOString(),
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      };
      
      setUploadedDocs(prev => [newDoc, ...prev]);
      
      // Update step completion if this is the first upload
      if (uploadedDocs.length === 0) {
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

  const handleRemoveDocument = (docId: string) => {
    setUploadedDocs(prev => prev.filter(doc => doc.id !== docId));
  };

  const getUploadProgress = () => {
    const totalRequired = documentCategories.reduce((sum, cat) => sum + cat.items.length, 0);
    const uploaded = uploadedDocs.length;
    return Math.round((uploaded / totalRequired) * 100);
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
                  Finished
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

        {/* Due Diligence Progress */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <svg className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 4h6m-6 4h6" />
            </svg>
            <h2 className="text-xl font-semibold text-blue-800">Due Diligence Period Active</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-blue-600">Buyer</p>
              <p className="font-medium text-blue-800">Michael Brown - Brown Industries</p>
            </div>
            <div>
              <p className="text-sm text-blue-600">Due Diligence Deadline</p>
              <p className="font-medium text-blue-800">February 14, 2024</p>
            </div>
            <div>
              <p className="text-sm text-blue-600">Days Remaining</p>
              <p className="font-medium text-blue-800">18 days</p>
            </div>
          </div>
        </div>

        {/* Document Upload Progress */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Upload Progress</h2>
            <span className="text-sm text-gray-500">{uploadedDocs.length} documents uploaded</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${getUploadProgress()}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">{getUploadProgress()}% of recommended documents uploaded</p>
        </div>

        {/* Document Categories */}
        <div className="space-y-6">
          {documentCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{category.category}</h3>
                <input
                  type="file"
                  id={`upload-${categoryIndex}`}
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, category.category)}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
                  disabled={uploading}
                />
                <label
                  htmlFor={`upload-${categoryIndex}`}
                  className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Upload Documents'}
                </label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Required Documents:</h4>
                  <ul className="space-y-1">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-sm text-gray-600 flex items-center">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Uploaded Documents:</h4>
                  <div className="space-y-2">
                    {uploadedDocs
                      .filter(doc => doc.category === category.category)
                      .map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-green-800">{doc.fileName}</p>
                            <p className="text-xs text-green-600">
                              {doc.size} • {new Date(doc.uploadDate).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoveDocument(doc.id)}
                            className="ml-2 text-red-600 hover:text-red-800"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    {uploadedDocs.filter(doc => doc.category === category.category).length === 0 && (
                      <p className="text-sm text-gray-500 italic">No documents uploaded yet</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
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
                All documents must be uploaded before the due diligence deadline. The buyer may request additional 
                documents during this period. Ensure all information is accurate and up-to-date.
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