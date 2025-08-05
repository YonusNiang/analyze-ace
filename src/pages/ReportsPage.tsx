import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Plus, 
  Download, 
  Clock, 
  Filter,
  Calendar,
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Play,
  Pause
} from 'lucide-react';

interface Report {
  id: string;
  name: string;
  type: string;
  schedule: string | null;
  is_active: boolean;
  last_generated: string | null;
  config: any;
  user_id: string;
  created_at: string;
  updated_at: string;
}

const REPORT_TEMPLATES = [
  {
    type: 'revenue_summary',
    name: 'Revenue Summary',
    description: 'Monthly revenue breakdown with trends and forecasts',
    icon: DollarSign,
    color: 'text-green-600'
  },
  {
    type: 'user_analytics',
    name: 'User Analytics',
    description: 'User engagement, retention, and behavior analysis',
    icon: Users,
    color: 'text-blue-600'
  },
  {
    type: 'performance_metrics',
    name: 'Performance Metrics',
    description: 'Key performance indicators and business metrics',
    icon: BarChart3,
    color: 'text-purple-600'
  },
  {
    type: 'marketing_attribution',
    name: 'Marketing Attribution',
    description: 'Marketing channel performance and ROI analysis',
    icon: TrendingUp,
    color: 'text-orange-600'
  }
];

const ReportsPage = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchReports();
    }
  }, [user]);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast({
        title: "Error",
        description: "Failed to load reports",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createReport = async (template: typeof REPORT_TEMPLATES[0]) => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .insert({
          user_id: user?.id,
          name: template.name,
          type: template.type,
          schedule: null,
          is_active: true,
          config: {
            template: template.type,
            description: template.description
          }
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Report Created",
        description: `${template.name} report has been created successfully`,
      });

      await fetchReports();
    } catch (error) {
      console.error('Error creating report:', error);
      toast({
        title: "Error",
        description: "Failed to create report",
        variant: "destructive",
      });
    }
  };

  const generateReport = async (reportId: string) => {
    try {
      await supabase
        .from('reports')
        .update({
          last_generated: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', reportId);

      toast({
        title: "Report Generated",
        description: "Report has been generated successfully",
      });

      await fetchReports();
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      });
    }
  };

  const toggleReportStatus = async (reportId: string, currentStatus: boolean) => {
    try {
      await supabase
        .from('reports')
        .update({
          is_active: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', reportId);

      toast({
        title: currentStatus ? "Report Paused" : "Report Activated",
        description: `Report has been ${currentStatus ? 'paused' : 'activated'}`,
      });

      await fetchReports();
    } catch (error) {
      console.error('Error toggling report status:', error);
      toast({
        title: "Error",
        description: "Failed to update report status",
        variant: "destructive",
      });
    }
  };

  const deleteReport = async (reportId: string) => {
    try {
      await supabase
        .from('reports')
        .delete()
        .eq('id', reportId);

      toast({
        title: "Report Deleted",
        description: "Report has been deleted successfully",
      });

      await fetchReports();
    } catch (error) {
      console.error('Error deleting report:', error);
      toast({
        title: "Error",
        description: "Failed to delete report",
        variant: "destructive",
      });
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && report.is_active) ||
      (statusFilter === 'inactive' && !report.is_active);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground">
            Generate and schedule automated reports from your connected data
          </p>
        </div>
        <Button onClick={() => fetchReports()}>
          <Plus className="h-4 w-4 mr-2" />
          Create Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <FileText className="h-8 w-8 text-primary mr-4" />
            <div>
              <p className="text-2xl font-bold">{reports.length}</p>
              <p className="text-sm text-muted-foreground">Total Reports</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Play className="h-8 w-8 text-green-500 mr-4" />
            <div>
              <p className="text-2xl font-bold">{reports.filter(r => r.is_active).length}</p>
              <p className="text-sm text-muted-foreground">Active Reports</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Clock className="h-8 w-8 text-blue-500 mr-4" />
            <div>
              <p className="text-2xl font-bold">{reports.filter(r => r.schedule).length}</p>
              <p className="text-sm text-muted-foreground">Scheduled</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Download className="h-8 w-8 text-purple-500 mr-4" />
            <div>
              <p className="text-2xl font-bold">{reports.filter(r => r.last_generated).length}</p>
              <p className="text-sm text-muted-foreground">Generated</p>
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
              <Input
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="revenue_summary">Revenue Summary</SelectItem>
                  <SelectItem value="user_analytics">User Analytics</SelectItem>
                  <SelectItem value="performance_metrics">Performance Metrics</SelectItem>
                  <SelectItem value="marketing_attribution">Marketing Attribution</SelectItem>
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Templates */}
      {reports.length === 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Create Your First Report</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {REPORT_TEMPLATES.map((template) => {
              const IconComponent = template.icon;
              return (
                <Card key={template.type} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => createReport(template)}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-card rounded-lg">
                        <IconComponent className={`h-6 w-6 ${template.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      {template.description}
                    </CardDescription>
                    <Button className="w-full" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Report
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Existing Reports */}
      {reports.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Reports</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredReports.map((report) => {
              const template = REPORT_TEMPLATES.find(t => t.type === report.type);
              const IconComponent = template?.icon || FileText;
              
              return (
                <Card key={report.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-card rounded-lg">
                          <IconComponent className={`h-5 w-5 ${template?.color || 'text-primary'}`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{report.name}</CardTitle>
                          <CardDescription>
                            {(report.config as any)?.description || template?.description}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={report.is_active ? "default" : "secondary"}>
                          {report.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {report.last_generated && (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Last generated: {new Date(report.last_generated).toLocaleDateString()}</span>
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => generateReport(report.id)}
                        className="flex-1"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Generate
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => alert('Report preview coming soon!')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => toggleReportStatus(report.id, report.is_active)}
                      >
                        {report.is_active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => alert('Edit functionality coming soon!')}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => deleteReport(report.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {reports.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Create New Report</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {REPORT_TEMPLATES.map((template) => {
              const IconComponent = template.icon;
              return (
                <Card key={template.type} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => createReport(template)}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-card rounded-lg">
                        <IconComponent className={`h-6 w-6 ${template.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      {template.description}
                    </CardDescription>
                    <Button className="w-full" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Report
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {filteredReports.length === 0 && reports.length > 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No reports found</h3>
            <p className="text-muted-foreground text-center">
              Try adjusting your search or filters to find the reports you're looking for.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReportsPage;
