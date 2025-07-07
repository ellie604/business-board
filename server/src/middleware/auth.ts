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
  const isServerless = isProduction || isPreview || process.env.VERCEL === '1';
  
  // 在生产环境也记录关键信息用于调试
  if (!isProduction && !isPreview) {
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
  } else {
    // 生产环境仍然记录基本信息
    console.log('Serverless session restore:', {
      hasSession: !!typedReq.session?.user,
      sessionId: typedReq.sessionID?.substring(0, 8) + '...',
      hasToken: !!req.headers['x-session-token'],
      hasAuth: !!req.headers.authorization,
      origin: req.headers.origin,
      isServerless,
      needsRestore: !!(req as any)._needsSessionRestore
    });
  }

  // 在serverless环境中，优先尝试从headers恢复用户信息
  if (isServerless && !typedReq.session?.user) {
    console.log('Serverless environment: Session not found, attempting header-based restore...');
    
    // 1. 优先尝试从 x-session-token header 恢复
    const sessionToken = req.headers['x-session-token'] as string || (req as any)._sessionToken;
    if (sessionToken) {
      try {
        console.log('Attempting to restore user from x-session-token:', sessionToken.substring(0, 8) + '...');
        
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
            id: user.id.substring(0, 8) + '...',
            role: user.role,
            email: user.email,
            managerId: user.managerId
          });
          
          // 直接设置用户到请求对象（绕过session store）
          typedReq.user = {
            id: user.id.toString(),
            email: user.email,
            name: user.name || undefined,
            role: user.role,
            managerId: user.managerId || undefined
          };
          
          // 尝试保存到session（如果可能）
          if (typedReq.session) {
            try {
              typedReq.session.user = {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                managerId: user.managerId
              };
              console.log('Session also updated with user data');
            } catch (sessionError) {
              console.warn('Failed to save to session store, but user restored from token:', sessionError);
            }
          }
          
          console.log('User restored successfully from x-session-token');
        } else {
          console.log('No user found for x-session-token');
        }
      } catch (error) {
        console.error('Failed to restore user from x-session-token:', error);
      }
    }
    
    // 2. 如果还没有用户，尝试从 Authorization header 恢复
    if (!typedReq.user) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        try {
          console.log('Attempting to restore user from Authorization header');
          // 这里可以添加JWT token验证逻辑，暂时跳过
          console.log('Authorization header token found but not implemented yet');
        } catch (error) {
          console.error('Failed to restore user from Authorization header:', error);
        }
      }
    }
  } else if (typedReq.session?.user && !typedReq.user) {
    // 如果session中有用户但请求对象中没有，恢复它
    typedReq.user = {
      ...typedReq.session.user,
      id: typedReq.session.user.id.toString()
    };
  }
  
  // 标准的session恢复逻辑（非serverless环境或作为备份）
  if (!typedReq.user && typedReq.session?.user) {
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
      typedReq.session.cookie.sameSite = 'lax'; // 改为lax，更兼容
      typedReq.session.cookie.secure = false; // 改为false，更兼容
      console.log('Adjusted cookie settings for incognito mode');
    }
    
    if (!isProduction && !isPreview) {
      console.log('User restored from session:', {
        id: typedReq.user.id.substring(0, 8) + '...',
        role: typedReq.user.role,
        isIncognito
      });
    }
  }
  
  // 最终状态检查
  if (typedReq.user) {
    console.log('User authentication successful:', {
      id: typedReq.user.id.substring(0, 8) + '...',
      role: typedReq.user.role,
      source: typedReq.session?.user ? 'session' : 'header'
    });
  } else {
    console.log('No user found after all restore attempts');
  }
  
  if (!isProduction && !isPreview) {
    console.log('=== End Session Restore Debug ===');
  }
  
  next();
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const typedReq = req as AuthenticatedRequest;
  
  // 在生产环境也记录认证失败信息
  if (!typedReq.user) {
    console.log('Authentication failed:', {
      sessionId: typedReq.sessionID?.substring(0, 8) + '...',
      hasSession: !!typedReq.session,
      hasSessionUser: !!typedReq.session?.user,
      userAgent: req.headers['user-agent']?.substring(0, 50) + '...',
      origin: req.headers.origin
    });
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  
  console.log('Authentication successful for user:', {
    id: typedReq.user.id.substring(0, 8) + '...',
    role: typedReq.user.role
  });
  
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