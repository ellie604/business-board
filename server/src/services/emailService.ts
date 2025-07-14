import nodemailer from 'nodemailer';

interface EmailConfig {
  service: string;
  auth: {
    user: string;
    pass: string;
  };
}

class EmailService {
  private transporter: nodemailer.Transporter;
  private forwardingEmail: string = 'xinyiluo2024@gmail.com';

  constructor() {
    // 使用Gmail SMTP配置
    const config: EmailConfig = {
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'your-system-email@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'your-app-password'
      }
    };

    this.transporter = nodemailer.createTransport(config);
  }

  async sendBrokerNotification(messageData: {
    subject: string;
    content: string;
    senderName: string;
    senderEmail?: string;
    receiverName: string;
    createdAt: Date;
  }): Promise<void> {
    try {
      const emailContent = `
      New Broker Message Notification
      
      Time: ${messageData.createdAt.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}
      
      From: ${messageData.senderName}${messageData.senderEmail ? ` (${messageData.senderEmail})` : ''}
      To: ${messageData.receiverName}
      Subject: ${messageData.subject}
      
      Message Content:
      ${messageData.content}
      
      Please login to the system for more details: https://californiabizsales.com/broker/messages
      `;

      const mailOptions = {
        from: process.env.EMAIL_USER || 'system@californiabusinesssales.com',
        to: this.forwardingEmail,
        subject: `[Broker Notification] ${messageData.subject}`,
        text: emailContent,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">New Broker Message Notification</h2>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Time:</strong> ${messageData.createdAt.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}</p>
              <p><strong>From:</strong> ${messageData.senderName}${messageData.senderEmail ? ` (${messageData.senderEmail})` : ''}</p>
              <p><strong>To:</strong> ${messageData.receiverName}</p>
              <p><strong>Subject:</strong> ${messageData.subject}</p>
            </div>
            
            <div style="background-color: #ffffff; padding: 20px; border: 1px solid #d1d5db; border-radius: 8px;">
              <h3 style="color: #374151; margin-top: 0;">Message Content:</h3>
              <div style="white-space: pre-wrap; color: #6b7280;">${messageData.content}</div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://californiabizsales.com/broker/messages" 
                 style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                View Details
              </a>
            </div>
            
            <p style="font-size: 12px; color: #9ca3af; text-align: center;">
              This email is automatically sent by California Business Sales system
            </p>
          </div>
        `
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Email notification sent to ${this.forwardingEmail} for broker message: ${messageData.subject}`);
    } catch (error) {
      console.error('Failed to send email notification:', error);
      // 不抛出错误，确保消息创建不受影响
    }
  }

  // 测试邮件配置
  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('Email service is ready');
      return true;
    } catch (error) {
      console.error('Email service configuration error:', error);
      return false;
    }
  }
}

export const emailService = new EmailService(); 