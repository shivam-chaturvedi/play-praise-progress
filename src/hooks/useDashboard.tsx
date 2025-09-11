import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  videosCount: number;
  likesCount: number;
  commentsCount: number;
  rewardsCount: number;
  viewsCount: number;
  followersCount: number;
}

interface ActivityItem {
  id: string;
  type: 'like' | 'comment' | 'upload' | 'view';
  action: string;
  videoTitle?: string;
  userName?: string;
  created_at: string;
}

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    videosCount: 0,
    likesCount: 0,
    commentsCount: 0,
    rewardsCount: 0,
    viewsCount: 0,
    followersCount: 0
  });
  const [recentVideos, setRecentVideos] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [liveStats, setLiveStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      // Fetch user's videos count
      const { count: videosCount } = await supabase
        .from('videos')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Fetch user's videos for stats calculation
      const { data: userVideos } = await supabase
        .from('videos')
        .select('id')
        .eq('user_id', user.id);

      const videoIds = userVideos?.map(v => v.id) || [];
      
      let likesCount = 0;
      let commentsCount = 0;
      let viewsCount = 0;

      if (videoIds.length > 0) {
        // Get total likes on user's videos
        const { count: totalLikes } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .in('video_id', videoIds);

        // Get total comments on user's videos
        const { count: totalComments } = await supabase
          .from('comments')
          .select('*', { count: 'exact', head: true })
          .in('video_id', videoIds);

        // Get total views on user's videos
        const { count: totalViews } = await supabase
          .from('video_views')
          .select('*', { count: 'exact', head: true })
          .in('video_id', videoIds);

        likesCount = totalLikes || 0;
        commentsCount = totalComments || 0;
        viewsCount = totalViews || 0;
      }

      // Fetch rewards count (received as athlete)
      const { count: rewardsCount } = await supabase
        .from('rewards')
        .select('*', { count: 'exact', head: true })
        .eq('athlete_id', user.id);

      setStats({
        videosCount: videosCount || 0,
        likesCount,
        commentsCount,
        rewardsCount: rewardsCount || 0,
        viewsCount,
        followersCount: 0 // TODO: Implement followers system
      });

      // Fetch recent videos with view counts
      const { data: videos } = await supabase
        .from('videos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      // Add view counts to videos
      const videosWithViews = await Promise.all(
        (videos || []).map(async (video) => {
          const { count: viewCount } = await supabase
            .from('video_views')
            .select('*', { count: 'exact', head: true })
            .eq('video_id', video.id);

          return {
            ...video,
            views: viewCount || 0
          };
        })
      );

      setRecentVideos(videosWithViews);

      // Fetch recent activity with more detail
      const activity: ActivityItem[] = [];

      if (videoIds.length > 0) {
        // Recent likes - fetch separately and join manually
        const { data: recentLikes } = await supabase
          .from('likes')
          .select('*')
          .in('video_id', videoIds)
          .order('created_at', { ascending: false })
          .limit(5);

        // Recent comments - fetch separately and join manually
        const { data: recentComments } = await supabase
          .from('comments')
          .select('*')
          .in('video_id', videoIds)
          .order('created_at', { ascending: false })
          .limit(5);

        // Recent views - fetch separately and join manually
        const { data: recentViews } = await supabase
          .from('video_views')
          .select('*')
          .in('video_id', videoIds)
          .order('created_at', { ascending: false })
          .limit(5);

        // Get all user IDs from activities
        const allUserIds = [
          ...(recentLikes || []).map(l => l.user_id),
          ...(recentComments || []).map(c => c.user_id),
          ...(recentViews || []).map(v => v.user_id).filter(Boolean)
        ];

        // Get profiles for all users
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, display_name')
          .in('user_id', allUserIds);

        // Get video titles
        const { data: videos } = await supabase
          .from('videos')
          .select('id, title')
          .in('id', videoIds);

        // Combine activities with profile and video data
        (recentLikes || []).forEach(like => {
          const profile = profiles?.find(p => p.user_id === like.user_id);
          const video = videos?.find(v => v.id === like.video_id);
          activity.push({
            id: like.id,
            type: 'like',
            action: 'liked your video',
            videoTitle: video?.title,
            userName: profile?.display_name,
            created_at: like.created_at
          });
        });

        (recentComments || []).forEach(comment => {
          const profile = profiles?.find(p => p.user_id === comment.user_id);
          const video = videos?.find(v => v.id === comment.video_id);
          activity.push({
            id: comment.id,
            type: 'comment',
            action: 'commented on your video',
            videoTitle: video?.title,
            userName: profile?.display_name,
            created_at: comment.created_at
          });
        });

        (recentViews || []).forEach(view => {
          const profile = profiles?.find(p => p.user_id === view.user_id);
          const video = videos?.find(v => v.id === view.video_id);
          activity.push({
            id: view.id,
            type: 'view',
            action: 'viewed your video',
            videoTitle: video?.title,
            userName: profile?.display_name || 'Anonymous',
            created_at: view.created_at
          });
        });
      }

      // Sort all activity by date and limit to top 4
      activity.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setRecentActivity(activity.slice(0, 4));

    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Set up real-time subscriptions for live updates
    const videosSubscription = supabase
      .channel('dashboard_videos')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'videos',
        filter: `user_id=eq.${user?.id}`
      }, () => {
        fetchDashboardData();
      })
      .subscribe();

    const likesSubscription = supabase
      .channel('dashboard_likes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'likes'
      }, () => {
        fetchDashboardData();
      })
      .subscribe();

    const commentsSubscription = supabase
      .channel('dashboard_comments')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'comments'
      }, () => {
        fetchDashboardData();
      })
      .subscribe();

    const viewsSubscription = supabase
      .channel('dashboard_views')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'video_views'
      }, () => {
        fetchDashboardData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(videosSubscription);
      supabase.removeChannel(likesSubscription);
      supabase.removeChannel(commentsSubscription);
      supabase.removeChannel(viewsSubscription);
    };
  }, [user]);

  return {
    stats,
    recentVideos,
    recentActivity,
    liveStats,
    loading,
    refetch: fetchDashboardData
  };
}