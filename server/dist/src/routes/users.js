"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../../database");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const prisma = (0, database_1.getPrisma)();
// Get all users
const getAllUsers = async (req, res, next) => {
    const typedReq = req;
    console.log('Getting all users - Session:', typedReq.session);
    console.log('User from request:', typedReq.user);
    try {
        if (!typedReq.user) {
            console.log('No user found in request');
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        console.log('Fetching users for authenticated user:', typedReq.user.id);
        const users = await prisma.user.findMany({
            where: {
                NOT: {
                    id: typedReq.user.id // Exclude current user
                }
            },
            select: {
                id: true,
                name: true,
                role: true,
                email: true
            },
            orderBy: {
                role: 'asc'
            }
        });
        console.log('Found users:', users);
        res.json(users);
        return;
    }
    catch (error) {
        console.error('Error in getAllUsers:', error);
        next(error);
        return;
    }
};
router.get('/', auth_1.authenticateUser, getAllUsers);
exports.default = router;
