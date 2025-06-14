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

async function makeRequest<T>(
  url: string, 
  options: RequestInit = {},
  cacheKey?: string,
  cacheTTL: number = 30000
): Promise<T> {
  // Check cache first
  if (cacheKey) {
    const cached = cache.get<T>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  // Check for pending request
  const requestKey = `${url}_${JSON.stringify(options)}`;
  if (pendingRequests.has(requestKey)) {
    return pendingRequests.get(requestKey);
  }

  // Make new request
  const request = fetch(`${API_BASE_URL}${url}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  }).then(async (res) => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    
    // Cache successful responses
    if (cacheKey && res.ok) {
      cache.set(cacheKey, data, cacheTTL);
    }
    
    return data;
  }).finally(() => {
    // Clean up pending request
    pendingRequests.delete(requestKey);
  });

  pendingRequests.set(requestKey, request);
  return request;
}

export const sellerService = {
  async getDashboardStats() {
    const res = await fetch(`${API_BASE_URL}/seller/dashboard`, { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch dashboard stats');
    return res.json();
  },

  async getListings(): Promise<any[]> {
    return makeRequest<any[]>(
      '/seller/listings',
      {},
      'seller_listings',
      60000 // Cache for 1 minute since listings don't change often
    );
  },

  async getProgress(): Promise<{ progress: SellerProgress }> {
    return makeRequest<{ progress: SellerProgress }>(
      '/seller/progress',
      {},
      'seller_progress',
      10000 // Cache for 10 seconds since progress changes frequently
    );
  },

  async selectListing(listingId: string): Promise<{ message: string; listing: any; progress: any }> {
    // Clear both progress and listings cache when selecting
    cache.delete('seller_progress');
    cache.delete('current_listing');
    return makeRequest<{ message: string; listing: any; progress: any }>(
      '/seller/select-listing',
      {
        method: 'POST',
        body: JSON.stringify({ listingId }),
      }
    );
  },

  async getCurrentListing(): Promise<{ listing: any; needsSelection: boolean }> {
    return makeRequest<{ listing: any; needsSelection: boolean }>(
      '/seller/current-listing',
      {},
      'current_listing',
      30000 // Cache for 30 seconds
    );
  },

  async updateStep(stepId: number): Promise<{ message: string; progress: any }> {
    // Clear progress cache when updating
    cache.delete('seller_progress');
    return makeRequest<{ message: string; progress: any }>(
      '/seller/update-step',
      {
        method: 'POST',
        body: JSON.stringify({ stepId }),
      }
    );
  },

  async markStepCompleted(stepId: number): Promise<{ message: string; progress: any }> {
    // Clear progress cache when marking step as completed
    cache.delete('seller_progress');
    return makeRequest<{ message: string; progress: any }>(
      '/seller/mark-step-completed',
      {
        method: 'POST',
        body: JSON.stringify({ stepId }),
      }
    );
  },

  async markStepIncomplete(stepId: number): Promise<{ message: string; progress: any }> {
    // Clear progress cache when marking step as incomplete
    cache.delete('seller_progress');
    return makeRequest<{ message: string; progress: any }>(
      '/seller/mark-step-incomplete',
      {
        method: 'POST',
        body: JSON.stringify({ stepId }),
      }
    );
  },

  async getStepDocuments(stepId: number): Promise<{ documents: any[]; requirement: DocumentRequirement }> {
    return makeRequest<{ documents: any[]; requirement: DocumentRequirement }>(
      `/seller/step/${stepId}/documents`,
      {},
      `step_${stepId}_documents`,
      30000
    );
  },

  async uploadStepDocument(stepId: number, fileName: string, fileUrl: string, fileSize: number): Promise<{ document: any }> {
    // Clear step documents cache when uploading
    cache.delete(`step_${stepId}_documents`);
    return makeRequest<{ document: any }>(
      `/seller/step/${stepId}/upload`,
      {
        method: 'POST',
        body: JSON.stringify({ fileName, fileUrl, fileSize }),
      }
    );
  },

  async downloadStepDocument(stepId: number): Promise<{ document: any }> {
    // Clear step documents cache when downloading
    cache.delete(`step_${stepId}_documents`);
    return makeRequest<{ document: any }>(
      `/seller/step/${stepId}/download`,
      {
        method: 'POST',
      }
    );
  },

  async getDocuments(): Promise<DocumentsResponse> {
    const response = await fetch(`${API_BASE_URL}/seller/documents`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch documents');
    }

    return response.json();
  },

  async uploadDocument(file: File, type: string): Promise<Document> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await fetch(`${API_BASE_URL}/seller/documents/upload`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload document');
    }

    return response.json().then(data => data.document);
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

  async submitQuestionnaire(questionnaire: any): Promise<{ message: string; document: any }> {
    // Clear questionnaire cache when submitting
    cache.delete('seller_questionnaire');
    cache.delete('seller_progress'); // Also clear progress since this affects step completion
    return makeRequest<{ message: string; document: any }>(
      '/seller/questionnaire/submit',
      {
        method: 'POST',
        body: JSON.stringify({ questionnaire }),
      }
    );
  },

  async submitPurchaseAgreement(data: any): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/seller/purchase-agreement`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to submit purchase agreement');
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

  async getPreCloseChecklist(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/seller/pre-close-checklist`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to get pre-close checklist');
    }

    return response.json().then(data => data.checklist);
  },

  async submitPreCloseChecklist(data: any): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/seller/pre-close-checklist`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to submit pre-close checklist');
    }
  },

  async getClosingDocuments(): Promise<DocumentsResponse> {
    const response = await fetch(`${API_BASE_URL}/seller/closing-documents`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch closing documents');
    }

    return response.json();
  },

  async getListingBuyers(): Promise<any[]> {
    return makeRequest<any[]>(
      '/seller/listing-buyers',
      {},
      'listing_buyers',
      60000 // Cache for 1 minute
    );
  },

  async getQuestionnaire(): Promise<{ questionnaire: any }> {
    return makeRequest<{ questionnaire: any }>(
      '/seller/questionnaire',
      {},
      'seller_questionnaire',
      300000 // Cache for 5 minutes since questionnaire doesn't change often
    );
  },

  async saveQuestionnaire(questionnaire: any): Promise<{ message: string }> {
    // Clear questionnaire cache when saving
    cache.delete('seller_questionnaire');
    return makeRequest<{ message: string }>(
      '/seller/questionnaire/save',
      {
        method: 'POST',
        body: JSON.stringify({ questionnaire }),
      }
    );
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