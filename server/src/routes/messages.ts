import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { getPrisma } from '../../database';
import { authenticateUser } from '../middleware/auth';
import { AuthenticatedRequest } from '../types/custom';
import multer from 'multer';
import path from 'path';
import { supabase, getStorageBucket } from '../config/supabase';
import { emailService } from '../services/emailService';

const router = Router();
const prisma = getPrisma();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Get inbox messages
const getInbox: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const typedReq = req as AuthenticatedRequest;
  const db = getPrisma();
  
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
  } catch (error) {
    console.error('Error in getInbox:', error);
    next(error);
    return;
  }
};

// Get sent messages
const getSentMessages: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const typedReq = req as AuthenticatedRequest;
  const db = getPrisma();
  
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
  } catch (error) {
    next(error);
    return;
  }
};

// Send a new message
const sendMessage: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const typedReq = req as AuthenticatedRequest;
  console.log('=== Send Message Debug ===');
  console.log('Received message request:', req.body);
  console.log('Files:', (req as any).files);
  console.log('User:', typedReq.user ? {
    id: typedReq.user.id.substring(0, 8) + '...',
    role: typedReq.user.role
  } : 'No user');
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Vercel Environment:', process.env.VERCEL_ENV);
  console.log('Supabase URL:', process.env.SUPABASE_URL ? 'Set' : 'Not set');
  console.log('Supabase Key:', process.env.SUPABASE_KEY ? 'Set' : 'Not set');
  
  const { receiverId, subject, content } = req.body;
  const db = getPrisma();

  try {
    if (!typedReq.user) {
      console.log('Authentication failed - no user');
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    console.log('Looking up receiver:', receiverId);
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
      console.log('Receiver not found:', receiverId);
      res.status(404).json({ error: 'Receiver not found' });
      return;
    }

    console.log('Creating message in database...');
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
    console.log('Message created with ID:', message.id);

    // 如果接收者是broker，发送邮件通知
    if (receiver.role === 'BROKER') {
      try {
        await emailService.sendBrokerNotification({
          subject: message.subject,
          content: message.content,
          senderName: message.senderName,
          senderEmail: typedReq.user.email,
          receiverName: message.receiverName,
          createdAt: message.createdAt
        });
      } catch (error) {
        console.error('Failed to send email notification:', error);
        // 继续执行，不中断消息创建流程
      }
    }

    // Handle attachments if any
    const files = (req as any).files;
    if (files && Array.isArray(files)) {
      const bucketName = getStorageBucket();
      console.log('Using storage bucket:', bucketName);
      console.log('Files to upload:', files.length);
      
      const attachmentPromises = files.map(async (file: Express.Multer.File) => {
        try {
          // Use consistent folder structure across all environments
          const fileName = `communications/attachments/${Date.now()}-${file.originalname}`;
          
          console.log('Uploading file to bucket:', bucketName, 'path:', fileName);
          
          const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(fileName, file.buffer, {
              contentType: file.mimetype,
              cacheControl: '3600',
              upsert: false
            });

          if (error) {
            console.error('Error uploading file to Supabase:', error);
            console.error('Bucket:', bucketName, 'File:', fileName);
            throw error;
          }

          console.log('Upload successful:', data);

          // Get the public URL
          const { data: { publicUrl } } = supabase.storage
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
        } catch (error) {
          console.error('Error processing attachment:', error);
          throw error;
        }
      });

      try {
        await Promise.all(attachmentPromises);
        console.log('All attachments processed successfully');
      } catch (error) {
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
  } catch (error) {
    console.error('Error sending message:', error);
    next(error);
    return;
  }
};

// Mark message as read
const markMessageAsRead: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const typedReq = req as AuthenticatedRequest;
  const { id } = req.params;
  const db = getPrisma();

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
        status: 'READ' as any,
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
  } catch (error) {
    next(error);
    return;
  }
};

// Get available contacts
const getContacts: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const typedReq = req as AuthenticatedRequest;
  const db = getPrisma();
  
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
    } else if (userType === 'SELLER' || userType === 'BUYER') {
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
  } catch (error) {
    next(error);
    return;
  }
};

router.get('/inbox', authenticateUser, getInbox);
router.get('/sent', authenticateUser, getSentMessages);
router.post('/send', authenticateUser, upload.array('attachments'), sendMessage);
router.put('/:id/read', authenticateUser, markMessageAsRead);
router.get('/contacts', authenticateUser, getContacts);

export default router; 