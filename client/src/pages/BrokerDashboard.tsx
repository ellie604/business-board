import React, { useState, useEffect } from 'react';
import { brokerService } from '../services/broker';
import { Link } from 'react-router-dom';
import logo from '../assets/california-business-sales-logo.png';

interface DashboardStats {
  totalActiveListings: number;
  totalUnderContract: number;
  newListingsThisMonth: number;
  totalNDA: number;
  totalClosedDeals: number;
}

export function BrokerDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalActiveListings: 0,
    totalUnderContract: 0,
    newListingsThisMonth: 0,
    totalNDA: 0,
    totalClosedDeals: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="flex w-full min-h-screen bg-gray-100">
      {/* 左侧导航栏 */}
      <div className="w-64 min-h-screen bg-white shadow-lg flex-shrink-0">
        {/* Logo */}
        <div className="p-6">
          <img 
            src={logo}
            alt="California Business Sales" 
            className="w-full"
          />
        </div>

        {/* 导航链接 */}
        <nav className="mt-6">
          <Link 
            to="/broker"
            className="block px-6 py-4 text-base bg-blue-100 text-blue-800 font-medium"
          >
            Home
          </Link>
          <Link 
            to="/broker/email"
            className="block px-6 py-4 text-base text-gray-600 hover:bg-gray-50"
          >
            Email
          </Link>
          <Link 
            to="/broker/agents"
            className="block px-6 py-4 text-base text-gray-600 hover:bg-gray-50"
          >
            Agents
          </Link>
          <Link 
            to="/broker/sellers"
            className="block px-6 py-4 text-base text-gray-600 hover:bg-gray-50"
          >
            Sellers
          </Link>
          <Link 
            to="/broker/buyers"
            className="block px-6 py-4 text-base text-gray-600 hover:bg-gray-50"
          >
            Buyers
          </Link>
        </nav>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 p-8 w-full">
        <h1 className="text-3xl font-bold mb-8">
          Welcome Broker to Your Customized Dashboard
        </h1>

        {/* 统计数据卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-xl font-medium mb-4">Total Active Listings</h3>
            <p className="text-4xl font-bold text-blue-600">{stats.totalActiveListings}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-xl font-medium mb-4">Total under contract</h3>
            <p className="text-4xl font-bold text-green-600">{stats.totalUnderContract}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-xl font-medium mb-4">New Listings This Month</h3>
            <p className="text-4xl font-bold text-purple-600">{stats.newListingsThisMonth}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-xl font-medium mb-4">Non Disclosure agreement</h3>
            <p className="text-4xl font-bold text-orange-600">{stats.totalNDA}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-xl font-medium mb-4">Total Closed Deals (YTD)</h3>
            <p className="text-4xl font-bold text-teal-600">{stats.totalClosedDeals}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BrokerDashboard;