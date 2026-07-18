# Setup Supabase Database

## 1. Create Supabase Account

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub or email

## 2. Create New Project

1. Click "New Project"
2. Fill in:
   - **Organization**: Create new or select existing
   - **Project Name**: `socialq`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Southeast Asia (Singapore) for best performance
3. Click "Create new project"
4. Wait 2-3 minutes for setup to complete

## 3. Get API Keys

1. Go to **Settings** → **API** in the left sidebar
2. Copy these values:
   - **Project URL**: `https://xxxxxxxxxxxx.supabase.co`
   - **Anon/Public Key**: `eyJ...` (long string)
   - **Service Role Key**: `eyJ...` (long string, keep secret!)

## 4. Run Database Schema

1. Go to **SQL Editor** in the left sidebar
2. Click "New query"
3. Copy the contents of `supabase-schema.sql` from this project
4. Paste into the editor
5. Click "Run" (or press Ctrl+Enter)
6. You should see "Success. No rows returned"

This creates:
- All tables (organizations, team_members, brand_profiles, etc.)
- Indexes for performance
- Row Level Security (RLS) policies
- Auto-create default content pillars for new orgs
- Auto-create default posting schedules

## 5. Add to Environment Variables

Update `.env.local` file in `socialq-dashboard/`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your_anon_key...
SUPABASE_SERVICE_ROLE_KEY=eyJ...your_service_role_key...
```

## 6. Test Connection

```bash
cd socialq-dashboard
npm run dev
```

Visit http://localhost:3000 — the dashboard should load without database errors.

## 7. (Optional) Setup Storage for Media

1. Go to **Storage** in the left sidebar
2. Create a new bucket named `content`
3. Set it to **Public** (for image URLs)
4. Update bucket policies if needed

## Database Schema Overview

```
organizations
├── team_members (users in org)
├── brand_profiles (product config)
├── social_accounts (OAuth tokens)
├── content_pillars (6 defaults)
├── posting_schedules (cron jobs)
├── content_history (published posts)
├── ai_configurations (API keys)
├── hashtag_pool (rotation)
├── copy_templates (per pillar)
└── subscriptions (billing)
```

## Row Level Security (RLS)

All tables have RLS enabled. Users can only access data from organizations they belong to.

- `team_members` links Clerk users to organizations
- All queries automatically filter by user's org membership
- Service role key bypasses RLS (for admin operations)

## Troubleshooting

- **"relation does not exist"**: Schema not run yet. Run `supabase-schema.sql`
- **"permission denied"**: RLS policy issue. Check user is in `team_members`
- **"JWT error"**: API key is wrong. Double-check URL and keys
- **Slow queries**: Indexes not created. Re-run the schema SQL

## Backup & Restore

### Backup
```bash
# Via Supabase CLI
supabase db dump > backup.sql
```

### Restore
```bash
# Via SQL Editor
# Paste backup.sql contents and run
```
