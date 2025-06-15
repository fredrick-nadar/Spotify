import React, { useState } from 'react';
import { PlayIcon, PauseIcon, MusicalNoteIcon } from '@heroicons/react/24/solid';
import { HeartIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { useMusicContext } from '../context/MusicContext';

// Category-specific icons
import { 
  FireIcon, 
  SparklesIcon, 
  BoltIcon, 
  MicrophoneIcon, 
  RocketLaunchIcon,
  BeakerIcon
} from '@heroicons/react/24/solid';

const TrackCard = ({ id, title, artist, duration, imageUrl, album, category }) => {
  const { currentSong, isPlaying, playSong } = useMusicContext();
  const isActive = currentSong?.id === id;
  const [isHovered, setIsHovered] = useState(false);

  // Get appropriate icon based on song category
  const getCategoryIcon = () => {
    switch(category) {
      case 'Pop':
        return <SparklesIcon className="h-4 w-4 text-pink-400" />;
      case 'Hip-Hop':
        return <MicrophoneIcon className="h-4 w-4 text-yellow-400" />;
      case 'Rock':
        return <BoltIcon className="h-4 w-4 text-red-500" />;
      case 'Electronic':
        return <BeakerIcon className="h-4 w-4 text-blue-400" />;
      case 'R&B':
        return <FireIcon className="h-4 w-4 text-purple-400" />;
      case 'Indie':
        return <RocketLaunchIcon className="h-4 w-4 text-green-400" />;
      default:
        return <MusicalNoteIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div 
      className={`group flex items-center justify-between p-2 rounded-md hover:bg-[#2a2a2a] transition-colors ${
        isActive ? 'bg-[#2a2a2a]' : ''
      }`}
      onClick={() => playSong({ id, title, artist, duration, imageUrl, album, category })}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center flex-1 min-w-0">
        <div className="relative flex items-center justify-center w-10 text-center mr-4">
          {!isHovered && !isActive ? (
            <span className="text-gray-400 text-sm">{id}</span>
          ) : (
            isPlaying && isActive ? (
              <PauseIcon className="h-5 w-5 text-white" />
            ) : (
              <PlayIcon className="h-5 w-5 text-white" />
            )
          )}
        </div>
        
        <div className="relative flex-shrink-0">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-10 h-10 rounded shadow"
          />
          <div className="absolute -top-1 -right-1 bg-[#121212] rounded-full p-0.5">
            {getCategoryIcon()}
          </div>
        </div>
        
        <div className="ml-4 min-w-0 flex-1">
          <h4 className={`font-medium truncate ${isActive ? 'text-[#1ed760]' : 'text-white'}`}>{title}</h4>
          <p className="text-gray-400 text-sm truncate flex items-center">
            {artist}
            <span className="mx-1 text-gray-600">•</span>
            <span className="flex items-center text-xs">
              {getCategoryIcon()}
              <span className="ml-1">{category}</span>
            </span>
          </p>
        </div>
      </div>
      
      <div className="flex items-center">
        <div className={`flex items-center opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'opacity-100' : ''}`}>
          <button className="text-gray-400 hover:text-white p-2" onClick={(e) => e.stopPropagation()}>
            <HeartIcon className="h-5 w-5" />
          </button>
        </div>
        
        <div className="w-32 text-right text-sm text-gray-400 px-4 truncate hidden md:block">
          {album}
        </div>
        
        <div className="flex items-center">
          <span className="text-sm text-gray-400 w-12 text-right">{duration}</span>
          <button 
            className="text-gray-400 hover:text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <EllipsisHorizontalIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackCard; 