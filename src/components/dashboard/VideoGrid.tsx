import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Video, 
  Play, 
  Eye, 
  Heart, 
  MessageCircle, 
  MoreHorizontal,
  Edit3,
  Share2,
  Trash2,
  TrendingUp
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface VideoData {
  id: string;
  title: string;
  video_url: string;
  sport?: string;
  skill_level?: string;
  created_at: string;
  views?: number;
  likes?: number;
  comments?: number;
  description?: string;
  user_id?: string;
  is_coaches_only?: boolean;
  updated_at?: string;
}

interface VideoGridProps {
  videos: VideoData[];
  loading?: boolean;
}

export function VideoGrid({ videos, loading }: VideoGridProps) {
  if (loading) {
    return (
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-primary" />
            Your Recent Videos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3 animate-pulse">
                <div className="aspect-video bg-muted rounded-lg" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="flex gap-2">
                    <div className="h-5 bg-muted rounded w-16" />
                    <div className="h-5 bg-muted rounded w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (videos.length === 0) {
    return (
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-primary" />
            Your Videos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Video className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No videos yet</h3>
            <p className="text-muted-foreground mb-4">
              Start sharing your athletic journey by uploading your first video
            </p>
            <Button className="gradient-primary">
              <Play className="h-4 w-4 mr-2" />
              Upload First Video
            </Button>
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
            <Video className="h-5 w-5 text-primary" />
            Your Recent Videos
            <Badge variant="secondary" className="ml-2">
              {videos.length}
            </Badge>
          </CardTitle>
          <Button variant="outline" size="sm">
            View All Videos
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {videos.map((video, index) => (
            <div key={video.id} className="group relative">
              {/* Video Thumbnail */}
              <div className="aspect-video bg-muted rounded-lg overflow-hidden relative cursor-pointer">
                <video
                  src={video.video_url}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  poster="/placeholder.svg"
                  preload="metadata"
                />
                
                {/* Play Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                    <Play className="h-8 w-8 text-white fill-white" />
                  </div>
                </div>
                
                {/* Performance Badge */}
                {index === 0 && (
                  <Badge className="absolute top-2 left-2 bg-primary/90 backdrop-blur-sm">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Top Performer
                  </Badge>
                )}
                
                {/* View Count */}
                <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                  {(video.views || 0).toLocaleString()} views
                </div>
                
                {/* Action Menu */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="sm" className="bg-white/20 backdrop-blur-sm border-0 hover:bg-white/30">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit Video
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              {/* Video Info */}
              <div className="mt-3 space-y-2">
                <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                  {video.title}
                </h4>
                
                {/* Tags */}
                <div className="flex items-center gap-2 flex-wrap">
                  {video.sport && (
                    <Badge variant="outline" className="text-xs px-2 py-0">
                      {video.sport}
                    </Badge>
                  )}
                  {video.skill_level && (
                    <Badge variant="outline" className="text-xs px-2 py-0">
                      {video.skill_level}
                    </Badge>
                  )}
                </div>
                
                {/* Stats & Date */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {(video.views || 0).toLocaleString()}
                    </span>
                    {video.likes !== undefined && (
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {video.likes}
                      </span>
                    )}
                    {video.comments !== undefined && (
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {video.comments}
                      </span>
                    )}
                  </div>
                  
                  <time>
                    {formatDistanceToNow(new Date(video.created_at), { 
                      addSuffix: true 
                    })}
                  </time>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {videos.length >= 6 && (
          <div className="mt-6 text-center">
            <Button variant="outline" className="w-full">
              Load More Videos
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}