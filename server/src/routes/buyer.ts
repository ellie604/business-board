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
  2: { type: 'NDA', operationType: 'UPLOAD', description: 'Fill out Non Disclosure agreement online' },
  3: { type: 'FINANCIAL_STATEMENT', operationType: 'UPLOAD', description: 'Fill out financial statement online' },
  4: { type: 'CBR_CIM', operationType: 'DOWNLOAD', description: 'Download CBR or CIM for the business' },
  5: { type: 'UPLOADED_DOC', operationType: 'UPLOAD', description: 'Upload documents' },
  6: { type: 'PURCHASE_CONTRACT', operationType: 'DOWNLOAD', description: 'Download your purchase contract' },
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

    let buyerProgress = await getPrisma().buyerProgress.findFirst({
      where: { buyerId }
    });

    // If no progress record exists, create a new one
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

    // Get documents for each step
    const documents = await getPrisma().document.findMany({
      where: {
        buyerId,
        stepId: { not: null }
      }
    });

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

    // Check real step completion status
    let currentStep = 0;
    const completedSteps: number[] = [];
    
    // Check each step individually
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      
      console.log(`Checking buyer step ${step.id}: ${step.title}`);
      
      // Check if this step is completed using real logic
      const isCompleted = await checkBuyerStepCompletion(buyerId, step.id, buyerProgress.selectedListingId);
      step.completed = isCompleted;
      
      console.log(`Buyer step ${step.id} completed: ${isCompleted}`);
      
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

    // Update buyer progress in database
    await getPrisma().buyerProgress.update({
      where: { id: buyerProgress.id },
      data: {
        currentStep,
        completedSteps
      }
    });

    res.json({
      progress: {
        currentStep,
        steps,
        selectedListingId: buyerProgress.selectedListingId
      }
    });
  } catch (error) {
    console.error('Error fetching buyer progress:', error);
    next(error);
  }
};

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
        buyerId: typedReq.user.id,
        uploadedBy: typedReq.user.id,     // buyer自己上传
        uploadedAt: new Date(),
        status: 'COMPLETED',
        operationType: 'UPLOAD'           // 这是上传操作
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

// Check if a specific buyer step is completed
const checkBuyerStepCompletion = async (buyerId: string, stepId: number, listingId?: string | null): Promise<boolean> => {
  console.log(`checkBuyerStepCompletion called for buyerId: ${buyerId}, stepId: ${stepId}, listingId: ${listingId}`);
  
  // First, check if all previous steps are completed (except for step 0)
  if (stepId > 0) {
    // Check all previous steps
    for (let i = 0; i < stepId; i++) {
      const previousStepCompleted = await checkBuyerStepCompletionInternal(buyerId, i, listingId);
      if (!previousStepCompleted) {
        console.log(`Buyer step ${stepId} cannot be completed because step ${i} is not completed`);
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
      // Check if listing has been selected
      const result0 = !!listingId;
      console.log(`Buyer step 0 result: ${result0}`);
      return result0;
      
    case 1: // Email agent - FIXED: Only check if this buyer has selected this specific listing
      // For buyer, step 1 completion should only count if they've selected this listing AND sent messages
      if (!listingId) {
        console.log(`Buyer step 1: No listing selected`);
        return false; // No listing selected means step 1 cannot be completed
      }
      
      // Check if buyer has selected this specific listing
      const buyerProgress = await getPrisma().buyerProgress.findFirst({
        where: { 
          buyerId,
          selectedListingId: listingId 
        }
      });
      
      if (!buyerProgress) {
        console.log(`Buyer step 1: Haven't selected this listing (${listingId})`);
        return false; // Haven't selected this listing
      }
      
      // If they've selected this listing, check if they've sent any messages (global check is acceptable for now)
      console.log(`Checking messages for buyerId: ${buyerId}`);
      const sentMessages = await getPrisma().message.findFirst({
        where: { 
          senderId: buyerId
        }
      });
      console.log(`Found sent messages:`, sentMessages);
      const result1 = !!sentMessages;
      console.log(`Buyer step 1 result: ${result1}`);
      return result1;
      
    case 2: // Fill out NDA - should be tied to specific listing
      if (!listingId) return false;
      const ndaDoc = await getPrisma().document.findFirst({
        where: { 
          buyerId, 
          listingId, // Make sure it's for this specific listing
          stepId: 2, 
          type: 'NDA',
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
      
    case 7: // Download due diligence documents - should be tied to specific listing
      if (!listingId) return false;
      const dueDiligenceDoc = await getPrisma().document.findFirst({
        where: { 
          buyerId, 
          listingId, // Make sure it's for this specific listing
          stepId: 7, 
          type: 'DUE_DILIGENCE',
          operationType: 'DOWNLOAD',
          downloadedAt: { not: null }
        }
      });
      return !!dueDiligenceDoc;
      
    case 8: // Complete pre-closing checklist
      // Mock - will be replaced with real logic
      return false; // Usually not completed until later in process
      
    case 9: // Download closing docs
      // Mock - will be replaced with real logic
      return false; // Usually not completed until end of process
      
    case 10: // After sale
      // Mock - will be replaced with real logic  
      return false; // Only completed after successful sale
      
    default:
      return false;
  }
};

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