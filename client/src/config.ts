// 统一的后端 URL 配置
const getBackendUrl = () => {
  const env = import.meta.env.MODE;
  switch(env) {
    case 'production':
      return 'https://business-board.onrender.com/api';
    case 'preview':
      // 从当前域名构建后端 URL
      const domain = window.location.hostname;
      if (domain.includes('-xinyis-projects-6c0795d6.vercel.app')) {
        const backendDomain = domain.replace('vercel.app', 'onrender.com');
        return `https://${backendDomain}/api`;
      }
      return '/api';
    default:
      return '/api';
  }
};

export const API_BASE_URL = getBackendUrl(); 