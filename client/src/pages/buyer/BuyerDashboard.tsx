import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { buyerService } from '../../services/buyer';
import { authService } from '../../services/auth';
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
  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    console.log(`[${type.toUpperCase()}] ${message}`);
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
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar state
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

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

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
      setListings(listingsRes.listings || []); // 修改：处理包装格式的响应，移除不必要的Array.isArray检查
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

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      try {
        await authService.logout();
        navigate('/login');
      } catch (error) {
        console.error('Logout failed:', error);
        // 即使 logout 请求失败，仍然跳转到登录页面
        navigate('/login');
      }
    }
  };

  const handleListingSelection = async (listingId: string) => {
    try {
      setSelecting(true);
      await buyerService.selectListing(listingId);
      
      // Refetch data after selection
      await fetchData();
      setNeedsSelection(false);
      showNotification('Listing selected successfully', 'success');
    } catch (err) {
      console.error('Failed to select listing:', err);
      showNotification('Failed to select listing', 'error');
    } finally {
      setSelecting(false);
    }
  };

  const handleMenuClick = (item: typeof menuItems[0]) => {
    const currentStepIndex = progress?.currentStep || 0;
    const stepInfo = progress?.steps.find(s => s.id === item.stepId);
    const isAccessible = item.stepId === null || item.stepId <= currentStepIndex;
    const isCompleted = stepInfo?.completed || false;
    
    // Always navigate, but pass accessibility state
    navigate(item.path, {
      state: {
        stepAccessible: isAccessible,
        stepCompleted: isCompleted,
        currentStep: currentStepIndex,
        stepId: item.stepId
      }
    });
  };

  const getCurrentStepIndex = () => {
    return progress?.currentStep || 0;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
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

  // Sidebar content component for reuse
  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6">
        <img 
          src={logo}
          alt="California Business Sales" 
          className="w-full"
        />
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user?.name?.charAt(0)?.toUpperCase() || 'B'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name || 'Buyer'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.role || 'BUYER'}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-3 w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
        >
          Sign out
        </button>
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
    </>
  );

  return (
    <div className="flex w-full min-h-screen bg-gray-100">
      {/* Mobile Menu Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:min-h-screen bg-white shadow-lg flex-shrink-0">
        <div className="w-full">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
            <SidebarContent />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {user?.name?.charAt(0)?.toUpperCase() || 'B'}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900 truncate">
                {user?.name || 'Buyer'}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 lg:p-8">
          <Outlet />
          {location.pathname === '/buyer' && (
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="mb-6 lg:mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                  Welcome {user?.name || 'Buyer'} to Your Customized Dashboard
                </h1>
                <p className="text-gray-600">
                  Browse business opportunities and track your purchase process
                </p>
              </div>

              {/* Current Selection Status */}
              {currentListing && !needsSelection && (
                <div className="mb-6 lg:mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
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
              {needsSelection && (
                <div className="mb-6 lg:mb-8 p-4 lg:p-6 bg-white border border-gray-200 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Select a Listing to Work On
                  </h3>
                  <div className="space-y-4">
                    {listings.map((listing) => (
                      <div
                        key={listing.id}
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{listing.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{listing.description}</p>
                            <div className="flex items-center mt-2 space-x-4">
                              <span className="text-sm font-medium text-gray-900">
                                {formatPrice(listing.price)}
                              </span>
                              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(listing.status)}`}>
                                {listing.status}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleListingSelection(listing.id)}
                            disabled={selecting}
                            className="lg:ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {selecting ? 'Selecting...' : 'Select'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dashboard Stats */}
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 lg:mb-8">
                  <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
                    <h3 className="text-lg font-medium mb-2">Current Step</h3>
                    <p className="text-2xl lg:text-3xl font-bold text-blue-600">{(stats as any).currentStep || 0}</p>
                    <p className="text-sm text-gray-500">of {(stats as any).totalSteps || 11} steps</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
                    <h3 className="text-lg font-medium mb-2">Completed Steps</h3>
                    <p className="text-2xl lg:text-3xl font-bold text-green-600">{(stats as any).completedSteps || 0}</p>
                    <p className="text-sm text-gray-500">steps finished</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
                    <h3 className="text-lg font-medium mb-2">Available Listings</h3>
                    <p className="text-3xl font-bold text-purple-600">{listings.length}</p>
                    <p className="text-sm text-gray-500">listings to view</p>
                  </div>
                </div>
              )}

              {/* Available Listings */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium mb-4">Available Business Opportunities</h3>
                <div className="space-y-4">
                  {listings.map((listing) => (
                    <div key={listing.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{listing.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{listing.description}</p>
                        <div className="flex items-center mt-2 space-x-4">
                          <span className="text-sm font-medium text-gray-900">
                            {formatPrice(listing.price)}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(listing.status)}`}>
                            {listing.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;