# Broker Email Forwarding Setup Guide

## Feature Description

The system now supports automatically forwarding all broker messages to the personal email `xinyiluo2024@gmail.com`.

Email notifications will be sent in the following scenarios:

1. **User Registration** - Messages sent to broker when new users register
2. **NDA Submission** - Messages sent to broker when users submit NDA forms  
3. **Contact Form** - Messages sent to broker from website visitors via contact form
4. **Callback Request** - Messages sent to broker when website visitors request callbacks
5. **User Messages** - Any user directly sending messages to broker

## Environment Variables Configuration

Need to add the following environment variables on deployment platform (Render):

```bash
# Email Configuration
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
```

## Gmail Setup Steps

### 1. Enable Gmail Two-Step Verification
- Login to Gmail account
- Go to Google Account settings
- Select "Security"
- Enable "Two-Step Verification"

### 2. Generate App-Specific Password
- In Google Account "Security" page
- Click "App passwords"
- Select "Mail" and device type
- Generate 16-digit app-specific password
- Use this password as `EMAIL_PASSWORD`

### 3. Configure Environment Variables in Render
- Login to Render Dashboard
- Select backend service (business-board-backend)
- Go to "Environment" tab
- Add environment variables:
  ```
  EMAIL_USER = your-gmail-address@gmail.com
  EMAIL_PASSWORD = your-16-digit-app-password
  ```

## Email Template

Emails will contain the following information (all in English):
- Message timestamp (California time)
- Sender name and email
- Receiver (broker) name
- Message subject
- Message content
- System link (for viewing details)

## Testing the Feature

After deployment, you can test by:

1. **Register New User** - Register a new account on the website
2. **Submit Contact Form** - Use the website contact form
3. **Send Message** - Login to system and send message to broker

After each operation, `xinyiluo2024@gmail.com` should receive corresponding email notifications.

## Important Notes

- Email sending is asynchronous and won't affect normal message creation flow
- If email sending fails, errors will be logged on server but won't interrupt system operations
- Email content supports English display
- All timestamps are displayed in California time format

## Troubleshooting

If not receiving emails:

1. Check if Render environment variables are correctly set
2. Verify Gmail app-specific password is valid
3. Check Render server logs for email sending logs
4. Check spam folder of `xinyiluo2024@gmail.com` 