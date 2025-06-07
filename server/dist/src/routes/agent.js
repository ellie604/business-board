"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../../database");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const prisma = (0, database_1.getPrisma)();
// 获取仪表板统计数据
const getDashboardStats = async (req, res, next) => {
    const typedReq = req;
    try {
        const agentId = typedReq.user?.id;
        if (!agentId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const managedClients = await prisma.user.findMany({
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
        if (!managedClients.length) {
            // 如果没有管理的客户，返回空统计
            res.json({
                stats: {
                    totalActiveListings: 0,
                    totalUnderContract: 0,
                    newListingsThisMonth: 0,
                    totalNDA: 0,
                    totalClosedDeals: 0,
                },
                message: 'No clients found for this agent',
            });
            return;
        }
        const clientIds = managedClients.map((client) => client.id);
        const [activeListings, underContract, newListings, ndaCount, closedDeals] = await Promise.all([
            prisma.listing.count({
                where: {
                    sellerId: { in: clientIds },
                    status: 'ACTIVE',
                },
            }),
            prisma.listing.count({
                where: {
                    sellerId: { in: clientIds },
                    status: 'UNDER_CONTRACT',
                },
            }),
            prisma.listing.count({
                where: {
                    sellerId: { in: clientIds },
                    createdAt: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    },
                },
            }),
            prisma.document.count({
                where: {
                    type: 'NDA',
                },
            }),
            prisma.listing.count({
                where: {
                    sellerId: { in: clientIds },
                    status: 'CLOSED',
                    createdAt: {
                        gte: new Date(new Date().getFullYear(), 0, 1),
                    },
                },
            }),
        ]);
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
        next(error);
    }
};
// 获取代理管理的客户列表
const getClients = async (req, res, next) => {
    const typedReq = req;
    try {
        const agentId = typedReq.user?.id;
        if (!agentId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const clients = await prisma.user.findMany({
            where: {
                managerId: agentId,
                role: {
                    in: ['SELLER', 'BUYER']
                }
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });
        res.json({
            clients,
            message: 'Clients retrieved successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
router.get('/dashboard', auth_1.authenticateAgent, getDashboardStats);
router.get('/clients', auth_1.authenticateAgent, getClients);
exports.default = router;
