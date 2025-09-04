import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Video {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  video_url: string;
  sport: 'tennis' | 'volleyball' | 'football' | 'golf' | 'basketball' | 'other' | null;
  skill_level: 'L1' | 'L2' | 'L3' | null;
  is_coaches_only: boolean;
  created_at: string;
  updated_at: string;
  profiles?: {
    display_name: string | null;
    avatar_url: string | null;
    role: 'athlete' | 'coach';
  } | null;
  likes_count?: number;
  comments_count?: number;
  views_count?: number;
  user_liked?: boolean;
}

export function useVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchVideos = async () => {
    if (!user) return;

    try {
      // Get user profile to check role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      const isCoach = profile?.role === 'coach';

      // Build query based on user role
      // Build query to get all videos (public videos for athletes, all videos for coaches)
      let query = supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      // If not a coach, only show non-coaches-only videos or own videos
      if (!isCoach) {
        query = query.or(`is_coaches_only.eq.false,user_id.eq.${user.id}`);
      }

      const { data: videosData, error } = await query;

      if (error) throw error;

      console.log('Fetched videos:', videosData); // Debug log

      // Get user profiles for all videos
      const userIds = videosData?.map(v => v.user_id) || [];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, display_name, avatar_url, role')
        .in('user_id', userIds);

      console.log('Fetched profiles:', profilesData); // Debug log

      // Fetch like counts, comment counts, and user likes for each video
      const videosWithCounts = await Promise.all(
        (videosData || []).map(async (video) => {
          // Get likes count
          const { count: likesCount } = await supabase
            .from('likes')
            .select('*', { count: 'exact', head: true })
            .eq('video_id', video.id);

          // Get comments count
          const { count: commentsCount } = await supabase
            .from('comments')
            .select('*', { count: 'exact', head: true })
            .eq('video_id', video.id);

          // Get views count
          const { count: viewsCount } = await supabase
            .from('video_views')
            .select('*', { count: 'exact', head: true })
            .eq('video_id', video.id);

          // Check if current user liked this video
          const { data: userLike } = await supabase
            .from('likes')
            .select('id')
            .eq('video_id', video.id)
            .eq('user_id', user.id)
            .single();

          // Find profile for this video
          const profile = profilesData?.find(p => p.user_id === video.user_id);

          return {
            ...video,
            likes_count: likesCount || 0,
            comments_count: commentsCount || 0,
            views_count: viewsCount || 0,
            user_liked: !!userLike,
            profiles: profile || null
          };
        })
      );

      console.log('Videos with all data:', videosWithCounts); // Debug log
      setVideos(videosWithCounts);
    } catch (error: any) {
      console.error('Error fetching videos:', error);
      toast({
        title: "Error",
        description: "Failed to load videos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (videoId: string) => {
    if (!user) return;

    try {
      const video = videos.find(v => v.id === videoId);
      if (!video) return;

      if (video.user_liked) {
        // Unlike
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('video_id', videoId)
          .eq('user_id', user.id);

        if (error) throw error;

        setVideos(prev => prev.map(v => 
          v.id === videoId 
            ? { ...v, likes_count: (v.likes_count || 0) - 1, user_liked: false }
            : v
        ));
      } else {
        // Like
        const { error } = await supabase
          .from('likes')
          .insert({ video_id: videoId, user_id: user.id });

        if (error) throw error;

        setVideos(prev => prev.map(v => 
          v.id === videoId 
            ? { ...v, likes_count: (v.likes_count || 0) + 1, user_liked: true }
            : v
        ));
      }
    } catch (error: any) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive",
      });
    }
  };

  const addComment = async (videoId: string, content: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          video_id: videoId,
          user_id: user.id,
          content
        });

      if (error) throw error;

      // Update comment count
      setVideos(prev => prev.map(v => 
        v.id === videoId 
          ? { ...v, comments_count: (v.comments_count || 0) + 1 }
          : v
      ));

      toast({
        title: "Success",
        description: "Comment added successfully",
      });
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    }
  };

  const getUserVideos = async (userId?: string) => {
    const targetUserId = userId || user?.id;
    if (!targetUserId) return [];

    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching user videos:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchVideos();

    // Set up real-time subscription for videos
    const videosSubscription = supabase
      .channel('videos_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'videos'
      }, () => {
        fetchVideos();
      })
      .subscribe();

    // Set up real-time subscription for likes
    const likesSubscription = supabase
      .channel('likes_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'likes'
      }, () => {
        fetchVideos();
      })
      .subscribe();

    // Set up real-time subscription for comments
    const commentsSubscription = supabase
      .channel('comments_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'comments'
      }, () => {
        fetchVideos();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(videosSubscription);
      supabase.removeChannel(likesSubscription);
      supabase.removeChannel(commentsSubscription);
    };
  }, [user]);

  return {
    videos,
    loading,
    toggleLike,
    addComment,
    getUserVideos,
    refetch: fetchVideos
  };
}