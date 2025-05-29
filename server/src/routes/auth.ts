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
import { Router, Request, Response, NextFunction } from 'express';
import { getPrisma } from '../../database';
import { AuthenticatedRequest } from '../types/custom';

const router = Router();
const prisma = getPrisma();

const loginHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  console.log('Login request received - Body:', req.body);
  console.log('Session before login:', req.session);
  
  const { email, password } = req.body;
  
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

    console.log('User search result:', user ? {
      ...user,
      password: '******',
      managing: user.managing.length
    } : 'Not found');

    if (!user) {
      console.log('No user found with email:', email);
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    if (user.password !== password) {
      console.log('Password mismatch');
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    console.log('Login successful for:', email, 'with role:', user.role);
    
    // 设置 session
    req.session.user = {
      id: user.id,
      role: user.role
    };

    // 确保 session 被保存
    req.session.save((error: Error | null) => {
      if (error) {
        console.error('Session save error:', error);
        res.status(500).json({ message: 'Failed to save session' });
        return;
      }

      console.log('Session after login:', req.session);
    
      res.json({ 
        message: 'Login successful',
        role: user.role,
        redirect: `/dashboard/${user.role.toLowerCase()}`,
        user: {
          id: user.id,
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
const testUsersHandler = async (
  req: Request,
  res: Response
) => {
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
    
    console.log('All users:', users);
    res.json({ users });
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
