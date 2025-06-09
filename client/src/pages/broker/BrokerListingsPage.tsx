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

  const handleDelete = async (id: string) => {
    try {
      await listingService.deleteListing(id);
      await loadData(); // 重新加载数据
    } catch (err) {
      console.error('Failed to delete listing:', err);
      setError('Failed to delete listing. Please try again later.');
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

  // 只要数据加载完成就允许操作
  const canOpenModal = dataLoaded;

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Listings Overview</h2>
      <div className="mb-4">
        <button 
          className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
          onClick={handleAdd}
        >
          Add Listing
        </button>
      </div>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-yellow-300">
            <th className="p-2">Title</th>
            <th className="p-2">Description</th>
            <th className="p-2">Price</th>
            <th className="p-2">Status</th>
            <th className="p-2">Seller</th>
            <th className="p-2">Buyers</th>
            <th className="p-2">Agent</th>
            <th className="p-2">Actions</th>
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
              <td className="p-2">{listing.agent?.name || '-'}</td>
              <td className="p-2">
                <button 
                  className="mr-2 text-blue-500 hover:text-blue-600"
                  onClick={() => handleEdit(listing)}
                >
                  Edit
                </button>
                <button 
                  className="text-red-500 hover:text-red-600" 
                  onClick={() => handleDelete(listing.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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