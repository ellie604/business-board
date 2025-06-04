import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { getPrisma } from '../../database';
import { authenticateBuyer } from '../middleware/auth';
import { AuthenticatedRequest } from '../types/custom';
import type { Document } from '../../generated/prisma-preview';

const router = Router();
const prisma = getPrisma();

// Get buyer dashboard data
const getDashboardStats: RequestHandler = async (req, res, next) => {
  const typedReq = req as AuthenticatedRequest;
  try {
    const buyerId = typedReq.user?.id;
    if (!buyerId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Get all documents for the buyer
    const documents = await prisma.document.findMany({
      where: {
        buyerId,
      },
    });

    // Map document types to their status
    const stats = {
      emailAgent: documents.find((d: Document) => d.type === 'EMAIL_AGENT')?.status === 'COMPLETED' ? 'completed' : 'pending',
      nda: documents.find((d: Document) => d.type === 'NDA')?.status === 'COMPLETED' ? 'completed' : 'pending',
      financialStatement: documents.find((d: Document) => d.type === 'FINANCIAL_STATEMENT')?.status === 'COMPLETED' ? 'completed' : 'pending',
      cbrCim: documents.find((d: Document) => d.type === 'CBR_CIM')?.status === 'COMPLETED' ? 'completed' : 'pending',
      uploadedDocs: documents.some((d: Document) => d.type === 'UPLOADED_DOC') ? 'completed' : 'pending',
      purchaseContract: documents.find((d: Document) => d.type === 'PURCHASE_CONTRACT')?.status === 'COMPLETED' ? 'completed' : 'pending',
      dueDiligence: documents.find((d: Document) => d.type === 'DUE_DILIGENCE')?.status === 'COMPLETED' ? 'completed' : 'pending',
      preCloseChecklist: documents.find((d: Document) => d.type === 'PRE_CLOSE_CHECKLIST')?.status === 'COMPLETED' ? 'completed' : 'pending',
      closingDocs: documents.find((d: Document) => d.type === 'CLOSING_DOCS')?.status === 'COMPLETED' ? 'completed' : 'pending'
    };

    res.json({
      stats,
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
    const buyerId = typedReq.user?.id;
    if (!buyerId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const documents = await prisma.document.findMany({
      where: {
        buyerId
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

router.get('/dashboard', authenticateBuyer, getDashboardStats);
router.get('/documents', authenticateBuyer, getDocumentStatus);

export default router; 