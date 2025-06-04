// import axios from 'axios';
import { API_BASE_URL } from '../config';

export interface DashboardStats {
  emailAgent: 'completed' | 'pending';
  listingAgreement: 'completed' | 'pending';
  questionnaire: 'completed' | 'pending';
  uploadedDocs: 'completed' | 'pending';
  purchaseAgreement: 'completed' | 'pending';
  dueDiligence: 'completed' | 'pending';
  preCloseChecklist: 'completed' | 'pending';
  closingDocs: 'completed' | 'pending';
  afterSale: 'completed' | 'pending';
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

class SellerService {
  async getDashboardStats(): Promise<DashboardResponse> {
    const response = await fetch(`${API_BASE_URL}/seller/dashboard`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }

    return response.json();
  }

  async getDocuments(): Promise<DocumentsResponse> {
    const response = await fetch(`${API_BASE_URL}/seller/documents`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch documents');
    }

    return response.json();
  }

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
  }

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
  }

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
  }

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
  }

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
  }

  async getPreCloseChecklist(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/seller/pre-close-checklist`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to get pre-close checklist');
    }

    return response.json().then(data => data.checklist);
  }

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
  }

  async getClosingDocuments(): Promise<DocumentsResponse> {
    const response = await fetch(`${API_BASE_URL}/seller/closing-documents`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch closing documents');
    }

    return response.json();
  }
}

export const sellerService = new SellerService(); 