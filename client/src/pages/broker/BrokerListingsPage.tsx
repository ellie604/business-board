import React, { useState, useEffect } from 'react';
import ListingEditModal from '../../components/ListingEditModal';
import { listingService, userService } from '../../services/listing';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  status: string;
  seller: { id: string; name: string };
  buyers: { id: string; name: string }[];
  agent?: { id: string; name: string };
}

interface User {
  id: string;
  name: string;
}

export default function BrokerListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [sellers, setSellers] = useState<User[]>([]);
  const [buyers, setBuyers] = useState<User[]>([]);
  const [agents, setAgents] = useState<User[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showArchived, setShowArchived] = useState(false); // New state for hiding/showing archived listings

  // 加载数据
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      setDataLoaded(false);

      const [listingsRes, sellersRes, buyersRes, agentsRes] = await Promise.all([
        listingService.getListings(),
        userService.getSellers(),
        userService.getBuyers(),
        userService.getAgents()
      ]);

      console.log('API Responses:', { listingsRes, sellersRes, buyersRes, agentsRes });

      // 验证并转换卖家数据
      const validSellers = sellersRes.users?.map(user => ({
        id: user.id,
        name: user.name,
        manager: user.manager ? {
          id: user.manager.id,
          name: user.manager.name
        } : undefined
      })) || [];

      // 验证并转换买家数据
      const validBuyers = buyersRes.users?.map(user => ({
        id: user.id,
        name: user.name
      })) || [];

      // 验证并转换经纪人数据
      const validAgents = agentsRes.users?.map(user => ({
        id: user.id,
        name: user.name
      })) || [];

      // 验证并转换房源数据
      const validListings = Array.isArray(listingsRes.listings) 
        ? listingsRes.listings.map(listing => ({
            id: listing.id,
            title: listing.title,
            description: listing.description,
            price: Number(listing.price),
            status: listing.status,
            seller: {
              id: listing.seller.id,
              name: listing.seller.name
            },
            buyers: Array.isArray(listing.buyers) ? listing.buyers.map(buyer => ({
              id: buyer.id,
              name: buyer.name
            })) : [],
            agent: listing.agent ? {
              id: listing.agent.id,
              name: listing.agent.name
            } : undefined
          }))
        : [];

      console.log('Processed data:', {
        listings: validListings,
        sellers: validSellers,
        buyers: validBuyers,
        agents: validAgents
      });

      setListings(validListings);
      setSellers(validSellers);
      setBuyers(validBuyers);
      setAgents(validAgents);
      setDataLoaded(true);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load data. Please try again later.');
      setDataLoaded(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleArchive = async (id: string) => {
    if (!confirm('Are you sure you want to archive this listing?')) return;
    
    try {
      await listingService.archiveListing(id);
      await loadData(); // 重新加载数据
    } catch (err) {
      console.error('Failed to archive listing:', err);
      setError('Failed to archive listing. Please try again later.');
    }
  };

  const handleReactivate = async (id: string) => {
    if (!confirm('Are you sure you want to reactivate this listing?')) return;
    
    try {
      await listingService.reactivateListing(id);
      await loadData(); // 重新加载数据
    } catch (err) {
      console.error('Failed to reactivate listing:', err);
      setError('Failed to reactivate listing. Please try again later.');
    }
  };

  const handleAdd = () => {
    if (!dataLoaded) {
      setError('Please wait for data to load');
      return;
    }
    setEditData(null);
    setModalOpen(true);
  };

  const handleEdit = (listing: Listing) => {
    if (!dataLoaded) {
      setError('Please wait for data to load');
      return;
    }
    setEditData({
      ...listing,
      sellerId: listing.seller.id,
      buyerIds: listing.buyers.map(b => b.id),
    });
    setModalOpen(true);
  };

  const handleModalSubmit = async (data: any) => {
    try {
      if (editData) {
        // 编辑
        await listingService.updateListing(editData.id, {
          ...data,
          price: Number(data.price) // 确保价格是数字类型
        });
      } else {
        // 新增
        await listingService.addListing({
          ...data,
          price: Number(data.price) // 确保价格是数字类型
        });
      }
      await loadData(); // 重新加载数据
      setModalOpen(false);
    } catch (err) {
      console.error('Failed to save listing:', err);
      setError('Failed to save listing. Please try again later.');
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'UNDER_CONTRACT':
        return 'bg-yellow-100 text-yellow-800';
      case 'CLOSED':
        return 'bg-blue-100 text-blue-800';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Separate active and archived listings
  const activeListings = listings.filter(listing => listing.status !== 'INACTIVE');
  const archivedListings = listings.filter(listing => listing.status === 'INACTIVE');

  // Function to render a table of listings
  const renderListingsTable = (listingsToShow: Listing[], title: string, isEmpty: boolean) => (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        {title}
        <span className="ml-2 text-sm font-normal text-gray-500">
          ({listingsToShow.length} {listingsToShow.length === 1 ? 'listing' : 'listings'})
        </span>
      </h3>
      {isEmpty ? (
        <div className="bg-white rounded shadow p-8 text-center text-gray-500">
          No {title.toLowerCase()} found.
      </div>
      ) : (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full">
        <thead>
          <tr className="bg-yellow-300">
                <th className="p-2 text-left">Title</th>
                <th className="p-2 text-left">Description</th>
                <th className="p-2 text-left">Price</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Seller</th>
                <th className="p-2 text-left">Buyers</th>
                <th className="p-2 text-left">Agent</th>
                <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
              {listingsToShow.map(listing => (
            <tr 
              key={listing.id} 
                  className="border-t hover:bg-gray-50"
            >
              <td className="p-2">{listing.title}</td>
              <td className="p-2">{listing.description}</td>
              <td className="p-2">${listing.price.toLocaleString()}</td>
              <td className="p-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(listing.status)}`}>
                  {listing.status.replace('_', ' ')}
                </span>
              </td>
              <td className="p-2">{listing.seller.name}</td>
              <td className="p-2">{listing.buyers.map(b => b.name).join(', ')}</td>
              <td className="p-2">{listing.agent?.name || '-'}</td>
              <td className="p-2">
                <button 
                  className="mr-2 text-blue-500 hover:text-blue-600"
                  onClick={() => handleEdit(listing)}
                >
                  Edit
                </button>
                {listing.status === 'INACTIVE' ? (
                  <button 
                    className="text-green-500 hover:text-green-600" 
                    onClick={() => handleReactivate(listing.id)}
                  >
                    Reactivate
                  </button>
                ) : (
                  <button 
                    className="text-orange-500 hover:text-orange-600" 
                    onClick={() => handleArchive(listing.id)}
                  >
                    Archive
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        </div>
      )}
    </div>
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => loadData()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Listings Overview</h2>
        <div className="flex items-center space-x-4">
          {archivedListings.length > 0 && (
            <button
              onClick={() => setShowArchived(!showArchived)}
              className={`px-4 py-2 rounded-md transition-colors ${
                showArchived 
                  ? 'bg-gray-500 text-white hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {showArchived ? 'Hide' : 'Show'} Archived ({archivedListings.length})
            </button>
          )}
          <button 
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
            onClick={handleAdd}
          >
            Add Listing
          </button>
        </div>
      </div>

      {/* Active Listings */}
      {renderListingsTable(activeListings, 'Active Listings', activeListings.length === 0)}

      {/* Archived Listings - Only show if showArchived is true */}
      {showArchived && renderListingsTable(archivedListings, 'Archived Listings', archivedListings.length === 0)}

      {modalOpen && (
        <ListingEditModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleModalSubmit}
          initialData={editData}
          sellers={sellers}
          buyers={buyers}
          agents={agents}
        />
      )}
    </div>
  );
} 