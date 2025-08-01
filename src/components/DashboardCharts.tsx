import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 12000, profit: 4800 },
  { month: 'Feb', revenue: 15000, profit: 6000 },
  { month: 'Mar', revenue: 18000, profit: 7200 },
  { month: 'Apr', revenue: 22000, profit: 8800 },
  { month: 'May', revenue: 25000, profit: 10000 },
  { month: 'Jun', revenue: 28000, profit: 11200 },
];

const salesData = [
  { product: 'Product A', sales: 4000 },
  { product: 'Product B', sales: 3000 },
  { product: 'Product C', sales: 2000 },
  { product: 'Product D', sales: 2780 },
  { product: 'Product E', sales: 1890 },
];

const trafficData = [
  { source: 'Organic', value: 45, color: 'hsl(var(--chart-1))' },
  { source: 'Paid', value: 25, color: 'hsl(var(--chart-2))' },
  { source: 'Social', value: 20, color: 'hsl(var(--chart-3))' },
  { source: 'Direct', value: 10, color: 'hsl(var(--chart-4))' },
];

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  profit: {
    label: "Profit",
    color: "hsl(var(--chart-2))",
  },
  sales: {
    label: "Sales",
    color: "hsl(var(--chart-3))",
  },
};

export const RevenueChart = () => (
  <Card>
    <CardHeader>
      <CardTitle>Revenue & Profit Trends</CardTitle>
      <CardDescription>Monthly revenue and profit over the last 6 months</CardDescription>
    </CardHeader>
    <CardContent>
      <ChartContainer config={chartConfig}>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stackId="1"
              stroke="hsl(var(--chart-1))"
              fill="hsl(var(--chart-1))"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="profit"
              stackId="2"
              stroke="hsl(var(--chart-2))"
              fill="hsl(var(--chart-2))"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </CardContent>
  </Card>
);

export const SalesChart = () => (
  <Card>
    <CardHeader>
      <CardTitle>Product Sales</CardTitle>
      <CardDescription>Sales performance by product category</CardDescription>
    </CardHeader>
    <CardContent>
      <ChartContainer config={chartConfig}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="product" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="sales" fill="hsl(var(--chart-3))" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </CardContent>
  </Card>
);

export const TrafficChart = () => (
  <Card>
    <CardHeader>
      <CardTitle>Traffic Sources</CardTitle>
      <CardDescription>Distribution of website traffic by source</CardDescription>
    </CardHeader>
    <CardContent>
      <ChartContainer config={chartConfig}>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={trafficData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ source, value }) => `${source}: ${value}%`}
            >
              {trafficData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </CardContent>
  </Card>
);

export const ConversionChart = () => {
  const conversionData = [
    { step: 'Visits', value: 10000 },
    { step: 'Signups', value: 2500 },
    { step: 'Trials', value: 1000 },
    { step: 'Paid', value: 300 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversion Funnel</CardTitle>
        <CardDescription>User journey from visit to conversion</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={conversionData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="step" type="category" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="hsl(var(--chart-4))" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};