-- SocialQ Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations (clients)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  logo_url TEXT,
  plan VARCHAR(50) DEFAULT 'starter',
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team members (Clerk users linked to orgs)
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  clerk_user_id VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'owner', -- owner, admin, editor, viewer
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(org_id, clerk_user_id)
);

-- Brand profiles
CREATE TABLE brand_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  product_name VARCHAR(255) NOT NULL,
  product_description TEXT,
  product_target TEXT,
  product_url VARCHAR(500),
  product_features TEXT[],
  product_tone VARCHAR(100) DEFAULT 'profesional',
  brand_colors JSONB DEFAULT '{"primary": "#06B5A5", "accent": "#FFD166", "bg": "#0f172a"}',
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Connected social accounts
CREATE TABLE social_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL, -- instagram, youtube, threads, tiktok
  account_id VARCHAR(255),
  account_name VARCHAR(255),
  account_username VARCHAR(255),
  avatar_url TEXT,
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  scopes TEXT[],
  status VARCHAR(50) DEFAULT 'active', -- active, expired, disconnected
  metadata JSONB DEFAULT '{}',
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(org_id, platform, account_id)
);

-- Content pillars/topics
CREATE TABLE content_pillars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  description TEXT,
  emoji VARCHAR(10),
  topics JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(org_id, slug)
);

-- Posting schedules
CREATE TABLE posting_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  cron_expression VARCHAR(100) NOT NULL,
  timezone VARCHAR(50) DEFAULT 'Asia/Jakarta',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(org_id, platform, cron_expression)
);

-- Content generation history
CREATE TABLE content_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  post_id VARCHAR(255),
  post_url TEXT,
  content_type VARCHAR(50) DEFAULT 'image', -- image, video, carousel, text
  pillar_id UUID REFERENCES content_pillars(id),
  topic JSONB,
  copy JSONB, -- {hook, body, cta, followUpQuestion, hashtags}
  media_url TEXT,
  media_type VARCHAR(50),
  status VARCHAR(50) DEFAULT 'draft', -- draft, scheduled, publishing, published, failed
  scheduled_at TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  engagement JSONB DEFAULT '{"likes": 0, "comments": 0, "shares": 0}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI provider configuration per org
CREATE TABLE ai_configurations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL, -- gemini, mistral, deepseek, claude
  api_key_encrypted TEXT,
  model VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(org_id, provider)
);

-- Hashtag pool per org
CREATE TABLE hashtag_pool (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  tag VARCHAR(100) NOT NULL,
  category VARCHAR(50), -- brand, niche, trending
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(org_id, tag)
);

-- Copy templates per org
CREATE TABLE copy_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  pillar VARCHAR(100),
  platform VARCHAR(50),
  template_text TEXT NOT NULL,
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Billing & subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  plan VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  payment_provider VARCHAR(50), -- stripe, midtrans
  payment_id VARCHAR(255),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_team_members_org ON team_members(org_id);
CREATE INDEX idx_team_members_user ON team_members(clerk_user_id);
CREATE INDEX idx_social_accounts_org ON social_accounts(org_id);
CREATE INDEX idx_content_history_org ON content_history(org_id);
CREATE INDEX idx_content_history_platform ON content_history(platform);
CREATE INDEX idx_content_history_status ON content_history(status);
CREATE INDEX idx_content_history_published ON content_history(published_at);
CREATE INDEX idx_content_pillars_org ON content_pillars(org_id);
CREATE INDEX idx_posting_schedules_org ON posting_schedules(org_id);
CREATE INDEX idx_hashtag_pool_org ON hashtag_pool(org_id);
CREATE INDEX idx_copy_templates_org ON copy_templates(org_id);

-- Row Level Security (RLS)
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_pillars ENABLE ROW LEVEL SECURITY;
ALTER TABLE posting_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE hashtag_pool ENABLE ROW LEVEL SECURITY;
ALTER TABLE copy_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users can only access their own org data)
CREATE POLICY "Users can view own org" ON organizations
  FOR SELECT USING (
    id IN (SELECT org_id FROM team_members WHERE clerk_user_id = auth.uid()::text)
  );

CREATE POLICY "Users can view own team" ON team_members
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM team_members WHERE clerk_user_id = auth.uid()::text)
  );

CREATE POLICY "Users can view own brand" ON brand_profiles
  FOR ALL USING (
    org_id IN (SELECT org_id FROM team_members WHERE clerk_user_id = auth.uid()::text)
  );

CREATE POLICY "Users can view own social accounts" ON social_accounts
  FOR ALL USING (
    org_id IN (SELECT org_id FROM team_members WHERE clerk_user_id = auth.uid()::text)
  );

CREATE POLICY "Users can view own content" ON content_history
  FOR ALL USING (
    org_id IN (SELECT org_id FROM team_members WHERE clerk_user_id = auth.uid()::text)
  );

CREATE POLICY "Users can view own pillars" ON content_pillars
  FOR ALL USING (
    org_id IN (SELECT org_id FROM team_members WHERE clerk_user_id = auth.uid()::text)
  );

CREATE POLICY "Users can view own schedules" ON posting_schedules
  FOR ALL USING (
    org_id IN (SELECT org_id FROM team_members WHERE clerk_user_id = auth.uid()::text)
  );

CREATE POLICY "Users can view own hashtags" ON hashtag_pool
  FOR ALL USING (
    org_id IN (SELECT org_id FROM team_members WHERE clerk_user_id = auth.uid()::text)
  );

CREATE POLICY "Users can view own templates" ON copy_templates
  FOR ALL USING (
    org_id IN (SELECT org_id FROM team_members WHERE clerk_user_id = auth.uid()::text)
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brand_profiles_updated_at BEFORE UPDATE ON brand_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_accounts_updated_at BEFORE UPDATE ON social_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_history_updated_at BEFORE UPDATE ON content_history
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default content pillars for new orgs (via trigger)
CREATE OR REPLACE FUNCTION create_default_pillars()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO content_pillars (org_id, name, slug, description, emoji, topics) VALUES
    (NEW.id, 'Tips Hemat', 'tips_hemat', 'Tips dan trik hemat sehari-hari', '💰', '[]'),
    (NEW.id, 'Edukasi Siklus', 'edukasi_siklus', 'Edukasi tentang budget berbasis siklus', '📚', '[]'),
    (NEW.id, 'Fakta Finansial', 'fakta_finansial', 'Fakta mengejutkan tentang keuangan', '📊', '[]'),
    (NEW.id, 'Before/After', 'before_after', 'Transformasi keuangan', '✨', '[]'),
    (NEW.id, 'Challenge', 'challenge', 'Tantangan keuangan seru', '🎯', '[]'),
    (NEW.id, 'Behind Product', 'behind_product', 'Cerita di balik produk', '🎬', '[]');
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER create_org_default_pillars AFTER INSERT ON organizations
  FOR EACH ROW EXECUTE FUNCTION create_default_pillars();

-- Insert default posting schedules for new orgs
CREATE OR REPLACE FUNCTION create_default_schedules()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO posting_schedules (org_id, platform, cron_expression) VALUES
    (NEW.id, 'instagram', '0 0 * * *'),   -- 07:00 WIB
    (NEW.id, 'instagram', '0 3 * * *'),   -- 10:00 WIB
    (NEW.id, 'instagram', '0 7 * * *'),   -- 14:00 WIB
    (NEW.id, 'instagram', '0 11 * * *'),  -- 18:00 WIB
    (NEW.id, 'instagram', '0 13 * * *'),  -- 20:00 WIB
    (NEW.id, 'youtube', '0 4 * * *'),     -- 11:00 WIB
    (NEW.id, 'youtube', '0 10 * * *');    -- 17:00 WIB
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER create_org_default_schedules AFTER INSERT ON organizations
  FOR EACH ROW EXECUTE FUNCTION create_default_schedules();
