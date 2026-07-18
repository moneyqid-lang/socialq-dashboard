'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Calendar,
  BarChart3,
  Settings,
  Plus,
  User,
  Sparkles,
  Bell,
  Search,
  Home,
  FileText,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Beranda', href: '/dashboard', icon: Home },
  { name: 'Klien', href: '/clients', icon: Users },
  { name: 'Kalender', href: '/calendar', icon: Calendar },
  { name: 'Analitik', href: '/analytics', icon: BarChart3 },
  { name: 'Konten', href: '/content', icon: FileText },
  { name: 'Pengaturan', href: '/settings', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen" style={{ background: 'var(--color-surface-secondary)' }}>
      {/* Sidebar */}
      <aside className="hidden w-72 flex-col border-r lg:flex" style={{
        background: 'var(--color-surface)',
        borderColor: 'var(--color-border)'
      }}>
        {/* Logo */}
        <div className="flex h-20 items-center border-b px-6" style={{ borderColor: 'var(--color-border)' }}>
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'var(--color-primary)' }}>
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
                SocialQ
              </span>
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                Otomatisasi Media Sosial
              </p>
            </div>
          </Link>
        </div>

        {/* Search */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-2 rounded-lg px-3 py-2.5" style={{
            background: 'var(--color-surface-tertiary)',
            color: 'var(--color-text-tertiary)'
          }}>
            <Search className="h-4 w-4" />
            <span className="text-sm">Cari klien atau konten...</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-2">
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>
            Menu Utama
          </p>
          {navigation.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                  isActive ? 'text-white' : 'hover:bg-gray-100'
                )}
                style={isActive ? {
                  background: 'var(--color-primary)',
                  color: 'white'
                } : {
                  color: 'var(--color-text-secondary)'
                }}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Quick Actions */}
        <div className="border-t p-4" style={{ borderColor: 'var(--color-border)' }}>
          <Link
            href="/clients/new"
            className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: 'var(--color-primary)' }}
          >
            <Plus className="h-4 w-4" />
            Tambah Klien Baru
          </Link>
        </div>

        {/* User */}
        <div className="border-t p-4" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-3 rounded-lg p-3" style={{ background: 'var(--color-surface-tertiary)' }}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full font-bold text-white" style={{ background: 'var(--color-accent)' }}>
              A
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>
                Admin
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                Mode Demo
              </p>
            </div>
            <button className="rounded-lg p-1.5 hover:bg-gray-200 transition-colors">
              <Settings className="h-4 w-4" style={{ color: 'var(--color-text-tertiary)' }} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-1 flex-col lg:hidden">
        <header className="flex h-16 items-center justify-between border-b px-4" style={{
          background: 'var(--color-surface)',
          borderColor: 'var(--color-border)'
        }}>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: 'var(--color-primary)' }}>
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>SocialQ</span>
          </Link>
          <div className="flex items-center gap-2">
            <button className="rounded-lg p-2 hover:bg-gray-100 transition-colors">
              <Bell className="h-5 w-5" style={{ color: 'var(--color-text-secondary)' }} />
            </button>
            <Link
              href="/clients/new"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-white"
              style={{ background: 'var(--color-primary)' }}
            >
              <Plus className="h-4 w-4" />
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>

      {/* Main content */}
      <main className="hidden flex-1 flex-col overflow-auto lg:flex">
        {/* Top bar */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b px-6" style={{
          background: 'var(--color-surface)',
          borderColor: 'var(--color-border)'
        }}>
          <div>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-display)' }}>
              {navigation.find(
                (n) =>
                  pathname === n.href ||
                  (n.href !== '/' && pathname.startsWith(n.href))
              )?.name || 'Beranda'}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button className="rounded-lg p-2 hover:bg-gray-100 transition-colors relative">
              <Bell className="h-5 w-5" style={{ color: 'var(--color-text-secondary)' }} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full" style={{ background: 'var(--color-error)' }} />
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </div>
      </main>
    </div>
  );
}
