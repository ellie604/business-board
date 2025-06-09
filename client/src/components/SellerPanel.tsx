import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

interface Listing {
  id: string;
  title: string;
  listingDate: string;
  underContract: boolean;
  closingDate: string | null;
}

interface Seller {
  id: string;
  name: string;
  listings: Listing[];
}

// Mock data - will be replaced with API calls later
const mockSellers: Seller[] = [
  {
    id: 'frank',
    name: 'Frank Seller',
    listings: [
      {
        id: 'restaurant-sales',
        title: 'Restaurant Sales',
        listingDate: '2024-03-01',
        underContract: true,
        closingDate: '2024-06-01'
      }
    ]
  },
  {
    id: 'grace',
    name: 'Grace Seller',
    listings: [
      {
        id: 'hotpot',
        title: 'Hotpot Restaurant',
        listingDate: '2024-02-15',
        underContract: false,
        closingDate: null
      }
    ]
  }
];

const SellerPanel: React.FC = () => {
  const navigate = useNavigate();
  const [expandedSellers, setExpandedSellers] = useState<Set<string>>(new Set());

  const toggleSeller = (sellerId: string) => {
    const newExpanded = new Set(expandedSellers);
    if (newExpanded.has(sellerId)) {
      newExpanded.delete(sellerId);
    } else {
      newExpanded.add(sellerId);
    }
    setExpandedSellers(newExpanded);
  };

  const navigateToListing = (sellerId: string, listingId: string) => {
    navigate(`/broker/sellers/${sellerId}/${listingId}`);
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-6">Sellers</h2>
      <div className="space-y-4">
        {mockSellers.map((seller) => (
          <div key={seller.id} className="border rounded-lg bg-white shadow">
            <button
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
              onClick={() => toggleSeller(seller.id)}
            >
              <span className="font-medium">{seller.name}</span>
              {expandedSellers.has(seller.id) ? (
                <ChevronDownIcon className="h-5 w-5" />
              ) : (
                <ChevronRightIcon className="h-5 w-5" />
              )}
            </button>
            {expandedSellers.has(seller.id) && (
              <div className="border-t p-4 space-y-3">
                {seller.listings.map((listing) => (
                  <div
                    key={listing.id}
                    className="p-3 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                    onClick={() => navigateToListing(seller.id, listing.id)}
                  >
                    <div className="font-medium text-gray-900">{listing.title}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      <div>Listed: {listing.listingDate}</div>
                      <div>
                        Status: {listing.underContract ? 'Under Contract' : 'Active'}
                      </div>
                      {listing.closingDate && (
                        <div>Closing Date: {listing.closingDate}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerPanel; 