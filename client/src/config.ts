// 统一的后端 URL 配置
const getBackendUrl = () => {
  const hostname = window.location.hostname;
  
  console.log('=== Environment Debug Info ===');
  console.log('Current hostname:', hostname);
  console.log('=== End Environment Debug Info ===');

  // 前端在Vercel，后端在Render
  // 如果域名包含 -dev- 就是 preview 环境
  // 如果是 localhost 就是本地开发环境
  // 如果是生产域名（bribizsales.com 或 californiabizsales.com）就是 production 环境
  // 其他情况都是 production 环境
  if (hostname.includes('-dev-')) {
    console.log('Environment: preview');
    return 'https://business-board-preview.onrender.com/api';
  } else if (hostname === 'localhost') {
    console.log('Environment: development');
    return 'http://localhost:3001/api';
  } else if (
    hostname === 'bribizsales.com' || 
    hostname === 'www.bribizsales.com' ||
    hostname === 'californiabizsales.com' || 
    hostname === 'www.californiabizsales.com'
  ) {
    console.log('Environment: production (custom domain)');
    return 'https://business-board-alv2.onrender.com/api';
  } else {
    console.log('Environment: production (default)');
    return 'https://business-board-alv2.onrender.com/api';
  }
};

export const API_BASE_URL = getBackendUrl();
console.log('API Base URL:', API_BASE_URL); 