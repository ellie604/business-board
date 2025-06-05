import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { getPrisma } from '../../database';
import { authenticateUser } from '../middleware/auth';
import { AuthenticatedRequest } from '../types/custom';

const router = Router();
const prisma = getPrisma();

// Get all users
const getAllUsers: RequestHandler = async (req, res, next): Promise<void> => {
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
    res.json(users);
    return;
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    next(error);
    return;
  }
};

router.get('/', authenticateUser, getAllUsers);

export default router; 