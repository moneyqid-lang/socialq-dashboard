import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get orgs where user is a member
    const { data: memberships, error: membershipError } = await supabaseAdmin
      .from('team_members')
      .select('org_id')
      .eq('clerk_user_id', userId);

    if (membershipError) {
      throw new Error(membershipError.message);
    }

    const orgIds = memberships?.map((m) => m.org_id) || [];

    if (orgIds.length === 0) {
      return NextResponse.json([]);
    }

    // Fetch organizations with related data
    const { data: orgs, error: orgsError } = await supabaseAdmin
      .from('organizations')
      .select(`
        *,
        social_accounts(platform, status),
        content_history(count)
      `)
      .in('id', orgIds)
      .order('created_at', { ascending: false });

    if (orgsError) {
      throw new Error(orgsError.message);
    }

    return NextResponse.json(orgs || []);
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, slug, description, target, url, tone } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Check if slug is unique
    const { data: existing } = await supabaseAdmin
      .from('organizations')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Slug already taken' },
        { status: 400 }
      );
    }

    // Create organization
    const { data: org, error: orgError } = await supabaseAdmin
      .from('organizations')
      .insert({
        name,
        slug,
        plan: 'starter',
      })
      .select()
      .single();

    if (orgError) {
      throw new Error(orgError.message);
    }

    // Add user as owner
    const { error: memberError } = await supabaseAdmin
      .from('team_members')
      .insert({
        org_id: org.id,
        clerk_user_id: userId,
        role: 'owner',
      });

    if (memberError) {
      // Rollback org creation
      await supabaseAdmin.from('organizations').delete().eq('id', org.id);
      throw new Error(memberError.message);
    }

    // Create brand profile
    const { error: brandError } = await supabaseAdmin
      .from('brand_profiles')
      .insert({
        org_id: org.id,
        product_name: name,
        product_description: description || '',
        product_target: target || '',
        product_url: url || null,
        product_tone: tone || 'profesional',
      });

    if (brandError) {
      console.error('Error creating brand profile:', brandError);
      // Don't rollback - brand can be created later
    }

    return NextResponse.json(org, { status: 201 });
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json(
      { error: 'Failed to create client' },
      { status: 500 }
    );
  }
}
