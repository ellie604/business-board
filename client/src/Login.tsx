import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 根据环境获取后端 URL
  const getBackendUrl = () => {
    const env = import.meta.env.MODE;
    switch(env) {
      case 'production':
        return 'https://business-board.vercel.app/api';
      case 'preview':
        // 从当前域名构建后端 URL
        const domain = window.location.hostname;
        if (domain.includes('-xinyis-projects-6c0795d6.vercel.app')) {
          return `https://${domain}/api`;
        }
        return 'http://localhost:3000/api';
      default:
        return 'http://localhost:3000/api';
    }
  };

  const BACKEND_URL = getBackendUrl();
  console.log("Environment:", import.meta.env.MODE);
  console.log("Backend URL:", BACKEND_URL);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    console.log('Attempting login with email:', email);

    try {
      const res = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify({ email, password }),
      });

      console.log('Response status:', res.status);
      const data = await res.json();
      console.log('Full login response:', data);

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const role = (data.role || '').toUpperCase();
      console.log('Processing role:', role);

      // 使用更严格的角色匹配
      switch(role) {
        case 'BROKER':
          console.log('Navigating to broker dashboard');
          navigate('/broker');
          break;
        case 'AGENT':
          console.log('Navigating to agent dashboard');
          navigate('/agent');
          break;
        case 'SELLER':
          console.log('Navigating to seller dashboard');
          navigate('/seller');
          break;
        case 'BUYER':
          console.log('Navigating to buyer dashboard');
          navigate('/buyer');
          break;
        default:
          console.error('Invalid role received:', role);
          setError(`Invalid user role: ${role}`);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
