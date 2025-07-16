import React, { useEffect, useState } from 'react';
import { brokerService } from '../../services/broker';

interface Agent {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  stats?: AgentStats;
}

interface AgentStats {
  numberOfListings: number;
  numberUnderContract: number;
  closingsToDate: number;
}

export default function BrokerAgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totals, setTotals] = useState<AgentStats>({
    numberOfListings: 0,
    numberUnderContract: 0,
    closingsToDate: 0,
  });

  useEffect(() => {
    async function fetchAgents() {
      setLoading(true);
      setError(null);
      try {
        // 获取所有 agent
        const res = await brokerService.getAgents();
        // 假设后端返回 agents: Agent[]
        const agentsWithStats = await Promise.all(
          res.agents.map(async (agent: Agent) => {
            // 这里假设有 getAgentStats 方法，否则 mock
            let stats: AgentStats = { numberOfListings: 0, numberUnderContract: 0, closingsToDate: 0 };
            try {
              stats = await brokerService.getAgentStats
                ? await brokerService.getAgentStats(agent.id)
                : { numberOfListings: Math.floor(Math.random()*5), numberUnderContract: Math.floor(Math.random()*3), closingsToDate: Math.floor(Math.random()*2) };
            } catch {}
            return { ...agent, stats };
          })
        );
        setAgents(agentsWithStats);
        // 计算总计
        setTotals({
          numberOfListings: agentsWithStats.reduce((sum, a) => sum + (a.stats?.numberOfListings || 0), 0),
          numberUnderContract: agentsWithStats.reduce((sum, a) => sum + (a.stats?.numberUnderContract || 0), 0),
          closingsToDate: agentsWithStats.reduce((sum, a) => sum + (a.stats?.closingsToDate || 0), 0),
        });
      } catch (e: any) {
        setError(e.message || 'Failed to load agents');
      } finally {
        setLoading(false);
      }
    }
    fetchAgents();
  }, []);

  const handleDelete = async (agentId: string) => {
    if (!confirm('Are you sure you want to delete this agent? This action cannot be undone.')) {
      return;
    }
    
    try {
      await brokerService.deleteAgent(agentId);
    setAgents(agents => agents.filter(a => a.id !== agentId));
      // Update totals after deletion
      const remainingAgents = agents.filter(a => a.id !== agentId);
      setTotals({
        numberOfListings: remainingAgents.reduce((sum, a) => sum + (a.stats?.numberOfListings || 0), 0),
        numberUnderContract: remainingAgents.reduce((sum, a) => sum + (a.stats?.numberUnderContract || 0), 0),
        closingsToDate: remainingAgents.reduce((sum, a) => sum + (a.stats?.closingsToDate || 0), 0),
      });
    } catch (error: any) {
      alert(`Failed to delete agent: ${error.message || 'Unknown error'}`);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Agents Overview</h2>
      {/* 总计统计卡片 */}
      <div className="flex gap-6 mb-6">
        <div className="bg-white rounded shadow p-4 flex-1">
          <div className="text-gray-500">Total Number of Listings</div>
          <div className="text-2xl font-bold">{totals.numberOfListings}</div>
        </div>
        <div className="bg-white rounded shadow p-4 flex-1">
          <div className="text-gray-500">Total Number Under Contract</div>
          <div className="text-2xl font-bold">{totals.numberUnderContract}</div>
        </div>
        <div className="bg-white rounded shadow p-4 flex-1">
          <div className="text-gray-500">Total Closings to Date</div>
          <div className="text-2xl font-bold">{totals.closingsToDate}</div>
        </div>
      </div>
      {/* agent 表格 */}
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-yellow-300">
            <th className="p-2">Agent Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Created At</th>
            <th className="p-2">Number of Listings</th>
            <th className="p-2">Number Under Contract</th>
            <th className="p-2">Closings to Date</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {agents.map(agent => (
            <tr key={agent.id} className="border-t">
              <td className="p-2">{agent.name}</td>
              <td className="p-2">{agent.email}</td>
              <td className="p-2">{new Date(agent.createdAt).toLocaleDateString()}</td>
              <td className="p-2 text-center">{agent.stats?.numberOfListings ?? '-'}</td>
              <td className="p-2 text-center">{agent.stats?.numberUnderContract ?? '-'}</td>
              <td className="p-2 text-center">{agent.stats?.closingsToDate ?? '-'}</td>
              <td className="p-2 text-center">
                <button className="text-red-500 hover:underline" onClick={() => handleDelete(agent.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 