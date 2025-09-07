-- Fix critical security issues for comment_coins table

-- Enable RLS on comment_coins table and add policies
ALTER TABLE public.comment_coins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own coin transactions" 
ON public.comment_coins 
FOR SELECT 
USING (auth.uid() = from_user OR auth.uid() = to_user);

CREATE POLICY "Users can give coins to others" 
ON public.comment_coins 
FOR INSERT 
WITH CHECK (auth.uid() = from_user);

-- Restrict video_views table access - users can only see their own views
DROP POLICY IF EXISTS "Users can view all video views" ON public.video_views;
CREATE POLICY "Users can view their own video views" 
ON public.video_views 
FOR SELECT 
USING (auth.uid() = user_id);

-- Video owners can see views on their videos
CREATE POLICY "Video owners can see views on their videos" 
ON public.video_views 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.videos 
    WHERE videos.id = video_views.video_id 
    AND videos.user_id = auth.uid()
  )
);