import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Eye,
  BarChart3,
  Calendar,
  Settings,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useDashboard } from "@/hooks/useDashboard";
import { ThemeToggle } from "@/components/ThemeToggle";

// Enhanced Dashboard Components
import { StatsCards } from "@/components/dashboard/StatsCards";
import { AnalyticsCharts } from "@/components/dashboard/AnalyticsCharts";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { VideoGrid } from "@/components/dashboard/VideoGrid";
import { QuickActions } from "@/components/dashboard/QuickActions";

const Dashboard = () => {
  const { signOut } = useAuth();
  const { profile } = useProfile();
  const { stats, recentVideos, recentActivity, loading } = useDashboard();

  const handleSignOut = async () => {
    await signOut();
  };

  console.log("Dashboard stats:", recentVideos);

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
      <header className="glass-effect border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gradient">Dashboard</h1>
            <Badge
              variant={profile?.role === "coach" ? "default" : "secondary"}
              className="shadow-sm"
            >
              {profile?.role || "loading..."}
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/feed">
              <Button variant="outline" size="sm">
                Feed
              </Button>
            </Link>
            {profile?.role === "athlete" && (
              <Link to="/athlete-comments">
                <Button variant="default" size="sm" className="shadow-md btn-accent">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  View Coach Comments
                </Button>
              </Link>
            )}
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
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold text-gradient">
              Welcome back, {profile?.display_name || "Athlete"}!
            </h2>
            <p className="text-lg text-muted-foreground">
              {profile?.role === "coach"
                ? "Ready to help athletes reach their potential?"
                : "Track your progress and keep improving your game!"}
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Badge variant="outline" className="px-3 py-1">
              <Calendar className="h-4 w-4 mr-2" />
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Badge>
            
            <Badge variant="secondary" className="px-3 py-1">
              <BarChart3 className="h-4 w-4 mr-2" />
              {stats.videosCount} Videos Uploaded
            </Badge>
            
            {stats.viewsCount > 0 && (
              <Badge variant="default" className="px-3 py-1 btn-accent">
                <Eye className="h-4 w-4 mr-2" />
                {stats.viewsCount.toLocaleString()} Total Views
              </Badge>
            )}
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <StatsCards stats={stats} />

        {/* Main Dashboard Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Analytics Charts - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <AnalyticsCharts stats={stats} />
          </div>

          {/* Sidebar with Actions and Activity */}
          <div className="space-y-6">
            <QuickActions userRole={profile?.role} stats={stats} />
            <ActivityTimeline activities={recentActivity} loading={loading} />
          </div>
        </div>

        {/* Video Grid */}
        <VideoGrid videos={recentVideos} loading={loading} />
      </main>
    </div>
  );
};

export default Dashboard;
