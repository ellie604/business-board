"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../../database");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const prisma = (0, database_1.getPrisma)();
// Get buyer dashboard data
const getDashboardStats = async (req, res, next) => {
    const typedReq = req;
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
            emailAgent: documents.find((d) => d.type === 'EMAIL_AGENT')?.status === 'COMPLETED' ? 'completed' : 'pending',
            nda: documents.find((d) => d.type === 'NDA')?.status === 'COMPLETED' ? 'completed' : 'pending',
            financialStatement: documents.find((d) => d.type === 'FINANCIAL_STATEMENT')?.status === 'COMPLETED' ? 'completed' : 'pending',
            cbrCim: documents.find((d) => d.type === 'CBR_CIM')?.status === 'COMPLETED' ? 'completed' : 'pending',
            uploadedDocs: documents.some((d) => d.type === 'UPLOADED_DOC') ? 'completed' : 'pending',
            purchaseContract: documents.find((d) => d.type === 'PURCHASE_CONTRACT')?.status === 'COMPLETED' ? 'completed' : 'pending',
            dueDiligence: documents.find((d) => d.type === 'DUE_DILIGENCE')?.status === 'COMPLETED' ? 'completed' : 'pending',
            preCloseChecklist: documents.find((d) => d.type === 'PRE_CLOSE_CHECKLIST')?.status === 'COMPLETED' ? 'completed' : 'pending',
            closingDocs: documents.find((d) => d.type === 'CLOSING_DOCS')?.status === 'COMPLETED' ? 'completed' : 'pending'
        };
        res.json({
            stats,
            message: 'Dashboard data retrieved successfully'
        });
    }
    catch (error) {
        console.error('Error fetching dashboard stats:', error);
        next(error);
    }
};
// Get document status
const getDocumentStatus = async (req, res, next) => {
    const typedReq = req;
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
    }
    catch (error) {
        console.error('Error fetching documents:', error);
        next(error);
    }
};
router.get('/dashboard', auth_1.authenticateBuyer, getDashboardStats);
router.get('/documents', auth_1.authenticateBuyer, getDocumentStatus);
exports.default = router;
