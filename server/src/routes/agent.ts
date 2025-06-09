import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { getPrisma } from '../../database';
import { authenticateAgent } from '../middleware/auth';
import { AuthenticatedRequest } from '../types/custom';

const router = Router();
const prisma = getPrisma();

interface Client {
  id: string;
  name?: string | null;
  email?: string;
  role?: string;
  createdAt?: Date;
}

// 获取仪表板统计数据
const getDashboardStats: RequestHandler = async (req, res, next) => {
  const typedReq = req as AuthenticatedRequest;
  try {
    const agentId = typedReq.user?.id;
    if (!agentId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const managedClients = await prisma.user.findMany({
      where: {
        managerId: agentId,
        role: {
          in: ['SELLER', 'BUYER']
        }
      },
      select: {
        id: true,
      },
    });

    if (!managedClients.length) {
      // 如果没有管理的客户，返回空统计
      res.json({
        stats: {
          totalActiveListings: 0,
          totalUnderContract: 0,
          newListingsThisMonth: 0,
          totalNDA: 0,
          totalClosedDeals: 0,
        },
        message: 'No clients found for this agent',
      });
      return;
    }

    const clientIds = managedClients.map((client: { id: string }) => client.id);

    const [activeListings, underContract, newListings, ndaCount, closedDeals] =
      await Promise.all([
        prisma.listing.count({
          where: {
            sellerId: { in: clientIds },
            status: 'ACTIVE',
          },
        }),
        prisma.listing.count({
          where: {
            sellerId: { in: clientIds },
            status: 'UNDER_CONTRACT',
          },
        }),
        prisma.listing.count({
          where: {
            sellerId: { in: clientIds },
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
          },
        }),
        prisma.document.count({
          where: {
            type: 'NDA',
          },
        }),
        prisma.listing.count({
          where: {
            sellerId: { in: clientIds },
            status: 'CLOSED',
            createdAt: {
              gte: new Date(new Date().getFullYear(), 0, 1),
            },
          },
        }),
      ]);

    res.json({
      stats: {
        totalActiveListings: activeListings,
        totalUnderContract: underContract,
        newListingsThisMonth: newListings,
        totalNDA: ndaCount,
        totalClosedDeals: closedDeals,
      },
      message: 'Dashboard stats retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

// 获取代理管理的客户列表
const getClients: RequestHandler = async (req, res, next) => {
  const typedReq = req as AuthenticatedRequest;
  try {
    const agentId = typedReq.user?.id;
    if (!agentId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const clients = await prisma.user.findMany({
      where: {
        managerId: agentId,
        role: {
          in: ['SELLER', 'BUYER']
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    res.json({
      clients,
      message: 'Clients retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

// 获取代理相关的所有房源列表
const getListings: RequestHandler = async (req, res, next) => {
  const typedReq = req as AuthenticatedRequest;
  try {
    const agentId = typedReq.user?.id;
    if (!agentId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // 获取代理管理的所有客户ID
    const managedClients = await prisma.user.findMany({
      where: {
        managerId: agentId,
        role: {
          in: ['SELLER', 'BUYER']
        }
      },
      select: {
        id: true,
      },
    });

    const clientIds = managedClients.map((client: { id: string }) => client.id);

    // 获取与这些客户相关的所有房源
    const listings = await prisma.listing.findMany({
      where: {
        OR: [
          { sellerId: { in: clientIds } },  // 卖家的房源
          { buyers: { some: { id: { in: clientIds } } } }  // 买家感兴趣的房源
        ]
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        buyers: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      listings,
      message: 'Listings retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

router.get('/dashboard', authenticateAgent, getDashboardStats);
router.get('/clients', authenticateAgent, getClients);
router.get('/listings', authenticateAgent, getListings);

export default router; 