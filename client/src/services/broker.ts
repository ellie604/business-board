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