import { Router, RequestHandler } from 'express';
import { getPrisma } from '../../database';
import { authenticateAgent } from '../middleware/auth';
import { AuthenticatedRequest } from '../types/custom';

const router = Router();
const prisma = getPrisma();

// 获取 agent 仪表盘数据
const getDashboardStats: RequestHandler = async (req, res, next) => {
  const typedReq = req as AuthenticatedRequest;
  try {
    const agentId = typedReq.user?.id;
    if (!agentId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    // 获取该 agent 管理的所有 seller
    const sellers = await prisma.user.findMany({
      where: {
        managedBy: { id: agentId },
        role: 'SELLER'
      },
      select: { id: true }
    });
    
    const sellerIds = sellers.map((seller: { id: string }) => seller.id);

    const [
      activeListings,
      underContract,
      newListings,
      ndaCount,
      closedDeals
    ] = await Promise.all([
      // 活跃房源数
      prisma.listing.count({
        where: {
          sellerId: { in: sellerIds },
          status: 'ACTIVE'
        }
      }),
      // 正在交易的房源数
      prisma.listing.count({
        where: {
          sellerId: { in: sellerIds },
          status: 'UNDER_CONTRACT'
        }
      }),
      // 本月新增房源数
      prisma.listing.count({
        where: {
          sellerId: { in: sellerIds },
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }),
      // NDA 数量
      prisma.document.count({
        where: {
          type: 'NDA',
          sellerId: { in: sellerIds }
        }
      }),
      // 今年完成的交易数
      prisma.listing.count({
        where: {
          sellerId: { in: sellerIds },
          status: 'CLOSED',
          createdAt: {
            gte: new Date(new Date().getFullYear(), 0, 1)
          }
        }
      })
    ]);

    res.json({
      stats: {
        totalActiveListings: activeListings,
        totalUnderContract: underContract,
        newListingsThisMonth: newListings,
        totalNDA: ndaCount,
        totalClosedDeals: closedDeals
      }
    });
  } catch (error) {
    next(error);
  }
};

// 获取 agent 的房源列表
const getListings: RequestHandler = async (req, res, next) => {
  const typedReq = req as AuthenticatedRequest;
  try {
    const agentId = typedReq.user?.id;
    if (!agentId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    // 首先获取该 agent 管理的所有 seller
    const sellers = await prisma.user.findMany({
      where: {
        managedBy: { id: agentId },
        role: 'SELLER'
      },
      select: { id: true }
    });
    
    const sellerIds = sellers.map((seller: { id: string }) => seller.id);
    
    const listings = await prisma.listing.findMany({
      where: {
        sellerId: { in: sellerIds }
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true
          }
        },
        buyers: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.json({ listings });
  } catch (error) {
    next(error);
  }
};

// 获取 agent 的卖家列表
const getSellers: RequestHandler = async (req, res, next) => {
  const typedReq = req as AuthenticatedRequest;
  try {
    const agentId = typedReq.user?.id;
    if (!agentId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const sellers = await prisma.user.findMany({
      where: {
        managedBy: { id: agentId },
        role: 'SELLER'
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
            status: true
          }
        }
      }
    });

    res.json({ sellers });
  } catch (error) {
    next(error);
  }
};

// 获取 agent 的买家列表
const getBuyers: RequestHandler = async (req, res, next) => {
  const typedReq = req as AuthenticatedRequest;
  try {
    const agentId = typedReq.user?.id;
    if (!agentId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const buyers = await prisma.user.findMany({
      where: {
        managedBy: { id: agentId },
        role: 'BUYER'
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
            status: true
          }
        }
      }
    });

    res.json({ buyers });
  } catch (error) {
    next(error);
  }
};

router.get('/dashboard', authenticateAgent, getDashboardStats);
router.get('/listings', authenticateAgent, getListings);
router.get('/sellers', authenticateAgent, getSellers);
router.get('/buyers', authenticateAgent, getBuyers);

export default router; 