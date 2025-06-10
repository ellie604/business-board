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

export const sellerService = {
  async getDashboardStats() {
    const res = await fetch(`${API_BASE_URL}/seller/dashboard`, { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch dashboard stats');
    return res.json();
  },

  async getListings() {
    const res = await fetch(`${API_BASE_URL}/seller/listings`, { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch listings');
    return res.json();
  },

  async getProgress() {
    const res = await fetch(`${API_BASE_URL}/seller/progress`, { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch progress');
    return res.json();
  },

  async selectListing(listingId: string) {
    const res = await fetch(`${API_BASE_URL}/seller/select-listing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ listingId })
    });
    if (!res.ok) throw new Error('Failed to select listing');
    return res.json();
  },

  async updateStep(stepId: number) {
    const res = await fetch(`${API_BASE_URL}/seller/update-step`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ stepId })
    });
    if (!res.ok) throw new Error('Failed to update step');
    return res.json();
  },

  // 获取特定步骤的文档
  async getStepDocuments(stepId: number): Promise<StepDocumentsResponse> {
    const res = await fetch(`${API_BASE_URL}/seller/step/${stepId}/documents`, { 
      credentials: 'include' 
    });
    if (!res.ok) throw new Error('Failed to fetch step documents');
    return res.json();
  },

  // 为特定步骤上传文档
  async uploadStepDocument(stepId: number, fileName: string, fileUrl: string, fileSize: number): Promise<{ document: StepDocument }> {
    const res = await fetch(`${API_BASE_URL}/seller/step/${stepId}/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ fileName, fileUrl, fileSize })
    });
    if (!res.ok) throw new Error('Failed to upload step document');
    return res.json();
  },

  // 记录特定步骤的文档下载
  async recordStepDownload(stepId: number): Promise<{ document: StepDocument }> {
    const res = await fetch(`${API_BASE_URL}/seller/step/${stepId}/download`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to record download');
    return res.json();
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

  async submitQuestionnaire(data: any): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/seller/questionnaire`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to submit questionnaire');
    }
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
  }
}; 