// client/src/services/broker.ts
import { API_BASE_URL } from '../config';
import { authService } from './auth';

export interface BrokerDashboardStats {
  totalAgents: number;
  totalListings: number;
  totalSellers: number;
  totalBuyers: number;
  activeDeals: number;
  completedDeals: number;
}

export interface AgentStats {
  id: string;
  name: string;
  email: string;
  assignedListings: number;
  activeSellers: number;
  activeBuyers: number;
  completedDeals: number;
}

// 创建一个通用的 API 请求函数
const makeAuthenticatedRequest = async (endpoint: string, options: RequestInit = {}) => {
  const requestConfig = authService.getAuthenticatedRequestConfig();
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...requestConfig,
    ...options,
    headers: {
      ...requestConfig.headers,
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `Failed to ${options.method || 'GET'} ${endpoint}`);
  }

  return response.json();
};

export const brokerService = {
  getDashboardStats: () => makeAuthenticatedRequest('/broker/dashboard'),
  
  getAgents: () => makeAuthenticatedRequest('/broker/agents'),
  
  getAgentStats: (agentId: string) => makeAuthenticatedRequest(`/broker/agent/${agentId}/stats`),
  
  getAgentsWithStats: () => makeAuthenticatedRequest('/broker/agents-with-stats'),
  
  getAgentDetails: (agentId: string) => makeAuthenticatedRequest(`/broker/agent/${agentId}`),
  
  getListings: () => makeAuthenticatedRequest('/broker/listings'),
  
  getListingDetails: (listingId: string) => makeAuthenticatedRequest(`/broker/listings/${listingId}`),
  
  updateListing: (listingId: string, data: any) => makeAuthenticatedRequest(`/broker/listings/${listingId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  
  getSellers: () => makeAuthenticatedRequest('/broker/sellers'),
  
  getBuyers: () => makeAuthenticatedRequest('/broker/buyers'),
  
  // 文档相关
  getListingDocuments: (listingId: string) => makeAuthenticatedRequest(`/broker/listings/${listingId}/documents`),
  
  uploadListingDocument: (listingId: string, formData: FormData) => makeAuthenticatedRequest(`/broker/listings/${listingId}/documents`, {
    method: 'POST',
    body: formData,
    headers: {
      // 不设置 Content-Type，让浏览器自动设置
    }
  }),
  
  deleteListingDocument: (listingId: string, documentId: string) => makeAuthenticatedRequest(`/broker/listings/${listingId}/documents/${documentId}`, {
    method: 'DELETE'
  }),
  
  // 预关闭清单
  getPreCloseChecklist: (listingId: string) => makeAuthenticatedRequest(`/broker/listings/${listingId}/pre-close-checklist`),
  
  updatePreCloseChecklist: (listingId: string, data: any) => makeAuthenticatedRequest(`/broker/listings/${listingId}/pre-close-checklist`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
};