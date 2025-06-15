import React, { useState, useEffect, useRef } from 'react';
import { 
  PlayIcon, 
  PauseIcon, 
  BackwardIcon, 
  ForwardIcon, 
  SpeakerWaveIcon,
  HeartIcon,
  QueueListIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from '@heroicons/react/24/solid';
import { 
  ArrowsRightLeftIcon, 
  ArrowPathIcon,
  SpeakerXMarkIcon,
  ComputerDesktopIcon,
  HeartIcon as HeartOutlineIcon
} from '@heroicons/react/24/outline';
import { useMusicContext } from '../context/MusicContext';
import TrackCard from './TrackCard';

// Sound wave animation component
const SoundWave = ({ isPlaying }) => {
  return (
    <div className={`flex items-end h-3 space-x-0.5 ${isPlaying ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
      {[1, 2, 3, 4, 5].map((bar) => (
        <div 
          key={bar}
          className="w-0.5 bg-[#1ed760] rounded-full"
          style={{
            height: `${Math.random() * 100}%`,
            animation: isPlaying ? `soundWave ${0.5 + Math.random() * 0.5}s ease-in-out infinite alternate` : 'none'
          }}
        ></div>
      ))}
    </div>
  );
};

const Player = () => {
  const { 
    currentSong, 
    isPlaying, 
    togglePlay, 
    nextSong, 
    previousSong,
    queue,
    currentPlaylist,
    showPlaylistInPlayer,
    togglePlaylistInPlayer,
    currentTime,
    duration,
    volume,
    seekTo,
    setAudioVolume
  } = useMusicContext();

  const [liked, setLiked] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const progressBarRef = useRef(null);

  // Calculate progress percentage
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Format seconds to mm:ss
  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle progress bar click
  const handleProgressClick = (e) => {
    if (!progressBarRef.current || !duration) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const percentage = clickPosition / rect.width;
    const newTime = percentage * duration;
    
    seekTo(newTime);
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value) / 100;
    setAudioVolume(newVolume);
  };
  
  // Toggle expanded view
  const toggleExpanded = () => {
    setExpanded(!expanded);
    togglePlaylistInPlayer();
  };

  // Add styles for sound wave animation
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes soundWave {
        0% { height: 10%; }
        100% { height: 100%; }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (!currentSong) {
    return (
      <div className="h-20 bg-[#181818] border-t border-[#282828] px-6 flex items-center justify-center text-gray-400">
        <span className="text-sm font-medium">Choose a song to start listening</span>
      </div>
    );
  }

  return (
    <div className={`${expanded ? 'h-96' : 'h-24'} bg-[#181818] border-t border-[#282828] px-6 flex flex-col fixed bottom-0 w-full transition-all duration-300 ease-in-out z-50`}>
      {/* Expand/Collapse Button */}
      <button 
        className="absolute top-2 right-2 text-gray-400 hover:text-white"
        onClick={toggleExpanded}
      >
        {expanded ? (
          <ChevronDownIcon className="h-5 w-5" />
        ) : (
          <ChevronUpIcon className="h-5 w-5" />
        )}
      </button>
      
      {/* Main Player Controls */}
      <div className="h-24 flex items-center justify-between w-full">
        {/* Currently Playing */}
        <div className="flex items-center space-x-4 w-1/4 min-w-[180px]">
          <div className="relative">
            <img 
              src={currentSong.imageUrl} 
              alt={currentSong.title} 
              className={`h-14 w-14 rounded shadow-md ${isPlaying ? 'animate-pulse-subtle' : ''}`}
            />
            {isPlaying && (
              <div className="absolute bottom-1 right-1 bg-[#1ed760] rounded-full h-3 w-3 animate-ping"></div>
            )}
          </div>
          <div className="flex flex-col">
            <h4 className="text-white text-sm font-medium hover:underline cursor-pointer truncate max-w-[140px]">{currentSong.title}</h4>
            <p className="text-gray-400 text-xs hover:text-white hover:underline cursor-pointer truncate max-w-[140px]">{currentSong.artist}</p>
          </div>
          <button 
            className="text-gray-400 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              setLiked(!liked);
            }}
          >
            {liked ? (
              <HeartIcon className="h-5 w-5 text-[#1ed760]" />
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
              <BackwardIcon className="h-5 w-5" />
            </button>
            <div className="relative">
              <button 
                className="bg-white rounded-full p-2 hover:scale-105 mx-2 flex items-center justify-center relative z-10"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <PauseIcon className="h-6 w-6 text-black" />
                ) : (
                  <PlayIcon className="h-6 w-6 text-black" />
                )}
              </button>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                <SoundWave isPlaying={isPlaying} />
              </div>
            </div>
            <button 
              className="text-gray-400 hover:text-white p-1"
              onClick={nextSong}
            >
              <ForwardIcon className="h-5 w-5" />
            </button>
            <button className="text-gray-400 hover:text-white p-1">
              <ArrowPathIcon className="h-4 w-4" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full flex items-center space-x-2">
            <span className="text-xs text-gray-400 w-10 text-right">{formatTime(currentTime)}</span>
            <div 
              ref={progressBarRef}
              className="relative flex-1 h-1 bg-[#535353] rounded-full group cursor-pointer"
              onClick={handleProgressClick}
            >
              <div 
                className="absolute h-full bg-white group-hover:bg-[#1ed760] rounded-full transition-colors" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
              <div 
                className="absolute h-3 w-3 bg-white rounded-full -mt-1 opacity-0 group-hover:opacity-100 transition-opacity" 
                style={{ left: `${progressPercentage}%`, transform: 'translateX(-50%)' }}
              ></div>
            </div>
            <span className="text-xs text-gray-400 w-10">{currentSong.duration}</span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-3 w-1/4 justify-end min-w-[180px]">
          <button 
            className={`text-gray-400 hover:text-white ${expanded ? 'text-[#1ed760]' : ''}`}
            onClick={toggleExpanded}
          >
            <QueueListIcon className="h-5 w-5" />
          </button>
          <button className="text-gray-400 hover:text-white">
            <ComputerDesktopIcon className="h-5 w-5" />
          </button>
          
          {/* Volume Controls */}
          <div className="flex items-center space-x-2 group">
            <button className="text-gray-400 group-hover:text-white">
              {volume === 0 ? (
                <SpeakerXMarkIcon className="h-5 w-5" />
              ) : (
                <SpeakerWaveIcon className="h-5 w-5" />
              )}
            </button>
            <div className="w-24 relative">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={volume * 100} 
                onChange={handleVolumeChange}
                className="w-full h-1 bg-[#535353] rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #1ed760 ${volume * 100}%, #535353 ${volume * 100}%)`
                }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Expanded Playlist View */}
      {expanded && (
        <div className="flex-1 overflow-y-auto pt-4 pb-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white text-lg font-bold">
              {currentPlaylist ? `Now Playing: ${currentPlaylist.title}` : 'Queue'}
            </h3>
            <p className="text-gray-400 text-sm">{queue.length} songs</p>
          </div>
          
          <div className="space-y-1 pr-2">
            {queue.map((song, index) => (
              <div 
                key={song.id} 
                className={`flex items-center p-2 rounded-md ${currentSong && currentSong.id === song.id ? 'bg-[#2a2a2a]' : 'hover:bg-[#2a2a2a]'} cursor-pointer`}
              >
                <div className="w-8 text-center text-gray-400 text-sm">
                  {currentSong && currentSong.id === song.id ? (
                    <SpeakerWaveIcon className="h-4 w-4 text-[#1ed760] mx-auto" />
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="flex flex-1 items-center">
                  <img 
                    src={song.imageUrl} 
                    alt={song.title} 
                    className="h-10 w-10 rounded mr-3"
                  />
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium truncate ${currentSong && currentSong.id === song.id ? 'text-[#1ed760]' : 'text-white'}`}>
                      {song.title}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{song.artist}</p>
                  </div>
                </div>
                <div className="text-gray-400 text-sm">{song.duration}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Player;