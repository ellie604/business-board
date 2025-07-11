import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/listing';
import { apiGet } from '../../utils/apiHelper';
import { API_BASE_URL } from '../../config';

interface Seller {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  isActive: boolean;
  createdAt: string;
  selectedListing?: {
    id: string;
    title: string;
    price: number;
  };
  unreadCount: number;
}

const BrokerSellers: React.FC = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchSellers = async () => {
    try {
      const data = await apiGet('/broker/sellers');
      setSellers(data.sellers);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch sellers');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const handleArchiveSeller = async (sellerId: string) => {
    if (!confirm('Are you sure you want to archive this seller?')) return;
    
    try {
      await userService.archiveSeller(sellerId);
      await fetchSellers(); // 重新加载数据
    } catch (err) {
      console.error('Failed to archive seller:', err);
      setError('Failed to archive seller. Please try again later.');
    }
  };

  const handleReactivateSeller = async (sellerId: string) => {
    if (!confirm('Are you sure you want to reactivate this seller?')) return;
    
    try {
      await userService.reactivateSeller(sellerId);
      await fetchSellers(); // 重新加载数据
    } catch (err) {
      console.error('Failed to reactivate seller:', err);
      setError('Failed to reactivate seller. Please try again later.');
    }
  };

  const filteredSellers = sellers.filter(seller => 
    seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seller.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6 p-4 lg:p-0">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <h1 className="text-2xl lg:text-3xl font-bold">Sellers</h1>
        <input
          type="text"
          placeholder="Search sellers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full lg:w-auto max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSellers.map((seller) => (
              <tr key={seller.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{seller.name || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{seller.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    seller.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {seller.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(seller.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {filteredSellers.map((seller) => (
          <div key={seller.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900">
                {seller.name || 'N/A'}
              </h3>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                seller.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {seller.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Email:</span>
                <span className="text-gray-900 break-all">{seller.email}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500">Joined:</span>
                <span className="text-gray-900">{new Date(seller.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSellers.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No sellers found.</p>
        </div>
      )}
    </div>
  );
};

export default BrokerSellers;