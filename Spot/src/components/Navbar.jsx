import React, { useState, useEffect } from 'react';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  UserIcon, 
  BellIcon, 
  EllipsisHorizontalIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/solid';
import { useMusicContext } from '../context/MusicContext';

const Navbar = () => {
  const { currentSong, currentPlaylist } = useMusicContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll to change navbar opacity
  useEffect(() => {
    const handleScroll = () => {
      const mainContent = document.querySelector('.main-content-scroll');
      if (mainContent) {
        setScrolled(mainContent.scrollTop > 10);
      }
    };
    
    const mainContent = document.querySelector('.main-content-scroll');
    if (mainContent) {
      mainContent.addEventListener('scroll', handleScroll);
      return () => mainContent.removeEventListener('scroll', handleScroll);
    }
  }, []);
  
  // Get background color based on current song or playlist
  const getBgColor = () => {
    if (!currentSong && !currentPlaylist) return 'from-[#121212] to-[#121212]';
    
    // Different gradients based on content
    const gradients = [
      'from-blue-900 to-[#121212]',
      'from-purple-900 to-[#121212]',
      'from-red-900 to-[#121212]',
      'from-green-900 to-[#121212]',
      'from-yellow-800 to-[#121212]',
      'from-pink-900 to-[#121212]',
      'from-indigo-900 to-[#121212]'
    ];
    
    const id = currentPlaylist?.id || currentSong?.id || 0;
    return gradients[id % gradients.length];
  };

  return (
    <div 
      className={`h-16 bg-gradient-to-b ${getBgColor()} flex items-center justify-between px-6 sticky top-0 z-10 transition-all duration-300 ${
        scrolled ? 'bg-opacity-90 backdrop-blur-sm' : ''
      }`}
    >
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <button className="bg-black bg-opacity-60 rounded-full p-1.5 hover:bg-opacity-80 transition-all">
            <ChevronLeftIcon className="h-5 w-5 text-white" />
          </button>
          <button className="bg-black bg-opacity-60 rounded-full p-1.5 hover:bg-opacity-80 transition-all">
            <ChevronRightIcon className="h-5 w-5 text-white" />
          </button>
        </div>
        
        <div className="relative hidden md:block ml-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-[#242424] text-white text-sm rounded-full py-2 pl-10 pr-4 w-80 focus:outline-none focus:ring-2 focus:ring-white focus:bg-[#2a2a2a] placeholder-gray-400 transition-all"
            placeholder="What do you want to listen to?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <button className="bg-black hover:bg-[#333] bg-opacity-60 text-white px-4 py-1.5 text-sm rounded-full font-medium border border-transparent hover:scale-105 transition-all">
          Explore Premium
        </button>
        
        <button className="bg-black bg-opacity-60 rounded-full p-2 hover:bg-[#333] transition-all">
          <BellIcon className="h-5 w-5 text-white" />
        </button>
        
        <button className="flex items-center space-x-2 bg-black bg-opacity-60 rounded-full pl-1 pr-2 py-1 hover:bg-[#333] transition-all">
          <div className="bg-[#535353] rounded-full p-1">
            <UserIcon className="h-5 w-5 text-white" />
          </div>
          <span className="text-white text-sm font-medium">Profile</span>
          <EllipsisHorizontalIcon className="h-5 w-5 text-white" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;