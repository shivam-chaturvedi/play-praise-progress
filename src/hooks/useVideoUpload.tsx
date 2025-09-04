import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface VideoData {
  title: string;
  description: string;
  sport: 'tennis' | 'volleyball' | 'football' | 'golf' | 'basketball' | 'other';
  skill_level: 'L1' | 'L2' | 'L3';
  is_coaches_only: boolean;
}

export function useVideoUpload() {
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const uploadVideo = async (file: File, videoData: VideoData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to upload videos",
        variant: "destructive",
      });
      return null;
    }

    setUploading(true);

    try {
      // Upload video file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data } = supabase.storage
        .from('videos')
        .getPublicUrl(filePath);

      // Save video metadata to database
      const { data: videoRecord, error: dbError } = await supabase
        .from('videos')
        .insert({
          user_id: user.id,
          title: videoData.title,
          description: videoData.description,
          video_url: data.publicUrl,
          sport: videoData.sport,
          skill_level: videoData.skill_level,
          is_coaches_only: videoData.is_coaches_only
        })
        .select()
        .single();

      if (dbError) throw dbError;

      toast({
        title: "Success!",
        description: "Video uploaded successfully",
      });

      return videoRecord;
    } catch (error: any) {
      console.error('Error uploading video:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload video",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadVideo,
    uploading
  };
}