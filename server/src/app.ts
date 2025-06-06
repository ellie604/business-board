import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import session from 'express-session';
import MemoryStore from 'memorystore';
import authRouter from './routes/auth';
import brokerRouter from './routes/broker';
import agentRouter from './routes/agent';
import buyerRouter from './routes/buyer';
import sellerRouter from './routes/seller';
import usersRouter from './routes/users';
import messagesRouter from './routes/messages';
import { restoreUser } from './middleware/auth';

// 扩展 Express 的 Request 类型
declare module 'express' {
  interface Request {
    session: session.Session & {
      userId?: string;
      isAuthenticated?: boolean;
      user?: {
        id: string;
        role: string;
      };
    };
    sessionID: string;
  }
}

const app = express();

// 创建 MemoryStore 实例
const memoryStore = MemoryStore(session);

// 根据环境配置允许的域名
const getAllowedOrigins = () => {
  type OriginType = string | RegExp;
  
  const origins: Record<string, OriginType[]> = {
    production: ['https://business-board.vercel.app'],
    preview: [
      /https:\/\/business-board-git-.*-xinyis-projects-.*\.vercel\.app/,
      /https:\/\/business-board-.*\.vercel\.app/
    ],
    development: ['http://localhost:5174', 'http://localhost:5173']
  };

  const env = process.env.NODE_ENV || 'development';
  console.log('Current environment:', env);
  
  if (!(env in origins)) {
    console.warn('Unknown environment:', env, 'falling back to development');
    return origins.development;
  }

  console.log('Available origins for this environment:', origins[env]);
  return origins[env];
};

// 配置 CORS
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = getAllowedOrigins();
    console.log('Incoming request origin:', origin);
    console.log('Allowed origins:', allowedOrigins);
    
    // 允许没有 origin 的请求（比如同源请求）
    if (!origin) {
      console.log('No origin provided, allowing request');
      return callback(null, true);
    }

    // 检查是否匹配允许的域名
    const isAllowed = Array.isArray(allowedOrigins)
      ? allowedOrigins.some(allowed => {
          const matches = allowed instanceof RegExp 
            ? allowed.test(origin)
            : allowed === origin;
          console.log(`Checking origin ${origin} against ${allowed}:`, matches);
          return matches;
        })
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
  resave: true,
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

console.log('Session configuration:', {
  env: process.env.NODE_ENV,
  secret: process.env.SESSION_SECRET ? '[SET]' : '[DEFAULT]',
  secure: sessionConfig.cookie?.secure,
  sameSite: sessionConfig.cookie?.sameSite
});

// 在开发环境下禁用 secure cookie
if (process.env.NODE_ENV === 'development') {
  sessionConfig.cookie!.secure = false;
}

// 确保在所有路由之前初始化 session
app.use(session(sessionConfig));

// 从 session 恢复用户信息
app.use(restoreUser);

// 添加调试中间件
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log('=== Session Debug Info ===');
  console.log('Session ID:', req.sessionID);
  console.log('Session:', req.session);
  console.log('User:', (req as any).user);
  console.log('Cookie:', req.headers.cookie);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('=== End Session Debug Info ===');
  next();
});

// 注册路由
app.use('/api/auth', authRouter);
app.use('/api/broker', brokerRouter);
app.use('/api/agent', agentRouter);
app.use('/api/buyer', buyerRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/users', usersRouter);
app.use('/api/messages', messagesRouter);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', environment: process.env.NODE_ENV });
});

export default app; 