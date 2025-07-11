import { API_BASE_URL } from '../config';

// 通用的认证请求函数
export const makeAuthenticatedRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  // 获取用户信息
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  
  // 获取session token用于跨域认证
  const sessionToken = localStorage.getItem('session_token');
  
  // 检测无痕模式
  const isIncognito = (() => {
    try {
      // 检测私有模式的多种方法
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

  // 如果是FormData，移除Content-Type让浏览器自动设置
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  // 添加浏览器模式标识
  if (isIncognito) {
    headers['X-Browser-Mode'] = 'incognito';
  }

  // 优先使用session token，然后是用户ID
  if (sessionToken) {
    headers['X-Session-Token'] = sessionToken;
  } else if (user?.id) {
    headers['X-Session-Token'] = user.id;
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include' // 仍然发送 cookies，作为备用
  };

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  console.log('Making authenticated request:', {
    url,
    method: options.method || 'GET',
    isIncognito,
    hasUser: !!user,
    hasSessionToken: !!sessionToken,
    headers: Object.keys(headers)
  });

  try {
    const response = await fetch(url, config);
    
    // 如果是认证错误，尝试清理本地状态并重定向到登录
    if (response.status === 401) {
      console.warn('Authentication failed, clearing local storage');
      localStorage.removeItem('user');
      localStorage.removeItem('session_token');
      localStorage.removeItem('auth_token');
      
      // 如果不在登录页面，重定向
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      
      throw new Error('Authentication required');
    }
    
    return response;
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
};

// 便捷的JSON请求函数
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const response = await makeAuthenticatedRequest(endpoint, options);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`API request failed:`, response.status, errorText);
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

// 便捷的GET请求
export const apiGet = (endpoint: string) => apiRequest(endpoint);

// 便捷的POST请求
export const apiPost = (endpoint: string, data?: any) => 
  apiRequest(endpoint, {
    method: 'POST',
    body: data instanceof FormData ? data : JSON.stringify(data)
  });

// 便捷的PUT请求
export const apiPut = (endpoint: string, data?: any) => 
  apiRequest(endpoint, {
    method: 'PUT',
    body: data instanceof FormData ? data : JSON.stringify(data)
  });

// 便捷的DELETE请求
export const apiDelete = (endpoint: string) => 
  apiRequest(endpoint, { method: 'DELETE' }); 