import React, { useRef } from 'react';
import { useVideoViews } from '@/hooks/useVideoViews';

interface VideoPlayerProps {
  videoUrl: string;
  videoId: string;
  poster?: string;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  videoUrl, 
  videoId, 
  poster = "/placeholder.svg",
  className = "w-full h-full object-cover"
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { views, trackView } = useVideoViews(videoId);
  const [hasTrackedView, setHasTrackedView] = React.useState(false);

  const handlePlay = () => {
    if (!hasTrackedView) {
      trackView();
      setHasTrackedView(true);
    }
  };

  return (
    <div className="relative">
      <video 
        ref={videoRef}
        controls 
        className={className}
        poster={poster}
        onPlay={handlePlay}
        preload="metadata"
      >
        <source src={videoUrl} type="video/mp4" />
        <source src={videoUrl} type="video/webm" />
        <source src={videoUrl} type="video/ogg" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
        {views} views
      </div>
    </div>
  );
};