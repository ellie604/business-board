import axios from 'axios';

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

export const buyerService = {
  // Get dashboard statistics
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await axios.get('/api/buyer/dashboard');
    return response.data.stats;
  },

  // Get all documents
  getDocuments: async (): Promise<Document[]> => {
    const response = await axios.get('/api/buyer/documents');
    return response.data.documents;
  },

  // Upload a document
  uploadDocument: async (file: File, type: string): Promise<Document> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    const response = await axios.post('/api/buyer/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.document;
  },

  // Submit email to agent
  contactAgent: async (message: string): Promise<void> => {
    await axios.post('/api/buyer/email-agent', { message });
  },

  // Submit NDA
  submitNDA: async (data: any): Promise<void> => {
    await axios.post('/api/buyer/nda', data);
  },

  // Submit financial statement
  submitFinancialStatement: async (data: any): Promise<void> => {
    await axios.post('/api/buyer/financial-statement', data);
  },

  // Download CBR/CIM
  downloadCBRCIM: async (): Promise<Blob> => {
    const response = await axios.get('/api/buyer/cbr-cim', {
      responseType: 'blob'
    });
    return response.data;
  },

  // Submit purchase contract
  submitPurchaseContract: async (data: any): Promise<void> => {
    await axios.post('/api/buyer/purchase-contract', data);
  },

  // Submit due diligence
  submitDueDiligence: async (data: any): Promise<void> => {
    await axios.post('/api/buyer/due-diligence', data);
  },

  // Get pre-close checklist
  getPreCloseChecklist: async (): Promise<any> => {
    const response = await axios.get('/api/buyer/pre-close-checklist');
    return response.data.checklist;
  },

  // Submit pre-close checklist
  submitPreCloseChecklist: async (data: any): Promise<void> => {
    await axios.post('/api/buyer/pre-close-checklist', data);
  },

  // Get closing documents
  getClosingDocuments: async (): Promise<Document[]> => {
    const response = await axios.get('/api/buyer/closing-documents');
    return response.data.documents;
  }
}; 