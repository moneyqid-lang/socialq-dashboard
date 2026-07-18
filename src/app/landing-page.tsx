import Link from 'next/link';
import {
  ArrowRight,
  Check,
  Zap,
  Calendar,
  BarChart3,
  Globe,
  Sparkles,
  Shield,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: Sparkles,
    title: 'AI Content Generation',
    description:
      'Generate engaging captions, hooks, and CTAs using multiple AI providers (Gemini, Mistral, DeepSeek, Claude).',
  },
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description:
      'Schedule posts at optimal times for each platform. Auto-publish across Instagram, YouTube, Threads, and TikTok.',
  },
  {
    icon: Zap,
    title: 'Multi-Platform Publishing',
    description:
      'Publish to all major social platforms from one dashboard. No more switching between apps.',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description:
      'Track engagement, growth, and performance across all platforms in one unified view.',
  },
  {
    icon: Globe,
    title: 'Multi-Client Management',
    description:
      'Manage multiple brands and clients from a single account. Perfect for agencies.',
  },
  {
    icon: Shield,
    title: 'Auto Token Refresh',
    description:
      'Never lose connection. Tokens are automatically refreshed before they expire.',
  },
];

const pricing = [
  {
    name: 'Starter',
    price: 'Rp 149rb',
    period: '/bulan',
    description: 'Perfect for personal brands',
    features: [
      '1 Client',
      '1 Platform',
      '12 posts/month',
      'Basic AI',
      'Email support',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Growth',
    price: 'Rp 349rb',
    period: '/bulan',
    description: 'For growing businesses',
    features: [
      '5 Clients',
      '3 Platforms',
      '30 posts/month',
      'Advanced AI',
      'Video generation',
      'Analytics',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Agency',
    price: 'Rp 999rb',
    period: '/bulan',
    description: 'For agencies & teams',
    features: [
      'Unlimited clients',
      'All platforms',
      'Unlimited posts',
      'Custom AI',
      'White-label',
      'API access',
      'Dedicated support',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

const faqs = [
  {
    question: 'How does the AI content generation work?',
    answer:
      'SocialQ uses multiple AI providers (Gemini, Mistral, DeepSeek, Claude) to generate engaging social media content. You provide your brand details and content pillars, and the AI creates captions, hooks, and CTAs tailored to your audience.',
  },
  {
    question: 'Which social platforms are supported?',
    answer:
      'We currently support Instagram, YouTube Shorts, Threads, and TikTok. We\'re constantly adding new platforms based on user feedback.',
  },
  {
    question: 'Can I manage multiple clients?',
    answer:
      'Yes! SocialQ is designed for agencies and freelancers who manage multiple brands. Each client gets their own workspace with separate content pillars, schedules, and analytics.',
  },
  {
    question: 'Is there a free trial?',
    answer:
      'Yes, all plans come with a 14-day free trial. No credit card required to start.',
  },
  {
    question: 'How does token auto-refresh work?',
    answer:
      'SocialQ automatically refreshes your social media API tokens before they expire. This ensures your scheduled posts always go through without manual intervention.',
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-1.5 text-sm text-teal-700 mb-6">
            <Sparkles className="h-4 w-4" />
            AI-Powered Social Media Automation
          </div>
          <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Generate & Publish Content{' '}
            <span className="text-teal-600">Automatically</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            SocialQ uses AI to create engaging social media content and publish
            it across Instagram, YouTube, Threads, and TikTok — all on
            autopilot.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Everything you need to automate social media
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Powerful features designed for content creators, UMKM, and
              agencies.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100">
                    <feature.icon className="h-6 w-6 text-teal-600" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Choose the plan that fits your needs. All plans include a 14-day
              free trial.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {pricing.map((plan) => (
              <Card
                key={plan.name}
                className={plan.popular ? 'border-teal-500 shadow-lg' : ''}
              >
                {plan.popular && (
                  <div className="rounded-t-xl bg-teal-600 py-1 text-center text-sm font-medium text-white">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-gray-500">{plan.period}</span>
                  </div>
                  <p className="text-sm text-gray-500">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Check className="h-4 w-4 text-teal-600" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/register">
                    <Button
                      className="w-full"
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Can't find what you're looking for? Contact our support team.
            </p>
          </div>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-lg border border-gray-200 p-6"
              >
                <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                <p className="mt-2 text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-teal-600 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white">
            Ready to automate your social media?
          </h2>
          <p className="mt-4 text-lg text-teal-100">
            Join thousands of content creators who save hours every week with
            SocialQ.
          </p>
          <div className="mt-8">
            <Link href="/register">
              <Button size="lg" variant="secondary">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
