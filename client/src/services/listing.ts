import { API_BASE_URL } from '../config';
import { makeAuthenticatedRequest, apiGet, apiPost, apiPut, apiDelete } from '../utils/apiHelper';

export const listingService = {
  async getListings() {
    const res = await apiGet('/broker/listings');
    return res;
  },
  async addListing(data) {
    const res = await apiPost('/broker/listings', data);
    return res;
  },
  async updateListing(id, data) {
    const res = await apiPut(`/broker/listings/${id}`, data);
    return res;
  },
  async archiveListing(id) {
    const res = await makeAuthenticatedRequest(`${API_BASE_URL}/broker/listings/${id}/archive`, {
      method: 'PATCH'
    });
    return res.json();
  },
  async reactivateListing(id) {
    const res = await makeAuthenticatedRequest(`${API_BASE_URL}/broker/listings/${id}/reactivate`, {
      method: 'PATCH'
    });
    return res.json();
  },
  async deleteListing(id) {
    const res = await apiDelete(`/broker/listings/${id}`);
    return res;
  }
};

export const userService = {
  async getSellers() {
    try {
      const res = await apiGet('/users/by-role?role=SELLER');
      return res;
    } catch (error) {
      console.error('Error fetching sellers:', error);
      throw error;
    }
  },
  async getBuyers() {
    try {
      const res = await apiGet('/users/by-role?role=BUYER');
      return res;
    } catch (error) {
      console.error('Error fetching buyers:', error);
      throw error;
    }
  },
  async getAgents() {
    try {
      const res = await apiGet('/users/by-role?role=AGENT');
      return res;
    } catch (error) {
      console.error('Error fetching agents:', error);
      throw error;
    }
  },
  async archiveSeller(id) {
    const res = await makeAuthenticatedRequest(`${API_BASE_URL}/broker/sellers/${id}/archive`, {
      method: 'PATCH'
    });
    return res.json();
  },
  async reactivateSeller(id) {
    const res = await makeAuthenticatedRequest(`${API_BASE_URL}/broker/sellers/${id}/reactivate`, {
      method: 'PATCH'
    });
    return res.json();
  },
  async archiveBuyer(id) {
    const res = await makeAuthenticatedRequest(`${API_BASE_URL}/broker/buyers/${id}/archive`, {
      method: 'PATCH'
    });
    return res.json();
  },
  async reactivateBuyer(id) {
    const res = await makeAuthenticatedRequest(`${API_BASE_URL}/broker/buyers/${id}/reactivate`, {
      method: 'PATCH'
    });
    return res.json();
  }
}; 