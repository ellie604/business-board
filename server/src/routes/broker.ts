import { Router, RequestHandler } from 'express';
import { getPrisma } from '../../database';
import { authenticateBroker } from '../middleware/auth';
import { AuthenticatedRequest } from '../types/custom';

const router = Router();
const prisma = getPrisma();

// 获取仪表板统计数据
const getDashboardStats: RequestHandler = async (req: AuthenticatedRequest, res, next) => {
  try {
    const brokerId = req.user?.id;
    if (!brokerId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const managedAgents = await prisma.user.findMany({
      where: {
        managerId: brokerId,
        role: 'AGENT',
      },
      select: {
        id: true,
      },
    });

    const agentIds = managedAgents.map((agent: { id: string }) => agent.id);

    const [activeListings, underContract, newListings, ndaCount, closedDeals] =
      await Promise.all([
        prisma.listing.count({
          where: {
            sellerId: { in: agentIds },
            status: 'ACTIVE',
          },
        }),
        prisma.listing.count({
          where: {
            sellerId: { in: agentIds },
            status: 'UNDER_CONTRACT',
          },
        }),
        prisma.listing.count({
          where: {
            sellerId: { in: agentIds },
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
            sellerId: { in: agentIds },
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

// 获取经纪人管理的代理列表
const getAgents: RequestHandler = async (req: AuthenticatedRequest, res, next) => {
  try {
    const brokerId = req.user?.id;
    if (!brokerId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const agents = await prisma.user.findMany({
      where: {
        managerId: brokerId,
        role: 'AGENT',
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    res.json({
      agents,
      message: 'Agents retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

// 无需类型断言了
router.get('/dashboard', authenticateBroker, getDashboardStats);
router.get('/agents', authenticateBroker, getAgents);

export default router;
