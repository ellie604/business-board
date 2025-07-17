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
  2: { type: 'LISTING_AGREEMENT', operationType: 'BOTH', description: 'Download, sign, and upload listing agreement' },
  3: { type: 'QUESTIONNAIRE', operationType: 'UPLOAD', description: 'Fill out business questionnaire' },
  4: { type: 'FINANCIAL_DOCUMENTS', operationType: 'UPLOAD', description: 'Upload financial documents' },
  5: { type: 'BUYER_ACTIVITY', operationType: 'NONE', description: 'View buyer activity updates' },
  6: { type: 'PURCHASE_AGREEMENT', operationType: 'BOTH', description: 'Download, sign, and upload purchase contract' },
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

    res.json({ listings }); // 修改：使用包装格式以保持与broker.ts一致
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

    // Batch fetch all required data to avoid N+1 queries
    const [documents, messages, questionnaire, preCloseChecklist] = await Promise.all([
      prisma.document.findMany({
        where: { 
          sellerId,
          stepId: { not: null }
        }
      }),
      prisma.message.findFirst({
        where: { senderId: sellerId }
      }),
      prisma.sellerQuestionnaire.findFirst({
        where: { 
          sellerId, 
          submitted: true,
          submittedAt: { not: null }
        }
      }),
      sellerProgress.selectedListingId ? prisma.preCloseChecklist.findUnique({
        where: { listingId: sellerProgress.selectedListingId }
      }) : Promise.resolve(null)
    ]);

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

    // Optimized step completion check using batched data
    let currentStep = 0;
    const completedSteps: number[] = [];
    
    // Check each step using batched data
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const isCompleted = checkStepCompletionOptimized(i, {
        sellerId,
        listingId: sellerProgress.selectedListingId,
        documents,
        messages,
        questionnaire,
        preCloseChecklist,
        completedStepsFromDB: sellerProgress.completedSteps as number[]
      });
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
      const stepDoc = STEP_DOCUMENT_REQUIREMENTS[step.id as keyof typeof STEP_DOCUMENT_REQUIREMENTS];
      if (stepDoc) {
        (step as any).documentRequirement = stepDoc;
        (step as any).documents = documents.filter((doc: any) => doc.stepId === step.id);
      }
    });

    // Update seller progress in database only if changed
    const completedStepsChanged = JSON.stringify(completedSteps) !== JSON.stringify(sellerProgress.completedSteps);
    const currentStepChanged = currentStep !== sellerProgress.currentStep;
    
    if (completedStepsChanged || currentStepChanged) {
      await prisma.sellerProgress.update({
        where: { id: sellerProgress.id },
        data: {
          currentStep,
          completedSteps
        }
      });
    }

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

// Optimized step completion check using batched data
function checkStepCompletionOptimized(stepId: number, data: {
  sellerId: string;
  listingId?: string | null;
  documents: any[];
  messages: any;
  questionnaire: any;
  preCloseChecklist: any;
  completedStepsFromDB: number[];
}): boolean {
  const { sellerId, listingId, documents, messages, questionnaire, preCloseChecklist, completedStepsFromDB } = data;
  
  switch (stepId) {
    case 0: // Select listing
      return !!listingId;
      
    case 1: // Email agent - automatically completed when step 0 is completed
      // Messages are not mandatory, so this step is automatically completed 
      // when the previous step (step 0) is completed
      return checkStepCompletionOptimized(0, data);
      
    case 2: // Listing agreement - now requires upload of signed agreement
      return documents.some(doc => 
        doc.stepId === 2 && 
        doc.type === 'LISTING_AGREEMENT' &&
        doc.operationType === 'UPLOAD' &&
        doc.category === 'SELLER_UPLOAD' &&
        doc.status === 'COMPLETED'
      );
      
    case 3: // Fill questionnaire
      if (!questionnaire) return false;
      return documents.some(doc =>
        doc.type === 'QUESTIONNAIRE' &&
        doc.category === 'SELLER_UPLOAD' &&
        doc.stepId === 3 &&
        doc.status === 'COMPLETED'
      );
      
    case 4: // Upload financial documents
      return documents.some(doc => 
        doc.stepId === 4 &&
        doc.category === 'SELLER_UPLOAD' &&
        doc.status === 'COMPLETED'
      );
      
    case 5: // Buyer activity - automatically completed when accessed
      // This step is automatically completed when the previous steps are done
      // and the user has accessed the buyer activity page
      return checkStepCompletionOptimized(4, data) || completedStepsFromDB.includes(5);
      
    case 6: // Purchase agreement - now requires upload of signed agreement
      return documents.some(doc => 
        doc.stepId === 6 && 
        (doc.type === 'PURCHASE_AGREEMENT' || doc.type === 'PURCHASE_CONTRACT') &&
        doc.operationType === 'UPLOAD' &&
        doc.category === 'SELLER_UPLOAD' &&
        doc.status === 'COMPLETED'
      );
      
    case 7: // Upload due diligence
      return documents.some(doc => 
        doc.stepId === 7 &&
        doc.category === 'SELLER_UPLOAD' &&
        doc.status === 'COMPLETED'
      );
      
    case 8: // Complete pre-closing checklist
      return completedStepsFromDB && Array.isArray(completedStepsFromDB) && completedStepsFromDB.includes(8);
      
    case 9: // Download closing docs
      return documents.some(doc => 
        doc.stepId === 9 && 
        doc.type === 'CLOSING_DOCS' &&
        doc.operationType === 'DOWNLOAD' &&
        doc.downloadedAt
      );
      
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
    
    console.log(`updateStep called:`, {
      sellerId,
      stepId,
      stepIdType: typeof stepId
    });
    
    if (!sellerId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    let sellerProgress = await prisma.sellerProgress.findFirst({
      where: { sellerId }
    });

    console.log(`Current seller progress:`, {
      id: sellerProgress?.id,
      currentStep: sellerProgress?.currentStep,
      completedSteps: sellerProgress?.completedSteps
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
      console.log(`Created new seller progress:`, sellerProgress);
    }

    const completedStepsArray = sellerProgress.completedSteps as number[] || [];
    
    console.log(`Before update:`, {
      completedStepsArray,
      stepIdToAdd: stepId,
      alreadyIncluded: completedStepsArray.includes(stepId)
    });
    
    // If the step hasn't been completed, add it to the completed list
    if (!completedStepsArray.includes(stepId)) {
      completedStepsArray.push(stepId);
      console.log(`Added step ${stepId} to completed steps`);
    } else {
      console.log(`Step ${stepId} already in completed steps`);
    }

    // Update current step (if this step is greater than the current step)
    const newCurrentStep = Math.max(sellerProgress.currentStep, stepId + 1);

    console.log(`Updating database with:`, {
      newCurrentStep,
      completedStepsArray
    });

    const updatedProgress = await prisma.sellerProgress.update({
      where: { id: sellerProgress.id },
      data: {
        currentStep: newCurrentStep,
        completedSteps: completedStepsArray
      }
    });

    console.log(`Database updated successfully:`, {
      id: updatedProgress.id,
      currentStep: updatedProgress.currentStep,
      completedSteps: updatedProgress.completedSteps
    });

    res.json({ 
      message: 'Step updated successfully',
      progress: updatedProgress
    });
  } catch (error) {
    console.error('Error updating step:', error);
    next(error);
  }
};

// Mark step as completed manually (for steps that require manual confirmation)
const markStepCompleted: RequestHandler = async (req, res, next) => {
  const typedReq = req as AuthenticatedRequest;
  try {
    const sellerId = typedReq.user?.id;
    const { stepId } = req.body;
    
    console.log(`markStepCompleted called:`, {
      sellerId,
      stepId,
      stepIdType: typeof stepId
    });
    
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
    
    // Add the step to completed steps if not already there
    if (!completedStepsArray.includes(stepId)) {
      completedStepsArray.push(stepId);
      console.log(`Manually marked step ${stepId} as completed`);
    }

    // Update current step to the next step if this step advances progress
    const newCurrentStep = Math.max(sellerProgress.currentStep, stepId + 1);

    const updatedProgress = await prisma.sellerProgress.update({
      where: { id: sellerProgress.id },
      data: {
        currentStep: newCurrentStep,
        completedSteps: completedStepsArray
      }
    });

    console.log(`Step ${stepId} manually marked as completed:`, {
      currentStep: updatedProgress.currentStep,
      completedSteps: updatedProgress.completedSteps
    });

    res.json({ 
      message: 'Step marked as completed successfully',
      progress: updatedProgress
    });
  } catch (error) {
    console.error('Error marking step as completed:', error);
    next(error);
  }
};

// Mark step as incomplete manually (for steps that require manual confirmation)
const markStepIncomplete: RequestHandler = async (req, res, next) => {
  const typedReq = req as AuthenticatedRequest;
  try {
    const sellerId = typedReq.user?.id;
    const { stepId } = req.body;
    
    console.log(`markStepIncomplete called:`, {
      sellerId,
      stepId,
      stepIdType: typeof stepId
    });
    
    if (!sellerId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    let sellerProgress = await prisma.sellerProgress.findFirst({
      where: { sellerId }
    });

    if (!sellerProgress) {
      res.status(404).json({ message: 'Seller progress not found' });
      return;
    }

    const completedStepsArray = sellerProgress.completedSteps as number[] || [];
    
    // Remove the step from completed steps if it exists
    const updatedCompletedSteps = completedStepsArray.filter(step => step !== stepId);
    console.log(`Manually marked step ${stepId} as incomplete`);

    // Update current step - if we're removing the current step, go back to the previous step
    let newCurrentStep = sellerProgress.currentStep;
    if (sellerProgress.currentStep > stepId) {
      newCurrentStep = stepId; // Go back to this step since it's now incomplete
    }

    const updatedProgress = await prisma.sellerProgress.update({
      where: { id: sellerProgress.id },
      data: {
        currentStep: newCurrentStep,
        completedSteps: updatedCompletedSteps
      }
    });

    console.log(`Step ${stepId} manually marked as incomplete:`, {
      currentStep: updatedProgress.currentStep,
      completedSteps: updatedProgress.completedSteps
    });

    res.json({ 
      message: 'Step marked as incomplete successfully',
      progress: updatedProgress
    });
  } catch (error) {
    console.error('Error marking step as incomplete:', error);
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

    console.log('Fetching documents for:', {
      listingId,
      sellerId: typedReq.user.id,
      category: 'SELLER_UPLOAD'
    });

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

    console.log('Found documents:', documents.map((doc: any) => ({
      id: doc.id,
      type: doc.type,
      fileName: doc.fileName,
      category: doc.category,
      sellerId: doc.sellerId,
      listingId: doc.listingId
    })));

    res.json({ documents });
  } catch (error: unknown) {
    console.error('Error fetching seller documents:', error);
    res.status(500).json({ 
      message: 'Failed to fetch documents',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// 获取broker/agent为seller的listing提供的文件
router.get('/listings/:listingId/broker-documents', authenticateSeller, async (req, res): Promise<void> => {
  try {
    const { listingId } = req.params;
    const typedReq = req as AuthenticatedRequest;
    
    if (!typedReq.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // 验证listing是否属于该seller
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

    // 获取broker/agent为该listing提供的文档
    const documents = await prisma.document.findMany({
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
    console.error('Error fetching broker/agent documents:', error);
    res.status(500).json({ 
      message: 'Failed to fetch broker/agent documents',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// seller为listing上传文件
router.post('/listings/:listingId/documents', upload.single('file'), authenticateSeller, async (req, res): Promise<void> => {
  try {
    const { listingId } = req.params;
    const { documentType, stepId } = req.body;
    const typedReq = req as AuthenticatedRequest;
    const file = req.file;

    console.log('Upload request received:', {
      listingId,
      documentType,
      stepId,
      fileName: file?.originalname,
      sellerId: typedReq.user?.id
    });

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
    const fileName = `listings/${listingId}/seller/documents/${Date.now()}-${file.originalname}`;

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

    // 智能推断stepId（如果前端没有传递）
    let finalStepId = stepId ? parseInt(stepId) : null;
    
    // 如果没有传递stepId，根据documentType推断
    if (!finalStepId && documentType) {
      if (documentType === 'FINANCIAL_DOCUMENTS' || documentType === 'UPLOADED_DOC') {
        finalStepId = 4; // 财务文档上传步骤
      } else if (documentType === 'DUE_DILIGENCE') {
        finalStepId = 7; // 尽调文档上传步骤
      } else if (documentType === 'QUESTIONNAIRE') {
        finalStepId = 3; // 问卷步骤
      }
    }

    // 创建文档记录
    const document = await prisma.document.create({
      data: {
        type: documentType || 'UPLOADED_DOC',   // Use documentType from request, fallback to UPLOADED_DOC
        category: 'SELLER_UPLOAD',              // seller上传的文件
        fileName: file.originalname,
        fileSize: file.size,
        url: publicUrl,
        listingId,
        sellerId: typedReq.user.id,
        uploadedBy: typedReq.user.id,           // seller自己上传
        uploadedAt: new Date(),
        status: 'COMPLETED',
        operationType: 'UPLOAD',                // 这是上传操作
        stepId: finalStepId                     // 设置stepId
      }
    });

    console.log('File upload debug info:', {
      originalname: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      buffer_length: file.buffer?.length,
      document_fileSize: document.fileSize,
      stepId: finalStepId,
      documentType: documentType
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
        stepId: document.stepId
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

// seller删除listing的文档
router.delete('/listings/:listingId/documents/:documentId', authenticateSeller, async (req, res): Promise<void> => {
  try {
    const { listingId, documentId } = req.params;
    const typedReq = req as AuthenticatedRequest;
    
    console.log('Seller deleting document:', { listingId, documentId, sellerId: typedReq.user?.id });
    
    if (!typedReq.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // 验证listing是否属于该seller
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

    // 查找要删除的文档
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        listingId,
        sellerId: typedReq.user.id,
        category: 'SELLER_UPLOAD' // 只能删除seller自己上传的文档
      }
    });

    console.log('Document to delete:', document ? {
      id: document.id,
      fileName: document.fileName,
      type: document.type,
      category: document.category
    } : 'Not found');

    if (!document) {
      res.status(404).json({ message: 'Document not found or not owned by seller' });
      return;
    }

    // 从Supabase Storage删除文件
    if (document.url) {
      try {
        const bucketName = getStorageBucket();
        // 从URL中提取文件路径
        const urlParts = document.url.split('/');
        const bucketIndex = urlParts.findIndex((part: string) => part === bucketName);
        if (bucketIndex !== -1 && bucketIndex < urlParts.length - 1) {
          const filePath = urlParts.slice(bucketIndex + 1).join('/');
          const { error: deleteError } = await supabase.storage
            .from(bucketName)
            .remove([filePath]);
          
          if (deleteError) {
            console.error('Supabase delete error:', deleteError);
            // Continue with database deletion even if storage deletion fails
          } else {
            console.log('Successfully deleted file from storage:', filePath);
          }
        }
      } catch (storageError) {
        console.error('Error deleting file from storage:', storageError);
        // Continue with database deletion even if storage deletion fails
      }
    }

    // 从数据库删除文档记录
    await prisma.document.delete({
      where: { id: documentId }
    });

    console.log('Successfully deleted document from database:', documentId);

    res.json({ message: 'Document deleted successfully' });
  } catch (error: unknown) {
    console.error('Error deleting seller document:', error);
    res.status(500).json({ 
      message: 'Failed to delete document',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

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

// 获取seller的问卷数据
router.get('/questionnaire', authenticateSeller, async (req, res): Promise<void> => {
  try {
    const typedReq = req as AuthenticatedRequest;
    
    if (!typedReq.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const questionnaire = await prisma.sellerQuestionnaire.findFirst({
      where: {
        sellerId: typedReq.user.id
      }
    });

    res.json({ questionnaire: questionnaire?.data || null });
  } catch (error) {
    console.error('Error getting questionnaire:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 保存问卷（不生成PDF）
router.post('/questionnaire/save', authenticateSeller, async (req, res): Promise<void> => {
  try {
    const typedReq = req as AuthenticatedRequest;
    const { questionnaire } = req.body;
    
    if (!typedReq.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    await prisma.sellerQuestionnaire.upsert({
      where: {
        sellerId: typedReq.user.id
      },
      update: {
        data: questionnaire,
        updatedAt: new Date()
      },
      create: {
        sellerId: typedReq.user.id,
        data: questionnaire
      }
    });

    res.json({ message: 'Questionnaire saved successfully' });
  } catch (error) {
    console.error('Error saving questionnaire:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 提交问卷并生成PDF
router.post('/questionnaire/submit', authenticateSeller, async (req, res): Promise<void> => {
  try {
    const typedReq = req as AuthenticatedRequest;
    const { questionnaire } = req.body;
    
    if (!typedReq.user || !typedReq.user.id) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // 获取用户的selected listing
    const sellerProgress = await prisma.sellerProgress.findUnique({
      where: { sellerId: typedReq.user.id }
    });

    if (!sellerProgress?.selectedListingId) {
      res.status(400).json({ message: 'No listing selected' });
      return;
    }

    // 保存问卷数据
    await prisma.sellerQuestionnaire.upsert({
      where: {
        sellerId: typedReq.user.id
      },
      update: {
        data: questionnaire,
        updatedAt: new Date(),
        submitted: true,
        submittedAt: new Date()
      },
      create: {
        sellerId: typedReq.user.id,
        data: questionnaire,
        submitted: true,
        submittedAt: new Date()
      }
    });

    // 生成文件名
    const timestamp = Date.now();
    const fileName = `listings/${sellerProgress.selectedListingId}/seller/questionnaire.pdf`;

    // 删除之前的问卷文档（如果存在）
    const existingDocs = await prisma.document.findMany({
      where: {
        sellerId: typedReq.user.id,
        listingId: sellerProgress.selectedListingId,
        type: 'QUESTIONNAIRE',
        category: 'SELLER_UPLOAD'
      }
    });

    // 删除Supabase Storage中的旧文件
    const bucketName = getStorageBucket();
    for (const doc of existingDocs) {
      if (doc.url) {
        // 从URL中提取文件路径
        const urlParts = doc.url.split('/');
        const bucketIndex = urlParts.findIndex((part: string) => part === bucketName);
        if (bucketIndex !== -1 && bucketIndex < urlParts.length - 1) {
          const filePath = urlParts.slice(bucketIndex + 1).join('/');
          await supabase.storage.from(bucketName).remove([filePath]);
        }
      }
    }

    // 删除数据库记录
    await prisma.document.deleteMany({
      where: {
        sellerId: typedReq.user.id,
        listingId: sellerProgress.selectedListingId,
        type: 'QUESTIONNAIRE',
        category: 'SELLER_UPLOAD'
      }
    });

    // 生成PDF内容 - 使用Promise来处理异步PDF生成
    let pdfBuffer: Buffer | null = null;
    try {
      pdfBuffer = await generateQuestionnairePDFAsync(questionnaire, typedReq.user);
      
      // 上传PDF文件到Supabase Storage，使用时间戳避免缓存
      const supabaseFileName = `listings/${sellerProgress.selectedListingId}/seller/questionnaire_${timestamp}.pdf`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(supabaseFileName, pdfBuffer, {
          contentType: 'application/pdf',
          upsert: true // 允许覆盖现有文件
        });

      if (uploadError) {
        console.error('Supabase upload error:', uploadError);
        throw new Error('Failed to upload PDF to storage');
      }

      // 获取文件的公共URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(supabaseFileName);

      // 创建新的文档记录，使用Supabase的公共URL
      const document = await prisma.document.create({
        data: {
          fileName: `questionnaire_${timestamp}.pdf`,
          url: publicUrl, // 使用Supabase的公共URL
          fileSize: pdfBuffer ? pdfBuffer.length : 0,
          type: 'QUESTIONNAIRE',
          category: 'SELLER_UPLOAD',
          sellerId: typedReq.user.id,
          listingId: sellerProgress.selectedListingId,
          uploadedBy: typedReq.user.id,
          stepId: 3,
          status: 'COMPLETED',
          operationType: 'UPLOAD',
          uploadedAt: new Date()
        }
      });

      res.json({ 
        message: 'Questionnaire submitted successfully',
        document: document
      });
    } catch (pdfError) {
      console.error('PDF generation or upload error:', pdfError);
      res.status(500).json({ message: 'Failed to generate or upload questionnaire PDF' });
    }
  } catch (error) {
    console.error('Error submitting questionnaire:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 异步PDF生成函数
function generateQuestionnairePDFAsync(questionnaire: any, user: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const PDFDocument = require('pdfkit');
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      doc.on('error', (error: Error) => {
        reject(error);
      });

      // PDF Header
      doc.fontSize(20).font('Helvetica-Bold').text('BUSINESS QUESTIONNAIRE', { align: 'center' });
      doc.moveDown();
      doc.fontSize(14).font('Helvetica').text(`Company: ${user.name || 'N/A'}`, { align: 'center' });
      doc.moveDown(2);

      // Business Summary and History
      addSectionHeader(doc, 'BUSINESS SUMMARY AND HISTORY');
      addQuestion(doc, '1. Provide a general (short) description of the business, its products/services, market and customers.', questionnaire.businessDescription);
      addQuestion(doc, '2. Provide list of current shareholders and percentages owned.', questionnaire.currentShareholders);
      addQuestion(doc, '3. When was the company originally founded and by whom?', questionnaire.companyFounded);
      addQuestion(doc, '4. Provide a brief history of the business – from inception to present.', questionnaire.businessHistory);
      addQuestion(doc, '5. List any major accomplishments or setbacks from inception.', questionnaire.majorAccomplishments);

      // Products and Services
      addSectionHeader(doc, 'PRODUCTS AND SERVICES');
      addQuestion(doc, '6. Provide a general description of each of the company\'s products and services.', questionnaire.productsServicesDescription);
      addQuestion(doc, '7. Provide a breakdown of sales for each product and service.', questionnaire.salesBreakdown);
      addQuestion(doc, '8. Are any of the products/services seasonal? If so, what and why?', questionnaire.seasonalProducts);
      addQuestion(doc, '9. What future products/services do you plan to offer or the new owner could/should pursue to expand the business?', questionnaire.futureProducts);
      addQuestion(doc, '10. How do your products/services compare to the competition?', questionnaire.competitionComparison);

      // Market and Customers
      addSectionHeader(doc, 'MARKET AND CUSTOMERS');
      addQuestion(doc, '11. Provide general description of the market?', questionnaire.marketDescription);
      addQuestion(doc, '12. What is the typical customer profile?', questionnaire.customerProfile);
      addQuestion(doc, '13. What geographic market is the company servicing?', questionnaire.geographicMarket);
      addQuestion(doc, '14. Please provide your market position – how much market share?', questionnaire.marketPosition);
      addQuestion(doc, '15. Are there any industry trends that could affect the company – positively or negatively?', questionnaire.industryTrends);
      addQuestion(doc, '16. List top 5 customers and their percentage of sales for last full year and projected year.', questionnaire.top5Customers);
      addQuestion(doc, '17. Provide description of the top 3 customers including length of relationship, strength of relationship and contracts (if any).', questionnaire.top3CustomersDescription);

      // Sales and Marketing
      addSectionHeader(doc, 'SALES AND MARKETING');
      addQuestion(doc, '18. Describe the company\'s general marketing plan. List each type of marketing media.', questionnaire.marketingPlan);
      addQuestion(doc, '19. What type of marketing creates the most revenue?', questionnaire.mostRevenueMarketing);
      addQuestion(doc, '20. Does the company have an Internet presence?', questionnaire.internetPresence);
      addQuestion(doc, '21. What marketing/advertising will/should be considered in the future?', questionnaire.futureMarketing);
      addQuestion(doc, '22. Does the company utilize sales people? If so, please describe the selling process?', questionnaire.salesPeople);
      addQuestion(doc, '23. Are there any key sales people? If so, is there an employee contract or non-compete?', questionnaire.keySalesPeople);
      addQuestion(doc, '24. What could make the sales process more efficient?', questionnaire.salesProcessEfficiency);

      // Competition
      addSectionHeader(doc, 'COMPETITION');
      addQuestion(doc, '25. Provide general description of the competition.', questionnaire.competitionDescription);
      addQuestion(doc, '26. List top 3 direct competitors and give brief description of each.', questionnaire.top3Competitors);
      addQuestion(doc, '27. On what basis do you compete with your competitors (price, service, etc.)?', questionnaire.competitionBasis);
      addQuestion(doc, '28. What are your competitive advantages over the competition?', questionnaire.competitiveAdvantages);
      addQuestion(doc, '29. What are your weaknesses vs. the competition?', questionnaire.competitiveWeaknesses);
      addQuestion(doc, '30. Do you see any future direct and/or indirect competition – if so, from where and who?', questionnaire.futureCompetition);

      // Operations
      addSectionHeader(doc, 'OPERATIONS');
      addQuestion(doc, '31. Explain product/service distribution from initial call to collection.', questionnaire.distributionProcess);
      addQuestion(doc, '32. Explain orders/billings/collection process and terms (A/R & A/P).', questionnaire.ordersBillingsCollection);
      addQuestion(doc, '33. Describe the inventory process – storage, turnover, etc.', questionnaire.inventoryProcess);
      addQuestion(doc, '34. Describe pricing structure and future pricing considerations, and bidding process, if any, for obtaining work.', questionnaire.pricingStructure);
      addQuestion(doc, '35. List days and hours of operation.', questionnaire.operationDaysHours);
      addQuestion(doc, '36. Are there any pending litigation matters or current lawsuits? If so, explain.', questionnaire.pendingLitigation);

      // Staffing Tables
      addSectionHeader(doc, 'ORGANIZATION - STAFFING');
      if (questionnaire.staffingTable && questionnaire.staffingTable.length > 0) {
        addStaffingTable(doc, questionnaire.staffingTable);
      }
      
      if (questionnaire.weeklyStaffingTable && questionnaire.weeklyStaffingTable.length > 0) {
        addWeeklyStaffingTable(doc, questionnaire.weeklyStaffingTable);
      }

      // More Organization Questions
      addQuestion(doc, '38. Describe the importance of any key employees, will they stay, and how hard will they be to replace?', questionnaire.keyEmployeesImportance);
      addQuestion(doc, '39. Is there an Employee Stock Ownership Plan (ESOP)? If so, when was it established?', questionnaire.esopPlan);
      addQuestion(doc, '40. Who keeps the financials on a daily basis? How is payroll done? How often do you get P&L statements? Who does them? Who does your taxes?', questionnaire.financialKeeping);

      // Owner Involvement
      addSectionHeader(doc, 'OWNER INVOLVEMENT');
      addQuestion(doc, '41. Do the owner(s) actively manage? If yes, please list primary duties and hours worked per week?', questionnaire.ownerManagement);
      addQuestion(doc, '42. If the owner(s) will need to be replaced with new management, describe the job title, salary, etc. it would take to replace the owner(s)?', questionnaire.replacementManagement);
      addQuestion(doc, '43. What is the owner(s) reason for selling?', questionnaire.sellingReason);
      addQuestion(doc, '44. What licenses are required to operate this business?', questionnaire.requiredLicenses);

      // Facilities and Assets
      addSectionHeader(doc, 'FACILITIES AND ASSETS');
      addQuestion(doc, '45. Describe the company\'s facilities – square ft., location, etc.', questionnaire.facilitiesDescription);
      addQuestion(doc, '46. Are the facilities leased or owned? If leased, please describe lease terms.', questionnaire.facilitiesLeasedOwned);
      addQuestion(doc, '47. What percentage of the company\'s facilities is fully utilized? Is there room to expand?', questionnaire.facilitiesUtilization);
      addQuestion(doc, '48. Describe the general condition of the company\'s assets.', questionnaire.assetsCondition);
      addQuestion(doc, '49. Approximately how much has the company spent each year on capital expenditures/improvements?', questionnaire.capitalExpenditures);
      addQuestion(doc, '50. To reach the projected sales, approximately how much will the company have to spend on capital expenditures/improvements each year? Please describe?', questionnaire.futureCapitalExpenditures);

      // Financial Overview
      addSectionHeader(doc, 'FINANCIAL OVERVIEW');
      addQuestion(doc, '51. Describe financial trends over the last 5 years.', questionnaire.financialTrends);
      addQuestion(doc, '52. What factors have affected revenue and/or profitability?', questionnaire.revenueFactors);
      addQuestion(doc, '53. What could management do to increase revenue?', questionnaire.increaseRevenue);
      addQuestion(doc, '54. What could management do to increase profitability?', questionnaire.increaseProfitability);
      addQuestion(doc, '55. Does the company have to rely on short-term debt for working capital purposes? Please explain the nature of the accounts receivable.', questionnaire.shortTermDebt);

      // Technology Overview
      addSectionHeader(doc, 'TECHNOLOGY OVERVIEW');
      addQuestion(doc, '56. Describe technology used in daily operations.', questionnaire.technologyDescription);
      addQuestion(doc, '57. Is technology up to date?', questionnaire.technologyUpToDate);
      addQuestion(doc, '58. Would newer technology increase efficiency?', questionnaire.newerTechnologyEfficiency);
      addQuestion(doc, '59. Does company rely upon its own technology and if so, how often is it updated?', questionnaire.ownTechnologyReliance);

      // Other Important Information
      addSectionHeader(doc, 'OTHER IMPORTANT INFORMATION');
      addQuestion(doc, '60. Please list any other important factors not included above?', questionnaire.otherImportantInfo);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

function addSectionHeader(doc: any, title: string) {
  // Add a new page if not enough space
  if (doc.y > 700) {
    doc.addPage();
  }
  
  // Ensure we're starting from the left margin
  doc.x = 50;
  
  doc.fontSize(16).font('Helvetica-Bold').text(title, 50, doc.y, { underline: true });
  doc.moveDown();
}

function addQuestion(doc: any, question: string, answer: string) {
  // Add a new page if not enough space
  if (doc.y > 720) {
    doc.addPage();
  }
  
  // Ensure we're starting from the left margin
  doc.x = 50;
  
  doc.fontSize(12).font('Helvetica-Bold').text(question, 50, doc.y);
  doc.moveDown(0.5);
  doc.fontSize(11).font('Helvetica').text(answer || 'No answer provided.', 50, doc.y);
  doc.moveDown(1);
}

function addStaffingTable(doc: any, staffingData: any[]) {
  doc.addPage();
  doc.fontSize(14).font('Helvetica-Bold').text('Staffing, Wages, and Benefits', { underline: true });
  doc.moveDown();

  const startX = 50;
  let startY = doc.y;
  const rowHeight = 25;
  const colWidths = [100, 60, 60, 60, 80, 60, 80];

  // Table headers
  const headers = ['Title/Job', 'Pay Rate', 'Weekly Hours', 'Years of Service', 'Health Insurance', 'Vacation (Weeks)', 'Staying With Business?'];
  
  // Draw header row
  doc.fontSize(10).font('Helvetica-Bold');
  let currentX = startX;
  headers.forEach((header, i) => {
    doc.rect(currentX, startY, colWidths[i], rowHeight).stroke();
    doc.text(header, currentX + 2, startY + 5, { width: colWidths[i] - 4, align: 'center' });
    currentX += colWidths[i];
  });

  // Draw data rows
  doc.font('Helvetica');
  staffingData.forEach((row, rowIndex) => {
    startY += rowHeight;
    currentX = startX;
    
    const values = [
      row.titleJob || '',
      row.payRate || '',
      row.weeklyHours || '',
      row.yearsOfService || '',
      row.healthInsurance || '',
      row.vacationWeeks || '',
      row.stayingWithBusiness || ''
    ];

    values.forEach((value, colIndex) => {
      doc.rect(currentX, startY, colWidths[colIndex], rowHeight).stroke();
      doc.text(value, currentX + 2, startY + 5, { width: colWidths[colIndex] - 4, align: 'center' });
      currentX += colWidths[colIndex];
    });
  });
  
  // Reset document position after table
  doc.y = startY + rowHeight + 20; // Move Y position below the table with some spacing
  doc.x = 50; // Reset X position to left margin
}

function addWeeklyStaffingTable(doc: any, weeklyData: any[]) {
  doc.addPage();
  doc.fontSize(14).font('Helvetica-Bold').text('Weekly Staffing', { underline: true });
  doc.moveDown();

  const startX = 50;
  let startY = doc.y;
  const rowHeight = 25;
  const colWidths = [100, 60, 60, 60, 60, 60, 60, 60];

  // Table headers
  const headers = ['Title/Job', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Draw header row
  doc.fontSize(10).font('Helvetica-Bold');
  let currentX = startX;
  headers.forEach((header, i) => {
    doc.rect(currentX, startY, colWidths[i], rowHeight).stroke();
    doc.text(header, currentX + 2, startY + 5, { width: colWidths[i] - 4, align: 'center' });
    currentX += colWidths[i];
  });

  // Draw data rows
  doc.font('Helvetica');
  weeklyData.forEach((row, rowIndex) => {
    startY += rowHeight;
    currentX = startX;
    
    const values = [
      row.titleJob || '',
      row.mon || '',
      row.tue || '',
      row.wed || '',
      row.thu || '',
      row.fri || '',
      row.sat || '',
      row.sun || ''
    ];

    values.forEach((value, colIndex) => {
      doc.rect(currentX, startY, colWidths[colIndex], rowHeight).stroke();
      doc.text(value, currentX + 2, startY + 5, { width: colWidths[colIndex] - 4, align: 'center' });
      currentX += colWidths[colIndex];
    });
  });
  
  // Reset document position after table
  doc.y = startY + rowHeight + 20; // Move Y position below the table with some spacing
  doc.x = 50; // Reset X position to left margin
}

router.get('/dashboard', authenticateSeller, getDashboardStats);
router.get('/listings', authenticateSeller, getListings);
router.get('/progress', authenticateSeller, getProgress);
router.post('/select-listing', authenticateSeller, selectListing);
router.post('/update-step', authenticateSeller, updateStep);
router.post('/mark-step-completed', authenticateSeller, markStepCompleted);
router.post('/mark-step-incomplete', authenticateSeller, markStepIncomplete);
router.get('/step/:stepId/documents', authenticateSeller, getStepDocuments);
router.post('/step/:stepId/upload', authenticateSeller, uploadStepDocument);
router.post('/step/:stepId/download', authenticateSeller, downloadStepDocument);
router.get('/current-listing', authenticateSeller, getCurrentListing);

// Pre-Close Checklist APIs
// 获取listing的pre-close checklist
router.get('/listings/:listingId/pre-close-checklist', authenticateSeller, async (req, res): Promise<void> => {
  try {
    const { listingId } = req.params;
    const typedReq = req as AuthenticatedRequest;
    
    if (!typedReq.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // 验证listing是否属于该seller
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

    // 获取或创建checklist
    let checklist = await prisma.preCloseChecklist.findUnique({
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
      checklist = await prisma.preCloseChecklist.create({
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
router.put('/listings/:listingId/pre-close-checklist/item', authenticateSeller, async (req, res): Promise<void> => {
  try {
    const { listingId } = req.params;
    const { categoryId, itemId, userRole } = req.body;
    const typedReq = req as AuthenticatedRequest;
    
    if (!typedReq.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // 验证listing是否属于该seller
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

    // 获取或创建checklist
    let checklist = await prisma.preCloseChecklist.findUnique({
      where: { listingId }
    });

    if (!checklist) {
      const defaultChecklistData = getDefaultChecklistData();
      checklist = await prisma.preCloseChecklist.create({
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
      typedReq.user.name || 'Unknown User',
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
      lastUpdatedBy: typedReq.user.name || 'Unknown User',
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
    return await prisma.preCloseChecklist.update({
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

// Mark page visited (for auto-completion of certain steps like buyer activity)
const markPageVisited: RequestHandler = async (req, res, next) => {
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
    
    // Auto-complete step 5 (Buyer Activity) when visited and prerequisites are met
    if (stepId === 5) {
      // Batch fetch all required data (same as getProgress)
      const [documents, messages, questionnaire, preCloseChecklist] = await Promise.all([
        prisma.document.findMany({
          where: { 
            sellerId,
            stepId: { not: null }
          }
        }),
        prisma.message.findFirst({
          where: { senderId: sellerId }
        }),
        prisma.sellerQuestionnaire.findFirst({
          where: { 
            sellerId, 
            submitted: true,
            submittedAt: { not: null }
          }
        }),
        sellerProgress.selectedListingId ? prisma.preCloseChecklist.findUnique({
          where: { listingId: sellerProgress.selectedListingId }
        }) : Promise.resolve(null)
      ]);

      const step4Completed = checkStepCompletionOptimized(4, {
        sellerId,
        listingId: sellerProgress.selectedListingId,
        documents,
        messages,
        questionnaire,
        preCloseChecklist,
        completedStepsFromDB: completedStepsArray
      });
      
      if (step4Completed && !completedStepsArray.includes(5)) {
        completedStepsArray.push(5);
        
        // Update current step if needed
        const newCurrentStep = Math.max(sellerProgress.currentStep, 6);

        await prisma.sellerProgress.update({
          where: { id: sellerProgress.id },
          data: {
            currentStep: newCurrentStep,
            completedSteps: completedStepsArray
          }
        });

        console.log(`Step ${stepId} auto-completed on page visit`);
        res.json({ 
          message: 'Page visit recorded and step auto-completed',
          stepCompleted: true
        });
        return;
      }
    }

    res.json({ 
      message: 'Page visit recorded',
      stepCompleted: false
    });
  } catch (error) {
    console.error('Error marking page visited:', error);
    next(error);
  }
};

router.post('/mark-page-visited', authenticateSeller, markPageVisited);

export default router; 