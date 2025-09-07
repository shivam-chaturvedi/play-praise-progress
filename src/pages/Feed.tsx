import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Heart,
  MessageCircle,
  Share,
  Play,
  MoreHorizontal,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useVideos } from "@/hooks/useVideos";
import { useProfile } from "@/hooks/useProfile";
import { useComments } from "@/hooks/useComments";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { useVideoViews } from "@/hooks/useVideoViews";
import VideoComments from "@/components/VideoComments";

const Feed = () => {
  const { signOut } = useAuth();
  const { profile } = useProfile();
  const { videos, loading, toggleLike } = useVideos();
  const [selectedVideoForComments, setSelectedVideoForComments] = useState<
    string | null
  >(null);
  const [newComment, setNewComment] = useState("");

  const { comments, addComment } = useComments(selectedVideoForComments || "");

  const { trackView } = useVideoViews(selectedVideoForComments || "");

  const handleSignOut = async () => {
    await signOut();
  };

  const handleComment = async () => {
    if (!newComment.trim() || !selectedVideoForComments) return;

    await addComment(newComment);
    setNewComment("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Feed</h1>
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="outline" size="sm">
                Dashboard
              </Button>
            </Link>
            <Link to="/post">
              <Button variant="outline" size="sm">
                Post Video
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="outline" size="sm">
                Profile
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {videos.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Play className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No videos yet</h3>
              <p className="text-muted-foreground mb-4">
                {profile?.role === "athlete"
                  ? "Be the first to share a practice video!"
                  : "No videos to review yet. Encourage athletes to share their practice!"}
              </p>
              {profile?.role === "athlete" && (
                <Link to="/post">
                  <Button>Upload Your First Video</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {videos.map((video) => (
              <Card key={video.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={video.profiles?.avatar_url || ""} />
                        <AvatarFallback>
                          {video.profiles?.display_name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          {video.profiles?.display_name || "Anonymous"}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              video.profiles?.role === "coach"
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {video.profiles?.role}
                          </Badge>
                          {video.sport && (
                            <Badge variant="outline" className="text-xs">
                              {video.sport}
                            </Badge>
                          )}
                          {video.skill_level && (
                            <Badge variant="outline" className="text-xs">
                              {video.skill_level}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(video.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold">{video.title}</h3>
                      {video.description && (
                        <p className="text-muted-foreground text-sm mt-1">
                          {video.description}
                        </p>
                      )}
                    </div>

                    {/* Video Player */}
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                      <video
                        controls
                        className="w-full h-full object-cover"
                        poster="/placeholder.svg"
                        preload="metadata"
                        crossOrigin="anonymous"
                        onPlay={() => {
                          trackView(video.id);
                        }}
                        onError={(e) => {
                          console.error("Video error:", e);
                          console.log("Video URL:", video.video_url);
                        }}
                        onLoadStart={() => {
                          console.log(
                            "Video loading started:",
                            video.video_url
                          );
                        }}
                        onLoadedData={() => {
                          console.log("Video loaded successfully");
                        }}
                        style={{ backgroundColor: "#000" }}
                      >
                        <source src={video.video_url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>

                      {/* Debug info */}
                      <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        {video.video_url ? "Video URL: Valid" : "No video URL"}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-2"
                          onClick={() => toggleLike(video.id)}
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              video.user_liked
                                ? "fill-red-500 text-red-500"
                                : ""
                            }`}
                          />
                          <span>{video.likes_count || 0}</span>
                        </Button>

                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Eye className="h-4 w-4" />
                          <span className="text-sm">
                            {video.views_count || 0}
                          </span>
                        </div>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex items-center gap-2"
                              onClick={() =>
                                setSelectedVideoForComments(video.id)
                              }
                            >
                              <MessageCircle className="h-4 w-4" />
                              <span>{video.comments_count || 0}</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Comments</DialogTitle>
                              <DialogDescription>
                                {video.title}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              {/* Add comment form (coaches only) */}
                              {profile?.role === "coach" && (
                                <div className="space-y-2">
                                  <Textarea
                                    placeholder="Add your feedback..."
                                    value={newComment}
                                    onChange={(e) =>
                                      setNewComment(e.target.value)
                                    }
                                    rows={3}
                                  />
                                  <Button onClick={handleComment}>
                                    Post Comment
                                  </Button>
                                </div>
                              )}

                              {/* Comments list */}
                              <div className="space-y-3">
                                {comments.map((comment) => (
                                  <div
                                    key={comment.id}
                                    className="flex gap-3 p-3 rounded-lg border"
                                  >
                                    <Avatar className="w-8 h-8">
                                      <AvatarImage
                                        src={comment.profiles?.avatar_url || ""}
                                      />
                                      <AvatarFallback>
                                        {comment.profiles?.display_name?.charAt(
                                          0
                                        ) || "U"}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <p className="font-medium text-sm">
                                          {comment.profiles?.display_name ||
                                            "Anonymous"}
                                        </p>
                                        <Badge
                                          variant={
                                            comment.profiles?.role === "coach"
                                              ? "default"
                                              : "secondary"
                                          }
                                          className="text-xs"
                                        >
                                          {comment.profiles?.role}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                          {formatDistanceToNow(
                                            new Date(comment.created_at),
                                            { addSuffix: true }
                                          )}
                                        </span>
                                      </div>
                                      <p className="text-sm">
                                        {comment.content}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                                {comments.length === 0 && (
                                  <p className="text-center text-muted-foreground py-4">
                                    No comments yet.{" "}
                                    {profile?.role === "coach"
                                      ? "Be the first to give feedback!"
                                      : "Waiting for coach feedback..."}
                                  </p>
                                )}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button
                          onClick={async () => {
                            await navigator.clipboard.writeText(
                              video.video_url
                            );
                            toast.success("Video URL copied to clipboard!");
                          }}
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Share className="h-4 w-4" />
                          Share
                        </Button>
                      </div>

                      {video.is_coaches_only && (
                        <Badge variant="secondary" className="text-xs">
                          Coaches Only
                        </Badge>
                      )}
                    </div>
                  </div>
                  <VideoComments videoId={video.id} profile={profile}  />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Feed;
