import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { Calendar, TrendingUp, Activity, BarChart3 } from "lucide-react";
import { format, subDays, startOfDay } from "date-fns";

interface AnalyticsChartsProps {
  stats: {
    videosCount: number;
    likesCount: number;
    commentsCount: number;
    viewsCount: number;
  };
}

export function AnalyticsCharts({ stats }: AnalyticsChartsProps) {
  // Generate mock trend data for the last 7 days
  const generateTrendData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = startOfDay(subDays(new Date(), i));
      data.push({
        date: format(date, 'MMM dd'),
        views: Math.floor(Math.random() * 50) + 10,
        likes: Math.floor(Math.random() * 15) + 2,
        comments: Math.floor(Math.random() * 8) + 1,
        uploads: Math.floor(Math.random() * 3),
      });
    }
    return data;
  };

  const trendData = generateTrendData();

  // Engagement distribution data
  const engagementData = [
    { name: 'Views', value: stats.viewsCount, color: 'hsl(var(--primary))' },
    { name: 'Likes', value: stats.likesCount, color: 'hsl(var(--accent))' },
    { name: 'Comments', value: stats.commentsCount, color: 'hsl(var(--secondary))' },
  ];

  // Performance by content type (mock data)
  const performanceData = [
    { sport: 'Basketball', views: 124, likes: 23, comments: 8 },
    { sport: 'Soccer', views: 98, likes: 18, comments: 6 },
    { sport: 'Tennis', views: 67, likes: 12, comments: 4 },
    { sport: 'Baseball', views: 45, likes: 8, comments: 3 },
  ];

  const chartConfig = {
    views: {
      label: "Views",
      color: "hsl(var(--primary))",
    },
    likes: {
      label: "Likes",
      color: "hsl(var(--accent))",
    },
    comments: {
      label: "Comments",
      color: "hsl(var(--secondary))",
    },
    uploads: {
      label: "Uploads",
      color: "hsl(var(--muted-foreground))",
    },
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Weekly Trends */}
      <Card className="card-hover lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Weekly Performance Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="min-h-[300px]">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="likesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="hsl(var(--primary))"
                  fill="url(#viewsGradient)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="likes"
                  stroke="hsl(var(--accent))"
                  fill="url(#likesGradient)"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="comments"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--secondary))", strokeWidth: 2, r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Engagement Distribution */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-secondary" />
            Engagement Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="min-h-[250px]">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={engagementData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  stroke="none"
                >
                  {engagementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value, entry) => (
                    <span style={{ color: entry.color }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Performance by Sport */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-accent" />
            Performance by Sport
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="min-h-[250px]">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="sport" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="views" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                  opacity={0.8}
                />
                <Bar 
                  dataKey="likes" 
                  fill="hsl(var(--accent))" 
                  radius={[4, 4, 0, 0]}
                  opacity={0.8}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}