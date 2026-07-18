import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side Supabase client (uses anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client (uses service role key for admin operations)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey
);

// Database types
export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  plan: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  org_id: string;
  clerk_user_id: string;
  email: string | null;
  name: string | null;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  created_at: string;
}

export interface BrandProfile {
  id: string;
  org_id: string;
  product_name: string;
  product_description: string | null;
  product_target: string | null;
  product_url: string | null;
  product_features: string[];
  product_tone: string;
  brand_colors: {
    primary: string;
    accent: string;
    bg: string;
  };
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface SocialAccount {
  id: string;
  org_id: string;
  platform: 'instagram' | 'youtube' | 'threads' | 'tiktok';
  account_id: string;
  account_name: string | null;
  account_username: string | null;
  avatar_url: string | null;
  access_token: string;
  refresh_token: string | null;
  expires_at: string | null;
  scopes: string[];
  status: 'active' | 'expired' | 'disconnected';
  metadata: Record<string, any>;
  connected_at: string;
  updated_at: string;
}

export interface ContentPillar {
  id: string;
  org_id: string;
  name: string;
  slug: string;
  description: string | null;
  emoji: string | null;
  topics: any[];
  is_active: boolean;
  created_at: string;
}

export interface PostingSchedule {
  id: string;
  org_id: string;
  platform: string;
  cron_expression: string;
  timezone: string;
  is_active: boolean;
  created_at: string;
}

export interface ContentHistory {
  id: string;
  org_id: string;
  platform: string;
  post_id: string | null;
  post_url: string | null;
  content_type: 'image' | 'video' | 'carousel' | 'text';
  pillar_id: string | null;
  topic: any;
  copy: {
    hook: string;
    body: string;
    cta: string;
    followUpQuestion: string;
    hashtags: string[];
  } | null;
  media_url: string | null;
  media_type: string | null;
  status: 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed';
  scheduled_at: string | null;
  published_at: string | null;
  error_message: string | null;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  org_id: string;
  plan: string;
  status: string;
  payment_provider: string | null;
  payment_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at: string | null;
  created_at: string;
  updated_at: string;
}
