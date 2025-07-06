import { Request, Response, NextFunction } from 'express';
import { getPrisma } from '../../database';
import { AuthenticatedRequest } from '../types/custom';
import { RequestHandler } from 'express';

const prisma = getPrisma();

// 从 session 恢复用户信息的中间件
export const restoreUser = async (req: Request, _res: Response, next: NextFunction) => {
  const typedReq = req as AuthenticatedRequest;
  
  // 仅在开发环境记录详细日志
  if (process.env.NODE_ENV !== 'production') {
    console.log('=== Session Restore Debug ===');
    console.log('Request headers:', {
      cookie: req.headers.cookie,
      origin: req.headers.origin,
      referer: req.headers.referer,
      authorization: req.headers.authorization,
      'x-session-token': req.headers['x-session-token'],
      'x-browser-mode': req.headers['x-browser-mode'],
      'user-agent': req.headers['user-agent']
    });
    console.log('Session details:', {
      id: typedReq.sessionID,
      cookie: typedReq.session?.cookie,
      user: typedReq.session?.user ? {
        id: typedReq.session.user.id,
        role: typedReq.session.user.role
      } : null
    });
  }

  // 尝试从多个来源恢复用户会话
  if (!typedReq.session?.user) {
    // 1. 尝试从 Authorization header 恢复
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        // 这里应该验证 token 并恢复会话
        console.log('Attempting to restore session from Authorization header');
        // TODO: 实现 token 验证逻辑
      } catch (error) {
        console.error('Failed to restore session from token:', error);
      }
    }

    // 2. 尝试从自定义 header 恢复 - 实现实际的恢复逻辑
    const sessionToken = req.headers['x-session-token'] as string;
    if (sessionToken) {
      try {
        console.log('Attempting to restore session from x-session-token:', sessionToken);
        
        // 从数据库查找用户信息
        const user = await getPrisma().user.findUnique({
          where: { id: sessionToken },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            managerId: true
          }
        });
        
        if (user) {
          console.log('User found from x-session-token:', {
            id: user.id,
            role: user.role,
            email: user.email,
            managerId: user.managerId
          });
          
          // 恢复session
          if (typedReq.session) {
            typedReq.session.user = {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              managerId: user.managerId
            };
            
            // 设置用户到请求对象
            typedReq.user = {
              ...user,
              id: user.id.toString()
            };
            
            console.log('Session restored from x-session-token successfully');
          }
        } else {
          console.log('No user found for x-session-token:', sessionToken);
        }
      } catch (error) {
        console.error('Failed to restore session from x-session-token:', error);
      }
    }
  }
  
  if (typedReq.session?.user) {
    typedReq.user = {
      ...typedReq.session.user,
      id: typedReq.session.user.id.toString()
    };
    
    // 确保会话持久化
    if (!typedReq.session.cookie.maxAge) {
      typedReq.session.cookie.maxAge = 24 * 60 * 60 * 1000; // 24 hours
    }
    
    // 在无痕模式下特殊处理
    const isIncognito = !req.headers.referer && req.headers['sec-fetch-dest'] === 'document';
    if (isIncognito) {
      typedReq.session.cookie.sameSite = 'none';
      typedReq.session.cookie.secure = true;
      console.log('Adjusted cookie settings for incognito mode');
    }
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('User restored successfully:', {
        id: typedReq.user.id,
        role: typedReq.user.role,
        isIncognito
      });
    }
  } else if (process.env.NODE_ENV !== 'production') {
    console.log('No user found in session');
  }
  
  if (process.env.NODE_ENV !== 'production') {
    console.log('=== End Session Restore Debug ===');
  }
  
  next();
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const typedReq = req as AuthenticatedRequest;
  console.log('Checking auth - Session:', typedReq.session);
  console.log('Checking auth - User:', typedReq.user);
  
  if (!typedReq.user) {
    console.log('No user found in request');
    res.status(401).json({ message: 'Authentication required' });
    return;
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
  
  // 仅在开发环境记录详细日志
  if (process.env.NODE_ENV !== 'production') {
  console.log('=== Broker Authentication Debug ===');
  console.log('Request details:', {
    method: req.method,
    path: req.path,
    headers: {
      cookie: req.headers.cookie,
      origin: req.headers.origin,
      referer: req.headers.referer
    }
  });
  console.log('Session details:', {
    id: typedReq.sessionID,
    cookie: typedReq.session?.cookie,
    user: typedReq.session?.user ? {
      id: typedReq.session.user.id,
      role: typedReq.session.user.role
    } : null
  });
  }
  
  if (!typedReq.user) {
    if (process.env.NODE_ENV !== 'production') {
    console.log('Authentication failed: No user in request');
    }
    res.status(401).json({ 
      message: 'Authentication required'
    });
    return;
  }

  if (typedReq.user.role !== 'BROKER') {
    if (process.env.NODE_ENV !== 'production') {
    console.log('Authorization failed: Invalid role:', typedReq.user.role);
    }
    res.status(403).json({ 
      message: 'Access denied. Broker role required.'
    });
    return;
  }

  if (process.env.NODE_ENV !== 'production') {
  console.log('Authentication successful:', {
    userId: typedReq.user.id,
    role: typedReq.user.role
  });
  console.log('=== End Broker Authentication Debug ===');
  }
  
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
  console.log('Authenticating user - Session:', {
    sessionID: typedReq.sessionID,
    sessionUser: typedReq.session?.user,
    cookies: typedReq.headers.cookie
  });
  
  if (!typedReq.session?.user) {
    console.log('No user found in session');
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  if (!typedReq.user) {
    typedReq.user = {
      ...typedReq.session.user,
      id: typedReq.session.user.id.toString() // 确保 ID 是字符串
    };
  }

  next();
}; 