import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataSourceCard } from '@/components/DataSourceCard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Search, 
  Filter,
  RefreshCw,
  Database,
  TrendingUp
} from 'lucide-react';

interface DataSource {
  id: string;
  name: string;
  type: string;
  status: string;
  last_sync?: string;
  user_id: string;
  config: any;
  created_at: string;
  updated_at: string;
}

const AVAILABLE_SOURCES = [
  { type: 'salesforce', name: 'Salesforce', icon: '🏢', category: 'CRM' },
  { type: 'hubspot', name: 'HubSpot', icon: '🟠', category: 'CRM' },
  { type: 'shopify', name: 'Shopify', icon: '🛒', category: 'E-commerce' },
  { type: 'stripe', name: 'Stripe', icon: '💳', category: 'Payments' },
  { type: 'google_analytics', name: 'Google Analytics', icon: '📊', category: 'Analytics' },
  { type: 'facebook_ads', name: 'Facebook Ads', icon: '📘', category: 'Advertising' },
  { type: 'mailchimp', name: 'Mailchimp', icon: '📧', category: 'Email Marketing' },
  { type: 'quickbooks', name: 'QuickBooks', icon: '📋', category: 'Accounting' },
  { type: 'paypal', name: 'PayPal', icon: '💰', category: 'Payments' },
  { type: 'instagram', name: 'Instagram', icon: '📷', category: 'Social Media' },
  { type: 'linkedin', name: 'LinkedIn', icon: '💼', category: 'Social Media' },
  { type: 'twitter', name: 'Twitter', icon: '🐦', category: 'Social Media' },
];

const DataSourcesPage = () => {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchDataSources();
    }
  }, [user]);

  const fetchDataSources = async () => {
    try {
      const { data, error } = await supabase
        .from('data_sources')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDataSources(data || []);
    } catch (error) {
      console.error('Error fetching data sources:', error);
      toast({
        title: "Error",
        description: "Failed to load data sources",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (sourceType: string) => {
    try {
      const sourceInfo = AVAILABLE_SOURCES.find(s => s.type === sourceType);
      if (!sourceInfo) return;

      // Check if already connected
      const existing = dataSources.find(ds => ds.type === sourceType);
      if (existing) {
        if (existing.status === 'connected') {
          // Disconnect
          await supabase
            .from('data_sources')
            .update({ status: 'disconnected', last_sync: null })
            .eq('id', existing.id);
          
          toast({
            title: "Disconnected",
            description: `${sourceInfo.name} has been disconnected`,
          });
        } else {
          // Reconnect
          await supabase
            .from('data_sources')
            .update({ 
              status: 'connected', 
              last_sync: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('id', existing.id);
          
          toast({
            title: "Connected",
            description: `${sourceInfo.name} has been connected successfully`,
          });
        }
      } else {
        // Create new connection
        await supabase
          .from('data_sources')
          .insert({
            user_id: user?.id,
            name: sourceInfo.name,
            type: sourceType,
            status: 'connected',
            last_sync: new Date().toISOString(),
            config: {}
          });
        
        toast({
          title: "Connected",
          description: `${sourceInfo.name} has been connected successfully`,
        });
      }

      await fetchDataSources();
    } catch (error) {
      console.error('Error connecting data source:', error);
      toast({
        title: "Error",
        description: "Failed to connect data source",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = async (sourceId: string) => {
    try {
      await supabase
        .from('data_sources')
        .update({ 
          status: 'syncing',
          updated_at: new Date().toISOString()
        })
        .eq('id', sourceId);

      await fetchDataSources();

      // Simulate sync process
      setTimeout(async () => {
        await supabase
          .from('data_sources')
          .update({ 
            status: 'connected',
            last_sync: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', sourceId);

        await fetchDataSources();
        
        toast({
          title: "Sync Complete",
          description: "Data source has been synced successfully",
        });
      }, 3000);

    } catch (error) {
      console.error('Error refreshing data source:', error);
      toast({
        title: "Error",
        description: "Failed to refresh data source",
        variant: "destructive",
      });
    }
  };

  const filteredSources = AVAILABLE_SOURCES.filter(source => {
    const matchesSearch = source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         source.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || source.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const getFilteredConnectedSources = () => {
    return dataSources.filter(ds => {
      const matchesStatus = statusFilter === 'all' || ds.status === statusFilter;
      const matchesSearch = ds.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Data Sources</h1>
          <p className="text-muted-foreground">
            Connect your business tools to start analyzing your data
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={fetchDataSources}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh All
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <Database className="h-8 w-8 text-primary mr-4" />
            <div>
              <p className="text-2xl font-bold">{dataSources.filter(ds => ds.status === 'connected').length}</p>
              <p className="text-sm text-muted-foreground">Connected Sources</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <TrendingUp className="h-8 w-8 text-green-500 mr-4" />
            <div>
              <p className="text-2xl font-bold">{dataSources.filter(ds => ds.last_sync).length}</p>
              <p className="text-sm text-muted-foreground">Recently Synced</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Plus className="h-8 w-8 text-blue-500 mr-4" />
            <div>
              <p className="text-2xl font-bold">{AVAILABLE_SOURCES.length - dataSources.length}</p>
              <p className="text-sm text-muted-foreground">Available Sources</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search data sources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  <SelectItem value="CRM">CRM</SelectItem>
                  <SelectItem value="E-commerce">E-commerce</SelectItem>
                  <SelectItem value="Payments">Payments</SelectItem>
                  <SelectItem value="Analytics">Analytics</SelectItem>
                  <SelectItem value="Advertising">Advertising</SelectItem>
                  <SelectItem value="Email Marketing">Email Marketing</SelectItem>
                  <SelectItem value="Accounting">Accounting</SelectItem>
                  <SelectItem value="Social Media">Social Media</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="connected">Connected</SelectItem>
                  <SelectItem value="disconnected">Disconnected</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="syncing">Syncing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connected Sources */}
      {dataSources.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Connected Sources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredConnectedSources().map((dataSource) => (
              <DataSourceCard
                key={dataSource.id}
                dataSource={{
                  id: dataSource.id,
                  name: dataSource.name,
                  type: dataSource.type,
                  status: dataSource.status as 'connected' | 'disconnected' | 'error' | 'syncing',
                  lastSync: dataSource.last_sync || undefined
                }}
                onConnect={handleConnect}
                onRefresh={handleRefresh}
              />
            ))}
          </div>
        </div>
      )}

      {/* Available Sources */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Sources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSources.map((source) => {
            const connected = dataSources.find(ds => ds.type === source.type);
            return (
              <DataSourceCard
                key={source.type}
                dataSource={{
                  id: connected?.id || source.type,
                  name: source.name,
                  type: source.type,
                  status: (connected?.status as 'connected' | 'disconnected' | 'error' | 'syncing') || 'disconnected',
                  lastSync: connected?.last_sync || undefined
                }}
                onConnect={handleConnect}
                onRefresh={handleRefresh}
              />
            );
          })}
        </div>
      </div>

      {filteredSources.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Database className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No data sources found</h3>
            <p className="text-muted-foreground text-center">
              Try adjusting your search or filters to find the data sources you're looking for.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DataSourcesPage;