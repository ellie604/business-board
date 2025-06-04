import { Router, RequestHandler } from 'express';
import { getPrisma } from '../../database';
import { authenticateSeller } from '../middleware/auth';
import { AuthenticatedRequest } from '../types/custom';
import type { Document } from '../../generated/prisma-preview';

const router = Router();
const prisma = getPrisma();

// Get seller dashboard data
const getDashboardStats: RequestHandler = async (req, res, next) => {
  const typedReq = req as AuthenticatedRequest;
  try {
    const sellerId = typedReq.user?.id;
    if (!sellerId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Get all documents for the seller
    const documents = await prisma.document.findMany({
      where: {
        sellerId,
      },
    });

    // Map document types to their status
    const stats = {
      emailAgent: documents.find((d: Document) => d.type === 'EMAIL_AGENT')?.status === 'COMPLETED' ? 'completed' : 'pending',
      listingAgreement: documents.find((d: Document) => d.type === 'LISTING_AGREEMENT')?.status === 'COMPLETED' ? 'completed' : 'pending',
      questionnaire: documents.find((d: Document) => d.type === 'QUESTIONNAIRE')?.status === 'COMPLETED' ? 'completed' : 'pending',
      uploadedDocs: documents.some((d: Document) => d.type === 'UPLOADED_DOC') ? 'completed' : 'pending',
      purchaseAgreement: documents.find((d: Document) => d.type === 'PURCHASE_AGREEMENT')?.status === 'COMPLETED' ? 'completed' : 'pending',
      dueDiligence: documents.find((d: Document) => d.type === 'DUE_DILIGENCE')?.status === 'COMPLETED' ? 'completed' : 'pending',
      preCloseChecklist: documents.find((d: Document) => d.type === 'PRE_CLOSE_CHECKLIST')?.status === 'COMPLETED' ? 'completed' : 'pending',
      closingDocs: documents.find((d: Document) => d.type === 'CLOSING_DOCS')?.status === 'COMPLETED' ? 'completed' : 'pending',
      afterSale: documents.find((d: Document) => d.type === 'AFTER_SALE')?.status === 'COMPLETED' ? 'completed' : 'pending'
    };

    // Calculate current step (1-4) based on document completion
    let currentStep = 1;
    if (stats.emailAgent === 'completed' && stats.listingAgreement === 'completed' && stats.questionnaire === 'completed') {
      currentStep = 2;
      if (stats.uploadedDocs === 'completed' && stats.purchaseAgreement === 'completed') {
        currentStep = 3;
        if (stats.dueDiligence === 'completed' && stats.preCloseChecklist === 'completed') {
          currentStep = 4;
        }
      }
    }

    res.json({
      stats,
      currentStep,
      message: 'Dashboard data retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    next(error);
  }
};

// Get document status
const getDocumentStatus: RequestHandler = async (req, res, next) => {
  const typedReq = req as AuthenticatedRequest;
  try {
    const sellerId = typedReq.user?.id;
    if (!sellerId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const documents = await prisma.document.findMany({
      where: {
        sellerId
      },
      select: {
        id: true,
        type: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        url: true
      }
    });

    res.json({
      documents,
      message: 'Documents retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    next(error);
  }
};

router.get('/dashboard', authenticateSeller, getDashboardStats);
router.get('/documents', authenticateSeller, getDocumentStatus);

export default router; 