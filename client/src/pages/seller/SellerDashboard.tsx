import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { sellerService } from '../../services/seller';
import type { DashboardStats, Listing, SellerProgress } from '../../services/seller';
import ProgressBar from '../../components/ProgressBar';
import logo from '../../assets/california-business-sales-logo.png';

const SellerDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [progress, setProgress] = useState<SellerProgress | null>(null);
  const [selectedListing, setSelectedListing] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const steps = [
    'Home',
    'Contact your agent via messages',
    'Download your listing agreement',
    'Fill out your business questionnaire Online',
    'Upload your Financial documents',
    'Buyer Activity: Up to the minute updates on buyers',
    'Download your purchase contract (once we have an accepted buyer offer)',
    'Upload due diligence documents',
    'Pre Close Checklist',
    'Download Closing document once we are closed',
    'After the Sale: Learn about ways mitigate taxes on the proceeds'
  ];

  const menuItems = [
    { label: 'Home', path: '/seller', stepId: null },
    { label: 'Messages', path: '/seller/messages', stepId: 1 },
    { label: 'Listing Agreement', path: '/seller/listing-agreement', stepId: 2 },
    { label: 'Questionnaire', path: '/seller/questionnaire', stepId: 3 },
    { label: 'Financials', path: '/seller/financials', stepId: 4 },
    { label: 'Buyer Activity', path: '/seller/buyer-activity', stepId: 5 },
    { label: 'Purchase Agreement', path: '/seller/purchase-agreement', stepId: 6 },
    { label: 'Due Diligence', path: '/seller/due-diligence', stepId: 7 },
    { label: 'Pre Close Checklist', path: '/seller/pre-close-checklist', stepId: 8 },
    { label: 'Closing Docs', path: '/seller/closing-docs', stepId: 9 },
    { label: 'After The Sale', path: '/seller/after-sale', stepId: 10 }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await sellerService.getDashboardStats();
        setStats(statsRes);
        
        // Re-fetch progress data
        const progressRes = await sellerService.getProgress();
        setProgress(progressRes.progress);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleListingSelect = async (listingId: string) => {
    try {
      await sellerService.selectListing(listingId);
      setSelectedListing(listingId);
      // 重新获取进度数据
      const progressRes = await sellerService.getProgress();
      setProgress(progressRes.progress);
    } catch (err) {
      console.error('Failed to select listing:', err);
    }
  };

  const handleMenuClick = (item: any) => {
    if (item.stepId === null) {
      // Home page is always accessible
      navigate(item.path);
      return;
    }

    const currentStepIndex = getCurrentStepIndex();
    
    // Check if step is truly accessible (for StepGuard)
    const isAccessible = item.stepId <= currentStepIndex;
    
    // Always navigate, but pass accessibility state
    navigate(item.path, { 
      state: { 
        stepAccessible: isAccessible,
        currentStep: currentStepIndex
      } 
    });
  };

  const getCurrentStepIndex = () => {
    return progress?.currentStep || 0;
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="flex w-full min-h-screen bg-gray-100">
      {/* Left Navigation */}
      <div className="w-64 min-h-screen bg-white shadow-lg flex-shrink-0">
        {/* Logo */}
        <div className="p-6">
          <img 
            src={logo}
            alt="California Business Sales" 
            className="w-full"
          />
        </div>

        {/* Navigation Menu */}
        <nav className="mt-6">
          {menuItems.map((item, index) => {
            const currentStepIndex = progress?.currentStep || 0;
            const stepInfo = progress?.steps.find(s => s.id === item.stepId);
            const isCompleted = stepInfo?.completed || false;
            const isCurrentStep = item.stepId === currentStepIndex;
            const isAccessible = item.stepId === null || item.stepId <= currentStepIndex;
            
            return (
              <button
                key={index}
                onClick={() => handleMenuClick(item)}
                className={`block w-full px-6 py-4 text-base text-left relative hover:bg-gray-50 ${
                  location.pathname === item.path
                    ? 'bg-blue-100 text-blue-800 font-medium'
                    : isCompleted
                    ? 'text-green-600'
                    : isCurrentStep
                    ? 'text-yellow-600'
                    : isAccessible
                    ? 'text-gray-600'
                    : 'text-gray-400'
                }`}
              >
                {item.label}
                {isCompleted && (
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
                {isCurrentStep && !isCompleted && (
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8">
        <Outlet />
        {location.pathname === '/seller' && (
          <>
            <h1 className="text-3xl font-bold mb-8">Welcome {'{seller Name}'} to Your Customized Dashboard</h1>
            
            {/* Progress Bar */}
            <ProgressBar currentStep={getCurrentStepIndex()} steps={steps} />

            {/* Listing Selection */}
            {listings.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h3 className="text-xl font-semibold mb-4">Select Your Listing for This Transaction</h3>
                <p className="text-gray-600 mb-4">
                  Choose which listing this transaction is for. All uploaded documents will be associated with the selected listing.
                </p>
                <select
                  value={selectedListing}
                  onChange={(e) => handleListingSelect(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Please select a listing...</option>
                  {listings.map((listing) => (
                    <option key={listing.id} value={listing.id}>
                      {listing.title} - ${listing.price.toLocaleString()} ({listing.status})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">
                Your dynamic progress bar on top will show you the progress on
                The sell of your business in real time as it progresses.
              </h2>
              <p className="mb-4">Please select from the menu items on the left.</p>
              <p className="mb-4">From your custom seller's dashboard to do the following:</p>
              <ol className="list-decimal pl-6 space-y-2">
                {steps.slice(1).map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard; 