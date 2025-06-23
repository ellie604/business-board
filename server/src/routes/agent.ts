import { Router, RequestHandler } from 'express';
import { getPrisma } from '../../database';
import { authenticateAgent } from '../middleware/auth';
import { AuthenticatedRequest } from '../types/custom';
import multer from 'multer';
import { supabase, getStorageBucket } from '../config/supabase';

const router = Router();

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
    const sellers = await getPrisma().user.findMany({
      where: {
        managerId: agentId,
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
      getPrisma().listing.count({
        where: {
          sellerId: { in: sellerIds },
          status: 'ACTIVE'
        }
      }),
      // 正在交易的房源数
      getPrisma().listing.count({
        where: {
          sellerId: { in: sellerIds },
          status: 'UNDER_CONTRACT'
        }
      }),
      // 本月新增房源数
      getPrisma().listing.count({
        where: {
          sellerId: { in: sellerIds },
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }),
      // NDA 数量
      getPrisma().document.count({
        where: {
          type: 'NDA',
          sellerId: { in: sellerIds }
        }
      }),
      // 今年完成的交易数
      getPrisma().listing.count({
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
    const sellers = await getPrisma().user.findMany({
      where: {
        managerId: agentId,
        role: 'SELLER'
      },
      select: { id: true }
    });
    
    const sellerIds = sellers.map((seller: { id: string }) => seller.id);
    
    const listings = await getPrisma().listing.findMany({
      where: {
        sellerId: { in: sellerIds }
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
    
    const sellers = await getPrisma().user.findMany({
      where: {
        managerId: agentId,
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
    
    // 首先获取该agent管理的所有seller
    const sellers = await getPrisma().user.findMany({
      where: {
        managerId: agentId,
        role: 'SELLER'
      },
      select: { id: true }
    });
    
    const sellerIds = sellers.map((seller: { id: string }) => seller.id);
    
    // 获取这些seller的所有listing
    const listings = await getPrisma().listing.findMany({
      where: {
        sellerId: { in: sellerIds }
      },
      select: { id: true }
    });
    
    const listingIds = listings.map((listing: { id: string }) => listing.id);
    
    // 获取对这些listing感兴趣的所有buyer（通过listing-buyer关系）
    const buyersWithListings = await getPrisma().user.findMany({
      where: {
        role: 'BUYER',
        buyingListings: {
          some: {
            id: { in: listingIds }
          }
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        buyingListings: {
          where: {
            id: { in: listingIds } // 只显示agent管理的listing
          },
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

    res.json({ buyers: buyersWithListings });
  } catch (error) {
    console.error('Error fetching agent buyers:', error);
    next(error);
  }
};

// Get seller progress for a specific listing
const getSellerProgress: RequestHandler = async (req, res, next) => {
  const typedReq = req as AuthenticatedRequest;
  try {
    const agentId = typedReq.user?.id;
    const { listingId } = req.params;
    
    if (!agentId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // 验证listing是否属于该agent管理的seller
    const listing = await getPrisma().listing.findFirst({
      where: { 
        id: listingId,
        seller: {
          managerId: agentId
        }
      },
      include: {
        seller: {
          include: {
            sellerProgress: true,
            managedBy: true
          }
        }
      }
    });

    if (!listing) {
      res.status(403).json({ message: 'Access denied to this listing' });
      return;
    }

    let sellerProgress = listing.seller.sellerProgress;

    // sellerProgress可能是数组，需要取第一个元素
    if (Array.isArray(sellerProgress) && sellerProgress.length > 0) {
      sellerProgress = sellerProgress[0];
    } else if (Array.isArray(sellerProgress)) {
      sellerProgress = null;
    }

    // 获取seller progress信息，如果不存在则创建
    if (!sellerProgress) {
      sellerProgress = await getPrisma().sellerProgress.create({
        data: {
          sellerId: listing.sellerId,
          currentStep: 0,
          completedSteps: [],
          selectedListingId: null
        }
      });
    }

    // 直接使用数据库中的步骤定义和完成状态
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

    // 直接使用数据库中的completedSteps数据
    const completedStepsFromDB = sellerProgress.completedSteps as number[] || [];
    const currentStep = sellerProgress.currentStep || 0;
    
    // 设置步骤完成状态和可访问性
    steps.forEach((step, index) => {
      // 直接从数据库数据设置完成状态
      step.completed = completedStepsFromDB.includes(step.id);
      
      // 设置可访问性：第一步总是可访问，其他步骤需要前一步完成
      if (index === 0) {
        step.accessible = true;
      } else {
        step.accessible = steps[index - 1].completed;
      }
    });

    // 获取文档信息用于显示
    const documents = await getPrisma().document.findMany({
      where: { 
        sellerId: listing.sellerId,
        stepId: { not: null }
      }
    });

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

    // 添加文档需求信息
    steps.forEach((step) => {
      const stepDoc = STEP_DOCUMENT_REQUIREMENTS[step.id as keyof typeof STEP_DOCUMENT_REQUIREMENTS];
      if (stepDoc) {
        (step as any).documentRequirement = stepDoc;
        (step as any).documents = documents.filter((doc: any) => doc.stepId === step.id);
      }
    });

    res.json({
      listing: {
        id: listing.id,
        title: listing.title,
        seller: {
          id: listing.seller.id,
          name: listing.seller.name,
          email: listing.seller.email
        }
      },
      progress: {
        currentStep,
        steps,
        selectedListingId: sellerProgress.selectedListingId
      }
    });
  } catch (error) {
    console.error('Error fetching seller progress:', error);
    next(error);
  }
};

// Get buyer progress for a specific listing
const getBuyerProgress: RequestHandler = async (req, res, next) => {
  const typedReq = req as AuthenticatedRequest;
  try {
    const agentId = typedReq.user?.id;
    const { buyerId, listingId } = req.params;
    
    if (!agentId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // First, get the buyer and verify access
    const buyer = await getPrisma().user.findFirst({
      where: { 
        id: buyerId,
        role: 'BUYER'
      }
    });

    if (!buyer) {
      res.status(404).json({ message: 'Buyer not found' });
      return;
    }

    // Get the listing and verify it belongs to a seller managed by this agent
    const listing = await getPrisma().listing.findFirst({
      where: { id: listingId },
      include: {
        seller: true
      }
    });

    if (!listing) {
      res.status(404).json({ message: 'Listing not found' });
      return;
    }

    // Check if the seller is managed by this agent
    if (listing.seller.managerId !== agentId) {
      res.status(403).json({ message: 'Access denied - listing not under your management' });
      return;
    }

    // Get buyer's progress
    let buyerProgress = await getPrisma().buyerProgress.findFirst({
      where: { buyerId }
    });

    if (!buyerProgress) {
      // Create default progress if none exists
      buyerProgress = await getPrisma().buyerProgress.create({
        data: {
          buyerId,
          currentStep: 0,
          completedSteps: [],
          selectedListingId: null
        }
      });
    }

    const actualSelectedListingId = buyerProgress.selectedListingId;
    const isViewingSelectedListing = actualSelectedListingId === listingId;

    // Import the step definitions and completion logic from buyer routes
    const BUYER_STEP_DOCUMENT_REQUIREMENTS = {
      0: { type: 'LISTING_SELECTION', operationType: 'NONE', description: 'Select listing you are interested in' },
      1: { type: 'EMAIL_AGENT', operationType: 'BOTH', description: 'Email communication with agent' },
      2: { type: 'NDA', operationType: 'UPLOAD', description: 'Download, sign, and upload Non Disclosure Agreement' },
      3: { type: 'FINANCIAL_STATEMENT', operationType: 'UPLOAD', description: 'Fill out financial statement online' },
      4: { type: 'CBR_CIM', operationType: 'DOWNLOAD', description: 'Download CBR or CIM for the business' },
      5: { type: 'UPLOADED_DOC', operationType: 'UPLOAD', description: 'Upload documents' },
      6: { type: 'PURCHASE_CONTRACT', operationType: 'DOWNLOAD', description: 'Download your purchase contract' },
      7: { type: 'DUE_DILIGENCE', operationType: 'DOWNLOAD', description: 'Request & Download Due Diligence documents' },
      8: { type: 'PRE_CLOSE_CHECKLIST', operationType: 'BOTH', description: 'Checklist: Check off your to do list' },
      9: { type: 'CLOSING_DOCS', operationType: 'DOWNLOAD', description: 'Download Closing document once we are closed' },
      10: { type: 'AFTER_SALE', operationType: 'DOWNLOAD', description: 'After the Sale: Tips to make your transition smoother' }
    };

    const steps = [
      { id: 0, title: 'Select listing you are interested in', completed: false, accessible: true },
      { id: 1, title: 'Email the broker or agent', completed: false, accessible: false },
      { id: 2, title: 'Fill out a Non Disclosure agreement online', completed: false, accessible: false },
      { id: 3, title: 'Fill out a simple financial statement online', completed: false, accessible: false },
      { id: 4, title: 'Download a CBR or CIM for the business your interested in', completed: false, accessible: false },
      { id: 5, title: 'Upload documents', completed: false, accessible: false },
      { id: 6, title: 'Download your purchase contract', completed: false, accessible: false },
      { id: 7, title: 'Request & Download Due Diligence documents', completed: false, accessible: false },
      { id: 8, title: 'Checklist: Check off your to do list', completed: false, accessible: false },
      { id: 9, title: 'Download Closing document once we are closed', completed: false, accessible: false },
      { id: 10, title: 'After the Sale: Tips to make your transition smoother', completed: false, accessible: false }
    ];

    // Optimized buyer step completion check using batched data
    let currentStep = 0;
    const completedSteps: number[] = [];
    
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const isCompleted = await checkBuyerStepCompletion(buyerId, step.id, listingId);
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
      
      const stepDoc = BUYER_STEP_DOCUMENT_REQUIREMENTS[step.id as keyof typeof BUYER_STEP_DOCUMENT_REQUIREMENTS];
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
    console.error('Error fetching buyer progress:', error);
    next(error);
  }
};

// Check if a specific buyer step is completed
const checkBuyerStepCompletion = async (buyerId: string, stepId: number, listingId?: string | null): Promise<boolean> => {
  // First, check if all previous steps are completed (except for step 0)
  if (stepId > 0) {
    // Check all previous steps
    for (let i = 0; i < stepId; i++) {
      const previousStepCompleted = await checkBuyerStepCompletionInternal(buyerId, i, listingId);
      if (!previousStepCompleted) {
        return false;
      }
    }
  }
  
  // If all previous steps are completed (or this is step 0), check this step
  return await checkBuyerStepCompletionInternal(buyerId, stepId, listingId);
};

// Internal function to check buyer step completion without considering dependencies
const checkBuyerStepCompletionInternal = async (buyerId: string, stepId: number, listingId?: string | null): Promise<boolean> => {
  switch (stepId) {
    case 0: // Select listing
      return !!listingId;
      
    case 1: // Email agent - FIXED: Only check if this buyer has selected this specific listing
      // For buyer, step 1 completion should only count if they've selected this listing AND sent messages
      if (!listingId) return false; // No listing selected means step 1 cannot be completed
      
      // Check if buyer has selected this specific listing
      const buyerProgress = await getPrisma().buyerProgress.findFirst({
        where: { 
          buyerId,
          selectedListingId: listingId 
        }
      });
      
      if (!buyerProgress) return false; // Haven't selected this listing
      
      // If they've selected this listing, check if they've sent any messages (global check is acceptable for now)
      const sentMessages = await getPrisma().message.findFirst({
        where: { senderId: buyerId }
      });
      return !!sentMessages;
      
    case 2: // Fill out NDA - should be tied to specific listing
      if (!listingId) return false;
      const ndaDoc = await getPrisma().document.findFirst({
        where: { 
          buyerId, 
          listingId, // Make sure it's for this specific listing
          stepId: 2, 
          type: 'NDA',
          category: 'BUYER_UPLOAD',
          operationType: 'UPLOAD',
          status: 'COMPLETED'
        }
      });
      return !!ndaDoc;
      
    case 3: // Fill out financial statement - should be tied to specific listing
      if (!listingId) return false;
      const financialDoc = await getPrisma().document.findFirst({
        where: { 
          buyerId, 
          listingId, // Make sure it's for this specific listing
          stepId: 3, 
          type: 'FINANCIAL_STATEMENT',
          operationType: 'UPLOAD',
          status: 'COMPLETED'
        }
      });
      return !!financialDoc;
      
    case 4: // Download CBR/CIM - should be tied to specific listing
      if (!listingId) return false;
      const cbrDoc = await getPrisma().document.findFirst({
        where: { 
          buyerId, 
          listingId, // Make sure it's for this specific listing
          stepId: 4, 
          type: 'CBR_CIM',
          operationType: 'DOWNLOAD',
          downloadedAt: { not: null }
        }
      });
      return !!cbrDoc;
      
    case 5: // Upload documents - already correctly tied to listing
      if (!listingId) return false;
      const uploadedDocs = await getPrisma().document.findMany({
        where: { 
          buyerId, 
          listingId,
          category: 'BUYER_UPLOAD',
          type: 'UPLOADED_DOC'
        }
      });
      return uploadedDocs.length > 0;
      
    case 6: // Download purchase contract - should be tied to specific listing
      if (!listingId) return false;
      const purchaseDoc = await getPrisma().document.findFirst({
        where: { 
          buyerId, 
          listingId, // Make sure it's for this specific listing
          stepId: 6, 
          type: 'PURCHASE_CONTRACT',
          operationType: 'DOWNLOAD',
          downloadedAt: { not: null }
        }
      });
      return !!purchaseDoc;
      
    case 7: // Due diligence step - automatically completed when buyer reaches this step
      // Step 7 is considered complete as soon as the buyer can access it
      // (i.e., when all previous steps are completed)
      if (!listingId) return false;
      
      // Check if all previous steps (0-6) are completed
      for (let i = 0; i < 7; i++) {
        const previousStepCompleted = await checkBuyerStepCompletionInternal(buyerId, i, listingId);
        if (!previousStepCompleted) {
          return false;
        }
      }
      return true; // Automatically complete step 7 when buyer reaches it
      
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

// 获取listing的agent提供的文件
router.get('/listings/:listingId/documents', authenticateAgent, async (req, res): Promise<void> => {
  try {
    const { listingId } = req.params;
    const typedReq = req as AuthenticatedRequest;
    const agentId = typedReq.user?.id;

    if (!agentId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Verify the listing belongs to a seller managed by this agent
    const listing = await getPrisma().listing.findFirst({
      where: { id: listingId },
      include: {
        seller: true
      }
    });

    if (!listing || listing.seller.managerId !== agentId) {
      res.status(403).json({ message: 'Access denied - listing not under your management' });
      return;
    }
    
    const documents = await getPrisma().document.findMany({
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
    console.error('Error fetching agent documents:', error);
    res.status(500).json({ 
      message: 'Failed to fetch documents',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// 获取listing的seller上传的文件 - 供agent查看
router.get('/listings/:listingId/seller-documents', authenticateAgent, async (req, res): Promise<void> => {
  try {
    const { listingId } = req.params;
    const typedReq = req as AuthenticatedRequest;
    const agentId = typedReq.user?.id;

    console.log('Agent fetching seller documents for listing:', listingId, 'agentId:', agentId);

    if (!agentId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Verify the listing belongs to a seller managed by this agent
    const listing = await getPrisma().listing.findFirst({
      where: { id: listingId },
      include: {
        seller: true
      }
    });

    if (!listing || listing.seller.managerId !== agentId) {
      res.status(403).json({ message: 'Access denied - listing not under your management' });
      return;
    }

    const queryConditions = {
      listingId,
      category: 'SELLER_UPLOAD', // 只获取seller上传的文件
      type: {
        in: ['QUESTIONNAIRE', 'FINANCIAL_DOCUMENTS', 'DUE_DILIGENCE', 'LISTING_AGREEMENT', 'PURCHASE_AGREEMENT', 'PURCHASE_CONTRACT', 'UPLOADED_DOC'] // 包括签完字的协议文件
      }
    };

    console.log('Agent query conditions:', queryConditions);
    
    const documents = await getPrisma().document.findMany({
      where: queryConditions,
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: [
        {
          stepId: 'asc' // 按步骤排序
        },
        {
          type: 'asc' // 然后按文档类型
        },
        {
          createdAt: 'desc' // 最后按创建时间（最新的在前）
        }
      ]
    });

    console.log('Agent found seller documents:', documents.map((doc: any) => ({
      id: doc.id,
      fileName: doc.fileName,
      type: doc.type,
      category: doc.category,
      sellerId: doc.sellerId,
      listingId: doc.listingId,
      createdAt: doc.createdAt
    })));

    res.json({ documents });
  } catch (error: unknown) {
    console.error('Error fetching seller documents:', error);
    res.status(500).json({ 
      message: 'Failed to fetch seller documents',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// agent为listing上传文件
router.post('/listings/:listingId/documents', upload.single('file'), authenticateAgent, async (req, res): Promise<void> => {
  try {
    const { listingId } = req.params;
    const { documentType, buyerId, description } = req.body;
    const typedReq = req as AuthenticatedRequest;
    const file = req.file;
    const agentId = typedReq.user?.id;

    if (!file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    if (!agentId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // 检查listing是否存在并且属于该agent管理的seller
    const listing = await getPrisma().listing.findFirst({
      where: { id: listingId },
      include: {
        seller: true
      }
    });

    if (!listing) {
      res.status(404).json({ message: 'Listing not found' });
      return;
    }

    if (listing.seller.managerId !== agentId) {
      res.status(403).json({ message: 'Access denied - listing not under your management' });
      return;
    }

    // 如果指定了buyerId，验证buyer是否存在
    if (buyerId) {
      const buyer = await getPrisma().user.findFirst({
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
    const fileName = `listings/${listingId}/agent/documents/${Date.now()}-${file.originalname}`;

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
    const document = await getPrisma().document.create({
      data: {
        type: documentType || 'UPLOADED_DOC',
        category: 'AGENT_PROVIDED',
        fileName: file.originalname,
        fileSize: file.size,
        url: publicUrl,
        listingId,
        sellerId: listing.sellerId,
        buyerId: buyerId || null,       // 可选的buyer关联
        uploadedBy: agentId,            // agent上传
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
    console.error('Error uploading agent document:', error);
    res.status(500).json({ 
      message: 'Failed to upload document',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// 删除agent上传的文件
router.delete('/listings/:listingId/documents/:documentId', authenticateAgent, async (req, res): Promise<void> => {
  try {
    const { listingId, documentId } = req.params;
    const typedReq = req as AuthenticatedRequest;
    const agentId = typedReq.user?.id;

    if (!agentId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // 验证listing属于该agent管理的seller
    const listing = await getPrisma().listing.findFirst({
      where: { id: listingId },
      include: {
        seller: true
      }
    });

    if (!listing || listing.seller.managerId !== agentId) {
      res.status(403).json({ message: 'Access denied - listing not under your management' });
      return;
    }

    const document = await getPrisma().document.findFirst({
      where: {
        id: documentId,
        listingId,
        category: 'AGENT_PROVIDED',
        uploadedBy: agentId
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
          .remove([`listings/${listingId}/agent/documents/${fileName}`]);

        if (deleteError) {
          console.error('Supabase delete error:', deleteError);
        }
      }
    }

    // 从数据库删除记录
    await getPrisma().document.delete({
      where: { id: documentId }
    });

    res.json({ message: 'Document deleted successfully' });
  } catch (error: unknown) {
    console.error('Error deleting agent document:', error);
    res.status(500).json({ 
      message: 'Failed to delete document',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/dashboard', authenticateAgent, getDashboardStats);
router.get('/listings', authenticateAgent, getListings);
router.get('/sellers', authenticateAgent, getSellers);
router.get('/buyers', authenticateAgent, getBuyers);
router.get('/listings/:listingId/progress', authenticateAgent, getSellerProgress);
router.get('/buyers/:buyerId/listings/:listingId/progress', authenticateAgent, getBuyerProgress);

// Get buyer documents for a specific listing from agent perspective
router.get('/buyers/:buyerId/listings/:listingId/documents', authenticateAgent, async (req, res): Promise<void> => {
  try {
    const { buyerId, listingId } = req.params;
    const typedReq = req as AuthenticatedRequest;
    const agentId = typedReq.user?.id;

    if (!agentId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Verify access to the listing through agent management
    const listing = await getPrisma().listing.findFirst({
      where: { id: listingId },
      include: {
        seller: true
      }
    });

    if (!listing) {
      res.status(404).json({ message: 'Listing not found' });
      return;
    }

    // Check if the seller is managed by this agent
    if (listing.seller.managerId !== agentId) {
      res.status(403).json({ message: 'Access denied - listing not under your management' });
      return;
    }

    // Verify buyer exists
    const buyer = await getPrisma().user.findFirst({
      where: { 
        id: buyerId,
        role: 'BUYER'
      }
    });

    if (!buyer) {
      res.status(404).json({ message: 'Buyer not found' });
      return;
    }

    // Get buyer's documents for this listing
    const documents = await getPrisma().document.findMany({
      where: {
        listingId,
        buyerId,
        category: 'BUYER_UPLOAD'
      },
      include: {
        uploader: {
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

    res.json({ documents });
  } catch (error: unknown) {
    console.error('Error fetching buyer documents:', error);
    res.status(500).json({ 
      message: 'Failed to fetch buyer documents',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Pre-Close Checklist APIs (similar to broker.ts)
// 获取listing的pre-close checklist
router.get('/listings/:listingId/pre-close-checklist', authenticateAgent, async (req, res): Promise<void> => {
  try {
    const { listingId } = req.params;
    const typedReq = req as AuthenticatedRequest;
    const agentId = typedReq.user?.id;
    
    if (!agentId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // 验证listing是否在该agent管理下
    const listing = await getPrisma().listing.findFirst({
      where: { id: listingId },
      include: {
        seller: true
      }
    });

    if (!listing) {
      res.status(404).json({ message: 'Listing not found' });
      return;
    }

    // Check if the seller is managed by this agent
    if (listing.seller.managerId !== agentId) {
      res.status(403).json({ message: 'Access denied - listing not under your management' });
      return;
    }

    // 获取或创建checklist
    let checklist = await getPrisma().preCloseChecklist.findUnique({
      where: { listingId },
      include: {
        lastUpdatedByUser: {
          select: {
            name: true
          }
        }
      }
    });

    if (!checklist) {
      // 创建默认的checklist
      const defaultChecklistData = getDefaultChecklistData();
      checklist = await getPrisma().preCloseChecklist.create({
        data: {
          listingId,
          buyerItems: defaultChecklistData.buyerItems,
          sellerItems: defaultChecklistData.sellerItems,
          brokerItems: defaultChecklistData.brokerItems
        },
        include: {
          lastUpdatedByUser: {
            select: {
              name: true
            }
          }
        }
      });
    }

    // 合并所有items到一个checklist结构
    const mergedChecklist = mergeChecklistItems(checklist.buyerItems as any, checklist.sellerItems as any, checklist.brokerItems as any);

    res.json({
      checklist: mergedChecklist,
      lastUpdatedBy: checklist.lastUpdatedByUser?.name,
      updatedAt: checklist.updatedAt
    });
  } catch (error: unknown) {
    console.error('Error fetching pre-close checklist:', error);
    res.status(500).json({ 
      message: 'Failed to fetch pre-close checklist',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// 更新checklist item
router.put('/listings/:listingId/pre-close-checklist/item', authenticateAgent, async (req, res): Promise<void> => {
  try {
    const { listingId } = req.params;
    const { categoryId, itemId, userRole } = req.body;
    const typedReq = req as AuthenticatedRequest;
    const agentId = typedReq.user?.id;
    
    if (!agentId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // 验证listing是否在该agent管理下
    const listing = await getPrisma().listing.findFirst({
      where: { id: listingId },
      include: {
        seller: true
      }
    });

    if (!listing) {
      res.status(404).json({ message: 'Listing not found' });
      return;
    }

    // Check if the seller is managed by this agent
    if (listing.seller.managerId !== agentId) {
      res.status(403).json({ message: 'Access denied - listing not under your management' });
      return;
    }

    // 获取或创建checklist
    let checklist = await getPrisma().preCloseChecklist.findUnique({
      where: { listingId }
    });

    if (!checklist) {
      const defaultChecklistData = getDefaultChecklistData();
      checklist = await getPrisma().preCloseChecklist.create({
        data: {
          listingId,
          buyerItems: defaultChecklistData.buyerItems,
          sellerItems: defaultChecklistData.sellerItems,
          brokerItems: defaultChecklistData.brokerItems
        }
      });
    }

    // 更新对应的item
    const updatedChecklist = await updateChecklistItem(
      checklist,
      categoryId,
      itemId,
      agentId,
      typedReq.user?.name || 'Unknown User',
      userRole
    );

    // 合并所有items到一个checklist结构
    const mergedChecklist = mergeChecklistItems(
      updatedChecklist.buyerItems as any, 
      updatedChecklist.sellerItems as any, 
      updatedChecklist.brokerItems as any
    );

    res.json({
      checklist: mergedChecklist,
      lastUpdatedBy: typedReq.user?.name || 'Unknown User',
      updatedAt: updatedChecklist.updatedAt
    });
  } catch (error: unknown) {
    console.error('Error updating checklist item:', error);
    res.status(500).json({ 
      message: 'Failed to update checklist item',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Helper functions
function getDefaultChecklistData() {
  const defaultStructure = {
    'letter-of-intent': {
      title: 'A. Letter Of Intent',
      items: {
        'buyer-offer': { task: 'Buyer offer', completed: false, responsible: 'buyer', required: true },
        'seller-counter': { task: 'Seller counter', completed: false, responsible: 'seller', required: false },
        'negotiate-agreement': { task: 'Negotiate mutual agreement', completed: false, responsible: 'seller', required: false },
        'buyer-earnest-money': { task: 'Buyer provides Earnest Money', completed: false, responsible: 'buyer', required: true },
        'broker-deposits-earnest': { task: 'Broker deposits Earnest Money', completed: false, responsible: 'broker', required: true },
      }
    },
    'asset-purchase-agreement': {
      title: 'B. Asset Purchase Agreement',
      items: {
        'buyer-offer-apa': { task: 'Buyer offer', completed: false, responsible: 'buyer', required: true },
        'buyer-attorney-review': { task: 'Attorney review', completed: false, responsible: 'buyer', required: true },
        'buyer-accountant-review': { task: 'Accountant review', completed: false, responsible: 'buyer', required: true },
        'seller-counter-apa': { task: 'Seller counter', completed: false, responsible: 'seller', required: false },
        'seller-attorney-review': { task: 'Attorney review', completed: false, responsible: 'seller', required: false },
        'seller-accountant-review': { task: 'Accountant review', completed: false, responsible: 'seller', required: false },
        'negotiate-execute-agreement': { task: 'Negotiate and execute mutual agreement', completed: false, responsible: 'buyer', required: true },
        'negotiate-execute-agreement-seller': { task: 'Negotiate and execute mutual agreement', completed: false, responsible: 'seller', required: true },
      }
    },
    'exhibits': {
      title: 'C. Exhibits',
      items: {
        'asset-list': { task: 'Current Furniture, Fixtures & Equipment List ("Asset List")', completed: false, responsible: 'broker', required: true },
        'seller-financial-info': { task: "Seller's financial information", completed: false, responsible: 'seller', required: true },
        'buyer-financial-info': { task: "Buyer's financial information", completed: false, responsible: 'buyer', required: true },
        'contract-rights': { task: 'Contract Rights', completed: false, responsible: 'seller', required: true },
        'other-1': { task: 'Other:', completed: false, responsible: 'broker', required: false },
        'other-2': { task: 'Other:', completed: false, responsible: 'broker', required: false },
        'other-3': { task: 'Other:', completed: false, responsible: 'broker', required: false },
      }
    },
    'contingencies': {
      title: 'D. Asset Purchase Agreement Contingencies',
      items: {
        'seller-contacts-landlord': { task: 'Seller contacts landlord', completed: false, responsible: 'seller', required: true },
        'buyer-meeting-landlord': { task: 'Buyer meeting with landlord', completed: false, responsible: 'buyer', required: true },
        'lease-documents-prep': { task: 'Preparation of lease documents', completed: false, responsible: 'buyer', required: true },
        'lease-assignment': { task: 'Lease assignment or new lease', completed: false, responsible: 'buyer', required: true },
        'seller-security-deposit': { task: "Seller's security deposit", completed: false, responsible: 'seller', required: false },
        'buyer-security-deposit': { task: "Buyer's security deposit", completed: false, responsible: 'buyer', required: false },
        'rent-proration': { task: 'Rent proration', completed: false, responsible: 'seller', required: true },
        'seller-walkthrough': { task: 'Seller walk thru with landlord and/or Buyer', completed: false, responsible: 'buyer', required: true },
        'seller-walkthrough-seller': { task: 'Seller walk thru with landlord and/or Buyer', completed: false, responsible: 'seller', required: true },
        'conditional-lease-assignment': { task: 'Conditional lease assignment', completed: false, responsible: 'broker', required: false },
        'guaranty-lease': { task: 'Guaranty of lease', completed: false, responsible: 'buyer', required: true },
        'right-inspection': { task: 'Right of Inspection', completed: false, responsible: 'buyer', required: true },
        'due-diligence-list': { task: 'Buyer provide list of due diligence requirements', completed: false, responsible: 'buyer', required: true },
        'due-diligence-list-seller': { task: 'Buyer provide list of due diligence requirements', completed: false, responsible: 'seller', required: true },
        'action-plan-buyer': { task: 'Buyer & Seller agree on plan of action to satisfy contingencies', completed: false, responsible: 'buyer', required: true },
        'action-plan-seller': { task: 'Buyer & Seller agree on plan of action to satisfy contingencies', completed: false, responsible: 'seller', required: true },
        'financials-buyer': { task: 'Financials', completed: false, responsible: 'buyer', required: true },
        'financials-seller': { task: 'Financials', completed: false, responsible: 'seller', required: true },
        'premises-inspection-buyer': { task: 'Premises inspections', completed: false, responsible: 'buyer', required: true },
        'premises-inspection-seller': { task: 'Premises inspections', completed: false, responsible: 'seller', required: true },
      }
    }
  };

  // 分离不同角色的items
  const buyerItems: any = {};
  const sellerItems: any = {};
  const brokerItems: any = {};

  Object.entries(defaultStructure).forEach(([categoryId, category]) => {
    buyerItems[categoryId] = { title: category.title, items: {} };
    sellerItems[categoryId] = { title: category.title, items: {} };
    brokerItems[categoryId] = { title: category.title, items: {} };

    Object.entries(category.items).forEach(([itemId, item]) => {
      if (item.responsible === 'buyer') {
        buyerItems[categoryId].items[itemId] = item;
      } else if (item.responsible === 'seller') {
        sellerItems[categoryId].items[itemId] = item;
      } else if (item.responsible === 'broker') {
        brokerItems[categoryId].items[itemId] = item;
      }
    });
  });

  return {
    buyerItems,
    sellerItems, 
    brokerItems
  };
}

function mergeChecklistItems(buyerItems: any, sellerItems: any, brokerItems: any) {
  const mergedChecklist: any[] = [];
  const allCategories = new Set([
    ...Object.keys(buyerItems || {}),
    ...Object.keys(sellerItems || {}),
    ...Object.keys(brokerItems || {})
  ]);

  Array.from(allCategories).forEach(categoryId => {
    const category = {
      id: categoryId,
      title: (buyerItems[categoryId]?.title || sellerItems[categoryId]?.title || brokerItems[categoryId]?.title),
      items: [] as any[]
    };

    // 合并所有items
    const allItems = new Set([
      ...Object.keys(buyerItems[categoryId]?.items || {}),
      ...Object.keys(sellerItems[categoryId]?.items || {}),
      ...Object.keys(brokerItems[categoryId]?.items || {})
    ]);

    Array.from(allItems).forEach(itemId => {
      const item = 
        buyerItems[categoryId]?.items[itemId] ||
        sellerItems[categoryId]?.items[itemId] ||
        brokerItems[categoryId]?.items[itemId];
      
      if (item) {
        category.items.push({
          id: itemId,
          ...item
        });
      }
    });

    mergedChecklist.push(category);
  });

  return mergedChecklist;
}

async function updateChecklistItem(
  checklist: any,
  categoryId: string,
  itemId: string,
  userId: string,
  userName: string,
  userRole: string
) {
  const buyerItems = (checklist.buyerItems as any) || {};
  const sellerItems = (checklist.sellerItems as any) || {};
  const brokerItems = (checklist.brokerItems as any) || {};

  // 找到要更新的item
  let itemToUpdate: any = null;
  let targetItems: any = null;

  if (buyerItems[categoryId]?.items[itemId]) {
    itemToUpdate = buyerItems[categoryId].items[itemId];
    targetItems = buyerItems;
  } else if (sellerItems[categoryId]?.items[itemId]) {
    itemToUpdate = sellerItems[categoryId].items[itemId];
    targetItems = sellerItems;
  } else if (brokerItems[categoryId]?.items[itemId]) {
    itemToUpdate = brokerItems[categoryId].items[itemId];
    targetItems = brokerItems;
  }

  if (itemToUpdate && targetItems) {
    // 切换完成状态
    itemToUpdate.completed = !itemToUpdate.completed;
    
    if (itemToUpdate.completed) {
      itemToUpdate.completedBy = userName;
      itemToUpdate.completedAt = new Date().toISOString();
    } else {
      delete itemToUpdate.completedBy;
      delete itemToUpdate.completedAt;
    }

    // 更新数据库
    return await getPrisma().preCloseChecklist.update({
      where: { id: checklist.id },
      data: {
        buyerItems,
        sellerItems,
        brokerItems,
        lastUpdatedBy: userId,
        updatedAt: new Date()
      }
    });
  }

  return checklist;
}

// 获取特定buyer和listing的尽职调查文档请求和上传文件
router.get('/buyers/:buyerId/listings/:listingId/due-diligence', authenticateAgent, async (req, res): Promise<void> => {
  try {
    const { buyerId, listingId } = req.params;
    const typedReq = req as AuthenticatedRequest;
    const agentId = typedReq.user?.id;

    if (!agentId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // 验证agent对该listing的访问权限（agent管理的seller拥有该listing）
    const listing = await getPrisma().listing.findFirst({
      where: { 
        id: listingId,
        seller: {
          managerId: agentId
        }
      },
      include: {
        seller: {
          include: {
            managedBy: true
          }
        }
      }
    });

    if (!listing) {
      res.status(403).json({ message: 'Access denied to this listing' });
      return;
    }

    // 验证buyer存在
    const buyer = await getPrisma().user.findFirst({
      where: { 
        id: buyerId,
        role: 'BUYER'
      }
    });

    if (!buyer) {
      res.status(404).json({ message: 'Buyer not found' });
      return;
    }

    // 获取文档请求记录
    const requests = await getPrisma().dueDiligenceRequest.findMany({
      where: {
        listingId,
        buyerId
      }
    });

    // 获取已上传的尽职调查文档
    const documents = await getPrisma().document.findMany({
      where: {
        listingId,
        buyerId,
        type: 'DUE_DILIGENCE',
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
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({ 
      requests,
      documents: documents.map((doc: any) => ({
        id: doc.id,
        documentName: doc.description || doc.fileName?.replace(/\.[^/.]+$/, "") || doc.type,
        fileName: doc.fileName,
        url: doc.url,
        uploadedAt: doc.uploadedAt,
        uploadedBy: doc.uploadedBy,
        uploaderName: doc.uploader?.name,
        fileSize: doc.fileSize
      }))
    });
  } catch (error: unknown) {
    console.error('Error fetching agent due diligence data:', error);
    res.status(500).json({ 
      message: 'Failed to fetch due diligence data',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// agent上传尽职调查文档
router.post('/listings/:listingId/due-diligence/upload', upload.single('file'), authenticateAgent, async (req, res): Promise<void> => {
  try {
    const { listingId } = req.params;
    const { documentName, buyerId } = req.body;
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

    if (!documentName) {
      res.status(400).json({ message: 'Document name is required' });
      return;
    }

    // 检查listing是否存在并验证权限
    const listing = await getPrisma().listing.findFirst({
      where: { 
        id: listingId,
        seller: {
          managerId: typedReq.user.id
        }
      },
      include: {
        seller: {
          include: {
            managedBy: true
          }
        }
      }
    });

    if (!listing) {
      res.status(404).json({ message: 'Listing not found or access denied' });
      return;
    }

    // 验证buyer是否请求了这个文档
    const dueDiligenceRequest = await getPrisma().dueDiligenceRequest.findFirst({
      where: {
        listingId,
        buyerId,
        documentName
      }
    });

    if (!dueDiligenceRequest) {
      res.status(400).json({ message: 'This document was not requested by the buyer' });
      return;
    }

    // 上传文件到Supabase
    const bucketName = getStorageBucket();
    const fileName = `listings/${listingId}/due-diligence/${Date.now()}-${file.originalname}`;

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
    const document = await getPrisma().document.create({
      data: {
        type: 'DUE_DILIGENCE',
        category: 'AGENT_PROVIDED',
        fileName: `${documentName} - ${file.originalname}`,
        fileSize: file.size,
        url: publicUrl,
        listingId,
        sellerId: listing.sellerId,
        buyerId: buyerId,
        uploadedBy: typedReq.user.id,
        uploadedAt: new Date(),
        status: 'COMPLETED',
        operationType: 'DOWNLOAD',
        stepId: 7 // Due diligence step
      }
    });

    // 更新请求状态
    await getPrisma().dueDiligenceRequest.update({
      where: {
        listingId_buyerId_documentName: {
          listingId,
          buyerId,
          documentName
        }
      },
      data: {
        status: 'FULFILLED',
        fulfilledAt: new Date()
      }
    });

    res.json({ 
      message: 'Due diligence document uploaded successfully',
      document: {
        id: document.id,
        fileName: document.fileName,
        fileSize: document.fileSize,
        documentName: documentName,
        uploadedAt: document.uploadedAt,
        url: document.url
      }
    });
  } catch (error: unknown) {
    console.error('Error uploading due diligence document:', error);
    res.status(500).json({ 
      message: 'Failed to upload due diligence document',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 