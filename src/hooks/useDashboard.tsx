import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  videosCount: number;
  likesCount: number;
  commentsCount: number;
  rewardsCount: number;
}

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    videosCount: 0,
    likesCount: 0,
    commentsCount: 0,
    rewardsCount: 0
  });
  const [recentVideos, setRecentVideos] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
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

      // Fetch total likes on user's videos
      const { data: userVideos } = await supabase
        .from('videos')
        .select('id')
        .eq('user_id', user.id);

      const videoIds = userVideos?.map(v => v.id) || [];
      
      let likesCount = 0;
      let commentsCount = 0;

      if (videoIds.length > 0) {
        const { count: totalLikes } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .in('video_id', videoIds);

        const { count: totalComments } = await supabase
          .from('comments')
          .select('*', { count: 'exact', head: true })
          .in('video_id', videoIds);

        likesCount = totalLikes || 0;
        commentsCount = totalComments || 0;
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
        rewardsCount: rewardsCount || 0
      });

      // Fetch recent videos
      const { data: videos } = await supabase
        .from('videos')
        .select(`
          *,
          profiles!videos_user_id_fkey (
            display_name,
            avatar_url,
            role
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      setRecentVideos(videos || []);

      // Fetch recent activity (likes and comments on user's videos)
      const recentLikes = videoIds.length > 0 ? await supabase
        .from('likes')
        .select(`
          *,
          videos!likes_video_id_fkey (title),
          profiles!likes_user_id_fkey (display_name)
        `)
        .in('video_id', videoIds)
        .order('created_at', { ascending: false })
        .limit(5) : { data: [] };

      const recentComments = videoIds.length > 0 ? await supabase
        .from('comments')
        .select(`
          *,
          videos!comments_video_id_fkey (title),
          profiles!comments_user_id_fkey (display_name)
        `)
        .in('video_id', videoIds)
        .order('created_at', { ascending: false })
        .limit(5) : { data: [] };

      // Combine and sort activity
      const allActivity = [
        ...(recentLikes.data || []).map(like => ({
          ...like,
          type: 'like',
          action: 'liked your video'
        })),
        ...(recentComments.data || []).map(comment => ({
          ...comment,
          type: 'comment',
          action: 'commented on your video'
        }))
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
       .slice(0, 5);

      setRecentActivity(allActivity);

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

    // Set up real-time subscriptions
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

    return () => {
      supabase.removeChannel(videosSubscription);
      supabase.removeChannel(likesSubscription);
      supabase.removeChannel(commentsSubscription);
    };
  }, [user]);

  return {
    stats,
    recentVideos,
    recentActivity,
    loading,
    refetch: fetchDashboardData
  };
}