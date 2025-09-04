import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Comment {
  id: string;
  user_id: string;
  video_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    display_name: string | null;
    avatar_url: string | null;
    role: 'athlete' | 'coach';
  };
}

export function useComments(videoId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchComments = async () => {
    if (!videoId) return;

    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles (
            display_name,
            avatar_url,
            role
          )
        `)
        .eq('video_id', videoId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error: any) {
      console.error('Error fetching comments:', error);
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (content: string) => {
    if (!user || !videoId) return;

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          video_id: videoId,
          user_id: user.id,
          content
        })
        .select(`
          *,
          profiles (
            display_name,
            avatar_url,
            role
          )
        `)
        .single();

      if (error) throw error;

      setComments(prev => [...prev, data]);
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

  const deleteComment = async (commentId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user.id);

      if (error) throw error;

      setComments(prev => prev.filter(c => c.id !== commentId));
      toast({
        title: "Success",
        description: "Comment deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting comment:', error);
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchComments();

    // Set up real-time subscription for comments
    const subscription = supabase
      .channel(`comments_${videoId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'comments',
        filter: `video_id=eq.${videoId}`
      }, () => {
        fetchComments();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [videoId, user]);

  return {
    comments,
    loading,
    addComment,
    deleteComment,
    refetch: fetchComments
  };
}