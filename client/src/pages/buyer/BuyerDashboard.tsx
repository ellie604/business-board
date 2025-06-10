import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { buyerService } from '../../services/buyer';
import type { DashboardStats } from '../../services/buyer';
import ProgressBar from '../../components/ProgressBar';
import logo from '../../assets/california-business-sales-logo.png';

const BuyerDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const stats = await buyerService.getDashboardStats();
        setStats(stats);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const menuItems = [
    { label: 'Home', path: '/buyer', stepId: null },
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

  const handleMenuClick = (item: any) => {
    if (item.stepId === null) {
      // Home page is always accessible
      navigate(item.path);
      return;
    }

    const currentStepIndex = currentStep || 0;
    
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
    return currentStep || 0;
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
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleMenuClick(item)}
              className={`block w-full px-6 py-4 text-base text-left ${
                location.pathname === item.path
                  ? 'bg-blue-100 text-blue-800 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8">
        <Outlet />
        {location.pathname === '/buyer' && (
          <>
            <h1 className="text-3xl font-bold mb-8">Welcome to Your Customized Dashboard</h1>
            
            {/* Progress Bar */}
            <ProgressBar currentStep={currentStep} steps={steps} />

            {/* Steps Description */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Transaction Steps</h2>
              <p className="mb-4">Your dynamic progress bar on top will show you the progress on the purchase of your business in real time as it progresses.</p>
              <p className="mb-4">Please select from the menu items on the left to do the following:</p>
              <ol className="list-decimal pl-6 space-y-2">
                {steps.slice(1).map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {stats && Object.entries(stats).map(([key, status], index) => (
                <div
                  key={index}
                  className={`bg-white rounded-lg shadow-md p-6 ${
                    status === 'completed' ? 'border-l-4 border-green-500' : 'border-l-4 border-gray-300'
                  }`}
                >
                  <h4 className="text-lg font-medium mb-2">{key}</h4>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {status === 'completed' ? 'Completed' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BuyerDashboard;