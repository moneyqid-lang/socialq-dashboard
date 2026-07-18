'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Building2,
  Link2,
  Sparkles,
  FileText,
  Rocket,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { slugify } from '@/lib/utils';

// Step schemas
const brandSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  target: z.string().min(5, 'Target audience is required'),
  url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  tone: z.string().default('profesional'),
});

type BrandFormData = z.infer<typeof brandSchema>;

const steps = [
  { id: 1, name: 'Brand Info', icon: Building2, description: 'Basic brand details' },
  { id: 2, name: 'Social Media', icon: Link2, description: 'Connect accounts' },
  { id: 3, name: 'AI Setup', icon: Sparkles, description: 'Configure AI providers' },
  { id: 4, name: 'Content', icon: FileText, description: 'Content pillars & schedule' },
  { id: 5, name: 'Launch', icon: Rocket, description: 'Review & activate' },
];

export default function NewClientPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [orgId, setOrgId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<BrandFormData>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      tone: 'profesional',
    },
  });

  const brandName = watch('name');

  async function onSubmitBrand(data: BrandFormData) {
    setIsCreating(true);
    try {
      const slug = slugify(data.name);

      // Create organization
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: data.name,
          slug,
          plan: 'starter',
        })
        .select()
        .single();

      if (orgError) throw orgError;

      // Create brand profile
      const { error: brandError } = await supabase
        .from('brand_profiles')
        .insert({
          org_id: org.id,
          product_name: data.name,
          product_description: data.description,
          product_target: data.target,
          product_url: data.url || null,
          product_tone: data.tone,
        });

      if (brandError) throw brandError;

      setOrgId(org.id);
      setCurrentStep(2);
    } catch (error) {
      console.error('Error creating client:', error);
      alert('Failed to create client. Please try again.');
    } finally {
      setIsCreating(false);
    }
  }

  function handleNext() {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  }

  function handleBack() {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }

  function handleFinish() {
    if (orgId) {
      router.push(`/clients/${orgId}`);
    } else {
      router.push('/clients');
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push('/clients')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Client</h1>
          <p className="text-gray-500">Set up a new client in 5 easy steps</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex items-center gap-2 ${
                currentStep > step.id
                  ? 'text-teal-600'
                  : currentStep === step.id
                  ? 'text-gray-900'
                  : 'text-gray-400'
              }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  currentStep > step.id
                    ? 'border-teal-600 bg-teal-600 text-white'
                    : currentStep === step.id
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-300 bg-white'
                }`}
              >
                {currentStep > step.id ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              <span className="text-sm font-medium hidden sm:block">
                {step.name}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`mx-2 h-0.5 w-12 ${
                  currentStep > step.id ? 'bg-teal-600' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].name}</CardTitle>
          <CardDescription>{steps[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Step 1: Brand Info */}
          {currentStep === 1 && (
            <form onSubmit={handleSubmit(onSubmitBrand)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Brand Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., MoneyQ, BrandKu"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Product Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what the product/service does..."
                  rows={3}
                  {...register('description')}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="target">Target Audience *</Label>
                <Input
                  id="target"
                  placeholder="e.g., Anak muda Indonesia 18-35 tahun"
                  {...register('target')}
                />
                {errors.target && (
                  <p className="text-sm text-red-500">{errors.target.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">Website URL</Label>
                <Input
                  id="url"
                  placeholder="https://example.com"
                  {...register('url')}
                />
                {errors.url && (
                  <p className="text-sm text-red-500">{errors.url.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tone">Content Tone</Label>
                <select
                  id="tone"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  {...register('tone')}
                >
                  <option value="profesional">Profesional</option>
                  <option value="santai">Santai & Friendly</option>
                  <option value="edukatif">Edukatif</option>
                  <option value="humoris">Humoris</option>
                  <option value="inspiratif">Inspiratif</option>
                </select>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? 'Creating...' : 'Next Step'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          )}

          {/* Step 2: Social Media */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <p className="text-gray-500">
                Connect your social media accounts to start publishing content.
              </p>

              <div className="space-y-3">
                {[
                  {
                    platform: 'Instagram',
                    icon: '📸',
                    description: 'Post images & reels',
                    connected: false,
                  },
                  {
                    platform: 'YouTube',
                    icon: '🎬',
                    description: 'Publish Shorts',
                    connected: false,
                  },
                  {
                    platform: 'Threads',
                    icon: '🧵',
                    description: 'Text-based posts',
                    connected: false,
                  },
                  {
                    platform: 'TikTok',
                    icon: '🎵',
                    description: 'Short-form videos',
                    connected: false,
                  },
                ].map((social) => (
                  <div
                    key={social.platform}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{social.icon}</span>
                      <div>
                        <p className="font-medium text-gray-900">
                          {social.platform}
                        </p>
                        <p className="text-sm text-gray-500">
                          {social.description}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Link2 className="h-4 w-4 mr-2" />
                      Connect
                    </Button>
                  </div>
                ))}
              </div>

              <p className="text-sm text-gray-400">
                You can skip this step and connect accounts later.
              </p>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={handleNext}>
                  Next Step
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: AI Setup */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <p className="text-gray-500">
                Configure AI providers for content generation. You can use
                SocialQ's shared keys or bring your own.
              </p>

              <div className="space-y-3">
                {[
                  {
                    name: 'Gemini',
                    description: 'Google AI - Good for general content',
                    available: true,
                  },
                  {
                    name: 'Mistral',
                    description: 'Fast & affordable',
                    available: true,
                  },
                  {
                    name: 'DeepSeek',
                    description: 'Great for Indonesian content',
                    available: true,
                  },
                  {
                    name: 'Claude',
                    description: 'Anthropic - Best quality',
                    available: true,
                  },
                ].map((provider) => (
                  <div
                    key={provider.name}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {provider.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {provider.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-green-600">Available</span>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={handleNext}>
                  Next Step
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Content */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <p className="text-gray-500">
                Configure content pillars and posting schedule.
              </p>

              <div className="space-y-3">
                <Label>Content Pillars (auto-created)</Label>
                {[
                  { emoji: '💰', name: 'Tips Hemat', description: 'Money-saving tips' },
                  { emoji: '📚', name: 'Edukasi Siklus', description: 'Cycle-based budgeting' },
                  { emoji: '📊', name: 'Fakta Finansial', description: 'Financial facts' },
                  { emoji: '✨', name: 'Before/After', description: 'Transformations' },
                  { emoji: '🎯', name: 'Challenge', description: 'Engagement challenges' },
                  { emoji: '🎬', name: 'Behind Product', description: 'Product stories' },
                ].map((pillar) => (
                  <div
                    key={pillar.name}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200"
                  >
                    <span className="text-xl">{pillar.emoji}</span>
                    <div>
                      <p className="font-medium text-gray-900">{pillar.name}</p>
                      <p className="text-sm text-gray-500">
                        {pillar.description}
                      </p>
                    </div>
                    <Check className="h-4 w-4 text-green-600 ml-auto" />
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label>Posting Schedule (WIB)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { platform: 'Instagram', times: '07:00, 10:00, 14:00, 18:00, 20:00' },
                    { platform: 'YouTube', times: '11:00, 17:00' },
                  ].map((schedule) => (
                    <div
                      key={schedule.platform}
                      className="p-3 rounded-lg border border-gray-200"
                    >
                      <p className="font-medium text-gray-900">
                        {schedule.platform}
                      </p>
                      <p className="text-sm text-gray-500">{schedule.times}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={handleNext}>
                  Next Step
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 5: Launch */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center py-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 mx-auto mb-4">
                  <Rocket className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Ready to Launch!
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Your client <strong>{brandName || 'New Client'}</strong> is
                  ready to start generating and publishing content
                  automatically.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <h4 className="font-medium text-gray-900">Summary</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✅ Brand profile created</li>
                  <li>✅ 6 content pillars configured</li>
                  <li>✅ Posting schedule set (7 posts/day)</li>
                  <li>✅ AI providers ready</li>
                  <li>⚠️ Social accounts not connected yet</li>
                </ul>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={handleFinish}>
                  <Check className="mr-2 h-4 w-4" />
                  Finish & Go to Client
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
