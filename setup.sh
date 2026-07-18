#!/bin/bash

echo "🚀 SocialQ Dashboard Setup"
echo "========================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js $(node -v) found"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Copy env file
if [ ! -f .env.local ]; then
    cp .env.local.example .env.local
    echo "✅ Created .env.local from template"
    echo ""
    echo "⚠️  Please edit .env.local with your credentials:"
    echo "   1. Clerk API keys (https://clerk.com)"
    echo "   2. Supabase credentials (https://supabase.com)"
    echo ""
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "📝 Next steps:"
echo "   1. Setup Clerk: See SETUP-CLERK.md"
echo "   2. Setup Supabase: See SETUP-SUPABASE.md"
echo "   3. Run: npm run dev"
echo ""
echo "📚 Documentation:"
echo "   - README.md — Project overview"
echo "   - SETUP-CLERK.md — Clerk auth setup"
echo "   - SETUP-SUPABASE.md — Database setup"
echo ""
echo "🎉 Setup complete!"
