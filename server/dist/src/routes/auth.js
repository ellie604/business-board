"use strict";
// import { PrismaClient } from '../../generated/prisma';
// import express, { Request, Response, Router, RequestHandler } from 'express';
Object.defineProperty(exports, "__esModule", { value: true });
// const prisma = new PrismaClient();
// const router: Router = express.Router();
// const loginHandler = (async (req: Request, res: Response) => {
//   const { email, password } = req.body;
//   const user = await prisma.user.findUnique({ where: { email } });
//   if (!user || user.password !== password) {
//     return res.status(401).json({ message: 'Invalid email or password' });
//   }
//   const redirect = `/dashboard/${user.role.toLowerCase()}`;
//   res.json({ message: 'Login successful', role: user.role, redirect });
// }) as RequestHandler; 
// router.post('/login', loginHandler);
// export default router;
// server/src/routes/auth.ts
const express_1 = require("express");
const database_1 = require("../../database");
const router = (0, express_1.Router)();
const prisma = (0, database_1.getPrisma)();
const loginHandler = async (req, res) => {
    const typedReq = req;
    const { email, password } = typedReq.body;
    if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
    }
    try {
        // 优化数据库查询 - 只获取必要字段
        const user = await prisma.user.findUnique({
            where: {
                email: email.toLowerCase()
            },
            select: {
                id: true,
                email: true,
                password: true,
                name: true,
                role: true,
                managerId: true // 添加managerId字段
            }
        });
        if (!user || user.password !== password) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }
        // 设置用户信息到 request 和 session
        const userInfo = {
            id: user.id,
            role: user.role,
            name: user.name,
            email: user.email,
            managerId: user.managerId // 添加managerId字段
        };
        typedReq.user = userInfo;
        typedReq.session.user = userInfo;
        // 简化 session 保存 - 不使用异步回调
        try {
            await new Promise((resolve, reject) => {
                typedReq.session.save((error) => {
                    if (error)
                        reject(error);
                    else
                        resolve();
                });
            });
        }
        catch (sessionError) {
            console.error('Session save error:', sessionError);
            // 即使 session 保存失败，也继续登录流程
        }
        // 立即返回响应，不等待 session 完全保存
        res.json({
            message: 'Login successful',
            role: user.role,
            redirect: `/dashboard/${user.role.toLowerCase()}`,
            user: {
                id: user.id.toString(),
                email: user.email,
                name: user.name,
                role: user.role,
                managerId: user.managerId, // 添加managerId字段
                managing: [] // 暂时返回空数组，减少查询时间
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Server error during login',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
// 测试路由 - 用于验证数据库连接
const testUsersHandler = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                managing: {
                    select: {
                        id: true,
                        email: true,
                        role: true
                    }
                }
            }
        });
        // 确保返回的用户 ID 都是字符串
        const usersWithStringIds = users.map((user) => ({
            ...user,
            id: user.id.toString()
        }));
        console.log('All users:', usersWithStringIds);
        res.json({ users: usersWithStringIds });
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            message: 'Failed to fetch users',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
router.post('/login', loginHandler);
router.post('/logout', async (req, res) => {
    const typedReq = req;
    try {
        // 清理会话
        if (typedReq.session) {
            await new Promise((resolve, reject) => {
                typedReq.session.destroy((error) => {
                    if (error) {
                        console.error('Session destroy error:', error);
                        reject(error);
                    }
                    else {
                        resolve();
                    }
                });
            });
        }
        // 清理 cookie
        res.clearCookie('business.board.sid', {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });
        console.log('User logged out successfully');
        res.json({ message: 'Logout successful' });
    }
    catch (error) {
        console.error('Logout error:', error);
        // 即使会话清理失败，也返回成功响应，因为客户端会清理本地状态
        res.json({ message: 'Logout completed' });
    }
});
router.get('/test-users', testUsersHandler);
exports.default = router;
