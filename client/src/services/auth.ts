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
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return response.json();
  },
}; 