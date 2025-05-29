import React from 'react';
import { 
  HomeIcon, 
  MagnifyingGlassIcon, 
  BuildingLibraryIcon, 
  PlusCircleIcon, 
  HeartIcon,
  RssIcon
} from '@heroicons/react/24/outline';
import { useMusicContext } from '../context/MusicContext';

const Sidebar = () => {
  const { allPlaylists } = useMusicContext();
  
  return (
    <div className="w-64 bg-black p-5 flex flex-col h-full">
      {/* Logo */}
      <div className="mb-6">
        <svg viewBox="0 0 1134 340" className="h-10 text-white">
          <path fill="currentColor" d="M8 171.4C8 101.2 65.5 43.7 135.8 43.7c31.9 0 59.3 11.5 81.4 26.5 4.2 2.9 4.9 8.5 1.5 12.3l-22.6 26.6c-2.9 3.4-8 4-11.8 1.5-15.4-10.1-30.9-16-48.5-16-40.4 0-71.5 33-71.5 76.9s31.1 76.9 71.5 76.9c17.6 0 33.1-5.9 48.5-16 3.8-2.5 8.9-1.9 11.8 1.5l22.6 26.6c3.4 3.9 2.7 9.5-1.5 12.3-22.1 15-49.5 26.5-81.4 26.5C65.5 299.1 8 241.6 8 171.4zM275.2 247.4h-39.7c-4.6 0-8.4-3.7-8.4-8.4V60.5c0-4.6 3.7-8.4 8.4-8.4h39.7c4.6 0 8.4 3.7 8.4 8.4v178.5c-.1 4.7-3.8 8.4-8.4 8.4zm163.5-108.5c-27.2 0-42.4 13.7-49.1 28.9v-21.4c0-4.6-3.7-8.4-8.4-8.4h-38.3c-4.6 0-8.4 3.7-8.4 8.4v178.5c0 4.6 3.7 8.4 8.4 8.4h39.7c4.6 0 8.4-3.7 8.4-8.4v-90.9c0-21.2 10.5-32.7 28-32.7 17.6 0 26.5 11.5 26.5 32.7v90.9c0 4.6 3.7 8.4 8.4 8.4h39.7c4.6 0 8.4-3.7 8.4-8.4v-97.2c-.1-42.1-22.7-68.8-63.3-68.8zm126.4 0c-42.4 0-73.3 27.4-73.3 68.8 0 41.3 31.3 68.8 74.1 68.8 25.7 0 46.4-9.3 61.2-26.8 2.9-3.4 2.5-8.4-1-11.3l-25.2-19.4c-3.4-2.5-8-2.1-11 .8-7.2 7.9-17.9 12.4-29.3 12.4-17.6 0-31.7-10.7-35.5-25.8h102.3c4.6 0 8.4-3.7 8.4-8.4v-6.8c-.1-40.5-30.2-68.3-70.7-68.3zm-28.8 55.8c3.8-15.4 15.9-25.8 32.7-25.8 15.9 0 28 10.3 31.7 25.8h-64.4zm293.9-55.8c-17.6 0-34.3 8-44.3 21v-13.5c0-4.6-3.7-8.4-8.4-8.4h-38.7c-4.6 0-8.4 3.7-8.4 8.4v178.5c0 4.6 3.7 8.4 8.4 8.4h39.7c4.6 0 8.4-3.7 8.4-8.4v-66.6c0-28.5 13.7-44.3 41.7-44.3 4.2 0 8.4.4 12.3 1.3 4.6.8 9.1-2.1 9.1-6.8v-38.7c0-3.8-2.5-7.1-6.3-8-4.2-.8-8.9-1.1-13.5-1.1zm-136.6 0c-41.7 0-71.9 27.4-71.9 68.8s30.1 68.8 71.9 68.8 71.9-27.4 71.9-68.8-30.2-68.8-71.9-68.8zm0 108.5c-22.7 0-38.3-16.8-38.3-39.7s15.5-39.7 38.3-39.7c22.7 0 38.3 16.8 38.3 39.7s-15.6 39.7-38.3 39.7z"></path>
        </svg>
      </div>
      
      {/* Main Navigation */}
      <div className="mb-6">
        <nav className="space-y-2">
          <a href="#" className="flex items-center text-white font-semibold py-2 px-4 rounded-md bg-[#282828] hover:bg-[#333333]">
            <HomeIcon className="h-6 w-6 mr-4" />
            Home
          </a>
          <a href="#" className="flex items-center text-gray-400 font-medium py-2 px-4 rounded-md hover:text-white">
            <MagnifyingGlassIcon className="h-6 w-6 mr-4" />
            Search
          </a>
          <a href="#" className="flex items-center text-gray-400 font-medium py-2 px-4 rounded-md hover:text-white">
            <BuildingLibraryIcon className="h-6 w-6 mr-4" />
            Your Library
          </a>
        </nav>
      </div>
      
      {/* Playlist Actions */}
      <div className="mt-4 mb-6 space-y-2">
        <button className="flex items-center text-gray-400 font-medium py-2 px-4 rounded-md hover:text-white w-full transition-colors">
          <div className="bg-gray-400 hover:bg-white p-1 rounded mr-4 transition-colors">
            <PlusCircleIcon className="h-4 w-4 text-black" />
          </div>
          Create Playlist
        </button>
        <button className="flex items-center text-gray-400 font-medium py-2 px-4 rounded-md hover:text-white w-full transition-colors">
          <div className="bg-gradient-to-br from-purple-700 to-blue-400 p-1 rounded mr-4">
            <HeartIcon className="h-4 w-4 text-white" />
          </div>
          Liked Songs
        </button>
        <button className="flex items-center text-gray-400 font-medium py-2 px-4 rounded-md hover:text-white w-full transition-colors">
          <div className="bg-gradient-to-br from-green-600 to-green-400 p-1 rounded mr-4">
            <RssIcon className="h-4 w-4 text-black" />
          </div>
          Your Episodes
        </button>
      </div>
      
      {/* Divider */}
      <div className="border-t border-gray-800 mb-4"></div>
      
      {/* Playlists */}
      <div className="overflow-y-auto flex-grow scrollbar-hide">
        <div className="space-y-2 pr-2">
          {allPlaylists.map((playlist) => (
            <div 
              key={playlist.id} 
              className="text-gray-400 hover:text-white cursor-pointer py-1 px-4 text-sm font-medium truncate"
            >
              {playlist.title}
            </div>
          ))}
          <div className="text-gray-400 hover:text-white cursor-pointer py-1 px-4 text-sm font-medium truncate">My Playlist #1</div>
          <div className="text-gray-400 hover:text-white cursor-pointer py-1 px-4 text-sm font-medium truncate">Chill Vibes</div>
          <div className="text-gray-400 hover:text-white cursor-pointer py-1 px-4 text-sm font-medium truncate">Rock Classics</div>
          <div className="text-gray-400 hover:text-white cursor-pointer py-1 px-4 text-sm font-medium truncate">Workout Mix</div>
          <div className="text-gray-400 hover:text-white cursor-pointer py-1 px-4 text-sm font-medium truncate">Discover Weekly</div>
          <div className="text-gray-400 hover:text-white cursor-pointer py-1 px-4 text-sm font-medium truncate">Release Radar</div>
          <div className="text-gray-400 hover:text-white cursor-pointer py-1 px-4 text-sm font-medium truncate">Summer Hits</div>
          <div className="text-gray-400 hover:text-white cursor-pointer py-1 px-4 text-sm font-medium truncate">Throwbacks</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;