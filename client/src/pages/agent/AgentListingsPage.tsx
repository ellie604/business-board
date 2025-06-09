import React, { useState, useEffect } from 'react';
import { agentService } from '../../services/agent';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  status: string;
  seller: { id: string; name: string };
  buyers: { id: string; name: string }[];
}

export default function AgentListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await agentService.getListings();
        setListings(response.listings);
      } catch (err) {
        console.error('Failed to load listings:', err);
        setError('Failed to load listings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">My Assigned Listings</h2>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-yellow-300">
            <th className="p-2">Title</th>
            <th className="p-2">Description</th>
            <th className="p-2">Price</th>
            <th className="p-2">Status</th>
            <th className="p-2">Seller</th>
            <th className="p-2">Buyers</th>
          </tr>
        </thead>
        <tbody>
          {listings.map(listing => (
            <tr key={listing.id} className="border-t">
              <td className="p-2">{listing.title}</td>
              <td className="p-2">{listing.description}</td>
              <td className="p-2">${listing.price.toLocaleString()}</td>
              <td className="p-2">{listing.status}</td>
              <td className="p-2">{listing.seller.name}</td>
              <td className="p-2">{listing.buyers.map(b => b.name).join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 