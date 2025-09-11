import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Eye,
  BarChart3,
  Calendar,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useDashboard } from "@/hooks/useDashboard";
import { useVideos } from "@/hooks/useVideos";
import { ThemeToggle } from "@/components/ThemeToggle";

// Enhanced Dashboard Components
import { StatsCards } from "@/components/dashboard/StatsCards";
import { AnalyticsCharts } from "@/components/dashboard/AnalyticsCharts";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { VideoGrid } from "@/components/dashboard/VideoGrid";
import { QuickActions } from "@/components/dashboard/QuickActions";

const Dashboard = () => {
  const { signOut, user } = useAuth();
  const { profile } = useProfile();
  const { stats, recentActivity, loading } = useDashboard();
  const { getUserVideos } = useVideos();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userVideos, setUserVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(true);

  const handleSignOut = async () => {
    await signOut();
  };

  // Fetch user's own videos on component mount
  React.useEffect(() => {
    const fetchUserVideos = async () => {
      if (user?.id) {
        setVideosLoading(true);
        const videos = await getUserVideos(user.id);
        setUserVideos(videos);
        setVideosLoading(false);
      }
    };
    
    fetchUserVideos();
  }, [user?.id]); // Removed getUserVideos from dependencies to prevent infinite re-renders

  console.log("Dashboard stats:", userVideos);

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
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <h1 className="text-xl sm:text-2xl font-bold text-gradient">Dashboard</h1>
              <Badge
                variant={profile?.role === "coach" ? "default" : "secondary"}
                className="shadow-sm text-xs"
              >
                {profile?.role || "loading..."}
              </Badge>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2"
              >
                {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2 lg:gap-3 flex-wrap">
              <Link to="/feed">
                <Button variant="outline" size="sm">
                  Feed
                </Button>
              </Link>
              {profile?.role === "athlete" && (
                <Link to="/athlete-comments">
                  <Button variant="default" size="sm" className="shadow-md btn-accent">
                    <MessageCircle className="h-4 w-4 mr-1 lg:mr-2" />
                    <span className="hidden lg:inline">View Coach </span>Comments
                  </Button>
                </Link>
              )}
              <Link to="/post">
                <Button variant="outline" size="sm">
                  <span className="hidden lg:inline">Post </span>Video
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
          
          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-border pt-4 animate-slide-in-right">
              <div className="flex flex-col gap-3">
                <Link to="/feed" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Feed
                  </Button>
                </Link>
                {profile?.role === "athlete" && (
                  <Link to="/athlete-comments" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="default" size="sm" className="w-full justify-start shadow-md btn-accent">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      View Coach Comments
                    </Button>
                  </Link>
                )}
                <Link to="/post" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Eye className="h-4 w-4 mr-2" />
                    Post Video
                  </Button>
                </Link>
                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="w-full justify-start"
                >
                  <X className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 sm:py-6 lg:py-8 space-y-6 sm:space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gradient">
              Welcome back, {profile?.display_name || "Athlete"}!
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground px-4">
              {profile?.role === "coach"
                ? "Ready to help athletes reach their potential?"
                : "Track your progress and keep improving your game!"}
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
            <Badge variant="outline" className="px-2 sm:px-3 py-1 text-xs sm:text-sm">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
              <span className="sm:hidden">
                {new Date().toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            </Badge>
            
            <Badge variant="secondary" className="px-2 sm:px-3 py-1 text-xs sm:text-sm">
              <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              {stats.videosCount} Video{stats.videosCount !== 1 ? 's' : ''}
            </Badge>
            
            {stats.viewsCount > 0 && (
              <Badge variant="default" className="px-2 sm:px-3 py-1 text-xs sm:text-sm btn-accent">
                <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                {stats.viewsCount.toLocaleString()} Views
              </Badge>
            )}
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <StatsCards stats={stats} />

        {/* Main Dashboard Grid */}
        <div className="grid gap-4 sm:gap-6 lg:gap-8 lg:grid-cols-3">
          {/* Analytics Charts - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <AnalyticsCharts stats={stats} recentVideos={userVideos} />
          </div>

          {/* Sidebar with Actions and Activity */}
          <div className="space-y-4 sm:space-y-6">
            <QuickActions userRole={profile?.role} stats={stats} />
            <ActivityTimeline activities={recentActivity} loading={loading} />
          </div>
        </div>

        {/* Video Grid */}
        <VideoGrid videos={userVideos} loading={videosLoading} />
      </main>
    </div>
  );
};

export default Dashboard;