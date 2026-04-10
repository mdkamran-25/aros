# MR BEAST CHALLENGE - Landing Page

A modern, responsive landing page for the MR BEAST CHALLENGE competition built with Next.js, TypeScript, and Tailwind CSS.

## Features

- ✅ **SEO Optimized** - Meta tags and proper metadata configuration
- ✅ **Mobile Responsive** - Works seamlessly on all device sizes
- ✅ **Component-Based Architecture** - Modular, reusable components
- ✅ **Payment Integration Ready** - API endpoint for $0.99 entry payment
- ✅ **Form Validation** - Email and name validation with error handling
- ✅ **Modern Styling** - Tailwind CSS with emoji design language
- ✅ **Performance Optimized** - Built on Next.js for fast loading

## Project Structure

```
/Users/kamran/Fiverr/aros/
├── app/
│   ├── components/           # Reusable React components
│   │   ├── HeroSection.tsx          # Main headline and CTA
│   │   ├── AboutSection.tsx         # Challenge description
│   │   ├── BenefitsSection.tsx      # 4-card benefits grid
│   │   ├── HowItWorksSection.tsx    # 5-step process flow
│   │   ├── EntryForm.tsx            # Name/email form with validation
│   │   ├── PaymentSection.tsx       # Payment options display
│   │   ├── UrgencySection.tsx       # Limited spots messaging
│   │   └── FinalCtaSection.tsx      # Final call-to-action
│   ├── api/
│   │   └── payment/
│   │       └── route.ts             # Payment processing API endpoint
│   ├── layout.tsx                   # Root layout with metadata
│   ├── page.tsx                     # Main landing page
│   └── globals.css                  # Global Tailwind styles
├── public/                  # Static assets
├── .env.local.example       # Environment variables template
├── package.json
├── tsconfig.json
└── tailwind.config.js
```

## Quick Start

### 1. Install Dependencies

```bash
cd /Users/kamran/Fiverr/aros
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The site will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Create optimized production build
- `npm run start` - Run production build
- `npm run lint` - Run ESLint to check code quality

## Page Sections

1. **Hero Section** - Eye-catching headline with primary CTA button
2. **About Section** - Explanation of the MR BEAST CHALLENGE
3. **Benefits Section** - 4 key reasons to join (prizes, visibility, worldwide, low cost)
4. **How It Works** - 5-step process from entry to winning
5. **Entry Form** - Captures name and email with validation
6. **Payment Section** - Displays secure payment options (PayPal + Card)
7. **Urgency Section** - Limited spots messaging with red accent
8. **Final CTA** - Closing call-to-action to join
9. **Footer** - Links to policies and contact

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for:

- Vercel (Recommended)
- Railway.app
- Render.com
- DigitalOcean
- PayPal Integration

## Browser Support

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [React Documentation](https://react.dev)
