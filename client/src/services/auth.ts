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

// 检测是否是无痕模式
const isIncognitoMode = async (): Promise<boolean> => {
  try {
    const fs = window.RequestFileSystem || window.webkitRequestFileSystem;
    const tempStorage = window.TEMPORARY || 0;
    
    return new Promise(resolve => {
      if (!fs || typeof tempStorage !== 'number') {
        resolve(false);
        return;
      }
      fs(tempStorage, 100, 
        () => resolve(false), 
        () => resolve(true)
      );
    });
  } catch (e) {
    return false;
  }
};

// 重试函数
const retryRequest = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 2,
  delay: number = 1000
): Promise<T> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      console.log(`Request failed, retrying in ${delay}ms... (${i + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 1.2;
    }
  }
  throw new Error('Max retries exceeded');
};

// 创建一个通用的请求拦截器
const createAuthenticatedRequest = () => {
  const authHeader = authService.getAuthHeader();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  
  if (authHeader) {
    headers['Authorization'] = authHeader;
  }
  
  return {
    headers,
    credentials: 'include' as const
  };
};

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
          throw new Error('请求超时，请重试');
        }
        throw error;
      }
    }, 2, 1000);
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