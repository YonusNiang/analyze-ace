import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plug, PlugZap, AlertCircle, RefreshCw } from 'lucide-react';

interface DataSource {
  id: string;
  name: string;
  type: string;
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  lastSync?: string;
}

interface DataSourceCardProps {
  dataSource: DataSource;
  onConnect: (id: string) => void;
  onRefresh: (id: string) => void;
}

const statusConfig = {
  connected: {
    icon: PlugZap,
    color: 'bg-success text-success-foreground',
    label: 'Connected'
  },
  disconnected: {
    icon: Plug,
    color: 'bg-muted text-muted-foreground',
    label: 'Disconnected'
  },
  error: {
    icon: AlertCircle,
    color: 'bg-destructive text-destructive-foreground',
    label: 'Error'
  },
  syncing: {
    icon: RefreshCw,
    color: 'bg-info text-info-foreground',
    label: 'Syncing'
  }
};

const dataSourceIcons: { [key: string]: string } = {
  salesforce: '🏢',
  hubspot: '🟠',
  shopify: '🛒',
  stripe: '💳',
  google_analytics: '📊',
  facebook_ads: '📘',
  mailchimp: '📧',
  quickbooks: '📋',
  paypal: '💰',
  instagram: '📷',
  linkedin: '💼',
  twitter: '🐦'
};

export const DataSourceCard = ({ dataSource, onConnect, onRefresh }: DataSourceCardProps) => {
  const statusInfo = statusConfig[dataSource.status];
  const StatusIcon = statusInfo.icon;
  const isConnected = dataSource.status === 'connected';

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">
              {dataSourceIcons[dataSource.type] || '🔗'}
            </div>
            <div>
              <CardTitle className="text-lg">{dataSource.name}</CardTitle>
              <CardDescription className="capitalize">
                {dataSource.type.replace('_', ' ')}
              </CardDescription>
            </div>
          </div>
          <Badge className={statusInfo.color}>
            <StatusIcon className={`h-3 w-3 mr-1 ${dataSource.status === 'syncing' ? 'animate-spin' : ''}`} />
            {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {dataSource.lastSync && (
            <p className="text-sm text-muted-foreground">
              Last sync: {new Date(dataSource.lastSync).toLocaleString()}
            </p>
          )}
          <div className="flex space-x-2">
            {isConnected ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onRefresh(dataSource.id)}
                  disabled={dataSource.status === 'syncing'}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Sync Now
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onConnect(dataSource.id)}
                >
                  Disconnect
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                onClick={() => onConnect(dataSource.id)}
                className="w-full"
              >
                <Plug className="h-4 w-4 mr-1" />
                Connect
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};