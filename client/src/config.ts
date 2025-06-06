// 统一的后端 URL 配置
const getBackendUrl = () => {
  const env = import.meta.env.MODE;
  console.log('Current environment:', env);
  console.log('Current hostname:', window.location.hostname);

  switch(env) {
    case 'production':
      // 生产环境：前端在 Vercel，后端在 Render.com
      return 'https://business-board-backend.onrender.com/api';
    case 'preview':
      // 开发预览环境：前端在 Vercel dev 分支，后端在 Render.com 预览环境
      // return 'https://business-board.onrender.com/api';
      return 'https://business-board-git-dev-xinyis-projects-6c0795d6.vercel.app/api';
    default:
      // 本地开发环境
      return 'http://localhost:3000/api';
  }
};

export const API_BASE_URL = getBackendUrl();
console.log('API Base URL:', API_BASE_URL); 