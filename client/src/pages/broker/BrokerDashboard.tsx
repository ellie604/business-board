import React, { useState, useEffect } from 'react';
import { brokerService } from '../../services/broker';
import { authService } from '../../services/auth';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/california-business-sales-logo.png';

interface DashboardStats {
  totalActiveListings: number;
  totalUnderContract: number;
  newListingsThisMonth: number;
  totalNDA: number;
  totalClosedDeals: number;
}

// Simple auth hook
const useAuth = () => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  return { user };
};

export function BrokerDashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalActiveListings: 0,
    totalUnderContract: 0,
    newListingsThisMonth: 0,
    totalNDA: 0,
    totalClosedDeals: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar state

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const dashboardResponse = await brokerService.getDashboardStats();
        setStats(dashboardResponse.stats);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

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

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  // Sidebar content component for reuse
  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6">
        <img 
          src={logo}
          alt="California Business Sales" 
          className="w-full cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => window.location.href = '/'}
        />
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user?.name?.charAt(0)?.toUpperCase() || 'B'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name || 'Broker'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.role || 'BROKER'}
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

      {/* Navigation Links */}
      <nav className="mt-6">
        <NavLink 
          to="/broker"
          className={({ isActive }) =>
            `block px-6 py-4 text-base transition-colors ${
              isActive 
                ? 'bg-blue-100 text-blue-800 font-medium' 
                : 'text-gray-600 hover:bg-gray-50'
            }`
          }
          end
        >
          Home
        </NavLink>
        <Link 
          to="/broker/messages"
          className={`block px-6 py-4 text-base transition-colors ${
            location.pathname === '/broker/messages'
              ? 'bg-blue-100 text-blue-800 font-medium' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Email
        </Link>
        <Link 
          to="/broker/agents"
          className={`block px-6 py-4 text-base transition-colors ${
            location.pathname === '/broker/agents'
              ? 'bg-blue-100 text-blue-800 font-medium' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Agents
        </Link>
        <Link 
          to="/broker/listings"
          className={`block px-6 py-4 text-base transition-colors ${
            location.pathname === '/broker/listings'
              ? 'bg-blue-100 text-blue-800 font-medium' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Listings
        </Link>
        <Link 
          to="/broker/sellers"
          className={`block px-6 py-4 text-base transition-colors ${
            location.pathname === '/broker/sellers'
              ? 'bg-blue-100 text-blue-800 font-medium' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Sellers
        </Link>
        <Link 
          to="/broker/buyers"
          className={`block px-6 py-4 text-base transition-colors ${
            location.pathname === '/broker/buyers'
              ? 'bg-blue-100 text-blue-800 font-medium' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Buyers
        </Link>
        <Link 
          to="/broker/admin"
          className={`block px-6 py-4 text-base transition-colors ${
            location.pathname === '/broker/admin'
              ? 'bg-blue-100 text-blue-800 font-medium' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Admin Portal
        </Link>
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
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {user?.name?.charAt(0)?.toUpperCase() || 'B'}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900 truncate">
                {user?.name || 'Broker'}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 lg:p-8 w-full">
          <Outlet />
          {location.pathname === '/broker' && !location.pathname.includes('messages') && (
            <>
              <h1 className="text-2xl lg:text-3xl font-bold mb-6 lg:mb-8">
                Welcome {user?.name || 'Broker'} to Your Dashboard
              </h1>

              {/* Statistics Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 w-full">
                <div className="bg-white rounded-lg shadow-md p-4 lg:p-8">
                  <h3 className="text-lg lg:text-xl font-medium mb-2 lg:mb-4">Total Active Listings</h3>
                  <p className="text-3xl lg:text-4xl font-bold text-blue-600">{stats.totalActiveListings}</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-4 lg:p-8">
                  <h3 className="text-lg lg:text-xl font-medium mb-2 lg:mb-4">Total under contract</h3>
                  <p className="text-3xl lg:text-4xl font-bold text-green-600">{stats.totalUnderContract}</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-4 lg:p-8">
                  <h3 className="text-lg lg:text-xl font-medium mb-2 lg:mb-4">New Listings This Month</h3>
                  <p className="text-3xl lg:text-4xl font-bold text-purple-600">{stats.newListingsThisMonth}</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-4 lg:p-8">
                  <h3 className="text-lg lg:text-xl font-medium mb-2 lg:mb-4">Non Disclosure agreement</h3>
                  <p className="text-3xl lg:text-4xl font-bold text-orange-600">{stats.totalNDA}</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-4 lg:p-8">
                  <h3 className="text-lg lg:text-xl font-medium mb-2 lg:mb-4">Total Closed Deals (YTD)</h3>
                  <p className="text-3xl lg:text-4xl font-bold text-teal-600">{stats.totalClosedDeals}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default BrokerDashboard;