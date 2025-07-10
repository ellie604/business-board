import { Request, Response, NextFunction } from 'express';
import { getPrisma } from '../../database';
import { AuthenticatedRequest } from '../types/custom';
import { RequestHandler } from 'express';

const prisma = getPrisma();

// 从 session 恢复用户信息的中间件
export const restoreUser = async (req: Request, _res: Response, next: NextFunction) => {
  const typedReq = req as AuthenticatedRequest;
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
  const isPreview = process.env.VERCEL_ENV === 'preview' || process.env.NODE_ENV === 'preview';
  
  // 1. 优先从session恢复用户（如果有有效session）
  if (typedReq.session?.user?.id) {
    typedReq.user = {
      ...typedReq.session.user,
      id: typedReq.session.user.id.toString()
    };
    
    // 确保会话持久化
    typedReq.session.cookie.maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
    
    if (!isProduction && !isPreview) {
      console.log('✅ User restored from session:', {
        id: typedReq.user.id.substring(0, 8) + '...',
        role: typedReq.user.role
      });
    }
    
    return next();
  }

  // 2. 备用：从X-Session-Token header恢复（为无痕模式和跨域场景）
  const sessionToken = req.headers['x-session-token'] as string;
  if (sessionToken) {
    try {
      if (!isProduction && !isPreview) {
        console.log('🔄 Attempting restore from x-session-token:', sessionToken.substring(0, 8) + '...');
      }
      
      // 从数据库查找用户信息
      const user = await getPrisma().user.findUnique({
        where: { id: sessionToken },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          managerId: true,
          isActive: true
        }
      });
      
      if (user && user.isActive) {
        if (!isProduction && !isPreview) {
          console.log('✅ User found from x-session-token:', {
            id: user.id.substring(0, 8) + '...',
            role: user.role
          });
        }
        
        // 设置用户到请求对象
        typedReq.user = {
          id: user.id.toString(),
          email: user.email,
          name: user.name || undefined,
          role: user.role,
          managerId: user.managerId || undefined
        };
        
        // 同时恢复到session中（如果session可用）
        if (typedReq.session) {
          typedReq.session.user = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            managerId: user.managerId
          };
          
          // 强制保存session
          typedReq.session.save((err) => {
            if (err && !isProduction && !isPreview) {
              console.error('Failed to save session from token restore:', err);
            }
          });
        }
        
        return next();
      } else {
        if (!isProduction && !isPreview) {
          console.log('❌ User not found or inactive for token:', sessionToken.substring(0, 8) + '...');
        }
      }
    } catch (error) {
      console.error('❌ Failed to restore user from x-session-token:', error);
    }
  }
  
  // 3. 检测无痕模式并提供友好提示
  const isBrowserMode = req.headers['x-browser-mode'];
  if (isBrowserMode === 'incognito' && !isProduction) {
    console.log('🕵️ Incognito mode detected - user needs to login again');
  }
  
  // 如果都没有成功，继续到下一个中间件（用户未认证状态）
  next();
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const typedReq = req as AuthenticatedRequest;
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
  
  // 记录认证尝试
  if (!isProduction) {
    console.log('=== Authentication Check ===');
    console.log('Auth details:', {
      path: req.path,
      method: req.method,
      hasUser: !!typedReq.user,
      hasSession: !!typedReq.session?.user,
      sessionID: typedReq.sessionID?.substring(0, 8) + '...',
      userFromReq: typedReq.user ? {
        id: typedReq.user.id.substring(0, 8) + '...',
        role: typedReq.user.role,
        email: typedReq.user.email
      } : null,
      userFromSession: typedReq.session?.user ? {
        id: typedReq.session.user.id.substring(0, 8) + '...',
        role: typedReq.session.user.role,
        email: typedReq.session.user.email
      } : null
    });
  }
  
  if (!typedReq.user) {
    // 在所有环境记录认证失败
    console.log('❌ Authentication failed:', {
      path: req.path,
      method: req.method,
      sessionId: typedReq.sessionID?.substring(0, 8) + '...',
      hasSession: !!typedReq.session,
      hasSessionUser: !!typedReq.session?.user,
      userAgent: req.headers['user-agent']?.substring(0, 50) + '...',
      origin: req.headers.origin,
      hasCookies: !!req.headers.cookie,
      hasXSessionToken: !!req.headers['x-session-token']
    });
    
    res.status(401).json({ 
      message: 'Authentication required',
      error: 'AUTHENTICATION_REQUIRED',
      timestamp: new Date().toISOString()
    });
    return;
  }
  
  if (!isProduction) {
    console.log('✅ Authentication successful:', {
      id: typedReq.user.id.substring(0, 8) + '...',
      role: typedReq.user.role,
      email: typedReq.user.email
    });
    console.log('=== End Authentication Check ===');
  }
  
  next();
};

export const authenticateAgent: RequestHandler = (req, res, next) => {
  const typedReq = req as AuthenticatedRequest;
  console.log('Authenticating agent - Session:', {
    sessionID: typedReq.sessionID,
    user: typedReq.session.user,
    cookies: typedReq.headers.cookie
  });
  console.log('Authenticating agent - User:', {
    user: typedReq.user,
    type_of_id: typedReq.user?.id ? typeof typedReq.user.id : 'undefined'
  });
  
  if (!typedReq.user) {
    console.log('No user found in request');
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  if (typedReq.user.role !== 'AGENT') {
    console.log('User is not an agent. Role:', typedReq.user.role);
    res.status(403).json({ message: 'Access denied. Agent role required.' });
    return;
  }

  next();
};

export const authenticateBroker: RequestHandler = (req, res, next) => {
  const typedReq = req as AuthenticatedRequest;
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
  
  // 在所有环境下记录基本信息
  console.log('=== Broker Authentication ===');
  console.log('Request details:', {
    method: req.method,
    path: req.path,
    origin: req.headers.origin,
    hasSession: !!typedReq.session?.user,
    sessionUser: typedReq.session?.user ? {
      id: typedReq.session.user.id.substring(0, 8) + '...',
      role: typedReq.session.user.role
    } : null,
    hasReqUser: !!typedReq.user,
    reqUser: typedReq.user ? {
      id: typedReq.user.id.substring(0, 8) + '...',
      role: typedReq.user.role
    } : null
  });
  
  // 仅在开发环境记录详细信息
  if (!isProduction) {
    console.log('Detailed session info:', {
      sessionId: typedReq.sessionID,
      cookie: typedReq.session?.cookie,
      headers: {
        cookie: req.headers.cookie,
        referer: req.headers.referer
      }
    });
  }
  
  if (!typedReq.user) {
    console.log('Authentication failed: No user in request');
    res.status(401).json({ 
      message: 'Authentication required'
    });
    return;
  }

  if (typedReq.user.role !== 'BROKER') {
    console.log('Authorization failed: Invalid role:', typedReq.user.role);
    res.status(403).json({ 
      message: 'Access denied. Broker role required.'
    });
    return;
  }

  console.log('Broker authentication successful:', {
    userId: typedReq.user.id.substring(0, 8) + '...',
    role: typedReq.user.role
  });
  console.log('=== End Broker Authentication ===');
  
  next();
};

// 买家认证中间件
export const authenticateBuyer: RequestHandler = (req, res, next) => {
  const typedReq = req as AuthenticatedRequest;
  if (typedReq.user?.role !== 'BUYER') {
    res.status(403).json({ message: 'Access denied. Buyer role required.' });
    return;
  }
  next();
};

export const authenticateSeller: RequestHandler = (req, res, next) => {
  const typedReq = req as AuthenticatedRequest;
  if (typedReq.user?.role !== 'SELLER') {
    res.status(403).json({ message: 'Access denied. Seller role required.' });
    return;
  }
  next();
};

export const authenticateUser: RequestHandler = (req, res, next) => {
  const typedReq = req as AuthenticatedRequest;
  
  console.log('Authenticating user - Check:', {
    sessionID: typedReq.sessionID?.substring(0, 8) + '...',
    hasSessionUser: !!typedReq.session?.user,
    hasReqUser: !!typedReq.user,
    sessionUserId: typedReq.session?.user?.id?.substring(0, 8) + '...',
    reqUserId: typedReq.user?.id?.substring(0, 8) + '...'
  });
  
  // 优先使用已经恢复的用户信息（从headers或其他源恢复的）
  if (typedReq.user) {
    console.log('User already authenticated via restore middleware');
    next();
    return;
  }
  
  // 如果没有已恢复的用户，尝试从session中获取
  if (typedReq.session?.user) {
    typedReq.user = {
      ...typedReq.session.user,
      id: typedReq.session.user.id.toString() // 确保 ID 是字符串
    };
    console.log('User authenticated from session');
    next();
    return;
  }
  
  // 如果都没有，返回401错误
  console.log('Authentication failed: No user found in session or request');
  res.status(401).json({ message: 'Authentication required' });
  return;
}; 