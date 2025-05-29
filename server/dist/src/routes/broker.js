"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../../database");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// 获取仪表板统计数据
const getDashboardStats = async (req, res, next) => {
    try {
        const brokerId = req.user?.id;
        if (!brokerId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const managedAgents = await database_1.prisma.user.findMany({
            where: {
                managerId: brokerId,
                role: 'AGENT',
            },
            select: {
                id: true,
            },
        });
        const agentIds = managedAgents.map((agent) => agent.id);
        const [activeListings, underContract, newListings, ndaCount, closedDeals] = await Promise.all([
            database_1.prisma.listing.count({
                where: {
                    sellerId: { in: agentIds },
                    status: 'ACTIVE',
                },
            }),
            database_1.prisma.listing.count({
                where: {
                    sellerId: { in: agentIds },
                    status: 'UNDER_CONTRACT',
                },
            }),
            database_1.prisma.listing.count({
                where: {
                    sellerId: { in: agentIds },
                    createdAt: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    },
                },
            }),
            database_1.prisma.document.count({
                where: {
                    type: 'NDA',
                },
            }),
            database_1.prisma.listing.count({
                where: {
                    sellerId: { in: agentIds },
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
// 获取经纪人管理的代理列表
const getAgents = async (req, res, next) => {
    try {
        const brokerId = req.user?.id;
        if (!brokerId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const agents = await database_1.prisma.user.findMany({
            where: {
                managerId: brokerId,
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
// 无需类型断言了
router.get('/dashboard', auth_1.authenticateBroker, getDashboardStats);
router.get('/agents', auth_1.authenticateBroker, getAgents);
exports.default = router;
