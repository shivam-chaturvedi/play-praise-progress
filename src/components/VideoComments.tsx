import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { useComments } from "@/hooks/useComments";

const VideoComments = ({ videoId, profile }: { videoId: string; profile: any }) => {
  const [showAll, setShowAll] = useState(false);
  const [newComment, setNewComment] = useState("");
  const { comments, addComment } = useComments(videoId);

  const handleAdd = async () => {
    if (!newComment.trim()) return;
    await addComment(newComment);
    setNewComment("");
  };

  // show latest 2 unless expanded
  const visibleComments = showAll ? comments : comments.slice(-2);

  return (
    <div className="mt-4">
      {/* Comment Input */}
      {profile?.role === "coach" && (
        <div className="flex gap-2 mb-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={profile?.avatar_url || ""} />
            <AvatarFallback>{profile?.display_name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={1}
            />
            <div className="flex justify-end mt-1">
              <Button size="sm" onClick={handleAdd}>
                Post
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-3">
        {visibleComments.map((c) => (
          <div key={c.id} className="flex gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={c.profiles?.avatar_url || ""} />
              <AvatarFallback>{c.profiles?.display_name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 bg-muted/30 rounded-lg px-3 py-2">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{c.profiles?.display_name || "Anonymous"}</p>
                <Badge
                  variant={c.profiles?.role === "coach" ? "default" : "secondary"}
                  className="text-[10px]"
                >
                  {c.profiles?.role}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm">{c.content}</p>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <p className="text-sm text-muted-foreground">No comments yet</p>
        )}
      </div>

      {/* View all toggle */}
      {comments.length > 2 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-2 text-xs text-primary hover:underline"
        >
          {showAll ? "Hide comments" : `View all ${comments.length} comments`}
        </button>
      )}
    </div>
  );
};

export default VideoComments;
