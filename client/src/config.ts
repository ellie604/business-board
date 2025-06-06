// 统一的后端 URL 配置
const getBackendUrl = () => {
  const env = import.meta.env.MODE;
  switch(env) {
    case 'production':
      return 'https://business-board.onrender.com/api';
    case 'preview':
      // 从当前域名构建后端 URL
      const domain = window.location.hostname;
      // 使用相对路径，让浏览器自动处理同源请求
      return '/api';
    default:
      return '/api';
  }
};

export const API_BASE_URL = getBackendUrl();

// 添加调试信息
console.log('Current environment:', import.meta.env.MODE);
console.log('API Base URL:', API_BASE_URL);
console.log('Current hostname:', window.location.hostname); 