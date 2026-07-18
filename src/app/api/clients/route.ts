import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // In demo mode, fetch all orgs (no auth filtering)
    const { data: orgs, error } = await supabase
      .from('organizations')
      .select(`
        *,
        social_accounts(platform, status),
        content_history(count)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
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
    const body = await request.json();
    const { name, slug, description, target, url, tone } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Check if slug is unique
    const { data: existing } = await supabase
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
    const { data: org, error: orgError } = await supabase
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

    // Create brand profile
    const { error: brandError } = await supabase
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
