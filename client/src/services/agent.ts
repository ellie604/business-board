import { API_BASE_URL } from '../config';

export interface DashboardStats {
  totalAssignedListings: number;
  totalAssignedSellers: number;
  totalAssignedBuyers: number;
  activeDeals: number;
  completedDeals: number;
}

export const agentService = {
  async getDashboardStats() {
    const res = await fetch(`${API_BASE_URL}/agent/dashboard`, { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch dashboard stats');
    return res.json();
  },

  async getListings() {
    const res = await fetch(`${API_BASE_URL}/agent/listings`, { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch listings');
    return res.json();
  },

  async getSellers() {
    const res = await fetch(`${API_BASE_URL}/agent/sellers`, { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch sellers');
    return res.json();
  },

  async getBuyers() {
    const res = await fetch(`${API_BASE_URL}/agent/buyers`, { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch buyers');
    return res.json();
  }
}; 