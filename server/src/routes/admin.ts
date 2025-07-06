import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { getPrisma } from '../../database';
import { authenticateBroker } from '../middleware/auth';
import { AuthenticatedRequest } from '../types/custom';

const router = Router();
const prisma = getPrisma();

// 获取所有用户（包括账号密码）
const getAllUsersForAdmin: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const typedReq = req as AuthenticatedRequest;
  
  try {
    if (!typedReq.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        password: true,  // 注意：生产环境中应该考虑安全性
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        managing: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true
          }
        }
      },
      orderBy: [
        { isActive: 'desc' },
        { role: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    res.json({ users });
  } catch (error) {
    console.error('Error in getAllUsersForAdmin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 创建新用户
const createUser: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const typedReq = req as AuthenticatedRequest;
  
  try {
    if (!typedReq.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { email, password, name, role } = typedReq.body;

    if (!email || !password || !role) {
      res.status(400).json({ error: 'Email, password, and role are required' });
      return;
    }

    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      res.status(409).json({ error: 'User with this email already exists' });
      return;
    }

    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password,
        name: name || '',
        role: role.toUpperCase(),
        isActive: true
      },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.status(201).json({ user: newUser });
  } catch (error) {
    console.error('Error in createUser:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 更新用户信息
const updateUser: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const typedReq = req as AuthenticatedRequest;
  
  try {
    if (!typedReq.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { userId } = typedReq.params;
    const { email, password, name, role, isActive } = typedReq.body;

    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    // 检查用户是否存在
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // 如果要更新邮箱，检查新邮箱是否已被其他用户使用
    if (email && email.toLowerCase() !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      });

      if (emailExists) {
        res.status(409).json({ error: 'Email already in use by another user' });
        return;
      }
    }

    // 准备更新数据
    const updateData: any = {};
    if (email) updateData.email = email.toLowerCase();
    if (password) updateData.password = password;
    if (name !== undefined) updateData.name = name;
    if (role) updateData.role = role.toUpperCase();
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({ user: updatedUser });
  } catch (error) {
    console.error('Error in updateUser:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 归档/停用用户
const archiveUser: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const typedReq = req as AuthenticatedRequest;
  
  try {
    if (!typedReq.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { userId } = typedReq.params;

    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    // 先检查用户是否存在
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (!existingUser.isActive) {
      res.status(400).json({ error: 'User is already archived' });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        updatedAt: true
      }
    });

    res.json({ user: updatedUser });
  } catch (error) {
    console.error('Error in archiveUser:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 重新激活用户
const reactivateUser: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const typedReq = req as AuthenticatedRequest;
  
  try {
    if (!typedReq.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { userId } = typedReq.params;

    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    // 先检查用户是否存在
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (existingUser.isActive) {
      res.status(400).json({ error: 'User is already active' });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isActive: true },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        updatedAt: true
      }
    });

    res.json({ user: updatedUser });
  } catch (error) {
    console.error('Error in reactivateUser:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 获取用户统计信息
const getUserStats: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const typedReq = req as AuthenticatedRequest;
  
  try {
    if (!typedReq.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const [totalUsers, activeUsers, inactiveUsers, roleStats] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({ where: { isActive: false } }),
      prisma.user.groupBy({
        by: ['role'],
        _count: { role: true }
      })
    ]);

    const stats = {
      totalUsers,
      activeUsers,
      inactiveUsers,
      roleDistribution: roleStats.reduce((acc: Record<string, number>, stat: any) => {
        acc[stat.role] = stat._count.role;
        return acc;
      }, {} as Record<string, number>)
    };

    res.json({ stats });
  } catch (error) {
    console.error('Error in getUserStats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 路由定义 - 所有路由都需要broker权限
router.get('/users', authenticateBroker, getAllUsersForAdmin);
router.post('/users', authenticateBroker, createUser);
router.put('/users/:userId', authenticateBroker, updateUser);
router.patch('/users/:userId/archive', authenticateBroker, archiveUser);
router.patch('/users/:userId/reactivate', authenticateBroker, reactivateUser);
router.get('/stats', authenticateBroker, getUserStats);

export default router; 