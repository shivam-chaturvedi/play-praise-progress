-- Enable realtime for videos table
ALTER TABLE public.videos REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.videos;

-- Enable realtime for other tables  
ALTER TABLE public.likes REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.likes;

ALTER TABLE public.comments REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;

ALTER TABLE public.video_views REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.video_views;

ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;