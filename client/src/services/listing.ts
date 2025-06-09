import { API_BASE_URL } from '../config';

export const listingService = {
  async getListings() {
    const res = await fetch(`${API_BASE_URL}/broker/listings`, { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch listings');
    return res.json();
  },
  async addListing(data) {
    const res = await fetch(`${API_BASE_URL}/broker/listings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to add listing');
    return res.json();
  },
  async updateListing(id, data) {
    const res = await fetch(`${API_BASE_URL}/broker/listings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update listing');
    return res.json();
  },
  async deleteListing(id) {
    const res = await fetch(`${API_BASE_URL}/broker/listings/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to delete listing');
    return res.json();
  }
};

export const userService = {
  async getSellers() {
    try {
      const res = await fetch(`${API_BASE_URL}/users/by-role?role=SELLER`, { 
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to fetch sellers');
      }
      return res.json();
    } catch (error) {
      console.error('Error fetching sellers:', error);
      throw error;
    }
  },
  async getBuyers() {
    try {
      const res = await fetch(`${API_BASE_URL}/users/by-role?role=BUYER`, { 
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to fetch buyers');
      }
      return res.json();
    } catch (error) {
      console.error('Error fetching buyers:', error);
      throw error;
    }
  },
  async getAgents() {
    try {
      const res = await fetch(`${API_BASE_URL}/users/by-role?role=AGENT`, { 
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to fetch agents');
      }
      return res.json();
    } catch (error) {
      console.error('Error fetching agents:', error);
      throw error;
    }
  }
}; 