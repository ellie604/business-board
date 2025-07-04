import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from './services/auth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    console.log('Attempting login with email:', email);

    try {
      const data = await authService.login(email, password);
      console.log('Full login response:', data);

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
    } finally {
      setIsLoading(false);
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
          id="email"
          name="email"
          placeholder="Email"
          className="w-full p-2 border mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />

        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 border mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />

        <button
          type="submit"
          className={`w-full p-2 rounded text-white ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
