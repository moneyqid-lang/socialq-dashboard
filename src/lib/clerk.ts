import { auth, currentUser } from '@clerk/nextjs';
import { supabaseAdmin } from './supabase';
import type { Organization, TeamMember } from './supabase';

/**
 * Get current user's organization
 */
export async function getCurrentOrg(): Promise<Organization | null> {
  const { userId } = auth();
  if (!userId) return null;

  const { data } = await supabaseAdmin
    .from('team_members')
    .select('organizations(*)')
    .eq('clerk_user_id', userId)
    .single();

  return data?.organizations as Organization || null;
}

/**
 * Get current user's team member record
 */
export async function getCurrentTeamMember(): Promise<TeamMember | null> {
  const { userId } = auth();
  if (!userId) return null;

  const { data } = await supabaseAdmin
    .from('team_members')
    .select('*')
    .eq('clerk_user_id', userId)
    .single();

  return data;
}

/**
 * Check if user has access to org
 */
export async function hasOrgAccess(orgId: string): Promise<boolean> {
  const { userId } = auth();
  if (!userId) return false;

  const { data } = await supabaseAdmin
    .from('team_members')
    .select('id')
    .eq('org_id', orgId)
    .eq('clerk_user_id', userId)
    .single();

  return !!data;
}

/**
 * Check if user has specific role in org
 */
export async function hasOrgRole(
  orgId: string,
  roles: TeamMember['role'][]
): Promise<boolean> {
  const { userId } = auth();
  if (!userId) return false;

  const { data } = await supabaseAdmin
    .from('team_members')
    .select('role')
    .eq('org_id', orgId)
    .eq('clerk_user_id', userId)
    .single();

  return data ? roles.includes(data.role) : false;
}

/**
 * Create new organization and add current user as owner
 */
export async function createOrg(
  name: string,
  slug: string,
  logoUrl?: string
): Promise<Organization> {
  const user = await currentUser();
  if (!user) throw new Error('Not authenticated');

  // Create org
  const { data: org, error: orgError } = await supabaseAdmin
    .from('organizations')
    .insert({
      name,
      slug,
      logo_url: logoUrl || null,
    })
    .select()
    .single();

  if (orgError) throw new Error(`Failed to create org: ${orgError.message}`);

  // Add user as owner
  const { error: memberError } = await supabaseAdmin
    .from('team_members')
    .insert({
      org_id: org.id,
      clerk_user_id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      name: `${user.firstName} ${user.lastName}`.trim(),
      role: 'owner',
    });

  if (memberError) {
    // Rollback org creation
    await supabaseAdmin.from('organizations').delete().eq('id', org.id);
    throw new Error(`Failed to add team member: ${memberError.message}`);
  }

  // Create default brand profile
  await supabaseAdmin.from('brand_profiles').insert({
    org_id: org.id,
    product_name: name,
    product_description: '',
    product_target: '',
    product_url: '',
  });

  return org;
}

/**
 * Get all orgs for current user
 */
export async function getUserOrgs(): Promise<Organization[]> {
  const { userId } = auth();
  if (!userId) return [];

  const { data } = await supabaseAdmin
    .from('team_members')
    .select('organizations(*)')
    .eq('clerk_user_id', userId);

  return (data?.map((d: any) => d.organizations) || []) as Organization[];
}

/**
 * Get org with all related data
 */
export async function getOrgWithDetails(orgId: string) {
  const [org, members, brand, accounts, pillars, schedules] = await Promise.all([
    supabaseAdmin.from('organizations').select('*').eq('id', orgId).single(),
    supabaseAdmin.from('team_members').select('*').eq('org_id', orgId),
    supabaseAdmin.from('brand_profiles').select('*').eq('org_id', orgId).single(),
    supabaseAdmin.from('social_accounts').select('*').eq('org_id', orgId),
    supabaseAdmin.from('content_pillars').select('*').eq('org_id', orgId),
    supabaseAdmin.from('posting_schedules').select('*').eq('org_id', orgId),
  ]);

  return {
    org: org.data,
    members: members.data || [],
    brand: brand.data,
    socialAccounts: accounts.data || [],
    pillars: pillars.data || [],
    schedules: schedules.data || [],
  };
}
