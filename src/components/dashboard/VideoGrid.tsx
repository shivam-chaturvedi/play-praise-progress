import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface VideoData {
  id: string;
  title: string;
  video_url: string;
  sport?: string;
  skill_level?: string;
  created_at: string;
  views?: number;
  views_count?: number;
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [editForm, setEditForm] = useState({ title: '', description: '' });
  const { toast } = useToast();

  const handleDelete = (video: VideoData) => {
    setSelectedVideo(video);
    setDeleteDialogOpen(true);
  };

  const handleEdit = (video: VideoData) => {
    setSelectedVideo(video);
    setEditForm({ title: video.title, description: video.description || '' });
    setEditDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedVideo) return;

    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', selectedVideo.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Video deleted successfully",
      });
      
      setDeleteDialogOpen(false);
      setSelectedVideo(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete video",
        variant: "destructive",
      });
    }
  };

  const saveEdit = async () => {
    if (!selectedVideo) return;

    try {
      const { error } = await supabase
        .from('videos')
        .update({
          title: editForm.title,
          description: editForm.description,
        })
        .eq('id', selectedVideo.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Video updated successfully",
      });
      
      setEditDialogOpen(false);
      setSelectedVideo(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update video",
        variant: "destructive",
      });
    }
  };

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
    <>
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
                    muted
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => {
                      e.currentTarget.pause();
                      e.currentTarget.currentTime = 0;
                    }}
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
                    {Number(video.views_count || video.views || 0).toLocaleString()} views
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
                        <DropdownMenuItem onClick={() => handleEdit(video)}>
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit Video
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDelete(video)}
                        >
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
                        {Number(video.views_count || video.views || 0).toLocaleString()}
                      </span>
                      {video.likes !== undefined && (
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {Number(video.likes || 0).toLocaleString()}
                        </span>
                      )}
                      {video.comments !== undefined && (
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          {Number(video.comments || 0).toLocaleString()}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the video "{selectedVideo?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Video</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editForm.title}
                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Video title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Video description"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveEdit}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}