import React from 'react';
import { PlayIcon } from '@heroicons/react/24/solid';
import { useMusicContext } from '../context/MusicContext';

const TrackCard = ({ id, title, artist, duration, imageUrl, album }) => {
  const { currentSong, isPlaying, playSong } = useMusicContext();
  const isActive = currentSong?.id === id;

  return (
    <div 
      className={`group flex items-center justify-between p-4 rounded-md hover:bg-[#282828] transition-colors ${
        isActive ? 'bg-[#282828]' : ''
      }`}
      onClick={() => playSong({ id, title, artist, duration, imageUrl, album })}
    >
      <div className="flex items-center space-x-4">
        <div className="relative">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-12 h-12 rounded shadow"
          />
          <button className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 ${
            isActive && isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          } transition-opacity`}>
            <PlayIcon className="h-6 w-6 text-white" />
          </button>
        </div>
        <div>
          <h4 className={`font-medium ${isActive ? 'text-green-500' : 'text-white'}`}>{title}</h4>
          <p className="text-gray-400 text-sm">{artist}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-400">{album}</span>
        <span className="text-sm text-gray-400">{duration}</span>
      </div>
    </div>
  );
};

export default TrackCard; 