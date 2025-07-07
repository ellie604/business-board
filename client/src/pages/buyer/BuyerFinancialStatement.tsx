import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { buyerService } from '../../services/buyer';
import ProgressBar from '../../components/ProgressBar';
import StepGuard from '../../components/StepGuard';

interface FinancialStatementData {
  // Personal Information
  name: string;
  preparedOn: string;
  mailingAddress: string;
  spouseName: string;
  
  // Assets
  checkingAccounts: string;
  savingsAccounts: string;
  certificatesOfDeposit: string;
  securities: string;
  notesReceivable: string;
  personalProperty: string;
  realEstate: string;
  lifeInsurance: string;
  retirementAccounts: string;
  otherAssets: string;
  
  // Liabilities
  creditCardDebt: string;
  studentLoans: string;
  vehicleLoans: string;
  realPropertyMortgages: string;
  notesPayable: string;
  otherLiabilities: string;
  
  // Certification
  signature: string;
  printName: string;
  certificationDate: string;
}

const BuyerFinancialStatement: React.FC = () => {
  const [financialData, setFinancialData] = useState<FinancialStatementData>({
    name: '',
    preparedOn: new Date().toISOString().split('T')[0],
    mailingAddress: '',
    spouseName: '',
    checkingAccounts: '',
    savingsAccounts: '',
    certificatesOfDeposit: '',
    securities: '',
    notesReceivable: '',
    personalProperty: '',
    realEstate: '',
    lifeInsurance: '',
    retirementAccounts: '',
    otherAssets: '',
    creditCardDebt: '',
    studentLoans: '',
    vehicleLoans: '',
    realPropertyMortgages: '',
    notesPayable: '',
    otherLiabilities: '',
    signature: '',
    printName: '',
    certificationDate: new Date().toISOString().split('T')[0]
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [progressData, setProgressData] = useState<any>(null);
  const navigate = useNavigate();
  
  const steps = useMemo(() => [
    'Select Listing',
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
  ], []);

  // Calculate totals
  const totalAssets = useMemo(() => {
    const assets = [
      financialData.checkingAccounts,
      financialData.savingsAccounts,
      financialData.certificatesOfDeposit,
      financialData.securities,
      financialData.notesReceivable,
      financialData.personalProperty,
      financialData.realEstate,
      financialData.lifeInsurance,
      financialData.retirementAccounts,
      financialData.otherAssets
    ];
    
    return assets.reduce((total, value) => {
      const num = parseFloat(value.replace(/[$,]/g, '')) || 0;
      return total + num;
    }, 0);
  }, [financialData]);

  const totalLiabilities = useMemo(() => {
    const liabilities = [
      financialData.creditCardDebt,
      financialData.studentLoans,
      financialData.vehicleLoans,
      financialData.realPropertyMortgages,
      financialData.notesPayable,
      financialData.otherLiabilities
    ];
    
    return liabilities.reduce((total, value) => {
      const num = parseFloat(value.replace(/[$,]/g, '')) || 0;
      return total + num;
    }, 0);
  }, [financialData]);

  const netWorth = useMemo(() => {
    return totalAssets - totalLiabilities;
  }, [totalAssets, totalLiabilities]);

  // Load existing data
  useEffect(() => {
    const loadData = async () => {
    try {
      setLoading(true);
      
        // Load progress data
      const progressRes = await buyerService.getProgress();
      setProgressData(progressRes.progress);

        // Load existing financial statement data
        const financialRes = await buyerService.getFinancialStatement();
        if (financialRes.financialStatement) {
          setFinancialData(financialRes.financialStatement);
      }
    } catch (error) {
        console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
    };

    loadData();
  }, []);

  const handleInputChange = (field: keyof FinancialStatementData, value: string) => {
    setFinancialData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCurrency = (value: string) => {
    // Remove existing formatting
    const numbers = value.replace(/[^0-9.]/g, '');
    
    // Parse and format
    const num = parseFloat(numbers);
    if (isNaN(num)) return '';
    
    return num.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  const handleCurrencyChange = (field: keyof FinancialStatementData, value: string) => {
    const formatted = formatCurrency(value);
    handleInputChange(field, formatted);
  };

  const validateForm = () => {
    const required = [
      'name', 'mailingAddress', 'signature', 'printName'
    ];
    
    for (const field of required) {
      if (!financialData[field as keyof FinancialStatementData]) {
        return false;
      }
    }
    
    return true;
  };

  const saveForLater = async () => {
    try {
      setSaving(true);
      setMessage('');
      
      await buyerService.saveFinancialStatement(financialData);
      
      setMessage('Financial statement saved successfully!');
      setMessageType('success');
    } catch (error) {
      console.error('Error saving financial statement:', error);
      setMessage('Failed to save financial statement');
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  const submitFinancialStatement = async () => {
    try {
      if (!validateForm()) {
        setMessage('Please fill in all required fields');
        setMessageType('error');
        return;
      }

      setSubmitting(true);
      setMessage('');
      
      await buyerService.submitFinancialStatement(financialData);
      
      // Refresh progress to reflect completion
      const progressRes = await buyerService.getProgress();
      setProgressData(progressRes.progress);
      
      setMessage('Financial statement submitted successfully! PDF document has been generated.');
      setMessageType('success');
    } catch (error) {
      console.error('Error submitting financial statement:', error);
      setMessage('Failed to submit financial statement');
      setMessageType('error');
    } finally {
      setSubmitting(false);
    }
  };

  const stepStatus = useMemo(() => {
    if (!progressData) return { stepCompleted: false, currentStepIndex: 0 };
    
    const stepCompleted = progressData.steps[3]?.completed || false;
    const currentStepIndex = progressData.currentStep || 0;

    return { stepCompleted, currentStepIndex };
  }, [progressData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <StepGuard stepName="Financial Statement">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <ProgressBar currentStep={progressData?.currentStep || 0} steps={steps} />
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Step 4: Financial Statement</h1>
              <p className="text-gray-600 mt-2">Complete your personal financial statement online</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Step 4 of 11
              </span>
              {stepStatus.stepCompleted ? (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Completed
                </span>
              ) : (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  In Progress
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Financial Statement Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">PERSONAL FINANCIAL STATEMENT</h2>
            <div className="border-b-2 border-gray-300 w-full mb-4"></div>
          </div>

          {/* Personal Information */}
          <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Personal Financial Statement Of: *
                </label>
                <input
                  type="text"
                  value={financialData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Full Name"
                />
            </div>
              
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prepared On:
                </label>
                <input
                  type="date"
                  value={financialData.preparedOn}
                  onChange={(e) => handleInputChange('preparedOn', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mailing Address: *
              </label>
              <textarea
                value={financialData.mailingAddress}
                onChange={(e) => handleInputChange('mailingAddress', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Complete mailing address"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Spouse's Name (if applicable):
              </label>
              <input
                type="text"
                value={financialData.spouseName}
                onChange={(e) => handleInputChange('spouseName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Spouse's name (optional)"
              />
            </div>
          </div>

          {/* Assets Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">ASSETS</h3>
            <p className="text-sm text-gray-600 mb-4">
              Provide the total value of each asset class; if you have more than one account or item, add up the individual amounts.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Checking Accounts</label>
                <input
                  type="text"
                  value={financialData.checkingAccounts}
                  onChange={(e) => handleCurrencyChange('checkingAccounts', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="$0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Savings Accounts</label>
                <input
                  type="text"
                  value={financialData.savingsAccounts}
                  onChange={(e) => handleCurrencyChange('savingsAccounts', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="$0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Certificates of Deposit</label>
                <input
                  type="text"
                  value={financialData.certificatesOfDeposit}
                  onChange={(e) => handleCurrencyChange('certificatesOfDeposit', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="$0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Securities (Stocks/Bonds/Mutual Funds)</label>
                <input
                  type="text"
                  value={financialData.securities}
                  onChange={(e) => handleCurrencyChange('securities', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="$0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes Receivable</label>
                <input
                  type="text"
                  value={financialData.notesReceivable}
                  onChange={(e) => handleCurrencyChange('notesReceivable', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="$0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Personal Property</label>
                <input
                  type="text"
                  value={financialData.personalProperty}
                  onChange={(e) => handleCurrencyChange('personalProperty', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="$0"
                />
        </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Real Estate</label>
                <input
                  type="text"
                  value={financialData.realEstate}
                  onChange={(e) => handleCurrencyChange('realEstate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="$0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Life Insurance</label>
                <input
                  type="text"
                  value={financialData.lifeInsurance}
                  onChange={(e) => handleCurrencyChange('lifeInsurance', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="$0"
                />
            </div>
            
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Retirement Accounts</label>
                <input
                  type="text"
                  value={financialData.retirementAccounts}
                  onChange={(e) => handleCurrencyChange('retirementAccounts', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="$0"
                />
            </div>
            
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Other Assets</label>
                <input
                  type="text"
                  value={financialData.otherAssets}
                  onChange={(e) => handleCurrencyChange('otherAssets', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="$0"
                />
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-300">
              <div className="text-right">
                <span className="text-lg font-bold">
                  TOTAL ASSETS: {totalAssets.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>

          {/* Liabilities Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">LIABILITIES</h3>
            <p className="text-sm text-gray-600 mb-4">
              Provide the total value of each liability type; if you have more than one of a category, add up the individual amounts.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Credit Card Debt</label>
                <input
                  type="text"
                  value={financialData.creditCardDebt}
                  onChange={(e) => handleCurrencyChange('creditCardDebt', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="$0"
                />
        </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Loans</label>
                <input
                  type="text"
                  value={financialData.studentLoans}
                  onChange={(e) => handleCurrencyChange('studentLoans', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="$0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Loans</label>
                <input
                  type="text"
                  value={financialData.vehicleLoans}
                  onChange={(e) => handleCurrencyChange('vehicleLoans', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="$0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Real Property Mortgages</label>
                <input
                  type="text"
                  value={financialData.realPropertyMortgages}
                  onChange={(e) => handleCurrencyChange('realPropertyMortgages', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="$0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes Payable/Promissory Notes</label>
                <input
                  type="text"
                  value={financialData.notesPayable}
                  onChange={(e) => handleCurrencyChange('notesPayable', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="$0"
                />
                </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Other Liabilities</label>
                <input
                  type="text"
                  value={financialData.otherLiabilities}
                  onChange={(e) => handleCurrencyChange('otherLiabilities', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="$0"
                />
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-300">
              <div className="text-right">
                <span className="text-lg font-bold">
                  TOTAL LIABILITIES: {totalLiabilities.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}
                </span>
                </div>
            </div>
          </div>

          {/* Net Worth */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">NET WORTH</h3>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-center text-lg">
                <span className="font-medium">
                  {totalAssets.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })} - {totalLiabilities.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })} = 
                </span>
                <span className="font-bold text-green-700 ml-2">
                  {netWorth.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>
              
          {/* Certification */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">CERTIFICATION</h3>
            <div className="bg-yellow-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-700">
                I certify that the information contained in this statement is true and accurate to the best of my knowledge on the date indicated. I agree that, if after submitting this statement, there are any material changes to my finances that would impact the information it contains, I have an affirmative duty to alert the person or entity receiving this statement as soon as possible. I acknowledge that, as a result of submitting this statement, further inquiries, including a credit report, may be necessary to verify the information contained, and I hereby authorize the person or entity receiving those statements to make such inquiries.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Signature: *
                </label>
                <input
                  type="text"
                  value={financialData.signature}
                  onChange={(e) => handleInputChange('signature', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type your full name as electronic signature"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date:
                </label>
                <input
                  type="date"
                  value={financialData.certificationDate}
                  onChange={(e) => handleInputChange('certificationDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
                </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Print Name: *
              </label>
              <input
                type="text"
                value={financialData.printName}
                onChange={(e) => handleInputChange('printName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Print your full legal name"
              />
            </div>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              messageType === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-700' 
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {messageType === 'success' && '✓ '}
              {messageType === 'error' && '⚠ '}
              {message}
        </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <button
              onClick={saveForLater}
              disabled={saving}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save for Later'}
                    </button>
            
                    <button
              onClick={submitFinancialStatement}
              disabled={submitting || !validateForm()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Financial Statement'}
                    </button>
          </div>
          
          <p className="text-sm text-gray-500 mt-4 text-center">
            Complete and submit to proceed to the next step
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate('/buyer/non-disclosure')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Previous: Non Disclosure
          </button>
          <button
            onClick={() => stepStatus.stepCompleted ? navigate('/buyer/cbr-cim') : null}
            disabled={!stepStatus.stepCompleted}
            className={`px-4 py-2 rounded-lg ${
              stepStatus.stepCompleted 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Next: CBR/CIM
          </button>
        </div>
      </div>
    </StepGuard>
  );
};

export default BuyerFinancialStatement; 