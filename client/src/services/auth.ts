import { API_BASE_URL } from '../config';

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
}

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

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    console.log('Attempting login with:', { email, API_BASE_URL });
    
    return retryRequest(async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超时

      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
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
}; 