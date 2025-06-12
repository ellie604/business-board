import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { getPrisma } from '../../database';
import { authenticateBroker } from '../middleware/auth';
import { AuthenticatedRequest } from '../types/custom';
import multer from 'multer';
import { supabase, getStorageBucket } from '../config/supabase';

const router = Router();
const prisma = getPrisma();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only allow PDF, DOC, DOCX files
    if (file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/msword' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
    }
  }
});

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

// 获取listing的broker提供的文件
router.get('/listings/:listingId/documents', authenticateBroker, async (req, res): Promise<void> => {
  try {
    const { listingId } = req.params;
    
    const documents = await prisma.document.findMany({
      where: {
        listingId,
        category: 'AGENT_PROVIDED'
      },
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        buyer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: [
        {
          uploader: {
            role: 'desc' // BROKER first, then AGENT
          }
        },
        {
          type: 'asc' // Then by document type
        },
        {
          createdAt: 'desc' // Finally by creation time (newest first)
        }
      ]
    });

    res.json({ documents });
  } catch (error: unknown) {
    console.error('Error fetching broker documents:', error);
    res.status(500).json({ 
      message: 'Failed to fetch documents',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// broker为listing上传文件
router.post('/listings/:listingId/documents', upload.single('file'), authenticateBroker, async (req, res): Promise<void> => {
  try {
    const { listingId } = req.params;
    const { documentType, buyerId, description } = req.body;
    const typedReq = req as AuthenticatedRequest;
    const file = req.file;

    if (!file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    if (!typedReq.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // 检查listing是否存在
    const listing = await prisma.listing.findUnique({
      where: { id: listingId }
    });

    if (!listing) {
      res.status(404).json({ message: 'Listing not found' });
      return;
    }

    // 如果指定了buyerId，验证buyer是否存在
    if (buyerId) {
      const buyer = await prisma.user.findFirst({
        where: { 
          id: buyerId, 
          role: 'BUYER' 
        }
      });

      if (!buyer) {
        res.status(404).json({ message: 'Buyer not found' });
        return;
      }
    }

    // 上传文件到Supabase
    const bucketName = getStorageBucket();
    const fileName = `broker-docs/${listingId}/${Date.now()}-${file.originalname}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      res.status(500).json({ message: 'Failed to upload file to storage' });
      return;
    }

    // 获取文件URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    // 创建文档记录
    const document = await prisma.document.create({
      data: {
        type: documentType || 'UPLOADED_DOC',
        category: 'AGENT_PROVIDED',    // broker提供的文件
        fileName: file.originalname,
        fileSize: file.size,
        url: publicUrl,
        listingId,
        sellerId: listing.sellerId,
        buyerId: buyerId || null,       // 可选的buyer关联
        uploadedBy: typedReq.user.id,   // broker上传
        uploadedAt: new Date(),
        status: 'COMPLETED',
        operationType: 'DOWNLOAD'       // 这些文件是供下载用的
      }
    });

    res.json({ 
      message: 'File uploaded successfully',
      document: {
        id: document.id,
        fileName: document.fileName,
        fileSize: document.fileSize,
        type: document.type,
        uploadedAt: document.uploadedAt,
        url: document.url,
        buyerId: document.buyerId
      }
    });
  } catch (error: unknown) {
    console.error('Error uploading broker document:', error);
    res.status(500).json({ 
      message: 'Failed to upload document',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// 删除broker上传的文件
router.delete('/listings/:listingId/documents/:documentId', authenticateBroker, async (req, res): Promise<void> => {
  try {
    const { listingId, documentId } = req.params;
    const typedReq = req as AuthenticatedRequest;

    if (!typedReq.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        listingId,
        category: 'AGENT_PROVIDED',
        uploadedBy: typedReq.user.id
      }
    });

    if (!document) {
      res.status(404).json({ message: 'Document not found or access denied' });
      return;
    }

    // 从Supabase删除文件
    if (document.url) {
      const fileName = document.url.split('/').pop();
      if (fileName) {
        const { error: deleteError } = await supabase.storage
          .from(getStorageBucket())
          .remove([`broker-docs/${listingId}/${fileName}`]);

        if (deleteError) {
          console.error('Supabase delete error:', deleteError);
        }
      }
    }

    // 从数据库删除记录
    await prisma.document.delete({
      where: { id: documentId }
    });

    res.json({ message: 'Document deleted successfully' });
  } catch (error: unknown) {
    console.error('Error deleting broker document:', error);
    res.status(500).json({ 
      message: 'Failed to delete document',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// 获取所有listings（用于broker选择）
router.get('/listings', authenticateBroker, async (req, res): Promise<void> => {
  try {
    const listings = await prisma.listing.findMany({
      include: {
        seller: {
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

    res.json({ listings });
  } catch (error: unknown) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ 
      message: 'Failed to fetch listings',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get seller progress for a specific listing
const getSellerProgress: RequestHandler = async (req, res, next) => {
  const typedReq = req as AuthenticatedRequest;
  try {
    const brokerId = typedReq.user?.id;
    const { listingId } = req.params;
    
    if (!brokerId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // First, get the listing and verify it belongs to a seller managed by this broker's agents
    const listing = await prisma.listing.findFirst({
      where: { id: listingId },
      include: {
        seller: {
          include: {
            managedBy: true // This should be the agent
          }
        }
      }
    });

    if (!listing) {
      res.status(404).json({ message: 'Listing not found' });
      return;
    }

    // Check if the seller's manager (agent) is managed by this broker
    const agent = listing.seller.managedBy;
    if (!agent || agent.managerId !== brokerId) {
      res.status(403).json({ message: 'Access denied - listing not under your management' });
      return;
    }

    // Get seller's progress
    let sellerProgress = await prisma.sellerProgress.findFirst({
      where: { sellerId: listing.sellerId }
    });

    if (!sellerProgress) {
      // Create default progress if none exists - but don't force a selectedListingId
      sellerProgress = await prisma.sellerProgress.create({
        data: {
          sellerId: listing.sellerId,
          currentStep: 0,
          completedSteps: [],
          selectedListingId: null // Don't force the URL listingId - seller must select it themselves
        }
      });
    }

    // Use seller's actual selectedListingId, not the URL listingId
    const actualSelectedListingId = sellerProgress.selectedListingId;
    
    // If seller hasn't selected this specific listing, they may be at step 0 or working on a different listing
    const isViewingSelectedListing = actualSelectedListingId === listingId;

    // Import the step definitions and completion logic from seller routes
    const STEP_DOCUMENT_REQUIREMENTS = {
      0: { type: 'LISTING_SELECTION', operationType: 'NONE', description: 'Select your business listing' },
      1: { type: 'EMAIL_AGENT', operationType: 'BOTH', description: 'Email communication with agent' },
      2: { type: 'LISTING_AGREEMENT', operationType: 'DOWNLOAD', description: 'Download listing agreement' },
      3: { type: 'QUESTIONNAIRE', operationType: 'UPLOAD', description: 'Fill out business questionnaire' },
      4: { type: 'FINANCIAL_DOCUMENTS', operationType: 'UPLOAD', description: 'Upload financial documents' },
      5: { type: 'BUYER_ACTIVITY', operationType: 'NONE', description: 'View buyer activity updates' },
      6: { type: 'PURCHASE_AGREEMENT', operationType: 'DOWNLOAD', description: 'Download purchase contract' },
      7: { type: 'DUE_DILIGENCE', operationType: 'UPLOAD', description: 'Upload due diligence documents' },
      8: { type: 'PRE_CLOSE_CHECKLIST', operationType: 'BOTH', description: 'Complete pre-closing checklist' },
      9: { type: 'CLOSING_DOCS', operationType: 'DOWNLOAD', description: 'Download closing documents' },
      10: { type: 'AFTER_SALE', operationType: 'DOWNLOAD', description: 'Tax mitigation information' }
    };

    const steps = [
      { id: 0, title: 'Select your business listing', completed: false, accessible: true },
      { id: 1, title: 'Email agent', completed: false, accessible: false },
      { id: 2, title: 'Download your listing agreement', completed: false, accessible: false },
      { id: 3, title: 'Fill out your business questionnaire Online', completed: false, accessible: false },
      { id: 4, title: 'Upload your Financial documents', completed: false, accessible: false },
      { id: 5, title: 'Buyer Activity: Up to the minute updates on buyers', completed: false, accessible: false },
      { id: 6, title: 'Download your purchase contract', completed: false, accessible: false },
      { id: 7, title: 'Upload due diligence documents', completed: false, accessible: false },
      { id: 8, title: 'Complete pre-closing checklist', completed: false, accessible: false },
      { id: 9, title: 'Download Closing document once we are closed', completed: false, accessible: false },
      { id: 10, title: 'After the Sale: Learn about ways mitigate taxes', completed: false, accessible: false }
    ];

    // Check step completion using the same logic as seller routes
    const checkStepCompletion = async (sellerId: string, stepId: number, listingId?: string | null): Promise<boolean> => {
      // First, check if all previous steps are completed (except for step 0)
      if (stepId > 0) {
        // Check all previous steps
        for (let i = 0; i < stepId; i++) {
          const previousStepCompleted = await checkStepCompletionInternal(sellerId, i, listingId);
          if (!previousStepCompleted) {
            return false;
          }
        }
      }
      
      // If all previous steps are completed (or this is step 0), check this step
      return await checkStepCompletionInternal(sellerId, stepId, listingId);
    };

    // Internal function to check step completion without considering dependencies
    const checkStepCompletionInternal = async (sellerId: string, stepId: number, listingId?: string | null): Promise<boolean> => {
      switch (stepId) {
        case 0: // Select listing
          return !!listingId;
          
        case 1: // Email agent
          const sentMessages = await prisma.message.findFirst({
            where: { senderId: sellerId }
          });
          return !!sentMessages;
          
        case 2: // Download listing agreement  
          const listingDoc = await prisma.document.findFirst({
            where: { 
              sellerId, 
              stepId: 2, 
              type: 'LISTING_AGREEMENT',
              operationType: 'DOWNLOAD',
              downloadedAt: { not: null }
            }
          });
          return !!listingDoc;
          
        case 3: // Fill questionnaire
          const questionnaireDoc = await prisma.document.findFirst({
            where: { 
              sellerId, 
              stepId: 3, 
              type: 'QUESTIONNAIRE',
              operationType: 'UPLOAD',
              status: 'COMPLETED'
            }
          });
          return !!questionnaireDoc;
          
        case 4: // Upload financial documents
          const financialDocs = await prisma.document.findMany({
            where: { 
              sellerId, 
              listingId,
              category: 'SELLER_UPLOAD',
              type: 'FINANCIAL_DOCUMENTS'
            }
          });
          return financialDocs.length > 0;
          
        case 5: // Buyer activity
          return false; // Keep sequential for now
          
        case 6: // Download purchase contract
          return false;
          
        case 7: // Upload due diligence
          const dueDiligenceDocs = await prisma.document.findMany({
            where: { 
              sellerId, 
              listingId,
              category: 'SELLER_UPLOAD',
              type: 'DUE_DILIGENCE'
            }
          });
          return dueDiligenceDocs.length > 0;
          
        case 8: // Complete pre-closing checklist
          return false;
          
        case 9: // Download closing docs
          return false;
          
        case 10: // After sale
          return false;
          
        default:
          return false;
      }
    };

    // Check each step individually
    let currentStep = 0;
    const completedSteps: number[] = [];
    
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      // Use seller's actual selectedListingId for step completion check
      const isCompleted = await checkStepCompletion(listing.sellerId, step.id, actualSelectedListingId);
      step.completed = isCompleted;
      
      if (isCompleted) {
        completedSteps.push(step.id);
      }
    }
    
    // Determine current step
    for (let i = 0; i < steps.length; i++) {
      if (!steps[i].completed) {
        currentStep = i;
        break;
      }
    }
    
    if (completedSteps.length === steps.length) {
      currentStep = steps.length;
    }
    
    // Update accessibility
    steps.forEach((step, index) => {
      if (index === 0) {
        step.accessible = true;
      } else {
        step.accessible = steps[index - 1].completed;
      }
      
      const stepDoc = STEP_DOCUMENT_REQUIREMENTS[step.id as keyof typeof STEP_DOCUMENT_REQUIREMENTS];
      if (stepDoc) {
        (step as any).documentRequirement = stepDoc;
      }
    });

    res.json({
      progress: {
        currentStep,
        steps,
        selectedListingId: actualSelectedListingId,
        isViewingSelectedListing,
        viewingListingId: listingId
      }
    });
  } catch (error) {
    console.error('Error fetching seller progress:', error);
    next(error);
  }
};

router.get('/sellers', authenticateBroker, getSellers);
router.get('/buyers', authenticateBroker, getBuyers);
router.get('/dashboard', authenticateBroker, getDashboardStats);
router.get('/agents', authenticateBroker, getAgentsWithStats);
router.get('/agents-with-stats', authenticateBroker, getAgentsWithStats);
router.delete('/agent/:agentId', authenticateBroker, deleteAgent);
router.get('/agent/:agentId/stats', authenticateBroker, getAgentStats);
router.get('/listings/:listingId/progress', authenticateBroker, getSellerProgress);

export default router;
