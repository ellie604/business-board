import { Router, RequestHandler } from 'express';
import { getPrisma } from '../../database';
import { authenticateSeller } from '../middleware/auth';
import { AuthenticatedRequest } from '../types/custom';
import type { Document } from '../../generated/prisma-preview';

const router = Router();
const prisma = getPrisma();

// 定义每个步骤的文档要求
const STEP_DOCUMENT_REQUIREMENTS = {
  0: { type: 'EMAIL_AGENT', operationType: 'BOTH', description: 'Email communication with agent' },
  1: { type: 'LISTING_AGREEMENT', operationType: 'DOWNLOAD', description: 'Download listing agreement' },
  2: { type: 'QUESTIONNAIRE', operationType: 'UPLOAD', description: 'Fill out business questionnaire' },
  3: { type: 'FINANCIAL_DOCUMENTS', operationType: 'UPLOAD', description: 'Upload financial documents' },
  4: { type: 'UPLOADED_DOC', operationType: 'NONE', description: 'View buyer activity updates' },
  5: { type: 'PURCHASE_AGREEMENT', operationType: 'DOWNLOAD', description: 'Download purchase contract' },
  6: { type: 'DUE_DILIGENCE', operationType: 'UPLOAD', description: 'Upload due diligence documents' },
  7: { type: 'CLOSING_DOCS', operationType: 'DOWNLOAD', description: 'Download closing documents' },
  8: { type: 'AFTER_SALE', operationType: 'DOWNLOAD', description: 'Tax mitigation information' }
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
    const totalSteps = 9; // Total 9 steps
    
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

// Get seller's listings
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
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        status: true
      }
    });

    res.json({ listings });
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
      { id: 0, title: 'Email agent', completed: false, accessible: true },
      { id: 1, title: 'Download your listing agreement', completed: false, accessible: false },
      { id: 2, title: 'Fill out your business questionnaire Online', completed: false, accessible: false },
      { id: 3, title: 'Upload your Financial documents', completed: false, accessible: false },
      { id: 4, title: 'Buyer Activity: Up to the minute updates on buyers', completed: false, accessible: false },
      { id: 5, title: 'Download your purchase contract', completed: false, accessible: false },
      { id: 6, title: 'Upload due diligence documents', completed: false, accessible: false },
      { id: 7, title: 'Download Closing document once we are closed', completed: false, accessible: false },
      { id: 8, title: 'After the Sale: Learn about ways mitigate taxes', completed: false, accessible: false }
    ];

    const completedStepsArray = sellerProgress.completedSteps as number[] || [];
    
    // Update step status and add document information
    steps.forEach((step, index) => {
      step.completed = completedStepsArray.includes(step.id);
      step.accessible = index <= sellerProgress!.currentStep;
      
      // Add document requirement information
      const stepDoc = STEP_DOCUMENT_REQUIREMENTS[step.id as keyof typeof STEP_DOCUMENT_REQUIREMENTS];
      if (stepDoc) {
        (step as any).documentRequirement = stepDoc;
        (step as any).documents = documents.filter((doc: any) => doc.stepId === step.id);
      }
    });

    res.json({
      progress: {
        currentStep: sellerProgress.currentStep,
        steps,
        selectedListingId: sellerProgress.selectedListingId
      }
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    next(error);
  }
};

// Select a listing
const selectListing: RequestHandler = async (req, res, next) => {
  const typedReq = req as AuthenticatedRequest;
  try {
    const sellerId = typedReq.user?.id;
    const { listingId } = req.body;
    
    if (!sellerId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Verify that the listing belongs to the seller
    const listing = await prisma.listing.findFirst({
      where: {
        id: listingId,
        sellerId
      }
    });

    if (!listing) {
      res.status(404).json({ message: 'Listing not found or not owned by seller' });
      return;
    }

    // Update or create seller progress record
    await prisma.sellerProgress.upsert({
      where: { sellerId },
      update: { selectedListingId: listingId },
      create: {
        sellerId,
        currentStep: 0,
        completedSteps: [],
        selectedListingId: listingId
      }
    });

    res.json({ message: 'Listing selected successfully' });
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
        sellerId,
        stepId,
        listingId: sellerProgress?.selectedListingId,
        fileName,
        url: fileUrl,
        fileSize,
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

router.get('/dashboard', authenticateSeller, getDashboardStats);
router.get('/listings', authenticateSeller, getListings);
router.get('/progress', authenticateSeller, getProgress);
router.post('/select-listing', authenticateSeller, selectListing);
router.post('/update-step', authenticateSeller, updateStep);
router.get('/step/:stepId/documents', authenticateSeller, getStepDocuments);
router.post('/step/:stepId/upload', authenticateSeller, uploadStepDocument);
router.post('/step/:stepId/download', authenticateSeller, downloadStepDocument);

export default router; 