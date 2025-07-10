import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sellerService } from '../../services/seller';
import type { SellerProgress } from '../../services/seller';
import ProgressBar from '../../components/ProgressBar';
import StepGuard from '../../components/StepGuard';
import { API_BASE_URL } from '../../config';

interface StaffingRow {
  titleJob: string;
  payRate: string;
  weeklyHours: string;
  yearsOfService: string;
  healthInsurance: string;
  vacationWeeks: string;
  stayingWithBusiness: string;
}

interface WeeklyStaffingRow {
  titleJob: string;
  mon: string;
  tue: string;
  wed: string;
  thu: string;
  fri: string;
  sat: string;
  sun: string;
}

interface QuestionnaireData {
  // Business Summary and History
  businessDescription: string;
  currentShareholders: string;
  companyFounded: string;
  businessHistory: string;
  majorAccomplishments: string;
  
  // Products and Services
  productsServicesDescription: string;
  salesBreakdown: string;
  seasonalProducts: string;
  futureProducts: string;
  competitionComparison: string;
  
  // Market and Customers
  marketDescription: string;
  customerProfile: string;
  geographicMarket: string;
  marketPosition: string;
  industryTrends: string;
  top5Customers: string;
  top3CustomersDescription: string;
  
  // Sales and Marketing
  marketingPlan: string;
  mostRevenueMarketing: string;
  internetPresence: string;
  futureMarketing: string;
  salesPeople: string;
  keySalesPeople: string;
  salesProcessEfficiency: string;
  
  // Competition
  competitionDescription: string;
  top3Competitors: string;
  competitionBasis: string;
  competitiveAdvantages: string;
  competitiveWeaknesses: string;
  futureCompetition: string;
  
  // Operations
  distributionProcess: string;
  ordersBillingsCollection: string;
  inventoryProcess: string;
  pricingStructure: string;
  operationDaysHours: string;
  pendingLitigation: string;
  
  // Organization - Tables
  staffingTable: StaffingRow[];
  weeklyStaffingTable: WeeklyStaffingRow[];
  
  // More Organization Questions
  keyEmployeesImportance: string;
  esopPlan: string;
  financialKeeping: string;
  
  // Owner Involvement
  ownerManagement: string;
  replacementManagement: string;
  sellingReason: string;
  requiredLicenses: string;
  
  // Facilities and Assets
  facilitiesDescription: string;
  facilitiesLeasedOwned: string;
  facilitiesUtilization: string;
  assetsCondition: string;
  capitalExpenditures: string;
  futureCapitalExpenditures: string;
  
  // Financial Overview
  financialTrends: string;
  revenueFactors: string;
  increaseRevenue: string;
  increaseProfitability: string;
  shortTermDebt: string;
  
  // Technology Overview
  technologyDescription: string;
  technologyUpToDate: string;
  newerTechnologyEfficiency: string;
  ownTechnologyReliance: string;
  
  // Other
  otherImportantInfo: string;
}

const SellerQuestionnaire: React.FC = () => {
  const [progress, setProgress] = useState<SellerProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [formData, setFormData] = useState<QuestionnaireData>({
    businessDescription: '',
    currentShareholders: '',
    companyFounded: '',
    businessHistory: '',
    majorAccomplishments: '',
    productsServicesDescription: '',
    salesBreakdown: '',
    seasonalProducts: '',
    futureProducts: '',
    competitionComparison: '',
    marketDescription: '',
    customerProfile: '',
    geographicMarket: '',
    marketPosition: '',
    industryTrends: '',
    top5Customers: '',
    top3CustomersDescription: '',
    marketingPlan: '',
    mostRevenueMarketing: '',
    internetPresence: '',
    futureMarketing: '',
    salesPeople: '',
    keySalesPeople: '',
    salesProcessEfficiency: '',
    competitionDescription: '',
    top3Competitors: '',
    competitionBasis: '',
    competitiveAdvantages: '',
    competitiveWeaknesses: '',
    futureCompetition: '',
    distributionProcess: '',
    ordersBillingsCollection: '',
    inventoryProcess: '',
    pricingStructure: '',
    operationDaysHours: '',
    pendingLitigation: '',
    staffingTable: [
      { titleJob: '', payRate: '', weeklyHours: '', yearsOfService: '', healthInsurance: '', vacationWeeks: '', stayingWithBusiness: '' }
    ],
    weeklyStaffingTable: [
      { titleJob: '', mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '' }
    ],
    keyEmployeesImportance: '',
    esopPlan: '',
    financialKeeping: '',
    ownerManagement: '',
    replacementManagement: '',
    sellingReason: '',
    requiredLicenses: '',
    facilitiesDescription: '',
    facilitiesLeasedOwned: '',
    facilitiesUtilization: '',
    assetsCondition: '',
    capitalExpenditures: '',
    futureCapitalExpenditures: '',
    financialTrends: '',
    revenueFactors: '',
    increaseRevenue: '',
    increaseProfitability: '',
    shortTermDebt: '',
    technologyDescription: '',
    technologyUpToDate: '',
    newerTechnologyEfficiency: '',
    ownTechnologyReliance: '',
    otherImportantInfo: ''
  });

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const progressRes = await sellerService.getProgress();
        setProgress(progressRes.progress);
        
        // Try to load existing questionnaire data
        const savedData = await loadSavedQuestionnaire();
        if (savedData) {
          setFormData(savedData);
        }
      } catch (err) {
        console.error('Failed to fetch progress:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const loadSavedQuestionnaire = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/seller/questionnaire`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        return data.questionnaire;
      }
    } catch (err) {
      console.error('Failed to load saved questionnaire:', err);
    }
    return null;
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);
      
      const response = await fetch(`${API_BASE_URL}/seller/questionnaire/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ questionnaire: formData })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Questionnaire saved successfully!' });
      } else {
        throw new Error('Failed to save questionnaire');
      }
    } catch (err) {
      console.error('Failed to save questionnaire:', err);
      setMessage({ type: 'error', text: 'Failed to save questionnaire. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setMessage(null);
      
      const response = await fetch(`${API_BASE_URL}/seller/questionnaire/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ questionnaire: formData })
      });

      if (response.ok) {
        const result = await response.json();
        setMessage({ type: 'success', text: 'Questionnaire submitted successfully! PDF document has been generated.' });
        
        // Only update step completion if submission was successful
      await sellerService.updateStep(3, true);
      
      // Refresh progress
      const progressRes = await sellerService.getProgress();
      setProgress(progressRes.progress);
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
        throw new Error(errorData.message || 'Failed to submit questionnaire');
      }
    } catch (err) {
      console.error('Failed to submit questionnaire:', err);
      setMessage({ 
        type: 'error', 
        text: err instanceof Error ? err.message : 'Failed to submit questionnaire. Please try again.' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof QuestionnaireData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addStaffingRow = () => {
    setFormData(prev => ({
      ...prev,
      staffingTable: [...prev.staffingTable, 
        { titleJob: '', payRate: '', weeklyHours: '', yearsOfService: '', healthInsurance: '', vacationWeeks: '', stayingWithBusiness: '' }
      ]
    }));
  };

  const removeStaffingRow = (index: number) => {
    setFormData(prev => ({
      ...prev,
      staffingTable: prev.staffingTable.filter((_, i) => i !== index)
    }));
  };

  const updateStaffingRow = (index: number, field: keyof StaffingRow, value: string) => {
    setFormData(prev => ({
      ...prev,
      staffingTable: prev.staffingTable.map((row, i) => 
        i === index ? { ...row, [field]: value } : row
      )
    }));
  };

  const addWeeklyStaffingRow = () => {
    setFormData(prev => ({
      ...prev,
      weeklyStaffingTable: [...prev.weeklyStaffingTable,
        { titleJob: '', mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '' }
      ]
    }));
  };

  const removeWeeklyStaffingRow = (index: number) => {
    setFormData(prev => ({
      ...prev,
      weeklyStaffingTable: prev.weeklyStaffingTable.filter((_, i) => i !== index)
    }));
  };

  const updateWeeklyStaffingRow = (index: number, field: keyof WeeklyStaffingRow, value: string) => {
    setFormData(prev => ({
      ...prev,
      weeklyStaffingTable: prev.weeklyStaffingTable.map((row, i) => 
        i === index ? { ...row, [field]: value } : row
      )
    }));
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  const stepCompleted = progress?.steps[3]?.completed;
  const currentStepIndex = progress?.currentStep || 0;
  const isCurrentStep = currentStepIndex === 3;

  return (
    <StepGuard stepName="Business Questionnaire">
      <div className="max-w-6xl mx-auto p-4 lg:p-0">
        {/* Progress Bar */}
        <ProgressBar currentStep={progress?.currentStep || 0} steps={steps} />
        
        {/* Header - Mobile Responsive */}
        <div className="bg-white rounded-lg shadow-md p-4 lg:p-6 mb-4 lg:mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Step 4: Business Questionnaire</h1>
              <p className="text-gray-600 mt-1 lg:mt-2">Complete the comprehensive business questionnaire</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 lg:gap-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Step 4 of 11
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

        {/* Main Questionnaire Form */}
        <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
          <div className="space-y-6 lg:space-y-8">
            {/* Business Summary and History */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-600">Business Summary and History</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    1. Provide a general (short) description of the business, its products/services, market and customers.
                  </label>
                  <textarea
                    value={formData.businessDescription}
                    onChange={(e) => handleInputChange('businessDescription', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    2. Provide list of current shareholders and percentages owned.
                </label>
                  <textarea
                    value={formData.currentShareholders}
                    onChange={(e) => handleInputChange('currentShareholders', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    3. When was the company originally founded and by whom?
                  </label>
                  <textarea
                    value={formData.companyFounded}
                    onChange={(e) => handleInputChange('companyFounded', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    4. Provide a brief history of the business – from inception to present.
                  </label>
                  <textarea
                    value={formData.businessHistory}
                    onChange={(e) => handleInputChange('businessHistory', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    5. List any major accomplishments or setbacks from inception.
                  </label>
                  <textarea
                    value={formData.majorAccomplishments}
                    onChange={(e) => handleInputChange('majorAccomplishments', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </section>

            {/* Products and Services */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-600">Products and Services</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    6. Provide a general description of each of the company's products and services.
                  </label>
                  <textarea
                    value={formData.productsServicesDescription}
                    onChange={(e) => handleInputChange('productsServicesDescription', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    7. Provide a breakdown of sales for each product and service.
                  </label>
                  <textarea
                    value={formData.salesBreakdown}
                    onChange={(e) => handleInputChange('salesBreakdown', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    8. Are any of the products/services seasonal? If so, what and why?
                  </label>
                  <textarea
                    value={formData.seasonalProducts}
                    onChange={(e) => handleInputChange('seasonalProducts', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    9. What future products/services do you plan to offer or the new owner could/should pursue to expand the business?
                  </label>
                  <textarea
                    value={formData.futureProducts}
                    onChange={(e) => handleInputChange('futureProducts', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    10. How do your products/services compare to the competition?
                  </label>
                  <textarea
                    value={formData.competitionComparison}
                    onChange={(e) => handleInputChange('competitionComparison', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </section>

            {/* Market and Customers */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-600">Market and Customers</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    11. Provide general description of the market?
                  </label>
                  <textarea
                    value={formData.marketDescription}
                    onChange={(e) => handleInputChange('marketDescription', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    12. What is the typical customer profile?
                  </label>
                  <textarea
                    value={formData.customerProfile}
                    onChange={(e) => handleInputChange('customerProfile', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    13. What geographic market is the company servicing?
                  </label>
                  <textarea
                    value={formData.geographicMarket}
                    onChange={(e) => handleInputChange('geographicMarket', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    14. Please provide your market position – how much market share?
                  </label>
                  <textarea
                    value={formData.marketPosition}
                    onChange={(e) => handleInputChange('marketPosition', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    15. Are there any industry trends that could affect the company – positively or negatively?
                  </label>
                  <textarea
                    value={formData.industryTrends}
                    onChange={(e) => handleInputChange('industryTrends', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    16. List top 5 customers and their percentage of sales for last full year and projected year.
                  </label>
                  <textarea
                    value={formData.top5Customers}
                    onChange={(e) => handleInputChange('top5Customers', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    17. Provide description of the top 3 customers including length of relationship, strength of relationship and contracts (if any).
                  </label>
                  <textarea
                    value={formData.top3CustomersDescription}
                    onChange={(e) => handleInputChange('top3CustomersDescription', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </section>

            {/* Sales and Marketing */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-600">Sales and Marketing</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    18. Describe the company's general marketing plan. List each type of marketing media.
                  </label>
                  <textarea
                    value={formData.marketingPlan}
                    onChange={(e) => handleInputChange('marketingPlan', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    19. What type of marketing creates the most revenue?
                  </label>
                  <textarea
                    value={formData.mostRevenueMarketing}
                    onChange={(e) => handleInputChange('mostRevenueMarketing', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    20. Does the company have an Internet presence?
                  </label>
                  <textarea
                    value={formData.internetPresence}
                    onChange={(e) => handleInputChange('internetPresence', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    21. What marketing/advertising will/should be considered in the future?
                  </label>
                  <textarea
                    value={formData.futureMarketing}
                    onChange={(e) => handleInputChange('futureMarketing', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    22. Does the company utilize sales people? If so, please describe the selling process?
                  </label>
                  <textarea
                    value={formData.salesPeople}
                    onChange={(e) => handleInputChange('salesPeople', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    23. Are there any key sales people? If so, is there an employee contract or non-compete?
                  </label>
                  <textarea
                    value={formData.keySalesPeople}
                    onChange={(e) => handleInputChange('keySalesPeople', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    24. What could make the sales process more efficient?
                  </label>
                  <textarea
                    value={formData.salesProcessEfficiency}
                    onChange={(e) => handleInputChange('salesProcessEfficiency', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </section>

            {/* Competition */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-600">Competition</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    25. Provide general description of the competition.
                  </label>
                  <textarea
                    value={formData.competitionDescription}
                    onChange={(e) => handleInputChange('competitionDescription', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    26. List top 3 direct competitors and give brief description of each.
                  </label>
                  <textarea
                    value={formData.top3Competitors}
                    onChange={(e) => handleInputChange('top3Competitors', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    27. On what basis do you compete with your competitors (price, service, etc.)?
                  </label>
                  <textarea
                    value={formData.competitionBasis}
                    onChange={(e) => handleInputChange('competitionBasis', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    28. What are your competitive advantages over the competition?
                  </label>
                  <textarea
                    value={formData.competitiveAdvantages}
                    onChange={(e) => handleInputChange('competitiveAdvantages', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    29. What are your weaknesses vs. the competition?
                  </label>
                  <textarea
                    value={formData.competitiveWeaknesses}
                    onChange={(e) => handleInputChange('competitiveWeaknesses', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    30. Do you see any future direct and/or indirect competition – if so, from where and who?
                  </label>
                  <textarea
                    value={formData.futureCompetition}
                    onChange={(e) => handleInputChange('futureCompetition', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </section>

            {/* Operations */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-600">Operations</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    31. Explain product/service distribution from initial call to collection.
                  </label>
                  <textarea
                    value={formData.distributionProcess}
                    onChange={(e) => handleInputChange('distributionProcess', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    32. Explain orders/billings/collection process and terms (A/R & A/P).
                  </label>
                  <textarea
                    value={formData.ordersBillingsCollection}
                    onChange={(e) => handleInputChange('ordersBillingsCollection', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    33. Describe the inventory process – storage, turnover, etc.
                  </label>
                  <textarea
                    value={formData.inventoryProcess}
                    onChange={(e) => handleInputChange('inventoryProcess', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    34. Describe pricing structure and future pricing considerations, and bidding process, if any, for obtaining work.
                  </label>
                  <textarea
                    value={formData.pricingStructure}
                    onChange={(e) => handleInputChange('pricingStructure', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    35. List days and hours of operation.
                  </label>
                  <textarea
                    value={formData.operationDaysHours}
                    onChange={(e) => handleInputChange('operationDaysHours', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    36. Are there any pending litigation matters or current lawsuits? If so, explain.
                  </label>
                  <textarea
                    value={formData.pendingLitigation}
                    onChange={(e) => handleInputChange('pendingLitigation', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </section>

            {/* Organization */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-600">Organization</h2>
              
              {/* Staffing Table */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">37. Please complete the following chart for each part-time and full-time employee:</h3>
                <h4 className="text-md font-medium mb-3">Staffing, Wages, and Benefits (expanded, if required)</h4>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="border border-gray-300 px-2 py-2 text-xs font-medium text-gray-700">Title/Job Classification</th>
                        <th className="border border-gray-300 px-2 py-2 text-xs font-medium text-gray-700">Pay Rate</th>
                        <th className="border border-gray-300 px-2 py-2 text-xs font-medium text-gray-700">Weekly Hours</th>
                        <th className="border border-gray-300 px-2 py-2 text-xs font-medium text-gray-700">Years of Service</th>
                        <th className="border border-gray-300 px-2 py-2 text-xs font-medium text-gray-700">Health Insurance</th>
                        <th className="border border-gray-300 px-2 py-2 text-xs font-medium text-gray-700">Vacation (Weeks)</th>
                        <th className="border border-gray-300 px-2 py-2 text-xs font-medium text-gray-700">Staying With Business?</th>
                        <th className="border border-gray-300 px-2 py-2 text-xs font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.staffingTable.map((row, index) => (
                        <tr key={index}>
                          <td className="border border-gray-300 p-1">
                <input
                  type="text"
                              value={row.titleJob}
                              onChange={(e) => updateStaffingRow(index, 'titleJob', e.target.value)}
                              className="w-full px-2 py-1 text-sm border-0 focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="border border-gray-300 p-1">
                            <input
                              type="text"
                              value={row.payRate}
                              onChange={(e) => updateStaffingRow(index, 'payRate', e.target.value)}
                              className="w-full px-2 py-1 text-sm border-0 focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="border border-gray-300 p-1">
                            <input
                              type="text"
                              value={row.weeklyHours}
                              onChange={(e) => updateStaffingRow(index, 'weeklyHours', e.target.value)}
                              className="w-full px-2 py-1 text-sm border-0 focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="border border-gray-300 p-1">
                            <input
                              type="text"
                              value={row.yearsOfService}
                              onChange={(e) => updateStaffingRow(index, 'yearsOfService', e.target.value)}
                              className="w-full px-2 py-1 text-sm border-0 focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="border border-gray-300 p-1">
                            <input
                              type="text"
                              value={row.healthInsurance}
                              onChange={(e) => updateStaffingRow(index, 'healthInsurance', e.target.value)}
                              className="w-full px-2 py-1 text-sm border-0 focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="border border-gray-300 p-1">
                            <input
                              type="text"
                              value={row.vacationWeeks}
                              onChange={(e) => updateStaffingRow(index, 'vacationWeeks', e.target.value)}
                              className="w-full px-2 py-1 text-sm border-0 focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="border border-gray-300 p-1">
                            <input
                              type="text"
                              value={row.stayingWithBusiness}
                              onChange={(e) => updateStaffingRow(index, 'stayingWithBusiness', e.target.value)}
                              className="w-full px-2 py-1 text-sm border-0 focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="border border-gray-300 p-1 text-center">
                            {formData.staffingTable.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeStaffingRow(index)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Remove
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <button
                  type="button"
                  onClick={addStaffingRow}
                  className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  Add Row
                </button>
              </div>

              {/* Weekly Staffing Table */}
              <div className="mb-6">
                <h4 className="text-md font-medium mb-3">Weekly Staffing (expanded, if required)</h4>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="border border-gray-300 px-2 py-2 text-xs font-medium text-gray-700">Title/Job Classification</th>
                        <th className="border border-gray-300 px-2 py-2 text-xs font-medium text-gray-700">Mon</th>
                        <th className="border border-gray-300 px-2 py-2 text-xs font-medium text-gray-700">Tue</th>
                        <th className="border border-gray-300 px-2 py-2 text-xs font-medium text-gray-700">Wed</th>
                        <th className="border border-gray-300 px-2 py-2 text-xs font-medium text-gray-700">Thu</th>
                        <th className="border border-gray-300 px-2 py-2 text-xs font-medium text-gray-700">Fri</th>
                        <th className="border border-gray-300 px-2 py-2 text-xs font-medium text-gray-700">Sat</th>
                        <th className="border border-gray-300 px-2 py-2 text-xs font-medium text-gray-700">Sun</th>
                        <th className="border border-gray-300 px-2 py-2 text-xs font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.weeklyStaffingTable.map((row, index) => (
                        <tr key={index}>
                          <td className="border border-gray-300 p-1">
                            <input
                              type="text"
                              value={row.titleJob}
                              onChange={(e) => updateWeeklyStaffingRow(index, 'titleJob', e.target.value)}
                              className="w-full px-2 py-1 text-sm border-0 focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="border border-gray-300 p-1">
                            <input
                              type="text"
                              value={row.mon}
                              onChange={(e) => updateWeeklyStaffingRow(index, 'mon', e.target.value)}
                              className="w-full px-2 py-1 text-sm border-0 focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="border border-gray-300 p-1">
                            <input
                              type="text"
                              value={row.tue}
                              onChange={(e) => updateWeeklyStaffingRow(index, 'tue', e.target.value)}
                              className="w-full px-2 py-1 text-sm border-0 focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="border border-gray-300 p-1">
                            <input
                              type="text"
                              value={row.wed}
                              onChange={(e) => updateWeeklyStaffingRow(index, 'wed', e.target.value)}
                              className="w-full px-2 py-1 text-sm border-0 focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="border border-gray-300 p-1">
                            <input
                              type="text"
                              value={row.thu}
                              onChange={(e) => updateWeeklyStaffingRow(index, 'thu', e.target.value)}
                              className="w-full px-2 py-1 text-sm border-0 focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="border border-gray-300 p-1">
                            <input
                              type="text"
                              value={row.fri}
                              onChange={(e) => updateWeeklyStaffingRow(index, 'fri', e.target.value)}
                              className="w-full px-2 py-1 text-sm border-0 focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="border border-gray-300 p-1">
                            <input
                              type="text"
                              value={row.sat}
                              onChange={(e) => updateWeeklyStaffingRow(index, 'sat', e.target.value)}
                              className="w-full px-2 py-1 text-sm border-0 focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="border border-gray-300 p-1">
                            <input
                              type="text"
                              value={row.sun}
                              onChange={(e) => updateWeeklyStaffingRow(index, 'sun', e.target.value)}
                              className="w-full px-2 py-1 text-sm border-0 focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="border border-gray-300 p-1 text-center">
                            {formData.weeklyStaffingTable.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeWeeklyStaffingRow(index)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Remove
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <button
                  type="button"
                  onClick={addWeeklyStaffingRow}
                  className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  Add Row
                </button>
              </div>

              {/* Additional Organization Questions */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    38. Describe the importance of any key employees, will they stay, and how hard will they be to replace?
                  </label>
                  <textarea
                    value={formData.keyEmployeesImportance}
                    onChange={(e) => handleInputChange('keyEmployeesImportance', e.target.value)}
                    rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    39. Is there an Employee Stock Ownership Plan (ESOP)? If so, when was it established?
                </label>
                  <textarea
                    value={formData.esopPlan}
                    onChange={(e) => handleInputChange('esopPlan', e.target.value)}
                    rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    40. Who keeps the financials on a daily basis? How is payroll done? How often do you get P&L statements? Who does them? Who does your taxes?
                </label>
                  <textarea
                    value={formData.financialKeeping}
                    onChange={(e) => handleInputChange('financialKeeping', e.target.value)}
                    rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              </div>
            </section>
              
            {/* Owner Involvement */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-600">Owner Involvement</h2>
              <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    41. Do the owner(s) actively manage? If yes, please list primary duties and hours worked per week?
                </label>
                  <textarea
                    value={formData.ownerManagement}
                    onChange={(e) => handleInputChange('ownerManagement', e.target.value)}
                    rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    42. If the owner(s) will need to be replaced with new management, describe the job title, salary, etc. it would take to replace the owner(s)?
                </label>
                  <textarea
                    value={formData.replacementManagement}
                    onChange={(e) => handleInputChange('replacementManagement', e.target.value)}
                    rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    43. What is the owner(s) reason for selling?
                </label>
                  <textarea
                    value={formData.sellingReason}
                    onChange={(e) => handleInputChange('sellingReason', e.target.value)}
                    rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
              </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    44. What licenses are required to operate this business?
                  </label>
                  <textarea
                    value={formData.requiredLicenses}
                    onChange={(e) => handleInputChange('requiredLicenses', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
            </div>
              </div>
            </section>
            
            {/* Facilities and Assets */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-600">Facilities and Assets</h2>
              <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                    45. Describe the company's facilities – square ft., location, etc.
              </label>
              <textarea
                    value={formData.facilitiesDescription}
                    onChange={(e) => handleInputChange('facilitiesDescription', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    46. Are the facilities leased or owned? If leased, please describe lease terms.
                  </label>
                  <textarea
                    value={formData.facilitiesLeasedOwned}
                    onChange={(e) => handleInputChange('facilitiesLeasedOwned', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    47. What percentage of the company's facilities is fully utilized? Is there room to expand?
                  </label>
                  <textarea
                    value={formData.facilitiesUtilization}
                    onChange={(e) => handleInputChange('facilitiesUtilization', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    48. Describe the general condition of the company's assets.
                  </label>
                  <textarea
                    value={formData.assetsCondition}
                    onChange={(e) => handleInputChange('assetsCondition', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    49. Approximately how much has the company spent each year on capital expenditures/improvements?
                  </label>
                  <textarea
                    value={formData.capitalExpenditures}
                    onChange={(e) => handleInputChange('capitalExpenditures', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    50. To reach the projected sales, approximately how much will the company have to spend on capital expenditures/improvements each year? Please describe?
                  </label>
                  <textarea
                    value={formData.futureCapitalExpenditures}
                    onChange={(e) => handleInputChange('futureCapitalExpenditures', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </section>

            {/* Financial Overview */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-600">Financial Overview</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    51. Describe financial trends over the last 5 years.
                  </label>
                  <textarea
                    value={formData.financialTrends}
                    onChange={(e) => handleInputChange('financialTrends', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    52. What factors have affected revenue and/or profitability?
                  </label>
                  <textarea
                    value={formData.revenueFactors}
                    onChange={(e) => handleInputChange('revenueFactors', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    53. What could management do to increase revenue?
                  </label>
                  <textarea
                    value={formData.increaseRevenue}
                    onChange={(e) => handleInputChange('increaseRevenue', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    54. What could management do to increase profitability?
                  </label>
                  <textarea
                    value={formData.increaseProfitability}
                    onChange={(e) => handleInputChange('increaseProfitability', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    55. Does the company have to rely on short-term debt for working capital purposes? Please explain the nature of the accounts receivable.
                  </label>
                  <textarea
                    value={formData.shortTermDebt}
                    onChange={(e) => handleInputChange('shortTermDebt', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </section>

            {/* Technology Overview */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-600">Technology Overview</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    56. Describe technology used in daily operations.
                  </label>
                  <textarea
                    value={formData.technologyDescription}
                    onChange={(e) => handleInputChange('technologyDescription', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    57. Is technology up to date?
                  </label>
                  <textarea
                    value={formData.technologyUpToDate}
                    onChange={(e) => handleInputChange('technologyUpToDate', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    58. Would newer technology increase efficiency?
                  </label>
                  <textarea
                    value={formData.newerTechnologyEfficiency}
                    onChange={(e) => handleInputChange('newerTechnologyEfficiency', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    59. Does company rely upon its own technology and if so, how often is it updated?
                  </label>
                  <textarea
                    value={formData.ownTechnologyReliance}
                    onChange={(e) => handleInputChange('ownTechnologyReliance', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    60. Please list any other important factors not included above?
                  </label>
                  <textarea
                    value={formData.otherImportantInfo}
                    onChange={(e) => handleInputChange('otherImportantInfo', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
              </div>
            </section>
            
            {/* Save and Submit Buttons */}
            <div className="flex justify-between items-center pt-6 border-t">
              <div className="flex space-x-4">
              <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save for Later'
                  )}
                </button>
                
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit Questionnaire'
                )}
              </button>
            </div>
              
              <div className="text-sm text-gray-500">
                {stepCompleted ? 'Questionnaire completed' : 'Complete and submit to proceed'}
              </div>
            </div>
            
            {/* Message Display */}
            {message && (
              <div className={`rounded-lg p-4 mt-4 ${
                message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}>
                {message.text}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate('/seller/listing-agreement')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Previous: Listing Agreement
          </button>
          <button
            onClick={() => navigate('/seller/financials')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Next: Financials
          </button>
        </div>
      </div>
    </StepGuard>
  );
};

export default SellerQuestionnaire; 