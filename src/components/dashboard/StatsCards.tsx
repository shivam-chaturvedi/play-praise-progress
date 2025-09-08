import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Video,
  Heart,
  MessageCircle,
  Eye,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

interface StatsCardsProps {
  stats: {
    videosCount: number;
    likesCount: number;
    commentsCount: number;
    viewsCount: number;
    rewardsCount: number;
  };
  previousStats?: {
    videosCount: number;
    likesCount: number;
    commentsCount: number;
    viewsCount: number;
  };
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
  trend,
  trendValue,
  progress,
  goal,
}: {
  title: string;
  value: number;
  icon: React.ComponentType<any>;
  color: string;
  trend?: "up" | "down" | "stable";
  trendValue?: number;
  progress?: number;
  goal?: number;
}) => {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  
  return (
    <Card className="card-hover relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${color}`} />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-5 w-5 ${color.includes('blue') ? 'text-primary' : color.includes('red') ? 'text-red-500' : color.includes('green') ? 'text-emerald-500' : 'text-accent'}`} />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold text-gradient animate-fade-in">
            {value.toLocaleString()}
          </div>
          {trend && trendValue !== undefined && (
            <div className="flex items-center gap-1">
              <TrendIcon 
                className={`h-4 w-4 ${
                  trend === "up" 
                    ? "text-emerald-500" 
                    : trend === "down" 
                    ? "text-red-500" 
                    : "text-muted-foreground"
                }`} 
              />
              <span 
                className={`text-sm font-medium ${
                  trend === "up" 
                    ? "text-emerald-600" 
                    : trend === "down" 
                    ? "text-red-600" 
                    : "text-muted-foreground"
                }`}
              >
                {trendValue > 0 ? "+" : ""}{trendValue}%
              </span>
            </div>
          )}
        </div>
        
        {progress !== undefined && goal && (
          <div className="mt-3 space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress to goal</span>
              <span>{Math.round(progress)}% of {goal}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        <p className="text-xs text-muted-foreground mt-2">
          {title === "Videos Uploaded" && "Keep sharing your progress!"}
          {title === "Total Likes" && "Engagement from your community"}
          {title === "Comments" && "Feedback from coaches"}
          {title === "Total Views" && "Reach across all content"}
        </p>
      </CardContent>
    </Card>
  );
};

export function StatsCards({ stats, previousStats }: StatsCardsProps) {
  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return { trend: "stable" as const, value: 0 };
    const change = ((current - previous) / previous) * 100;
    return {
      trend: change > 0 ? "up" as const : change < 0 ? "down" as const : "stable" as const,
      value: Math.round(change)
    };
  };

  const videosTrend = previousStats ? calculateTrend(stats.videosCount, previousStats.videosCount) : undefined;
  const likesTrend = previousStats ? calculateTrend(stats.likesCount, previousStats.likesCount) : undefined;
  const commentsTrend = previousStats ? calculateTrend(stats.commentsCount, previousStats.commentsCount) : undefined;
  const viewsTrend = previousStats ? calculateTrend(stats.viewsCount, previousStats.viewsCount) : undefined;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Videos Uploaded"
        value={stats.videosCount}
        icon={Video}
        color="from-blue-500 to-blue-600"
        trend={videosTrend?.trend}
        trendValue={videosTrend?.value}
        progress={stats.videosCount * 10}
        goal={50}
      />
      
      <StatCard
        title="Total Likes"
        value={stats.likesCount}
        icon={Heart}
        color="from-red-500 to-pink-600"
        trend={likesTrend?.trend}
        trendValue={likesTrend?.value}
      />
      
      <StatCard
        title="Comments"
        value={stats.commentsCount}
        icon={MessageCircle}
        color="from-green-500 to-emerald-600"
        trend={commentsTrend?.trend}
        trendValue={commentsTrend?.value}
      />
      
      <StatCard
        title="Total Views"
        value={stats.viewsCount}
        icon={Eye}
        color="from-orange-500 to-amber-600"
        trend={viewsTrend?.trend}
        trendValue={viewsTrend?.value}
      />
    </div>
  );
}