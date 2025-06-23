import { API_BASE_URL } from '../config';
import { authService } from './auth';

export interface DashboardStats {
  totalAssignedListings: number;
  totalAssignedSellers: number;
  totalAssignedBuyers: number;
  activeDeals: number;
  completedDeals: number;
}

export const agentService = {
  getDashboardStats: async () => {
    const requestConfig = authService.getAuthenticatedRequestConfig();
    const res = await fetch(`${API_BASE_URL}/agent/dashboard`, requestConfig);
    
    if (!res.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }
    
    return res.json();
  },

  getListings: async () => {
    const requestConfig = authService.getAuthenticatedRequestConfig();
    const res = await fetch(`${API_BASE_URL}/agent/listings`, requestConfig);
    
    if (!res.ok) {
      throw new Error('Failed to fetch listings');
    }
    
    return res.json();
  },

  getSellers: async () => {
    const requestConfig = authService.getAuthenticatedRequestConfig();
    const res = await fetch(`${API_BASE_URL}/agent/sellers`, requestConfig);
    
    if (!res.ok) {
      throw new Error('Failed to fetch sellers');
    }
    
    return res.json();
  },

  getBuyers: async () => {
    const requestConfig = authService.getAuthenticatedRequestConfig();
    const res = await fetch(`${API_BASE_URL}/agent/buyers`, requestConfig);
    
    if (!res.ok) {
      throw new Error('Failed to fetch buyers');
    }
    
    return res.json();
  }
}; 