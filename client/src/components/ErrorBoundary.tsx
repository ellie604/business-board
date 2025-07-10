import React from 'react';

interface AuthErrorHandlerProps {
  children: React.ReactNode;
}

export const AuthErrorHandler: React.FC<AuthErrorHandlerProps> = ({ children }) => {
  const [isHandlingAuth, setIsHandlingAuth] = React.useState(false);

  React.useEffect(() => {
    // 监听全局的401错误
    const handleUnauthorized = () => {
      // 防止重复触发
      if (isHandlingAuth) {
        console.log('🔒 Already handling authentication, skipping...');
        return;
      }

      // 检查当前是否已经在登录页面
      if (window.location.pathname === '/login') {
        console.log('🔒 Already on login page, skipping redirect...');
        return;
      }

      // 检查localStorage中是否有用户信息，如果没有说明确实需要登录
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        console.log('🔒 No user in localStorage, user needs to login');
        setIsHandlingAuth(true);
        
        // 显示提示
        alert('Please log in to access this page.');
        
        // 重新加载页面到登录界面
        window.location.href = '/login';
        return;
      }

      console.log('🔒 Session expired but user exists in localStorage. Clearing and redirecting...');
      setIsHandlingAuth(true);
      
      // 清除所有认证相关的本地存储
      localStorage.removeItem('user');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_header');
      
      // 显示提示
      alert('Your session has expired. Please log in again.');
      
      // 重新加载页面到登录界面
      setTimeout(() => {
        window.location.href = '/login';
      }, 500);
    };

    // 拦截fetch请求的401响应
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      
      // 只在非登录相关的API调用时处理401错误
      const url = args[0]?.toString() || '';
      const isLoginRequest = url.includes('/auth/login') || url.includes('/auth/check-session');
      
      if (response.status === 401 && !isLoginRequest && !isHandlingAuth) {
        console.warn('🚨 401 Unauthorized detected in fetch request:', url);
        
        // 延迟处理，避免在登录过程中立即触发
        setTimeout(() => {
          handleUnauthorized();
        }, 1000);
      }
      
      return response;
    };

    // 重置处理状态（当组件重新挂载时）
    const resetHandler = () => {
      setIsHandlingAuth(false);
    };

    // 监听页面变化来重置状态
    window.addEventListener('popstate', resetHandler);

    return () => {
      // 恢复原始的fetch
      window.fetch = originalFetch;
      window.removeEventListener('popstate', resetHandler);
    };
  }, [isHandlingAuth]);

  // 如果在登录页面，不应用认证错误处理
  if (window.location.pathname === '/login') {
    return <>{children}</>;
  }

  return <>{children}</>;
}; 