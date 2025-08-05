import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MetricCard } from '@/components/MetricCard';
import { RevenueChart, SalesChart, TrafficChart, ConversionChart } from '@/components/DashboardCharts';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  ShoppingCart,
  Calendar,
  RefreshCw,
  Filter,
  Eye,
  EyeOff,
  Download
} from 'lucide-react';

interface AnalyticsData {
  id: string;
  metric_name: string;
  metric_value: number;
  metric_data: any;
  date_recorded: string;
  source_id: string;
}

interface DataSource {
  id: string;
  name: string;
  type: string;
  status: string;
}

const AnalyticsPage = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedMetric, setSelectedMetric] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('7d');
  const [visibleCharts, setVisibleCharts] = useState({
    revenue: true,
    sales: true,
    traffic: true,
    conversion: true
  });
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch connected data sources
      const { data: sources, error: sourcesError } = await supabase
        .from('data_sources')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'connected');

      if (sourcesError) throw sourcesError;
      setDataSources(sources || []);

      // Fetch analytics data
      const { data: analytics, error: analyticsError } = await supabase
        .from('analytics_data')
        .select('*')
        .eq('user_id', user?.id)
        .order('date_recorded', { ascending: false })
        .limit(100);

      if (analyticsError) throw analyticsError;
      
      // If no real data exists, generate some sample data for demonstration
      if (!analytics || analytics.length === 0) {
        await generateSampleData();
      } else {
        setAnalyticsData(analytics);
      }

    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSampleData = async () => {
    // Generate sample analytics data only if user has connected sources
    if (dataSources.length === 0) {
      setAnalyticsData([]);
      return;
    }

    const sampleMetrics = [
      'total_revenue', 'monthly_revenue', 'user_count', 'conversion_rate',
      'page_views', 'session_duration', 'bounce_rate', 'new_users',
      'returning_users', 'cart_abandonment', 'avg_order_value'
    ];

    const sampleData: Partial<AnalyticsData>[] = [];
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      sampleMetrics.forEach(metric => {
        const value = Math.random() * 1000 + 100;
        sampleData.push({
          metric_name: metric,
          metric_value: Math.round(value),
          metric_data: JSON.stringify({
            trend: Math.random() > 0.5 ? 'up' : 'down',
            change: Math.round((Math.random() - 0.5) * 20 * 100) / 100
          }),
          date_recorded: date.toISOString().split('T')[0],
          source_id: dataSources[Math.floor(Math.random() * dataSources.length)]?.id
        });
      });
    }

    try {
      const { error } = await supabase
        .from('analytics_data')
        .insert(sampleData.map(item => ({
          user_id: user?.id!,
          metric_name: item.metric_name!,
          metric_value: item.metric_value!,
          metric_data: item.metric_data,
          date_recorded: item.date_recorded!,
          source_id: item.source_id!
        })));

      if (error) throw error;
      
      // Refetch the data
      const { data: analytics } = await supabase
        .from('analytics_data')
        .select('*')
        .eq('user_id', user?.id)
        .order('date_recorded', { ascending: false })
        .limit(100);

      setAnalyticsData(analytics || []);
    } catch (error) {
      console.error('Error generating sample data:', error);
    }
  };

  const getMetricValue = (metricName: string) => {
    const metrics = analyticsData.filter(d => d.metric_name === metricName);
    if (metrics.length === 0) return 0;
    
    return metrics.reduce((sum, metric) => sum + metric.metric_value, 0) / metrics.length;
  };

  const getMetricTrend = (metricName: string) => {
    const metrics = analyticsData
      .filter(d => d.metric_name === metricName)
      .sort((a, b) => new Date(b.date_recorded).getTime() - new Date(a.date_recorded).getTime());
    
    if (metrics.length < 2) return null;
    
    const current = metrics[0].metric_value;
    const previous = metrics[1].metric_value;
    const change = ((current - previous) / previous) * 100;
    
    return {
      value: Math.round(Math.abs(change) * 100) / 100,
      label: change > 0 ? 'vs last period' : 'vs last period'
    };
  };

  const filteredData = analyticsData.filter(data => {
    const matchesSource = selectedSource === 'all' || data.source_id === selectedSource;
    const matchesMetric = selectedMetric === 'all' || data.metric_name === selectedMetric;
    
    // Date range filtering
    const dataDate = new Date(data.date_recorded);
    const today = new Date();
    const daysBack = parseInt(dateRange.replace('d', ''));
    const cutoffDate = new Date(today);
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);
    
    const inDateRange = dataDate >= cutoffDate;
    
    return matchesSource && matchesMetric && inDateRange;
  });

  const toggleChartVisibility = (chartName: keyof typeof visibleCharts) => {
    setVisibleCharts(prev => ({
      ...prev,
      [chartName]: !prev[chartName]
    }));
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  // Show message if no data sources are connected
  if (dataSources.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
            <p className="text-muted-foreground">
              Real-time analytics and insights from your connected data sources
            </p>
          </div>
        </div>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No Data Sources Connected</h3>
            <p className="text-muted-foreground text-center mb-4">
              Connect your data sources to start viewing real-time analytics and insights.
            </p>
            <Button onClick={() => window.location.href = '/data-sources'}>
              Connect Data Sources
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">
            Real-time analytics and insights from your connected data sources
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters & Controls</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Data Source</label>
              <Select value={selectedSource} onValueChange={setSelectedSource}>
                <SelectTrigger>
                  <SelectValue placeholder="All sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All sources</SelectItem>
                  {dataSources.map(source => (
                    <SelectItem key={source.id} value={source.id}>
                      {source.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Metric</label>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger>
                  <SelectValue placeholder="All metrics" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All metrics</SelectItem>
                  <SelectItem value="total_revenue">Total Revenue</SelectItem>
                  <SelectItem value="user_count">User Count</SelectItem>
                  <SelectItem value="conversion_rate">Conversion Rate</SelectItem>
                  <SelectItem value="page_views">Page Views</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Last 7 days" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="365d">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium">Chart Visibility:</span>
            {Object.entries(visibleCharts).map(([chartName, isVisible]) => (
              <Button
                key={chartName}
                variant="outline"
                size="sm"
                onClick={() => toggleChartVisibility(chartName as keyof typeof visibleCharts)}
                className="flex items-center space-x-1"
              >
                {isVisible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                <span className="capitalize">{chartName}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={`$${Math.round(getMetricValue('total_revenue')).toLocaleString()}`}
          description="Total revenue across all sources"
          trend={getMetricTrend('total_revenue')}
          icon={DollarSign}
        />
        <MetricCard
          title="Total Users"
          value={Math.round(getMetricValue('user_count')).toLocaleString()}
          description="Active users this period"
          trend={getMetricTrend('user_count')}
          icon={Users}
        />
        <MetricCard
          title="Conversion Rate"
          value={`${(getMetricValue('conversion_rate') / 100).toFixed(2)}%`}
          description="Average conversion rate"
          trend={getMetricTrend('conversion_rate')}
          icon={TrendingUp}
        />
        <MetricCard
          title="Page Views"
          value={Math.round(getMetricValue('page_views')).toLocaleString()}
          description="Total page views"
          trend={getMetricTrend('page_views')}
          icon={BarChart3}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {visibleCharts.revenue && <RevenueChart />}
        {visibleCharts.sales && <SalesChart />}
        {visibleCharts.traffic && <TrafficChart />}
        {visibleCharts.conversion && <ConversionChart />}
      </div>

      {/* Data Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Data Summary</CardTitle>
          <CardDescription>Overview of your analytics data collection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{filteredData.length}</p>
              <p className="text-sm text-muted-foreground">Data Points</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{dataSources.length}</p>
              <p className="text-sm text-muted-foreground">Connected Sources</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {new Set(analyticsData.map(d => d.metric_name)).size}
              </p>
              <p className="text-sm text-muted-foreground">Unique Metrics</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {analyticsData.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No Analytics Data</h3>
            <p className="text-muted-foreground text-center mb-4">
              Your connected data sources haven't generated analytics data yet. 
              Data will appear here once your sources start syncing.
            </p>
            <Button onClick={generateSampleData}>
              Generate Sample Data
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnalyticsPage;