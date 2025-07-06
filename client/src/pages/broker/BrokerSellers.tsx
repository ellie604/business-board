import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config';
import { userService } from '../../services/listing';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  status: string;
  createdAt: string;
}

interface Seller {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  isActive: boolean;
  listings: Listing[];
}

const BrokerSellers: React.FC = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchSellers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/broker/sellers`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch sellers');
      }

      const data = await response.json();
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
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Sellers</h1>
      <div className="space-y-6">
        {sellers.map((seller) => (
          <div
            key={seller.id}
            className={`bg-white rounded-lg shadow-lg p-6 ${seller.isActive ? '' : 'opacity-60'}`}
          >
            {/* Seller Info - 不可点击部分 */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">{seller.name}</h2>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    seller.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {seller.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-gray-600">{seller.email}</p>
                <p className="text-sm text-gray-500">
                  Joined: {new Date(seller.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600">
                  {seller.listings.length} Listing{seller.listings.length !== 1 ? 's' : ''}
                </p>
                <div className="mt-2 space-x-2">
                  {seller.isActive ? (
                    <button 
                      className="text-orange-500 hover:text-orange-600 text-sm" 
                      onClick={() => handleArchiveSeller(seller.id)}
                    >
                      Archive
                    </button>
                  ) : (
                    <button 
                      className="text-green-500 hover:text-green-600 text-sm" 
                      onClick={() => handleReactivateSeller(seller.id)}
                    >
                      Reactivate
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Listings - 可点击部分 */}
            {seller.listings.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Listings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {seller.listings.map((listing) => (
                    <div
                      key={listing.id}
                      className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => navigate(`/broker/sellers/${seller.id}/${listing.id}`)}
                    >
                      <h4 className="font-medium">{listing.title}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">{listing.description}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-blue-600 font-medium">
                          ${listing.price.toLocaleString()}
                        </span>
                        <span className={`text-sm px-2 py-1 rounded ${
                          listing.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800'
                            : listing.status === 'UNDER_CONTRACT'
                            ? 'bg-yellow-100 text-yellow-800'
                            : listing.status === 'INACTIVE'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {listing.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrokerSellers;