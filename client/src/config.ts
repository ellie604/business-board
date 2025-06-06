// 统一的后端 URL 配置
const getBackendUrl = () => {
  const env = import.meta.env.MODE;
  const isDev = import.meta.env.DEV;
  const isProd = import.meta.env.PROD;
  const baseUrl = import.meta.env.BASE_URL;
  
  console.log('=== Environment Debug Info ===');
  console.log('Current environment (MODE):', env);
  console.log('isDev:', isDev);
  console.log('isProd:', isProd);
  console.log('BASE_URL:', baseUrl);
  console.log('Current hostname:', window.location.hostname);
  console.log('=== End Environment Debug Info ===');

  // 根据域名判断环境
  const isPreviewDomain = window.location.hostname.includes('-dev-');
  const envByDomain = isPreviewDomain ? 'preview' : 'production';
  console.log('Environment detected by domain:', envByDomain);

  // 使用域名判断来确定环境
  switch(envByDomain) {
    case 'production':
      // 生产环境：前端在 Vercel，后端在 Render.com
      return 'https://business-board-backend.onrender.com/api';
    case 'preview':
      // 开发预览环境：前端在 Vercel dev 分支，后端在 Render.com 预览环境
      return 'https://business-board-preview.onrender.com/api';
    default:
      // 本地开发环境
      return 'http://localhost:3000/api';
  }
};

export const API_BASE_URL = getBackendUrl();
console.log('API Base URL:', API_BASE_URL); 