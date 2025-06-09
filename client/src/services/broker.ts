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

interface AgentStats {
  numberOfListings: number;
  numberUnderContract: number;
  closingsToDate: number;
}

class BrokerService {
  async getDashboardStats(): Promise<DashboardResponse> {
    try {
      console.log('Fetching dashboard stats...');
      const response = await fetch(`${API_BASE_URL}/broker/dashboard`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch dashboard stats' }));
        console.error('Dashboard stats error:', errorData);
        throw new Error(errorData.message || 'Failed to fetch dashboard stats');
      }

      const data = await response.json();
      console.log('Dashboard stats response:', data);
      return data;
    } catch (error) {
      console.error('Error in getDashboardStats:', error);
      throw error;
    }
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

  async getAgentStats(agentId: string): Promise<AgentStats> {
    const response = await fetch(`${API_BASE_URL}/broker/agent/${agentId}/stats`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch agent stats');
    }

    const data = await response.json();
    return data.stats;
  }

  async getAgentsWithStats() {
    const response = await fetch(`${API_BASE_URL}/broker/agents-with-stats`, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch agents with stats');
    }
    return response.json();
  }

  async deleteAgent(agentId: string) {
    const response = await fetch(`${API_BASE_URL}/broker/agent/${agentId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to delete agent');
    }
    return response.json();
  }
}

export const brokerService = new BrokerService();