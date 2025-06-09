import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { getPrisma } from '../../database';
import { authenticateBroker } from '../middleware/auth';
import { AuthenticatedRequest } from '../types/custom';

const router = Router();
const prisma = getPrisma();

interface Agent {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  status: string;
  sellerId: string;
}

// 获取仪表板统计数据
const getDashboardStats: RequestHandler = async (req, res, next) => {
  const typedReq = req as AuthenticatedRequest;
  try {
    const brokerId = typedReq.user?.id;
    if (!brokerId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // 1. 获取所有代理
    const managedAgents = await prisma.user.findMany({
      where: {
        managerId: brokerId,
        role: 'AGENT',
      },
      select: {
        id: true,
      },
    });

    // 2. 获取这些代理管理的所有卖家
    const sellers = await prisma.user.findMany({
      where: {
        managerId: {
          in: managedAgents.map((agent: { id: string }) => agent.id)
        },
        role: 'SELLER'
      },
      select: {
        id: true
      }
    });

    const sellerIds = sellers.map((seller: { id: string }) => seller.id);

    // 3. 统计这些卖家的房源
    const [activeListings, underContract, newListings, ndaCount, closedDeals] =
      await Promise.all([
        prisma.listing.count({
          where: {
            sellerId: { in: sellerIds },
            status: 'ACTIVE',
          },
        }),
        prisma.listing.count({
          where: {
            sellerId: { in: sellerIds },
            status: 'UNDER_CONTRACT',
          },
        }),
        prisma.listing.count({
          where: {
            sellerId: { in: sellerIds },
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
            sellerId: { in: sellerIds },
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
const getAgents: RequestHandler = async (req, res, next) => {
  const typedReq = req as AuthenticatedRequest;
  try {
    const brokerId = typedReq.user?.id;
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

// 获取代理列表及其统计数据
const getAgentsWithStats: RequestHandler = async (req, res, next) => {
  const typedReq = req as AuthenticatedRequest;
  try {
    const brokerId = typedReq.user?.id;
    if (!brokerId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // 获取所有代理
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

    // 为每个代理获取统计数据
    const agentsWithStats = await Promise.all(
      agents.map(async (agent: Agent) => {
        // 获取代理管理的所有客户
        const managedClients = await prisma.user.findMany({
          where: {
            managerId: agent.id,
            role: {
              in: ['SELLER', 'BUYER']
            }
          },
          select: {
            id: true,
          },
        });

        const clientIds = managedClients.map((client: { id: string }) => client.id);

        // 获取统计数据
        const [numberOfListings, numberUnderContract, closingsToDate] = await Promise.all([
          // 总房源数 - 只统计代理管理的卖家的房源
          prisma.listing.findMany({
            where: {
              sellerId: { in: clientIds }
            },
            distinct: ['id'],
          }).then((listings: Listing[]) => listings.length),
          // 正在交易中的房源数
          prisma.listing.findMany({
            where: {
              sellerId: { in: clientIds },
              status: 'UNDER_CONTRACT'
            },
            distinct: ['id'],
          }).then((listings: Listing[]) => listings.length),
          // 已完成交易的房源数
          prisma.listing.findMany({
            where: {
              sellerId: { in: clientIds },
              status: 'CLOSED'
            },
            distinct: ['id'],
          }).then((listings: Listing[]) => listings.length)
        ]);

        return {
          ...agent,
          stats: {
            numberOfListings,
            numberUnderContract,
            closingsToDate
          }
        };
      })
    );

    res.json({
      agents: agentsWithStats,
      message: 'Agents with stats retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

// 删除代理
const deleteAgent: RequestHandler = async (req, res, next) => {
  const typedReq = req as AuthenticatedRequest;
  try {
    const brokerId = typedReq.user?.id;
    const agentId = req.params.agentId;

    if (!brokerId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // 验证代理是否属于该经纪人
    const agent = await prisma.user.findFirst({
      where: {
        id: agentId,
        managerId: brokerId,
        role: 'AGENT'
      }
    });

    if (!agent) {
      res.status(404).json({ message: 'Agent not found or not managed by this broker' });
      return;
    }

    // 删除代理
    await prisma.user.delete({
      where: {
        id: agentId
      }
    });

    res.json({
      message: 'Agent deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// 获取单个代理的统计数据
const getAgentStats: RequestHandler = async (req, res, next) => {
  const typedReq = req as AuthenticatedRequest;
  try {
    const brokerId = typedReq.user?.id;
    const agentId = req.params.agentId;

    if (!brokerId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // 验证代理是否属于该经纪人
    const agent = await prisma.user.findFirst({
      where: {
        id: agentId,
        managerId: brokerId,
        role: 'AGENT'
      }
    });

    if (!agent) {
      res.status(404).json({ message: 'Agent not found or not managed by this broker' });
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

    // 获取统计数据
    const [numberOfListings, numberUnderContract, closingsToDate] = await Promise.all([
      // 总房源数 - 只统计代理管理的卖家的房源
      prisma.listing.findMany({
        where: {
          sellerId: { in: clientIds }
        },
        distinct: ['id'],
      }).then((listings: Listing[]) => listings.length),
      // 正在交易中的房源数
      prisma.listing.findMany({
        where: {
          sellerId: { in: clientIds },
          status: 'UNDER_CONTRACT'
        },
        distinct: ['id'],
      }).then((listings: Listing[]) => listings.length),
      // 已完成交易的房源数
      prisma.listing.findMany({
        where: {
          sellerId: { in: clientIds },
          status: 'CLOSED'
        },
        distinct: ['id'],
      }).then((listings: Listing[]) => listings.length)
    ]);

    res.json({
      stats: {
        numberOfListings,
        numberUnderContract,
        closingsToDate
      },
      message: 'Agent stats retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get all sellers with their listings
const getSellers: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const typedReq = req as AuthenticatedRequest;
  try {
    if (!typedReq.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const sellers = await prisma.user.findMany({
      where: { 
        role: 'SELLER',
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        listings: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            status: true,
            createdAt: true,
          }
        }
      }
    });

    res.json({ sellers });
  } catch (err) {
    console.error('Error in getSellers:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all buyers with their interested listings
const getBuyers: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const typedReq = req as AuthenticatedRequest;
  try {
    if (!typedReq.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const buyers = await prisma.user.findMany({
      where: { 
        role: 'BUYER',
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        buyingListings: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            status: true,
            createdAt: true,
          }
        }
      }
    });

    res.json({ buyers });
  } catch (err) {
    console.error('Error in getBuyers:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

router.get('/sellers', authenticateBroker, getSellers);
router.get('/buyers', authenticateBroker, getBuyers);
router.get('/dashboard', authenticateBroker, getDashboardStats);
router.get('/agents', authenticateBroker, getAgents);
router.get('/agents-with-stats', authenticateBroker, getAgentsWithStats);
router.delete('/agent/:agentId', authenticateBroker, deleteAgent);
router.get('/agent/:agentId/stats', authenticateBroker, getAgentStats);

export default router;
