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
const loginHandler = async (req, res) => {
    console.log('Login request received - Body:', req.body);
    console.log('Session before login:', req.session);
    const { email, password } = req.body;
    if (!email || !password) {
        console.error('Missing email or password in request');
        res.status(400).json({ message: 'Email and password are required' });
        return;
    }
    try {
        console.log('Attempting to find user with email:', email);
        const user = await database_1.prisma.user.findUnique({
            where: {
                email: email.toLowerCase()
            },
            select: {
                id: true,
                email: true,
                password: true,
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
        console.log('User search result:', user ? {
            ...user,
            password: '******',
            managing: user.managing.length
        } : 'Not found');
        if (!user) {
            console.log('No user found with email:', email);
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }
        if (user.password !== password) {
            console.log('Password mismatch');
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }
        console.log('Login successful for:', email, 'with role:', user.role);
        // 设置 session
        req.session.user = {
            id: user.id,
            role: user.role
        };
        // 确保 session 被保存
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                res.status(500).json({ message: 'Failed to save session' });
                return;
            }
            console.log('Session after login:', req.session);
            res.json({
                message: 'Login successful',
                role: user.role,
                redirect: `/dashboard/${user.role.toLowerCase()}`,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    managing: user.managing
                }
            });
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
        const users = await database_1.prisma.user.findMany({
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
        console.log('All users:', users);
        res.json({ users });
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
router.get('/test-users', testUsersHandler);
exports.default = router;
