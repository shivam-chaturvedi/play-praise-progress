import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Play, Calendar, Filter, Search, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useVideos } from "@/hooks/useVideos";
import { useComments } from "@/hooks/useComments";
import { formatDistanceToNow } from "date-fns";

const AthleteComments = () => {
  const { signOut } = useAuth();
  const { profile } = useProfile();
  const { videos } = useVideos();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSport, setFilterSport] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");

  // Get user's videos
  const userVideos = videos.filter(video => video.user_id === profile?.user_id);

  // Get all comments for user's videos
  const allComments = userVideos.flatMap(video => {
    const { comments } = useComments(video.id);
    return comments.map(comment => ({
      ...comment,
      video: video,
    }));
  });

  // Filter and sort comments
  const filteredComments = allComments
    .filter(comment => {
      const matchesSearch = comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          comment.video.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSport = filterSport === "all" || comment.video.sport === filterSport;
      return matchesSearch && matchesSport;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "video":
          return a.video.title.localeCompare(b.video.title);
        default:
          return 0;
      }
    });

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-effect border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gradient">Coach Comments</h1>
            <Badge variant="outline" className="border-primary text-primary">
              {filteredComments.length} Comments
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="outline" size="sm">
                Dashboard
              </Button>
            </Link>
            <Link to="/feed">
              <Button variant="outline" size="sm">
                Feed
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Welcome, {profile?.display_name || "Athlete"}!
          </h2>
          <p className="text-muted-foreground">
            View and manage all coach feedback on your videos in one place.
          </p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Comments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search comments or videos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Sport</label>
                <Select value={filterSport} onValueChange={setFilterSport}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Sports" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sports</SelectItem>
                    <SelectItem value="basketball">Basketball</SelectItem>
                    <SelectItem value="football">Football</SelectItem>
                    <SelectItem value="soccer">Soccer</SelectItem>
                    <SelectItem value="tennis">Tennis</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="video">By Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments List */}
        {filteredComments.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Comments Yet</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || filterSport !== "all" 
                  ? "No comments match your current filters."
                  : "Start uploading videos to receive coach feedback!"}
              </p>
              <Link to="/post">
                <Button variant="gradient" size="lg">
                  Upload Your First Video
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredComments.map((comment) => (
              <Card key={comment.id} className="card-hover overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Video Thumbnail */}
                    <div className="flex-shrink-0">
                      <Link to={`/video/${comment.video.id}`}>
                        <div className="w-32 h-20 bg-muted rounded-lg overflow-hidden relative group cursor-pointer">
                          <video
                            src={comment.video.video_url}
                            className="w-full h-full object-cover"
                            preload="metadata"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Play className="h-6 w-6 text-white" />
                          </div>
                        </div>
                      </Link>
                    </div>

                    {/* Comment Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={comment.profiles?.avatar_url || ""} />
                            <AvatarFallback>
                              {comment.profiles?.display_name?.[0] || "C"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">
                                {comment.profiles?.display_name || "Anonymous Coach"}
                              </p>
                              <Badge 
                                variant={comment.profiles?.role === "coach" ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {comment.profiles?.role}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <Link to={`/video/${comment.video.id}`}>
                          <h3 className="font-medium text-primary hover:underline mb-1">
                            {comment.video.title}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-2">
                          {comment.video.sport && (
                            <Badge variant="outline" className="text-xs">
                              {comment.video.sport}
                            </Badge>
                          )}
                          {comment.video.skill_level && (
                            <Badge variant="outline" className="text-xs">
                              {comment.video.skill_level}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="bg-muted/30 rounded-lg p-4">
                        <p className="text-sm leading-relaxed">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        {filteredComments.length > 0 && (
          <Card className="mt-8 gradient-primary text-primary-foreground">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Feedback Summary</h3>
                  <p className="opacity-90">
                    You've received {filteredComments.length} comments from coaches
                    across {userVideos.length} videos. Keep up the great work!
                  </p>
                </div>
                <TrendingUp className="h-12 w-12 opacity-80" />
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AthleteComments;