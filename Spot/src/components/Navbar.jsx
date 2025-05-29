import React, { useState } from 'react';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  UserCircleIcon, 
  BellIcon, 
  EllipsisHorizontalIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/solid';
import { useMusicContext } from '../context/MusicContext';

const Navbar = () => {
  const { currentSong } = useMusicContext();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get background color based on current song or default
  const getBgColor = () => {
    if (!currentSong) return 'from-[#121212] to-[#121212]';
    // Different gradients based on song id to simulate album color matching
    const gradients = [
      'from-blue-900 to-[#121212]',
      'from-purple-900 to-[#121212]',
      'from-red-900 to-[#121212]',
      'from-green-900 to-[#121212]',
      'from-yellow-800 to-[#121212]',
      'from-pink-900 to-[#121212]'
    ];
    return gradients[currentSong.id % gradients.length];
  };

  return (
    <div className={`h-16 bg-gradient-to-b ${getBgColor()} flex items-center justify-between px-8 sticky top-0 z-10`}>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <button className="bg-black bg-opacity-70 rounded-full p-1 hover:bg-opacity-80">
            <ChevronLeftIcon className="h-6 w-6 text-white" />
          </button>
          <button className="bg-black bg-opacity-70 rounded-full p-1 hover:bg-opacity-80">
            <ChevronRightIcon className="h-6 w-6 text-white" />
          </button>
        </div>
        
        <div className="relative hidden md:block ml-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-[#242424] text-white text-sm rounded-full py-2 pl-10 pr-4 w-64 focus:outline-none focus:ring-2 focus:ring-white focus:bg-[#2a2a2a]"
            placeholder="What do you want to listen to?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="bg-black bg-opacity-70 text-white px-4 py-1.5 text-sm rounded-full font-medium border border-gray-700 hover:border-white hover:scale-105 transition-all">
          Explore Premium
        </button>
        
        <button className="bg-black bg-opacity-70 rounded-full p-2 hover:bg-opacity-80">
          <BellIcon className="h-5 w-5 text-white" />
        </button>
        
        <button className="flex items-center space-x-2 bg-black bg-opacity-70 rounded-full p-1 hover:bg-opacity-80 transition-all">
          <UserCircleIcon className="h-7 w-7 text-white" />
          <span className="text-white pr-2 font-medium">Profile</span>
          <EllipsisHorizontalIcon className="h-5 w-5 text-white mr-1" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;