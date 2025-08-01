import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { MetricCard } from '@/components/MetricCard';
import { AIChat } from '@/components/AIChat';
import { RevenueChart, SalesChart, TrafficChart, ConversionChart } from '@/components/DashboardCharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';

interface Insight {
  id: string;
  type: 'anomaly' | 'trend' | 'forecast' | 'benchmark' | 'recommendation';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    // Simulate loading insights
    setInsights([
      {
        id: '1',
        type: 'anomaly',
        title: 'Unusual Traffic Spike',
        description: 'Website traffic increased by 150% in the last 24 hours',
        severity: 'medium',
        timestamp: new Date()
      },
      {
        id: '2',
        type: 'recommendation',
        title: 'Optimize Email Campaign',
        description: 'Your email open rates could improve by 25% with better timing',
        severity: 'low',
        timestamp: new Date()
      },
      {
        id: '3',
        type: 'trend',
        title: 'Revenue Growth',
        description: 'Monthly recurring revenue is trending upward by 12%',
        severity: 'low',
        timestamp: new Date()
      }
    ]);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'anomaly': return AlertTriangle;
      case 'recommendation': return Target;
      case 'trend': return TrendingUp;
      default: return CheckCircle;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h1 className="text-3xl font-bold mb-2 text-foreground">
          Welcome back, {user?.email?.split('@')[0]}! 👋
        </h1>
        <p className="text-muted-foreground">
          Here's your business overview for today. Your revenue is up 15% this month!
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Revenue"
          value="$45,231"
          description="All time revenue"
          trend={{ value: 15, label: 'vs last month' }}
          icon={DollarSign}
        />
        <MetricCard
          title="Active Users"
          value="2,350"
          description="Monthly active users"
          trend={{ value: 8, label: 'vs last month' }}
          icon={Users}
        />
        <MetricCard
          title="Conversion Rate"
          value="3.24%"
          description="Visitor to customer rate"
          trend={{ value: -2, label: 'vs last month' }}
          icon={Target}
        />
        <MetricCard
          title="Avg Order Value"
          value="$89.50"
          description="Average per transaction"
          trend={{ value: 12, label: 'vs last month' }}
          icon={ShoppingCart}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-6">
          <RevenueChart />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SalesChart />
            <TrafficChart />
          </div>
          
          <ConversionChart />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* AI Chat */}
          <AIChat className="h-56" />
          
          {/* Recent Insights */}
          <Card className="mt-12">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Recent Insights</span>
              </CardTitle>
              <CardDescription>
                AI-generated insights from your data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              {insights.map((insight) => {
                const InsightIcon = getInsightIcon(insight.type);
                return (
                  <div
                    key={insight.id}
                    className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="p-1 bg-background rounded">
                      <InsightIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 space-y-1">
                                           <div className="flex items-center space-x-2">
                       <h4 className="text-sm font-medium text-foreground">{insight.title}</h4>
                       <Badge variant={getSeverityColor(insight.severity) as "default" | "secondary" | "destructive" | "outline"} className="text-xs">
                         {insight.severity}
                       </Badge>
                     </div>
                      <p className="text-xs text-muted-foreground">
                        {insight.description}
                      </p>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{insight.timestamp.toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              <Button 
                variant="outline" 
                className="w-full text-sm"
                onClick={() => navigate('/insights')}
              >
                View All Insights
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;