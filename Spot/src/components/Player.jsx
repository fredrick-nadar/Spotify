import React, { useState, useEffect } from 'react';
import { 
  PlayIcon, 
  PauseIcon, 
  BackwardIcon, 
  ForwardIcon, 
  SpeakerWaveIcon,
  HeartIcon,
  QueueListIcon
} from '@heroicons/react/24/solid';
import { 
  ArrowsRightLeftIcon, 
  ArrowPathIcon,
  SpeakerXMarkIcon,
  ComputerDesktopIcon,
  HeartIcon as HeartOutlineIcon
} from '@heroicons/react/24/outline';
import { useMusicContext } from '../context/MusicContext';

const Player = () => {
  const { 
    currentSong, 
    isPlaying, 
    togglePlay, 
    nextSong, 
    previousSong 
  } = useMusicContext();

  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(65);
  const [liked, setLiked] = useState(false);
  const [currentTime, setCurrentTime] = useState('0:00');

  // Simulate progress bar movement when playing
  useEffect(() => {
    let interval;
    if (isPlaying && currentSong) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 0;
          }
          return prev + 0.1;
        });
        
        // Update current time based on progress
        const songDuration = parseDuration(currentSong.duration);
        const currentSeconds = Math.floor((progress / 100) * songDuration);
        setCurrentTime(formatTime(currentSeconds));
        
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentSong, progress]);

  // Parse duration string (e.g. "3:45") to seconds
  const parseDuration = (duration) => {
    if (!duration) return 0;
    const parts = duration.split(':');
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  };

  // Format seconds to mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    setVolume(parseInt(e.target.value));
  };

  if (!currentSong) {
    return (
      <div className="h-20 bg-[#181818] border-t border-[#282828] px-6 flex items-center justify-center text-gray-400">
        <span className="text-sm font-medium">Choose a song to start listening</span>
      </div>
    );
  }

  return (
    <div className="h-20 bg-[#181818] border-t border-[#282828] px-6 flex items-center justify-between fixed bottom-0 w-full">
      {/* Currently Playing */}
      <div className="flex items-center space-x-4 w-1/4 min-w-[180px]">
        <img 
          src={currentSong.imageUrl} 
          alt={currentSong.title} 
          className="h-14 w-14 rounded shadow group-hover:opacity-80"
        />
        <div className="flex flex-col">
          <h4 className="text-white text-sm font-medium hover:underline cursor-pointer">{currentSong.title}</h4>
          <p className="text-gray-400 text-xs hover:text-white hover:underline cursor-pointer">{currentSong.artist}</p>
        </div>
        <button 
          className="text-gray-400 hover:text-white"
          onClick={() => setLiked(!liked)}
        >
          {liked ? (
            <HeartIcon className="h-5 w-5 text-green-500" />
          ) : (
            <HeartOutlineIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Player Controls */}
      <div className="flex flex-col items-center space-y-1 max-w-[45%] w-2/5">
        <div className="flex items-center space-x-4">
          <button className="text-gray-400 hover:text-white p-1">
            <ArrowsRightLeftIcon className="h-4 w-4" />
          </button>
          <button 
            className="text-gray-400 hover:text-white p-1"
            onClick={previousSong}
          >
            <BackwardIcon className="h-4 w-4" />
          </button>
          <button 
            className="bg-white rounded-full p-2 hover:scale-105 mx-2"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <PauseIcon className="h-5 w-5 text-black" />
            ) : (
              <PlayIcon className="h-5 w-5 text-black" />
            )}
          </button>
          <button 
            className="text-gray-400 hover:text-white p-1"
            onClick={nextSong}
          >
            <ForwardIcon className="h-4 w-4" />
          </button>
          <button className="text-gray-400 hover:text-white p-1">
            <ArrowPathIcon className="h-4 w-4" />
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full flex items-center space-x-2">
          <span className="text-xs text-gray-400 w-8 text-right">{currentTime}</span>
          <div className="relative flex-1 h-1 bg-gray-600 rounded-full group cursor-pointer">
            <div 
              className="absolute h-full bg-white group-hover:bg-green-500 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
            <div 
              className="absolute h-3 w-3 bg-white rounded-full -mt-1 opacity-0 group-hover:opacity-100" 
              style={{ left: `${progress}%`, transform: 'translateX(-50%)' }}
            ></div>
          </div>
          <span className="text-xs text-gray-400 w-8">{currentSong.duration}</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3 w-1/4 justify-end min-w-[180px]">
        <button className="text-gray-400 hover:text-white">
          <QueueListIcon className="h-4 w-4" />
        </button>
        <button className="text-gray-400 hover:text-white">
          <ComputerDesktopIcon className="h-4 w-4" />
        </button>
        
        {/* Volume Controls */}
        <div className="flex items-center space-x-2 group">
          <button className="text-gray-400 group-hover:text-white">
            {volume === 0 ? (
              <SpeakerXMarkIcon className="h-4 w-4" />
            ) : (
              <SpeakerWaveIcon className="h-4 w-4" />
            )}
          </button>
          <div className="w-24 relative">
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={volume} 
              onChange={handleVolumeChange}
              className="w-full h-1 bg-gray-600 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, white ${volume}%, #4d4d4d ${volume}%)`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;