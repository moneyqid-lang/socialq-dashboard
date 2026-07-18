'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  FileText,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  Calendar,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { formatDate, getPlatformIcon, getStatusColor } from '@/lib/utils';

interface DashboardStats {
  totalClients: number;
  totalPosts: number;
  totalEngagement: number;
  revenue: number;
}

interface RecentPost {
  id: string;
  platform: string;
  status: string;
  published_at: string | null;
  scheduled_at: string | null;
  organizations: { name: string };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    totalPosts: 0,
    totalEngagement: 0,
    revenue: 0,
  });
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch stats
        const [orgsRes, postsRes] = await Promise.all([
          supabase.from('organizations').select('id', { count: 'exact' }),
          supabase
            .from('content_history')
            .select('id, engagement', { count: 'exact' }),
        ]);

        const totalClients = orgsRes.count || 0;
        const totalPosts = postsRes.count || 0;

        // Calculate total engagement
        const totalEngagement = (postsRes.data || []).reduce((sum, post) => {
          const eng = post.engagement as any;
          return sum + (eng?.likes || 0) + (eng?.comments || 0) + (eng?.shares || 0);
        }, 0);

        setStats({
          totalClients,
          totalPosts,
          totalEngagement,
          revenue: 0, // TODO: Calculate from subscriptions
        });

        // Fetch recent posts
        const { data: posts } = await supabase
          .from('content_history')
          .select('id, platform, status, published_at, scheduled_at, organizations(name)')
          .order('created_at', { ascending: false })
          .limit(5);

        setRecentPosts(posts || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Total Clients',
      value: stats.totalClients,
      icon: Users,
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      title: 'Posts Published',
      value: stats.totalPosts,
      icon: FileText,
      change: '+23%',
      changeType: 'positive' as const,
    },
    {
      title: 'Total Engagement',
      value: stats.totalEngagement.toLocaleString(),
      icon: TrendingUp,
      change: '+18%',
      changeType: 'positive' as const,
    },
    {
      title: 'Revenue',
      value: `Rp ${(stats.revenue / 1000000).toFixed(1)}M`,
      icon: DollarSign,
      change: '+8%',
      changeType: 'positive' as const,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back! Here's what's happening.</p>
        </div>
        <Link href="/clients/new">
          <Button>
            <Users className="mr-2 h-4 w-4" />
            New Client
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Posts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Posts</CardTitle>
          </CardHeader>
          <CardContent>
            {recentPosts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No posts yet</p>
                <p className="text-sm">Create your first client to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getPlatformIcon(post.platform)}</span>
                      <div>
                        <p className="font-medium text-gray-900">
                          {(post.organizations as any)?.name || 'Unknown'}
                        </p>
                        <p className="text-sm text-gray-500 capitalize">
                          {post.platform}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          post.status
                        )}`}
                      >
                        {post.status}
                      </span>
                      <p className="text-xs text-gray-400 mt-1 flex items-center justify-end">
                        <Clock className="h-3 w-3 mr-1" />
                        {post.published_at
                          ? formatDate(post.published_at)
                          : post.scheduled_at
                          ? `Scheduled: ${formatDate(post.scheduled_at)}`
                          : 'Draft'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Mock data - replace with real scheduled posts */}
              {[
                {
                  time: 'Today, 14:00',
                  client: 'Brand A',
                  platform: 'instagram',
                  topic: 'Tips Hemat',
                },
                {
                  time: 'Today, 17:00',
                  client: 'Brand B',
                  platform: 'youtube',
                  topic: 'Edukasi Siklus',
                },
                {
                  time: 'Tomorrow, 07:00',
                  client: 'Brand A',
                  platform: 'instagram',
                  topic: 'Fakta Finansial',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 rounded-lg border border-gray-100"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                    <Calendar className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {item.client} • {getPlatformIcon(item.platform)}{' '}
                      {item.platform}
                    </p>
                    <p className="text-sm text-gray-500">{item.topic}</p>
                  </div>
                  <span className="text-sm text-gray-400">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
