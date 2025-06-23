// import axios from 'axios';
import { API_BASE_URL } from '../config';
import { authService } from './auth';

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

export const sellerService = {
  getDashboardStats: () => makeAuthenticatedRequest('/seller/dashboard'),
  
  getDocuments: () => makeAuthenticatedRequest('/seller/documents'),
  
  uploadDocument: (formData: FormData) => makeAuthenticatedRequest('/seller/documents/upload', {
    method: 'POST',
    body: formData,
    headers: {
      // 不设置 Content-Type，让浏览器自动设置
    }
  }),
  
  getListingAgreement: () => makeAuthenticatedRequest('/seller/listing-agreement'),
  
  getPurchaseAgreement: () => makeAuthenticatedRequest('/seller/purchase-agreement'),
  
  getDueDiligence: () => makeAuthenticatedRequest('/seller/due-diligence'),
  
  getPreCloseChecklist: () => makeAuthenticatedRequest('/seller/pre-close-checklist'),
  
  updatePreCloseChecklist: (data: any) => makeAuthenticatedRequest('/seller/pre-close-checklist', {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  
  getClosingDocuments: () => makeAuthenticatedRequest('/seller/closing-documents'),
  
  // 新增的方法
  downloadDocument: (documentId: string) => makeAuthenticatedRequest(`/seller/download-document/${documentId}`),
  
  getProgress: () => makeAuthenticatedRequest('/seller/progress'),
  
  updateStep: (step: number, completed: boolean) => makeAuthenticatedRequest('/seller/update-step', {
    method: 'PUT',
    body: JSON.stringify({ step, completed })
  }),
  
  // 尽职调查相关
  getDueDiligenceRequests: (listingId: string) => makeAuthenticatedRequest(`/seller/listings/${listingId}/due-diligence/requests`),
  
  uploadDueDiligenceDocument: (listingId: string, requestId: string, formData: FormData) => makeAuthenticatedRequest(`/seller/listings/${listingId}/due-diligence/${requestId}/upload`, {
    method: 'POST',
    body: formData,
    headers: {
      // 不设置 Content-Type，让浏览器自动设置
    }
  }),
  
  // 列表相关
  getListings: () => makeAuthenticatedRequest('/seller/listings'),
  
  getListingDetails: (listingId: string) => makeAuthenticatedRequest(`/seller/listings/${listingId}`),
  
  // 买家相关
  getInterestedBuyers: (listingId: string) => makeAuthenticatedRequest(`/seller/listings/${listingId}/interested-buyers`),
  
  approveBuyer: (listingId: string, buyerId: string) => makeAuthenticatedRequest(`/seller/listings/${listingId}/approve-buyer`, {
    method: 'POST',
    body: JSON.stringify({ buyerId })
  }),
  
  rejectBuyer: (listingId: string, buyerId: string) => makeAuthenticatedRequest(`/seller/listings/${listingId}/reject-buyer`, {
    method: 'POST',
    body: JSON.stringify({ buyerId })
  }),

  async selectListing(listingId: string): Promise<{ message: string; listing: any; progress: any }> {
    // Clear both progress and listings cache when selecting
    cache.delete('seller_progress');
    cache.delete('current_listing');
    return makeAuthenticatedRequest('/seller/select-listing', {
      method: 'POST',
      body: JSON.stringify({ listingId }),
    });
  },

  async getCurrentListing(): Promise<{ listing: any; needsSelection: boolean }> {
    return makeAuthenticatedRequest('/seller/current-listing');
  },

  async markStepCompleted(stepId: number): Promise<{ message: string; progress: any }> {
    // Clear progress cache when marking step as completed
    cache.delete('seller_progress');
    return makeAuthenticatedRequest('/seller/mark-step-completed', {
      method: 'POST',
      body: JSON.stringify({ stepId }),
    });
  },

  async markStepIncomplete(stepId: number): Promise<{ message: string; progress: any }> {
    // Clear progress cache when marking step as incomplete
    cache.delete('seller_progress');
    return makeAuthenticatedRequest('/seller/mark-step-incomplete', {
      method: 'POST',
      body: JSON.stringify({ stepId }),
    });
  },

  async getStepDocuments(stepId: number): Promise<{ documents: any[]; requirement: DocumentRequirement }> {
    return makeAuthenticatedRequest(`/seller/step/${stepId}/documents`);
  },

  async uploadStepDocument(stepId: number, fileName: string, fileUrl: string, fileSize: number): Promise<{ document: any }> {
    // Clear step documents cache when uploading
    cache.delete(`step_${stepId}_documents`);
    return makeAuthenticatedRequest(`/seller/step/${stepId}/upload`, {
      method: 'POST',
      body: JSON.stringify({ fileName, fileUrl, fileSize }),
    });
  },

  async downloadStepDocument(stepId: number): Promise<{ document: any }> {
    // Clear step documents cache when downloading
    cache.delete(`step_${stepId}_documents`);
    return makeAuthenticatedRequest(`/seller/step/${stepId}/download`, {
      method: 'POST',
    });
  },

  async submitQuestionnaire(questionnaire: any): Promise<{ message: string; document: any }> {
    // Clear questionnaire cache when submitting
    cache.delete('seller_questionnaire');
    cache.delete('seller_progress'); // Also clear progress since this affects step completion
    return makeAuthenticatedRequest('/seller/questionnaire/submit', {
      method: 'POST',
      body: JSON.stringify({ questionnaire }),
    });
  },

  async submitListingAgreement(data: any): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/seller/listing-agreement`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to submit listing agreement');
    }
  },

  async submitDueDiligence(data: any): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/seller/due-diligence`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to submit due diligence');
    }
  },

  async getListingBuyers(): Promise<any[]> {
    return makeAuthenticatedRequest('/seller/listing-buyers');
  },

  async getQuestionnaire(): Promise<{ questionnaire: any }> {
    return makeAuthenticatedRequest('/seller/questionnaire');
  },

  async saveQuestionnaire(questionnaire: any): Promise<{ message: string }> {
    // Clear questionnaire cache when saving
    cache.delete('seller_questionnaire');
    return makeAuthenticatedRequest('/seller/questionnaire/save', {
      method: 'POST',
      body: JSON.stringify({ questionnaire }),
    });
  },

  // Clear all cache (useful when logging out or major state changes)
  clearCache(): void {
    cache.clear();
  },

  // Clear specific cache entries
  clearCacheFor(keys: string[]): void {
    keys.forEach(key => cache.delete(key));
  }
}; 