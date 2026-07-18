import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'IDR') {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
    ...options,
  }).format(new Date(date));
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text: string, length: number) {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getPlatformColor(platform: string) {
  const colors: Record<string, string> = {
    instagram: '#E4405F',
    youtube: '#FF0000',
    threads: '#000000',
    tiktok: '#000000',
  };
  return colors[platform] || '#6B7280';
}

export function getPlatformIcon(platform: string) {
  const icons: Record<string, string> = {
    instagram: '📸',
    youtube: '🎬',
    threads: '🧵',
    tiktok: '🎵',
  };
  return icons[platform] || '📱';
}

export function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    active: 'text-green-600 bg-green-50',
    expired: 'text-yellow-600 bg-yellow-50',
    disconnected: 'text-red-600 bg-red-50',
    draft: 'text-gray-600 bg-gray-50',
    scheduled: 'text-blue-600 bg-blue-50',
    publishing: 'text-purple-600 bg-purple-50',
    published: 'text-green-600 bg-green-50',
    failed: 'text-red-600 bg-red-50',
  };
  return colors[status] || 'text-gray-600 bg-gray-50';
}
