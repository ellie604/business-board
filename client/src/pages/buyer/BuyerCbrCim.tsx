import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sellerService } from '../../services/seller';
import type { SellerProgress } from '../../services/seller';
import ProgressBar from '../../components/ProgressBar';
import StepGuard from '../../components/StepGuard';

const BuyerCbrCim: React.FC = () => {
  const [progress, setProgress] = useState<SellerProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<string | null>(null);
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

  // Mock available businesses
  const availableBusinesses = [
    {
      id: '1',
      name: 'TechFlow Manufacturing',
      industry: 'Manufacturing',
      revenue: '$2.5M',
      cashFlow: '$485K',
      asking: '$1.8M',
      location: 'Austin, TX',
      employees: 25,
      description: 'Established precision manufacturing company specializing in aerospace components.',
      highlights: ['Strong customer base', 'Recurring contracts', 'Modern equipment']
    },
    {
      id: '2',
      name: 'Metro Service Solutions',
      industry: 'Professional Services',
      revenue: '$1.8M',
      cashFlow: '$365K',
      asking: '$1.2M',
      location: 'Denver, CO',
      employees: 18,
      description: 'Full-service business consulting firm with Fortune 500 clients.',
      highlights: ['High retention rate', 'Scalable model', 'Expert team']
    },
    {
      id: '3',
      name: 'Coastal Restaurant Group',
      industry: 'Food & Beverage',
      revenue: '$3.2M',
      cashFlow: '$520K',
      asking: '$2.1M',
      location: 'San Diego, CA',
      employees: 45,
      description: 'Three-location restaurant chain with strong brand recognition.',
      highlights: ['Prime locations', 'Proven concept', 'Growth potential']
    }
  ];

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const progressRes = await sellerService.getProgress();
        setProgress(progressRes.progress);
      } catch (err) {
        console.error('Failed to fetch progress:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const handleDownloadCIM = async (businessId: string) => {
    try {
      setDownloading(true);
      await sellerService.recordStepDownload(4);
      
      const business = availableBusinesses.find(b => b.id === businessId);
      const link = document.createElement('a');
      link.href = '#';
      link.download = `CIM_${business?.name.replace(/\s+/g, '_')}.pdf`;
      link.click();
    } catch (err) {
      console.error('Failed to download CIM:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleSelectBusiness = async (businessId: string) => {
    try {
      setSelectedBusiness(businessId);
      await sellerService.updateStep(4);
      
      const progressRes = await sellerService.getProgress();
      setProgress(progressRes.progress);
    } catch (err) {
      console.error('Failed to select business:', err);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  const stepCompleted = progress?.steps[4]?.completed;
  const currentStepIndex = progress?.currentStep || 0;
  const isCurrentStep = currentStepIndex === 4;
  const isAccessible = currentStepIndex >= 4;

  return (
    <StepGuard stepName="CBR/CIM">
      <div className="max-w-6xl mx-auto">
        <ProgressBar currentStep={progress?.currentStep || 0} steps={steps} />
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Step 5: CBR/CIM</h1>
              <p className="text-gray-600 mt-2">Review Confidential Business Reports and Information Memorandums</p>
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
                  Business Selected
                </span>
              ) : (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  Review Available
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Information About CBR/CIM */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-indigo-800 mb-4">About CBR & CIM Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-indigo-700 mb-2">CBR - Confidential Business Review</h3>
              <p className="text-indigo-600 text-sm">High-level business overview including key metrics, market position, and growth opportunities.</p>
            </div>
            <div>
              <h3 className="font-medium text-indigo-700 mb-2">CIM - Confidential Information Memorandum</h3>
              <p className="text-indigo-600 text-sm">Detailed business analysis with financial statements, operational details, and strategic information.</p>
            </div>
          </div>
        </div>

        {/* Available Businesses */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Available Business Opportunities</h2>
          
          {availableBusinesses.map((business) => (
            <div key={business.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{business.name}</h3>
                  <p className="text-indigo-600 text-sm font-medium">{business.industry}</p>
                  <p className="text-gray-600 mt-2">{business.description}</p>
                </div>
                <div className="ml-6 text-right">
                  <p className="text-sm text-gray-500">Asking Price</p>
                  <p className="text-xl font-bold text-green-600">{business.asking}</p>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-500">Annual Revenue</p>
                  <p className="font-semibold">{business.revenue}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-500">Cash Flow</p>
                  <p className="font-semibold">{business.cashFlow}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="font-semibold">{business.location}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-500">Employees</p>
                  <p className="font-semibold">{business.employees}</p>
                </div>
              </div>

              {/* Highlights */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Key Highlights:</p>
                <div className="flex flex-wrap gap-2">
                  {business.highlights.map((highlight, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={() => handleDownloadCIM(business.id)}
                  disabled={downloading}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center text-sm"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download CIM
                </button>
                
                <button
                  onClick={() => handleSelectBusiness(business.id)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center text-sm"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {selectedBusiness === business.id ? 'Selected' : 'Express Interest'}
                </button>
              </div>

              {selectedBusiness === business.id && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                  <p className="text-sm text-green-700">
                    ✓ You have expressed interest in this business. Your agent will contact you with next steps.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
          <div className="flex items-start">
            <svg className="h-6 w-6 text-yellow-600 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-medium text-yellow-900">How to Proceed</h4>
              <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                <li>• Review the business summaries above</li>
                <li>• Download CIM documents for businesses that interest you</li>
                <li>• Express interest in businesses you'd like to pursue</li>
                <li>• Your agent will arrange meetings and provide additional information</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate('/buyer/financial-statement')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Previous: Financial Statement
          </button>
          <button
            onClick={() => navigate('/buyer/upload-docs')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Next: Upload Docs
          </button>
        </div>
      </div>
    </StepGuard>
  );
};

export default BuyerCbrCim; 