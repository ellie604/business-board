import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { buyerService } from '../../services/buyer';
import type { DashboardStats, ExtendedListing, BuyerProgress, CurrentListingResponse } from '../../services/buyer';
import ProgressBar from '../../components/ProgressBar';
import logo from '../../assets/california-business-sales-logo.png';

// Simple hooks replacement
const useAuth = () => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  return { user };
};

const useNotification = () => {
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    // Simple alert-based notification
    if (type === 'error') {
      alert(`Error: ${message}`);
    } else {
      alert(message);
    }
  };
  return { showNotification };
};

const BuyerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [listings, setListings] = useState<ExtendedListing[]>([]);
  const [progress, setProgress] = useState<BuyerProgress | null>(null);
  const [currentListing, setCurrentListing] = useState<ExtendedListing | null>(null);
  const [needsSelection, setNeedsSelection] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const steps = [
    'Home',
    'Contact your agent via messages',
    'Fill out a Non Disclosure agreement online',
    'Fill out a simple financial statement online',
    'Download a CBR or CIM for the business your interested in',
    'Upload documents for loan pre-approval',
    'Download your purchase contract (once we have an accepted offer)',
    'Request & Download Due Diligence documents',
    'Pre Close Checklist: Check off your to do list',
    'Download Closing document once we are closed',
    'After the Sale: Tips to make your transition smoother'
  ];

  const menuItems = [
    { label: 'Home', path: '/buyer', stepId: 0 },
    { label: 'Messages', path: '/buyer/messages', stepId: 1 },
    { label: 'Non Disclosure', path: '/buyer/non-disclosure', stepId: 2 },
    { label: 'Financial Statement', path: '/buyer/financial-statement', stepId: 3 },
    { label: 'CBR/CIM', path: '/buyer/cbr-cim', stepId: 4 },
    { label: 'Upload Docs', path: '/buyer/upload-docs', stepId: 5 },
    { label: 'Purchase Contract', path: '/buyer/purchase-contract', stepId: 6 },
    { label: 'Due Diligence', path: '/buyer/due-diligence', stepId: 7 },
    { label: 'Pre Close Checklist', path: '/buyer/pre-close-checklist', stepId: 8 },
    { label: 'Closing Docs', path: '/buyer/closing-docs', stepId: 9 },
    { label: 'After The Sale', path: '/buyer/after-sale', stepId: 10 }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Load all data: stats, listings, progress, and current selection
      const [statsRes, listingsRes, progressRes, currentListingData] = await Promise.all([
        buyerService.getDashboardStats(),
        buyerService.getListings(),
        buyerService.getProgress(),
        buyerService.getCurrentListing()
      ]);
      
      setStats(statsRes);
      setListings(Array.isArray(listingsRes) ? listingsRes : []); // 确保listings是数组
      setProgress(progressRes.progress);
      
      const currentData = currentListingData as CurrentListingResponse;
      setCurrentListing(currentData.listing);
      setNeedsSelection(currentData.needsSelection);
      
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Dashboard error:', err);
      showNotification('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectListing = async (listingId: string) => {
    try {
      setSelecting(true);
      
      await buyerService.selectListing(listingId);
      
      // Reload current listing data and progress
      const [currentListingData, progressRes] = await Promise.all([
        buyerService.getCurrentListing(),
        buyerService.getProgress()
      ]);
      
      const currentData = currentListingData as CurrentListingResponse;
      setCurrentListing(currentData.listing);
      setNeedsSelection(false);
      setProgress(progressRes.progress);
      
      showNotification('Listing selected successfully! You can now proceed with the process.', 'success');
      
    } catch (err) {
      console.error('Error selecting listing:', err);
      showNotification('Failed to select listing', 'error');
    } finally {
      setSelecting(false);
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

  // Helper functions for formatting
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'under_contract':
        return 'bg-blue-100 text-blue-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
        {location.pathname === '/buyer' && (
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome {user?.name || 'Buyer'} to Your Customized Dashboard
              </h1>
              <p className="text-gray-600">
                Browse business opportunities and track your purchase process
              </p>
            </div>

            {/* Current Selection Status */}
            {currentListing && !needsSelection && (
              <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">
                      Currently Interested In
                    </h3>
                    <p className="text-blue-700">{currentListing.title}</p>
                    <p className="text-sm text-blue-600">
                      {formatPrice(currentListing.price)}
                      {currentListing.seller && ` • Seller: ${currentListing.seller.name}`}
                    </p>
                  </div>
                  <button
                    onClick={() => setNeedsSelection(true)}
                    className="px-4 py-2 text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 transition-colors"
                  >
                    Change Selection
                  </button>
                </div>
              </div>
            )}

            {/* Progress Bar */}
            <ProgressBar currentStep={getCurrentStepIndex()} steps={steps} />

            {/* Listing Selection */}
            {(needsSelection || !currentListing) && (
              <div className="mb-8">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                    Select a Business to Continue
                  </h3>
                  <p className="text-yellow-700">
                    Please select which business you're interested in purchasing. All documents and progress will be tied to this selection.
                  </p>
                </div>
              </div>
            )}

            {/* Available Listings Grid */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Available Business Opportunities</h2>
              
              {listings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No businesses available</h3>
                  <p className="text-gray-500">Contact your agent to explore available business opportunities.</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {listings.map((listing) => (
                    <div
                      key={listing.id}
                      className={`bg-white rounded-lg shadow-md border transition-all duration-200 hover:shadow-lg ${
                        currentListing?.id === listing.id && !needsSelection
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                            {listing.title}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(listing.status)}`}>
                            {listing.status.replace('_', ' ')}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {listing.description}
                        </p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Price:</span>
                            <span className="text-sm font-medium text-gray-900">
                              {formatPrice(listing.price)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Listed:</span>
                            <span className="text-sm text-gray-700">
                              {formatDate(listing.createdAt)}
                            </span>
                          </div>
                          {listing.seller && (
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500">Seller:</span>
                              <span className="text-sm text-gray-700">
                                {listing.seller.name}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Action Button */}
                        {(needsSelection || !currentListing) && (
                          <button
                            onClick={() => handleSelectListing(listing.id)}
                            disabled={selecting}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {selecting ? 'Selecting...' : 'Express Interest'}
                          </button>
                        )}

                        {currentListing?.id === listing.id && !needsSelection && (
                          <div className="w-full bg-blue-100 text-blue-800 py-2 px-4 rounded-md text-center font-medium">
                            Currently Selected
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Instructions */}
            {!needsSelection && currentListing && (
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Next Steps</h3>
                <p className="text-gray-700 mb-4">
                  You've expressed interest in "{currentListing.title}". You can now:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Navigate to other sections using the menu on the left</li>
                  <li>Contact your agent via messages to discuss this opportunity</li>
                  <li>Fill out the non-disclosure agreement to access detailed information</li>
                  <li>Complete your financial statement for loan pre-approval</li>
                  <li>Track your progress through the purchase process</li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerDashboard;