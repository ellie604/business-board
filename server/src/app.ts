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
import listingRouter from './routes/listing';
import { restoreUser } from './middleware/auth';
import { checkDatabaseHealth } from '../database';

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
    production: [
      'https://business-board.vercel.app',  // 生产环境主域名
      /https:\/\/business-board-git-main-.*\.vercel\.app/  // 生产环境的其他 Vercel 域名
    ],
    preview: [
      'https://business-board-git-dev-xinyis-projects-6c0795d6.vercel.app',  // 你的具体预览环境域名
      /https:\/\/business-board-git-dev-.*\.vercel\.app/,  // 预览环境的 Vercel 域名
      /https:\/\/business-board-.*\.vercel\.app/,  // 其他 Vercel 预览域名
      'https://business-board-git-dev-xinyis-projects-6c0795d6.vercel.app'  // 确保完全匹配
    ],
    development: [
      'http://localhost:5174', 
      'http://localhost:5173'
    ]
  };

  const env = process.env.NODE_ENV || 'development';
  console.log('Current environment:', env);
  console.log('Current hostname:', process.env.HOST);
  
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
    console.log('=== CORS Debug Info ===');
    console.log('Incoming request origin:', origin);
    console.log('Current NODE_ENV:', process.env.NODE_ENV);
    console.log('Allowed origins:', allowedOrigins);
    
    // 允许没有 origin 的请求（比如同源请求）
    if (!origin) {
      console.log('No origin provided, allowing request');
      return callback(null, true);
    }

    // 检查是否匹配允许的域名
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return allowed === origin;
    });

    if (isAllowed) {
      console.log('Origin allowed:', origin);
      return callback(null, origin);
    }

    console.log('Origin not allowed:', origin);
    console.log('=== End CORS Debug Info ===');
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
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
  saveUninitialized: true,
  rolling: true,
  proxy: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'none',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    path: '/',
    domain: undefined
  }
};

console.log('Session configuration:', {
  env: process.env.NODE_ENV,
  secret: process.env.SESSION_SECRET ? '[SET]' : '[DEFAULT]',
  secure: sessionConfig.cookie?.secure,
  sameSite: sessionConfig.cookie?.sameSite,
  domain: sessionConfig.cookie?.domain
});

// 在开发环境下修改 cookie 设置
if (process.env.NODE_ENV === 'development') {
  sessionConfig.cookie!.secure = false;
  sessionConfig.cookie!.sameSite = 'lax';
} else {
  // 在生产环境确保安全设置
  sessionConfig.cookie!.secure = true;
  sessionConfig.cookie!.sameSite = 'none';
}

// 确保在所有路由之前初始化 session
app.use(session(sessionConfig));

// 添加安全相关的响应头
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// 从 session 恢复用户信息
app.use(restoreUser);

// 添加调试中间件 - 仅在开发环境
if (process.env.NODE_ENV !== 'production') {
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

  // 添加路由调试中间件 - 仅在开发环境
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log('=== Request Debug Info ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('=== End Request Debug Info ===');
  next();
});
}

// 注册路由
app.use('/api/auth', authRouter);
app.use('/api/broker/listings', listingRouter);
app.use('/api/broker', brokerRouter);
app.use('/api/agent', agentRouter);
app.use('/api/buyer', buyerRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/users', usersRouter);
app.use('/api/messages', messagesRouter);

// 健康检查
app.get('/health', async (req, res) => {
  try {
    const health = await checkDatabaseHealth();
    res.json({ status: 'ok', environment: process.env.NODE_ENV, database: health });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ 
      status: 'error', 
      environment: process.env.NODE_ENV, 
      message: errorMessage 
    });
  }
});

export default app; 