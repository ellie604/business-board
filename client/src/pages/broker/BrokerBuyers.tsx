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

interface Buyer {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  isActive: boolean;
  buyingListings: Listing[];
}

const BrokerBuyers: React.FC = () => {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchBuyers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/broker/buyers`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch buyers');
      }

      const data = await response.json();
      setBuyers(data.buyers);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch buyers');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuyers();
  }, []);

  const handleArchiveBuyer = async (buyerId: string) => {
    if (!confirm('Are you sure you want to archive this buyer?')) return;
    
    try {
      await userService.archiveBuyer(buyerId);
      await fetchBuyers(); // 重新加载数据
    } catch (err) {
      console.error('Failed to archive buyer:', err);
      setError('Failed to archive buyer. Please try again later.');
    }
  };

  const handleReactivateBuyer = async (buyerId: string) => {
    if (!confirm('Are you sure you want to reactivate this buyer?')) return;
    
    try {
      await userService.reactivateBuyer(buyerId);
      await fetchBuyers(); // 重新加载数据
    } catch (err) {
      console.error('Failed to reactivate buyer:', err);
      setError('Failed to reactivate buyer. Please try again later.');
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
      <h1 className="text-3xl font-bold mb-8">Buyers</h1>
      <div className="space-y-6">
        {buyers.map((buyer) => (
          <div
            key={buyer.id}
            className={`bg-white rounded-lg shadow-lg p-6 ${buyer.isActive ? '' : 'opacity-60'}`}
          >
            {/* Buyer Info - 不可点击部分 */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">{buyer.name}</h2>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    buyer.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {buyer.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-gray-600">{buyer.email}</p>
                <p className="text-sm text-gray-500">
                  Joined: {new Date(buyer.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600">
                  {buyer.buyingListings.length} Interested Listing{buyer.buyingListings.length !== 1 ? 's' : ''}
                </p>
                <div className="mt-2 space-x-2">
                  {buyer.isActive ? (
                    <button 
                      className="text-orange-500 hover:text-orange-600 text-sm" 
                      onClick={() => handleArchiveBuyer(buyer.id)}
                    >
                      Archive
                    </button>
                  ) : (
                    <button 
                      className="text-green-500 hover:text-green-600 text-sm" 
                      onClick={() => handleReactivateBuyer(buyer.id)}
                    >
                      Reactivate
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Listings - 可点击部分 */}
            {buyer.buyingListings.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Interested In</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {buyer.buyingListings.map((listing) => (
                    <div
                      key={listing.id}
                      className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => navigate(`/broker/buyers/${buyer.id}/${listing.id}`)}
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

export default BrokerBuyers;