'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  FileText,
  TrendingUp,
  ArrowUpRight,
  Calendar,
  Clock,
  Plus,
  Sparkles,
  BarChart3,
  Zap,
  Eye,
  Heart,
  MessageCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { formatDate, getPlatformIcon, getStatusColor } from '@/lib/utils';

interface DashboardStats {
  totalClients: number;
  totalPosts: number;
  totalEngagement: number;
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
  });
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [orgsRes, postsRes] = await Promise.all([
          supabase.from('organizations').select('id', { count: 'exact' }),
          supabase
            .from('content_history')
            .select('id, engagement', { count: 'exact' }),
        ]);

        const totalClients = orgsRes.count || 0;
        const totalPosts = postsRes.count || 0;

        const totalEngagement = (postsRes.data || []).reduce((sum, post) => {
          const eng = post.engagement as any;
          return sum + (eng?.likes || 0) + (eng?.comments || 0) + (eng?.shares || 0);
        }, 0);

        setStats({
          totalClients,
          totalPosts,
          totalEngagement,
        });

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
      title: 'Total Klien',
      value: stats.totalClients,
      icon: Users,
      change: '+2 baru',
      description: 'Klien aktif',
      color: 'var(--color-primary)',
      bgColor: 'rgba(225, 29, 72, 0.1)',
    },
    {
      title: 'Konten Dipublish',
      value: stats.totalPosts,
      icon: FileText,
      change: '+12%',
      description: 'Bulan ini',
      color: 'var(--color-secondary)',
      bgColor: 'rgba(37, 99, 235, 0.1)',
    },
    {
      title: 'Total Engagement',
      value: stats.totalEngagement.toLocaleString(),
      icon: TrendingUp,
      change: '+18%',
      description: 'Interaksi',
      color: 'var(--color-success)',
      bgColor: 'rgba(16, 185, 129, 0.1)',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--color-primary)' }}></div>
          <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl p-8" style={{ background: 'var(--color-primary)' }}>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-white/80" />
            <span className="text-sm font-medium text-white/80">Selamat Datang!</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            Dashboard SocialQ
          </h1>
          <p className="text-white/80 max-w-lg">
            Kelola semua klien dan konten media sosial Anda dari satu tempat.
            Mulai tambahkan klien baru untuk memulai otomatisasi.
          </p>
          <div className="mt-4 flex gap-3">
            <Link href="/clients/new">
              <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors" style={{ color: 'var(--color-primary)' }}>
                <Plus className="h-4 w-4" />
                Tambah Klien
              </button>
            </Link>
            <Link href="/clients">
              <button className="flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-white/30 transition-colors">
                Lihat Klien
              </button>
            </Link>
          </div>
        </div>
        {/* Decorative */}
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-10">
          <div className="absolute right-10 top-10 h-32 w-32 rounded-full bg-white" />
          <div className="absolute right-20 bottom-10 h-24 w-24 rounded-full bg-white" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="rounded-xl border p-6 transition-all hover:shadow-md"
            style={{
              background: 'var(--color-surface)',
              borderColor: 'var(--color-border)'
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: stat.bgColor }}>
                <stat.icon className="h-6 w-6" style={{ color: stat.color }} />
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-full" style={{
                background: stat.bgColor,
                color: stat.color
              }}>
                {stat.change}
              </span>
            </div>
            <div className="text-3xl font-bold mb-1" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-display)' }}>
              {stat.value}
            </div>
            <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
              {stat.title} • {stat.description}
            </p>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Recent Posts */}
        <div className="lg:col-span-4 rounded-xl border" style={{
          background: 'var(--color-surface)',
          borderColor: 'var(--color-border)'
        }}>
          <div className="flex items-center justify-between p-6 pb-4">
            <div>
              <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-display)' }}>
                Konten Terbaru
              </h3>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
                Riwayat konten yang dipublish
              </p>
            </div>
            <Link href="/clients">
              <button className="text-sm font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>
                Lihat Semua
              </button>
            </Link>
          </div>
          <div className="px-6 pb-6">
            {recentPosts.length === 0 ? (
              <div className="text-center py-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl mx-auto mb-4" style={{ background: 'var(--color-surface-tertiary)' }}>
                  <FileText className="h-8 w-8" style={{ color: 'var(--color-text-tertiary)' }} />
                </div>
                <p className="font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>Belum ada konten</p>
                <p className="text-sm mb-4" style={{ color: 'var(--color-text-tertiary)' }}>
                  Tambahkan klien pertama Anda untuk mulai membuat konten
                </p>
                <Link href="/clients/new">
                  <button className="flex items-center gap-2 mx-auto px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: 'var(--color-primary)' }}>
                    <Plus className="h-4 w-4" />
                    Tambah Klien
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-4 rounded-xl border transition-colors hover:bg-gray-50"
                    style={{ borderColor: 'var(--color-border-light)' }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'var(--color-surface-tertiary)' }}>
                        <span className="text-xl">{getPlatformIcon(post.platform)}</span>
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>
                          {(post.organizations as any)?.name || 'Unknown'}
                        </p>
                        <p className="text-sm capitalize" style={{ color: 'var(--color-text-tertiary)' }}>
                          {post.platform}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{
                        background: post.status === 'published' ? 'rgba(16, 185, 129, 0.1)' :
                                   post.status === 'scheduled' ? 'rgba(37, 99, 235, 0.1)' :
                                   'rgba(148, 163, 184, 0.1)',
                        color: post.status === 'published' ? 'var(--color-success)' :
                               post.status === 'scheduled' ? 'var(--color-secondary)' :
                               'var(--color-text-tertiary)'
                      }}>
                        {post.status === 'published' ? 'Dipublish' :
                         post.status === 'scheduled' ? 'Dijadwalkan' :
                         post.status === 'draft' ? 'Draft' : post.status}
                      </span>
                      <p className="text-xs mt-1 flex items-center justify-end" style={{ color: 'var(--color-text-tertiary)' }}>
                        <Clock className="h-3 w-3 mr-1" />
                        {post.published_at
                          ? formatDate(post.published_at)
                          : post.scheduled_at
                          ? `Jadwal: ${formatDate(post.scheduled_at)}`
                          : 'Draft'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-3 space-y-6">
          <div className="rounded-xl border p-6" style={{
            background: 'var(--color-surface)',
            borderColor: 'var(--color-border)'
          }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-display)' }}>
              Aksi Cepat
            </h3>
            <div className="space-y-3">
              <Link href="/clients/new" className="block">
                <div className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:opacity-80" style={{ background: 'rgba(225, 29, 72, 0.05)' }}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'rgba(225, 29, 72, 0.1)' }}>
                    <Users className="h-5 w-5" style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>Tambah Klien Baru</p>
                    <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Setup klien dalam 5 langkah</p>
                  </div>
                </div>
              </Link>
              <Link href="/calendar" className="block">
                <div className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:opacity-80" style={{ background: 'rgba(37, 99, 235, 0.05)' }}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'rgba(37, 99, 235, 0.1)' }}>
                    <Calendar className="h-5 w-5" style={{ color: 'var(--color-secondary)' }} />
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>Lihat Kalender</p>
                    <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Jadwal posting minggu ini</p>
                  </div>
                </div>
              </Link>
              <Link href="/analytics" className="block">
                <div className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:opacity-80" style={{ background: 'rgba(16, 185, 129, 0.05)' }}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                    <BarChart3 className="h-5 w-5" style={{ color: 'var(--color-success)' }} />
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>Lihat Analitik</p>
                    <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Performa konten minggu ini</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Status */}
          <div className="rounded-xl border p-6" style={{
            background: 'var(--color-surface)',
            borderColor: 'var(--color-border)'
          }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-display)' }}>
              Status Sistem
            </h3>
            <div className="space-y-3">
              {[
                { name: 'AI Engine', status: 'Aktif', color: 'var(--color-success)' },
                { name: 'Scheduler', status: 'Berjalan', color: 'var(--color-success)' },
                { name: 'Database', status: 'Belum Terhubung', color: 'var(--color-warning)' },
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--color-surface-tertiary)' }}>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ background: item.color }} />
                    <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                      {item.name}
                    </span>
                  </div>
                  <span className="text-xs font-medium" style={{ color: item.color }}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
