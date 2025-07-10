// client/src/services/broker.ts
import { API_BASE_URL } from '../config';

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

// 统一的认证请求函数
const makeAuthenticatedRequest = async (
  url: string, 
  options: RequestInit = {}
): Promise<Response> => {
  // 获取用户信息
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  
  // 获取session token用于跨域认证
  const sessionToken = localStorage.getItem('session_token');
  
  // 检测无痕模式
  const isIncognito = (() => {
    try {
      // 检测私有模式的多种方法
      const testKey = '__test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return false;
    } catch {
      return true;
    }
  })();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>
  };

  // 添加浏览器模式标识
  if (isIncognito) {
    headers['X-Browser-Mode'] = 'incognito';
  }

  // 优先使用session token，然后是用户ID
  if (sessionToken) {
    headers['X-Session-Token'] = sessionToken;
  } else if (user?.id) {
    headers['X-Session-Token'] = user.id;
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include' // 仍然发送 cookies，作为备用
  };

  console.log('Making authenticated request:', {
    url,
    isIncognito,
    hasUser: !!user,
    hasSessionToken: !!sessionToken,
    headers: Object.keys(headers)
  });

  try {
    const response = await fetch(url, config);
    
    // 如果是认证错误，尝试清理本地状态并重定向到登录
    if (response.status === 401) {
      console.warn('Authentication failed, clearing local storage');
      localStorage.removeItem('user');
      localStorage.removeItem('session_token');
      localStorage.removeItem('auth_token');
      // 可以在这里添加重定向到登录页面的逻辑
      throw new Error('Authentication required');
    }
    
    return response;
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
};

// 创建一个包装函数来处理 JSON 响应
const makeRequest = async (endpoint: string, options: RequestInit = {}) => {
  const response = await makeAuthenticatedRequest(`${API_BASE_URL}${endpoint}`, options);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Broker ${endpoint} request failed:`, response.status, errorText);
    throw new Error(`Failed to ${options.method || 'GET'} ${endpoint}: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

export const brokerService = {
  getDashboardStats: () => makeRequest('/broker/dashboard'),
  
  getAgents: () => makeRequest('/broker/agents'),
  
  getAgentStats: (agentId: string) => makeRequest(`/broker/agent/${agentId}/stats`),
  
  getAgentsWithStats: () => makeRequest('/broker/agents-with-stats'),
  
  getAgentDetails: (agentId: string) => makeRequest(`/broker/agent/${agentId}`),
  
  getListings: () => makeRequest('/broker/listings'),
  
  getListingDetails: (listingId: string) => makeRequest(`/broker/listings/${listingId}`),
  
  updateListing: (listingId: string, data: any) => makeRequest(`/broker/listings/${listingId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  
  getSellers: () => makeRequest('/broker/sellers'),
  
  getBuyers: () => makeRequest('/broker/buyers'),
  
  // 文档相关
  getListingDocuments: (listingId: string) => makeRequest(`/broker/listings/${listingId}/documents`),
  
  uploadListingDocument: async (listingId: string, formData: FormData) => {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/broker/listings/${listingId}/documents`, {
      method: 'POST',
      body: formData,
      headers: {} // 不设置 Content-Type，让浏览器自动设置
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to upload document: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  },
  
  deleteListingDocument: (listingId: string, documentId: string) => makeRequest(`/broker/listings/${listingId}/documents/${documentId}`, {
    method: 'DELETE'
  }),
  
  // 预关闭清单
  getPreCloseChecklist: (listingId: string) => makeRequest(`/broker/listings/${listingId}/pre-close-checklist`),
  
  updatePreCloseChecklist: (listingId: string, data: any) => makeRequest(`/broker/listings/${listingId}/pre-close-checklist`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
};