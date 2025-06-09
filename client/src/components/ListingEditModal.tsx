import React, { useState, useEffect } from 'react';

interface UserOption {
  id: string;
  name: string;
  manager?: {
    id: string;
    name: string;
  };
}

interface ListingFormData {
  title: string;
  description: string;
  price: number;
  status: string;
  sellerId: string;
  buyerIds: string[];
  agentId?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ListingFormData) => void;
  initialData?: Partial<ListingFormData>;
  sellers: UserOption[];
  buyers: UserOption[];
  agents: UserOption[];
}

const statusOptions = ['ACTIVE', 'UNDER_CONTRACT', 'CLOSED'];

export default function ListingEditModal({
  open, onClose, onSubmit, initialData, sellers, buyers, agents
}: Props) {
  const [form, setForm] = useState<ListingFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    status: initialData?.status || 'ACTIVE',
    sellerId: initialData?.sellerId || '',
    buyerIds: initialData?.buyerIds || [],
    agentId: initialData?.agentId
  });

  // 当前选中的卖家
  const selectedSeller = sellers.find(s => s.id === form.sellerId);
  // 卖家是否已有代理
  const hasExistingAgent = selectedSeller?.manager !== undefined;

  useEffect(() => {
    setForm({
      title: '',
      description: '',
      price: 0,
      status: 'ACTIVE',
      sellerId: '',
      buyerIds: [],
      agentId: '',
      ...initialData
    });
  }, [initialData, open]);

  // 当选择卖家时，自动设置代理
  useEffect(() => {
    if (selectedSeller?.manager) {
      setForm(f => ({
        ...f,
        agentId: selectedSeller.manager!.id
      }));
    }
  }, [form.sellerId, selectedSeller]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 只允许非负数
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setForm(f => ({ ...f, price: value === '' ? 0 : parseFloat(value) }));
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-8 w-full max-w-lg relative">
        <button className="absolute top-2 right-2 text-gray-400" onClick={onClose}>×</button>
        <h2 className="text-xl font-bold mb-4">{initialData ? 'Edit Listing' : 'Add Listing'}</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSubmit(form);
          }}
        >
          <div className="mb-3">
            <label className="block mb-1">Title</label>
            <input className="w-full border rounded p-2" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
          </div>
          <div className="mb-3">
            <label className="block mb-1">Description</label>
            <textarea className="w-full border rounded p-2" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
          </div>
          <div className="mb-3">
            <label className="block mb-1">Price</label>
            <input 
              type="number"
              min="0"
              step="0.01"
              className="w-full border rounded p-2" 
              value={form.price || ''} 
              onChange={handlePriceChange}
              required 
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1">Status</label>
            <select className="w-full border rounded p-2" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div className="mb-3">
            <label className="block mb-1">Seller</label>
            <select className="w-full border rounded p-2" value={form.sellerId} onChange={e => setForm(f => ({ ...f, sellerId: e.target.value, agentId: '' }))} required>
              <option value="">Select seller</option>
              {sellers.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name}{s.manager ? ` (Agent: ${s.manager.name})` : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="block mb-1">Agent</label>
            {hasExistingAgent ? (
              <div className="w-full border rounded p-2 bg-gray-100">
                {selectedSeller?.manager?.name} (Assigned)
              </div>
            ) : (
              <select 
                className="w-full border rounded p-2" 
                value={form.agentId || ''} 
                onChange={e => setForm(f => ({ ...f, agentId: e.target.value || undefined }))}
              >
                <option value="">Select agent</option>
                {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            )}
            {hasExistingAgent && (
              <small className="text-gray-500 mt-1 block">
                This seller already has an assigned agent. To change the agent, please use the agent management interface.
              </small>
            )}
          </div>
          <div className="mb-3">
            <label className="block mb-1">Buyers</label>
            <select multiple className="w-full border rounded p-2 h-32" value={form.buyerIds} onChange={e => {
              const options = Array.from(e.target.selectedOptions).map(opt => opt.value);
              setForm(f => ({ ...f, buyerIds: options }));
            }}>
              {buyers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <small className="text-gray-500">Hold Ctrl/Cmd to select multiple buyers</small>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className="px-4 py-2 rounded bg-gray-200" onClick={onClose}>Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-500 text-white">{initialData ? 'Save' : 'Add'}</button>
          </div>
        </form>
      </div>
    </div>
  );
} 