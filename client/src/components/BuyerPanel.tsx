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

interface Buyer {
  id: string;
  name: string;
  buyingListings: Listing[];
}

// Mock data - will be replaced with API calls later
const mockBuyers: Buyer[] = [
  {
    id: 'kelly',
    name: 'Kelly Buyer',
    buyingListings: [
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
    id: 'ivy',
    name: 'Ivy Buyer',
    buyingListings: [
      {
        id: 'yacht-sales',
        title: 'Yacht Sales',
        listingDate: '2024-02-15',
        underContract: false,
        closingDate: null
      }
    ]
  }
];

const BuyerPanel: React.FC = () => {
  const navigate = useNavigate();
  const [expandedBuyers, setExpandedBuyers] = useState<Set<string>>(new Set());

  const toggleBuyer = (buyerId: string) => {
    const newExpanded = new Set(expandedBuyers);
    if (newExpanded.has(buyerId)) {
      newExpanded.delete(buyerId);
    } else {
      newExpanded.add(buyerId);
    }
    setExpandedBuyers(newExpanded);
  };

  const navigateToListing = (buyerId: string, listingId: string) => {
    navigate(`/broker/buyers/${buyerId}/${listingId}`);
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-6">Buyers</h2>
      <div className="space-y-4">
        {mockBuyers.map((buyer) => (
          <div key={buyer.id} className="border rounded-lg bg-white shadow">
            <button
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
              onClick={() => toggleBuyer(buyer.id)}
            >
              <span className="font-medium">{buyer.name}</span>
              {expandedBuyers.has(buyer.id) ? (
                <ChevronDownIcon className="h-5 w-5" />
              ) : (
                <ChevronRightIcon className="h-5 w-5" />
              )}
            </button>
            {expandedBuyers.has(buyer.id) && (
              <div className="border-t p-4 space-y-3">
                {buyer.buyingListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="p-3 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                    onClick={() => navigateToListing(buyer.id, listing.id)}
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

export default BuyerPanel; 