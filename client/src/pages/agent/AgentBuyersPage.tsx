import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { agentService } from '../../services/agent';

interface Buyer {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  buyingListings: {
    id: string;
    title: string;
    description: string;
    price: number;
    status: string;
  }[];
}

export default function AgentBuyersPage() {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        const response = await agentService.getBuyers();
        setBuyers(response.buyers);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch buyers');
        setLoading(false);
      }
    };

    fetchBuyers();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">My Assigned Buyers</h1>
      <div className="space-y-6">
        {buyers.map((buyer) => (
          <div key={buyer.id} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">{buyer.name}</h2>
                <p className="text-gray-600">{buyer.email}</p>
                <p className="text-sm text-gray-500">
                  Joined: {new Date(buyer.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600">
                  {buyer.buyingListings.length} Interested Listing{buyer.buyingListings.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {buyer.buyingListings.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Interested In</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {buyer.buyingListings.map((listing) => (
                    <div
                      key={listing.id}
                      className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => navigate(`/agent/buyers/${buyer.id}/${listing.id}`)}
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