import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sellerService } from '../../services/seller';
import type { SellerProgress } from '../../services/seller';
import ProgressBar from '../../components/ProgressBar';
import StepGuard from '../../components/StepGuard';

const BuyerUploadDocs: React.FC = () => {
  const [progress, setProgress] = useState<SellerProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const navigate = useNavigate();
  
  const steps = [
    'Home',
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
  ];

  const requiredDocuments = [
    {
      category: 'Financial Documents',
      items: [
        'Personal Financial Statement',
        'Bank Statements (3 months)',
        'Tax Returns (2 years)',
        'Credit Report',
        'Income Verification'
      ]
    },
    {
      category: 'Legal Documents',
      items: [
        'Letter of Intent',
        'Proof of Funds',
        'Corporate Documents (if applicable)',
        'Professional References'
      ]
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const progressRes = await sellerService.getProgress();
        setProgress(progressRes.progress);
        
        // Mock uploaded files
        setUploadedFiles([
          {
            id: '1',
            name: 'Bank_Statement_Nov2023.pdf',
            category: 'Financial Documents',
            size: '1.2 MB',
            uploadDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    try {
      setUploading(true);
      for (const file of files) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await sellerService.uploadStepDocument(5, file.name, 'fake-url', file.size);
        
        const newFile = {
          id: Date.now().toString(),
          name: file.name,
          category: 'Financial Documents',
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          uploadDate: new Date().toISOString()
        };
        
        setUploadedFiles(prev => [newFile, ...prev]);
      }
      
      if (uploadedFiles.length === 0) {
        await sellerService.updateStep(5);
        const progressRes = await sellerService.getProgress();
        setProgress(progressRes.progress);
      }
    } catch (err) {
      console.error('Failed to upload:', err);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  const stepCompleted = progress?.steps[5]?.completed;
  const currentStepIndex = progress?.currentStep || 0;
  const isCurrentStep = currentStepIndex === 5;
  const isAccessible = currentStepIndex >= 5;

  return (
    <StepGuard stepName="Upload Docs">
      <div className="max-w-6xl mx-auto">
        <ProgressBar currentStep={progress?.currentStep || 0} steps={steps} />
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Step 6: Upload Docs</h1>
              <p className="text-gray-600 mt-2">Upload required documents for loan pre-approval and due diligence</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Step 6 of 11
              </span>
              {stepCompleted ? (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Uploaded
                </span>
              ) : (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  {uploadedFiles.length} files uploaded
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Upload Documents</h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <div className="mt-4">
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                  {uploading ? 'Uploading...' : 'Choose files'}
                </span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
              </label>
            </div>
            <p className="mt-2 text-sm text-gray-500">PDF, DOC, XLS up to 10MB each</p>
          </div>
        </div>

        {/* Required Documents */}
        <div className="space-y-6">
          {requiredDocuments.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">{category.category}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Required Documents:</h4>
                  <ul className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center text-sm">
                        <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Uploaded Files:</h4>
                  <div className="space-y-2">
                    {uploadedFiles
                      .filter(file => file.category === category.category)
                      .map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded">
                          <div>
                            <p className="text-sm font-medium text-green-800">{file.name}</p>
                            <p className="text-xs text-green-600">
                              {file.size} • {new Date(file.uploadDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    {uploadedFiles.filter(file => file.category === category.category).length === 0 && (
                      <p className="text-sm text-gray-500 italic">No files uploaded yet</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate('/buyer/cbr-cim')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Previous: CBR/CIM
          </button>
          <button
            onClick={() => navigate('/buyer/purchase-contract')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Next: Purchase Contract
          </button>
        </div>
      </div>
    </StepGuard>
  );
};

export default BuyerUploadDocs; 