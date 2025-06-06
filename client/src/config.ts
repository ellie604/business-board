// 统一的后端 URL 配置
const getBackendUrl = () => {
  const env = import.meta.env.MODE;
  console.log('Current environment:', env);
  console.log('Current hostname:', window.location.hostname);

  switch(env) {
    case 'production':
      // 使用主域名作为后端 API
      return 'https://business-board-git-main-xinyis-projects-6c0795d6.vercel.app/api';
    case 'preview':
      // 在预览环境中，后端和前端部署在同一域名下
      return 'https://business-board-git-dev-xinyis-projects-6c0795d6.vercel.app/api';
    default:
      // 本地开发环境
      return 'http://localhost:3000/api';
  }
};

export const API_BASE_URL = getBackendUrl();
console.log('API Base URL:', API_BASE_URL); 