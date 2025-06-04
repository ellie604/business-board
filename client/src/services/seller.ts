import axios from 'axios';

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

export interface Document {
  id: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const sellerService = {
  // Get dashboard statistics
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await axios.get('/api/seller/dashboard');
    return response.data.stats;
  },

  // Get all documents
  getDocuments: async (): Promise<Document[]> => {
    const response = await axios.get('/api/seller/documents');
    return response.data.documents;
  },

  // Upload a document
  uploadDocument: async (file: File, type: string): Promise<Document> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    const response = await axios.post('/api/seller/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.document;
  },

  // Submit listing agreement
  submitListingAgreement: async (data: any): Promise<void> => {
    await axios.post('/api/seller/listing-agreement', data);
  },

  // Submit questionnaire
  submitQuestionnaire: async (data: any): Promise<void> => {
    await axios.post('/api/seller/questionnaire', data);
  },

  // Submit purchase agreement
  submitPurchaseAgreement: async (data: any): Promise<void> => {
    await axios.post('/api/seller/purchase-agreement', data);
  },

  // Submit due diligence
  submitDueDiligence: async (data: any): Promise<void> => {
    await axios.post('/api/seller/due-diligence', data);
  },

  // Get pre-close checklist
  getPreCloseChecklist: async (): Promise<any> => {
    const response = await axios.get('/api/seller/pre-close-checklist');
    return response.data.checklist;
  },

  // Submit pre-close checklist
  submitPreCloseChecklist: async (data: any): Promise<void> => {
    await axios.post('/api/seller/pre-close-checklist', data);
  },

  // Get closing documents
  getClosingDocuments: async (): Promise<Document[]> => {
    const response = await axios.get('/api/seller/closing-documents');
    return response.data.documents;
  }
}; 