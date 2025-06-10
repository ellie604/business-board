import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sellerService } from '../../services/seller';
import type { SellerProgress } from '../../services/seller';
import ProgressBar from '../../components/ProgressBar';
import StepGuard from '../../components/StepGuard';

const SellerAfterSale: React.FC = () => {
  const [progress, setProgress] = useState<SellerProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tax-strategies' | 'resources' | 'next-steps'>('tax-strategies');
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

  // Mock sale data for tax calculations
  const saleData = {
    salePrice: 485000,
    netProceeds: 460000,
    originalBasisCost: 150000,
    businessHoldingPeriod: '5 years',
    estimatedCapitalGain: 310000,
    estimatedTaxLiability: 62000 // Rough estimate at 20% capital gains rate
  };

  const taxStrategies = [
    {
      strategy: 'Installment Sale',
      description: 'Spread the gain over multiple tax years by receiving payments over time',
      benefit: 'Lower annual tax burden, potential for lower tax brackets',
      consideration: 'Risk of buyer default, time value of money'
    },
    {
      strategy: 'Qualified Small Business Stock (QSBS)',
      description: 'Potential exclusion of up to $10M or 10x basis from federal taxes',
      benefit: 'Significant tax savings if business qualifies',
      consideration: 'Strict qualification requirements, 5-year holding period'
    },
    {
      strategy: '1031 Like-Kind Exchange',
      description: 'Defer capital gains by investing in similar business property',
      benefit: 'Defer all capital gains taxes',
      consideration: 'Must identify and acquire replacement property within strict timelines'
    },
    {
      strategy: 'Charitable Remainder Trust',
      description: 'Transfer assets to trust, receive income stream, claim charitable deduction',
      benefit: 'Reduce taxes, create income stream, charitable impact',
      consideration: 'Irrevocable decision, complex setup, ongoing administration'
    }
  ];

  const resources = [
    {
      type: 'Tax Professional',
      title: 'CPA/Tax Attorney Consultation',
      description: 'Schedule consultation with qualified tax professional',
      action: 'Get Referral'
    },
    {
      type: 'Financial Planning',
      title: 'Wealth Management Services',
      description: 'Professional investment and financial planning services',
      action: 'Learn More'
    },
    {
      type: 'Tax Software',
      title: 'Business Sale Tax Calculators',
      description: 'Online tools to estimate your tax liability',
      action: 'Access Tools'
    },
    {
      type: 'Legal Resources',
      title: 'Business Succession Planning',
      description: 'Legal guidance for future business ventures',
      action: 'Find Attorney'
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

  const handleCompleteJourney = async () => {
    try {
      await sellerService.updateStep(9);
      // Refresh progress
      const progressRes = await sellerService.getProgress();
      setProgress(progressRes.progress);
    } catch (err) {
      console.error('Failed to complete journey:', err);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  const stepCompleted = progress?.steps[10]?.completed;
  const currentStepIndex = progress?.currentStep || 0;
  const isCurrentStep = currentStepIndex === 10;
  const isAccessible = currentStepIndex >= 10;
  const journeyCompleted = stepCompleted;

  return (
    <StepGuard stepName="After The Sale">
      <div className="max-w-6xl mx-auto">
        {/* Progress Bar */}
        <ProgressBar currentStep={progress?.currentStep || 0} steps={steps} />
        
        {/* Step Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Step 11: After The Sale</h1>
              <p className="text-gray-600 mt-2">Tax planning strategies and resources for your sale proceeds</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Step 11 of 11
              </span>
              {journeyCompleted ? (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Journey Complete
                </span>
              ) : isCurrentStep ? (
                <button
                  onClick={handleCompleteJourney}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Complete Journey
                </button>
              ) : (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                  Not Available
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Congratulations Banner */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <svg className="h-8 w-8 text-green-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900">Congratulations on Your Successful Business Sale!</h2>
          </div>
          <p className="text-gray-700">
            You've completed the business selling process. Now it's time to optimize your financial outcome through 
            smart tax planning and wealth management strategies.
          </p>
        </div>

        {/* Tax Impact Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Estimated Tax Impact</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600">Sale Price</p>
              <p className="text-2xl font-bold text-blue-800">
                ${saleData.salePrice.toLocaleString()}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600">Net Proceeds</p>
              <p className="text-2xl font-bold text-green-800">
                ${saleData.netProceeds.toLocaleString()}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-600">Capital Gain</p>
              <p className="text-2xl font-bold text-yellow-800">
                ${saleData.estimatedCapitalGain.toLocaleString()}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-600">Est. Tax Liability</p>
              <p className="text-2xl font-bold text-red-800">
                ${saleData.estimatedTaxLiability.toLocaleString()}
              </p>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Disclaimer:</strong> This is a rough estimate. Actual tax liability depends on many factors including 
              your total income, state taxes, depreciation recapture, and available deductions. Consult with a qualified 
              tax professional for accurate calculations.
            </p>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          {/* Tabs Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('tax-strategies')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'tax-strategies'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Tax Strategies
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'resources'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Professional Resources
              </button>
              <button
                onClick={() => setActiveTab('next-steps')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'next-steps'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Next Steps
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'tax-strategies' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Tax Minimization Strategies</h2>
                <div className="space-y-6">
                  {taxStrategies.map((strategy, index) => (
                    <div key={index} className="border rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{strategy.strategy}</h3>
                      <p className="text-gray-700 mb-3">{strategy.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-green-800 mb-1">Benefits:</h4>
                          <p className="text-sm text-green-700">{strategy.benefit}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-orange-800 mb-1">Considerations:</h4>
                          <p className="text-sm text-orange-700">{strategy.consideration}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'resources' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Professional Resources</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {resources.map((resource, index) => (
                    <div key={index} className="border rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                            {resource.type}
                          </span>
                          <h3 className="text-lg font-medium text-gray-900 mt-2 mb-2">{resource.title}</h3>
                          <p className="text-gray-600 text-sm">{resource.description}</p>
                        </div>
                        <button className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                          {resource.action}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'next-steps' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Recommended Next Steps</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium">1</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Consult Tax Professional</h3>
                      <p className="text-gray-600 text-sm">
                        Schedule a meeting with a qualified CPA or tax attorney within 30 days of closing to discuss 
                        tax strategies and ensure proper reporting.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium">2</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Set Aside Tax Reserves</h3>
                      <p className="text-gray-600 text-sm">
                        Reserve approximately 20-25% of your capital gains for taxes. Consider making estimated quarterly 
                        tax payments if required.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium">3</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Investment Planning</h3>
                      <p className="text-gray-600 text-sm">
                        Meet with a financial advisor to develop an investment strategy for your proceeds that aligns 
                        with your retirement and financial goals.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium">4</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Document Organization</h3>
                      <p className="text-gray-600 text-sm">
                        Keep all closing documents, business records, and tax filings organized for future reference 
                        and tax preparation.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium">5</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Future Planning</h3>
                      <p className="text-gray-600 text-sm">
                        Consider your next ventures, retirement planning, estate planning, and other long-term 
                        financial goals now that you have additional liquidity.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Final Message */}
        {journeyCompleted && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-blue-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <h3 className="text-lg font-medium text-blue-900 mb-2">Journey Complete!</h3>
              <p className="text-blue-700">
                Thank you for using our platform. We hope you found the process smooth and successful. 
                Best wishes for your future endeavors!
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate('/seller/closing-docs')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Previous: Closing Docs
          </button>
          <button
            onClick={() => navigate('/seller')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </StepGuard>
  );
};

export default SellerAfterSale; 