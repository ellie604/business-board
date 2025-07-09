import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { getPrisma } from '../../database';

const router = Router();
const prisma = getPrisma();

interface CallbackRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

interface BrokerUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Handle callback request from non-users
const submitCallbackRequest: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, email, message }: CallbackRequestBody = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      res.status(400).json({ error: 'First name, last name, and email are required' });
      return;
    }

    console.log('Received callback request:', { firstName, lastName, email, message: message?.substring(0, 50) + '...' });

    // Find all brokers to send the message to
    const brokers = await prisma.user.findMany({
      where: {
        role: 'BROKER',
        isActive: true
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    if (brokers.length === 0) {
      console.error('No active brokers found in the system');
      res.status(500).json({ error: 'No brokers available to handle your request' });
      return;
    }

    console.log(`Found ${brokers.length} active brokers`);

    // Find or create a system user to represent website visitors
    let systemUser = await prisma.user.findFirst({
      where: {
        email: 'system@website-callback.com'
      }
    });

    if (!systemUser) {
      console.log('Creating system user for callback requests');
      systemUser = await prisma.user.create({
        data: {
          email: 'system@website-callback.com',
          password: 'system-generated',
          name: 'Website Callback System',
          role: 'BUYER', // Use BUYER role as a placeholder
          isActive: false // Mark as inactive since it's not a real user
        }
      });
    }

    // Create subject and content for the message
    const subject = `Callback Request from ${firstName} ${lastName}`;
    const content = `
New callback request received from the website:

Name: ${firstName} ${lastName}
Email: ${email}
${message ? `Message: ${message}` : ''}

Please follow up with this potential client.

Contact Information:
- Name: ${firstName} ${lastName}
- Email: ${email}
    `.trim();

    // Send message to all brokers
    const messagePromises = brokers.map((broker: BrokerUser) => 
      prisma.message.create({
        data: {
          subject,
          content,
          senderId: systemUser!.id,
          senderType: 'BUYER', // System user role
          senderName: `${firstName} ${lastName} (Website Visitor)`,
          receiverId: broker.id,
          receiverType: broker.role,
          receiverName: broker.name || broker.email,
        }
      })
    );

    await Promise.all(messagePromises);

    // Update unread count for all brokers
    const updatePromises = brokers.map((broker: BrokerUser) =>
      prisma.user.update({
        where: { id: broker.id },
        data: {
          unreadCount: {
            increment: 1
          }
        }
      })
    );

    await Promise.all(updatePromises);

    console.log(`Successfully sent callback request to ${brokers.length} brokers`);

    res.json({ 
      success: true, 
      message: 'Your callback request has been sent. We will contact you soon!'
    });

  } catch (error) {
    console.error('Error processing callback request:', error);
    res.status(500).json({ error: 'Failed to submit callback request. Please try again.' });
  }
};

router.post('/', submitCallbackRequest);

export default router; 