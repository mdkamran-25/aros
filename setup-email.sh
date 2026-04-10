#!/bin/bash

# Quick Setup Script for Email Signup System

echo "🔧 MR BEAST CHALLENGE - Email Setup Script"
echo "==========================================="

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo "✅ .env.local already exists"
else
    echo "📋 Creating .env.local from template..."
    cp .env.local.example .env.local
    echo "✅ .env.local created. Please update it with your Gmail credentials:"
    echo "   - EMAIL_SERVICE=gmail"
    echo "   - EMAIL_USER=your-email@gmail.com"
    echo "   - EMAIL_PASSWORD=your-app-password (not your regular password)"
fi

echo ""
echo "📧 Email Setup Instructions:"
echo "1. Enable 2-Factor Authentication on your Gmail account"
echo "2. Go to https://myaccount.google.com/apppasswords"
echo "3. Select Mail + Windows Computer"
echo "4. Copy the 16-character password"
echo "5. Paste it as EMAIL_PASSWORD in .env.local"
echo ""
echo "🚀 To start development:"
echo "   npm run dev"
echo ""
echo "✅ Setup complete!"
