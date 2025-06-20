import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { getPrisma } from '../../database';
import { authenticateBuyer } from '../middleware/auth';
import { AuthenticatedRequest } from '../types/custom';
import type { Document } from '../../generated/prisma-preview';
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
    // Allow PDF, DOC, DOCX, XLS, XLSX, JPG, PNG files
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, DOCX, XLS, XLSX, JPG, and PNG files are allowed'));
    }
  }
});

// 定义每个步骤的文档要求
const BUYER_STEP_DOCUMENT_REQUIREMENTS = {
  0: { type: 'LISTING_SELECTION', operationType: 'NONE', description: 'Select listing you are interested in' },
  1: { type: 'EMAIL_AGENT', operationType: 'BOTH', description: 'Email communication with agent' },
  2: { type: 'NDA', operationType: 'UPLOAD', description: 'Download, sign, and upload Non Disclosure Agreement' },
  3: { type: 'FINANCIAL_STATEMENT', operationType: 'UPLOAD', description: 'Fill out financial statement online' },
  4: { type: 'CBR_CIM', operationType: 'DOWNLOAD', description: 'Download CBR or CIM for the business' },
  5: { type: 'UPLOADED_DOC', operationType: 'UPLOAD', description: 'Upload documents' },
  6: { type: 'PURCHASE_CONTRACT', operationType: 'UPLOAD', description: 'Download, sign, and upload purchase contract' },
  7: { type: 'DUE_DILIGENCE', operationType: 'DOWNLOAD', description: 'Request & Download Due Diligence documents' },
  8: { type: 'PRE_CLOSE_CHECKLIST', operationType: 'BOTH', description: 'Checklist: Check off your to do list' },
  9: { type: 'CLOSING_DOCS', operationType: 'DOWNLOAD', description: 'Download Closing document once we are closed' },
  10: { type: 'AFTER_SALE', operationType: 'DOWNLOAD', description: 'After the Sale: Tips to make your transition smoother' }
};

// Get buyer dashboard data
const getDashboardStats: RequestHandler = async (req, res, next) => {
  const typedReq = req as AuthenticatedRequest;
  try {
    const buyerId = typedReq.user?.id;
    if (!buyerId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Get buyer's progress information
    const buyerProgress = await getPrisma().buyerProgress.findFirst({
      where: { buyerId }
    });

    const currentStep = buyerProgress?.currentStep || 0;
    const totalSteps = 11; // Total 11 steps

    res.json({
      stats: {
        currentStep,
        totalSteps,
        completedSteps: currentStep,
        selectedListingId: buyerProgress?.selectedListingId
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    next(error);
  }
};

// Get buyer's interested listings
const getListings: RequestHandler = async (req, res, next) => {
  const typedReq = req as AuthenticatedRequest;
  try {
    const buyerId = typedReq.user?.id;
    if (!buyerId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Get all active listings that the buyer can view
    const listings = await getPrisma().listing.findMany({
      where: { 
        status: 'ACTIVE'
      },
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
  } catch (error) {
    console.error('Error fetching listings:', error);
    next(error);
  }
};

// Get buyer's progress information with document requirements
const getProgress: RequestHandler = async (req, res, next) => {
  const typedReq = req as AuthenticatedRequest;
  try {
    const buyerId = typedReq.user?.id;
    
    if (!buyerId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Get buyer progress
    let buyerProgress = await getPrisma().buyerProgress.findFirst({
      where: { buyerId }
    });

    if (!buyerProgress) {
      buyerProgress = await getPrisma().buyerProgress.create({
        data: {
          buyerId,
          currentStep: 0,
          completedSteps: [],
          selectedListingId: null
        }
      });
    }

    // Get all relevant data at once for optimization
    const selectedListingId = buyerProgress.selectedListingId;
    
    // Batch data fetch for optimization
    const [documents, messages] = await Promise.all([
      // Get all documents for this buyer and listing
      selectedListingId ? getPrisma().document.findMany({
        where: { 
          buyerId,
          listingId: selectedListingId
        }
      }) : Promise.resolve([]),
      
      // Get messages for this buyer
      getPrisma().message.findFirst({
        where: { senderId: buyerId }
      })
    ]);

    const steps = [
      { id: 0, title: 'Select listing you are interested in', completed: false, accessible: true },
      { id: 1, title: 'Email the broker or agent', completed: false, accessible: false },
      { id: 2, title: 'Fill out a Non Disclosure agreement online', completed: false, accessible: false },
      { id: 3, title: 'Fill out a simple financial statement online', completed: false, accessible: false },
      { id: 4, title: 'Download a CBR or CIM for the business your interested in', completed: false, accessible: false },
      { id: 5, title: 'Upload documents', completed: false, accessible: false },
      { id: 6, title: 'Download, sign, and upload purchase contract', completed: false, accessible: false },
      { id: 7, title: 'Request & Download Due Diligence documents', completed: false, accessible: false },
      { id: 8, title: 'Checklist: Check off your to do list', completed: false, accessible: false },
      { id: 9, title: 'Download Closing document once we are closed', completed: false, accessible: false },
      { id: 10, title: 'After the Sale: Tips to make your transition smoother', completed: false, accessible: false }
    ];

    // Optimized step completion check using batched data
    let currentStep = 0;
    const completedSteps: number[] = [];
    
    // Get the completed steps from database first
    const completedStepsFromDB = buyerProgress.completedSteps as number[] || [];
    
    // Check each step using batched data
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      
      // For manual completion steps (like step 8), check the database first
      let isCompleted = false;
      
      if (step.id === 8 || step.id === 9 || step.id === 10) {
        // Steps 8, 9, 10 (Pre-close checklist, Closing docs, After sale) are manually completed
        isCompleted = completedStepsFromDB.includes(step.id);
      } else {
        // For other steps, use the optimized completion check
        isCompleted = checkBuyerStepCompletionOptimized(i, {
          buyerId,
          listingId: selectedListingId,
          documents,
          messages
        });
      }
      
      step.completed = isCompleted;
      
      if (isCompleted) {
        completedSteps.push(step.id);
      }
    }
    
    // Determine current step - it's the first incomplete step, or beyond the last step if all are complete
    for (let i = 0; i < steps.length; i++) {
      if (!steps[i].completed) {
        currentStep = i;
        break;
      }
    }
    
    // If all steps are completed, current step is beyond the last step
    if (completedSteps.length === steps.length) {
      currentStep = steps.length;
    }
    
    // Update accessibility based on sequential completion
    steps.forEach((step, index) => {
      if (index === 0) {
        step.accessible = true;
      } else {
        step.accessible = steps[index - 1].completed;
      }
      
      // Add document requirement information
      const stepDoc = BUYER_STEP_DOCUMENT_REQUIREMENTS[step.id as keyof typeof BUYER_STEP_DOCUMENT_REQUIREMENTS];
      if (stepDoc) {
        (step as any).documentRequirement = stepDoc;
        (step as any).documents = documents.filter((doc: any) => doc.stepId === step.id);
      }
    });

    res.json({
      progress: {
        currentStep,
        completedSteps,
        selectedListingId,
        buyerId,
        steps,
        isViewingSelectedListing: true
      }
    });
  } catch (error) {
    console.error('Error getting buyer progress:', error);
    next(error);
  }
};

// Optimized step completion check using batched data
function checkBuyerStepCompletionOptimized(stepId: number, data: {
  buyerId: string;
  listingId?: string | null;
  documents: any[];
  messages: any;
}): boolean {
  const { buyerId, listingId, documents, messages } = data;
  
  switch (stepId) {
    case 0: // Select listing
      return !!listingId;
      
    case 1: // Email agent
      return !!messages;
      
    case 2: // Fill out NDA - now requires upload of signed NDA
      return documents.some(doc => 
        doc.stepId === 2 && 
        doc.type === 'NDA' &&
        doc.operationType === 'UPLOAD' &&
        doc.category === 'BUYER_UPLOAD' &&
        doc.status === 'COMPLETED'
      );
      
    case 3: // Fill out financial statement
      return documents.some(doc => 
        doc.stepId === 3 &&
        doc.type === 'FINANCIAL_STATEMENT' &&
        doc.operationType === 'UPLOAD' &&
        doc.status === 'COMPLETED'
      );
      
    case 4: // Download CBR/CIM
      return documents.some(doc => 
        doc.stepId === 4 &&
        doc.type === 'CBR_CIM' &&
        doc.operationType === 'DOWNLOAD' &&
        doc.downloadedAt
      );
      
    case 5: // Upload documents
      return documents.some(doc => 
        doc.stepId === 5 &&
        doc.category === 'BUYER_UPLOAD'
      );
      
    case 6: // Download and upload purchase contract
      return documents.some(doc => 
        doc.stepId === 6 &&
        doc.type === 'PURCHASE_CONTRACT' &&
        doc.operationType === 'UPLOAD' &&
        doc.category === 'BUYER_UPLOAD' &&
        doc.status === 'COMPLETED'
      );
      
    case 7: // Due diligence step - automatically completed when buyer reaches this step
      // Step 7 is considered complete as soon as the buyer can access it
      // (i.e., when all previous steps are completed)
      if (!listingId) return false;
      
      // Check if all previous steps (0-6) are completed
      for (let i = 0; i < 7; i++) {
        if (!checkBuyerStepCompletionOptimized(i, data)) {
          return false;
        }
      }
      return true; // Automatically complete step 7 when buyer reaches it
      
    case 8: // Complete pre-closing checklist
      // Check if step 8 is manually marked as completed in the completedSteps array
      // This step requires manual completion by clicking the "Mark as Complete" button
      const manuallyCompleted = data.documents.some(doc => 
        doc.stepId === 8 && doc.operationType === 'MANUAL_COMPLETION'
      );
      
      // For now, we'll check if the step is in completedSteps from buyerProgress
      // This is a simplified approach - in the future we could add a specific completion record
      return false; // This will be handled by the manual completion check in the main logic
      
    case 9: // Download closing docs
      return false; // Only completed after closing
      
    case 10: // After sale
      return false; // Only completed after successful sale
      
    default:
      return false;
  }
}

// Select a listing - updated to return listing info
const selectListing: RequestHandler = async (req, res, next) => {
  const typedReq = req as AuthenticatedRequest;
  try {
    const buyerId = typedReq.user?.id;
    const { listingId } = req.body;
    
    if (!buyerId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (!listingId) {
      res.status(400).json({ error: 'Listing ID is required' });
      return;
    }

    // Verify the listing exists and is active
    const listing = await getPrisma().listing.findFirst({
      where: { 
        id: listingId,
        status: 'ACTIVE'
      },
      include: {
        seller: {
      select: {
        id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!listing) {
      res.status(404).json({ error: 'Listing not found or not active' });
      return;
    }

    // Update or create buyer progress with selected listing
    let buyerProgress = await getPrisma().buyerProgress.findFirst({
      where: { buyerId }
    });

    if (buyerProgress) {
      buyerProgress = await getPrisma().buyerProgress.update({
        where: { id: buyerProgress.id },
        data: {
          selectedListingId: listingId,
          currentStep: 1, // Move to step 1 (Messages) after selecting listing
          completedSteps: [0] // Mark step 0 (Listing Selection) as completed
        }
      });
    } else {
      buyerProgress = await getPrisma().buyerProgress.create({
        data: {
          buyerId,
          selectedListingId: listingId,
          currentStep: 1, // Move to step 1 (Messages) after selecting listing  
          completedSteps: [0] // Mark step 0 (Listing Selection) as completed
        }
      });
    }

    // Add buyer to listing's buyers list if not already there
    await getPrisma().listing.update({
      where: { id: listingId },
      data: {
        buyers: {
          connect: { id: buyerId }
        }
      }
    });

    res.json({ 
      message: 'Listing selected successfully',
      listing,
      progress: buyerProgress
    });
  } catch (error) {
    console.error('Error selecting listing:', error);
    next(error);
  }
};

// Update step progress
const updateStep: RequestHandler = async (req, res, next) => {
  const typedReq = req as AuthenticatedRequest;
  try {
    const buyerId = typedReq.user?.id;
    const { stepId } = req.body;
    
    if (!buyerId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    let buyerProgress = await getPrisma().buyerProgress.findFirst({
      where: { buyerId }
    });

    if (!buyerProgress) {
      buyerProgress = await getPrisma().buyerProgress.create({
        data: {
          buyerId,
          currentStep: 0,
          completedSteps: [],
          selectedListingId: null
        }
      });
    }

    const completedStepsArray = buyerProgress.completedSteps as number[] || [];
    
    // If the step hasn't been completed, add it to the completed list
    if (!completedStepsArray.includes(stepId)) {
      completedStepsArray.push(stepId);
    }

    // Update current step (if this step is greater than the current step)
    const newCurrentStep = Math.max(buyerProgress.currentStep, stepId + 1);

    await getPrisma().buyerProgress.update({
      where: { id: buyerProgress.id },
      data: {
        currentStep: newCurrentStep,
        completedSteps: completedStepsArray
      }
    });

    res.json({ message: 'Step updated successfully' });
  } catch (error) {
    console.error('Error updating step:', error);
    next(error);
  }
};

// Get documents for a specific step
const getStepDocuments: RequestHandler = async (req, res, next) => {
  const typedReq = req as AuthenticatedRequest;
  try {
    const buyerId = typedReq.user?.id;
    const stepId = parseInt(req.params.stepId);
    
    if (!buyerId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const documents = await getPrisma().document.findMany({
      where: { 
        buyerId,
        stepId
      },
      orderBy: { createdAt: 'desc' }
    });

    const stepRequirement = BUYER_STEP_DOCUMENT_REQUIREMENTS[stepId as keyof typeof BUYER_STEP_DOCUMENT_REQUIREMENTS];

    res.json({
      documents,
      requirement: stepRequirement
    });
  } catch (error) {
    console.error('Error fetching step documents:', error);
    next(error);
  }
};

// Record document upload for a step
const uploadStepDocument: RequestHandler = async (req, res, next) => {
  const typedReq = req as AuthenticatedRequest;
  try {
    const buyerId = typedReq.user?.id;
    const stepId = parseInt(req.params.stepId);
    const { fileName, fileUrl, fileSize } = req.body;
    
    if (!buyerId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Get buyer progress to get selected listing
    const buyerProgress = await getPrisma().buyerProgress.findFirst({
      where: { buyerId }
    });

    const stepRequirement = BUYER_STEP_DOCUMENT_REQUIREMENTS[stepId as keyof typeof BUYER_STEP_DOCUMENT_REQUIREMENTS];
    
    if (!stepRequirement) {
      res.status(400).json({ message: 'Invalid step ID' });
      return;
    }

    const document = await getPrisma().document.create({
      data: {
        type: stepRequirement.type as any,
        category: 'BUYER_UPLOAD',        // buyer上传的文件
        buyerId,
        stepId,
        listingId: buyerProgress?.selectedListingId,
        fileName,
        url: fileUrl,
        fileSize,
        uploadedBy: buyerId,             // buyer自己上传
        operationType: 'UPLOAD',
        uploadedAt: new Date(),
        status: 'COMPLETED'
      }
    });

    res.json({ document });
  } catch (error) {
    console.error('Error uploading step document:', error);
    next(error);
  }
};

// Record document download for a step
const downloadStepDocument: RequestHandler = async (req, res, next) => {
  const typedReq = req as AuthenticatedRequest;
  try {
    const buyerId = typedReq.user?.id;
    const stepId = parseInt(req.params.stepId);
    
    if (!buyerId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Get buyer progress to get selected listing
    const buyerProgress = await getPrisma().buyerProgress.findFirst({
      where: { buyerId }
    });

    const stepRequirement = BUYER_STEP_DOCUMENT_REQUIREMENTS[stepId as keyof typeof BUYER_STEP_DOCUMENT_REQUIREMENTS];
    
    if (!stepRequirement) {
      res.status(400).json({ message: 'Invalid step ID' });
      return;
    }

    // Check if download record already exists
    let document = await getPrisma().document.findFirst({
      where: {
        buyerId,
        stepId,
        operationType: 'DOWNLOAD'
      }
    });

    if (!document) {
      document = await getPrisma().document.create({
        data: {
          type: stepRequirement.type as any,
          buyerId,
          stepId,
          listingId: buyerProgress?.selectedListingId,
          operationType: 'DOWNLOAD',
          downloadedAt: new Date(),
          status: 'COMPLETED'
        }
      });
    } else {
      // Update download time
      document = await getPrisma().document.update({
        where: { id: document.id },
        data: { downloadedAt: new Date() }
      });
    }

    res.json({ document });
  } catch (error) {
    console.error('Error recording document download:', error);
    next(error);
  }
};

// 获取buyer为某个listing上传的文件
router.get('/listings/:listingId/documents', authenticateBuyer, async (req, res): Promise<void> => {
  try {
    const { listingId } = req.params;
    const typedReq = req as AuthenticatedRequest;
    
    if (!typedReq.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const documents = await getPrisma().document.findMany({
      where: {
        listingId,
        buyerId: typedReq.user.id,
        category: 'BUYER_UPLOAD' // 只获取buyer上传的文件
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
      message: 'Failed to fetch documents',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// buyer为listing上传文件
router.post('/listings/:listingId/documents', upload.single('file'), authenticateBuyer, async (req, res): Promise<void> => {
  try {
    const { listingId } = req.params;
    const { documentType } = req.body;
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
    const listing = await getPrisma().listing.findFirst({
      where: { 
        id: listingId,
        status: 'ACTIVE'
      }
    });

    if (!listing) {
      res.status(404).json({ message: 'Listing not found or not active' });
      return;
    }

    // 上传文件到Supabase
    const bucketName = getStorageBucket();
    const fileName = `listings/${listingId}/buyer/documents/${Date.now()}-${file.originalname}`;

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
        category: 'BUYER_UPLOAD',        // buyer上传的文件
        fileName: file.originalname,
        fileSize: file.size,
        url: publicUrl,
        listingId,
        sellerId: listing.sellerId,      // 使用 listing 的实际 sellerId
        buyerId: typedReq.user.id,
        uploadedBy: typedReq.user.id,     // buyer自己上传
        uploadedAt: new Date(),
        status: 'COMPLETED',
        operationType: 'UPLOAD',          // 这是上传操作
        stepId: req.body.stepId ? parseInt(req.body.stepId) : undefined  // 添加 stepId
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
        url: document.url
      }
    });
  } catch (error: unknown) {
    console.error('Error uploading buyer document:', error);
    res.status(500).json({ 
      message: 'Failed to upload document',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// buyer删除自己上传的文件
router.delete('/listings/:listingId/documents/:documentId', authenticateBuyer, async (req, res): Promise<void> => {
  try {
    const { listingId, documentId } = req.params;
    const typedReq = req as AuthenticatedRequest;
    
    if (!typedReq.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // 查找文档，确保是该buyer上传的
    const document = await getPrisma().document.findFirst({
      where: {
        id: documentId,
        listingId,
        buyerId: typedReq.user.id,
        category: 'BUYER_UPLOAD'
      }
    });

    if (!document) {
      res.status(404).json({ message: 'Document not found or access denied' });
      return;
    }

    // 从Supabase存储中删除文件
    if (document.url) {
      const bucketName = getStorageBucket();
      // 从URL中提取文件路径
      const urlParts = document.url.split('/');
      const filePathIndex = urlParts.findIndex((part: string) => part === 'public') + 1;
      if (filePathIndex > 0) {
        const filePath = urlParts.slice(filePathIndex + 1).join('/'); // 跳过bucket名称
        
        await supabase.storage
          .from(bucketName)
          .remove([filePath]);
      }
    }

    // 从数据库中删除记录
    await getPrisma().document.delete({
      where: { id: documentId }
    });

    res.json({ message: 'Document deleted successfully' });
  } catch (error: unknown) {
    console.error('Error deleting buyer document:', error);
    res.status(500).json({ 
      message: 'Failed to delete document',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get buyer's currently selected listing
const getCurrentListing: RequestHandler = async (req, res, next) => {
  const typedReq = req as AuthenticatedRequest;
  try {
    const buyerId = typedReq.user?.id;
    if (!buyerId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const buyerProgress = await getPrisma().buyerProgress.findUnique({
      where: {
        buyerId: buyerId
      },
      include: {
        selectedListing: {
          include: {
            seller: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!buyerProgress || !buyerProgress.selectedListing) {
      res.json({ 
        listing: null,
        needsSelection: true 
      });
      return;
    }

    res.json({ 
      listing: buyerProgress.selectedListing,
      needsSelection: false,
      currentStep: buyerProgress.currentStep,
      completedSteps: buyerProgress.completedSteps
    });
  } catch (error) {
    console.error('Error fetching current listing:', error);
    next(error);
  }
};

// 获取broker/agent为buyer的listing提供的文件
router.get('/listings/:listingId/agent-documents', authenticateBuyer, async (req, res): Promise<void> => {
  try {
    const { listingId } = req.params;
    const typedReq = req as AuthenticatedRequest;
    
    if (!typedReq.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // 验证buyer是否对该listing有兴趣
    const buyerProgress = await getPrisma().buyerProgress.findFirst({
      where: { 
        buyerId: typedReq.user.id,
        selectedListingId: listingId
      }
    });

    if (!buyerProgress) {
      res.status(404).json({ message: 'Listing not found or not in your interests' });
      return;
    }

    // 获取broker/agent为该listing提供的文档
    const documents = await getPrisma().document.findMany({
      where: {
        listingId,
        category: 'AGENT_PROVIDED' // 获取broker/agent提供的文件
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

    console.log('=== Debug: Buyer Agent Documents Query ===');
    console.log('Buyer ID:', typedReq.user.id);
    console.log('Listing ID:', listingId);
    console.log('Query conditions:', { listingId, category: 'AGENT_PROVIDED' });
    console.log('Found documents count:', documents.length);
    console.log('Found documents:', documents.map((doc: any) => ({
      id: doc.id,
      type: doc.type,
      fileName: doc.fileName,
      url: doc.url,
      category: doc.category,
      uploadedBy: doc.uploadedBy
    })));

    res.json({ documents });
  } catch (error: unknown) {
    console.error('Error fetching broker/agent documents:', error);
    res.status(500).json({ 
      message: 'Failed to fetch broker/agent documents',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// 记录buyer下载agent提供的文档
router.post('/download-agent-document/:documentId', authenticateBuyer, async (req, res): Promise<void> => {
  try {
    const { documentId } = req.params;
    const { stepId } = req.body;
    const typedReq = req as AuthenticatedRequest;
    const buyerId = typedReq.user?.id;
    
    console.log('=== Download Agent Document Debug ===');
    console.log('documentId:', documentId);
    console.log('stepId from body:', stepId);
    console.log('buyerId:', buyerId);
    
    if (!buyerId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // 获取要下载的文档
    const sourceDocument = await getPrisma().document.findFirst({
      where: {
        id: documentId,
        category: 'AGENT_PROVIDED'
      }
    });

    if (!sourceDocument) {
      res.status(404).json({ message: 'Document not found' });
      return;
    }

    console.log('Source document found:', {
      id: sourceDocument.id,
      type: sourceDocument.type,
      listingId: sourceDocument.listingId
    });

    // 获取buyer进度以验证listing
    const buyerProgress = await getPrisma().buyerProgress.findFirst({
      where: { buyerId }
    });

    if (!buyerProgress || buyerProgress.selectedListingId !== sourceDocument.listingId) {
      res.status(403).json({ message: 'Access denied: listing not selected' });
      return;
    }

    console.log('Buyer progress validated');

    const parsedStepId = parseInt(stepId);
    console.log('Parsed stepId:', parsedStepId);

    // 检查是否已有下载记录
    const existingDownload = await getPrisma().document.findFirst({
      where: {
        buyerId,
        stepId: parsedStepId,
        type: sourceDocument.type,
        operationType: 'DOWNLOAD'
      }
    });

    console.log('Existing download record:', existingDownload ? 'Found' : 'None');

    let downloadDocument;
    
    if (!existingDownload) {
      console.log('Creating minimal download record...');
      
      // 创建最简化的下载记录 - 包含必要的stepId和listingId
      downloadDocument = await getPrisma().document.create({
        data: {
          type: sourceDocument.type,
          sellerId: buyerId,  // 使用sellerId字段（必需字段）
          buyerId: buyerId,
          stepId: parsedStepId,        // 设置stepId
          listingId: sourceDocument.listingId,  // 设置listingId
          operationType: 'DOWNLOAD',
          status: 'COMPLETED',
          category: 'AGENT_PROVIDED',
          downloadedAt: new Date()
        }
      });
      console.log('Minimal download record created:', downloadDocument.id);
    } else {
      // 更新下载时间
      downloadDocument = await getPrisma().document.update({
        where: { id: existingDownload.id },
        data: { 
          downloadedAt: new Date(),
          status: 'COMPLETED'
        }
      });
      console.log('Existing download record updated:', downloadDocument.id);
    }

    res.json({ 
      message: 'Download recorded successfully',
      document: downloadDocument
    });
  } catch (error: any) {
    console.error('Error recording document download:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Failed to record download',
      error: error.message 
    });
  }
});

// 获取尽职调查文档请求和上传文件
router.get('/listings/:listingId/due-diligence', authenticateBuyer, async (req, res): Promise<void> => {
  try {
    const { listingId } = req.params;
    const typedReq = req as AuthenticatedRequest;
    
    if (!typedReq.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // 验证buyer是否对该listing有兴趣
    const buyerProgress = await getPrisma().buyerProgress.findFirst({
      where: { 
        buyerId: typedReq.user.id,
        selectedListingId: listingId
      }
    });

    if (!buyerProgress) {
      res.status(404).json({ message: 'Listing not found or not in your interests' });
      return;
    }

    // 获取文档请求记录
    const requests = await getPrisma().dueDiligenceRequest.findMany({
      where: {
        listingId,
        buyerId: typedReq.user.id
      }
    });

    // 获取已上传的尽职调查文档
    const documents = await getPrisma().document.findMany({
      where: {
        listingId,
        buyerId: typedReq.user.id, // Add buyerId filter to get documents for this specific buyer
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
        documentName: doc.fileName?.split(' - ')[0] || doc.fileName?.replace(/\.[^/.]+$/, "") || doc.type, // Extract document name from fileName format "DocumentName - originalfile.ext"
        fileName: doc.fileName,
        url: doc.url,
        uploadedAt: doc.uploadedAt,
        uploadedBy: doc.uploadedBy,
        uploaderName: doc.uploader?.name,
        fileSize: doc.fileSize
      }))
    });
  } catch (error: unknown) {
    console.error('Error fetching due diligence data:', error);
    res.status(500).json({ 
      message: 'Failed to fetch due diligence data',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// buyer请求特定的尽职调查文档
router.post('/listings/:listingId/due-diligence/request', authenticateBuyer, async (req, res): Promise<void> => {
  try {
    const { listingId } = req.params;
    const { documentName, requested } = req.body;
    const typedReq = req as AuthenticatedRequest;
    
    if (!typedReq.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Use the authenticated user's ID directly
    const buyerId = typedReq.user.id;

    if (requested) {
      // 创建或更新请求记录
      await getPrisma().dueDiligenceRequest.upsert({
        where: {
          listingId_buyerId_documentName: {
            listingId,
            buyerId,
            documentName
          }
        },
        update: {
          requestedAt: new Date(),
          status: 'REQUESTED'
        },
        create: {
          listingId,
          buyerId,
          documentName,
          requestedAt: new Date(),
          status: 'REQUESTED'
        }
      });
    } else {
      // 删除请求记录
      await getPrisma().dueDiligenceRequest.deleteMany({
        where: {
          listingId,
          buyerId,
          documentName
        }
      });
    }

    res.json({ message: 'Document request updated successfully' });
  } catch (error: unknown) {
    console.error('Error updating document request:', error);
    res.status(500).json({ 
      message: 'Failed to update document request',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// buyer记录下载尽职调查文档
router.post('/listings/:listingId/due-diligence/download', authenticateBuyer, async (req, res): Promise<void> => {
  try {
    const { listingId } = req.params;
    const { documentId, stepId } = req.body;
    const typedReq = req as AuthenticatedRequest;
    
    if (!typedReq.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // 获取原始文档
    const sourceDocument = await getPrisma().document.findFirst({
      where: {
        id: documentId,
        listingId,
        type: 'DUE_DILIGENCE',
        category: 'AGENT_PROVIDED'
      }
    });

    if (!sourceDocument) {
      res.status(404).json({ message: 'Document not found' });
      return;
    }

    // 记录下载
    await getPrisma().document.create({
      data: {
        type: 'DUE_DILIGENCE',
        sellerId: typedReq.user.id, // Required field
        buyerId: typedReq.user.id,
        stepId: parseInt(stepId),
        listingId,
        operationType: 'DOWNLOAD',
        status: 'COMPLETED',
        category: 'AGENT_PROVIDED',
        downloadedAt: new Date(),
        fileName: sourceDocument.fileName,
        url: sourceDocument.url
      }
    });

    res.json({ message: 'Download recorded successfully' });
  } catch (error: unknown) {
    console.error('Error recording download:', error);
    res.status(500).json({ 
      message: 'Failed to record download',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Pre-Close Checklist APIs for Buyer
// 获取listing的pre-close checklist (Buyer只能访问自己选择的listing的checklist)
router.get('/listings/:listingId/pre-close-checklist', authenticateBuyer, async (req, res): Promise<void> => {
  try {
    const { listingId } = req.params;
    const typedReq = req as AuthenticatedRequest;
    
    if (!typedReq.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // 验证buyer是否对该listing有兴趣
    const buyerProgress = await getPrisma().buyerProgress.findFirst({
      where: { 
        buyerId: typedReq.user.id,
        selectedListingId: listingId
      }
    });

    if (!buyerProgress) {
      res.status(404).json({ message: 'Listing not found or not in your interests' });
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

// 更新checklist item (Buyer可以更新任何item，实现协作)
router.put('/listings/:listingId/pre-close-checklist/item', authenticateBuyer, async (req, res): Promise<void> => {
  try {
    const { listingId } = req.params;
    const { categoryId, itemId, userRole } = req.body;
    const typedReq = req as AuthenticatedRequest;
    
    if (!typedReq.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // 验证buyer是否对该listing有兴趣
    const buyerProgress = await getPrisma().buyerProgress.findFirst({
      where: { 
        buyerId: typedReq.user.id,
        selectedListingId: listingId
      }
    });

    if (!buyerProgress) {
      res.status(404).json({ message: 'Listing not found or not in your interests' });
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
      typedReq.user.id,
      typedReq.user.name,
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
      lastUpdatedBy: typedReq.user.name,
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

// Helper functions (same as in seller.ts and broker.ts)
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

router.get('/dashboard', authenticateBuyer, getDashboardStats);
router.get('/listings', authenticateBuyer, getListings);
router.get('/progress', authenticateBuyer, getProgress);
router.post('/select-listing', authenticateBuyer, selectListing);
router.post('/update-step', authenticateBuyer, updateStep);
router.get('/step/:stepId/documents', authenticateBuyer, getStepDocuments);
router.post('/step/:stepId/upload', authenticateBuyer, uploadStepDocument);
router.post('/step/:stepId/download', authenticateBuyer, downloadStepDocument);
router.get('/current-listing', authenticateBuyer, getCurrentListing);

export default router; 