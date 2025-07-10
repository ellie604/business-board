import { API_BASE_URL } from '../config';

export interface UserFormData {
  name: string;
  email: string;
  role: 'BUYER' | 'SELLER' | 'AGENT' | 'BROKER';
  managerId?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: 'BUYER' | 'SELLER' | 'AGENT' | 'BROKER';
  managerId?: string;
}

// 统一的认证请求函数 - 与broker service保持一致
const makeAuthenticatedRequest = async (
  url: string, 
  options: RequestInit = {}
): Promise<Response> => {
  // 获取用户信息
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  
  // 检测无痕模式
  const isIncognito = (() => {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return false;
    } catch {
      return true;
    }
  })();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>
  };

  // 添加浏览器模式标识
  if (isIncognito) {
    headers['X-Browser-Mode'] = 'incognito';
  }

  // 添加用户会话令牌（如果有）- 关键的双重认证机制
  if (user?.id) {
    headers['X-Session-Token'] = user.id;
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include' // 确保发送 cookies
  };

  try {
    const response = await fetch(url, config);
    
    // 如果是认证错误，清理本地状态
    if (response.status === 401) {
      console.warn('Authentication failed, clearing local storage');
      localStorage.removeItem('user');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_header');
      throw new Error('Authentication required');
    }
    
    return response;
  } catch (error) {
    console.error('Admin request failed:', error);
    throw error;
  }
};

class AdminService {
  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await makeAuthenticatedRequest(url, options);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
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