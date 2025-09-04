import React, { useRef, useState } from 'react';
import { Play, Volume2, VolumeX } from 'lucide-react';
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
  const [hasTrackedView, setHasTrackedView] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const handlePlay = () => {
    if (videoRef.current) {
      if (!hasTrackedView) {
        trackView();
        setHasTrackedView(true);
      }
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video 
        ref={videoRef}
        className={className}
        poster={poster}
        preload="metadata"
        onPlay={() => {
          if (!hasTrackedView) {
            trackView();
            setHasTrackedView(true);
          }
          setIsPlaying(true);
        }}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onClick={togglePlayPause}
        crossOrigin="anonymous"
      >
        <source src={videoUrl} type="video/mp4" />
        <source src={videoUrl} type="video/webm" />
        <source src={videoUrl} type="video/ogg" />
        Your browser does not support the video tag.
      </video>
      
      {/* Play/Pause Overlay */}
      {(!isPlaying || showControls) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity">
          <button
            onClick={togglePlayPause}
            className="bg-black/50 text-white rounded-full p-3 hover:bg-black/70 transition-colors"
          >
            {isPlaying ? (
              <div className="w-6 h-6 flex items-center justify-center">
                <div className="w-2 h-4 bg-white rounded-sm mr-1"></div>
                <div className="w-2 h-4 bg-white rounded-sm"></div>
              </div>
            ) : (
              <Play className="h-6 w-6 ml-1" fill="white" />
            )}
          </button>
        </div>
      )}

      {/* View Counter */}
      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
        {views} views
      </div>

      {/* Volume Control */}
      {showControls && (
        <button
          onClick={toggleMute}
          className="absolute bottom-2 left-2 bg-black/60 text-white p-2 rounded hover:bg-black/80 transition-colors"
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      )}
    </div>
  );
};