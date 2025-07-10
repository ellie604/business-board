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
      console.log('🔍 SessionRestore: Starting session check...');
      
      // 避免重复尝试
      if (hasAttemptedRestore || isRestoring) {
        console.log('🔍 SessionRestore: Already attempted or in progress, skipping...');
        return;
      }

      // 检查localStorage中是否有用户信息
      const userStr = localStorage.getItem('user');
      console.log('🔍 SessionRestore: Checking localStorage user:', userStr ? 'Found' : 'Not found');
      
      if (!userStr) {
        console.log('🔍 SessionRestore: No user data in localStorage, no action needed');
        setHasAttemptedRestore(true);
        return;
      }

      try {
        const user = JSON.parse(userStr);
        console.log('🔍 SessionRestore: Parsed user data:', { id: user.id, email: user.email, role: user.role });
        
        if (!user.id || !user.email) {
          console.log('❌ SessionRestore: Invalid user data, clearing localStorage');
          localStorage.removeItem('user');
          setHasAttemptedRestore(true);
          return;
        }

        console.log('🔄 SessionRestore: Attempting to restore session for user:', user.email);
        setIsRestoring(true);

        // 首先检查当前session状态
        console.log('🔍 SessionRestore: Testing current session state...');
        try {
          const testResponse = await fetch(`${API_BASE_URL}/users`, {
            method: 'GET',
            credentials: 'include',
          });
          
          if (testResponse.ok) {
            console.log('✅ SessionRestore: Current session is valid, no restore needed');
            setIsRestoring(false);
            setHasAttemptedRestore(true);
            return;
          } else {
            console.log('❌ SessionRestore: Current session invalid (status:', testResponse.status, '), proceeding with restore...');
          }
        } catch (testError) {
          console.log('❌ SessionRestore: Session test failed:', testError, 'proceeding with restore...');
        }

        // 调用session恢复API
        console.log('🔄 SessionRestore: Calling restore-session API...');
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

        console.log('🔄 SessionRestore: Restore API response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('✅ SessionRestore: Session restored successfully:', data.message);
          
          // 更新localStorage中的用户信息
          localStorage.setItem('user', JSON.stringify(data.user));
          console.log('✅ SessionRestore: Updated localStorage with new user data');
          
          // 验证恢复后的session是否工作
          console.log('🔍 SessionRestore: Verifying restored session...');
          try {
            const verifyResponse = await fetch(`${API_BASE_URL}/users`, {
              method: 'GET',
              credentials: 'include',
            });
            
            if (verifyResponse.ok) {
              console.log('✅ SessionRestore: Session verification successful, refreshing page...');
              setTimeout(() => {
                window.location.reload();
              }, 500);
            } else {
              console.log('❌ SessionRestore: Session verification failed, redirecting to login...');
              localStorage.removeItem('user');
              window.location.href = '/login';
            }
          } catch (verifyError) {
            console.log('❌ SessionRestore: Session verification error:', verifyError);
            localStorage.removeItem('user');
            window.location.href = '/login';
          }
        } else {
          const errorData = await response.text();
          console.log('❌ SessionRestore: Restore failed with status:', response.status, 'response:', errorData);
          console.log('❌ SessionRestore: Clearing invalid localStorage and redirecting to login');
          
          // 清除无效的localStorage数据
          localStorage.removeItem('user');
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_header');
          
          // 重定向到登录页面
          if (window.location.pathname !== '/login') {
            console.log('🔄 SessionRestore: Redirecting to login page...');
            window.location.href = '/login';
          }
        }
      } catch (error) {
        console.error('❌ SessionRestore: Unexpected error during restore:', error);
        
        // 清除可能损坏的localStorage数据
        localStorage.removeItem('user');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_header');
        
        // 如果不在登录页面，重定向到登录页面
        if (window.location.pathname !== '/login') {
          console.log('🔄 SessionRestore: Error occurred, redirecting to login...');
          window.location.href = '/login';
        }
      } finally {
        setIsRestoring(false);
        setHasAttemptedRestore(true);
        console.log('🔍 SessionRestore: Restore attempt completed');
      }
    };

    // 检查是否在dashboard页面且刚刚登录（有localStorage但可能session没有正确设置）
    const isDashboardPage = window.location.pathname.includes('/broker') || 
                            window.location.pathname.includes('/agent') || 
                            window.location.pathname.includes('/buyer') || 
                            window.location.pathname.includes('/seller');
    
    const shouldCheckImmediately = isDashboardPage && localStorage.getItem('user');
    
    if (shouldCheckImmediately) {
      console.log('🔍 SessionRestore: Dashboard page detected, checking session immediately...');
      attemptSessionRestore();
    } else {
      // 延迟执行，避免在页面加载时立即触发
      console.log('🔍 SessionRestore: Scheduling restore attempt in 1 second...');
      const timer = setTimeout(attemptSessionRestore, 1000);
      return () => {
        console.log('🔍 SessionRestore: Cleanup timer');
        clearTimeout(timer);
      };
    }
  }, [hasAttemptedRestore, isRestoring]);

  // 显示恢复状态
  if (isRestoring) {
    console.log('🔄 SessionRestore: Showing restore UI...');
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