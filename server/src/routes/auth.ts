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
  console.log('Login request received - Body:', typedReq.body);
  
  const { email, password } = typedReq.body;
  
  if (!email || !password) {
    console.error('Missing email or password in request');
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }
  
  try {
    console.log('Attempting to find user with email:', email);
    
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
        managing: {
          select: {
            id: true,
            email: true,
            role: true
          }
        }
      }
    });

    console.log('Found user:', {
      ...user,
      password: user ? '******' : null
    });

    if (!user) {
      console.log('No user found with email:', email);
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    console.log('Found user details:', {
      id: user.id,
      role: user.role,
      type_of_id: typeof user.id
    });

    if (user.password !== password) {
      console.log('Password mismatch');
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    console.log('Login successful for:', email, 'with role:', user.role);
    
    // 设置用户信息到 request 和 session
    const userInfo = {
      id: user.id.toString(), // 确保 ID 是字符串类型
      role: user.role
    };
    
    typedReq.user = userInfo;
    typedReq.session.user = userInfo;

    // 确保 session 被保存
    typedReq.session.save((error: Error | null) => {
      if (error) {
        console.error('Session save error:', error);
        res.status(500).json({ message: 'Failed to save session' });
        return;
      }

      console.log('Session after login:', {
        id: typedReq.sessionID,
        user: typedReq.session.user
      });
      console.log('User after login:', typedReq.user);
    
      res.json({ 
        message: 'Login successful',
        role: user.role,
        redirect: `/dashboard/${user.role.toLowerCase()}`,
        user: {
          id: user.id.toString(), // 确保返回的 ID 也是字符串
          email: user.email,
          name: user.name,
          role: user.role,
          managing: user.managing
        }
      });
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
