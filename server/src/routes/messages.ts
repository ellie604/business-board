import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { getPrisma } from '../../database';
import { authenticateUser } from '../middleware/auth';
import { AuthenticatedRequest } from '../types/custom';
import multer from 'multer';
import path from 'path';

const router = Router();
const prisma = getPrisma();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Get inbox messages
const getInbox: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const typedReq = req as AuthenticatedRequest;
  const db = getPrisma();
  
  try {
    if (!typedReq.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

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
    res.json(messages);
    return;
  } catch (error) {
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
  console.log('Received message request:', req.body);
  console.log('Files:', (req as any).files);
  const { receiverId, subject, content } = req.body;
  const db = getPrisma();

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
    const files = (req as any).files;
    if (files && Array.isArray(files)) {
      const attachmentPromises = files.map(async (file: Express.Multer.File) => {
        return db.messageAttachment.create({
          data: {
            messageId: message.id,
            fileName: file.originalname,
            fileSize: file.size,
            fileType: file.mimetype,
            fileUrl: file.path,
          },
        });
      });
      await Promise.all(attachmentPromises);
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