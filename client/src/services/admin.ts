import { API_BASE_URL } from '../config';
import { makeAuthenticatedRequest } from '../utils/apiHelper';

interface UserFormData {
  email: string;
  password: string;
  name: string;
  role: string;
}

interface UpdateUserData {
  email?: string;
  password?: string;
  name?: string;
  role?: string;
  isActive?: boolean;
}

class AdminService {
  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const response = await makeAuthenticatedRequest(endpoint, options);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.message || 'Request failed');
    }
    
    return await response.json();
  }

  // 获取所有用户
  async getAllUsers() {
    return await this.request('/admin/users');
  }

  // 获取用户统计信息
  async getUserStats() {
    return await this.request('/admin/stats');
  }

  // 创建新用户
  async createUser(userData: UserFormData) {
    return await this.request('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // 更新用户信息
  async updateUser(userId: string, userData: UpdateUserData) {
    return await this.request(`/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // 归档用户
  async archiveUser(userId: string) {
    return await this.request(`/admin/users/${userId}/archive`, {
      method: 'PATCH',
    });
  }

  // 重新激活用户
  async reactivateUser(userId: string) {
    return await this.request(`/admin/users/${userId}/reactivate`, {
      method: 'PATCH',
    });
  }
}

export const adminService = new AdminService(); 