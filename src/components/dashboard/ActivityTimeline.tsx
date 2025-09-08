import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Activity,
  Heart,
  MessageCircle,
  Eye,
  Upload,
  Trophy,
  Filter,
  ChevronRight,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ActivityItem {
  id: string;
  type: 'like' | 'comment' | 'upload' | 'view' | 'reward';
  action: string;
  videoTitle?: string;
  userName?: string;
  created_at: string;
  avatar?: string;
  metadata?: any;
}

interface ActivityTimelineProps {
  activities: ActivityItem[];
  loading?: boolean;
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'like':
      return <Heart className="h-4 w-4 text-red-500" />;
    case 'comment':
      return <MessageCircle className="h-4 w-4 text-blue-500" />;
    case 'upload':
      return <Upload className="h-4 w-4 text-green-500" />;
    case 'view':
      return <Eye className="h-4 w-4 text-purple-500" />;
    case 'reward':
      return <Trophy className="h-4 w-4 text-yellow-500" />;
    default:
      return <Activity className="h-4 w-4 text-muted-foreground" />;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case 'like':
      return 'bg-red-500';
    case 'comment':
      return 'bg-blue-500';
    case 'upload':
      return 'bg-green-500';
    case 'view':
      return 'bg-purple-500';
    case 'reward':
      return 'bg-yellow-500';
    default:
      return 'bg-muted-foreground';
  }
};

export function ActivityTimeline({ activities, loading }: ActivityTimelineProps) {
  if (loading) {
    return (
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-accent" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-10 h-10 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-hover">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-accent" />
            Recent Activity
          </CardTitle>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No recent activity</p>
            <p className="text-sm text-muted-foreground mt-1">
              Share a video to get started!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={activity.id}>
                <div className="flex items-start gap-3 group hover:bg-muted/50 p-2 rounded-lg transition-colors">
                  <div className="relative">
                    <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                      <AvatarImage src={activity.avatar} />
                      <AvatarFallback className="text-sm">
                        {activity.userName?.charAt(0)?.toUpperCase() || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${getActivityColor(activity.type)} rounded-full flex items-center justify-center border-2 border-background`}>
                      {getActivityIcon(activity.type)}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-semibold text-foreground">
                            {activity.userName || 'Someone'}
                          </span>{' '}
                          <span className="text-muted-foreground">
                            {activity.action}
                          </span>
                          {activity.videoTitle && (
                            <>
                              {' '}
                              <span className="font-medium text-foreground">
                                "{activity.videoTitle}"
                              </span>
                            </>
                          )}
                        </p>
                        
                        <div className="flex items-center gap-2 mt-1">
                          <time className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(activity.created_at), { 
                              addSuffix: true 
                            })}
                          </time>
                          
                          <Badge variant="outline" className="text-xs py-0 px-2">
                            {activity.type}
                          </Badge>
                        </div>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {index < activities.length - 1 && (
                  <Separator className="ml-14 mt-4" />
                )}
              </div>
            ))}
            
            {activities.length >= 10 && (
              <div className="pt-4">
                <Button variant="outline" className="w-full" size="sm">
                  View All Activity
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}