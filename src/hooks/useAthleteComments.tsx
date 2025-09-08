import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Comment } from '@/hooks/useComments';

export interface AthleteComment extends Comment {
  video: {
    id: string;
    title: string;
    sport: string | null;
    skill_level: string | null;
    video_url: string;
  };
}

export function useAthleteComments(videoIds: string[]) {
  const [comments, setComments] = useState<AthleteComment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchComments = async () => {
    if (!videoIds.length) {
      setComments([]);
      setLoading(false);
      return;
    }

    try {
      // Fetch all comments for the user's videos
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select(`
          *,
          videos (
            id,
            title,
            sport,
            skill_level,
            video_url
          )
        `)
        .in('video_id', videoIds)
        .order('created_at', { ascending: false });

      if (commentsError) throw commentsError;

      // Get user profiles for all comments
      const userIds = commentsData?.map(c => c.user_id) || [];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, display_name, avatar_url, role')
        .in('user_id', userIds);

      // Combine comments with profiles and videos
      const commentsWithProfiles = (commentsData || []).map(comment => {
        const profile = profilesData?.find(p => p.user_id === comment.user_id);
        return {
          ...comment,
          profiles: profile || null,
          video: comment.videos
        };
      });

      setComments(commentsWithProfiles);
    } catch (error: any) {
      console.error('Error fetching athlete comments:', error);
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();

    // Set up real-time subscription for comments on all videos
    const subscription = supabase
      .channel('athlete_comments')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'comments',
        filter: `video_id=in.(${videoIds.join(',')})`
      }, () => {
        fetchComments();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [videoIds.join(','), user]);

  return {
    comments,
    loading,
    refetch: fetchComments
  };
}