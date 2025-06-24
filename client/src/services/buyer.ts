import { API_BASE_URL } from '../config';

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  status: string;
  createdAt: string;
}

export interface ExtendedListing extends Listing {
  createdAt: string;
  seller?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CurrentListingResponse {
  listing: ExtendedListing | null;
  needsSelection: boolean;
  currentStep?: number;
  completedSteps?: number[];
}

export interface DashboardStats {
  emailAgent: 'completed' | 'pending';
  nda: 'completed' | 'pending';
  financialStatement: 'completed' | 'pending';
  cbrCim: 'completed' | 'pending';
  uploadedDocs: 'completed' | 'pending';
  purchaseContract: 'completed' | 'pending';
  dueDiligence: 'completed' | 'pending';
  preCloseChecklist: 'completed' | 'pending';
  closingDocs: 'completed' | 'pending';
}

export interface Document {
  id: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface DashboardResponse {
  stats: DashboardStats;
  message: string;
}

interface DocumentsResponse {
  documents: Document[];
  message: string;
}

export interface BuyerProgress {
  currentStep: number;
  steps: Array<{
    id: number;
    title: string;
    completed: boolean;
    accessible: boolean;
    documentRequirement?: {
      type: string;
      operationType: string;
      description: string;
    };
  }>;
  selectedListingId: string | null;
}

export interface BuyerProgressResponse {
  progress: BuyerProgress;
}

// 统一的认证请求函数
const makeAuthenticatedRequest = async (
  url: string, 
  options: RequestInit = {}
): Promise<Response> => {
  // 获取用户信息
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  
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

  // 添加用户会话令牌（如果有）
  if (user?.id) {
    headers['X-Session-Token'] = user.id;
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include' // 确保发送 cookies
  };

  console.log('Making authenticated request:', {
    url,
    isIncognito,
    hasUser: !!user,
    headers: Object.keys(headers)
  });

  try {
    const response = await fetch(url, config);
    
    // 如果是认证错误，尝试清理本地状态并重定向到登录
    if (response.status === 401) {
      console.warn('Authentication failed, clearing local storage');
      localStorage.removeItem('user');
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
    console.error(`Buyer ${endpoint} request failed:`, response.status, errorText);
    throw new Error(`Failed to ${options.method || 'GET'} ${endpoint}: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

export const buyerService = {
  getDashboardStats: () => makeRequest('/buyer/dashboard'),
  
  getDocuments: () => makeRequest('/buyer/documents'),
  
  uploadDocument: async (formData: FormData) => {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/buyer/documents/upload`, {
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
  
  emailAgent: (data: any) => makeRequest('/buyer/email-agent', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  getNDA: () => makeRequest('/buyer/nda'),
  
  getFinancialStatement: () => makeRequest('/buyer/financial-statement'),
  
  getCbrCim: () => makeRequest('/buyer/cbr-cim'),
  
  getPurchaseContract: () => makeRequest('/buyer/purchase-contract'),
  
  getDueDiligence: () => makeRequest('/buyer/due-diligence'),
  
  getPreCloseChecklist: () => makeRequest('/buyer/pre-close-checklist'),
  
  updatePreCloseChecklist: (data: any) => makeRequest('/buyer/pre-close-checklist', {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  
  getClosingDocuments: () => makeRequest('/buyer/closing-documents'),
  
  getProgress: () => makeRequest('/buyer/progress'),
  
  updateStep: (step: number, completed: boolean) => makeRequest('/buyer/update-step', {
    method: 'PUT',
    body: JSON.stringify({ step, completed })
  }),
  
  selectListing: (listingId: string) => makeRequest('/buyer/select-listing', {
    method: 'POST',
    body: JSON.stringify({ listingId })
  }),
  
  getCurrentListing: () => makeRequest('/buyer/current-listing'),
  
  getListings: () => makeRequest('/buyer/listings'),

  // 新增的方法
  downloadDocument: (documentId: string) => makeRequest(`/buyer/download-document/${documentId}`),
  
  requestDueDiligence: (listingId: string, documentTypes: string[]) => makeRequest(`/buyer/listings/${listingId}/due-diligence/request`, {
    method: 'POST',
    body: JSON.stringify({ documentTypes })
  }),
  
  downloadDueDiligenceDocument: (listingId: string, documentId: string) => makeRequest(`/buyer/listings/${listingId}/due-diligence/download/${documentId}`),
  
  getAgentDocuments: (listingId: string) => makeRequest(`/buyer/listings/${listingId}/agent-documents`),
  
  downloadAgentDocument: (documentId: string) => makeRequest(`/buyer/download-agent-document/${documentId}`)
}; 