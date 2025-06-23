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
      'https://business-board-git-main-xinyis-projects-6c0795d6.vercel.app',  // 生产环境 git 域名
      /https:\/\/business-board-git-main-.*\.vercel\.app/,  // 生产环境的其他 main 分支域名
      /https:\/\/business-board-.*-xinyis-projects-6c0795d6\.vercel\.app/  // 用户特定的生产域名
    ],
    preview: [
      'https://business-board-git-dev-xinyis-projects-6c0795d6.vercel.app',  // 你的具体预览环境域名
      /https:\/\/business-board-git-dev-.*\.vercel\.app/,  // 预览环境的 dev 分支域名
      /https:\/\/business-board-.*-xinyis-projects-6c0795d6\.vercel\.app/,  // 用户特定的预览域名
      /https:\/\/business-board-.*\.vercel\.app/  // 所有 business-board 相关的 Vercel 域名
    ],
    development: [
      'http://localhost:5174', 
      'http://localhost:5173'
    ]
  };

  // 检测环境：优先使用 VERCEL_ENV，然后是 NODE_ENV
  let env = process.env.VERCEL_ENV || process.env.NODE_ENV || 'development';
  
  // Vercel 环境映射
  if (env === 'production') {
    env = 'production';
  } else if (env === 'preview') {
    env = 'preview';
  } else {
    env = 'development';
  }
  
  console.log('Current environment:', env);
  console.log('VERCEL_ENV:', process.env.VERCEL_ENV);
  console.log('NODE_ENV:', process.env.NODE_ENV);
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
    const hostname = process.env.HOST;
    
    // CORS configuration
    console.log('Current environment:', process.env.NODE_ENV);
    console.log('Current hostname:', hostname);
    console.log('Available origins for this environment:', allowedOrigins);
    
    // 减少CORS调试日志 - 只在出错时显示
    if (process.env.NODE_ENV === 'development' && process.env.DEBUG_CORS) {
      console.log('=== CORS Debug Info ===');
      console.log('Incoming request origin:', origin);
      console.log('Current NODE_ENV:', process.env.NODE_ENV);
      console.log('Allowed origins:', allowedOrigins);
    }
    
    // 允许没有 origin 的请求 (比如移动app或者一些工具)
    if (!origin) {
      callback(null, true);
      return;
    }
    
    // 检查 origin 是否在允许列表中 (支持字符串和正则表达式)
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return allowedOrigin === origin;
      } else if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      if (process.env.NODE_ENV === 'development' && process.env.DEBUG_CORS) {
        console.log('Origin allowed:', origin);
      }
      callback(null, true);
    } else {
      console.error('CORS Error: Origin not allowed:', origin);
      console.error('Allowed origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'), false);
    }
    
    if (process.env.NODE_ENV === 'development' && process.env.DEBUG_CORS) {
      console.log('=== End CORS Debug Info ===');
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With', 
    'Accept',
    'X-Browser-Mode',
    'X-Session-Token'
  ],
  exposedHeaders: [
    'X-Session-Token'
  ]
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
  vercelEnv: process.env.VERCEL_ENV,
  secret: process.env.SESSION_SECRET ? '[SET]' : '[DEFAULT]',
  secure: sessionConfig.cookie?.secure,
  sameSite: sessionConfig.cookie?.sameSite,
  domain: sessionConfig.cookie?.domain
});

// 根据环境调整 cookie 设置
const isProduction = process.env.NODE_ENV === 'production';
const isVercelDeploy = process.env.VERCEL === '1';
const isLocalhost = !isVercelDeploy;

if (isLocalhost) {
  // 本地开发环境
  sessionConfig.cookie!.secure = false;
  sessionConfig.cookie!.sameSite = 'lax';
  console.log('Local development: Using secure=false, sameSite=lax');
} else if (isVercelDeploy) {
  // Vercel 部署环境（包括预览和生产）
  sessionConfig.cookie!.secure = true;
  sessionConfig.cookie!.sameSite = 'none';
  
  // 特别为无痕模式优化
  sessionConfig.cookie!.partitioned = true; // Chrome 的新特性，有助于无痕模式
  
  console.log('Vercel deployment: Using secure=true, sameSite=none, partitioned=true');
} else {
  // 其他生产环境
  sessionConfig.cookie!.secure = true;
  sessionConfig.cookie!.sameSite = 'none';
  console.log('Production environment: Using secure=true, sameSite=none');
}

// 确保在所有路由之前初始化 session
app.use(session(sessionConfig));

// 添加无痕模式支持的中间件
app.use((req, res, next) => {
  // 检查是否是无痕模式的请求
  const userAgent = req.headers['user-agent'] || '';
  const isIncognito = req.headers['sec-fetch-dest'] === 'document' && 
                     req.headers['sec-fetch-mode'] === 'navigate' &&
                     !req.headers['referer'];

  // 为无痕模式设置额外的 CORS 头
  if (isIncognito || process.env.VERCEL_ENV === 'preview') {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Vary', 'Origin');
    
    // 设置更宽松的 cookie 策略用于无痕模式
    if (req.session && !req.session.user?.id) {
      // 为无痕模式尝试从 Authorization header 中恢复会话
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const sessionId = authHeader.substring(7);
        // 这里可以添加从其他地方恢复会话的逻辑
        console.log('Attempting to restore session for incognito mode:', sessionId);
      }
    }
  }

  // 添加调试信息
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_INCOGNITO) {
    console.log('Request info:', {
      incognito: isIncognito,
      userAgent: userAgent.substring(0, 50) + '...',
      hasSession: !!req.session?.user?.id,
      sessionID: req.sessionID,
      cookies: req.headers.cookie ? 'present' : 'missing',
      origin: req.headers.origin
    });
  }

  next();
});

// 添加安全相关的响应头
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// 从 session 恢复用户信息
app.use(restoreUser);

// 添加请求日志中间件
app.use((req, res, next) => {
  // 减少Session调试日志 - 只在需要时显示
  if (process.env.NODE_ENV === 'development' && process.env.DEBUG_SESSION) {
    console.log('=== Session Debug Info ===');
    console.log('Session ID:', req.sessionID);
    console.log('Session:', req.session);
    console.log('User:', req.session?.user);
    console.log('Cookie:', req.headers.cookie);
    console.log('Environment:', process.env.NODE_ENV);
    console.log('=== End Session Debug Info ===');
  }
  
  // 减少Request调试日志 - 只在需要时显示
  if (process.env.NODE_ENV === 'development' && process.env.DEBUG_REQUESTS) {
    console.log('=== Request Debug Info ===');
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('=== End Request Debug Info ===');
  }
  
  next();
});

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