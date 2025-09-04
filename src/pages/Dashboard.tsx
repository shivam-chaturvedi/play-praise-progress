import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Video, Heart, MessageCircle, Trophy, TrendingUp, Upload, Eye, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useDashboard } from "@/hooks/useDashboard";
import { useVideoViews } from "@/hooks/useVideoViews";
import { formatDistanceToNow } from "date-fns";

const Dashboard = () => {
  const { signOut } = useAuth();
  const { profile } = useProfile();
  const { stats, recentVideos, recentActivity, loading } = useDashboard();

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <Badge variant={profile?.role === 'coach' ? 'default' : 'secondary'}>
              {profile?.role || 'loading...'}
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/feed">
              <Button variant="outline" size="sm">Feed</Button>
            </Link>
            <Link to="/post">
              <Button variant="outline" size="sm">Post Video</Button>
            </Link>
            <Link to="/profile">
              <Button variant="outline" size="sm">Profile</Button>
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
            Welcome back, {profile?.display_name || 'Athlete'}!
          </h2>
          <p className="text-muted-foreground">
            {profile?.role === 'coach' 
              ? "Ready to help athletes improve their game?" 
              : "Keep practicing and sharing your progress!"}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Stats Cards */}
          <div className="lg:col-span-2 grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Videos Uploaded</CardTitle>
                <Video className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.videosCount}</div>
                <p className="text-xs text-muted-foreground">
                  {profile?.role === 'athlete' ? 'Keep sharing your practice!' : 'Videos reviewed'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.likesCount}</div>
                <p className="text-xs text-muted-foreground">
                  Likes received on your videos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Comments</CardTitle>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.commentsCount}</div>
                <p className="text-xs text-muted-foreground">
                  Feedback from coaches
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.viewsCount}</div>
                <p className="text-xs text-muted-foreground">
                  Views across all videos
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile?.role === 'athlete' && (
                  <Link to="/post" className="block">
                    <Button className="w-full" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload New Video
                    </Button>
                  </Link>
                )}
                <Link to="/feed" className="block">
                  <Button variant="outline" className="w-full" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Browse Feed
                  </Button>
                </Link>
                <Link to="/profile" className="block">
                  <Button variant="outline" className="w-full" size="sm">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest interactions on your content</CardDescription>
              </CardHeader>
              <CardContent>
                {recentActivity.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No recent activity. Share a video to get started!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-3 text-sm">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'like' ? 'bg-red-500' :
                          activity.type === 'comment' ? 'bg-blue-500' :
                          activity.type === 'view' ? 'bg-green-500' :
                          'bg-primary'
                        }`}></div>
                        <div className="flex-1">
                          <p>
                            <span className="font-medium">
                              {activity.userName || 'Someone'}
                            </span>{' '}
                            {activity.action}{' '}
                            {activity.videoTitle && (
                              <span className="font-medium">
                                "{activity.videoTitle}"
                              </span>
                            )}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Videos */}
        {recentVideos.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Your Recent Videos</CardTitle>
              <CardDescription>Your latest uploads</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {recentVideos.map((video) => (
                  <div key={video.id} className="space-y-2">
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden relative group cursor-pointer">
                      <video 
                        className="w-full h-full object-cover"
                        poster="/placeholder.svg"
                        onPlay={() => {
                          // Track view when video starts playing
                          // This could be implemented with the useVideoViews hook
                        }}
                      >
                        <source src={video.video_url} type="video/mp4" />
                      </video>
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play className="h-12 w-12 text-white" />
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        {video.views || 0} views
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{video.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
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
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {video.views || 0}
                        </span>
                        <span>
                          {formatDistanceToNow(new Date(video.created_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Dashboard;