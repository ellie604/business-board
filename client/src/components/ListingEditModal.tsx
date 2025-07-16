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
  privateSeller?: PrivateSellerData;
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

interface PrivateSellerData {
  name: string;
  email: string;
  phone?: string;
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

  const [isPrivateSeller, setIsPrivateSeller] = useState(false);
  const [privateSellerData, setPrivateSellerData] = useState<PrivateSellerData>({
    name: '',
    email: '',
    phone: ''
  });
  const [validationError, setValidationError] = useState<string | null>(null);

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
    setIsPrivateSeller(false);
    setPrivateSellerData({
      name: '',
      email: '',
      phone: ''
    });
    setValidationError(null); // Clear any validation errors
  }, [initialData, open]);

  // 当选择卖家时，自动设置代理
  useEffect(() => {
    if (selectedSeller?.manager && !isPrivateSeller) {
      setForm(f => ({
        ...f,
        agentId: selectedSeller.manager!.id
      }));
    }
  }, [form.sellerId, selectedSeller, isPrivateSeller]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 只允许非负数
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setForm(f => ({ ...f, price: value === '' ? 0 : parseFloat(value) }));
    }
  };

  const handleSellerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setValidationError(null); // Clear any validation errors
    if (value === 'PRIVATE') {
      setIsPrivateSeller(true);
      setForm(f => ({ ...f, sellerId: '', agentId: '' }));
    } else {
      setIsPrivateSeller(false);
      setForm(f => ({ ...f, sellerId: value, agentId: '' }));
    }
  };

  const handlePrivateSellerChange = (field: keyof PrivateSellerData, value: string) => {
    setValidationError(null); // Clear any validation errors when user types
    setPrivateSellerData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null); // Clear any previous errors
    
    // Validate private seller information if applicable
    if (isPrivateSeller) {
      if (!privateSellerData.name.trim()) {
        setValidationError('Private seller name is required. Please update this listing once the seller is registered.');
        return;
      }
      if (!privateSellerData.email.trim()) {
        setValidationError('Private seller email is required. Please update this listing once the seller is registered.');
        return;
      }
      if (privateSellerData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(privateSellerData.email)) {
        setValidationError('Please enter a valid email address for the private seller. Please update this listing once the seller is registered.');
        return;
      }
    }
    
    // Prepare data with private seller info if needed
    const submitData = {
      ...form,
      ...(isPrivateSeller && {
        privateSeller: privateSellerData
      })
    };
    
    onSubmit(submitData);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded shadow-lg w-full max-w-lg relative max-h-[90vh] flex flex-col">
        <div className="flex-shrink-0 p-6 pb-4 border-b">
          <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" onClick={onClose}>×</button>
          <h2 className="text-xl font-bold">{initialData ? 'Edit Listing' : 'Add Listing'}</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 pt-4">
          <form onSubmit={handleSubmit}>
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
              <select className="w-full border rounded p-2" value={isPrivateSeller ? 'PRIVATE' : form.sellerId} onChange={handleSellerChange} required>
              <option value="">Select seller</option>
              {sellers.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name}{s.manager ? ` (Agent: ${s.manager.name})` : ''}
                </option>
              ))}
                <option value="PRIVATE">Private Seller</option>
            </select>
          </div>
            
            {isPrivateSeller && (
              <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <h4 className="font-semibold mb-2 text-yellow-800">Private Seller Information</h4>
                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={`w-full border rounded p-2 ${validationError && !privateSellerData.name.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                      value={privateSellerData.name}
                      onChange={e => handlePrivateSellerChange('name', e.target.value)}
                      required={isPrivateSeller}
                      placeholder="Seller's full name"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      className={`w-full border rounded p-2 ${validationError && (!privateSellerData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(privateSellerData.email)) ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                      value={privateSellerData.email}
                      onChange={e => handlePrivateSellerChange('email', e.target.value)}
                      required={isPrivateSeller}
                      placeholder="Seller's email address"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">Phone (Optional)</label>
                    <input
                      type="tel"
                      className="w-full border border-gray-300 rounded p-2"
                      value={privateSellerData.phone}
                      onChange={e => handlePrivateSellerChange('phone', e.target.value)}
                      placeholder="Seller's phone number"
                    />
                  </div>
                </div>
                <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm text-blue-800">
                    <strong>📋 Important:</strong> This seller will need to be registered in the system later to access their portal. 
                    Please update this listing once the seller is registered.
                  </p>
                </div>
              </div>
            )}
            
          <div className="mb-3">
            <label className="block mb-1">Agent</label>
              {hasExistingAgent && !isPrivateSeller ? (
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
              {hasExistingAgent && !isPrivateSeller && (
              <small className="text-gray-500 mt-1 block">
                This seller already has an assigned agent. To change the agent, please use the agent management interface.
              </small>
            )}
          </div>
            <div className="mb-6">
            <label className="block mb-1">Buyers</label>
              <select multiple className="w-full border rounded p-2 h-24" value={form.buyerIds} onChange={e => {
              const options = Array.from(e.target.selectedOptions).map(opt => opt.value);
              setForm(f => ({ ...f, buyerIds: options }));
            }}>
              {buyers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <small className="text-gray-500">Hold Ctrl/Cmd to select multiple buyers</small>
          </div>
          </form>
        </div>
        
        <div className="flex-shrink-0 p-6 pt-4 border-t bg-gray-50">
          {validationError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="text-red-800 text-sm">
                <strong>Validation Error:</strong> {validationError}
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <button type="button" className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={onClose}>Cancel</button>
            <button 
              type="submit" 
              className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
              onClick={handleSubmit}
            >
              {initialData ? 'Save' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 