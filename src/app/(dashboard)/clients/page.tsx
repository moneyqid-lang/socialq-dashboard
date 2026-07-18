'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, MoreVertical, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { getInitials, getPlatformIcon, formatDate } from '@/lib/utils';

interface Client {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  plan: string;
  status: string;
  created_at: string;
  social_accounts?: { platform: string; status: string }[];
  content_history?: { count: number }[];
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchClients() {
      try {
        const { data, error } = await supabase
          .from('organizations')
          .select(`
            *,
            social_accounts(platform, status),
            content_history(count)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setClients(data || []);
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchClients();
  }, []);

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-500">Manage your client accounts</p>
        </div>
        <Link href="/clients/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Client
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search clients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Client Grid */}
      {filteredClients.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4">
              <Plus className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {searchQuery ? 'No clients found' : 'No clients yet'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery
                ? 'Try a different search term'
                : 'Create your first client to get started'}
            </p>
            {!searchQuery && (
              <Link href="/clients/new">
                <Button>Create Client</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredClients.map((client) => (
            <Link key={client.id} href={`/clients/${client.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {client.logo_url ? (
                        <img
                          src={client.logo_url}
                          alt={client.name}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 text-white font-bold">
                          {getInitials(client.name)}
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-base">{client.name}</CardTitle>
                        <p className="text-sm text-gray-500">/{client.slug}</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 capitalize">
                      {client.plan}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Connected Platforms */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Platforms:</span>
                      <div className="flex gap-1">
                        {client.social_accounts?.length > 0 ? (
                          client.social_accounts.map((acc, i) => (
                            <span
                              key={i}
                              className={`text-lg ${
                                acc.status === 'active'
                                  ? ''
                                  : 'opacity-40'
                              }`}
                              title={`${acc.platform} (${acc.status})`}
                            >
                              {getPlatformIcon(acc.platform)}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-gray-400">
                            None connected
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        {client.content_history?.[0]?.count || 0} posts
                      </span>
                      <span className="text-gray-400">
                        {formatDate(client.created_at, { dateStyle: 'short' })}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
