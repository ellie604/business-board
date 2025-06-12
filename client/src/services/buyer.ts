import { API_BASE_URL } from '../config';

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

class BuyerService {
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await fetch(`${API_BASE_URL}/buyer/dashboard`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }

    const data = await response.json();
    return data.stats;
  }

  async getDocuments(): Promise<Document[]> {
    const response = await fetch(`${API_BASE_URL}/buyer/documents`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch documents');
    }

    const data = await response.json();
    return data.documents;
  }

  async uploadDocument(file: File, type: string): Promise<Document> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await fetch(`${API_BASE_URL}/buyer/documents/upload`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload document');
    }

    const data = await response.json();
    return data.document;
  }

  async contactAgent(message: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/buyer/email-agent`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error('Failed to contact agent');
    }
  }

  async submitNDA(data: any): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/buyer/nda`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to submit NDA');
    }
  }

  async submitFinancialStatement(data: any): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/buyer/financial-statement`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to submit financial statement');
    }
  }

  async downloadCBRCIM(): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/buyer/cbr-cim`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to download CBR/CIM');
    }

    return response.blob();
  }

  async submitPurchaseContract(data: any): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/buyer/purchase-contract`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to submit purchase contract');
    }
  }

  async submitDueDiligence(data: any): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/buyer/due-diligence`, {
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
    const response = await fetch(`${API_BASE_URL}/buyer/pre-close-checklist`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to get pre-close checklist');
    }

    const data = await response.json();
    return data.checklist;
  }

  async submitPreCloseChecklist(data: any): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/buyer/pre-close-checklist`, {
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

  async getClosingDocuments(): Promise<Document[]> {
    const response = await fetch(`${API_BASE_URL}/buyer/closing-documents`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch closing documents');
    }

    const data = await response.json();
    return data.documents;
  }

  // Get buyer progress
  async getProgress(): Promise<BuyerProgressResponse> {
    const response = await fetch(`${API_BASE_URL}/buyer/progress`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  // Update step progress
  async updateStep(stepId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/buyer/update-step`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stepId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  // Select a listing
  async selectListing(listingId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/buyer/select-listing`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ listingId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  // Get buyer's current listing
  async getCurrentListing(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/buyer/current-listing`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  // Get buyer's listings
  async getListings(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/buyer/listings`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }
}

export const buyerService = new BuyerService(); 