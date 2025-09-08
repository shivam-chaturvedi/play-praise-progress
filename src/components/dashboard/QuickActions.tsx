import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  MessageCircle, 
  Eye, 
  TrendingUp, 
  Settings, 
  Trophy,
  Target,
  Calendar,
  Users,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";

interface QuickActionsProps {
  userRole?: string;
  stats?: {
    videosCount: number;
    likesCount: number;
    commentsCount: number;
    viewsCount: number;
  };
}

export function QuickActions({ userRole, stats }: QuickActionsProps) {
  const isAthlete = userRole === "athlete";
  const isCoach = userRole === "coach";

  // Calculate engagement rate
  const engagementRate = stats?.viewsCount 
    ? Math.round(((stats.likesCount + stats.commentsCount) / stats.viewsCount) * 100)
    : 0;

  // Smart recommendations based on user activity
  const getRecommendations = () => {
    const recommendations = [];
    
    if (stats?.videosCount === 0) {
      recommendations.push({
        icon: Upload,
        title: "Upload Your First Video",
        description: "Start your journey by sharing your skills",
        action: "/post",
        priority: "high",
        color: "gradient-primary"
      });
    } else if (stats?.videosCount < 5) {
      recommendations.push({
        icon: Upload,
        title: "Keep Building Your Portfolio",
        description: "Upload more videos to improve visibility",
        action: "/post",
        priority: "medium",
        color: "btn-primary"
      });
    }

    if (isAthlete && stats?.commentsCount === 0) {
      recommendations.push({
        icon: MessageCircle,
        title: "Check for Coach Feedback",
        description: "See if coaches have commented on your videos",
        action: "/athlete-comments",
        priority: "medium",
        color: "btn-accent"
      });
    }

    if (engagementRate < 5 && stats?.viewsCount > 0) {
      recommendations.push({
        icon: TrendingUp,
        title: "Improve Engagement",
        description: "Your engagement rate could be higher",
        action: "/profile",
        priority: "medium",
        color: "btn-secondary"
      });
    }

    return recommendations.slice(0, 3); // Show max 3 recommendations
  };

  const recommendations = getRecommendations();

  const quickActions = [
    ...(isAthlete ? [
      {
        icon: Upload,
        label: "Upload Video",
        description: "Share your latest practice",
        action: "/post",
        color: "gradient-primary",
        featured: true
      },
      {
        icon: MessageCircle,
        label: "Coach Comments",
        description: "View feedback from coaches",
        action: "/athlete-comments",
        color: "btn-accent",
        badge: stats?.commentsCount
      }
    ] : []),
    
    ...(isCoach ? [
      {
        icon: Users,
        label: "Review Athletes",
        description: "Provide feedback to athletes",
        action: "/feed",
        color: "gradient-primary",
        featured: true
      },
      {
        icon: Trophy,
        label: "Give Rewards",
        description: "Recognize achievements",
        action: "/feed",
        color: "btn-secondary"
      }
    ] : []),
    
    {
      icon: Eye,
      label: "Browse Feed",
      description: "Discover new content",
      action: "/feed",
      color: "btn-outline"
    },
    {
      icon: TrendingUp,
      label: "View Profile", 
      description: "Check your progress",
      action: "/profile",
      color: "btn-outline"
    },
    {
      icon: Settings,
      label: "Settings",
      description: "Customize your experience",
      action: "/profile",
      color: "btn-outline"
    }
  ];

  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Smart Recommendations */}
        {recommendations.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4" />
              Recommended for You
            </h4>
            {recommendations.map((rec, index) => (
              <div key={index} className="border border-border/50 rounded-lg p-3 bg-muted/30">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${rec.color === 'gradient-primary' ? 'gradient-primary' : `bg-${rec.color}/10`}`}>
                    <rec.icon className={`h-4 w-4 ${rec.color === 'gradient-primary' ? 'text-white' : 'text-primary'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-sm">{rec.title}</h5>
                    <p className="text-xs text-muted-foreground">{rec.description}</p>
                    <Link to={rec.action} className="block mt-2">
                      <Button size="sm" className={rec.color} variant={rec.color === 'gradient-primary' ? 'default' : 'outline'}>
                        Get Started
                      </Button>
                    </Link>
                  </div>
                  {rec.priority === 'high' && (
                    <Badge variant="destructive" className="text-xs">
                      Priority
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Standard Actions */}
        <div className="space-y-2">
          {recommendations.length > 0 && (
            <h4 className="text-sm font-medium text-muted-foreground pt-2">
              More Actions
            </h4>
          )}
          {quickActions.map((action, index) => (
            <Link key={index} to={action.action} className="block">
              <Button 
                variant={action.featured ? "default" : "outline"} 
                className={`w-full justify-start h-auto p-3 ${action.featured ? action.color : ''}`}
                size="sm"
              >
                <div className="flex items-center gap-3 w-full">
                  <div className={`p-2 rounded-md ${
                    action.featured 
                      ? 'bg-white/20' 
                      : 'bg-primary/10'
                  }`}>
                    <action.icon className={`h-4 w-4 ${
                      action.featured 
                        ? 'text-white' 
                        : 'text-primary'
                    }`} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{action.label}</span>
                      {action.badge !== undefined && action.badge > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {action.badge}
                        </Badge>
                      )}
                    </div>
                    <p className={`text-xs ${
                      action.featured 
                        ? 'text-white/80' 
                        : 'text-muted-foreground'
                    }`}>
                      {action.description}
                    </p>
                  </div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}