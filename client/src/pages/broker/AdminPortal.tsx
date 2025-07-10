import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/admin';

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'BROKER' | 'AGENT' | 'SELLER' | 'BUYER';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  roleDistribution: Record<string, number>;
}

interface UserFormData {
  email: string;
  password: string;
  name: string;
  role: string;
}

export function AdminPortal() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    password: '',
    name: '',
    role: 'BUYER'
  });
  const [showPasswordColumn, setShowPasswordColumn] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [usersResponse, statsResponse] = await Promise.all([
        adminService.getAllUsers(),
        adminService.getUserStats()
      ]);
      
      setUsers(usersResponse.users);
      setStats(statsResponse.stats);
    } catch (error) {
      console.error('Failed to load admin data:', error);
      setError('Failed to load admin data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      setError(null);
      await adminService.createUser(formData);
      setShowCreateModal(false);
      setFormData({ email: '', password: '', name: '', role: 'BUYER' });
      loadData();
    } catch (error) {
      console.error('Failed to create user:', error);
      setError('Failed to create user. Please try again.');
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;
    
    try {
      setError(null);
      await adminService.updateUser(selectedUser.id, formData);
      setShowEditModal(false);
      setSelectedUser(null);
      setFormData({ email: '', password: '', name: '', role: 'BUYER' });
      loadData();
    } catch (error) {
      console.error('Failed to update user:', error);
      setError('Failed to update user. Please try again.');
    }
  };

  const handleArchiveUser = async (userId: string) => {
    try {
      setError(null);
      await adminService.archiveUser(userId);
      loadData();
    } catch (error) {
      console.error('Failed to archive user:', error);
      setError('Failed to archive user. Please try again.');
    }
  };

  const handleReactivateUser = async (userId: string) => {
    try {
      setError(null);
      await adminService.reactivateUser(userId);
      loadData();
    } catch (error) {
      console.error('Failed to reactivate user:', error);
      setError('Failed to reactivate user. Please try again.');
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      password: user.password,
      name: user.name,
      role: user.role
    });
    setShowEditModal(true);
  };

  const openCreateModal = () => {
    setFormData({ email: '', password: '', name: '', role: 'BUYER' });
    setShowCreateModal(true);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="space-y-4 lg:space-y-6 p-4 lg:p-0">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <h1 className="text-2xl lg:text-3xl font-bold">Admin Portal - User Management</h1>
        <button
          onClick={openCreateModal}
          className="w-full lg:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Create New User
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
            <h3 className="text-base lg:text-lg font-medium mb-2">Total Users</h3>
            <p className="text-2xl lg:text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
            <h3 className="text-base lg:text-lg font-medium mb-2">Active Users</h3>
            <p className="text-2xl lg:text-3xl font-bold text-green-600">{stats.activeUsers}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
            <h3 className="text-base lg:text-lg font-medium mb-2">Inactive Users</h3>
            <p className="text-2xl lg:text-3xl font-bold text-red-600">{stats.inactiveUsers}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
            <h3 className="text-base lg:text-lg font-medium mb-2">Role Distribution</h3>
            <div className="text-sm space-y-1">
              {Object.entries(stats.roleDistribution).map(([role, count]) => (
                <div key={role} className="flex justify-between">
                  <span>{role}:</span>
                  <span className="font-bold">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Password visibility toggle */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="showPassword"
          checked={showPasswordColumn}
          onChange={(e) => setShowPasswordColumn(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="showPassword" className="text-sm font-medium text-gray-700">
          Show Password Column
        </label>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              {showPasswordColumn && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Password
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className={!user.isActive ? 'bg-gray-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.name || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                {showPasswordColumn && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                      {user.password}
                    </code>
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === 'BROKER' ? 'bg-purple-100 text-purple-800' :
                    user.role === 'AGENT' ? 'bg-blue-100 text-blue-800' :
                    user.role === 'SELLER' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button
                    onClick={() => openEditModal(user)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                  {user.isActive ? (
                    <button
                      onClick={() => handleArchiveUser(user.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Archive
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReactivateUser(user.id)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Reactivate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {users.map((user) => (
          <div key={user.id} className={`bg-white rounded-lg shadow-md p-4 ${!user.isActive ? 'opacity-75' : ''}`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900">
                {user.name || 'N/A'}
              </h3>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Email:</span>
                <span className="text-gray-900 break-all">{user.email}</span>
              </div>
              
              {showPasswordColumn && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Password:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                    {user.password}
                  </code>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-500">Role:</span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  user.role === 'BROKER' ? 'bg-purple-100 text-purple-800' :
                  user.role === 'AGENT' ? 'bg-blue-100 text-blue-800' :
                  user.role === 'SELLER' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {user.role}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500">Created:</span>
                <span className="text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <button
                onClick={() => openEditModal(user)}
                className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
              >
                Edit
              </button>
              {user.isActive ? (
                <button
                  onClick={() => handleArchiveUser(user.id)}
                  className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                >
                  Archive
                </button>
              ) : (
                <button
                  onClick={() => handleReactivateUser(user.id)}
                  className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                >
                  Reactivate
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 p-4">
          <div className="relative top-4 lg:top-20 mx-auto border max-w-md w-full shadow-lg rounded-md bg-white">
            <div className="p-4 lg:p-5">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create New User</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="text"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="BUYER">Buyer</option>
                    <option value="SELLER">Seller</option>
                    <option value="AGENT">Agent</option>
                    <option value="BROKER">Broker</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:justify-end mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="w-full sm:w-auto bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateUser}
                  className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Create User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 p-4">
          <div className="relative top-4 lg:top-20 mx-auto border max-w-md w-full shadow-lg rounded-md bg-white">
            <div className="p-4 lg:p-5">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit User</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="text"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="BUYER">Buyer</option>
                    <option value="SELLER">Seller</option>
                    <option value="AGENT">Agent</option>
                    <option value="BROKER">Broker</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:justify-end mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="w-full sm:w-auto bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditUser}
                  className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Update User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPortal; 