-- Create video views tracking table
CREATE TABLE public.video_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table for real-time updates
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('like', 'comment', 'video_upload', 'reward')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create activity log table
CREATE TABLE public.activity_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.video_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for video_views
CREATE POLICY "Anyone can insert video views" 
ON public.video_views FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view all video views" 
ON public.video_views FOR SELECT 
USING (true);

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" 
ON public.notifications FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
ON public.notifications FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for activity_log
CREATE POLICY "Users can view their own activity" 
ON public.activity_log FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity" 
ON public.activity_log FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Function to create notification
CREATE OR REPLACE FUNCTION public.create_notification(
  target_user_id UUID,
  notification_type TEXT,
  notification_title TEXT,
  notification_message TEXT,
  notification_data JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, data)
  VALUES (target_user_id, notification_type, notification_title, notification_message, notification_data)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

-- Function to log activity
CREATE OR REPLACE FUNCTION public.log_activity(
  user_id UUID,
  action_name TEXT,
  resource_type_name TEXT,
  resource_id_value UUID DEFAULT NULL,
  metadata_value JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  activity_id UUID;
BEGIN
  INSERT INTO public.activity_log (user_id, action, resource_type, resource_id, metadata)
  VALUES (user_id, action_name, resource_type_name, resource_id_value, metadata_value)
  RETURNING id INTO activity_id;
  
  RETURN activity_id;
END;
$$;

-- Trigger function for video likes notification
CREATE OR REPLACE FUNCTION public.handle_video_like()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  video_owner_id UUID;
  video_title TEXT;
  liker_name TEXT;
BEGIN
  -- Get video owner and title
  SELECT user_id, title INTO video_owner_id, video_title
  FROM public.videos WHERE id = NEW.video_id;
  
  -- Get liker name
  SELECT display_name INTO liker_name
  FROM public.profiles WHERE user_id = NEW.user_id;
  
  -- Don't notify if user likes their own video
  IF video_owner_id != NEW.user_id THEN
    -- Create notification
    PERFORM public.create_notification(
      video_owner_id,
      'like',
      'New Like',
      COALESCE(liker_name, 'Someone') || ' liked your video "' || video_title || '"',
      jsonb_build_object('video_id', NEW.video_id, 'liker_id', NEW.user_id)
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger function for video comments notification
CREATE OR REPLACE FUNCTION public.handle_video_comment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  video_owner_id UUID;
  video_title TEXT;
  commenter_name TEXT;
BEGIN
  -- Get video owner and title
  SELECT user_id, title INTO video_owner_id, video_title
  FROM public.videos WHERE id = NEW.video_id;
  
  -- Get commenter name
  SELECT display_name INTO commenter_name
  FROM public.profiles WHERE user_id = NEW.user_id;
  
  -- Don't notify if user comments on their own video
  IF video_owner_id != NEW.user_id THEN
    -- Create notification
    PERFORM public.create_notification(
      video_owner_id,
      'comment',
      'New Comment',
      COALESCE(commenter_name, 'Someone') || ' commented on your video "' || video_title || '"',
      jsonb_build_object('video_id', NEW.video_id, 'comment_id', NEW.id, 'commenter_id', NEW.user_id)
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create triggers
CREATE TRIGGER on_video_liked
  AFTER INSERT ON public.likes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_video_like();

CREATE TRIGGER on_video_commented
  AFTER INSERT ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_video_comment();

-- Create indexes for better performance
CREATE INDEX idx_video_views_video_id ON public.video_views(video_id);
CREATE INDEX idx_video_views_user_id ON public.video_views(user_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);
CREATE INDEX idx_activity_log_user_id ON public.activity_log(user_id);
CREATE INDEX idx_activity_log_created_at ON public.activity_log(created_at);