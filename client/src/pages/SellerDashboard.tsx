import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { sellerService } from '../services/seller';
import type { DashboardStats } from '../services/seller';
import logo from '../assets/california-business-sales-logo.png';

const SellerDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await sellerService.getDashboardStats();
        setStats(response.stats);
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
    { label: 'Home', path: '/seller' },
    { label: 'Email Agent', path: '/seller/messages' },
    { label: 'Listing Agreement', path: '/seller/listing-agreement' },
    { label: 'Questionnaire', path: '/seller/questionnaire' },
    { label: 'Upload Documents', path: '/seller/upload' },
    { label: 'Buyer Activity', path: '/seller/buyer-activity' },
    { label: 'Purchase Agreement', path: '/seller/agreement' },
    { label: 'Due Diligence', path: '/seller/due-diligence' },
    { label: 'Pre-Close Checklist', path: '/seller/pre-close' },
    { label: 'Closing Documents', path: '/seller/closing' },
    { label: 'After The Sale', path: '/seller/after-sale' }
  ];

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
              onClick={() => navigate(item.path)}
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
        {location.pathname === '/seller' && (
          <>
            <h1 className="text-3xl font-bold mb-8">Welcome to Your Customized Dashboard</h1>
            
            {/* Progress Bar */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2">Transaction Progress</h3>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${stats ? Object.values(stats).filter(s => s === 'completed').length / Object.keys(stats).length * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Steps Description */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Transaction Steps</h2>
              <p className="mb-4">Your dynamic progress bar on top will show you the progress on the sell of your business in real time as it progresses.</p>
              <p className="mb-4">Please select from the menu items on the left to do the following:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Download your listing agreement</li>
                <li>Fill out your business questionnaire Online.</li>
                <li>Upload your Financial documents.</li>
                <li>Buyer Activity: Up to the minute updates on buyers.</li>
                <li>Download your purchase contract (once we have an accepted buyer offer.</li>
                <li>Upload due diligence documents.</li>
                <li>Download Closing document once we are closed.</li>
                <li>After the Sale: Learn about ways mitigate taxes on the proceeds.</li>
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

export default SellerDashboard; 