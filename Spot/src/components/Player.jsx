import React from 'react';
import { PlayIcon, PauseIcon, BackwardIcon, ForwardIcon, SpeakerWaveIcon } from '@heroicons/react/24/solid';
import { ArrowsRightLeftIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useMusicContext } from '../context/MusicContext';

const Player = () => {
  const { 
    currentSong, 
    isPlaying, 
    togglePlay, 
    nextSong, 
    previousSong 
  } = useMusicContext();

  if (!currentSong) {
    return (
      <div className="h-24 bg-[#181818] border-t border-[#282828] px-4 flex items-center justify-center text-gray-400">
        No track selected
      </div>
    );
  }

  return (
    <div className="h-24 bg-[#181818] border-t border-[#282828] px-4 flex items-center justify-between">
      {/* Currently Playing */}
      <div className="flex items-center space-x-4 w-1/4">
        <img 
          src={currentSong.imageUrl} 
          alt={currentSong.title} 
          className="h-14 w-14 rounded shadow"
        />
        <div>
          <h4 className="text-white text-sm">{currentSong.title}</h4>
          <p className="text-gray-400 text-xs">{currentSong.artist}</p>
        </div>
      </div>

      {/* Player Controls */}
      <div className="flex flex-col items-center space-y-2 w-2/4">
        <div className="flex items-center space-x-6">
          <button className="text-gray-400 hover:text-white">
            <ArrowsRightLeftIcon className="h-5 w-5" />
          </button>
          <button 
            className="text-gray-400 hover:text-white"
            onClick={previousSong}
          >
            <BackwardIcon className="h-5 w-5" />
          </button>
          <button 
            className="bg-white rounded-full p-2 hover:scale-105"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <PauseIcon className="h-6 w-6 text-black" />
            ) : (
              <PlayIcon className="h-6 w-6 text-black" />
            )}
          </button>
          <button 
            className="text-gray-400 hover:text-white"
            onClick={nextSong}
          >
            <ForwardIcon className="h-5 w-5" />
          </button>
          <button className="text-gray-400 hover:text-white">
            <ArrowPathIcon className="h-5 w-5" />
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full flex items-center space-x-2">
          <span className="text-xs text-gray-400">0:00</span>
          <div className="flex-1 h-1 bg-gray-600 rounded-full">
            <div className="w-0 h-full bg-white rounded-full"></div>
          </div>
          <span className="text-xs text-gray-400">{currentSong.duration}</span>
        </div>
      </div>

      {/* Volume Controls */}
      <div className="flex items-center space-x-2 w-1/4 justify-end">
        <SpeakerWaveIcon className="h-5 w-5 text-gray-400" />
        <div className="w-24 h-1 bg-gray-600 rounded-full">
          <div className="w-2/3 h-full bg-white rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Player; 