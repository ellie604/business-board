import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config';

interface SessionRestoreProps {
  children: React.ReactNode;
}

export const SessionRestore: React.FC<SessionRestoreProps> = ({ children }) => {
  const [isRestoring, setIsRestoring] = useState(false);
  const [hasAttemptedRestore, setHasAttemptedRestore] = useState(false);

  useEffect(() => {
    const attemptSessionRestore = async () => {
      // 避免重复尝试
      if (hasAttemptedRestore || isRestoring) return;

      // 检查localStorage中是否有用户信息
      const userStr = localStorage.getItem('user');
      if (!userStr) return;

      try {
        const user = JSON.parse(userStr);
        if (!user.id || !user.email) return;

        console.log('🔄 Attempting to restore session for user:', user.email);
        setIsRestoring(true);

        // 调用session恢复API
        const response = await fetch(`${API_BASE_URL}/auth/restore-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            userId: user.id,
            email: user.email
          })
        });

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Session restored successfully:', data.message);
          
          // 更新localStorage中的用户信息
          localStorage.setItem('user', JSON.stringify(data.user));
          
          // 刷新页面以使用新的session
          setTimeout(() => {
            window.location.reload();
          }, 500);
        } else {
          console.log('❌ Session restore failed, user needs to login again');
          // 清除无效的localStorage数据
          localStorage.removeItem('user');
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_header');
          
          // 重定向到登录页面
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
      } catch (error) {
        console.error('Session restore error:', error);
        // 清除可能损坏的localStorage数据
        localStorage.removeItem('user');
      } finally {
        setIsRestoring(false);
        setHasAttemptedRestore(true);
      }
    };

    // 延迟执行，避免在页面加载时立即触发
    const timer = setTimeout(attemptSessionRestore, 1000);
    return () => clearTimeout(timer);
  }, [hasAttemptedRestore, isRestoring]);

  // 显示恢复状态
  if (isRestoring) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Restoring your session...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}; 