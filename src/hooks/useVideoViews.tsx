import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export function useVideoViews(videoId: string) {
  const [views, setViews] = useState(0);
  const { user } = useAuth();

  const trackView = async (videoId: string) => {
    if (!videoId) return;


    try {
      await supabase
        .from('video_views')
        .insert({
          video_id: videoId,
          user_id: user?.id || null,
          ip_address: null, 
          user_agent: navigator.userAgent
        });

      // Update view count
      fetchViews();
    } catch (error) {
      console.error('Error tracking video view:', error);
    }
  };

  const fetchViews = async () => {
    if (!videoId) return;

    try {
      const { count } = await supabase
        .from('video_views')
        .select('*', { count: 'exact', head: true })
        .eq('video_id', videoId);

      setViews(count || 0);
    } catch (error) {
      console.error('Error fetching video views:', error);
    }
  };

  useEffect(() => {
    fetchViews();
  }, [videoId]);

  return {
    views,
    trackView,
    refetch: fetchViews
  };
}