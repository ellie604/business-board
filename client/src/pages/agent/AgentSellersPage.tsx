import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { agentService } from '../../services/agent';

interface Seller {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  listings: {
    id: string;
    title: string;
    description: string;
    price: number;
    status: string;
  }[];
}

export default function AgentSellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await agentService.getSellers();
        setSellers(response.sellers);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch sellers');
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">My Assigned Sellers</h1>
      <div className="space-y-6">
        {sellers.map((seller) => (
          <div key={seller.id} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">{seller.name}</h2>
                <p className="text-gray-600">{seller.email}</p>
                <p className="text-sm text-gray-500">
                  Joined: {new Date(seller.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600">
                  {seller.listings.length} Listing{seller.listings.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {seller.listings.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Listings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {seller.listings.map((listing) => (
                    <div
                      key={listing.id}
                      className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => navigate(`/agent/sellers/${seller.id}/${listing.id}`)}
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
} 