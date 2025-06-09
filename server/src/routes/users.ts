import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { getPrisma } from '../../database';
import { authenticateUser, authenticateBroker } from '../middleware/auth';
import { AuthenticatedRequest } from '../types/custom';

const router = Router();
const prisma = getPrisma();

// Get users by role (for broker)
const getUsersByRole: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const typedReq = req as AuthenticatedRequest;
  try {
    const { role } = req.query;
    console.log('Fetching users with role:', role);
    console.log('Current user:', typedReq.user);

    if (!typedReq.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!role) {
      res.status(400).json({ error: 'Role parameter is required' });
      return;
    }

    const users = await prisma.user.findMany({
      where: { 
        role: role.toString().toUpperCase(),
        NOT: {
          id: typedReq.user.id // Exclude current user
        }
      },
      select: { 
        id: true, 
        name: true,
        email: true,
        role: true
      }
    });

    console.log(`Found ${users.length} users with role ${role}`);
    res.json({ users });
  } catch (err) {
    console.error('Error in getUsersByRole:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all users (for general use)
const getAllUsers: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const typedReq = req as AuthenticatedRequest;
  console.log('Getting all users - Session:', typedReq.session);
  console.log('User from request:', typedReq.user);
  
  try {
    if (!typedReq.user) {
      console.log('No user found in request');
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    console.log('Fetching users for authenticated user:', typedReq.user.id);
    const users = await prisma.user.findMany({
      where: {
        NOT: {
          id: typedReq.user.id // Exclude current user
        }
      },
      select: {
        id: true,
        name: true,
        role: true,
        email: true
      },
      orderBy: {
        role: 'asc'
      }
    });

    console.log('Found users:', users);
    res.json({ users });
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 使用 authenticateUser 中间件，因为这些端点对所有已认证用户开放
router.get('/by-role', authenticateUser, getUsersByRole);
router.get('/', authenticateUser, getAllUsers);

export default router; 