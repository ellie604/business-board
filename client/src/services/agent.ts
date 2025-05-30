import { API_BASE_URL } from '../config';

interface DashboardStats {
  totalActiveListings: number;
  totalUnderContract: number;
  newListingsThisMonth: number;
  totalNDA: number;
  totalClosedDeals: number;
}

interface DashboardResponse {
  stats: DashboardStats;
  message: string;
}

class AgentService {
  async getDashboardStats(): Promise<DashboardResponse> {
    const response = await fetch(`${API_BASE_URL}/agent/dashboard`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }

    return response.json();
  }

  async getListings() {
    const response = await fetch(`${API_BASE_URL}/agent/listings`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch listings');
    }

    return response.json();
  }

  async getClients() {
    const response = await fetch(`${API_BASE_URL}/agent/clients`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch clients');
    }

    return response.json();
  }
}

export const agentService = new AgentService(); 