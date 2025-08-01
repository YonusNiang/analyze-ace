import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  CheckCircle, 
  Clock, 
  Filter,
  Search,
  Calendar,
  BarChart3,
  Users,
  DollarSign,
  ShoppingCart
} from 'lucide-react';

interface Insight {
  id: string;
  type: 'anomaly' | 'trend' | 'forecast' | 'benchmark' | 'recommendation';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  category: 'revenue' | 'traffic' | 'conversion' | 'user' | 'marketing';
  impact: 'positive' | 'negative' | 'neutral';
  confidence: number;
  dataSource: string;
}

const InsightsPage = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [filteredInsights, setFilteredInsights] = useState<Insight[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    // Simulate loading comprehensive insights
    const mockInsights: Insight[] = [
      {
        id: '1',
        type: 'anomaly',
        title: 'Unusual Traffic Spike',
        description: 'Website traffic increased by 150% in the last 24 hours, primarily from organic search. This correlates with a recent content marketing campaign.',
        severity: 'medium',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        category: 'traffic',
        impact: 'positive',
        confidence: 85,
        dataSource: 'Google Analytics'
      },
      {
        id: '2',
        type: 'recommendation',
        title: 'Optimize Email Campaign',
        description: 'Your email open rates could improve by 25% with better timing. Analysis shows optimal send times are Tuesday 10 AM and Thursday 2 PM.',
        severity: 'low',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        category: 'marketing',
        impact: 'positive',
        confidence: 92,
        dataSource: 'Mailchimp Analytics'
      },
      {
        id: '3',
        type: 'trend',
        title: 'Revenue Growth Trend',
        description: 'Monthly recurring revenue is trending upward by 12% month-over-month. SaaS segment shows strongest growth at 18%.',
        severity: 'low',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        category: 'revenue',
        impact: 'positive',
        confidence: 88,
        dataSource: 'Stripe Analytics'
      },
      {
        id: '4',
        type: 'anomaly',
        title: 'Conversion Rate Drop',
        description: 'Checkout conversion rate dropped 15% in the last week. Mobile users show the largest decline at 22%.',
        severity: 'high',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        category: 'conversion',
        impact: 'negative',
        confidence: 78,
        dataSource: 'Shopify Analytics'
      },
      {
        id: '5',
        type: 'forecast',
        title: 'Q4 Revenue Forecast',
        description: 'Based on current trends, Q4 revenue is projected to increase by 23% compared to Q3. Holiday season campaigns are driving growth.',
        severity: 'low',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        category: 'revenue',
        impact: 'positive',
        confidence: 76,
        dataSource: 'Internal Analytics'
      },
      {
        id: '6',
        type: 'benchmark',
        title: 'Industry Performance Comparison',
        description: 'Your conversion rate of 3.24% is 15% above industry average. However, cart abandonment is 8% higher than competitors.',
        severity: 'medium',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
        category: 'conversion',
        impact: 'neutral',
        confidence: 82,
        dataSource: 'Industry Reports'
      },
      {
        id: '7',
        type: 'recommendation',
        title: 'User Retention Strategy',
        description: 'Implementing a welcome email sequence could improve 30-day retention by 18%. Users who receive onboarding emails show 40% higher engagement.',
        severity: 'low',
        timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000), // 36 hours ago
        category: 'user',
        impact: 'positive',
        confidence: 89,
        dataSource: 'User Analytics'
      },
      {
        id: '8',
        type: 'anomaly',
        title: 'Mobile App Crashes',
        description: 'Mobile app crash rate increased by 45% in the last 48 hours. iOS users are most affected, with 67% of crashes occurring on version 15.0.',
        severity: 'critical',
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000), // 48 hours ago
        category: 'user',
        impact: 'negative',
        confidence: 95,
        dataSource: 'Crashlytics'
      }
    ];
    setInsights(mockInsights);
    setFilteredInsights(mockInsights);
  }, []);

  useEffect(() => {
    let filtered = insights;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(insight =>
        insight.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        insight.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply severity filter
    if (severityFilter !== 'all') {
      filtered = filtered.filter(insight => insight.severity === severityFilter);
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(insight => insight.type === typeFilter);
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(insight => insight.category === categoryFilter);
    }

    setFilteredInsights(filtered);
  }, [insights, searchTerm, severityFilter, typeFilter, categoryFilter]);

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
      case 'forecast': return BarChart3;
      case 'benchmark': return CheckCircle;
      default: return CheckCircle;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'revenue': return DollarSign;
      case 'traffic': return TrendingUp;
      case 'conversion': return ShoppingCart;
      case 'user': return Users;
      case 'marketing': return Target;
      default: return BarChart3;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      case 'neutral': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 80) return 'text-yellow-600';
    if (confidence >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Insights</h1>
          <p className="text-muted-foreground">
            AI-generated insights from your data sources
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => alert('Date range selector coming soon!')}>
            <Calendar className="h-4 w-4 mr-2" />
            Last 7 days
          </Button>
          <Button variant="outline" size="sm" onClick={() => alert('Export functionality coming soon!')}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search insights..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Severity</label>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All severities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="anomaly">Anomaly</SelectItem>
                  <SelectItem value="trend">Trend</SelectItem>
                  <SelectItem value="forecast">Forecast</SelectItem>
                  <SelectItem value="benchmark">Benchmark</SelectItem>
                  <SelectItem value="recommendation">Recommendation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="traffic">Traffic</SelectItem>
                  <SelectItem value="conversion">Conversion</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredInsights.map((insight) => {
          const InsightIcon = getInsightIcon(insight.type);
          const CategoryIcon = getCategoryIcon(insight.category);
          return (
            <Card key={insight.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-card rounded-lg">
                      <InsightIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={getSeverityColor(insight.severity) as "default" | "secondary" | "destructive" | "outline"}>
                          {insight.severity}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {insight.type}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <CategoryIcon className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{insight.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${getImpactColor(insight.impact)}`}>
                      {insight.impact}
                    </div>
                    <div className={`text-xs ${getConfidenceColor(insight.confidence)}`}>
                      {insight.confidence}% confidence
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {insight.description}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-3 w-3" />
                    <span>{insight.timestamp.toLocaleString()}</span>
                  </div>
                  <span className="text-xs bg-muted px-2 py-1 rounded">
                    {insight.dataSource}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => alert(`Detailed view for: ${insight.title}`)}
                  >
                    View Details
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => {
                      const updatedInsights = insights.filter(i => i.id !== insight.id);
                      setInsights(updatedInsights);
                    }}
                  >
                    Dismiss
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredInsights.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No insights found</h3>
            <p className="text-muted-foreground text-center">
              Try adjusting your filters or check back later for new insights.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InsightsPage; 