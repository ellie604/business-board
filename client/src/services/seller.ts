// import axios from 'axios';
import { API_BASE_URL } from '../config';

export interface DashboardStats {
  currentStep: number;
  totalSteps: number;
  completedSteps: number;
  selectedListingId?: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  status: string;
}

export interface DocumentRequirement {
  type: string;
  operationType: 'UPLOAD' | 'DOWNLOAD' | 'BOTH' | 'NONE';
  description: string;
}

export interface StepDocument {
  id: string;
  type: string;
  status: string;
  url?: string;
  fileName?: string;
  fileSize?: number;
  operationType: string;
  stepId: number;
  uploadedAt?: string;
  downloadedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SellerProgress {
  currentStep: number;
  steps: {
    id: number;
    title: string;
    completed: boolean;
    accessible: boolean;
    documentRequirement?: DocumentRequirement;
    documents?: StepDocument[];
  }[];
  selectedListingId?: string;
}

interface Document {
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

interface StepDocumentsResponse {
  documents: StepDocument[];
  requirement: DocumentRequirement;
}

// Add simple in-memory cache
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

class Cache {
  private cache = new Map<string, CacheItem<any>>();
  private readonly DEFAULT_TTL = 30000; // 30 seconds default TTL

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + ttl
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data as T;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}

// Global cache instance
const cache = new Cache();

// Request deduplication
const pendingRequests = new Map<string, Promise<any>>();

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
    console.error(`Seller ${endpoint} request failed:`, response.status, errorText);
    throw new Error(`Failed to ${options.method || 'GET'} ${endpoint}: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

export const sellerService = {
  getDashboardStats: () => makeRequest('/seller/dashboard'),
  
  getDocuments: () => makeRequest('/seller/documents'),
  
  uploadDocument: async (formData: FormData) => {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/seller/documents/upload`, {
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
  
  getListingAgreement: () => makeRequest('/seller/listing-agreement'),
  
  getPurchaseAgreement: () => makeRequest('/seller/purchase-agreement'),
  
  getDueDiligence: () => makeRequest('/seller/due-diligence'),
  
  getPreCloseChecklist: () => makeRequest('/seller/pre-close-checklist'),
  
  updatePreCloseChecklist: (data: any) => makeRequest('/seller/pre-close-checklist', {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  
  getClosingDocuments: () => makeRequest('/seller/closing-documents'),
  
  // 新增的方法
  downloadDocument: (documentId: string) => makeRequest(`/seller/download-document/${documentId}`),
  
  getProgress: () => makeRequest('/seller/progress'),
  
  updateStep: (step: number, completed: boolean) => makeRequest('/seller/update-step', {
    method: 'PUT',
    body: JSON.stringify({ step, completed })
  }),
  
  // 尽职调查相关
  getDueDiligenceRequests: (listingId: string) => makeRequest(`/seller/listings/${listingId}/due-diligence/requests`),
  
  uploadDueDiligenceDocument: async (listingId: string, requestId: string, formData: FormData) => {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/seller/listings/${listingId}/due-diligence/${requestId}/upload`, {
      method: 'POST',
      body: formData,
      headers: {} // 不设置 Content-Type，让浏览器自动设置
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to upload due diligence document: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  },
  
  // 列表相关
  getListings: () => makeRequest('/seller/listings'),
  
  getListingDetails: (listingId: string) => makeRequest(`/seller/listings/${listingId}`),
  
  // 买家相关
  getInterestedBuyers: (listingId: string) => makeRequest(`/seller/listings/${listingId}/interested-buyers`),
  
  approveBuyer: (listingId: string, buyerId: string) => makeRequest(`/seller/listings/${listingId}/approve-buyer`, {
    method: 'POST',
    body: JSON.stringify({ buyerId })
  }),
  
  rejectBuyer: (listingId: string, buyerId: string) => makeRequest(`/seller/listings/${listingId}/reject-buyer`, {
    method: 'POST',
    body: JSON.stringify({ buyerId })
  }),

  async selectListing(listingId: string): Promise<{ message: string; listing: any; progress: any }> {
    // Clear both progress and listings cache when selecting
    cache.delete('seller_progress');
    cache.delete('current_listing');
    return makeRequest('/seller/select-listing', {
      method: 'POST',
      body: JSON.stringify({ listingId }),
    });
  },

  async getCurrentListing(): Promise<{ listing: any; needsSelection: boolean }> {
    return makeRequest('/seller/current-listing');
  },

  async markStepCompleted(stepId: number): Promise<{ message: string; progress: any }> {
    // Clear progress cache when marking step as completed
    cache.delete('seller_progress');
    return makeRequest('/seller/mark-step-completed', {
      method: 'POST',
      body: JSON.stringify({ stepId }),
    });
  },

  async markStepIncomplete(stepId: number): Promise<{ message: string; progress: any }> {
    // Clear progress cache when marking step as incomplete
    cache.delete('seller_progress');
    return makeRequest('/seller/mark-step-incomplete', {
      method: 'POST',
      body: JSON.stringify({ stepId }),
    });
  },

  async getStepDocuments(stepId: number): Promise<{ documents: any[]; requirement: DocumentRequirement }> {
    return makeRequest(`/seller/step/${stepId}/documents`);
  },

  async uploadStepDocument(stepId: number, fileName: string, fileUrl: string, fileSize: number): Promise<{ document: any }> {
    // Clear step documents cache when uploading
    cache.delete(`step_${stepId}_documents`);
    return makeRequest(`/seller/step/${stepId}/upload`, {
      method: 'POST',
      body: JSON.stringify({ fileName, fileUrl, fileSize }),
    });
  },

  async downloadStepDocument(stepId: number): Promise<{ document: any }> {
    // Clear step documents cache when downloading
    cache.delete(`step_${stepId}_documents`);
    return makeRequest(`/seller/step/${stepId}/download`, {
      method: 'POST',
    });
  },

  async submitQuestionnaire(questionnaire: any): Promise<{ message: string; document: any }> {
    // Clear questionnaire cache when submitting
    cache.delete('seller_questionnaire');
    cache.delete('seller_progress'); // Also clear progress since this affects step completion
    return makeRequest('/seller/questionnaire/submit', {
      method: 'POST',
      body: JSON.stringify({ questionnaire }),
    });
  },

  async submitListingAgreement(data: any): Promise<void> {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/seller/listing-agreement`, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to submit listing agreement: ${response.status} ${response.statusText}`);
    }
  },

  async submitDueDiligence(data: any): Promise<void> {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/seller/due-diligence`, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to submit due diligence: ${response.status} ${response.statusText}`);
    }
  },

  async getListingBuyers(): Promise<any[]> {
    return makeRequest('/seller/listing-buyers');
  },

  async getQuestionnaire(): Promise<{ questionnaire: any }> {
    return makeRequest('/seller/questionnaire');
  },

  async saveQuestionnaire(questionnaire: any): Promise<{ message: string }> {
    // Clear questionnaire cache when saving
    cache.delete('seller_questionnaire');
    return makeRequest('/seller/questionnaire/save', {
      method: 'POST',
      body: JSON.stringify({ questionnaire }),
    });
  },

  clearCache(): void {
    cache.clear();
  },

  clearCacheFor(keys: string[]): void {
    keys.forEach(key => cache.delete(key));
  }
}; 