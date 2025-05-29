import express from 'express';
import cors from 'cors';
import session from 'express-session';
import MemoryStore from 'memorystore';
import authRouter from './routes/auth';
import brokerRouter from './routes/broker';

const app = express();

// 创建 MemoryStore 实例
const memoryStore = MemoryStore(session);

// 根据环境配置允许的域名
const getAllowedOrigins = () => {
  switch(process.env.NODE_ENV) {
    case 'production':
      return ['https://business-board.vercel.app'];
    case 'preview':
      // 更新 Vercel Preview 部署的域名模式，使用数组而不是正则
      return [
        /https:\/\/business-board-.*\.vercel\.app$/,
        /https:\/\/business-board-git-.*\.vercel\.app$/
      ];
    default:
      return ['http://localhost:5174', 'http://localhost:5173'];
  }
};

// 配置 CORS
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = getAllowedOrigins();
    console.log('Request origin:', origin);
    console.log('Allowed origins:', allowedOrigins);
    
    // 允许没有 origin 的请求（比如同源请求）
    if (!origin) {
      console.log('No origin provided, allowing request');
      return callback(null, true);
    }

    // 检查是否匹配允许的域名
    const isAllowed = Array.isArray(allowedOrigins)
      ? allowedOrigins.some(allowed => 
          allowed instanceof RegExp 
            ? allowed.test(origin)
            : allowed === origin
        )
      : allowedOrigins === origin;

    if (isAllowed) {
      console.log('Origin allowed:', origin);
      return callback(null, origin);
    }

    console.log('Origin not allowed:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());

// 配置 session
const sessionConfig: session.SessionOptions = {
  store: new memoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  name: 'business.board.sid',
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: true, // 修改为 true 以确保 session 被保存
  saveUninitialized: false,
  rolling: true,
  proxy: true,
  cookie: {
    secure: process.env.NODE_ENV !== 'development',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'development' ? 'lax' as const : 'none' as const,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    path: '/'
  }
};

// 在开发环境下禁用 secure cookie
if (process.env.NODE_ENV === 'development') {
  sessionConfig.cookie!.secure = false;
}

// 确保在所有路由之前初始化 session
app.use(session(sessionConfig));

// 添加调试中间件
app.use((req, res, next) => {
  console.log('=== Session Debug Info ===');
  console.log('Session ID:', req.sessionID);
  console.log('Session:', req.session);
  console.log('Cookie:', req.headers.cookie);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('=== End Session Debug Info ===');
  next();
});

// 注册路由
app.use('/api/auth', authRouter);
app.use('/api/broker', brokerRouter);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', environment: process.env.NODE_ENV });
});

export default app; 