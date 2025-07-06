import { Router, Request, Response, NextFunction } from 'express';
import { getPrisma } from '../../database';
import { authenticateBroker } from '../middleware/auth';
import { AuthenticatedRequest, User } from '../types/custom.d';

const router = Router();
// 移除模块级别的 prisma 初始化
// const prisma = getPrisma();
// type PrismaType = typeof prisma;

interface ListingFromDB {
  id: string;
  title: string;
  description: string;
  price: number;
  status: string;
  seller: {
    id: string;
    name: string;
    managedBy?: {
      id: string;
      name: string;
    };
  };
  buyers: Array<{
    id: string;
    name: string;
  }>;
}

interface DbUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

// 获取所有 listing
router.get('/', authenticateBroker, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const typedReq = req as AuthenticatedRequest;
  try {
    console.log('Fetching listings... User:', typedReq.user);
    
    if (!typedReq.user) {
      console.log('No user found in request');
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    // 在函数内部获取 prisma 实例
    const prisma = getPrisma();

    // 获取经纪人管理的所有代理
    const managedAgents = await prisma.user.findMany({
      where: {
        managerId: typedReq.user.id,
        role: 'AGENT'
      }
    });

    console.log('Managed agents:', managedAgents);

    // 获取所有 listings
    const listings = await prisma.listing.findMany({
      include: {
        seller: {
          include: {
            managedBy: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        buyers: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('Listings fetched:', listings.length);

    // 转换响应格式，添加 agent 信息
    const formattedListings = listings.map((listing: any) => ({
      ...listing,
      agent: listing.seller.managedBy ? {
        id: listing.seller.managedBy.id,
        name: listing.seller.managedBy.name
      } : null,
      seller: {
        id: listing.seller.id,
        name: listing.seller.name
      }
    }));

    res.json({ listings: formattedListings });
  } catch (err) {
    console.error('Error fetching listings:', err);
    res.status(500).json({ 
      message: 'Failed to fetch listings',
      error: err instanceof Error ? err.message : 'Unknown error'
    });
  }
});

// 新增 listing
router.post('/', authenticateBroker, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const typedReq = req as AuthenticatedRequest;
  try {
    if (!typedReq.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    // 在函数内部获取 prisma 实例
    const prisma = getPrisma();

    const { title, description, price, status, sellerId, buyerIds, agentId } = req.body;
    console.log('Creating listing with data:', { title, description, price, status, sellerId, buyerIds, agentId });

    // 验证必填字段
    if (!title || !description || !price || !status || !sellerId) {
      res.status(400).json({ 
        message: 'Missing required fields: title, description, price, status, sellerId are required' 
      });
      return;
    }

    // 验证并转换价格
    const numericPrice = parseFloat(price.toString().replace(/[^0-9.]/g, ''));
    if (isNaN(numericPrice)) {
      res.status(400).json({ message: 'Invalid price format' });
      return;
    }

    // 验证状态
    const validStatuses = ['ACTIVE', 'UNDER_CONTRACT', 'CLOSED'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ message: 'Invalid status' });
      return;
    }

    // 验证卖家
    const seller = await prisma.user.findUnique({
      where: { id: sellerId },
      include: { managedBy: true }
    });

    if (!seller) {
      res.status(400).json({ message: 'Invalid seller ID' });
      return;
    }

    if (seller.role !== 'SELLER') {
      res.status(400).json({ message: 'Selected user is not a seller' });
      return;
    }

    // 验证代理
    if (agentId) {
      const agent = await prisma.user.findUnique({
        where: { id: agentId }
      });

      if (!agent) {
        res.status(400).json({ message: 'Invalid agent ID' });
        return;
      }

      if (agent.role !== 'AGENT') {
        res.status(400).json({ message: 'Selected user is not an agent' });
        return;
      }

      if (agent.managerId !== typedReq.user.id) {
        res.status(403).json({ message: 'You do not have permission to assign this agent' });
        return;
      }
    }

    // 验证买家
    if (buyerIds && buyerIds.length > 0) {
      const buyers = await prisma.user.findMany({
        where: { 
          id: { in: buyerIds },
          role: 'BUYER'
        }
      });

      if (buyers.length !== buyerIds.length) {
        res.status(400).json({ message: 'One or more invalid buyer IDs' });
        return;
      }
    }

    // 开始事务
    const listing = await prisma.$transaction(async (tx: typeof prisma) => {
      // 如果提供了 agentId，先更新卖家的 managedBy
      if (agentId) {
        await tx.user.update({
          where: { id: sellerId },
          data: { managerId: agentId }
        });

        // 如果有买家，更新买家的 managedBy
        if (buyerIds && buyerIds.length > 0) {
          await tx.user.updateMany({
            where: { id: { in: buyerIds } },
            data: { managerId: agentId }
          });
        }
      }

      // 创建 listing
      const newListing = await tx.listing.create({
        data: {
          title,
          description,
          price: numericPrice,
          status,
          sellerId,
          buyers: {
            connect: buyerIds?.map((id: string) => ({ id })) || []
          }
        },
        include: {
          seller: {
            include: {
              managedBy: {
                select: {
                  id: true,
                  name: true
                }
              }
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

      return newListing;
    });

    // 格式化响应
    const formattedListing = {
      ...listing,
      agent: listing.seller.managedBy ? {
        id: listing.seller.managedBy.id,
        name: listing.seller.managedBy.name
      } : null,
      seller: {
        id: listing.seller.id,
        name: listing.seller.name
      }
    };

    console.log('Created listing:', formattedListing);
    res.json({ listing: formattedListing });
  } catch (err) {
    console.error('Error creating listing:', err);
    res.status(500).json({ 
      message: 'Failed to create listing',
      error: err instanceof Error ? err.message : 'Unknown error'
    });
  }
});

// 编辑 listing
router.put('/:id', authenticateBroker, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // 在函数内部获取 prisma 实例
    const prisma = getPrisma();

    const { title, description, price, status, sellerId, buyerIds, agentId } = req.body;
    console.log('Updating listing with data:', { id: req.params.id, title, description, price, status, sellerId, buyerIds, agentId });

    // 验证必填字段
    if (!title || !description || !price || !status || !sellerId) {
      res.status(400).json({ 
        message: 'Missing required fields: title, description, price, status, sellerId are required' 
      });
      return;
    }

    // 验证并转换价格
    const numericPrice = parseFloat(price.toString().replace(/[^0-9.]/g, ''));
    if (isNaN(numericPrice)) {
      res.status(400).json({ message: 'Invalid price format' });
      return;
    }

    // 验证状态
    const validStatuses = ['ACTIVE', 'UNDER_CONTRACT', 'CLOSED'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ message: 'Invalid status' });
      return;
    }

    // 开始事务
    const listing = await prisma.$transaction(async (tx: typeof prisma) => {
      // 更新 listing
      const updatedListing = await tx.listing.update({
        where: { id: req.params.id },
        data: {
          title,
          description,
          price: numericPrice,
          status,
          sellerId,
          buyers: {
            set: buyerIds?.map((id: string) => ({ id })) || []
          }
        },
        include: {
          seller: true,
          buyers: true
        }
      });

      // 如果提供了 agentId，更新相关用户的 managedBy
      if (agentId) {
        // 更新卖家的 managedBy
        await tx.user.update({
          where: { id: sellerId },
          data: { managerId: agentId }
        });

        // 如果有买家，更新买家的 managedBy
        if (buyerIds && buyerIds.length > 0) {
          await tx.user.updateMany({
            where: { id: { in: buyerIds } },
            data: { managerId: agentId }
          });
        }
      } else {
        // 如果没有提供 agentId，清除相关用户的 managedBy
        await tx.user.update({
          where: { id: sellerId },
          data: { managerId: null }
        });

        if (buyerIds && buyerIds.length > 0) {
          await tx.user.updateMany({
            where: { id: { in: buyerIds } },
            data: { managerId: null }
          });
        }
      }

      return updatedListing;
    });

    console.log('Updated listing:', listing);
    res.json({ listing });
  } catch (err) {
    console.error('Error updating listing:', err);
    res.status(500).json({ 
      message: 'Failed to update listing',
      error: err instanceof Error ? err.message : 'Unknown error'
    });
  }
});

// 归档 listing (软删除 - 设置为INACTIVE状态)
router.patch('/:id/archive', authenticateBroker, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const listingId = req.params.id;
    
    // 在函数内部获取 prisma 实例
    const prisma = getPrisma();
    
    // 先检查listing是否存在
    const existingListing = await prisma.listing.findUnique({
      where: { id: listingId }
    });

    if (!existingListing) {
      res.status(404).json({ message: 'Listing not found' });
      return;
    }

    if (existingListing.status === 'INACTIVE') {
      res.status(400).json({ message: 'Listing is already archived' });
      return;
    }

    const updatedListing = await prisma.listing.update({
      where: { id: listingId },
      data: { status: 'INACTIVE' },
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
      }
    });

    res.json({ 
      message: 'Listing archived successfully',
      listing: updatedListing
    });
  } catch (err) {
    console.error('Error archiving listing:', err);
    next(err);
  }
});

// 重新激活 listing
router.patch('/:id/reactivate', authenticateBroker, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const listingId = req.params.id;
    
    // 在函数内部获取 prisma 实例
    const prisma = getPrisma();
    
    // 先检查listing是否存在
    const existingListing = await prisma.listing.findUnique({
      where: { id: listingId }
    });

    if (!existingListing) {
      res.status(404).json({ message: 'Listing not found' });
      return;
    }

    if (existingListing.status !== 'INACTIVE') {
      res.status(400).json({ message: 'Listing is not archived' });
      return;
    }

    const updatedListing = await prisma.listing.update({
      where: { id: listingId },
      data: { status: 'ACTIVE' },
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
      }
    });

    res.json({ 
      message: 'Listing reactivated successfully',
      listing: updatedListing
    });
  } catch (err) {
    console.error('Error reactivating listing:', err);
    next(err);
  }
});

// 删除 listing (保留原有功能，但改为真正的删除)
router.delete('/:id', authenticateBroker, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // 在函数内部获取 prisma 实例
    const prisma = getPrisma();
    
    await prisma.listing.delete({ where: { id: req.params.id } });
    res.json({ message: 'Listing deleted permanently' });
  } catch (err) {
    console.error('Error deleting listing:', err);
    next(err);
  }
});

export default router; 