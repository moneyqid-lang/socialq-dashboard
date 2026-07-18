# SocialQ Dashboard

AI-powered social media automation platform — manage clients, generate content, and publish across platforms from one dashboard.

## Features

- 🤖 **AI Content Generation** — Generate captions, hooks, CTAs using Gemini, Mistral, DeepSeek, Claude
- 📅 **Smart Scheduling** — Schedule posts at optimal times per platform
- 📱 **Multi-Platform** — Instagram, YouTube, Threads, TikTok
- 👥 **Multi-Client** — Manage multiple brands from one account
- 📊 **Analytics** — Track engagement and performance
- 🔄 **Auto Token Refresh** — Never lose connection

## Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, Shadcn/ui
- **Auth**: Clerk (multi-org support)
- **Database**: Supabase (PostgreSQL)
- **AI**: Gemini, Mistral, DeepSeek, Claude
- **Deployment**: Vercel

## Getting Started

### 1. Clone & Install

```bash
cd socialq-dashboard
npm install
```

### 2. Setup Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials:
- Clerk (auth)
- Supabase (database)
- AI API keys

### 3. Setup Database

Run the SQL schema in Supabase SQL Editor:
```bash
# Copy contents of supabase-schema.sql and run in Supabase Dashboard → SQL Editor
```

### 4. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

## Project Structure

```
src/
├── app/
│   ├── (auth)/              # Auth pages (login, register)
│   ├── (dashboard)/         # Dashboard pages
│   │   ├── clients/         # Client management
│   │   ├── calendar/        # Content calendar
│   │   ├── analytics/       # Analytics
│   │   └── settings/        # Account settings
│   ├── (marketing)/         # Landing page
│   └── api/                 # API routes
├── components/
│   └── ui/                  # Shadcn components
└── lib/
    ├── supabase.ts          # Supabase client & types
    ├── clerk.ts             # Auth utilities
    └── utils.ts             # Helper functions
```

## Client Setup Flow

1. **Brand Info** — Name, description, target audience, URL
2. **Social Media** — Connect Instagram, YouTube, Threads, TikTok
3. **AI Setup** — Configure AI providers
4. **Content** — Content pillars & posting schedule
5. **Launch** — Review & activate

## API Routes

- `GET /api/clients` — List all clients
- `POST /api/clients` — Create new client
- `POST /api/content/generate` — Generate content for a client

## Deployment

### Vercel

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

### Environment Variables

See `.env.local.example` for all required variables.

## License

MIT

---

Built with ❤️ for content creators who want to scale.
