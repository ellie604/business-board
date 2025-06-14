import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

interface ChecklistItem {
  id: string;
  task: string;
  completed: boolean;
  responsible: 'buyer' | 'seller' | 'broker';
  required: boolean;
  completedBy?: string;
  completedAt?: string;
}

interface ChecklistCategory {
  id: string;
  title: string;
  items: ChecklistItem[];
}

interface PreCloseChecklistProps {
  listingId: string;
  userRole: 'BUYER' | 'SELLER' | 'BROKER' | 'AGENT';
  currentUserName?: string;
  onStepComplete?: () => void;
  className?: string;
}

const PreCloseChecklist: React.FC<PreCloseChecklistProps> = ({ 
  listingId, 
  userRole, 
  currentUserName = 'Unknown User',
  onStepComplete,
  className = ''
}) => {
  const [checklist, setChecklist] = useState<ChecklistCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [lastUpdatedBy, setLastUpdatedBy] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);

  // Define the complete checklist structure
  const defaultChecklist: ChecklistCategory[] = [
    {
      id: 'letter-of-intent',
      title: 'A. Letter Of Intent',
      items: [
        { id: 'buyer-offer', task: 'Buyer offer', completed: false, responsible: 'buyer', required: true },
        { id: 'seller-counter', task: 'Seller counter', completed: false, responsible: 'seller', required: false },
        { id: 'negotiate-agreement', task: 'Negotiate mutual agreement', completed: false, responsible: 'seller', required: false },
        { id: 'buyer-earnest-money', task: 'Buyer provides Earnest Money', completed: false, responsible: 'buyer', required: true },
        { id: 'broker-deposits-earnest', task: 'Broker deposits Earnest Money', completed: false, responsible: 'broker', required: true },
      ]
    },
    {
      id: 'asset-purchase-agreement',
      title: 'B. Asset Purchase Agreement',
      items: [
        { id: 'buyer-offer-apa', task: 'Buyer offer', completed: false, responsible: 'buyer', required: true },
        { id: 'buyer-attorney-review', task: 'Attorney review', completed: false, responsible: 'buyer', required: true },
        { id: 'buyer-accountant-review', task: 'Accountant review', completed: false, responsible: 'buyer', required: true },
        { id: 'seller-counter-apa', task: 'Seller counter', completed: false, responsible: 'seller', required: false },
        { id: 'seller-attorney-review', task: 'Attorney review', completed: false, responsible: 'seller', required: false },
        { id: 'seller-accountant-review', task: 'Accountant review', completed: false, responsible: 'seller', required: false },
        { id: 'negotiate-execute-agreement', task: 'Negotiate and execute mutual agreement', completed: false, responsible: 'buyer', required: true },
        { id: 'negotiate-execute-agreement-seller', task: 'Negotiate and execute mutual agreement', completed: false, responsible: 'seller', required: true },
      ]
    },
    {
      id: 'exhibits',
      title: 'C. Exhibits',
      items: [
        { id: 'asset-list', task: 'Current Furniture, Fixtures & Equipment List ("Asset List")', completed: false, responsible: 'broker', required: true },
        { id: 'seller-financial-info', task: "Seller's financial information", completed: false, responsible: 'seller', required: true },
        { id: 'buyer-financial-info', task: "Buyer's financial information", completed: false, responsible: 'buyer', required: true },
        { id: 'contract-rights', task: 'Contract Rights', completed: false, responsible: 'seller', required: true },
        { id: 'other-1', task: 'Other:', completed: false, responsible: 'broker', required: false },
        { id: 'other-2', task: 'Other:', completed: false, responsible: 'broker', required: false },
        { id: 'other-3', task: 'Other:', completed: false, responsible: 'broker', required: false },
      ]
    },
    {
      id: 'contingencies',
      title: 'D. Asset Purchase Agreement Contingencies',
      items: [
        { id: 'seller-contacts-landlord', task: 'Seller contacts landlord', completed: false, responsible: 'seller', required: true },
        { id: 'buyer-meeting-landlord', task: 'Buyer meeting with landlord', completed: false, responsible: 'buyer', required: true },
        { id: 'lease-documents-prep', task: 'Preparation of lease documents', completed: false, responsible: 'buyer', required: true },
        { id: 'lease-assignment', task: 'Lease assignment or new lease', completed: false, responsible: 'buyer', required: true },
        { id: 'seller-security-deposit', task: "Seller's security deposit", completed: false, responsible: 'seller', required: false },
        { id: 'buyer-security-deposit', task: "Buyer's security deposit", completed: false, responsible: 'buyer', required: false },
        { id: 'rent-proration', task: 'Rent proration', completed: false, responsible: 'seller', required: true },
        { id: 'seller-walkthrough', task: 'Seller walk thru with landlord and/or Buyer', completed: false, responsible: 'buyer', required: true },
        { id: 'seller-walkthrough-seller', task: 'Seller walk thru with landlord and/or Buyer', completed: false, responsible: 'seller', required: true },
        { id: 'conditional-lease-assignment', task: 'Conditional lease assignment', completed: false, responsible: 'broker', required: false },
        { id: 'guaranty-lease', task: 'Guaranty of lease', completed: false, responsible: 'buyer', required: true },
        { id: 'right-inspection', task: 'Right of Inspection', completed: false, responsible: 'buyer', required: true },
        { id: 'due-diligence-list', task: 'Buyer provide list of due diligence requirements', completed: false, responsible: 'buyer', required: true },
        { id: 'due-diligence-list-seller', task: 'Buyer provide list of due diligence requirements', completed: false, responsible: 'seller', required: true },
        { id: 'action-plan-buyer', task: 'Buyer & Seller agree on plan of action to satisfy contingencies', completed: false, responsible: 'buyer', required: true },
        { id: 'action-plan-seller', task: 'Buyer & Seller agree on plan of action to satisfy contingencies', completed: false, responsible: 'seller', required: true },
        { id: 'financials-buyer', task: 'Financials', completed: false, responsible: 'buyer', required: true },
        { id: 'financials-seller', task: 'Financials', completed: false, responsible: 'seller', required: true },
        { id: 'premises-inspection-buyer', task: 'Premises inspections', completed: false, responsible: 'buyer', required: true },
        { id: 'premises-inspection-seller', task: 'Premises inspections', completed: false, responsible: 'seller', required: true },
      ]
    }
  ];

  useEffect(() => {
    fetchChecklist();
  }, [listingId]);

  const fetchChecklist = async () => {
    try {
      setLoading(true);
      const endpoint = getUserEndpoint();
      const response = await fetch(`${API_BASE_URL}${endpoint}/listings/${listingId}/pre-close-checklist`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.checklist) {
          // Sort the checklist to ensure correct order (A, B, C, D)
          const sortedChecklist = sortChecklistByOrder(data.checklist);
          setChecklist(sortedChecklist);
          setLastUpdatedBy(data.lastUpdatedBy);
          setLastUpdatedAt(data.updatedAt);
        } else {
          // Initialize with default checklist if none exists
          setChecklist(defaultChecklist);
        }
      } else {
        // If checklist doesn't exist, use default
        setChecklist(defaultChecklist);
      }
    } catch (error) {
      console.error('Error fetching checklist:', error);
      setChecklist(defaultChecklist);
    } finally {
      setLoading(false);
    }
  };

  // Function to sort checklist categories in the correct order
  const sortChecklistByOrder = (checklist: ChecklistCategory[]): ChecklistCategory[] => {
    const orderMap = {
      'letter-of-intent': 1,
      'asset-purchase-agreement': 2,
      'exhibits': 3,
      'contingencies': 4
    };

    return checklist.sort((a, b) => {
      const orderA = orderMap[a.id as keyof typeof orderMap] || 999;
      const orderB = orderMap[b.id as keyof typeof orderMap] || 999;
      return orderA - orderB;
    });
  };

  const getUserEndpoint = () => {
    switch (userRole) {
      case 'BROKER':
        return '/broker';
      case 'AGENT':
        return '/agent';
      case 'SELLER':
        return '/seller';
      case 'BUYER':
        return '/buyer';
      default:
        return '/seller';
    }
  };

  const handleItemToggle = async (categoryId: string, itemId: string) => {
    if (updating) return;

    setUpdating(itemId);
    
    try {
      const endpoint = getUserEndpoint();
      const response = await fetch(`${API_BASE_URL}${endpoint}/listings/${listingId}/pre-close-checklist/item`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ 
          categoryId, 
          itemId,
          userRole
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Sort the updated checklist to maintain correct order
        const sortedChecklist = sortChecklistByOrder(data.checklist);
        setChecklist(sortedChecklist);
        setLastUpdatedBy(data.lastUpdatedBy);
        setLastUpdatedAt(data.updatedAt);
      } else {
        throw new Error('Failed to update checklist item');
      }
    } catch (error) {
      console.error('Error updating checklist item:', error);
      alert('Failed to update checklist item. Please try again.');
    } finally {
      setUpdating(null);
    }
  };

  const getCompletionStats = () => {
    const allItems = checklist.flatMap(cat => cat.items);
    const totalItems = allItems.length;
    const completedItems = allItems.filter(item => item.completed).length;
    
    return {
      totalItems,
      completedItems,
      overallProgress: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
    };
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const stats = getCompletionStats();

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Pre-Close Checklist</h3>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {stats.completedItems} of {stats.totalItems} completed
            </span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div 
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${stats.overallProgress}%` }}
          ></div>
        </div>
        <div className="text-sm text-gray-600">
          Overall Progress: {stats.overallProgress}%
        </div>

        {/* Last Updated */}
        {lastUpdatedBy && (
          <div className="mt-2 text-xs text-gray-500">
            Last updated by {lastUpdatedBy} 
            {lastUpdatedAt && ` on ${new Date(lastUpdatedAt).toLocaleString()}`}
          </div>
        )}
      </div>

      {/* Table Layout */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="bg-gray-100 border-b border-gray-300">
          <div className="grid grid-cols-12 gap-0">
            <div className="col-span-10 px-4 py-3 text-left text-sm font-semibold text-gray-900 border-r border-gray-300">
              Task
            </div>
            <div className="col-span-1 px-2 py-3 text-center text-sm font-semibold text-gray-900 border-r border-gray-300">
              Buyer
            </div>
            <div className="col-span-1 px-2 py-3 text-center text-sm font-semibold text-gray-900">
              Seller
            </div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200">
          {checklist.map((category) => (
            <React.Fragment key={category.id}>
              {/* Category Header */}
              <div className="bg-blue-50">
                <div className="grid grid-cols-12 gap-0">
                  <div className="col-span-12 px-4 py-3 text-left text-sm font-bold text-blue-900">
                    {category.title}
                  </div>
                </div>
              </div>

              {/* Category Items */}
              {category.items.map((item, index) => {
                const isUpdating = updating === item.id;
                const isBuyerTask = item.responsible === 'buyer';
                const isSellerTask = item.responsible === 'seller';
                const isBrokerTask = item.responsible === 'broker';
                
                return (
                  <div key={item.id} className="hover:bg-gray-50">
                    <div className="grid grid-cols-12 gap-0">
                      {/* Task Description */}
                      <div className="col-span-10 px-4 py-3 border-r border-gray-200">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-900 mr-2">
                            {index + 1}. {item.task}
                          </span>
                          {item.required && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs font-medium ml-2">
                              Required
                            </span>
                          )}
                          {isBrokerTask && (
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-xs font-medium ml-2">
                              Broker
                            </span>
                          )}
                        </div>
                        {item.completed && item.completedBy && (
                          <div className="text-xs text-gray-500 mt-1">
                            Completed by {item.completedBy}
                            {item.completedAt && ` on ${new Date(item.completedAt).toLocaleString()}`}
                          </div>
                        )}
                      </div>

                      {/* Buyer Checkbox */}
                      <div className="col-span-1 px-2 py-3 border-r border-gray-200 flex justify-center items-center">
                        {(isBuyerTask || isBrokerTask) ? (
                          <button
                            onClick={() => handleItemToggle(category.id, item.id)}
                            disabled={isUpdating}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                              item.completed 
                                ? 'bg-blue-500 border-blue-500 text-white' 
                                : 'border-gray-300 hover:border-blue-500'
                            } ${isUpdating ? 'animate-pulse' : ''}`}
                          >
                            {isUpdating ? (
                              <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                            ) : item.completed ? (
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <span className="text-xs text-blue-600">✓</span>
                            )}
                          </button>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </div>

                      {/* Seller Checkbox */}
                      <div className="col-span-1 px-2 py-3 flex justify-center items-center">
                        {(isSellerTask || isBrokerTask) ? (
                          <button
                            onClick={() => handleItemToggle(category.id, item.id)}
                            disabled={isUpdating}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                              item.completed 
                                ? 'bg-green-500 border-green-500 text-white' 
                                : 'border-gray-300 hover:border-green-500'
                            } ${isUpdating ? 'animate-pulse' : ''}`}
                          >
                            {isUpdating ? (
                              <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                            ) : item.completed ? (
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <span className="text-xs text-green-600">✓</span>
                            )}
                          </button>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          <strong>Note:</strong> All users (Buyer, Seller, Broker, Agent) can edit items in this checklist. 
          Blue checkboxes indicate Buyer responsibilities, Green checkboxes indicate Seller responsibilities, 
          and Purple tags indicate Broker/Agent responsibilities.
        </p>
      </div>
    </div>
  );
};

export default PreCloseChecklist; 