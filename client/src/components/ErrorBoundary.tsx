import React from 'react';

interface AuthErrorHandlerProps {
  children: React.ReactNode;
}

export const AuthErrorHandler: React.FC<AuthErrorHandlerProps> = ({ children }) => {
  React.useEffect(() => {
    // 监听全局的401错误
    const handleUnauthorized = () => {
      console.log('🔒 Authentication session expired. Clearing local storage and redirecting to login...');
      
      // 清除所有认证相关的本地存储
      localStorage.removeItem('user');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_header');
      
      // 显示提示
      alert('Your session has expired. Please log in again.');
      
      // 重新加载页面到登录界面
      window.location.href = '/login';
    };

    // 拦截fetch请求的401响应
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      
      if (response.status === 401) {
        console.warn('🚨 401 Unauthorized detected in fetch request');
        setTimeout(handleUnauthorized, 100); // 稍微延迟以避免多次触发
      }
      
      return response;
    };

    return () => {
      // 恢复原始的fetch
      window.fetch = originalFetch;
    };
  }, []);

  return <>{children}</>;
}; 