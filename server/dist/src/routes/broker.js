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
        // Only allow PDF, DOC, DOCX files
        if (file.mimetype === 'application/pdf' ||
            file.mimetype === 'application/msword' ||
            file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            cb(null, true);
        }
        else {
            cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
        }
    }
});
// 获取仪表板统计数据
const getDashboardStats = async (req, res, next) => {
    const typedReq = req;
    try {
        const brokerId = typedReq.user?.id;
        if (!brokerId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        console.log('=== Broker Dashboard Stats Debug ===');
        console.log('BrokerId:', brokerId);
        // 简化统计逻辑：直接统计所有listings，不依赖复杂的管理关系链
        // 4. 统计房源数据
        const [activeListings, newListings, ndaCount, closedDeals] = await Promise.all([
            // Active listings: 直接统计所有ACTIVE状态的listings
            (0, database_1.getPrisma)().listing.count({
                where: {
                    status: 'ACTIVE',
                },
            }),
            // New listings this month: 统计本月创建的所有listings
            (0, database_1.getPrisma)().listing.count({
                where: {
                    createdAt: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    },
                },
            }),
            // NDA count: 统计所有NDA文档
            (0, database_1.getPrisma)().document.count({
                where: {
                    type: 'NDA',
                },
            }),
            // Closed deals this year: 统计今年关闭的所有deals
            (0, database_1.getPrisma)().listing.count({
                where: {
                    status: 'CLOSED',
                    createdAt: {
                        gte: new Date(new Date().getFullYear(), 0, 1),
                    },
                },
            }),
        ]);
        // Under contract: 统计处于closing doc步骤(step 9)的listings
        // 先获取所有seller progress，然后在代码中过滤
        const allSellerProgress = await (0, database_1.getPrisma)().sellerProgress.findMany({
            include: {
                seller: {
                    include: {
                        listings: {
                            where: {
                                status: { in: ['ACTIVE', 'UNDER_CONTRACT'] } // 只统计active或under_contract状态的
                            }
                        }
                    }
                }
            }
        });
        // 在代码中过滤处于step 9及以上的sellers
        let underContract = 0;
        allSellerProgress.forEach((progress) => {
            const completedSteps = progress.completedSteps || [];
            const currentStep = progress.currentStep || 0;
            // 检查是否处于closing doc步骤（step 9）或已完成step 9
            const isAtClosingStep = currentStep >= 9 || completedSteps.includes(9);
            if (isAtClosingStep && progress.seller && progress.seller.listings) {
                underContract += progress.seller.listings.length;
            }
        });
        console.log('Broker Dashboard Stats Results:', {
            activeListings,
            underContract,
            newListings,
            ndaCount,
            closedDeals,
            sellersAtClosingStepCount: allSellerProgress.length
        });
        console.log('=== End Broker Dashboard Stats Debug ===');
        res.json({
            stats: {
                totalActiveListings: activeListings,
                totalUnderContract: underContract,
                newListingsThisMonth: newListings,
                totalNDA: ndaCount,
                totalClosedDeals: closedDeals,
            },
            message: 'Dashboard stats retrieved successfully',
        });
    }
    catch (error) {
        console.error('Error in getDashboardStats:', error);
        next(error);
    }
};
// 获取经纪人管理的代理列表
const getAgents = async (req, res, next) => {
    const typedReq = req;
    try {
        const brokerId = typedReq.user?.id;
        if (!brokerId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        // 简化权限验证：broker可以查看所有agent（用于管理目的）
        const agents = await (0, database_1.getPrisma)().user.findMany({
            where: {
                role: 'AGENT',
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            },
        });
        res.json({
            agents,
            message: 'Agents retrieved successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
// 获取代理列表及其统计数据
const getAgentsWithStats = async (req, res, next) => {
    const typedReq = req;
    try {
        const brokerId = typedReq.user?.id;
        if (!brokerId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        // 简化权限验证：broker可以查看所有agent（用于管理目的）
        const agents = await (0, database_1.getPrisma)().user.findMany({
            where: {
                role: 'AGENT',
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            },
        });
        // 为每个代理获取统计数据
        const agentsWithStats = await Promise.all(agents.map(async (agent) => {
            // 获取代理管理的所有客户
            const managedClients = await (0, database_1.getPrisma)().user.findMany({
                where: {
                    managerId: agent.id,
                    role: {
                        in: ['SELLER', 'BUYER']
                    }
                },
                select: {
                    id: true,
                },
            });
            const clientIds = managedClients.map((client) => client.id);
            // 获取统计数据
            const [numberOfListings, numberUnderContract, closingsToDate] = await Promise.all([
                // 总房源数 - 只统计代理管理的卖家的房源
                (0, database_1.getPrisma)().listing.findMany({
                    where: {
                        sellerId: { in: clientIds }
                    },
                    distinct: ['id'],
                }).then((listings) => listings.length),
                // 正在交易中的房源数
                (0, database_1.getPrisma)().listing.findMany({
                    where: {
                        sellerId: { in: clientIds },
                        status: 'UNDER_CONTRACT'
                    },
                    distinct: ['id'],
                }).then((listings) => listings.length),
                // 已完成交易的房源数
                (0, database_1.getPrisma)().listing.findMany({
                    where: {
                        sellerId: { in: clientIds },
                        status: 'CLOSED'
                    },
                    distinct: ['id'],
                }).then((listings) => listings.length)
            ]);
            return {
                ...agent,
                stats: {
                    numberOfListings,
                    numberUnderContract,
                    closingsToDate
                }
            };
        }));
        res.json({
            agents: agentsWithStats,
            message: 'Agents with stats retrieved successfully'
        });
    }
    catch (error) {
        next(error);
    }
};
// 删除 agent
const deleteAgent = async (req, res, next) => {
    const typedReq = req;
    try {
        const brokerId = typedReq.user?.id;
        const agentId = req.params.agentId; // Fix: use agentId instead of id
        if (!brokerId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        // 简化权限验证：broker可以删除任何agent（用于管理目的）
        const agent = await (0, database_1.getPrisma)().user.findFirst({
            where: {
                id: agentId,
                role: 'AGENT'
            }
        });
        if (!agent) {
            res.status(404).json({ message: 'Agent not found' });
            return;
        }
        // 级联删除：先处理相关的数据，避免外键约束冲突
        await (0, database_1.getPrisma)().$transaction(async (prisma) => {
            // 1. 先删除MessageAttachment（必须先于Message删除）
            await prisma.messageAttachment.deleteMany({
                where: {
                    message: {
                        OR: [
                            { senderId: agentId },
                            { receiverId: agentId }
                        ]
                    }
                }
            });
            // 2. 删除agent发送和接收的所有消息
            await prisma.message.deleteMany({
                where: {
                    OR: [
                        { senderId: agentId },
                        { receiverId: agentId }
                    ]
                }
            });
            // 3. 删除agent的所有活动记录
            await prisma.activity.deleteMany({
                where: { userId: agentId }
            });
            // 4. 删除agent作为lastUpdatedBy的checklist记录
            await prisma.preCloseChecklist.updateMany({
                where: { lastUpdatedBy: agentId },
                data: { lastUpdatedBy: null }
            });
            // 5. 删除agent管理的所有listings的pre-close checklist
            const managedListings = await prisma.listing.findMany({
                where: {
                    seller: {
                        managerId: agentId
                    }
                },
                select: { id: true }
            });
            const listingIds = managedListings.map((listing) => listing.id);
            if (listingIds.length > 0) {
                await prisma.preCloseChecklist.deleteMany({
                    where: {
                        listingId: { in: listingIds }
                    }
                });
            }
            // 6. 删除agent上传的所有文档
            await prisma.document.deleteMany({
                where: { uploadedBy: agentId }
            });
            // 7. 将agent管理的所有用户的managerId设为null（解除管理关系）
            await prisma.user.updateMany({
                where: { managerId: agentId },
                data: { managerId: null }
            });
            // 8. 最后删除agent
            await prisma.user.delete({
                where: { id: agentId }
            });
        });
        res.json({ message: 'Agent deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting agent:', error);
        next(error);
    }
};
// 删除 seller
const deleteSeller = async (req, res, next) => {
    const typedReq = req;
    try {
        const brokerId = typedReq.user?.id;
        const sellerId = req.params.sellerId;
        if (!brokerId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        // 简化权限验证：broker可以删除任何seller（用于管理目的）
        const seller = await (0, database_1.getPrisma)().user.findFirst({
            where: {
                id: sellerId,
                role: 'SELLER'
            }
        });
        if (!seller) {
            res.status(404).json({ message: 'Seller not found' });
            return;
        }
        // 级联删除：先删除相关的数据，避免外键约束冲突
        await (0, database_1.getPrisma)().$transaction(async (prisma) => {
            // 1. 先删除MessageAttachment（必须先于Message删除）
            await prisma.messageAttachment.deleteMany({
                where: {
                    message: {
                        OR: [
                            { senderId: sellerId },
                            { receiverId: sellerId }
                        ]
                    }
                }
            });
            // 2. 删除seller发送和接收的所有消息
            await prisma.message.deleteMany({
                where: {
                    OR: [
                        { senderId: sellerId },
                        { receiverId: sellerId }
                    ]
                }
            });
            // 3. 删除seller的所有活动记录
            await prisma.activity.deleteMany({
                where: { userId: sellerId }
            });
            // 4. 删除seller作为lastUpdatedBy的checklist记录
            await prisma.preCloseChecklist.updateMany({
                where: { lastUpdatedBy: sellerId },
                data: { lastUpdatedBy: null }
            });
            // 5. 删除seller的所有listings的pre-close checklist
            const sellerListings = await prisma.listing.findMany({
                where: { sellerId }
            });
            const listingIds = sellerListings.map((listing) => listing.id);
            if (listingIds.length > 0) {
                await prisma.preCloseChecklist.deleteMany({
                    where: {
                        listingId: { in: listingIds }
                    }
                });
            }
            // 6. 删除seller上传的所有文档
            await prisma.document.deleteMany({
                where: { uploadedBy: sellerId }
            });
            // 7. 删除seller的所有listings
            await prisma.listing.deleteMany({
                where: { sellerId }
            });
            // 8. 删除seller的progress记录
            await prisma.sellerProgress.deleteMany({
                where: { sellerId }
            });
            // 9. 删除seller的questionnaire记录
            await prisma.sellerQuestionnaire.deleteMany({
                where: { sellerId }
            });
            // 10. 删除seller相关的documents（作为seller或buyer）
            await prisma.document.deleteMany({
                where: {
                    OR: [
                        { sellerId },
                        { buyerId: sellerId }
                    ]
                }
            });
            // 11. 将seller管理的所有用户的managerId设为null（解除管理关系）
            await prisma.user.updateMany({
                where: { managerId: sellerId },
                data: { managerId: null }
            });
            // 12. 最后删除seller
            await prisma.user.delete({
                where: { id: sellerId }
            });
        });
        res.json({ message: 'Seller deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting seller:', error);
        next(error);
    }
};
// 删除 buyer
const deleteBuyer = async (req, res, next) => {
    const typedReq = req;
    try {
        const brokerId = typedReq.user?.id;
        const buyerId = req.params.buyerId;
        if (!brokerId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        // 简化权限验证：broker可以删除任何buyer（用于管理目的）
        const buyer = await (0, database_1.getPrisma)().user.findFirst({
            where: {
                id: buyerId,
                role: 'BUYER'
            }
        });
        if (!buyer) {
            res.status(404).json({ message: 'Buyer not found' });
            return;
        }
        // 级联删除：先删除相关的数据，避免外键约束冲突
        await (0, database_1.getPrisma)().$transaction(async (prisma) => {
            // 1. 先删除MessageAttachment（必须先于Message删除）
            await prisma.messageAttachment.deleteMany({
                where: {
                    message: {
                        OR: [
                            { senderId: buyerId },
                            { receiverId: buyerId }
                        ]
                    }
                }
            });
            // 2. 删除buyer发送和接收的所有消息
            await prisma.message.deleteMany({
                where: {
                    OR: [
                        { senderId: buyerId },
                        { receiverId: buyerId }
                    ]
                }
            });
            // 3. 删除buyer的所有活动记录
            await prisma.activity.deleteMany({
                where: { userId: buyerId }
            });
            // 4. 删除buyer作为lastUpdatedBy的checklist记录
            await prisma.preCloseChecklist.updateMany({
                where: { lastUpdatedBy: buyerId },
                data: { lastUpdatedBy: null }
            });
            // 5. 删除buyer上传的所有文档
            await prisma.document.deleteMany({
                where: { uploadedBy: buyerId }
            });
            // 6. 删除buyer的progress记录
            await prisma.buyerProgress.deleteMany({
                where: { buyerId }
            });
            // 7. 删除buyer相关的documents（作为buyer）
            await prisma.document.deleteMany({
                where: { buyerId }
            });
            // 8. 删除buyer的NDA记录
            await prisma.buyerNDA.deleteMany({
                where: { buyerId }
            });
            // 9. 删除buyer的financial statement记录
            await prisma.buyerFinancialStatement.deleteMany({
                where: { buyerId }
            });
            // 10. 删除buyer的due diligence requests
            await prisma.dueDiligenceRequest.deleteMany({
                where: { buyerId }
            });
            // 11. 将buyer管理的所有用户的managerId设为null（解除管理关系）
            await prisma.user.updateMany({
                where: { managerId: buyerId },
                data: { managerId: null }
            });
            // 12. 最后删除buyer
            await prisma.user.delete({
                where: { id: buyerId }
            });
        });
        res.json({ message: 'Buyer deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting buyer:', error);
        next(error);
    }
};
// 获取单个代理的统计数据
const getAgentStats = async (req, res, next) => {
    const typedReq = req;
    try {
        const brokerId = typedReq.user?.id;
        const agentId = req.params.agentId;
        if (!brokerId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        // 简化权限验证：broker可以查看任何agent的统计数据（用于管理目的）
        const agent = await (0, database_1.getPrisma)().user.findFirst({
            where: {
                id: agentId,
                role: 'AGENT'
            }
        });
        if (!agent) {
            res.status(404).json({ message: 'Agent not found' });
            return;
        }
        // 获取代理管理的所有客户ID
        const managedClients = await (0, database_1.getPrisma)().user.findMany({
            where: {
                managerId: agentId,
                role: {
                    in: ['SELLER', 'BUYER']
                }
            },
            select: {
                id: true,
            },
        });
        const clientIds = managedClients.map((client) => client.id);
        // 获取统计数据
        const [numberOfListings, numberUnderContract, closingsToDate] = await Promise.all([
            // 总房源数 - 只统计代理管理的卖家的房源
            (0, database_1.getPrisma)().listing.findMany({
                where: {
                    sellerId: { in: clientIds }
                },
                distinct: ['id'],
            }).then((listings) => listings.length),
            // 正在交易中的房源数
            (0, database_1.getPrisma)().listing.findMany({
                where: {
                    sellerId: { in: clientIds },
                    status: 'UNDER_CONTRACT'
                },
                distinct: ['id'],
            }).then((listings) => listings.length),
            // 已完成交易的房源数
            (0, database_1.getPrisma)().listing.findMany({
                where: {
                    sellerId: { in: clientIds },
                    status: 'CLOSED'
                },
                distinct: ['id'],
            }).then((listings) => listings.length)
        ]);
        res.json({
            stats: {
                numberOfListings,
                numberUnderContract,
                closingsToDate
            },
            message: 'Agent stats retrieved successfully'
        });
    }
    catch (error) {
        next(error);
    }
};
// Get all sellers with their listings
const getSellers = async (req, res, next) => {
    const typedReq = req;
    try {
        if (!typedReq.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const sellers = await (0, database_1.getPrisma)().user.findMany({
            where: {
                role: 'SELLER',
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                isActive: true, // 添加isActive字段
                listings: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        price: true,
                        status: true,
                        createdAt: true,
                    }
                }
            }
        });
        res.json({ sellers });
    }
    catch (err) {
        console.error('Error in getSellers:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
// Get all buyers with their interested listings
const getBuyers = async (req, res, next) => {
    const typedReq = req;
    try {
        if (!typedReq.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const buyers = await (0, database_1.getPrisma)().user.findMany({
            where: {
                role: 'BUYER',
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                isActive: true, // 添加isActive字段
                buyingListings: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        price: true,
                        status: true,
                        createdAt: true,
                    }
                }
            }
        });
        res.json({ buyers });
    }
    catch (err) {
        console.error('Error in getBuyers:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
// 获取listing的broker提供的文件
router.get('/listings/:listingId/documents', auth_1.authenticateBroker, async (req, res) => {
    try {
        const { listingId } = req.params;
        const documents = await (0, database_1.getPrisma)().document.findMany({
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
    }
    catch (error) {
        console.error('Error fetching broker documents:', error);
        res.status(500).json({
            message: 'Failed to fetch documents',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// 获取listing的seller上传的文件 - 供broker查看
router.get('/listings/:listingId/seller-documents', auth_1.authenticateBroker, async (req, res) => {
    try {
        const { listingId } = req.params;
        console.log('Broker fetching seller documents for listing:', listingId);
        // 验证listing存在
        const listing = await (0, database_1.getPrisma)().listing.findUnique({
            where: { id: listingId }
        });
        if (!listing) {
            res.status(404).json({ message: 'Listing not found' });
            return;
        }
        const queryConditions = {
            listingId,
            category: 'SELLER_UPLOAD', // 只获取seller上传的文件
            type: {
                in: ['QUESTIONNAIRE', 'FINANCIAL_DOCUMENTS', 'DUE_DILIGENCE', 'LISTING_AGREEMENT', 'PURCHASE_AGREEMENT', 'PURCHASE_CONTRACT', 'UPLOADED_DOC'] // 包括签完字的协议文件
            }
        };
        console.log('Broker query conditions:', queryConditions);
        const documents = await (0, database_1.getPrisma)().document.findMany({
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
        console.log('Broker found seller documents:', documents.map((doc) => ({
            id: doc.id,
            fileName: doc.fileName,
            type: doc.type,
            category: doc.category,
            sellerId: doc.sellerId,
            listingId: doc.listingId,
            createdAt: doc.createdAt
        })));
        res.json({ documents });
    }
    catch (error) {
        console.error('Error fetching seller documents:', error);
        res.status(500).json({
            message: 'Failed to fetch seller documents',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// broker为listing上传文件
router.post('/listings/:listingId/documents', upload.single('file'), auth_1.authenticateBroker, async (req, res) => {
    try {
        const { listingId } = req.params;
        const { documentType, buyerId, description } = req.body;
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
        const listing = await (0, database_1.getPrisma)().listing.findUnique({
            where: { id: listingId },
            include: {
                seller: true
            }
        });
        if (!listing) {
            res.status(404).json({ message: 'Listing not found' });
            return;
        }
        // 如果指定了buyerId，验证buyer是否存在
        if (buyerId) {
            const buyer = await (0, database_1.getPrisma)().user.findFirst({
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
        const bucketName = (0, supabase_1.getStorageBucket)();
        const fileName = `listings/${listingId}/broker/documents/${Date.now()}-${file.originalname}`;
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
                category: 'AGENT_PROVIDED', // broker提供的文件
                fileName: file.originalname,
                fileSize: file.size,
                url: publicUrl,
                listingId,
                sellerId: listing.sellerId,
                buyerId: buyerId || null, // 可选的buyer关联
                uploadedBy: typedReq.user.id, // broker上传
                uploadedAt: new Date(),
                status: 'COMPLETED',
                operationType: 'DOWNLOAD' // 这些文件是供下载用的
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
    }
    catch (error) {
        console.error('Error uploading broker document:', error);
        res.status(500).json({
            message: 'Failed to upload document',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// 删除broker上传的文件
router.delete('/listings/:listingId/documents/:documentId', auth_1.authenticateBroker, async (req, res) => {
    try {
        const { listingId, documentId } = req.params;
        const typedReq = req;
        if (!typedReq.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        // 简化权限验证：broker可以删除任何listing的文档（用于管理目的）
        const listing = await (0, database_1.getPrisma)().listing.findFirst({
            where: { id: listingId }
        });
        if (!listing) {
            res.status(404).json({ message: 'Listing not found' });
            return;
        }
        // 简化权限验证：broker可以删除任何AGENT_PROVIDED文档
        const document = await (0, database_1.getPrisma)().document.findFirst({
            where: {
                id: documentId,
                listingId,
                category: 'AGENT_PROVIDED'
            }
        });
        if (!document) {
            res.status(404).json({ message: 'Document not found or access denied' });
            return;
        }
        // Extract file path for deletion from Supabase
        let filePath = '';
        if (document.url) {
            const url = new URL(document.url);
            const pathParts = url.pathname.split('/');
            // Remove the bucket name from the path
            const bucketIndex = pathParts.findIndex(part => part === (0, supabase_1.getStorageBucket)());
            if (bucketIndex !== -1) {
                filePath = pathParts.slice(bucketIndex + 1).join('/');
            }
        }
        // 从Supabase删除文件
        if (filePath) {
            const { error: deleteError } = await supabase_1.supabase.storage
                .from((0, supabase_1.getStorageBucket)())
                .remove([filePath]);
            if (deleteError) {
                console.error('Supabase delete error:', deleteError);
                // Continue with database deletion even if file deletion fails
            }
        }
        // 从数据库删除记录
        await (0, database_1.getPrisma)().document.delete({
            where: { id: documentId }
        });
        res.json({ message: 'Document deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting broker document:', error);
        res.status(500).json({
            message: 'Failed to delete document',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// broker上传尽职调查文档
router.post('/listings/:listingId/due-diligence/upload', upload.single('file'), auth_1.authenticateBroker, async (req, res) => {
    try {
        const { listingId } = req.params;
        const { documentName, buyerId } = req.body;
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
        if (!documentName) {
            res.status(400).json({ message: 'Document name is required' });
            return;
        }
        // 检查listing是否存在
        const listing = await (0, database_1.getPrisma)().listing.findFirst({
            where: { id: listingId },
            include: {
                seller: true
            }
        });
        if (!listing) {
            res.status(404).json({ message: 'Listing not found' });
            return;
        }
        // Broker可以为任何listing上传due diligence文档
        // 简化权限验证，只要listing存在即可
        // 上传文件到Supabase
        const bucketName = (0, supabase_1.getStorageBucket)();
        const fileName = `listings/${listingId}/due-diligence/${Date.now()}-${file.originalname}`;
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
                stepId: 7
            }
        });
        // 如果存在对应的请求，更新请求状态
        const dueDiligenceRequest = await (0, database_1.getPrisma)().dueDiligenceRequest.findFirst({
            where: {
                listingId,
                buyerId,
                documentName
            }
        });
        if (dueDiligenceRequest) {
            await (0, database_1.getPrisma)().dueDiligenceRequest.update({
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
        }
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
    }
    catch (error) {
        console.error('Error uploading due diligence document:', error);
        res.status(500).json({
            message: 'Failed to upload due diligence document',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// 获取所有listings（用于broker选择）
router.get('/listings', auth_1.authenticateBroker, async (req, res) => {
    try {
        const listings = await (0, database_1.getPrisma)().listing.findMany({
            include: {
                seller: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        managedBy: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
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
    }
    catch (error) {
        console.error('Error fetching listings:', error);
        res.status(500).json({
            message: 'Failed to fetch listings',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Get seller progress for a specific listing
const getSellerProgress = async (req, res, next) => {
    const typedReq = req;
    try {
        const brokerId = typedReq.user?.id;
        const { listingId } = req.params;
        console.log('=== Broker getSellerProgress Debug ===');
        console.log('BrokerId:', brokerId);
        console.log('ListingId:', listingId);
        if (!brokerId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        // 简化权限验证：broker可以访问任何listing的progress（用于管理目的）
        const listing = await (0, database_1.getPrisma)().listing.findFirst({
            where: {
                id: listingId
            },
            include: {
                seller: {
                    include: {
                        sellerProgress: true,
                        managedBy: true // Include the agent info
                    }
                }
            }
        });
        console.log('Listing found:', !!listing);
        if (listing) {
            console.log('Listing ID:', listing.id);
            console.log('Seller ID:', listing.sellerId);
            console.log('Seller Progress:', listing.seller.sellerProgress);
        }
        if (!listing) {
            res.status(404).json({ message: 'Listing not found' });
            return;
        }
        let sellerProgress = listing.seller.sellerProgress;
        // sellerProgress可能是数组，需要取第一个元素
        if (Array.isArray(sellerProgress) && sellerProgress.length > 0) {
            sellerProgress = sellerProgress[0];
        }
        else if (Array.isArray(sellerProgress)) {
            sellerProgress = null;
        }
        // 获取seller progress信息，如果不存在则创建
        if (!sellerProgress) {
            console.log('Creating new seller progress...');
            sellerProgress = await (0, database_1.getPrisma)().sellerProgress.create({
                data: {
                    sellerId: listing.sellerId,
                    currentStep: 0,
                    completedSteps: [],
                    selectedListingId: null
                }
            });
        }
        console.log('Final seller progress data:');
        console.log('- currentStep:', sellerProgress.currentStep);
        console.log('- completedSteps:', sellerProgress.completedSteps);
        console.log('- selectedListingId:', sellerProgress.selectedListingId);
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
        const completedStepsFromDB = sellerProgress.completedSteps || [];
        const currentStep = sellerProgress.currentStep || 0;
        console.log('Processing steps with completedStepsFromDB:', completedStepsFromDB);
        // 设置步骤完成状态和可访问性
        steps.forEach((step, index) => {
            // 直接从数据库数据设置完成状态
            step.completed = completedStepsFromDB.includes(step.id);
            // 设置可访问性：第一步总是可访问，其他步骤需要前一步完成
            if (index === 0) {
                step.accessible = true;
            }
            else {
                step.accessible = steps[index - 1].completed;
            }
            console.log(`Step ${step.id}: completed=${step.completed}, accessible=${step.accessible}`);
        });
        // 获取文档信息用于显示
        const documents = await (0, database_1.getPrisma)().document.findMany({
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
            const stepDoc = STEP_DOCUMENT_REQUIREMENTS[step.id];
            if (stepDoc) {
                step.documentRequirement = stepDoc;
                step.documents = documents.filter((doc) => doc.stepId === step.id);
            }
        });
        console.log('=== End Broker getSellerProgress Debug ===');
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
    }
    catch (error) {
        console.error('Error fetching seller progress:', error);
        next(error);
    }
};
// Get buyer progress for a specific listing
const getBuyerProgress = async (req, res, next) => {
    const typedReq = req;
    try {
        const brokerId = typedReq.user?.id;
        const { buyerId, listingId } = req.params;
        if (!brokerId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        // Batch fetch all required data to avoid N+1 queries
        const [buyer, listing, buyerProgress, documents, messages] = await Promise.all([
            // Get buyer info
            (0, database_1.getPrisma)().user.findFirst({
                where: {
                    id: buyerId,
                    role: 'BUYER'
                }
            }),
            // Get listing info
            (0, database_1.getPrisma)().listing.findFirst({
                where: { id: listingId },
                include: {
                    seller: {
                        include: {
                            managedBy: true
                        }
                    }
                }
            }),
            // Get buyer progress
            (0, database_1.getPrisma)().buyerProgress.findFirst({
                where: { buyerId }
            }),
            // Get all documents for this buyer and listing
            (0, database_1.getPrisma)().document.findMany({
                where: {
                    buyerId,
                    listingId: listingId
                }
            }),
            // Get messages for this buyer
            (0, database_1.getPrisma)().message.findFirst({
                where: { senderId: buyerId }
            })
        ]);
        if (!buyer) {
            res.status(404).json({ message: 'Buyer not found' });
            return;
        }
        if (!listing) {
            res.status(404).json({ message: 'Listing not found' });
            return;
        }
        // Create buyer progress if none exists
        let finalBuyerProgress = buyerProgress;
        if (!finalBuyerProgress) {
            finalBuyerProgress = await (0, database_1.getPrisma)().buyerProgress.create({
                data: {
                    buyerId,
                    currentStep: 0,
                    completedSteps: [],
                    selectedListingId: null
                }
            });
        }
        const actualSelectedListingId = finalBuyerProgress.selectedListingId;
        const isViewingSelectedListing = actualSelectedListingId === listingId;
        const checkListingId = listingId; // Always use the URL listingId for checking progress
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
        // Optimized step completion check using batched data
        const checkBuyerStepCompletionOptimized = (stepId) => {
            // For steps 8, 9, 10, check the buyer's completedSteps from database
            if (stepId === 8 || stepId === 9 || stepId === 10) {
                const completedStepsFromDB = finalBuyerProgress.completedSteps || [];
                return completedStepsFromDB.includes(stepId);
            }
            switch (stepId) {
                case 0: // Select listing
                    return !!checkListingId;
                case 1: // Email agent - check if buyer has selected this listing and sent messages
                    if (!checkListingId)
                        return false;
                    // Check if buyer has selected this specific listing
                    const hasSelectedThisListing = actualSelectedListingId === checkListingId;
                    const hasSentMessages = !!messages;
                    return hasSelectedThisListing && hasSentMessages;
                case 2: // Fill out NDA
                    return documents.some((doc) => doc.stepId === 2 &&
                        doc.type === 'NDA' &&
                        doc.category === 'BUYER_UPLOAD' &&
                        doc.operationType === 'UPLOAD' &&
                        doc.status === 'COMPLETED');
                case 3: // Fill out financial statement
                    return documents.some((doc) => doc.stepId === 3 &&
                        doc.category === 'BUYER_UPLOAD' &&
                        doc.status === 'COMPLETED');
                case 4: // Download CBR/CIM
                    return documents.some((doc) => doc.stepId === 4 &&
                        doc.type === 'CBR_CIM' &&
                        doc.operationType === 'DOWNLOAD' &&
                        doc.downloadedAt);
                case 5: // Upload documents
                    return documents.some((doc) => doc.stepId === 5 &&
                        doc.category === 'BUYER_UPLOAD' &&
                        doc.status === 'COMPLETED');
                case 6: // Download purchase contract
                    return documents.some((doc) => doc.stepId === 6 &&
                        doc.type === 'PURCHASE_CONTRACT' &&
                        doc.operationType === 'UPLOAD' &&
                        doc.category === 'BUYER_UPLOAD' &&
                        doc.status === 'COMPLETED');
                case 7: // Due diligence step - automatically completed when buyer reaches this step
                    // Check if all previous steps (0-6) are completed
                    for (let i = 0; i < 7; i++) {
                        if (!checkBuyerStepCompletionOptimized(i)) {
                            return false;
                        }
                    }
                    return true;
                default:
                    return false;
            }
        };
        // Check each step using optimized function
        let currentStep = 0;
        const completedSteps = [];
        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            const isCompleted = checkBuyerStepCompletionOptimized(step.id);
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
            }
            else {
                step.accessible = steps[index - 1].completed;
            }
            const stepDoc = BUYER_STEP_DOCUMENT_REQUIREMENTS[step.id];
            if (stepDoc) {
                step.documentRequirement = stepDoc;
                step.documents = documents.filter((doc) => doc.stepId === step.id);
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
    }
    catch (error) {
        console.error('Error fetching buyer progress:', error);
        next(error);
    }
};
router.get('/sellers', auth_1.authenticateBroker, getSellers);
router.get('/buyers', auth_1.authenticateBroker, getBuyers);
router.get('/dashboard', auth_1.authenticateBroker, getDashboardStats);
router.get('/agents', auth_1.authenticateBroker, getAgentsWithStats);
router.get('/agents-with-stats', auth_1.authenticateBroker, getAgentsWithStats);
router.delete('/agent/:agentId', auth_1.authenticateBroker, deleteAgent);
router.get('/agent/:agentId/stats', auth_1.authenticateBroker, getAgentStats);
router.get('/listings/:listingId/progress', auth_1.authenticateBroker, getSellerProgress);
router.get('/buyers/:buyerId/listings/:listingId/progress', auth_1.authenticateBroker, getBuyerProgress);
// Get buyer documents for a specific listing from broker perspective
router.get('/buyers/:buyerId/listings/:listingId/documents', auth_1.authenticateBroker, async (req, res) => {
    try {
        const { buyerId, listingId } = req.params;
        const typedReq = req;
        const brokerId = typedReq.user?.id;
        if (!brokerId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        // Verify access to the listing through agent management
        const listing = await (0, database_1.getPrisma)().listing.findFirst({
            where: { id: listingId },
            include: {
                seller: {
                    include: {
                        managedBy: true // This should be the agent
                    }
                }
            }
        });
        if (!listing) {
            res.status(404).json({ message: 'Listing not found' });
            return;
        }
        // 简化权限验证：broker可以访问任何listing的buyer documents（用于管理目的）
        // 移除复杂的管理关系链验证
        // Verify buyer exists
        const buyer = await (0, database_1.getPrisma)().user.findFirst({
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
        const documents = await (0, database_1.getPrisma)().document.findMany({
            where: {
                buyerId,
                category: 'BUYER_UPLOAD',
                listingId: listingId
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
            message: 'Failed to fetch buyer documents',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Pre-Close Checklist APIs for Broker
// 获取listing的pre-close checklist (Broker可以访问任何listing的checklist)
router.get('/listings/:listingId/pre-close-checklist', auth_1.authenticateBroker, async (req, res) => {
    try {
        const { listingId } = req.params;
        const typedReq = req;
        if (!typedReq.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        // 验证listing存在
        const listing = await (0, database_1.getPrisma)().listing.findFirst({
            where: { id: listingId }
        });
        if (!listing) {
            res.status(404).json({ message: 'Listing not found' });
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
// 更新checklist item (Broker可以更新任何item)
router.put('/listings/:listingId/pre-close-checklist/item', auth_1.authenticateBroker, async (req, res) => {
    try {
        const { listingId } = req.params;
        const { categoryId, itemId, userRole } = req.body;
        const typedReq = req;
        if (!typedReq.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        // 验证listing存在
        const listing = await (0, database_1.getPrisma)().listing.findFirst({
            where: { id: listingId }
        });
        if (!listing) {
            res.status(404).json({ message: 'Listing not found' });
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
// Helper functions (copied from seller.ts)
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
// 获取特定buyer和listing的尽职调查文档请求和上传文件
router.get('/buyers/:buyerId/listings/:listingId/due-diligence', auth_1.authenticateBroker, async (req, res) => {
    try {
        const { buyerId, listingId } = req.params;
        const typedReq = req;
        const brokerId = typedReq.user?.id;
        if (!brokerId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        // 简化权限验证：broker可以访问任何listing的尽职调查数据（用于管理目的）
        const listing = await (0, database_1.getPrisma)().listing.findFirst({
            where: {
                id: listingId
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
            res.status(404).json({ message: 'Listing not found' });
            return;
        }
        // 验证buyer存在
        const buyer = await (0, database_1.getPrisma)().user.findFirst({
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
        const requests = await (0, database_1.getPrisma)().dueDiligenceRequest.findMany({
            where: {
                listingId,
                buyerId
            }
        });
        // 获取已上传的尽职调查文档
        const documents = await (0, database_1.getPrisma)().document.findMany({
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
            documents: documents.map((doc) => ({
                id: doc.id,
                documentName: doc.fileName?.split(' - ')[0] || doc.fileName?.replace(/\.[^/.]+$/, "") || doc.type,
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
        console.error('Error fetching broker due diligence data:', error);
        res.status(500).json({
            message: 'Failed to fetch due diligence data',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// 归档/停用seller
const archiveSeller = async (req, res, next) => {
    const typedReq = req;
    try {
        if (!typedReq.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const { sellerId } = req.params;
        if (!sellerId) {
            res.status(400).json({ error: 'Seller ID is required' });
            return;
        }
        // 先检查seller是否存在
        const existingSeller = await (0, database_1.getPrisma)().user.findUnique({
            where: { id: sellerId, role: 'SELLER' }
        });
        if (!existingSeller) {
            res.status(404).json({ error: 'Seller not found' });
            return;
        }
        if (!existingSeller.isActive) {
            res.status(400).json({ error: 'Seller is already archived' });
            return;
        }
        const updatedSeller = await (0, database_1.getPrisma)().user.update({
            where: { id: sellerId },
            data: { isActive: false },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isActive: true,
                updatedAt: true
            }
        });
        res.json({
            message: 'Seller archived successfully',
            seller: updatedSeller
        });
    }
    catch (error) {
        console.error('Error in archiveSeller:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
// 重新激活seller
const reactivateSeller = async (req, res, next) => {
    const typedReq = req;
    try {
        if (!typedReq.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const { sellerId } = req.params;
        if (!sellerId) {
            res.status(400).json({ error: 'Seller ID is required' });
            return;
        }
        // 先检查seller是否存在
        const existingSeller = await (0, database_1.getPrisma)().user.findUnique({
            where: { id: sellerId, role: 'SELLER' }
        });
        if (!existingSeller) {
            res.status(404).json({ error: 'Seller not found' });
            return;
        }
        if (existingSeller.isActive) {
            res.status(400).json({ error: 'Seller is already active' });
            return;
        }
        const updatedSeller = await (0, database_1.getPrisma)().user.update({
            where: { id: sellerId },
            data: { isActive: true },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isActive: true,
                updatedAt: true
            }
        });
        res.json({
            message: 'Seller reactivated successfully',
            seller: updatedSeller
        });
    }
    catch (error) {
        console.error('Error in reactivateSeller:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
// 归档/停用buyer
const archiveBuyer = async (req, res, next) => {
    const typedReq = req;
    try {
        if (!typedReq.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const { buyerId } = req.params;
        if (!buyerId) {
            res.status(400).json({ error: 'Buyer ID is required' });
            return;
        }
        // 先检查buyer是否存在
        const existingBuyer = await (0, database_1.getPrisma)().user.findUnique({
            where: { id: buyerId, role: 'BUYER' }
        });
        if (!existingBuyer) {
            res.status(404).json({ error: 'Buyer not found' });
            return;
        }
        if (!existingBuyer.isActive) {
            res.status(400).json({ error: 'Buyer is already archived' });
            return;
        }
        const updatedBuyer = await (0, database_1.getPrisma)().user.update({
            where: { id: buyerId },
            data: { isActive: false },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isActive: true,
                updatedAt: true
            }
        });
        res.json({
            message: 'Buyer archived successfully',
            buyer: updatedBuyer
        });
    }
    catch (error) {
        console.error('Error in archiveBuyer:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
// 重新激活buyer
const reactivateBuyer = async (req, res, next) => {
    const typedReq = req;
    try {
        if (!typedReq.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const { buyerId } = req.params;
        if (!buyerId) {
            res.status(400).json({ error: 'Buyer ID is required' });
            return;
        }
        // 先检查buyer是否存在
        const existingBuyer = await (0, database_1.getPrisma)().user.findUnique({
            where: { id: buyerId, role: 'BUYER' }
        });
        if (!existingBuyer) {
            res.status(404).json({ error: 'Buyer not found' });
            return;
        }
        if (existingBuyer.isActive) {
            res.status(400).json({ error: 'Buyer is already active' });
            return;
        }
        const updatedBuyer = await (0, database_1.getPrisma)().user.update({
            where: { id: buyerId },
            data: { isActive: true },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isActive: true,
                updatedAt: true
            }
        });
        res.json({
            message: 'Buyer reactivated successfully',
            buyer: updatedBuyer
        });
    }
    catch (error) {
        console.error('Error in reactivateBuyer:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
router.delete('/sellers/:sellerId', auth_1.authenticateBroker, deleteSeller);
router.delete('/buyers/:buyerId', auth_1.authenticateBroker, deleteBuyer);
router.patch('/sellers/:sellerId/archive', auth_1.authenticateBroker, archiveSeller);
router.patch('/sellers/:sellerId/reactivate', auth_1.authenticateBroker, reactivateSeller);
router.patch('/buyers/:buyerId/archive', auth_1.authenticateBroker, archiveBuyer);
router.patch('/buyers/:buyerId/reactivate', auth_1.authenticateBroker, reactivateBuyer);
exports.default = router;
