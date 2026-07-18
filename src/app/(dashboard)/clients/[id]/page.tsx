'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Settings,
  FileText,
  BarChart3,
  Calendar,
  Plus,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { formatDate, getPlatformIcon, getStatusColor, getInitials } from '@/lib/utils';

interface ClientDetail {
  org: any;
  brand: any;
  socialAccounts: any[];
  pillars: any[];
  schedules: any[];
  recentContent: any[];
  stats: {
    totalPosts: number;
    publishedPosts: number;
    scheduledPosts: number;
    failedPosts: number;
  };
}

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;

  const [client, setClient] = useState<ClientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    async function fetchClient() {
      try {
        // Fetch org
        const { data: org } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', clientId)
          .single();

        if (!org) {
          router.push('/clients');
          return;
        }

        // Fetch related data in parallel
        const [brandRes, accountsRes, pillarsRes, schedulesRes, contentRes] =
          await Promise.all([
            supabase.from('brand_profiles').select('*').eq('org_id', clientId).single(),
            supabase.from('social_accounts').select('*').eq('org_id', clientId),
            supabase.from('content_pillars').select('*').eq('org_id', clientId),
            supabase.from('posting_schedules').select('*').eq('org_id', clientId),
            supabase
              .from('content_history')
              .select('*')
              .eq('org_id', clientId)
              .order('created_at', { ascending: false })
              .limit(10),
          ]);

        // Calculate stats
        const { count: totalPosts } = await supabase
          .from('content_history')
          .select('id', { count: 'exact' })
          .eq('org_id', clientId);

        const { count: publishedPosts } = await supabase
          .from('content_history')
          .select('id', { count: 'exact' })
          .eq('org_id', clientId)
          .eq('status', 'published');

        const { count: scheduledPosts } = await supabase
          .from('content_history')
          .select('id', { count: 'exact' })
          .eq('org_id', clientId)
          .eq('status', 'scheduled');

        const { count: failedPosts } = await supabase
          .from('content_history')
          .select('id', { count: 'exact' })
          .eq('org_id', clientId)
          .eq('status', 'failed');

        setClient({
          org,
          brand: brandRes.data,
          socialAccounts: accountsRes.data || [],
          pillars: pillarsRes.data || [],
          schedules: schedulesRes.data || [],
          recentContent: contentRes.data || [],
          stats: {
            totalPosts: totalPosts || 0,
            publishedPosts: publishedPosts || 0,
            scheduledPosts: scheduledPosts || 0,
            failedPosts: failedPosts || 0,
          },
        });
      } catch (error) {
        console.error('Error fetching client:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchClient();
  }, [clientId, router]);

  async function handleGenerate() {
    setGenerating(true);
    try {
      // TODO: Trigger content generation
      alert('Content generation triggered! Check back in a few minutes.');
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setGenerating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!client) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push('/clients')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            {client.org.logo_url ? (
              <img
                src={client.org.logo_url}
                alt={client.org.name}
                className="h-12 w-12 rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 text-white font-bold text-lg">
                {getInitials(client.org.name)}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {client.org.name}
              </h1>
              <p className="text-gray-500">
                {client.brand?.product_description || 'No description'}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleGenerate} disabled={generating}>
            <RefreshCw className={`h-4 w-4 mr-2 ${generating ? 'animate-spin' : ''}`} />
            {generating ? 'Generating...' : 'Generate Content'}
          </Button>
          <Link href={`/clients/${clientId}/settings`}>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Posts
            </CardTitle>
            <FileText className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{client.stats.totalPosts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Published
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {client.stats.publishedPosts}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Scheduled
            </CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {client.stats.scheduledPosts}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Failed
            </CardTitle>
            <FileText className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {client.stats.failedPosts}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Connected Platforms */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Connected Platforms</CardTitle>
              <Link href={`/clients/${clientId}/settings`}>
                <Button variant="ghost" size="sm">
                  Manage
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {client.socialAccounts.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <p className="mb-2">No platforms connected</p>
                <Link href={`/clients/${clientId}/settings`}>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Connect Platform
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {client.socialAccounts.map((account) => (
                  <div
                    key={account.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {getPlatformIcon(account.platform)}
                      </span>
                      <div>
                        <p className="font-medium capitalize">
                          {account.platform}
                        </p>
                        <p className="text-sm text-gray-500">
                          @{account.account_username || account.account_name}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        account.status
                      )}`}
                    >
                      {account.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Content Pillars */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Content Pillars</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {client.pillars.map((pillar) => (
                <div
                  key={pillar.id}
                  className={`p-3 rounded-lg border ${
                    pillar.is_active
                      ? 'border-gray-200 bg-white'
                      : 'border-gray-100 bg-gray-50 opacity-50'
                  }`}
                >
                  <span className="text-lg">{pillar.emoji}</span>
                  <p className="font-medium text-sm mt-1">{pillar.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Recent Content</CardTitle>
            <Link href={`/clients/${clientId}/content`}>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {client.recentContent.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No content yet</p>
              <p className="text-sm">
                Click "Generate Content" to create your first post
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {client.recentContent.map((content) => (
                <div
                  key={content.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {getPlatformIcon(content.platform)}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">
                        {content.copy?.hook?.slice(0, 60) || 'No hook'}...
                      </p>
                      <p className="text-sm text-gray-500 capitalize">
                        {content.platform} • {content.content_type}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        content.status
                      )}`}
                    >
                      {content.status}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">
                      {content.published_at
                        ? formatDate(content.published_at)
                        : content.scheduled_at
                        ? formatDate(content.scheduled_at)
                        : formatDate(content.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
