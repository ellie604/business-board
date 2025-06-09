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

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    console.log('Attempting login with:', { email, API_BASE_URL });
    
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
      console.error('Login failed:', errorData);
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    console.log('Login response:', data);
    return data;
  },
}; 