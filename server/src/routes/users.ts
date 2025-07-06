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

// Get all users (for general use) - 实现基于角色的权限控制
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

    console.log('Fetching users for authenticated user:', typedReq.user.id, 'with role:', typedReq.user.role);

    let whereCondition: any = {
      NOT: {
        id: typedReq.user.id // 排除当前用户自己
      },
      isActive: true // 只显示活跃用户
    };

    // 根据用户角色设置不同的权限
    switch (typedReq.user.role) {
      case 'BROKER':
        // BROKER可以联系除自己以外的任何用户
        // whereCondition 已经设置了排除自己，无需额外限制
        break;

      case 'AGENT':
        // AGENT只能联系：
        // 1. BROKER
        // 2. 分配给自己的 sellers 和 buyers
        whereCondition = {
          AND: [
            {
              NOT: {
                id: typedReq.user.id
              }
            },
            {
              isActive: true
            },
            {
              OR: [
                // 可以联系所有 BROKER
                { role: 'BROKER' },
                // 可以联系分配给自己的 sellers 和 buyers
                { managerId: typedReq.user.id }
              ]
            }
          ]
        };
        break;

      case 'SELLER':
        // SELLER只能联系：
        // 1. BROKER 
        // 2. 管理自己的 AGENT
        whereCondition = {
          AND: [
            {
              NOT: {
                id: typedReq.user.id
              }
            },
            {
              isActive: true
            },
            {
              OR: [
                // 可以联系所有 BROKER
                { role: 'BROKER' },
                // 可以联系管理自己的 AGENT（如果有的话）
                ...(typedReq.user.managerId ? [{ id: typedReq.user.managerId }] : [])
              ]
            }
          ]
        };
        break;

      case 'BUYER':
        // BUYER只能联系：
        // 1. 所有的BROKER
        // 2. 负责其当前选中listing的特定AGENT
        
        // 获取buyer的当前选中listing信息
        const buyerProgress = await prisma.buyerProgress.findFirst({
          where: { buyerId: typedReq.user.id },
          include: {
            selectedListing: {
              include: {
                seller: {
                  select: {
                    managerId: true  // 获取seller的管理员（agent）ID
                  }
                }
              }
            }
          }
        });
        
        const listingAgentId = buyerProgress?.selectedListing?.seller?.managerId;
        
        whereCondition = {
          AND: [
            {
              NOT: {
                id: typedReq.user.id
              }
            },
            {
              isActive: true
            },
            {
              OR: [
                // 可以联系所有 BROKER
                { role: 'BROKER' },
                // 只能联系负责其选中listing的特定AGENT
                ...(listingAgentId ? [{ id: listingAgentId }] : [])
              ]
            }
          ]
        };
        break;

      default:
        // 未知角色，只能联系 BROKER
        whereCondition.role = 'BROKER';
        break;
    }

    const users = await prisma.user.findMany({
      where: whereCondition,
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

    console.log(`Found ${users.length} users accessible to ${typedReq.user.role}:`, typedReq.user.id);
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