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

interface Agent {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface ApiResponse {
  agents: Agent[];
  message: string;
}

export function BrokerDashboard() {
  const [agents, setAgents] = useState<Agent[]>([]);
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
        
        // 并行加载数据
        const [dashboardResponse, agentsResponse] = await Promise.all([
          brokerService.getDashboardStats(),
          brokerService.getAgents()
        ]);

        setStats(dashboardResponse.stats);
        setAgents(agentsResponse.agents);
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
    <div className="flex min-h-screen bg-gray-100">
      {/* 左侧导航栏 */}
      <div className="w-64 bg-white shadow-lg">
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
            className="block px-6 py-4 bg-blue-100 text-blue-800 font-medium"
          >
            Home
          </Link>
          <Link 
            to="/broker/email"
            className="block px-6 py-4 text-gray-600 hover:bg-gray-50"
          >
            Email
          </Link>
          <Link 
            to="/broker/agents"
            className="block px-6 py-4 text-gray-600 hover:bg-gray-50"
          >
            Agents
          </Link>
          <Link 
            to="/broker/sellers"
            className="block px-6 py-4 text-gray-600 hover:bg-gray-50"
          >
            Sellers
          </Link>
          <Link 
            to="/broker/buyers"
            className="block px-6 py-4 text-gray-600 hover:bg-gray-50"
          >
            Buyers
          </Link>
        </nav>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">
          Welcome {agents[0]?.name || 'Broker'} to Your Customized Dashboard
        </h1>

        {/* 统计数据表格 */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <table className="w-full">
            <tbody>
              <tr className="border-b">
                <td className="p-4 font-medium">Total Active Listings</td>
                <td className="p-4 text-right">{stats.totalActiveListings}</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-medium">Total under contract</td>
                <td className="p-4 text-right">{stats.totalUnderContract}</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-medium">New Listings This Month</td>
                <td className="p-4 text-right">{stats.newListingsThisMonth}</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-medium">Non Disclosure agreement</td>
                <td className="p-4 text-right">{stats.totalNDA}</td>
              </tr>
              <tr>
                <td className="p-4 font-medium">Total Closed Deals (YTD)</td>
                <td className="p-4 text-right">{stats.totalClosedDeals}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="text-sm text-gray-500 mb-4">Table below will be scrollable</div>

        {/* Agents 表格 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-4 text-left font-medium text-gray-600">Name</th>
                <th className="p-4 text-left font-medium text-gray-600">Email</th>
                <th className="p-4 text-left font-medium text-gray-600">Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {agents.map(agent => (
                <tr key={agent.id} className="border-t">
                  <td className="p-4">{agent.name || 'N/A'}</td>
                  <td className="p-4">{agent.email}</td>
                  <td className="p-4">
                    {new Date(agent.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {agents.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-gray-500">
                    No agents found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default BrokerDashboard;