"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailService {
    constructor() {
        this.forwardingEmail = 'xinyiluo2024@gmail.com';
        // 使用Gmail SMTP配置
        const config = {
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER || 'your-system-email@gmail.com',
                pass: process.env.EMAIL_PASSWORD || 'your-app-password'
            }
        };
        this.transporter = nodemailer_1.default.createTransport(config);
    }
    async sendBrokerNotification(messageData) {
        try {
            const emailContent = `
      Broker收到新消息通知
      
      时间: ${messageData.createdAt.toLocaleString('zh-CN', { timeZone: 'America/Los_Angeles' })}
      
      发件人: ${messageData.senderName}${messageData.senderEmail ? ` (${messageData.senderEmail})` : ''}
      收件人: ${messageData.receiverName}
      主题: ${messageData.subject}
      
      消息内容:
      ${messageData.content}
      
      请登录系统查看详细信息: https://californiabizsales.com/broker/messages
      `;
            const mailOptions = {
                from: process.env.EMAIL_USER || 'system@californiabusinesssales.com',
                to: this.forwardingEmail,
                subject: `[Broker消息通知] ${messageData.subject}`,
                text: emailContent,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Broker收到新消息通知</h2>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>时间:</strong> ${messageData.createdAt.toLocaleString('zh-CN', { timeZone: 'America/Los_Angeles' })}</p>
              <p><strong>发件人:</strong> ${messageData.senderName}${messageData.senderEmail ? ` (${messageData.senderEmail})` : ''}</p>
              <p><strong>收件人:</strong> ${messageData.receiverName}</p>
              <p><strong>主题:</strong> ${messageData.subject}</p>
            </div>
            
            <div style="background-color: #ffffff; padding: 20px; border: 1px solid #d1d5db; border-radius: 8px;">
              <h3 style="color: #374151; margin-top: 0;">消息内容:</h3>
              <div style="white-space: pre-wrap; color: #6b7280;">${messageData.content}</div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://californiabizsales.com/broker/messages" 
                 style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                查看详细信息
              </a>
            </div>
            
            <p style="font-size: 12px; color: #9ca3af; text-align: center;">
              此邮件由California Business Sales系统自动发送
            </p>
          </div>
        `
            };
            await this.transporter.sendMail(mailOptions);
            console.log(`Email notification sent to ${this.forwardingEmail} for broker message: ${messageData.subject}`);
        }
        catch (error) {
            console.error('Failed to send email notification:', error);
            // 不抛出错误，确保消息创建不受影响
        }
    }
    // 测试邮件配置
    async testConnection() {
        try {
            await this.transporter.verify();
            console.log('Email service is ready');
            return true;
        }
        catch (error) {
            console.error('Email service configuration error:', error);
            return false;
        }
    }
}
exports.emailService = new EmailService();
