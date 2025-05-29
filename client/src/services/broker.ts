// client/src/services/broker.ts
import { API_BASE_URL } from '../config';

interface DashboardStats {
  totalActiveListings: number;
  totalUnderContract: number;
  newListingsThisMonth: number;
  totalNDA: number;
  totalClosedDeals: number;
}

interface Agent {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface DashboardResponse {
  stats: DashboardStats;
  message: string;
}

interface AgentsResponse {
  agents: Agent[];
  message: string;
}

class BrokerService {
  async getDashboardStats(): Promise<DashboardResponse> {
    const response = await fetch(`${API_BASE_URL}/broker/dashboard`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }

    return response.json();
  }

  async getAgents(): Promise<AgentsResponse> {
    const response = await fetch(`${API_BASE_URL}/broker/agents`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch agents');
    }

    return response.json();
  }
}

export const brokerService = new BrokerService();