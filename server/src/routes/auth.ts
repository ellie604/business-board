// import { PrismaClient } from '../../generated/prisma';
// import express, { Request, Response, Router, RequestHandler } from 'express';

// const prisma = new PrismaClient();
// const router: Router = express.Router();

// const loginHandler = (async (req: Request, res: Response) => {
//   const { email, password } = req.body;
//   const user = await prisma.user.findUnique({ where: { email } });

//   if (!user || user.password !== password) {
//     return res.status(401).json({ message: 'Invalid email or password' });
//   }

//   const redirect = `/dashboard/${user.role.toLowerCase()}`;
//   res.json({ message: 'Login successful', role: user.role, redirect });
// }) as RequestHandler; 

// router.post('/login', loginHandler);

// export default router;

// server/src/routes/auth.ts
import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { getPrisma } from '../../database';
import { AuthenticatedRequest } from '../types/custom';

const router = Router();
const prisma = getPrisma();

interface UserFromDB {
  id: number;
  email: string;
  name: string | null;
  role: string;
  managing?: {
    id: number;
    email: string;
    role: string;
  }[];
}

const loginHandler = async (req: Request, res: Response): Promise<void> => {
  const typedReq = req as AuthenticatedRequest;
  
  const { email, password } = typedReq.body;
  
  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }
  
  try {
    // 优化数据库查询 - 只获取必要字段
    const user = await prisma.user.findUnique({
      where: { 
        email: email.toLowerCase()
      },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        role: true,
        // 移除 managing 查询以提高性能
      }
    });

    if (!user || user.password !== password) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }
    
    // 设置用户信息到 request 和 session
    const userInfo = {
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email
    };
    
    typedReq.user = userInfo;
    typedReq.session.user = userInfo;

    // 简化 session 保存 - 不使用异步回调
    try {
      await new Promise<void>((resolve, reject) => {
        typedReq.session.save((error: Error | null) => {
          if (error) reject(error);
          else resolve();
        });
      });
    } catch (sessionError) {
      console.error('Session save error:', sessionError);
      // 即使 session 保存失败，也继续登录流程
    }

    // 立即返回响应，不等待 session 完全保存
    res.json({ 
      message: 'Login successful',
      role: user.role,
      redirect: `/dashboard/${user.role.toLowerCase()}`,
      user: {
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        managing: [] // 暂时返回空数组，减少查询时间
      }
    });
  } catch (error: unknown) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error during login', 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// 测试路由 - 用于验证数据库连接
const testUsersHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        managing: {
          select: {
            id: true,
            email: true,
            role: true
          }
        }
      }
    });
    
    // 确保返回的用户 ID 都是字符串
    const usersWithStringIds = users.map((user: UserFromDB) => ({
      ...user,
      id: user.id.toString()
    }));
    
    console.log('All users:', usersWithStringIds);
    res.json({ users: usersWithStringIds });
  } catch (error: unknown) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      message: 'Failed to fetch users',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

router.post('/login', loginHandler);
router.get('/test-users', testUsersHandler);

export default router;
