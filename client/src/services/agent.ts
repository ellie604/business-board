import { API_BASE_URL } from '../config';

export interface DashboardStats {
  totalActiveListings: number;
  totalUnderContract: number;
  newListingsThisMonth: number;
  totalNDA: number;
  totalClosedDeals: number;
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

export const agentService = {
  getDashboardStats: async (): Promise<{ stats: DashboardStats }> => {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/agent/dashboard`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Dashboard stats request failed:', response.status, errorText);
      throw new Error(`Failed to fetch dashboard stats: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  },

  getListings: async () => {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/agent/listings`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Listings request failed:', response.status, errorText);
      throw new Error(`Failed to fetch listings: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  },

  getSellers: async () => {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/agent/sellers`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Sellers request failed:', response.status, errorText);
      throw new Error(`Failed to fetch sellers: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  },

  getBuyers: async () => {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/agent/buyers`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Buyers request failed:', response.status, errorText);
      throw new Error(`Failed to fetch buyers: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  },

  deleteMessage: async (messageId: string) => {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/messages/${messageId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Delete message request failed:', response.status, errorText);
      throw new Error(`Failed to delete message: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }
}; 