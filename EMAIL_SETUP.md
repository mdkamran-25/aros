# Email Signup System Setup Guide

## Overview

The MR BEAST CHALLENGE website now includes a complete email signup system using **Nodemailer**. When users sign up with their name and email, they automatically receive a beautiful confirmation email.

## Features

✅ **Signup Form** - Captures name and email with validation
✅ **Nodemailer Integration** - Sends professional HTML emails
✅ **Transaction IDs** - Unique IDs for each signup
✅ **Email Templates** - Beautiful responsive email designs
✅ **Error Handling** - Graceful handling of email failures
✅ **Console Logging** - Signup data logged for tracking

## Installation

### 1. Install Dependencies

```bash
npm install nodemailer
npm install --save-dev @types/nodemailer
```

*(Already done - these are included in package.json)*

### 2. Configure Environment Variables

Copy the example file:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your email credentials:

```env
# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
```

## Gmail Setup (Recommended for Development)

### Step 1: Enable 2-Factor Authentication
1. Go to https://myaccount.google.com
2. Click "Security" in the left sidebar
3. Enable "2-Step Verification"

### Step 2: Generate App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer" (or your device)
3. Google will generate a 16-character password
4. Copy this password to `EMAIL_PASSWORD` in `.env.local`

### Step 3: Test the Setup
```bash
npm run dev
```

## How It Works

### 1. User Signup
- User fills in name and email in the "Ready to Enter?" form
- Clicks "Continue to Payment"
- Form data is sent to `/api/payment` endpoint

### 2. Email Sending
- Server validates the input (name, email format, amount)
- Generates a unique Transaction ID
- Calls `sendConfirmationEmail()` function
- User receives professional confirmation email

### 3. Response
- User sees success message on page
- Transaction ID is generated for their records

## File Structure

```
/app/api/payment/route.ts        - Signup/Payment API endpoint
/lib/email.ts                     - Email service with nodemailer
/.env.local.example               - Environment variables template
```

## API Endpoint

**POST /api/payment**

### Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "amount": "0.99"
}
```

### Success Response (200)
```json
{
  "success": true,
  "message": "Successfully registered for MR BEAST CHALLENGE!",
  "transactionId": "MRBEAST-1712765432123-ABC123DEF",
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "amount": "0.99"
  }
}
```

### Error Responses
- **400**: Missing fields, invalid email, or invalid amount
- **500**: Server error (email sending issues, validation errors)

## Email Template

The confirmation email includes:
- Beautiful branded header with logo
- Entry details (name, email, transaction ID)
- Next steps for the competition
- Competition details
- Footer with company info

## Production Deployment

### For Vercel Deployment

1. Add environment variables to Vercel dashboard:
   - Go to Settings > Environment Variables
   - Add `EMAIL_SERVICE`, `EMAIL_USER`, `EMAIL_PASSWORD`

2. Recommended: Use a professional email service
   - **SendGrid**: `npm install @sendgrid/mail`
   - **Mailgun**: Configure with API keys
   - **AWS SES**: Set up through AWS

### Alternative Email Services

#### SendGrid Example
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: email,
  from: process.env.SENDGRID_FROM_EMAIL,
  subject: 'Welcome to MR BEAST CHALLENGE',
  html: emailTemplate,
};

await sgMail.send(msg);
```

#### Gmail with NodeMailer (Current)
- Works great for development/testing
- Limited to 500 emails/day (free tier)
- Requires App Passwords (2FA enabled)

## Logging & Monitoring

All signups are logged to the console:
```
New signup: {
  name: "John Doe",
  email: "john@example.com",
  transactionId: "MRBEAST-1712765432123-ABC123DEF",
  timestamp: "2026-04-10T14:35:00.000Z"
}
```

### Future: Database Integration
To persist signups, update `/app/api/payment/route.ts`:

```typescript
// Save to database
const signup = await db.signups.create({
  name,
  email,
  transactionId,
  amount,
  createdAt: new Date(),
});

console.log("Signup saved:", signup.id);
```

## Testing

### Test Locally
1. Start dev server: `npm run dev`
2. Visit http://localhost:3000
3. Scroll to "Ready to Enter?" section
4. Fill in form:
   - Name: Test User
   - Email: your-test-email@gmail.com
5. Click "Continue to Payment"
6. Check your email for confirmation

### Test with Multiple Emails
Use Gmail's `+` feature:
- `yourname+test1@gmail.com`
- `yourname+test2@gmail.com`
- All go to `yourname@gmail.com` inbox

## Troubleshooting

### Email Not Sending
1. Check `.env.local` has correct credentials
2. Verify Gmail 2FA is enabled
3. Verify App Password (not regular password) is used
4. Check console logs: `npm run dev`

### Invalid Email Error
- Make sure email format is correct
- Email must contain @ and domain

### Transaction ID Issues
- Check browser console for specific error messages
- Look at server logs: `npm run dev`

## Security Notes

⚠️ **Important:**
- Never commit `.env.local` to Git
- Use App Passwords, not your actual Gmail password
- For production, use professional email service (SendGrid, Mailgun, etc.)
- Implement rate limiting on signup endpoint
- Consider adding CAPTCHA for form protection

## Next Steps

1. ✅ Basic email signup implemented
2. 🔄 Add database integration (MongoDB, Supabase)
3. 🔄 Integrate PayPal payment processing
4. 🔄 Add admin dashboard to view signups
5. 🔄 Implement email scheduling/templates
6. 🔄 Add user authentication/accounts

## Support

For issues or questions:
- Check email configuration in `.env.local`
- Review console logs: `npm run dev`
- Check [Nodemailer Documentation](https://nodemailer.com)
