// import { PrismaClient } from '../../generated/prisma';
// import express, { Request, Response, Router, RequestHandler } from 'express';

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
import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { getPrisma } from '../../database';
import { AuthenticatedRequest } from '../types/custom';
import { supabase, getStorageBucket } from '../config/supabase';
import { emailService } from '../services/emailService';

const router = Router();
const prisma = getPrisma();

interface UserFromDB {
  id: number;
  email: string;
  name: string | null;
  role: string;
  managing?: {
    id: number;
    email: string;
    role: string;
  }[];
}

interface BrokerUser {
  id: number;
  name: string | null;
  email: string;
  role: string;
}

const loginHandler = async (req: Request, res: Response): Promise<void> => {
  const typedReq = req as AuthenticatedRequest;
  
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
        managerId: true  // 添加managerId字段
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
      managerId: user.managerId  // 添加managerId字段
    };
    
    typedReq.user = userInfo;
    typedReq.session.user = userInfo;

    console.log('🔐 Login successful, saving user to session:', {
      userId: user.id,
      role: user.role,
      email: user.email,
      sessionId: typedReq.sessionID
    });

    // 强制保存session并等待完成
    try {
      await new Promise<void>((resolve, reject) => {
        typedReq.session.save((error: Error | null) => {
          if (error) {
            console.error('❌ Session save failed:', error);
            reject(error);
          } else {
            console.log('✅ Session saved successfully');
            resolve();
          }
        });
      });
    } catch (sessionError) {
      console.error('❌ Critical session error:', sessionError);
      // 如果session保存失败，返回错误
      res.status(500).json({ 
        message: 'Login failed due to session error',
        error: 'Session could not be saved'
      });
      return;
    }

    // 验证session是否真的保存了
    if (!typedReq.session.user || !typedReq.session.user.id) {
      console.error('❌ Session verification failed after save');
      res.status(500).json({ 
        message: 'Login failed due to session verification error',
        error: 'Session was not properly saved'
      });
      return;
    }

    console.log('✅ Session verification passed, user logged in successfully');
    console.log('🍪 Session details:', {
      sessionId: typedReq.sessionID,
      userId: typedReq.session.user.id,
      cookieSettings: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
        maxAge: '7 days'
      }
    });

    // 返回成功响应
    res.json({ 
      message: 'Login successful',
      role: user.role,
      redirect: `/dashboard/${user.role.toLowerCase()}`,
      user: {
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        managerId: user.managerId,  // 添加managerId字段
        managing: [] // 暂时返回空数组，减少查询时间
      },
      sessionToken: user.id.toString(), // 添加session token用于跨域认证
      sessionDebug: {
        sessionId: typedReq.sessionID,
        cookieWillBeSet: true,
        origin: typedReq.headers.origin
      }
    });
  } catch (error: unknown) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error during login', 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Session恢复端点 - 用于恢复已有用户的session
const restoreSessionHandler = async (req: Request, res: Response): Promise<void> => {
  const typedReq = req as AuthenticatedRequest;
  
  const { userId, email } = typedReq.body;
  
  if (!userId && !email) {
    res.status(400).json({ message: 'User ID or email is required' });
    return;
  }
  
  try {
    // 根据userId或email查找用户
    const whereCondition = userId ? { id: parseInt(userId) } : { email: email.toLowerCase() };
    
    const user = await prisma.user.findUnique({
      where: whereCondition,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        managerId: true,
        isActive: true
      }
    });

    if (!user || !user.isActive) {
      res.status(401).json({ message: 'User not found or inactive' });
      return;
    }
    
    // 设置用户信息到 request 和 session
    const userInfo = {
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
      managerId: user.managerId
    };
    
    typedReq.user = userInfo;
    typedReq.session.user = userInfo;

    console.log('🔄 Session restore for user:', {
      userId: user.id,
      role: user.role,
      email: user.email,
      sessionId: typedReq.sessionID
    });

    // 强制保存session
    try {
      await new Promise<void>((resolve, reject) => {
        typedReq.session.save((error: Error | null) => {
          if (error) {
            console.error('❌ Session restore save failed:', error);
            reject(error);
          } else {
            console.log('✅ Session restored successfully');
            resolve();
          }
        });
      });
    } catch (sessionError) {
      console.error('❌ Session restore error:', sessionError);
      res.status(500).json({ 
        message: 'Session restore failed',
        error: 'Session could not be saved'
      });
      return;
    }

    // 返回成功响应
    res.json({ 
      message: 'Session restored successfully',
      user: {
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        managerId: user.managerId
      }
    });
  } catch (error: unknown) {
    console.error('Session restore error:', error);
    res.status(500).json({ 
      message: 'Server error during session restore', 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

const registerHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role,
      workingWithRepresentative,
      interestedInSpecificBusiness,
      availableFunds,
      fundsSources,
      minimumMoneyNeeded,
      totalPriceWilling,
      lookingToBuyLocation,
      address,
      streetAddress,
      city,
      state,
      zipCode
    } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !password || !role) {
      res.status(400).json({ message: 'Name, email, phone, password, and role are required' });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ message: 'Please enter a valid email address' });
      return;
    }

    // Validate role
    if (!['BUYER', 'SELLER'].includes(role.toUpperCase())) {
      res.status(400).json({ message: 'Role must be either BUYER or SELLER' });
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      res.status(409).json({ message: 'An account with this email already exists' });
      return;
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase(),
        password, // In production, you should hash the password
        role: role.toUpperCase(),
        isActive: true
      }
    });

    // Find all active brokers to send the registration message to
    const brokers: BrokerUser[] = await prisma.user.findMany({
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

    if (brokers.length > 0) {
      // Create registration message content
      const subject = `New User Registration - ${name}`;
      
      // Format the optional information
      let optionalInfo = '';
      if (workingWithRepresentative) {
        optionalInfo += `\nWorking with Representative: ${workingWithRepresentative}`;
      }
      if (interestedInSpecificBusiness) {
        optionalInfo += `\nInterested in Specific Business: ${interestedInSpecificBusiness}`;
      }
      if (availableFunds) {
        optionalInfo += `\nAvailable Funds: ${availableFunds}`;
      }
      if (fundsSources) {
        optionalInfo += `\nFunds Sources: ${fundsSources}`;
      }
      if (minimumMoneyNeeded) {
        optionalInfo += `\nMinimum Money Needed: ${minimumMoneyNeeded}`;
      }
      if (totalPriceWilling) {
        optionalInfo += `\nTotal Price Willing to Pay: ${totalPriceWilling}`;
      }
      if (lookingToBuyLocation) {
        optionalInfo += `\nLooking to Buy Location: ${lookingToBuyLocation}`;
      }
      
      // Format address information
      let addressInfo = '';
      if (address || streetAddress || city || state || zipCode) {
        addressInfo += '\n\nAddress Information:';
        if (address) addressInfo += `\nAddress: ${address}`;
        if (streetAddress) addressInfo += `\nStreet Address: ${streetAddress}`;
        if (city) addressInfo += `\nCity: ${city}`;
        if (state) addressInfo += `\nState: ${state}`;
        if (zipCode) addressInfo += `\nZIP Code: ${zipCode}`;
      }

      const content = `
A new user has registered on the California Business Sales platform:

Registration Details:
- Name: ${name}
- Email: ${email}
- Phone: ${phone}
- Role: ${role}
- Registration Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}

Account Information:
- User ID: ${newUser.id}
- Account Status: Active
- Login Email: ${email}
${optionalInfo}${addressInfo}

Please review this new registration and follow up with the user as appropriate.

You can view more details about this user in the admin portal.
      `.trim();

      // Send message to all brokers
      const messagePromises = brokers.map((broker: BrokerUser) => 
        prisma.message.create({
          data: {
            subject,
            content,
            senderId: newUser.id,
            senderType: newUser.role,
            senderName: newUser.name,
            receiverId: broker.id,
            receiverType: broker.role,
            receiverName: broker.name || broker.email,
          }
        })
      );

      const createdMessages = await Promise.all(messagePromises);

      // 发送邮件通知到私人邮箱
      try {
        for (const message of createdMessages) {
          await emailService.sendBrokerNotification({
            subject: message.subject,
            content: message.content,
            senderName: message.senderName,
            senderEmail: email,
            receiverName: message.receiverName,
            createdAt: message.createdAt
          });
        }
      } catch (error) {
        console.error('Failed to send email notifications for registration:', error);
      }

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

      console.log(`Registration message sent to ${brokers.length} brokers for user: ${email}`);
    }

    // Return success response (don't include password)
    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Registration failed. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Add NDA PDF generation function for frontend NDA (without listing)
function generateFrontendNDAPDFAsync(nda: any, user: any, listing?: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const PDFDocument = require('pdfkit');
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      doc.on('error', (error: Error) => {
        reject(error);
      });

      // PDF Header
      doc.fontSize(20).font('Helvetica-Bold').text('NON-DISCLOSURE AGREEMENT', { align: 'center' });
      doc.moveDown();
      doc.fontSize(14).font('Helvetica').text('California Business Sales', { align: 'center' });
      doc.moveDown(2);

      // Introduction
      doc.fontSize(12).font('Helvetica').text(
        'Our agreement with the seller requires that we obtain a nondisclosure and confidentiality agreement and evidence of financial ability before disclosing the name and location of his business. This information will be kept confidential. In compliance with the above, please read and complete the following nondisclosure and confidentiality agreement.',
        { align: 'justify' }
      );
      doc.moveDown();

      doc.text(
        'In consideration of the broker, California Business Sales providing the information on businesses for sale, I/we, the undersigned, understand and agree:',
        { align: 'justify' }
      );
      doc.moveDown(2);

      // Personal Information
      addNDASection(doc, 'PERSONAL INFORMATION');
      addNDAField(doc, 'Name', `${nda.firstName} ${nda.lastName}`);
      if (nda.organization) addNDAField(doc, 'Organization', nda.organization);
      addNDAField(doc, 'Email', nda.email);
      addNDAField(doc, 'Phone', nda.phone);
      
      if (nda.addressLine1 || nda.city || nda.state || nda.zipCode) {
        const address = [
          nda.addressLine1,
          nda.addressLine2,
          [nda.city, nda.state, nda.zipCode].filter(Boolean).join(', ')
        ].filter(Boolean).join('\n');
        addNDAField(doc, 'Address', address);
      }
      
      doc.moveDown();

      // Business Interest
      addNDASection(doc, 'BUSINESS INTEREST');
      if (nda.listingInterest && listing) {
        addNDAField(doc, 'Listing Interest', `${listing.title} - $${listing.price.toLocaleString()}`);
      }
      if (nda.availableMoney) addNDAField(doc, 'Available Money', nda.availableMoney);
      if (nda.minimumIncome) addNDAField(doc, 'Minimum Income Required', nda.minimumIncome);
      if (nda.totalPriceWilling) addNDAField(doc, 'Total Price Willing to Pay', nda.totalPriceWilling);
      if (nda.californiaRegions && nda.californiaRegions.length > 0) {
        addNDAField(doc, 'California Regions of Interest', nda.californiaRegions.join(', '));
      }
      if (nda.timeFrameToPurchase) addNDAField(doc, 'Time Frame to Purchase', nda.timeFrameToPurchase);
      
      doc.moveDown();

      // Agreement Terms
      addNDASection(doc, 'AGREEMENT TERMS');
      const terms = [
        'That information provided on businesses by California Business Sales is sensitive and confidential and that its disclosure to others would be damaging to the businesses and to the broker\'s fiduciary relationship with the seller.',
        
        'That I will not disclose any information regarding these businesses to any other person who has not also signed and dated this agreement, except to secure their advice and counsel, in which case I agree to obtain their consent to maintain such confidentiality. "Information" shall include the fact that the business is for sale, plus other data. The term "information" does not include any information, which is, or becomes, generally available to the public or is already in your possession. All information provided to review the business will be returned to California Business Sales without retaining copies, summaries, analyses, or extracts thereof in the event the review is terminated.',
        
        'That I will not contact the seller, his/her employees, suppliers, or customers except through California Business Sales.',
        
        'That all information is provided by the seller and is not verified in any way by California Business Sales. California Business Sales is relying on the seller for the accuracy and completeness of said information, has no knowledge of the accuracy of said information, and makes no warranty, express or implied, as to such information.',
        
        'California Business Sales does not give tax, accounting, or legal advice. That, prior to finalizing an agreement to purchase a business, it is my responsibility to make an independent verification of all information. I agree that California Business Sales is not responsible for the accuracy of any information I receive, and I agree to indemnify and hold California Business Sales harmless from any claims or damages resulting from its use. I will look only to the seller and to my own investigation for all information regarding any business offered by California Business Sales.',
        
        'That, should I enter into an agreement to purchase a business which California Business Sales offers for sale, I grant to the seller the right to obtain, through standard reporting agencies, financial and credit information concerning myself or the companies or other parties I represent; and I understand that this information will be held confidential by the seller and California Business Sales and will be used only for the purpose of the seller extending credit to me.',
        
        'That all correspondence, inquiries, offers to purchase, and negotiations relating to the purchase or lease of any business presented to me, or companies I represent, by California Business Sales, will be conducted exclusively through California Business Sales.'
      ];

      terms.forEach((term, index) => {
        doc.fontSize(11).font('Helvetica').text(`${index + 1}. ${term}`, 50, doc.y, { align: 'justify' });
        doc.moveDown();
        
        // Add new page if needed
        if (doc.y > 700) {
          doc.addPage();
        }
      });

      doc.moveDown(2);

      // Signature Section
      addNDASection(doc, 'ACCEPTANCE & SIGNATURE');
      doc.fontSize(11).font('Helvetica').text('By signing below, I agree to the terms of this agreement:', 50, doc.y);
      doc.moveDown(2);
      
      // Signature line
      doc.fontSize(11).font('Helvetica').text('Signature:', 50, doc.y);
      doc.fontSize(14).font('Helvetica-Bold').text(nda.signature || '', 120, doc.y - 5);
      doc.moveTo(120, doc.y + 15).lineTo(400, doc.y + 15).stroke();
      doc.moveDown(2);
      
      // Date
      doc.fontSize(11).font('Helvetica').text('Date:', 50, doc.y);
      doc.text(new Date().toLocaleDateString(), 120, doc.y - 12);
      doc.moveTo(120, doc.y + 3).lineTo(250, doc.y + 3).stroke();

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

// Helper functions for PDF generation
function addNDASection(doc: any, title: string) {
  doc.fontSize(14).font('Helvetica-Bold').text(title, 50, doc.y);
  doc.moveDown();
}

function addNDAField(doc: any, label: string, value: string) {
  doc.fontSize(11).font('Helvetica-Bold').text(`${label}:`, 50, doc.y);
  doc.font('Helvetica').text(value, 50, doc.y + 15);
  doc.moveDown();
}

const ndaSubmitHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      organization,
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
      listingInterest,  // This is now required
      availableMoney,
      minimumIncome,
      totalPriceWilling,
      californiaRegions,
      timeFrameToPurchase,
      agreementAccepted,
      signature
    } = req.body;

    // Validate required fields (same as BuyerNonDisclosure.tsx)
    if (!firstName || !lastName || !email || !phone || !password || 
        !listingInterest || !signature || !agreementAccepted) {
      res.status(400).json({ message: 'Please fill in all required fields' });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ message: 'Please enter a valid email address' });
      return;
    }

    // Verify the selected listing exists and is active
    const listing = await prisma.listing.findFirst({
      where: { 
        id: listingInterest,
        status: 'ACTIVE'
      },
      select: { 
        id: true, 
        title: true, 
        description: true, 
        price: true, 
        sellerId: true 
      }
    });

    if (!listing) {
      res.status(400).json({ message: 'Selected listing not found or not active' });
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    let user;
    let isNewUser = false;

    if (existingUser) {
      // User exists - validate password
      if (existingUser.password !== password) {
        res.status(401).json({ message: 'Incorrect password for existing account' });
        return;
      }
      user = existingUser;
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          name: `${firstName} ${lastName}`.trim(),
          email: email.toLowerCase(),
          password, // In production, you should hash the password
          role: 'BUYER',
          isActive: true
        }
      });
      isNewUser = true;
    }

    // For new users or users without buyer progress, create/update buyer progress
    let buyerProgress = await prisma.buyerProgress.findFirst({
      where: { buyerId: user.id }
    });

    if (!buyerProgress) {
      // Create new buyer progress with selected listing and NDA step completed
      buyerProgress = await prisma.buyerProgress.create({
        data: {
          buyerId: user.id,
          selectedListingId: listingInterest,
          currentStep: 3, // Move to next step after NDA (step 3 is Financial Statement)
          completedSteps: [0, 2] // Mark steps 0 (Listing Selection) and 2 (NDA) as completed
        }
      });
    } else {
      // Update existing progress
      const completedStepsArray = buyerProgress.completedSteps as number[] || [];
      
      // Add steps 0 and 2 to completed steps if not already there
      if (!completedStepsArray.includes(0)) {
        completedStepsArray.push(0);
      }
      if (!completedStepsArray.includes(2)) {
        completedStepsArray.push(2);
      }

      // Update current step to at least 3 (Financial Statement) if it's lower
      const newCurrentStep = Math.max(buyerProgress.currentStep, 3);

      await prisma.buyerProgress.update({
        where: { id: buyerProgress.id },
        data: {
          selectedListingId: listingInterest, // Update selected listing
          currentStep: newCurrentStep,
          completedSteps: completedStepsArray
        }
      });
    }

    // Add buyer to listing's buyers list if not already there
    await prisma.listing.update({
      where: { id: listingInterest },
      data: {
        buyers: {
          connect: { id: user.id }
        }
      }
    });

    // Prepare NDA data (same as BuyerNonDisclosure.tsx)
    const ndaData = {
      firstName,
      lastName,
      organization: organization || '',
      email,
      phone,
      addressLine1: addressLine1 || '',
      addressLine2: addressLine2 || '',
      city: city || '',
      state: state || '',
      zipCode: zipCode || '',
      listingInterest, // Include the selected listing
      availableMoney: availableMoney || '',
      minimumIncome: minimumIncome || '',
      totalPriceWilling: totalPriceWilling || '',
      californiaRegions: californiaRegions || [],
      timeFrameToPurchase: timeFrameToPurchase || '',
      agreementAccepted,
      signature
    };

    // Save NDA data to buyerNDA table
    await prisma.buyerNDA.upsert({
      where: {
        buyerId: user.id
      },
      update: {
        data: ndaData,
        updatedAt: new Date(),
        submitted: true,
        submittedAt: new Date()
      },
      create: {
        buyerId: user.id,
        data: ndaData,
        submitted: true,
        submittedAt: new Date()
      }
    });

    // Generate PDF and upload to storage
    let documentId: number | null = null;
    let pdfUrl: string | null = null;
    let pdfFileSize: number = 0;
    let timestamp: number = 0;
    
    try {
      // Generate filename with timestamp
      timestamp = Date.now();
      const bucketName = getStorageBucket();

      // Generate PDF (same as BuyerNonDisclosure.tsx but using frontend data)
      const pdfBuffer = await generateFrontendNDAPDFAsync(ndaData, user, listing);
      pdfFileSize = pdfBuffer.length;
      
      // Upload PDF to Supabase Storage
      const supabaseFileName = `listings/${listingInterest}/buyer/nda_${user.id}_${timestamp}.pdf`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(supabaseFileName, pdfBuffer, {
          contentType: 'application/pdf',
          upsert: true
        });

      if (uploadError) {
        console.error('Supabase upload error:', uploadError);
        throw new Error('Failed to upload PDF to storage');
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(supabaseFileName);

      pdfUrl = publicUrl;

      // Create document record with PDF URL (associated with the selected listing)
      const document = await prisma.document.create({
        data: {
          type: 'NDA',
          category: 'BUYER_UPLOAD',
          operationType: 'UPLOAD',
          status: 'COMPLETED',
          stepId: 2, // NDA is step 2
          sellerId: listing.sellerId, // Use the listing's seller ID
          buyerId: user.id,
          listingId: listingInterest, // Associate with the selected listing
          uploadedBy: user.id,
          uploadedAt: new Date(),
          fileName: `nda_${timestamp}.pdf`,
          url: publicUrl,
          fileSize: pdfBuffer.length
        }
      });

      documentId = document.id;
      console.log(`NDA PDF generated and uploaded successfully for user: ${email}, listing: ${listingInterest}`);
    } catch (pdfError) {
      console.error('PDF generation or upload error:', pdfError);
      // Continue with the flow even if PDF generation fails
    }

    // Generate NDA content for message (include selected listing information)
    const ndaContent = `
NDA Submission Details:

Personal Information:
- Name: ${firstName} ${lastName}
- Email: ${email}
- Phone: ${phone}
- Organization: ${organization || 'N/A'}

Address:
- Address Line 1: ${addressLine1 || 'N/A'}
- Address Line 2: ${addressLine2 || 'N/A'}
- City: ${city || 'N/A'}
- State: ${state || 'N/A'}
- ZIP Code: ${zipCode || 'N/A'}

Business Interest:
- Selected Listing: ${listing.title} - $${listing.price.toLocaleString()}
- Available Money: ${availableMoney || 'N/A'}
- Minimum Income Required: ${minimumIncome || 'N/A'}
- Total Price Willing to Pay: ${totalPriceWilling || 'N/A'}
- California Regions: ${californiaRegions && californiaRegions.length > 0 ? californiaRegions.join(', ') : 'N/A'}
- Time Frame to Purchase: ${timeFrameToPurchase || 'N/A'}

Agreement:
- Agreement Accepted: ${agreementAccepted ? 'Yes' : 'No'}
- Electronic Signature: ${signature}
- Submission Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}

${isNewUser ? 'This is a new user registration via NDA submission.' : 'This is an existing user who submitted an NDA.'}

${pdfUrl ? `NDA PDF Document: ${pdfUrl}` : 'PDF generation failed - please check with technical support.'}
    `.trim();

    // Find all active brokers to send the NDA message to
    const brokers: BrokerUser[] = await prisma.user.findMany({
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

    if (brokers.length > 0) {
      const subject = `${isNewUser ? 'New User Registration' : 'Existing User'} - NDA Submission: ${firstName} ${lastName} (${listing.title})`;

      // Send message to all brokers with optional attachment
      const messagePromises = brokers.map(async (broker: BrokerUser) => {
        // Create the message first
        const message = await prisma.message.create({
          data: {
            subject,
            content: ndaContent,
            senderId: user.id,
            senderType: user.role,
            senderName: user.name,
            receiverId: broker.id,
            receiverType: broker.role,
            receiverName: broker.name || broker.email,
          }
        });

        // If PDF was generated successfully, create attachment
        if (documentId && pdfUrl) {
          await prisma.messageAttachment.create({
            data: {
              messageId: message.id,
              fileName: `nda_${timestamp}.pdf`,
              fileSize: pdfFileSize,
              fileType: 'application/pdf',
              fileUrl: pdfUrl,
            }
          });
        }

        return message;
      });

      const createdMessages = await Promise.all(messagePromises);

      // 发送邮件通知到私人邮箱
      try {
        for (const message of createdMessages) {
          await emailService.sendBrokerNotification({
            subject: message.subject,
            content: message.content,
            senderName: message.senderName,
            senderEmail: email,
            receiverName: message.receiverName,
            createdAt: message.createdAt
          });
        }
      } catch (error) {
        console.error('Failed to send email notifications for NDA:', error);
      }

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

      console.log(`NDA submission message sent to ${brokers.length} brokers for user: ${email}`);
    }

    // Return success response
    res.status(200).json({
      message: `NDA ${isNewUser ? 'and registration' : ''} successful`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isNewUser
      },
      document: documentId ? { id: documentId, url: pdfUrl } : null,
      listing: {
        id: listing.id,
        title: listing.title,
        price: listing.price
      }
    });

  } catch (error) {
    console.error('NDA submission error:', error);
    res.status(500).json({ 
      message: 'NDA submission failed. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get available listings (public endpoint for NDA form)
const getAvailableListingsHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const listings = await prisma.listing.findMany({
      where: {
        status: 'ACTIVE' // Only show active listings
      },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        status: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({ listings });
  } catch (error) {
    console.error('Error fetching available listings:', error);
    res.status(500).json({ 
      message: 'Failed to fetch listings',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Handle contact form submissions
const contactMessageHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !subject || !message) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ message: 'Please enter a valid email address' });
      return;
    }

    // Check if the sender is an existing user
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    // Get or create a special VISITOR user for non-registered users
    let senderUser = existingUser;
    let isVisitor = false;

    if (!existingUser) {
      // Try to find existing VISITOR user, or create one
      let visitorUser = await prisma.user.findFirst({
        where: {
          role: 'BUYER', // Use BUYER role since we don't have VISITOR role
          email: 'visitor@californiabusinesssales.com'
        }
      });

      if (!visitorUser) {
        // Create a special visitor user
        visitorUser = await prisma.user.create({
          data: {
            name: 'Website Visitor',
            email: 'visitor@californiabusinesssales.com',
            password: 'no-password-visitor-account',
            role: 'BUYER',
            isActive: false // Mark as inactive so it doesn't show up in normal user lists
          }
        });
      }

      senderUser = visitorUser;
      isVisitor = true;
    }

    // Get all active brokers to send the message to
    const brokers: BrokerUser[] = await prisma.user.findMany({
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
      res.status(404).json({ message: 'No active brokers found to receive your message' });
      return;
    }

    // Create message content
    const fullName = `${firstName} ${lastName}`;
    const messageContent = `Contact Form Submission from ${fullName}
    
Email: ${email}
Phone: ${phone}
Subject: ${subject}

Message:
${message}

${isVisitor ? 'This message is from a website visitor (not a registered user).' : `This message is from an existing ${existingUser!.role.toLowerCase()} user.`}`;

    // Create messages for all brokers
    const messagePromises = brokers.map(async (broker: BrokerUser) => {
      const newMessage = await prisma.message.create({
        data: {
          subject: `Contact Form: ${subject} - ${fullName}`,
          content: messageContent,
          senderId: senderUser.id, // Always use a valid user ID
          senderType: isVisitor ? 'BUYER' : existingUser!.role, // Use BUYER for visitors
          senderName: isVisitor ? fullName : existingUser!.name,
          receiverId: broker.id,
          receiverType: broker.role,
          receiverName: broker.name || broker.email,
        }
      });
      return newMessage;
    });

    const createdMessages = await Promise.all(messagePromises);

    // 发送邮件通知到私人邮箱
    try {
      for (const message of createdMessages) {
        await emailService.sendBrokerNotification({
          subject: message.subject,
          content: message.content,
          senderName: message.senderName,
          senderEmail: email,
          receiverName: message.receiverName,
          createdAt: message.createdAt
        });
      }
    } catch (error) {
      console.error('Failed to send email notifications for contact form:', error);
    }

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

    console.log(`Contact form message sent to ${brokers.length} brokers from: ${email} (${isVisitor ? 'visitor' : 'existing user'})`);

    res.status(200).json({
      message: 'Your message has been sent successfully. We will get back to you soon!',
      sentTo: brokers.length,
      userType: isVisitor ? 'visitor' : 'registered_user'
    });

  } catch (error) {
    console.error('Contact message error:', error);
    res.status(500).json({ 
      message: 'Failed to send message. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// 重置密码处理函数 - 简单版本，无需验证
const resetPasswordHandler = async (req: Request, res: Response): Promise<void> => {
  const { email, newPassword } = req.body;
  
  if (!email || !newPassword) {
    res.status(400).json({ message: 'Email and new password are required' });
    return;
  }
  
  // 验证密码长度
  if (newPassword.length < 6) {
    res.status(400).json({ message: 'Password must be at least 6 characters long' });
    return;
  }
  
  try {
    // 查找用户
    const user = await prisma.user.findUnique({
      where: { 
        email: email.toLowerCase()
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true
      }
    });

    if (!user) {
      res.status(404).json({ message: 'No account found with this email address' });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({ message: 'Account is inactive' });
      return;
    }

    // 更新密码
    await prisma.user.update({
      where: { 
        email: email.toLowerCase()
      },
      data: {
        password: newPassword
      }
    });

    console.log('🔑 Password reset successful for user:', {
      userId: user.id,
      email: user.email,
      role: user.role
    });

    res.json({ 
      message: 'Password reset successful. You can now login with your new password.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ 
      message: 'Failed to reset password. Please try again.',
      error: 'Internal server error'
    });
  }
};

// 测试路由 - 用于验证数据库连接
const testUsersHandler = async (req: Request, res: Response): Promise<void> => {
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
    const usersWithStringIds = users.map((user: UserFromDB) => ({
      ...user,
      id: user.id.toString()
    }));
    
    console.log('All users:', usersWithStringIds);
    res.json({ users: usersWithStringIds });
  } catch (error: unknown) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      message: 'Failed to fetch users',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

router.post('/login', loginHandler);
router.post('/register', registerHandler);
router.post('/nda-submit', ndaSubmitHandler);
router.get('/available-listings', getAvailableListingsHandler); // Add public listings endpoint
router.post('/contact-message', contactMessageHandler); // Add contact form endpoint
router.post('/reset-password', resetPasswordHandler); // Add password reset endpoint
router.post('/restore-session', restoreSessionHandler);
router.post('/logout', async (req: Request, res: Response): Promise<void> => {
  const typedReq = req as AuthenticatedRequest;
  
  try {
    // 清理会话
    if (typedReq.session) {
      await new Promise<void>((resolve, reject) => {
        typedReq.session.destroy((error: Error | null) => {
          if (error) {
            console.error('Session destroy error:', error);
            reject(error);
          } else {
            resolve();
          }
        });
      });
    }
    
    // 清理 cookie - 使用宽松设置来测试
    res.clearCookie('business.board.sid', {
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'lax'
    });
    
    console.log('User logged out successfully');
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    // 即使会话清理失败，也返回成功响应，因为客户端会清理本地状态
    res.json({ message: 'Logout completed' });
  }
});
router.get('/test-users', testUsersHandler);

export default router;
