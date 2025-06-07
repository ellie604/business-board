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
const prisma = (0, database_1.getPrisma)();
// Configure multer for memory storage
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
// Get inbox messages
const getInbox = async (req, res, next) => {
    const typedReq = req;
    const db = (0, database_1.getPrisma)();
    console.log('=== Get Inbox Debug Info ===');
    console.log('Session:', typedReq.session);
    console.log('User:', typedReq.user);
    console.log('Headers:', req.headers);
    try {
        if (!typedReq.user) {
            console.log('No user found in request');
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        console.log('Fetching inbox messages for user:', typedReq.user.id);
        const messages = await db.message.findMany({
            where: {
                receiverId: typedReq.user.id,
                isArchived: false,
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        role: true,
                    },
                },
                attachments: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        console.log('Found messages:', messages.length);
        res.json(messages);
        return;
    }
    catch (error) {
        console.error('Error in getInbox:', error);
        next(error);
        return;
    }
};
// Get sent messages
const getSentMessages = async (req, res, next) => {
    const typedReq = req;
    const db = (0, database_1.getPrisma)();
    try {
        if (!typedReq.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const messages = await db.message.findMany({
            where: {
                senderId: typedReq.user.id,
                isArchived: false,
            },
            include: {
                receiver: {
                    select: {
                        id: true,
                        name: true,
                        role: true,
                    },
                },
                attachments: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.json(messages);
        return;
    }
    catch (error) {
        next(error);
        return;
    }
};
// Send a new message
const sendMessage = async (req, res, next) => {
    const typedReq = req;
    console.log('Received message request:', req.body);
    console.log('Files:', req.files);
    const { receiverId, subject, content } = req.body;
    const db = (0, database_1.getPrisma)();
    try {
        if (!typedReq.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const receiver = await db.user.findUnique({
            where: { id: receiverId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        });
        if (!receiver) {
            res.status(404).json({ error: 'Receiver not found' });
            return;
        }
        // Create message without attachments first
        const message = await db.message.create({
            data: {
                subject,
                content,
                senderId: typedReq.user.id,
                senderType: typedReq.user.role,
                senderName: typedReq.user.name || typedReq.user.email,
                receiverId,
                receiverType: receiver.role,
                receiverName: receiver.name || receiver.email,
            },
        });
        // Handle attachments if any
        const files = req.files;
        if (files && Array.isArray(files)) {
            const bucketName = (0, supabase_1.getStorageBucket)();
            console.log('Using storage bucket:', bucketName);
            console.log('Files to upload:', files.length);
            const attachmentPromises = files.map(async (file) => {
                try {
                    // Upload file to Supabase Storage
                    const fileName = `${Date.now()}-${file.originalname}`;
                    console.log('Uploading file:', fileName);
                    const { data, error } = await supabase_1.supabase.storage
                        .from(bucketName)
                        .upload(fileName, file.buffer, {
                        contentType: file.mimetype,
                        cacheControl: '3600',
                        upsert: false
                    });
                    if (error) {
                        console.error('Error uploading file to Supabase:', error);
                        throw error;
                    }
                    console.log('Upload successful:', data);
                    // Get the public URL
                    const { data: { publicUrl } } = supabase_1.supabase.storage
                        .from(bucketName)
                        .getPublicUrl(fileName);
                    console.log('Public URL:', publicUrl);
                    // Create attachment record in database
                    return db.messageAttachment.create({
                        data: {
                            messageId: message.id,
                            fileName: file.originalname,
                            fileSize: file.size,
                            fileType: file.mimetype,
                            fileUrl: publicUrl,
                        },
                    });
                }
                catch (error) {
                    console.error('Error processing attachment:', error);
                    throw error;
                }
            });
            try {
                await Promise.all(attachmentPromises);
                console.log('All attachments processed successfully');
            }
            catch (error) {
                console.error('Error processing attachments:', error);
                throw error;
            }
        }
        // Update receiver's unread count
        await db.user.update({
            where: { id: receiverId },
            data: {
                unreadCount: {
                    increment: 1,
                },
            },
        });
        // Return the complete message with attachments
        const completeMessage = await db.message.findUnique({
            where: { id: message.id },
            include: {
                attachments: true,
            },
        });
        res.json(completeMessage);
        return;
    }
    catch (error) {
        console.error('Error sending message:', error);
        next(error);
        return;
    }
};
// Mark message as read
const markMessageAsRead = async (req, res, next) => {
    const typedReq = req;
    const { id } = req.params;
    const db = (0, database_1.getPrisma)();
    try {
        if (!typedReq.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const message = await db.message.update({
            where: {
                id,
                receiverId: typedReq.user.id,
            },
            data: {
                isRead: true,
                readAt: new Date(),
                status: 'READ',
            },
        });
        // Update user's unread count
        await db.user.update({
            where: { id: typedReq.user.id },
            data: {
                unreadCount: {
                    decrement: 1,
                },
                lastReadAt: new Date(),
            },
        });
        res.json(message);
        return;
    }
    catch (error) {
        next(error);
        return;
    }
};
// Get available contacts
const getContacts = async (req, res, next) => {
    const typedReq = req;
    const db = (0, database_1.getPrisma)();
    try {
        if (!typedReq.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const userType = typedReq.user.role;
        let whereCondition = {};
        // Define which user types can be contacted based on the current user's type
        if (userType === 'BROKER' || userType === 'AGENT') {
            whereCondition = {
                role: {
                    in: ['SELLER', 'BUYER'],
                },
            };
        }
        else if (userType === 'SELLER' || userType === 'BUYER') {
            whereCondition = {
                role: {
                    in: ['BROKER', 'AGENT'],
                },
            };
        }
        const contacts = await db.user.findMany({
            where: whereCondition,
            select: {
                id: true,
                name: true,
                role: true,
            },
        });
        res.json(contacts);
        return;
    }
    catch (error) {
        next(error);
        return;
    }
};
router.get('/inbox', auth_1.authenticateUser, getInbox);
router.get('/sent', auth_1.authenticateUser, getSentMessages);
router.post('/send', auth_1.authenticateUser, upload.array('attachments'), sendMessage);
router.put('/:id/read', auth_1.authenticateUser, markMessageAsRead);
router.get('/contacts', auth_1.authenticateUser, getContacts);
exports.default = router;
