import { API_BASE_URL } from '../config';
import { authService } from './auth';

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

export const buyerService = {
  getDashboardStats: () => makeAuthenticatedRequest('/buyer/dashboard'),
  
  getDocuments: () => makeAuthenticatedRequest('/buyer/documents'),
  
  uploadDocument: (formData: FormData) => makeAuthenticatedRequest('/buyer/documents/upload', {
    method: 'POST',
    body: formData,
    headers: {
      // 不设置 Content-Type，让浏览器自动设置
    }
  }),
  
  emailAgent: (data: any) => makeAuthenticatedRequest('/buyer/email-agent', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  getNDA: () => makeAuthenticatedRequest('/buyer/nda'),
  
  getFinancialStatement: () => makeAuthenticatedRequest('/buyer/financial-statement'),
  
  getCbrCim: () => makeAuthenticatedRequest('/buyer/cbr-cim'),
  
  getPurchaseContract: () => makeAuthenticatedRequest('/buyer/purchase-contract'),
  
  getDueDiligence: () => makeAuthenticatedRequest('/buyer/due-diligence'),
  
  getPreCloseChecklist: () => makeAuthenticatedRequest('/buyer/pre-close-checklist'),
  
  updatePreCloseChecklist: (data: any) => makeAuthenticatedRequest('/buyer/pre-close-checklist', {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  
  getClosingDocuments: () => makeAuthenticatedRequest('/buyer/closing-documents'),
  
  getProgress: () => makeAuthenticatedRequest('/buyer/progress'),
  
  updateStep: (step: number, completed: boolean) => makeAuthenticatedRequest('/buyer/update-step', {
    method: 'PUT',
    body: JSON.stringify({ step, completed })
  }),
  
  selectListing: (listingId: string) => makeAuthenticatedRequest('/buyer/select-listing', {
    method: 'POST',
    body: JSON.stringify({ listingId })
  }),
  
  getCurrentListing: () => makeAuthenticatedRequest('/buyer/current-listing'),
  
  getListings: () => makeAuthenticatedRequest('/buyer/listings'),

  // 新增的方法
  downloadDocument: (documentId: string) => makeAuthenticatedRequest(`/buyer/download-document/${documentId}`),
  
  requestDueDiligence: (listingId: string, documentTypes: string[]) => makeAuthenticatedRequest(`/buyer/listings/${listingId}/due-diligence/request`, {
    method: 'POST',
    body: JSON.stringify({ documentTypes })
  }),
  
  downloadDueDiligenceDocument: (listingId: string, documentId: string) => makeAuthenticatedRequest(`/buyer/listings/${listingId}/due-diligence/download/${documentId}`),
  
  getAgentDocuments: (listingId: string) => makeAuthenticatedRequest(`/buyer/listings/${listingId}/agent-documents`),
  
  downloadAgentDocument: (documentId: string) => makeAuthenticatedRequest(`/buyer/download-agent-document/${documentId}`)
}; 