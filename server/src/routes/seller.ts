import { Router, RequestHandler } from 'express';
import { getPrisma } from '../../database';
import { authenticateSeller } from '../middleware/auth';
import { AuthenticatedRequest } from '../types/custom';
import type { Document } from '../../generated/prisma-preview';
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

// Get seller dashboard data
const getDashboardStats: RequestHandler = async (req, res, next) => {
  const typedReq = req as AuthenticatedRequest;
  try {
    const sellerId = typedReq.user?.id;
    if (!sellerId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Get seller's progress information
    const sellerProgress = await prisma.sellerProgress.findFirst({
      where: { sellerId }
    });

    const currentStep = sellerProgress?.currentStep || 0;
    const totalSteps = 11; // Total 11 steps

    res.json({
      stats: {
      currentStep,
        totalSteps,
        completedSteps: currentStep,
        selectedListingId: sellerProgress?.selectedListingId
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    next(error);
  }
};

// Get seller's listings - updated to return all listings with buyer info
const getListings: RequestHandler = async (req, res, next) => {
  const typedReq = req as AuthenticatedRequest;
  try {
    const sellerId = typedReq.user?.id;
    if (!sellerId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const listings = await prisma.listing.findMany({
      where: { sellerId },
      include: {
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

    res.json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    next(error);
  }
};

// Get seller's progress information with document requirements
const getProgress: RequestHandler = async (req, res, next) => {
  const typedReq = req as AuthenticatedRequest;
  try {
    const sellerId = typedReq.user?.id;
    if (!sellerId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    let sellerProgress = await prisma.sellerProgress.findFirst({
      where: { sellerId }
    });

    // If no progress record exists, create a new one
    if (!sellerProgress) {
      sellerProgress = await prisma.sellerProgress.create({
        data: {
          sellerId,
          currentStep: 0,
          completedSteps: [],
          selectedListingId: null
        }
      });
    }

    // Get documents for each step
    const documents = await prisma.document.findMany({
      where: { 
        sellerId,
        stepId: { not: null }
      }
    });

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

    // Check real step completion status
    let currentStep = 0;
    const completedSteps: number[] = [];
    
    // Check each step individually
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      
      console.log(`Checking step ${step.id}: ${step.title}`);
      
      // Check if this step is completed using real logic
      const isCompleted = await checkStepCompletion(sellerId, step.id, sellerProgress.selectedListingId);
      step.completed = isCompleted;
      
      console.log(`Step ${step.id} completed: ${isCompleted}`);
      
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
    // A step is accessible only if all previous steps are completed
    steps.forEach((step, index) => {
      if (index === 0) {
        // First step is always accessible
        step.accessible = true;
      } else {
        // Other steps are accessible only if the previous step is completed
        step.accessible = steps[index - 1].completed;
      }
      
      // Add document requirement information
      const stepDoc = STEP_DOCUMENT_REQUIREMENTS[step.id as keyof typeof STEP_DOCUMENT_REQUIREMENTS];
      if (stepDoc) {
        (step as any).documentRequirement = stepDoc;
        (step as any).documents = documents.filter((doc: any) => doc.stepId === step.id);
      }
    });

    // Update seller progress in database
    await prisma.sellerProgress.update({
      where: { id: sellerProgress.id },
      data: {
        currentStep,
        completedSteps
      }
    });

    res.json({
      progress: {
        currentStep,
        steps,
        selectedListingId: sellerProgress.selectedListingId
      }
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    next(error);
  }
};

// Select a listing - updated to return listing info
const selectListing: RequestHandler = async (req, res, next) => {
  const typedReq = req as AuthenticatedRequest;
  try {
    const sellerId = typedReq.user?.id;
    const { listingId } = req.body;
    
    if (!sellerId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (!listingId) {
      res.status(400).json({ error: 'Listing ID is required' });
      return;
    }

    // Verify the listing belongs to this seller
    const listing = await prisma.listing.findFirst({
      where: { 
        id: listingId,
        sellerId: sellerId
      },
      include: {
        buyers: true
      }
    });

    if (!listing) {
      res.status(404).json({ error: 'Listing not found or not owned by this seller' });
      return;
    }

    // Update or create seller progress with selected listing
    let sellerProgress = await prisma.sellerProgress.findFirst({
      where: { sellerId }
    });

    if (sellerProgress) {
      sellerProgress = await prisma.sellerProgress.update({
        where: { id: sellerProgress.id },
        data: {
          selectedListingId: listingId,
          currentStep: 1, // Move to step 1 (Messages) after selecting listing
          completedSteps: [0] // Mark step 0 (Home/Listing Selection) as completed
        }
      });
    } else {
      sellerProgress = await prisma.sellerProgress.create({
        data: {
          sellerId,
          selectedListingId: listingId,
          currentStep: 1, // Move to step 1 (Messages) after selecting listing  
          completedSteps: [0] // Mark step 0 (Home/Listing Selection) as completed
        }
      });
    }

    res.json({ 
      message: 'Listing selected successfully',
      listing,
      progress: sellerProgress
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
    const sellerId = typedReq.user?.id;
    const { stepId } = req.body;
    
    if (!sellerId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    let sellerProgress = await prisma.sellerProgress.findFirst({
      where: { sellerId }
    });

    if (!sellerProgress) {
      sellerProgress = await prisma.sellerProgress.create({
        data: {
          sellerId,
          currentStep: 0,
          completedSteps: [],
          selectedListingId: null
        }
      });
    }

    const completedStepsArray = sellerProgress.completedSteps as number[] || [];
    
    // If the step hasn't been completed, add it to the completed list
    if (!completedStepsArray.includes(stepId)) {
      completedStepsArray.push(stepId);
    }

    // Update current step (if this step is greater than the current step)
    const newCurrentStep = Math.max(sellerProgress.currentStep, stepId + 1);

    await prisma.sellerProgress.update({
      where: { id: sellerProgress.id },
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
    const sellerId = typedReq.user?.id;
    const stepId = parseInt(req.params.stepId);
    
    if (!sellerId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const documents = await prisma.document.findMany({
      where: { 
        sellerId,
        stepId
      },
      orderBy: { createdAt: 'desc' }
    });

    const stepRequirement = STEP_DOCUMENT_REQUIREMENTS[stepId as keyof typeof STEP_DOCUMENT_REQUIREMENTS];

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
    const sellerId = typedReq.user?.id;
    const stepId = parseInt(req.params.stepId);
    const { fileName, fileUrl, fileSize } = req.body;
    
    if (!sellerId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Get seller progress to get selected listing
    const sellerProgress = await prisma.sellerProgress.findFirst({
      where: { sellerId }
    });

    const stepRequirement = STEP_DOCUMENT_REQUIREMENTS[stepId as keyof typeof STEP_DOCUMENT_REQUIREMENTS];
    
    if (!stepRequirement) {
      res.status(400).json({ message: 'Invalid step ID' });
      return;
    }

    const document = await prisma.document.create({
      data: {
        type: stepRequirement.type as any,
        category: 'SELLER_UPLOAD',        // seller上传的文件
        sellerId,
        stepId,
        listingId: sellerProgress?.selectedListingId,
        fileName,
        url: fileUrl,
        fileSize,
        uploadedBy: sellerId,             // seller自己上传
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
    const sellerId = typedReq.user?.id;
    const stepId = parseInt(req.params.stepId);
    
    if (!sellerId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Get seller progress to get selected listing
    const sellerProgress = await prisma.sellerProgress.findFirst({
      where: { sellerId }
    });

    const stepRequirement = STEP_DOCUMENT_REQUIREMENTS[stepId as keyof typeof STEP_DOCUMENT_REQUIREMENTS];
    
    if (!stepRequirement) {
      res.status(400).json({ message: 'Invalid step ID' });
      return;
    }

    // Check if download record already exists
    let document = await prisma.document.findFirst({
      where: {
        sellerId,
        stepId,
        operationType: 'DOWNLOAD'
      }
    });

    if (!document) {
      document = await prisma.document.create({
        data: {
          type: stepRequirement.type as any,
          sellerId,
          stepId,
          listingId: sellerProgress?.selectedListingId,
          operationType: 'DOWNLOAD',
          downloadedAt: new Date(),
          status: 'COMPLETED'
        }
      });
    } else {
      // Update download time
      document = await prisma.document.update({
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

// 获取seller为某个listing上传的文件
router.get('/listings/:listingId/documents', authenticateSeller, async (req, res): Promise<void> => {
  try {
    const { listingId } = req.params;
    const typedReq = req as AuthenticatedRequest;
    
    if (!typedReq.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const documents = await prisma.document.findMany({
      where: {
        listingId,
        sellerId: typedReq.user.id,
        category: 'SELLER_UPLOAD' // 只获取seller上传的文件
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
    console.error('Error fetching seller documents:', error);
    res.status(500).json({ 
      message: 'Failed to fetch documents',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// seller为listing上传文件
router.post('/listings/:listingId/documents', upload.single('file'), authenticateSeller, async (req, res): Promise<void> => {
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

    // 检查listing是否存在且属于该seller
    const listing = await prisma.listing.findFirst({
      where: { 
        id: listingId,
        sellerId: typedReq.user.id
      }
    });

    if (!listing) {
      res.status(404).json({ message: 'Listing not found or not owned by seller' });
      return;
    }

    // 上传文件到Supabase
    const bucketName = getStorageBucket();
    const fileName = `seller-docs/${listingId}/${Date.now()}-${file.originalname}`;

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
        category: 'SELLER_UPLOAD',        // seller上传的文件
        fileName: file.originalname,
        fileSize: file.size,
        url: publicUrl,
        listingId,
        sellerId: typedReq.user.id,
        uploadedBy: typedReq.user.id,     // seller自己上传
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
    console.error('Error uploading seller document:', error);
    res.status(500).json({ 
      message: 'Failed to upload document',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Check if a specific step is completed
const checkStepCompletion = async (sellerId: string, stepId: number, listingId?: string | null): Promise<boolean> => {
  console.log(`checkStepCompletion called for sellerId: ${sellerId}, stepId: ${stepId}, listingId: ${listingId}`);
  
  // First, check if all previous steps are completed (except for step 0)
  if (stepId > 0) {
    // Check all previous steps
    for (let i = 0; i < stepId; i++) {
      const previousStepCompleted = await checkStepCompletionInternal(sellerId, i, listingId);
      if (!previousStepCompleted) {
        console.log(`Step ${stepId} cannot be completed because step ${i} is not completed`);
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
      // Check if listing has been selected
      const result0 = !!listingId;
      console.log(`Step 0 result: ${result0}`);
      return result0;
      
    case 1: // Email agent
      // Check if seller has sent any messages
      console.log(`Checking messages for sellerId: ${sellerId}`);
      const sentMessages = await prisma.message.findFirst({
        where: { 
          senderId: sellerId
        }
      });
      console.log(`Found sent messages:`, sentMessages);
      const result1 = !!sentMessages;
      console.log(`Step 1 result: ${result1}`);
      return result1;
      
    case 2: // Download listing agreement  
      // Check if listing agreement was downloaded
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
      // Check if questionnaire was uploaded
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
      // Check if financial documents were uploaded
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
      // This step should only be considered completed if previous steps are done
      // AND there are buyers interested in the listing
      // For now, we'll make it automatically complete when there are buyers
      // but in a real implementation, this might require seller to review buyer activity
      if (listingId) {
        const listing = await prisma.listing.findFirst({
          where: { id: listingId },
          include: { buyers: true }
        });
        // Only mark as completed if there are buyers AND this step should be accessible
        // For now, let's make it not auto-complete to maintain proper sequence
        return false; // Changed to false to maintain proper step sequence
      }
      return false;
      
    case 6: // Download purchase contract
      // Mock - will be replaced with real logic
      return false; // Usually not completed until later in process
      
    case 7: // Upload due diligence
      // Check if due diligence documents were uploaded
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
      // Mock - will be replaced with real logic
      return false; // Usually not completed until end of process
      
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

// Get seller's currently selected listing
const getCurrentListing: RequestHandler = async (req, res, next) => {
  const typedReq = req as AuthenticatedRequest;
  try {
    const sellerId = typedReq.user?.id;
    if (!sellerId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const sellerProgress = await prisma.sellerProgress.findUnique({
      where: {
        sellerId: sellerId
      },
      include: {
        selectedListing: {
          include: {
            buyers: {
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

    if (!sellerProgress || !sellerProgress.selectedListing) {
      res.json({ 
        listing: null,
        needsSelection: true 
      });
      return;
    }

    res.json({ 
      listing: sellerProgress.selectedListing,
      needsSelection: false,
      currentStep: sellerProgress.currentStep,
      completedSteps: sellerProgress.completedSteps
    });
  } catch (error) {
    console.error('Error fetching current listing:', error);
    next(error);
  }
};

router.get('/dashboard', authenticateSeller, getDashboardStats);
router.get('/listings', authenticateSeller, getListings);
router.get('/progress', authenticateSeller, getProgress);
router.post('/select-listing', authenticateSeller, selectListing);
router.post('/update-step', authenticateSeller, updateStep);
router.get('/step/:stepId/documents', authenticateSeller, getStepDocuments);
router.post('/step/:stepId/upload', authenticateSeller, uploadStepDocument);
router.post('/step/:stepId/download', authenticateSeller, downloadStepDocument);
router.get('/current-listing', authenticateSeller, getCurrentListing);

export default router; 