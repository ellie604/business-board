"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../../database");
const auth_1 = require("../middleware/auth");
const multer_1 = __importDefault(require("multer"));
const supabase_1 = require("../config/supabase");
const router = (0, express_1.Router)();
// Configure multer for memory storage
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
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
        }
        else {
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
const getDashboardStats = async (req, res, next) => {
    const typedReq = req;
    try {
        const buyerId = typedReq.user?.id;
        if (!buyerId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        // Get buyer's progress information
        const buyerProgress = await (0, database_1.getPrisma)().buyerProgress.findFirst({
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
    }
    catch (error) {
        console.error('Error fetching dashboard stats:', error);
        next(error);
    }
};
// Get buyer's interested listings
const getListings = async (req, res, next) => {
    const typedReq = req;
    try {
        const buyerId = typedReq.user?.id;
        if (!buyerId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        // Get all active listings that the buyer can view
        const listings = await (0, database_1.getPrisma)().listing.findMany({
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
        res.json(listings);
    }
    catch (error) {
        console.error('Error fetching listings:', error);
        next(error);
    }
};
// Get buyer's progress information with document requirements
const getProgress = async (req, res, next) => {
    const typedReq = req;
    try {
        const buyerId = typedReq.user?.id;
        if (!buyerId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        // Get buyer progress
        let buyerProgress = await (0, database_1.getPrisma)().buyerProgress.findFirst({
            where: { buyerId }
        });
        if (!buyerProgress) {
            buyerProgress = await (0, database_1.getPrisma)().buyerProgress.create({
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
            selectedListingId ? (0, database_1.getPrisma)().document.findMany({
                where: {
                    buyerId,
                    listingId: selectedListingId
                }
            }) : Promise.resolve([]),
            // Get messages for this buyer
            (0, database_1.getPrisma)().message.findFirst({
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
        const completedSteps = [];
        // Get the completed steps from database first
        const completedStepsFromDB = buyerProgress.completedSteps || [];
        // Check each step using batched data
        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            // For manual completion steps (like step 8), check the database first
            let isCompleted = false;
            if (step.id === 8 || step.id === 9 || step.id === 10) {
                // Steps 8, 9, 10 (Pre-close checklist, Closing docs, After sale) are manually completed
                isCompleted = completedStepsFromDB.includes(step.id);
            }
            else {
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
            }
            else {
                step.accessible = steps[index - 1].completed;
            }
            // Add document requirement information
            const stepDoc = BUYER_STEP_DOCUMENT_REQUIREMENTS[step.id];
            if (stepDoc) {
                step.documentRequirement = stepDoc;
                step.documents = documents.filter((doc) => doc.stepId === step.id);
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
    }
    catch (error) {
        console.error('Error getting buyer progress:', error);
        next(error);
    }
};
// Optimized step completion check using batched data
function checkBuyerStepCompletionOptimized(stepId, data) {
    const { buyerId, listingId, documents, messages } = data;
    switch (stepId) {
        case 0: // Select listing
            return !!listingId;
        case 1: // Email agent - automatically completed when step 0 is completed
            // Messages are not mandatory, so this step is automatically completed 
            // when the previous step (step 0) is completed
            return checkBuyerStepCompletionOptimized(0, data);
        case 2: // Fill out NDA - now requires upload of signed NDA
            return documents.some(doc => doc.stepId === 2 &&
                doc.category === 'BUYER_UPLOAD');
        case 3: // Fill out financial statement
            return documents.some(doc => doc.stepId === 3 &&
                doc.category === 'BUYER_UPLOAD');
        case 4: // Download CBR/CIM
            return documents.some(doc => doc.stepId === 4 &&
                doc.type === 'CBR_CIM' &&
                doc.operationType === 'DOWNLOAD' &&
                doc.downloadedAt);
        case 5: // Upload documents
            return documents.some(doc => doc.stepId === 5 &&
                doc.category === 'BUYER_UPLOAD');
        case 6: // Download and upload purchase contract
            return documents.some(doc => doc.stepId === 6 &&
                doc.type === 'PURCHASE_CONTRACT' &&
                doc.operationType === 'UPLOAD' &&
                doc.category === 'BUYER_UPLOAD' &&
                doc.status === 'COMPLETED');
        case 7: // Due diligence step - automatically completed when buyer reaches this step
            // Step 7 is considered complete as soon as the buyer can access it
            // (i.e., when all previous steps are completed)
            if (!listingId)
                return false;
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
            const manuallyCompleted = data.documents.some(doc => doc.stepId === 8 && doc.operationType === 'MANUAL_COMPLETION');
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
const selectListing = async (req, res, next) => {
    const typedReq = req;
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
        const listing = await (0, database_1.getPrisma)().listing.findFirst({
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
        let buyerProgress = await (0, database_1.getPrisma)().buyerProgress.findFirst({
            where: { buyerId }
        });
        if (buyerProgress) {
            buyerProgress = await (0, database_1.getPrisma)().buyerProgress.update({
                where: { id: buyerProgress.id },
                data: {
                    selectedListingId: listingId,
                    currentStep: 1, // Move to step 1 (Messages) after selecting listing
                    completedSteps: [0] // Mark step 0 (Listing Selection) as completed
                }
            });
        }
        else {
            buyerProgress = await (0, database_1.getPrisma)().buyerProgress.create({
                data: {
                    buyerId,
                    selectedListingId: listingId,
                    currentStep: 1, // Move to step 1 (Messages) after selecting listing  
                    completedSteps: [0] // Mark step 0 (Listing Selection) as completed
                }
            });
        }
        // Add buyer to listing's buyers list if not already there
        await (0, database_1.getPrisma)().listing.update({
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
    }
    catch (error) {
        console.error('Error selecting listing:', error);
        next(error);
    }
};
// Update step progress
const updateStep = async (req, res, next) => {
    const typedReq = req;
    try {
        const buyerId = typedReq.user?.id;
        const { stepId } = req.body;
        if (!buyerId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        let buyerProgress = await (0, database_1.getPrisma)().buyerProgress.findFirst({
            where: { buyerId }
        });
        if (!buyerProgress) {
            buyerProgress = await (0, database_1.getPrisma)().buyerProgress.create({
                data: {
                    buyerId,
                    currentStep: 0,
                    completedSteps: [],
                    selectedListingId: null
                }
            });
        }
        const completedStepsArray = buyerProgress.completedSteps || [];
        // If the step hasn't been completed, add it to the completed list
        if (!completedStepsArray.includes(stepId)) {
            completedStepsArray.push(stepId);
        }
        // Update current step (if this step is greater than the current step)
        const newCurrentStep = Math.max(buyerProgress.currentStep, stepId + 1);
        await (0, database_1.getPrisma)().buyerProgress.update({
            where: { id: buyerProgress.id },
            data: {
                currentStep: newCurrentStep,
                completedSteps: completedStepsArray
            }
        });
        res.json({ message: 'Step updated successfully' });
    }
    catch (error) {
        console.error('Error updating step:', error);
        next(error);
    }
};
// Get documents for a specific step
const getStepDocuments = async (req, res, next) => {
    const typedReq = req;
    try {
        const buyerId = typedReq.user?.id;
        const stepId = parseInt(req.params.stepId);
        if (!buyerId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const documents = await (0, database_1.getPrisma)().document.findMany({
            where: {
                buyerId,
                stepId
            },
            orderBy: { createdAt: 'desc' }
        });
        const stepRequirement = BUYER_STEP_DOCUMENT_REQUIREMENTS[stepId];
        res.json({
            documents,
            requirement: stepRequirement
        });
    }
    catch (error) {
        console.error('Error fetching step documents:', error);
        next(error);
    }
};
// Record document upload for a step
const uploadStepDocument = async (req, res, next) => {
    const typedReq = req;
    try {
        const buyerId = typedReq.user?.id;
        const stepId = parseInt(req.params.stepId);
        const { fileName, fileUrl, fileSize } = req.body;
        if (!buyerId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        // Get buyer progress to get selected listing
        const buyerProgress = await (0, database_1.getPrisma)().buyerProgress.findFirst({
            where: { buyerId }
        });
        const stepRequirement = BUYER_STEP_DOCUMENT_REQUIREMENTS[stepId];
        if (!stepRequirement) {
            res.status(400).json({ message: 'Invalid step ID' });
            return;
        }
        const document = await (0, database_1.getPrisma)().document.create({
            data: {
                type: stepRequirement.type,
                category: 'BUYER_UPLOAD', // buyer上传的文件
                buyerId,
                stepId,
                listingId: buyerProgress?.selectedListingId,
                fileName,
                url: fileUrl,
                fileSize,
                uploadedBy: buyerId, // buyer自己上传
                operationType: 'UPLOAD',
                uploadedAt: new Date(),
                status: 'COMPLETED'
            }
        });
        res.json({ document });
    }
    catch (error) {
        console.error('Error uploading step document:', error);
        next(error);
    }
};
// Record document download for a step
const downloadStepDocument = async (req, res, next) => {
    const typedReq = req;
    try {
        const buyerId = typedReq.user?.id;
        const stepId = parseInt(req.params.stepId);
        if (!buyerId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        // Get buyer progress to get selected listing
        const buyerProgress = await (0, database_1.getPrisma)().buyerProgress.findFirst({
            where: { buyerId }
        });
        const stepRequirement = BUYER_STEP_DOCUMENT_REQUIREMENTS[stepId];
        if (!stepRequirement) {
            res.status(400).json({ message: 'Invalid step ID' });
            return;
        }
        // Check if download record already exists
        let document = await (0, database_1.getPrisma)().document.findFirst({
            where: {
                buyerId,
                stepId,
                operationType: 'DOWNLOAD'
            }
        });
        if (!document) {
            document = await (0, database_1.getPrisma)().document.create({
                data: {
                    type: stepRequirement.type,
                    buyerId,
                    stepId,
                    listingId: buyerProgress?.selectedListingId,
                    operationType: 'DOWNLOAD',
                    downloadedAt: new Date(),
                    status: 'COMPLETED'
                }
            });
        }
        else {
            // Update download time
            document = await (0, database_1.getPrisma)().document.update({
                where: { id: document.id },
                data: { downloadedAt: new Date() }
            });
        }
        res.json({ document });
    }
    catch (error) {
        console.error('Error recording document download:', error);
        next(error);
    }
};
// 获取buyer为某个listing上传的文件
router.get('/listings/:listingId/documents', auth_1.authenticateBuyer, async (req, res) => {
    try {
        const { listingId } = req.params;
        const typedReq = req;
        if (!typedReq.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const documents = await (0, database_1.getPrisma)().document.findMany({
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
    }
    catch (error) {
        console.error('Error fetching buyer documents:', error);
        res.status(500).json({
            message: 'Failed to fetch documents',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// buyer为listing上传文件
router.post('/listings/:listingId/documents', upload.single('file'), auth_1.authenticateBuyer, async (req, res) => {
    try {
        const { listingId } = req.params;
        const { documentType } = req.body;
        const typedReq = req;
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
        const listing = await (0, database_1.getPrisma)().listing.findFirst({
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
        const bucketName = (0, supabase_1.getStorageBucket)();
        const fileName = `listings/${listingId}/buyer/documents/${Date.now()}-${file.originalname}`;
        const { data: uploadData, error: uploadError } = await supabase_1.supabase.storage
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
        const { data: { publicUrl } } = supabase_1.supabase.storage
            .from(bucketName)
            .getPublicUrl(fileName);
        // 创建文档记录
        const document = await (0, database_1.getPrisma)().document.create({
            data: {
                type: documentType || 'UPLOADED_DOC',
                category: 'BUYER_UPLOAD', // buyer上传的文件
                fileName: file.originalname,
                fileSize: file.size,
                url: publicUrl,
                listingId,
                sellerId: listing.sellerId, // 使用 listing 的实际 sellerId
                buyerId: typedReq.user.id,
                uploadedBy: typedReq.user.id, // buyer自己上传
                uploadedAt: new Date(),
                status: 'COMPLETED',
                operationType: 'UPLOAD', // 这是上传操作
                stepId: req.body.stepId ? parseInt(req.body.stepId) : undefined // 添加 stepId
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
    }
    catch (error) {
        console.error('Error uploading buyer document:', error);
        res.status(500).json({
            message: 'Failed to upload document',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// buyer删除自己上传的文件
router.delete('/listings/:listingId/documents/:documentId', auth_1.authenticateBuyer, async (req, res) => {
    try {
        const { listingId, documentId } = req.params;
        const typedReq = req;
        if (!typedReq.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        // 查找文档，确保是该buyer上传的
        const document = await (0, database_1.getPrisma)().document.findFirst({
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
            const bucketName = (0, supabase_1.getStorageBucket)();
            // 从URL中提取文件路径
            const urlParts = document.url.split('/');
            const filePathIndex = urlParts.findIndex((part) => part === 'public') + 1;
            if (filePathIndex > 0) {
                const filePath = urlParts.slice(filePathIndex + 1).join('/'); // 跳过bucket名称
                await supabase_1.supabase.storage
                    .from(bucketName)
                    .remove([filePath]);
            }
        }
        // 从数据库中删除记录
        await (0, database_1.getPrisma)().document.delete({
            where: { id: documentId }
        });
        res.json({ message: 'Document deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting buyer document:', error);
        res.status(500).json({
            message: 'Failed to delete document',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Get buyer's currently selected listing
const getCurrentListing = async (req, res, next) => {
    const typedReq = req;
    try {
        const buyerId = typedReq.user?.id;
        if (!buyerId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const buyerProgress = await (0, database_1.getPrisma)().buyerProgress.findUnique({
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
    }
    catch (error) {
        console.error('Error fetching current listing:', error);
        next(error);
    }
};
// 获取broker/agent为buyer的listing提供的文件
router.get('/listings/:listingId/agent-documents', auth_1.authenticateBuyer, async (req, res) => {
    try {
        const { listingId } = req.params;
        const typedReq = req;
        if (!typedReq.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        // 验证buyer是否对该listing有兴趣
        const buyerProgress = await (0, database_1.getPrisma)().buyerProgress.findFirst({
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
        const documents = await (0, database_1.getPrisma)().document.findMany({
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
        console.log('Found documents:', documents.map((doc) => ({
            id: doc.id,
            type: doc.type,
            fileName: doc.fileName,
            url: doc.url,
            category: doc.category,
            uploadedBy: doc.uploadedBy
        })));
        res.json({ documents });
    }
    catch (error) {
        console.error('Error fetching broker/agent documents:', error);
        res.status(500).json({
            message: 'Failed to fetch broker/agent documents',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// 记录buyer下载agent提供的文档
router.post('/download-agent-document/:documentId', auth_1.authenticateBuyer, async (req, res) => {
    try {
        const { documentId } = req.params;
        const { stepId } = req.body;
        const typedReq = req;
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
        const sourceDocument = await (0, database_1.getPrisma)().document.findFirst({
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
        const buyerProgress = await (0, database_1.getPrisma)().buyerProgress.findFirst({
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
        const existingDownload = await (0, database_1.getPrisma)().document.findFirst({
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
            downloadDocument = await (0, database_1.getPrisma)().document.create({
                data: {
                    type: sourceDocument.type,
                    sellerId: buyerId, // 使用sellerId字段（必需字段）
                    buyerId: buyerId,
                    stepId: parsedStepId, // 设置stepId
                    listingId: sourceDocument.listingId, // 设置listingId
                    operationType: 'DOWNLOAD',
                    status: 'COMPLETED',
                    category: 'AGENT_PROVIDED',
                    downloadedAt: new Date()
                }
            });
            console.log('Minimal download record created:', downloadDocument.id);
        }
        else {
            // 更新下载时间
            downloadDocument = await (0, database_1.getPrisma)().document.update({
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
    }
    catch (error) {
        console.error('Error recording document download:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            message: 'Failed to record download',
            error: error.message
        });
    }
});
// 获取尽职调查文档请求和上传文件
router.get('/listings/:listingId/due-diligence', auth_1.authenticateBuyer, async (req, res) => {
    try {
        const { listingId } = req.params;
        const typedReq = req;
        if (!typedReq.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        // 验证buyer是否对该listing有兴趣
        const buyerProgress = await (0, database_1.getPrisma)().buyerProgress.findFirst({
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
        const requests = await (0, database_1.getPrisma)().dueDiligenceRequest.findMany({
            where: {
                listingId,
                buyerId: typedReq.user.id
            }
        });
        // 获取已上传的尽职调查文档
        const documents = await (0, database_1.getPrisma)().document.findMany({
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
            documents: documents.map((doc) => ({
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
    }
    catch (error) {
        console.error('Error fetching due diligence data:', error);
        res.status(500).json({
            message: 'Failed to fetch due diligence data',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// buyer请求特定的尽职调查文档
router.post('/listings/:listingId/due-diligence/request', auth_1.authenticateBuyer, async (req, res) => {
    try {
        const { listingId } = req.params;
        const { documentName, requested } = req.body;
        const typedReq = req;
        if (!typedReq.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        // Use the authenticated user's ID directly
        const buyerId = typedReq.user.id;
        if (requested) {
            // 创建或更新请求记录
            await (0, database_1.getPrisma)().dueDiligenceRequest.upsert({
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
        }
        else {
            // 删除请求记录
            await (0, database_1.getPrisma)().dueDiligenceRequest.deleteMany({
                where: {
                    listingId,
                    buyerId,
                    documentName
                }
            });
        }
        res.json({ message: 'Document request updated successfully' });
    }
    catch (error) {
        console.error('Error updating document request:', error);
        res.status(500).json({
            message: 'Failed to update document request',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// buyer记录下载尽职调查文档
router.post('/listings/:listingId/due-diligence/download', auth_1.authenticateBuyer, async (req, res) => {
    try {
        const { listingId } = req.params;
        const { documentId, stepId } = req.body;
        const typedReq = req;
        if (!typedReq.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        // 获取原始文档
        const sourceDocument = await (0, database_1.getPrisma)().document.findFirst({
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
        await (0, database_1.getPrisma)().document.create({
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
    }
    catch (error) {
        console.error('Error recording download:', error);
        res.status(500).json({
            message: 'Failed to record download',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Pre-Close Checklist APIs for Buyer
// 获取listing的pre-close checklist (Buyer只能访问自己选择的listing的checklist)
router.get('/listings/:listingId/pre-close-checklist', auth_1.authenticateBuyer, async (req, res) => {
    try {
        const { listingId } = req.params;
        const typedReq = req;
        if (!typedReq.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        // 验证buyer是否对该listing有兴趣
        const buyerProgress = await (0, database_1.getPrisma)().buyerProgress.findFirst({
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
        let checklist = await (0, database_1.getPrisma)().preCloseChecklist.findUnique({
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
            checklist = await (0, database_1.getPrisma)().preCloseChecklist.create({
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
        const mergedChecklist = mergeChecklistItems(checklist.buyerItems, checklist.sellerItems, checklist.brokerItems);
        res.json({
            checklist: mergedChecklist,
            lastUpdatedBy: checklist.lastUpdatedByUser?.name,
            updatedAt: checklist.updatedAt
        });
    }
    catch (error) {
        console.error('Error fetching pre-close checklist:', error);
        res.status(500).json({
            message: 'Failed to fetch pre-close checklist',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// 更新checklist item (Buyer可以更新任何item，实现协作)
router.put('/listings/:listingId/pre-close-checklist/item', auth_1.authenticateBuyer, async (req, res) => {
    try {
        const { listingId } = req.params;
        const { categoryId, itemId, userRole } = req.body;
        const typedReq = req;
        if (!typedReq.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        // 验证buyer是否对该listing有兴趣
        const buyerProgress = await (0, database_1.getPrisma)().buyerProgress.findFirst({
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
        let checklist = await (0, database_1.getPrisma)().preCloseChecklist.findUnique({
            where: { listingId }
        });
        if (!checklist) {
            const defaultChecklistData = getDefaultChecklistData();
            checklist = await (0, database_1.getPrisma)().preCloseChecklist.create({
                data: {
                    listingId,
                    buyerItems: defaultChecklistData.buyerItems,
                    sellerItems: defaultChecklistData.sellerItems,
                    brokerItems: defaultChecklistData.brokerItems
                }
            });
        }
        // 更新对应的item
        const updatedChecklist = await updateChecklistItem(checklist, categoryId, itemId, typedReq.user.id, typedReq.user.name || 'Unknown User', userRole);
        // 合并所有items到一个checklist结构
        const mergedChecklist = mergeChecklistItems(updatedChecklist.buyerItems, updatedChecklist.sellerItems, updatedChecklist.brokerItems);
        res.json({
            checklist: mergedChecklist,
            lastUpdatedBy: typedReq.user.name || 'Unknown User',
            updatedAt: updatedChecklist.updatedAt
        });
    }
    catch (error) {
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
    const buyerItems = {};
    const sellerItems = {};
    const brokerItems = {};
    Object.entries(defaultStructure).forEach(([categoryId, category]) => {
        buyerItems[categoryId] = { title: category.title, items: {} };
        sellerItems[categoryId] = { title: category.title, items: {} };
        brokerItems[categoryId] = { title: category.title, items: {} };
        Object.entries(category.items).forEach(([itemId, item]) => {
            if (item.responsible === 'buyer') {
                buyerItems[categoryId].items[itemId] = item;
            }
            else if (item.responsible === 'seller') {
                sellerItems[categoryId].items[itemId] = item;
            }
            else if (item.responsible === 'broker') {
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
function mergeChecklistItems(buyerItems, sellerItems, brokerItems) {
    const mergedChecklist = [];
    const allCategories = new Set([
        ...Object.keys(buyerItems || {}),
        ...Object.keys(sellerItems || {}),
        ...Object.keys(brokerItems || {})
    ]);
    Array.from(allCategories).forEach(categoryId => {
        const category = {
            id: categoryId,
            title: (buyerItems[categoryId]?.title || sellerItems[categoryId]?.title || brokerItems[categoryId]?.title),
            items: []
        };
        // 合并所有items
        const allItems = new Set([
            ...Object.keys(buyerItems[categoryId]?.items || {}),
            ...Object.keys(sellerItems[categoryId]?.items || {}),
            ...Object.keys(brokerItems[categoryId]?.items || {})
        ]);
        Array.from(allItems).forEach(itemId => {
            const item = buyerItems[categoryId]?.items[itemId] ||
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
async function updateChecklistItem(checklist, categoryId, itemId, userId, userName, userRole) {
    const buyerItems = checklist.buyerItems || {};
    const sellerItems = checklist.sellerItems || {};
    const brokerItems = checklist.brokerItems || {};
    // 找到要更新的item
    let itemToUpdate = null;
    let targetItems = null;
    if (buyerItems[categoryId]?.items[itemId]) {
        itemToUpdate = buyerItems[categoryId].items[itemId];
        targetItems = buyerItems;
    }
    else if (sellerItems[categoryId]?.items[itemId]) {
        itemToUpdate = sellerItems[categoryId].items[itemId];
        targetItems = sellerItems;
    }
    else if (brokerItems[categoryId]?.items[itemId]) {
        itemToUpdate = brokerItems[categoryId].items[itemId];
        targetItems = brokerItems;
    }
    if (itemToUpdate && targetItems) {
        // 切换完成状态
        itemToUpdate.completed = !itemToUpdate.completed;
        if (itemToUpdate.completed) {
            itemToUpdate.completedBy = userName;
            itemToUpdate.completedAt = new Date().toISOString();
        }
        else {
            delete itemToUpdate.completedBy;
            delete itemToUpdate.completedAt;
        }
        // 更新数据库
        return await (0, database_1.getPrisma)().preCloseChecklist.update({
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
// Get buyer's NDA data
router.get('/nda', auth_1.authenticateBuyer, async (req, res) => {
    try {
        const typedReq = req;
        if (!typedReq.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const nda = await (0, database_1.getPrisma)().buyerNDA.findFirst({
            where: {
                buyerId: typedReq.user.id
            }
        });
        res.json({ nda: nda?.data || null });
    }
    catch (error) {
        console.error('Error getting NDA:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// Save NDA (without generating PDF)
router.post('/nda/save', auth_1.authenticateBuyer, async (req, res) => {
    try {
        const typedReq = req;
        const { nda } = req.body;
        if (!typedReq.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        await (0, database_1.getPrisma)().buyerNDA.upsert({
            where: {
                buyerId: typedReq.user.id
            },
            update: {
                data: nda,
                updatedAt: new Date()
            },
            create: {
                buyerId: typedReq.user.id,
                data: nda
            }
        });
        res.json({ message: 'NDA saved successfully' });
    }
    catch (error) {
        console.error('Error saving NDA:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// Submit NDA and generate PDF
router.post('/nda/submit', auth_1.authenticateBuyer, async (req, res) => {
    try {
        const typedReq = req;
        const { nda } = req.body;
        if (!typedReq.user || !typedReq.user.id) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        // Get buyer's progress to find selected listing
        const buyerProgress = await (0, database_1.getPrisma)().buyerProgress.findUnique({
            where: { buyerId: typedReq.user.id }
        });
        if (!buyerProgress?.selectedListingId) {
            res.status(400).json({ message: 'No listing selected' });
            return;
        }
        // Get the selected listing to include in the PDF
        const listing = await (0, database_1.getPrisma)().listing.findUnique({
            where: { id: buyerProgress.selectedListingId },
            select: { id: true, title: true, description: true, price: true, sellerId: true }
        });
        if (!listing) {
            res.status(400).json({ message: 'Selected listing not found' });
            return;
        }
        // Save NDA data
        await (0, database_1.getPrisma)().buyerNDA.upsert({
            where: {
                buyerId: typedReq.user.id
            },
            update: {
                data: nda,
                updatedAt: new Date(),
                submitted: true,
                submittedAt: new Date()
            },
            create: {
                buyerId: typedReq.user.id,
                data: nda,
                submitted: true,
                submittedAt: new Date()
            }
        });
        // Generate filename with timestamp
        const timestamp = Date.now();
        const fileName = `listings/${buyerProgress.selectedListingId}/buyer/nda.pdf`;
        // Delete previous NDA documents if they exist
        const existingDocs = await (0, database_1.getPrisma)().document.findMany({
            where: {
                buyerId: typedReq.user.id,
                listingId: buyerProgress.selectedListingId,
                type: 'NDA',
                category: 'BUYER_UPLOAD'
            }
        });
        // Delete old files from Supabase Storage
        const bucketName = (0, supabase_1.getStorageBucket)();
        for (const doc of existingDocs) {
            if (doc.url) {
                const urlParts = doc.url.split('/');
                const bucketIndex = urlParts.findIndex((part) => part === bucketName);
                if (bucketIndex !== -1 && bucketIndex < urlParts.length - 1) {
                    const filePath = urlParts.slice(bucketIndex + 1).join('/');
                    await supabase_1.supabase.storage.from(bucketName).remove([filePath]);
                }
            }
        }
        // Delete old database records
        await (0, database_1.getPrisma)().document.deleteMany({
            where: {
                buyerId: typedReq.user.id,
                listingId: buyerProgress.selectedListingId,
                type: 'NDA',
                category: 'BUYER_UPLOAD'
            }
        });
        // Generate PDF
        let pdfBuffer = null;
        try {
            pdfBuffer = await generateNDAPDFAsync(nda, typedReq.user, listing);
            // Upload PDF to Supabase Storage
            const supabaseFileName = `listings/${buyerProgress.selectedListingId}/buyer/nda_${timestamp}.pdf`;
            const { data: uploadData, error: uploadError } = await supabase_1.supabase.storage
                .from(bucketName)
                .upload(supabaseFileName, pdfBuffer, {
                contentType: 'application/pdf',
                upsert: true
            });
            if (uploadError) {
                console.error('Supabase upload error:', uploadError);
                throw new Error('Failed to upload PDF to storage');
            }
            // Get public URL
            const { data: { publicUrl } } = supabase_1.supabase.storage
                .from(bucketName)
                .getPublicUrl(supabaseFileName);
            // Create new document record
            const document = await (0, database_1.getPrisma)().document.create({
                data: {
                    fileName: `nda_${timestamp}.pdf`,
                    url: publicUrl,
                    fileSize: pdfBuffer ? pdfBuffer.length : 0,
                    type: 'NDA',
                    category: 'BUYER_UPLOAD',
                    sellerId: listing.sellerId, // Add the missing sellerId field
                    buyerId: typedReq.user.id,
                    listingId: buyerProgress.selectedListingId,
                    uploadedBy: typedReq.user.id,
                    stepId: 2,
                    status: 'COMPLETED',
                    operationType: 'UPLOAD',
                    uploadedAt: new Date()
                }
            });
            res.json({
                message: 'NDA submitted successfully',
                document: document
            });
        }
        catch (pdfError) {
            console.error('PDF generation or upload error:', pdfError);
            res.status(500).json({ message: 'Failed to generate or upload NDA PDF' });
        }
    }
    catch (error) {
        console.error('Error submitting NDA:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// Async PDF generation function for NDA
function generateNDAPDFAsync(nda, user, listing) {
    return new Promise((resolve, reject) => {
        try {
            const PDFDocument = require('pdfkit');
            const doc = new PDFDocument({ margin: 50 });
            const chunks = [];
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => {
                resolve(Buffer.concat(chunks));
            });
            doc.on('error', (error) => {
                reject(error);
            });
            // PDF Header
            doc.fontSize(20).font('Helvetica-Bold').text('NON-DISCLOSURE AGREEMENT', { align: 'center' });
            doc.moveDown();
            doc.fontSize(14).font('Helvetica').text('California Business Sales', { align: 'center' });
            doc.moveDown(2);
            // Introduction
            doc.fontSize(12).font('Helvetica').text('Our agreement with the seller requires that we obtain a nondisclosure and confidentiality agreement and evidence of financial ability before disclosing the name and location of his business. This information will be kept confidential. In compliance with the above, please read and complete the following nondisclosure and confidentiality agreement.', { align: 'justify' });
            doc.moveDown();
            doc.text('In consideration of the broker, California Business Sales providing the information on businesses for sale, I/we, the undersigned, understand and agree:', { align: 'justify' });
            doc.moveDown(2);
            // Personal Information
            addNDASection(doc, 'PERSONAL INFORMATION');
            addNDAField(doc, 'Name', `${nda.firstName} ${nda.lastName}`);
            if (nda.organization)
                addNDAField(doc, 'Organization', nda.organization);
            addNDAField(doc, 'Email', nda.email);
            addNDAField(doc, 'Phone', nda.phone);
            if (nda.addressLine1 || nda.city || nda.state || nda.zipCode) {
                const address = [
                    nda.addressLine1,
                    nda.addressLine2,
                    [nda.city, nda.state, nda.zipCode].filter(Boolean).join(', ')
                ].filter(Boolean).join('\n');
                addNDAField(doc, 'Address', address);
            }
            doc.moveDown();
            // Business Interest
            addNDASection(doc, 'BUSINESS INTEREST');
            if (nda.listingInterest && listing) {
                addNDAField(doc, 'Listing Interest', `${listing.title} - $${listing.price.toLocaleString()}`);
            }
            if (nda.availableMoney)
                addNDAField(doc, 'Available Money', nda.availableMoney);
            if (nda.minimumIncome)
                addNDAField(doc, 'Minimum Income Required', nda.minimumIncome);
            if (nda.totalPriceWilling)
                addNDAField(doc, 'Total Price Willing to Pay', nda.totalPriceWilling);
            if (nda.californiaRegions && nda.californiaRegions.length > 0) {
                addNDAField(doc, 'California Regions of Interest', nda.californiaRegions.join(', '));
            }
            if (nda.timeFrameToPurchase)
                addNDAField(doc, 'Time Frame to Purchase', nda.timeFrameToPurchase);
            doc.moveDown();
            // Agreement Terms
            addNDASection(doc, 'AGREEMENT TERMS');
            const terms = [
                'That information provided on businesses by California Business Sales is sensitive and confidential and that its disclosure to others would be damaging to the businesses and to the broker\'s fiduciary relationship with the seller.',
                'That I will not disclose any information regarding these businesses to any other person who has not also signed and dated this agreement, except to secure their advice and counsel, in which case I agree to obtain their consent to maintain such confidentiality. "Information" shall include the fact that the business is for sale, plus other data. The term "information" does not include any information, which is, or becomes, generally available to the public or is already in your possession. All information provided to review the business will be returned to California Business Sales without retaining copies, summaries, analyses, or extracts thereof in the event the review is terminated.',
                'That I will not contact the seller, his/her employees, suppliers, or customers except through California Business Sales.',
                'That all information is provided by the seller and is not verified in any way by California Business Sales. California Business Sales is relying on the seller for the accuracy and completeness of said information, has no knowledge of the accuracy of said information, and makes no warranty, express or implied, as to such information.',
                'California Business Sales does not give tax, accounting, or legal advice. That, prior to finalizing an agreement to purchase a business, it is my responsibility to make an independent verification of all information. I agree that California Business Sales is not responsible for the accuracy of any information I receive, and I agree to indemnify and hold California Business Sales harmless from any claims or damages resulting from its use. I will look only to the seller and to my own investigation for all information regarding any business offered by California Business Sales.',
                'That, should I enter into an agreement to purchase a business which California Business Sales offers for sale, I grant to the seller the right to obtain, through standard reporting agencies, financial and credit information concerning myself or the companies or other parties I represent; and I understand that this information will be held confidential by the seller and California Business Sales and will be used only for the purpose of the seller extending credit to me.',
                'That all correspondence, inquiries, offers to purchase, and negotiations relating to the purchase or lease of any business presented to me, or companies I represent, by California Business Sales, will be conducted exclusively through California Business Sales.'
            ];
            terms.forEach((term, index) => {
                doc.fontSize(11).font('Helvetica').text(`${index + 1}. ${term}`, 50, doc.y, { align: 'justify' });
                doc.moveDown();
                // Add new page if needed
                if (doc.y > 700) {
                    doc.addPage();
                }
            });
            doc.moveDown(2);
            // Signature Section
            addNDASection(doc, 'ACCEPTANCE & SIGNATURE');
            doc.fontSize(11).font('Helvetica').text('By signing below, I agree to the terms of this agreement:', 50, doc.y);
            doc.moveDown(2);
            // Signature line
            doc.fontSize(11).font('Helvetica').text('Signature:', 50, doc.y);
            doc.fontSize(14).font('Helvetica-Bold').text(nda.signature || '', 120, doc.y - 5);
            doc.moveTo(120, doc.y + 15).lineTo(400, doc.y + 15).stroke();
            doc.moveDown(2);
            // Date
            doc.fontSize(11).font('Helvetica').text('Date:', 50, doc.y);
            doc.text(new Date().toLocaleDateString(), 120, doc.y - 12);
            doc.moveTo(120, doc.y + 3).lineTo(250, doc.y + 3).stroke();
            doc.end();
        }
        catch (error) {
            reject(error);
        }
    });
}
// Helper functions for NDA PDF
function addNDASection(doc, title) {
    if (doc.y > 720) {
        doc.addPage();
    }
    doc.fontSize(14).font('Helvetica-Bold').text(title, 50, doc.y);
    doc.moveDown();
}
function addNDAField(doc, label, value) {
    if (doc.y > 740) {
        doc.addPage();
    }
    doc.fontSize(11).font('Helvetica-Bold').text(`${label}: `, 50, doc.y, { continued: true });
    doc.font('Helvetica').text(value || 'N/A');
    doc.moveDown(0.5);
}
// Get available listings for selection
router.get('/available-listings', auth_1.authenticateBuyer, async (req, res) => {
    try {
        const listings = await (0, database_1.getPrisma)().listing.findMany({
            where: {
                status: 'ACTIVE' // Only show active listings
            },
            select: {
                id: true,
                title: true,
                description: true,
                price: true,
                status: true,
                createdAt: true,
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
    }
    catch (error) {
        console.error('Error fetching available listings:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.get('/dashboard', auth_1.authenticateBuyer, getDashboardStats);
router.get('/listings', auth_1.authenticateBuyer, getListings);
router.get('/progress', auth_1.authenticateBuyer, getProgress);
router.post('/select-listing', auth_1.authenticateBuyer, selectListing);
router.post('/update-step', auth_1.authenticateBuyer, updateStep);
router.get('/step/:stepId/documents', auth_1.authenticateBuyer, getStepDocuments);
router.post('/step/:stepId/upload', auth_1.authenticateBuyer, uploadStepDocument);
router.post('/step/:stepId/download', auth_1.authenticateBuyer, downloadStepDocument);
router.get('/current-listing', auth_1.authenticateBuyer, getCurrentListing);
// Get buyer's financial statement data
router.get('/financial-statement', auth_1.authenticateBuyer, async (req, res) => {
    try {
        const typedReq = req;
        if (!typedReq.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const financialStatement = await (0, database_1.getPrisma)().buyerFinancialStatement.findFirst({
            where: {
                buyerId: typedReq.user.id
            }
        });
        res.json({ financialStatement: financialStatement?.data || null });
    }
    catch (error) {
        console.error('Error getting financial statement:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// Save financial statement (without generating PDF)
router.post('/financial-statement/save', auth_1.authenticateBuyer, async (req, res) => {
    try {
        const typedReq = req;
        const { financialStatement } = req.body;
        if (!typedReq.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        await (0, database_1.getPrisma)().buyerFinancialStatement.upsert({
            where: {
                buyerId: typedReq.user.id
            },
            update: {
                data: financialStatement,
                updatedAt: new Date()
            },
            create: {
                buyerId: typedReq.user.id,
                data: financialStatement
            }
        });
        res.json({ message: 'Financial statement saved successfully' });
    }
    catch (error) {
        console.error('Error saving financial statement:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// Submit financial statement and generate PDF
router.post('/financial-statement/submit', auth_1.authenticateBuyer, async (req, res) => {
    try {
        const typedReq = req;
        const { financialStatement } = req.body;
        if (!typedReq.user || !typedReq.user.id) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        // Get buyer's progress to find selected listing
        const buyerProgress = await (0, database_1.getPrisma)().buyerProgress.findUnique({
            where: { buyerId: typedReq.user.id }
        });
        if (!buyerProgress?.selectedListingId) {
            res.status(400).json({ message: 'No listing selected' });
            return;
        }
        // Get the selected listing to include in the PDF
        const listing = await (0, database_1.getPrisma)().listing.findUnique({
            where: { id: buyerProgress.selectedListingId },
            select: { id: true, title: true, description: true, price: true, sellerId: true }
        });
        if (!listing) {
            res.status(400).json({ message: 'Selected listing not found' });
            return;
        }
        // Save financial statement data
        await (0, database_1.getPrisma)().buyerFinancialStatement.upsert({
            where: {
                buyerId: typedReq.user.id
            },
            update: {
                data: financialStatement,
                updatedAt: new Date(),
                submitted: true,
                submittedAt: new Date()
            },
            create: {
                buyerId: typedReq.user.id,
                data: financialStatement,
                submitted: true,
                submittedAt: new Date()
            }
        });
        // Generate filename with timestamp
        const timestamp = Date.now();
        // Delete previous financial statement documents if they exist
        const existingDocs = await (0, database_1.getPrisma)().document.findMany({
            where: {
                buyerId: typedReq.user.id,
                listingId: buyerProgress.selectedListingId,
                type: 'FINANCIAL_STATEMENT',
                category: 'BUYER_UPLOAD'
            }
        });
        // Delete old files from Supabase Storage
        const bucketName = (0, supabase_1.getStorageBucket)();
        for (const doc of existingDocs) {
            if (doc.url) {
                const urlParts = doc.url.split('/');
                const bucketIndex = urlParts.findIndex((part) => part === bucketName);
                if (bucketIndex !== -1 && bucketIndex < urlParts.length - 1) {
                    const filePath = urlParts.slice(bucketIndex + 1).join('/');
                    await supabase_1.supabase.storage.from(bucketName).remove([filePath]);
                }
            }
        }
        // Delete old database records
        await (0, database_1.getPrisma)().document.deleteMany({
            where: {
                buyerId: typedReq.user.id,
                listingId: buyerProgress.selectedListingId,
                type: 'FINANCIAL_STATEMENT',
                category: 'BUYER_UPLOAD'
            }
        });
        // Generate PDF
        let pdfBuffer = null;
        try {
            pdfBuffer = await generateFinancialStatementPDFAsync(financialStatement, typedReq.user, listing);
            // Upload PDF to Supabase Storage
            const supabaseFileName = `listings/${buyerProgress.selectedListingId}/buyer/financial_statement_${timestamp}.pdf`;
            const { data: uploadData, error: uploadError } = await supabase_1.supabase.storage
                .from(bucketName)
                .upload(supabaseFileName, pdfBuffer, {
                contentType: 'application/pdf',
                upsert: true
            });
            if (uploadError) {
                console.error('Supabase upload error:', uploadError);
                throw new Error('Failed to upload PDF to storage');
            }
            // Get public URL
            const { data: { publicUrl } } = supabase_1.supabase.storage
                .from(bucketName)
                .getPublicUrl(supabaseFileName);
            // Create new document record
            const document = await (0, database_1.getPrisma)().document.create({
                data: {
                    fileName: `financial_statement_${timestamp}.pdf`,
                    url: publicUrl,
                    fileSize: pdfBuffer ? pdfBuffer.length : 0,
                    type: 'FINANCIAL_STATEMENT',
                    category: 'BUYER_UPLOAD',
                    sellerId: listing.sellerId,
                    buyerId: typedReq.user.id,
                    listingId: buyerProgress.selectedListingId,
                    uploadedBy: typedReq.user.id,
                    stepId: 3,
                    status: 'COMPLETED',
                    operationType: 'UPLOAD',
                    uploadedAt: new Date()
                }
            });
            res.json({
                message: 'Financial statement submitted successfully',
                document: document
            });
        }
        catch (pdfError) {
            console.error('PDF generation or upload error:', pdfError);
            res.status(500).json({ message: 'Failed to generate or upload financial statement PDF' });
        }
    }
    catch (error) {
        console.error('Error submitting financial statement:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// Async PDF generation function for Financial Statement
function generateFinancialStatementPDFAsync(financialData, user, listing) {
    return new Promise((resolve, reject) => {
        try {
            const PDFDocument = require('pdfkit');
            const doc = new PDFDocument({ margin: 50 });
            const chunks = [];
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => {
                resolve(Buffer.concat(chunks));
            });
            doc.on('error', (error) => {
                reject(error);
            });
            // PDF Header
            doc.fontSize(20).font('Helvetica-Bold').text('PERSONAL FINANCIAL STATEMENT OF', { align: 'center' });
            doc.moveDown();
            doc.fontSize(16).font('Helvetica-Bold').text(financialData.name || '', { align: 'center' });
            const line = '_'.repeat(50);
            doc.fontSize(12).font('Helvetica').text(line, { align: 'center' });
            doc.moveDown(2);
            // Prepared on
            doc.text(`Prepared on: ${financialData.preparedOn || new Date().toLocaleDateString()}`, 50, doc.y);
            doc.moveDown(2);
            // Personal Information
            doc.text(`MAILING ADDRESS: ${financialData.mailingAddress || ''}`, 50, doc.y);
            doc.moveDown();
            if (financialData.spouseName) {
                doc.text(`Spouse's Name (if applicable): ${financialData.spouseName}`, 50, doc.y);
                doc.moveDown();
            }
            doc.moveDown();
            // Assets Section
            addFinancialSection(doc, 'ASSETS');
            doc.fontSize(11).font('Helvetica').text('Provide the total value of each asset class; if you have more than one account or item, add up the individual amounts. See the attachment to provide greater detail.', 50, doc.y, { align: 'justify' });
            doc.moveDown();
            const assets = [
                ['Checking Accounts', financialData.checkingAccounts],
                ['Savings Accounts', financialData.savingsAccounts],
                ['Certificates of Deposit', financialData.certificatesOfDeposit],
                ['Securities (Stocks/Bonds/Mutual Funds)', financialData.securities],
                ['Notes Receivable', financialData.notesReceivable],
                ['Personal Property', financialData.personalProperty],
                ['Real Estate', financialData.realEstate],
                ['Life Insurance', financialData.lifeInsurance],
                ['Retirement Accounts', financialData.retirementAccounts],
                ['Other Assets', financialData.otherAssets]
            ];
            let totalAssets = 0;
            assets.forEach(([label, value]) => {
                const amount = parseFloat((value || '').replace(/[$,]/g, '')) || 0;
                totalAssets += amount;
                addFinancialLine(doc, label, formatCurrencyForPDF(amount));
            });
            doc.moveDown();
            doc.fontSize(12).font('Helvetica-Bold').text(`TOTAL ASSETS: ${formatCurrencyForPDF(totalAssets)}`, 450, doc.y);
            doc.moveDown(2);
            // Liabilities Section
            addFinancialSection(doc, 'LIABILITIES');
            doc.fontSize(11).font('Helvetica').text('Provide the total value of each liability type; if you have more than one of a category, add up the individual amounts. See the attachment to provide greater detail.', 50, doc.y, { align: 'justify' });
            doc.moveDown();
            const liabilities = [
                ['Credit Card Debt', financialData.creditCardDebt],
                ['Student Loans', financialData.studentLoans],
                ['Vehicle Loans', financialData.vehicleLoans],
                ['Real Property Mortgages', financialData.realPropertyMortgages],
                ['Notes Payable/Promissory Notes', financialData.notesPayable],
                ['Other Liabilities', financialData.otherLiabilities]
            ];
            let totalLiabilities = 0;
            liabilities.forEach(([label, value]) => {
                const amount = parseFloat((value || '').replace(/[$,]/g, '')) || 0;
                totalLiabilities += amount;
                addFinancialLine(doc, label, formatCurrencyForPDF(amount));
            });
            doc.moveDown();
            doc.fontSize(12).font('Helvetica-Bold').text(`TOTAL LIABILITIES: ${formatCurrencyForPDF(totalLiabilities)}`, 450, doc.y);
            doc.moveDown(2);
            // Net Worth
            const netWorth = totalAssets - totalLiabilities;
            addFinancialSection(doc, 'NET WORTH');
            doc.fontSize(12).font('Helvetica').text(`${formatCurrencyForPDF(totalAssets)} - ${formatCurrencyForPDF(totalLiabilities)} = ${formatCurrencyForPDF(netWorth)}`, 50, doc.y);
            doc.moveDown(2);
            // Add new page if needed for certification
            if (doc.y > 650) {
                doc.addPage();
            }
            // Certification
            addFinancialSection(doc, 'CERTIFICATION');
            doc.fontSize(11).font('Helvetica').text('I certify that the information contained in this statement is true and accurate to the best of my knowledge on the date indicated. I agree that, if after submitting this statement, there are any material changes to my finances that would impact the information it contains, I have an affirmative duty to alert the person or entity receiving this statement as soon as possible. I acknowledge that, as a result of submitting this statement, further inquiries, including a credit report, may be necessary to verify the information contained, and I hereby authorize the person or entity receiving those statements to make such inquiries.', 50, doc.y, { align: 'justify' });
            doc.moveDown(2);
            // Signature
            doc.fontSize(11).font('Helvetica').text('Signature:', 50, doc.y);
            doc.fontSize(14).font('Helvetica-Bold').text(financialData.signature || '', 120, doc.y - 5);
            doc.moveTo(120, doc.y + 15).lineTo(400, doc.y + 15).stroke();
            doc.fontSize(11).font('Helvetica').text('Date:', 420, doc.y - 12);
            doc.text(financialData.certificationDate || new Date().toLocaleDateString(), 450, doc.y - 12);
            doc.moveTo(450, doc.y + 3).lineTo(550, doc.y + 3).stroke();
            doc.moveDown(2);
            // Print Name
            doc.fontSize(11).font('Helvetica').text('Print Name:', 50, doc.y);
            doc.fontSize(12).font('Helvetica').text(financialData.printName || '', 120, doc.y - 5);
            doc.moveTo(120, doc.y + 15).lineTo(400, doc.y + 15).stroke();
            doc.end();
        }
        catch (error) {
            reject(error);
        }
    });
}
// Helper functions for Financial Statement PDF
function addFinancialSection(doc, title) {
    if (doc.y > 720) {
        doc.addPage();
    }
    doc.fontSize(14).font('Helvetica-Bold').text(title, 50, doc.y);
    const underline = '_'.repeat(title.length + 20);
    doc.fontSize(12).font('Helvetica').text(underline, 50, doc.y);
    doc.moveDown();
}
function addFinancialLine(doc, label, value) {
    if (doc.y > 740) {
        doc.addPage();
    }
    doc.fontSize(11).font('Helvetica').text(label, 50, doc.y, { width: 350, continued: true });
    doc.text(value, 450, doc.y - 12);
    doc.moveDown(0.5);
}
function formatCurrencyForPDF(amount) {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}
exports.default = router;
