import { API_BASE_URL } from '../config';

// 为 FileSystem API 添加类型定义
declare global {
  interface Window {
    RequestFileSystem?: (type: number, size: number, successCallback: () => void, errorCallback: () => void) => void;
    webkitRequestFileSystem?: (type: number, size: number, successCallback: () => void, errorCallback: () => void) => void;
    TEMPORARY?: number;
  }
}

interface LoginResponse {
  message: string;
  role: string;
  redirect: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    managing: any[];
  };
  token?: string;
}

// 添加重试机制
async function retryRequest<T>(
  requestFn: () => Promise<T>, 
  maxRetries: number = 3, 
  delay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error as Error;
      console.warn(`Request failed (attempt ${i + 1}/${maxRetries}):`, error);
      
      // 如果是最后一次尝试，直接抛出错误
      if (i === maxRetries - 1) {
        break;
      }
      
      // 等待后重试
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
  
  throw lastError!;
}

// 检测无痕模式的增强版本
function detectIncognitoMode(): boolean {
  try {
    // 方法1：检测localStorage写入权限
    const testKey = '__test_incognito__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    
    // 方法2：检测quota API
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then(estimate => {
        // 无痕模式通常有较小的存储配额
        if (estimate.quota && estimate.quota < 120000000) { // 小于120MB
          console.log('Potential incognito mode detected via storage quota');
        }
      });
    }
    
    // 方法3：检测requestFileSystem (Webkit)
    if (window.RequestFileSystem || window.webkitRequestFileSystem) {
      const requestFileSystem = window.RequestFileSystem || window.webkitRequestFileSystem;
      if (requestFileSystem) {
        requestFileSystem(
          window.TEMPORARY || 0,
          1,
          () => {}, // Success callback - 正常模式
          () => console.log('Potential incognito mode detected via FileSystem API') // Error callback - 可能是无痕模式
        );
      }
    }
    
    return false; // localStorage写入成功，可能不是无痕模式
  } catch (e) {
    console.log('Incognito mode detected via localStorage exception');
    return true; // localStorage访问失败，可能是无痕模式
  }
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    console.log('Attempting login with:', { email, API_BASE_URL });
    
    return retryRequest(async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ email, password }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
          console.error('Login failed:', errorData);
          throw new Error(errorData.message || 'Login failed');
        }

        const data = await response.json();
        console.log('Login response:', data);
        
        // 保存用户数据和认证信息
        if (data.user) {
          // 保存用户基本信息
          localStorage.setItem('user', JSON.stringify(data.user));
          console.log('User data saved to localStorage:', data.user);

          // 保存session token用于跨域认证
          if (data.sessionToken) {
            localStorage.setItem('session_token', data.sessionToken);
            console.log('Session token saved:', data.sessionToken);
          }

          // 如果有 token，保存它
          if (data.token) {
            localStorage.setItem('auth_token', data.token);
            console.log('Auth token saved');
          }
        }
        
        return data;
      } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
          throw new Error('Request timeout, please try again');
        }
        throw error;
      }
    }, 2, 1000);
  },

  // 重置密码
  resetPassword: async (email: string, newPassword: string): Promise<void> => {
    console.log('Attempting password reset for:', email);
    
    return retryRequest(async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      try {
        const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ email, newPassword }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Password reset failed' }));
          console.error('Password reset failed:', errorData);
          throw new Error(errorData.message || 'Password reset failed');
        }

        const data = await response.json();
        console.log('Password reset response:', data);
        
        return data;
      } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
          throw new Error('Request timeout, please try again');
        }
        throw error;
      }
    }, 2, 1000);
  },

  logout: async (): Promise<void> => {
    try {
      // 调用后端 logout 接口
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Logout request failed:', error);
      // 即使后端请求失败，我们仍然清理本地状态
    } finally {
      // 清理本地存储
      localStorage.removeItem('user');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_header');
      localStorage.removeItem('session_token');
      
      // 清理任何其他可能的认证相关数据
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('auth_') || key.includes('session'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      console.log('Local storage cleared');
    }
  },

  // 设置认证头
  setAuthHeader: (token: string) => {
    if (token) {
      localStorage.setItem('auth_header', `Bearer ${token}`);
    } else {
      localStorage.removeItem('auth_header');
    }
  },

  // 获取认证头
  getAuthHeader: (): string | null => {
    return localStorage.getItem('auth_header');
  },

  // 获取当前用户信息
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // 检查用户是否已登录
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('user');
  },

  // 检查并恢复会话
  checkSession: async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/check-session`, {
        credentials: 'include',
        headers: {
          'Authorization': localStorage.getItem('auth_header') || ''
        }
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return !!data.authenticated;
    } catch (error) {
      console.error('Session check failed:', error);
      return false;
    }
  },

  // 获取认证请求配置
  getAuthenticatedRequestConfig: () => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    const authHeader = localStorage.getItem('auth_header');
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    return {
      headers,
      credentials: 'include' as const
    };
  }
}; 