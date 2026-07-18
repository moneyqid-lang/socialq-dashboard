import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { orgId, platform, pillarId } = body;

    if (!orgId || !platform) {
      return NextResponse.json(
        { error: 'orgId and platform are required' },
        { status: 400 }
      );
    }

    // Verify user has access to org
    const { data: membership } = await supabaseAdmin
      .from('team_members')
      .select('role')
      .eq('org_id', orgId)
      .eq('clerk_user_id', userId)
      .single();

    if (!membership) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Fetch org details
    const { data: org } = await supabaseAdmin
      .from('organizations')
      .select('*')
      .eq('id', orgId)
      .single();

    if (!org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    // Fetch brand profile
    const { data: brand } = await supabaseAdmin
      .from('brand_profiles')
      .select('*')
      .eq('org_id', orgId)
      .single();

    // Fetch content pillar
    let pillar;
    if (pillarId) {
      const { data } = await supabaseAdmin
        .from('content_pillars')
        .select('*')
        .eq('id', pillarId)
        .single();
      pillar = data;
    } else {
      // Random pillar
      const { data: pillars } = await supabaseAdmin
        .from('content_pillars')
        .select('*')
        .eq('org_id', orgId)
        .eq('is_active', true);

      if (pillars && pillars.length > 0) {
        pillar = pillars[Math.floor(Math.random() * pillars.length)];
      }
    }

    if (!pillar) {
      return NextResponse.json(
        { error: 'No content pillars found' },
        { status: 400 }
      );
    }

    // Generate topic
    const topic = {
      topic: pillar.name,
      pillar: pillar.slug,
      angle: generateAngle(pillar.slug),
    };

    // Generate copy using AI
    const copy = await generateCopy(topic, platform, brand);

    // Create content history entry
    const { data: content, error: contentError } = await supabaseAdmin
      .from('content_history')
      .insert({
        org_id: orgId,
        platform,
        content_type: 'image',
        pillar_id: pillar.id,
        topic,
        copy,
        status: 'draft',
      })
      .select()
      .single();

    if (contentError) {
      throw new Error(contentError.message);
    }

    return NextResponse.json(content, { status: 201 });
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}

function generateAngle(pillar: string): string {
  const angles: Record<string, string[]> = {
    tips_hemat: [
      'Kebocoran keuangan yang gak disadari',
      'Cara hemat tanpa merasa kekurangan',
      'Tips hemat untuk anak muda',
    ],
    edukasi_siklus: [
      'Kenapa budget bulanan gagal terus',
      'Sistem siklus vs bulanan',
      'Budgeting untuk freelancer',
    ],
    fakta_finansial: [
      'Statistik keuangan Indonesia',
      'Fakta mengejutkan tentang tabungan',
      'Data pengeluaran anak muda',
    ],
    before_after: [
      'Transformasi dari konsumtif ke hemat',
      'Dari utang menumpuk ke financial freedom',
      'Perubahan kebiasaan keuangan',
    ],
    challenge: [
      'Tantangan hemat 7 hari',
      'No spend weekend challenge',
      'Challenge nabung 30%',
    ],
    behind_product: [
      'Cerita di balik fitur',
      'Kenapa sistem siklus diciptakan',
      'User story sukses',
    ],
  };

  const pillarAngles = angles[pillar] || angles.tips_hemat;
  return pillarAngles[Math.floor(Math.random() * pillarAngles.length)];
}

async function generateCopy(
  topic: any,
  platform: string,
  brand: any
): Promise<any> {
  // Build product context
  const productName = brand?.product_name || 'Brand';
  const productDesc = brand?.product_description || 'Produk/jasa';
  const productTarget = brand?.product_target || 'target audience';
  const productUrl = brand?.product_url || 'https://example.com';
  const productTone = brand?.product_tone || 'profesional';

  // Build prompt
  const prompt = buildPrompt(topic, platform, {
    name: productName,
    description: productDesc,
    target: productTarget,
    url: productUrl,
    tone: productTone,
  });

  // Try AI providers
  const providers = [
    { name: 'gemini', fn: callGemini },
    { name: 'mistral', fn: callMistral },
    { name: 'deepseek', fn: callDeepSeek },
  ];

  for (const provider of providers) {
    try {
      const raw = await provider.fn(prompt);
      const parsed = parseCopy(raw);
      return parsed;
    } catch (error) {
      console.error(`${provider.name} failed:`, error);
      continue;
    }
  }

  // Fallback to template
  return {
    hook: `Pernah ngalamin masalah keuangan? ${productName} punya solusinya!`,
    body: `${productDesc} Cocok untuk ${productTarget}.`,
    cta: `Cek ${productUrl}`,
    followUpQuestion: 'Lo termasuk yang mana? Share pengalaman lo di comment 👇',
    hashtags: ['tipskeuangan', 'financialfreedom', 'moneymanagement'],
  };
}

function buildPrompt(topic: any, platform: string, brand: any): string {
  return `Kamu adalah copywriter expert untuk ${brand.name}.

PRODUK: ${brand.name} — ${brand.description}. Target: ${brand.target}. URL: ${brand.url}
Tone: ${brand.tone}.

KONTEKS:
- Topik: ${topic.topic}
- Pilar: ${topic.pillar}
- Angle: ${topic.angle}
- Platform: ${platform}

ATURAN:
1. HOOK: Bikin penasaran, pancing komentar (max 100 char)
2. BODY: ${platform === 'instagram' ? '150-250 char, 1 poin kuat' : 'Sesuai platform'}
3. FOLLOW-UP QUESTION: Pertanyaan yang mendorong komentar
4. CTA: Soft-sell ke ${brand.url}
5. JANGAN pakai markdown formatting (**, *, _, ~)

OUTPUT JSON:
{
  "hook": "kalimat pembuka",
  "body": "isi konten",
  "cta": "ajakan",
  "followUpQuestion": "pertanyaan engagement",
  "hashtags": ["tag1", "tag2", "tag3"]
}`;
}

async function callGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('Gemini API key not configured');

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 1024,
          responseMimeType: 'application/json',
        },
      }),
    }
  );

  if (!res.ok) throw new Error(`Gemini HTTP ${res.status}`);
  const data = await res.json();
  return data.candidates[0].content.parts[0].text;
}

async function callMistral(prompt: string): Promise<string> {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) throw new Error('Mistral API key not configured');

  const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'mistral-small-latest',
      messages: [
        {
          role: 'system',
          content: 'Kamu copywriter expert Indonesia. Output JSON only.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.9,
      max_tokens: 1024,
      response_format: { type: 'json_object' },
    }),
  });

  if (!res.ok) throw new Error(`Mistral HTTP ${res.status}`);
  const data = await res.json();
  return data.choices[0].message.content;
}

async function callDeepSeek(prompt: string): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error('DeepSeek API key not configured');

  const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'Kamu copywriter Indonesia. Output JSON only.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.9,
      max_tokens: 1024,
      response_format: { type: 'json_object' },
    }),
  });

  if (!res.ok) throw new Error(`DeepSeek HTTP ${res.status}`);
  const data = await res.json();
  return data.choices[0].message.content;
}

function parseCopy(raw: string): any {
  try {
    // Extract JSON from response
    let json = raw.trim();
    const match = json.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) json = match[1].trim();

    const jsonMatch = json.match(/\{[\s\S]*\}/);
    if (jsonMatch) json = jsonMatch[0];

    const parsed = JSON.parse(json);

    return {
      hook: cleanText(parsed.hook || ''),
      body: cleanText(parsed.body || ''),
      cta: cleanText(parsed.cta || ''),
      followUpQuestion: cleanText(parsed.followUpQuestion || ''),
      hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags : [],
    };
  } catch (error) {
    console.error('Error parsing copy:', error);
    throw new Error('Failed to parse AI response');
  }
}

function cleanText(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/~~(.*?)~~/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}
