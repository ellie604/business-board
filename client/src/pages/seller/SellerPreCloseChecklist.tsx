import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sellerService } from '../../services/seller';
import type { SellerProgress } from '../../services/seller';
import ProgressBar from '../../components/ProgressBar';
import StepGuard from '../../components/StepGuard';

const SellerPreCloseChecklist: React.FC = () => {
  const [progress, setProgress] = useState<SellerProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
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

  // Pre-closing checklist items
  const checklistCategories = [
    {
      category: 'Legal & Documentation',
      items: [
        { id: 'legal-1', task: 'Review and sign all purchase agreement amendments', required: true },
        { id: 'legal-2', task: 'Provide executed employment agreements for key employees', required: true },
        { id: 'legal-3', task: 'Transfer all licenses and permits to buyer', required: true },
        { id: 'legal-4', task: 'Complete corporate resolutions for asset sale', required: true },
        { id: 'legal-5', task: 'Obtain required third-party consents', required: false }
      ]
    },
    {
      category: 'Financial Preparation',
      items: [
        { id: 'financial-1', task: 'Reconcile all accounts receivable and payable', required: true },
        { id: 'financial-2', task: 'Prepare final financial statements', required: true },
        { id: 'financial-3', task: 'Calculate working capital adjustments', required: true },
        { id: 'financial-4', task: 'Set up escrow account for closing funds', required: true },
        { id: 'financial-5', task: 'Prepare payoff letters for all business debts', required: true }
      ]
    },
    {
      category: 'Operational Handover',
      items: [
        { id: 'ops-1', task: 'Prepare detailed handover documentation', required: true },
        { id: 'ops-2', task: 'Schedule key employee introduction meetings', required: true },
        { id: 'ops-3', task: 'Transfer vendor and supplier relationships', required: true },
        { id: 'ops-4', task: 'Update customer notification plan', required: false },
        { id: 'ops-5', task: 'Prepare inventory and equipment lists', required: true }
      ]
    },
    {
      category: 'Administrative Tasks',
      items: [
        { id: 'admin-1', task: 'Notify insurance providers of ownership change', required: true },
        { id: 'admin-2', task: 'Arrange for final utility readings', required: true },
        { id: 'admin-3', task: 'Update bank account signatories', required: true },
        { id: 'admin-4', task: 'Prepare employee termination/transfer notices', required: true },
        { id: 'admin-5', task: 'Archive important business records', required: false }
      ]
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const progressRes = await sellerService.getProgress();
        setProgress(progressRes.progress);
        
        // Mock some completed checklist items
        setCheckedItems(['legal-1', 'financial-1', 'financial-2', 'ops-1', 'admin-1']);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCheckItem = async (itemId: string) => {
    if (checkedItems.includes(itemId)) {
      setCheckedItems(prev => prev.filter(id => id !== itemId));
    } else {
      setCheckedItems(prev => [...prev, itemId]);
      
      // If this is the first item checked, mark step as started
      if (checkedItems.length === 0) {
        try {
          await sellerService.updateStep(8);
          const progressRes = await sellerService.getProgress();
          setProgress(progressRes.progress);
        } catch (err) {
          console.error('Failed to update step:', err);
        }
      }
    }
  };

  const getCompletionPercentage = () => {
    const totalRequiredItems = checklistCategories.reduce((sum, cat) => 
      sum + cat.items.filter(item => item.required).length, 0
    );
    const completedRequiredItems = checkedItems.filter(itemId => {
      const item = checklistCategories
        .flatMap(cat => cat.items)
        .find(item => item.id === itemId);
      return item?.required;
    }).length;
    
    return Math.round((completedRequiredItems / totalRequiredItems) * 100);
  };

  const allRequiredCompleted = () => {
    const requiredItems = checklistCategories
      .flatMap(cat => cat.items)
      .filter(item => item.required)
      .map(item => item.id);
    
    return requiredItems.every(itemId => checkedItems.includes(itemId));
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  const stepCompleted = progress?.steps[8]?.completed;
  const currentStepIndex = progress?.currentStep || 0;
  const isCurrentStep = currentStepIndex === 8;
  const isAccessible = currentStepIndex >= 8;

  return (
    <StepGuard stepName="Pre Close Checklist">
      <div className="max-w-6xl mx-auto">
        {/* Progress Bar */}
        <ProgressBar currentStep={progress?.currentStep || 0} steps={steps} />
        
        {/* Step Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Step 9: Pre Close Checklist</h1>
              <p className="text-gray-600 mt-2">Complete all required tasks before the closing date</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Step 9 of 11
              </span>
              {stepCompleted || allRequiredCompleted() ? (
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

        {/* Closing Timeline */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <svg className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-blue-800">Closing Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-blue-600">Scheduled Closing Date</p>
              <p className="font-medium text-blue-800">February 28, 2024</p>
            </div>
            <div>
              <p className="text-sm text-blue-600">Days Until Closing</p>
              <p className="font-medium text-blue-800">12 days</p>
            </div>
            <div>
              <p className="text-sm text-blue-600">Closing Location</p>
              <p className="font-medium text-blue-800">SecureTitle Escrow Services</p>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Checklist Progress</h2>
            <span className="text-sm text-gray-500">
              {checkedItems.length} of {checklistCategories.reduce((sum, cat) => sum + cat.items.length, 0)} tasks completed
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${getCompletionPercentage()}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">{getCompletionPercentage()}% of required tasks completed</p>
        </div>

        {/* Checklist Categories */}
        <div className="space-y-6">
          {checklistCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">{category.category}</h3>
              
              <div className="space-y-3">
                {category.items.map((item) => {
                  const isChecked = checkedItems.includes(item.id);
                  return (
                    <div key={item.id} className="flex items-start space-x-3">
                      <button
                        onClick={() => handleCheckItem(item.id)}
                        className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          isChecked 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'border-gray-300 hover:border-blue-500'
                        }`}
                      >
                        {isChecked && (
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                      
                      <div className="flex-1">
                        <p className={`text-sm ${isChecked ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {item.task}
                        </p>
                        <div className="flex items-center mt-1">
                          {item.required ? (
                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                              Required
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">
                              Optional
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
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
              <h4 className="font-medium text-yellow-900">Critical Deadline</h4>
              <p className="text-sm text-yellow-700 mt-1">
                All required tasks must be completed before the closing date. Failure to complete required items 
                may delay or jeopardize the closing. Contact your agent immediately if you need assistance with any tasks.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate('/seller/due-diligence')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Previous: Due Diligence
          </button>
          <button
            onClick={() => navigate('/seller/closing-docs')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Next: Closing Docs
          </button>
        </div>
      </div>
    </StepGuard>
  );
};

export default SellerPreCloseChecklist; 