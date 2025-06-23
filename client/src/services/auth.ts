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
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      console.log(`Request failed, retrying in ${delay}ms... (${i + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 1.5; // 指数退避
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
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超时

      try {
        // 检查是否在无痕模式
        const isIncognito = await isIncognitoMode();
        console.log('Browser mode:', isIncognito ? 'Incognito' : 'Normal');

        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Browser-Mode': isIncognito ? 'incognito' : 'normal'
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

          // 如果在无痕模式下，保存额外的认证信息
          if (isIncognito && data.token) {
            sessionStorage.setItem('auth_token', data.token);
            console.log('Auth token saved for incognito mode');
          }

          // 设置认证头
          if (data.token) {
            this.setAuthHeader(data.token);
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
    }, 3, 2000); // 最多重试3次，从2秒开始的延迟
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
      const requestOptions = createAuthenticatedRequest();
      const response = await fetch(`${API_BASE_URL}/auth/check-session`, {
        ...requestOptions
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
  getAuthenticatedRequestConfig: () => createAuthenticatedRequest()
}; 