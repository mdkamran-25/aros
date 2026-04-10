# Deployment Guide - MR BEAST CHALLENGE Landing Page

## Pre-Deployment Checklist

- [ ] All sections display correctly with proper text
- [ ] Mobile responsiveness tested on multiple devices
- [ ] Form validation works (email format, required fields)
- [ ] API endpoint responds to requests
- [ ] No console errors in development
- [ ] Build command runs successfully
- [ ] Environment variables configured

## Environment Variables

Create a `.env.local` file in the root directory:

```
# PayPal API Configuration
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-paypal-client-id-here

# Optional: Backend payment processing
PAYPAL_CLIENT_SECRET=your-paypal-client-secret-here

# Optional: API configuration
NEXT_PUBLIC_API_URL=https://your-domain.com
```

## Vercel Deployment (Recommended)

### Step 1: Prepare Repository

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: MR BEAST CHALLENGE landing page"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/aros.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Select "Next.js" framework preset
4. Configure project settings:
   - Root Directory: `./`
   - Node Version: 18.x or higher
5. Add environment variables:
   - `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
   - `PAYPAL_CLIENT_SECRET`
6. Click "Deploy"

### Step 3: Configure Domain

1. In Vercel dashboard, go to Settings > Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for SSL certificate (usually 1-2 hours)

## Alternative Deployments

### Railway.app

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Render.com

1. Push to GitHub
2. Create new Web Service on render.com
3. Connect GitHub repository
4. Set build command: `npm run build`
5. Set start command: `npm run start`
6. Add environment variables
7. Deploy

### DigitalOcean App Platform

1. Connect GitHub account
2. Create new app
3. Select Next.js app type
4. Configure build settings
5. Add environment variables
6. Deploy

## PayPal Integration for Production

### Get PayPal Credentials

1. Go to https://developer.paypal.com
2. Sign in to your account
3. Create a new app in Sandbox (testing)
4. Copy Client ID and secret
5. Add to `.env.local`

### Update Payment API

Replace the placeholder payment endpoint in `app/api/payment/route.ts` with:

```typescript
import { NextRequest, NextResponse } from "next/server";

const PAYPAL_API_URL = "https://api-m.paypal.com";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, amount } = body;

    // Validate input...

    // Create PayPal order
    const orderResponse = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`,
        ).toString("base64")}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: `${Date.now()}`,
            amount: {
              currency_code: "USD",
              value: amount,
            },
            description: "MR BEAST CHALLENGE Entry",
          },
        ],
        payer: {
          name: { given_name: name },
          email_address: email,
        },
      }),
    });

    const order = await orderResponse.json();

    // Return order ID for PayPal button to approve
    return NextResponse.json({
      orderId: order.id,
      status: "created",
    });
  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json(
      { error: "Payment processing failed" },
      { status: 500 },
    );
  }
}
```

### Update Frontend Payment Flow

Update `EntryForm.tsx` to use PayPal SDK:

```bash
npm install @paypal/checkout-server-sdk
```

## Post-Deployment

### Monitor Performance

- Check Vercel Analytics
- Monitor error rates
- Track page load times
- Review conversion funnel

### Test Payment Flow

1. Use PayPal Sandbox account
2. Submit test form entries
3. Verify confirmation emails
4. Check PayPal dashboard for transactions

### Security Check

- [ ] HTTPS enabled
- [ ] Environment variables secure
- [ ] API endpoints protected
- [ ] No secrets in version control
- [ ] CORS properly configured

### Analytics Setup

1. Add Google Analytics (optional)
2. Set up conversion tracking
3. Monitor traffic sources
4. Track form submission rates

## Troubleshooting

### Build fails

```bash
# Clear cache and rebuild
npm run build --verbose
```

### Environment variables not working

- Ensure `.env.local` exists in root
- Restart dev server after adding variables
- In Vercel, add variables in Settings > Environment Variables

### Form submissions failing

- Check browser console for errors
- Verify API endpoint is responsive
- Check network tab in DevTools
- Ensure email format is valid

## Maintenance

### Regular Updates

```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit

# Update major versions
npm outdated
```

### Backups

- GitHub repository serves as backup
- Vercel keeps deployment history
- Export entries regularly from PayPal

## Scaling

As traffic increases:

1. Monitor database performance
2. Set up caching for static content
3. Consider database indexing
4. Implement rate limiting on API
5. Set up CDN for assets

## Support Resources

- Next.js Docs: https://nextjs.org/docs
- Vercel Support: https://vercel.com/support
- PayPal Developer: https://developer.paypal.com
- Tailwind CSS: https://tailwindcss.com
