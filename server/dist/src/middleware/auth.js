"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateBroker = void 0;
const database_1 = require("../../database");
const prisma = (0, database_1.getPrisma)();
const authenticateBroker = async (req, res, next) => {
    try {
        const typedReq = req;
        // 从 session 中获取用户信息
        const user = typedReq.session?.user;
        if (!user?.id) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        // 验证用户是否为经纪人
        const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { id: true, role: true }
        });
        if (!dbUser || dbUser.role !== 'BROKER') {
            res.status(403).json({ message: 'Access denied' });
            return;
        }
        typedReq.user = dbUser;
        next();
    }
    catch (error) {
        console.error('Authentication error:', error);
        next(error);
    }
};
exports.authenticateBroker = authenticateBroker;
