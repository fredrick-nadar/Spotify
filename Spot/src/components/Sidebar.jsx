import React from 'react';
import { HomeIcon, MagnifyingGlassIcon, BuildingLibraryIcon, PlusCircleIcon, HeartIcon } from '@heroicons/react/24/outline';

const Sidebar = () => {
  return (
    <div className="w-64 bg-black p-6 flex flex-col">
      <div className="mb-8">
        <h1 className="text-white text-2xl font-bold mb-8">Spotify</h1>
        <nav className="space-y-4">
          <a href="#" className="flex items-center text-gray-300 hover:text-white">
            <HomeIcon className="h-6 w-6 mr-2" />
            Home
          </a>
          <a href="#" className="flex items-center text-gray-300 hover:text-white">
            <MagnifyingGlassIcon className="h-6 w-6 mr-2" />
            Search
          </a>
          <a href="#" className="flex items-center text-gray-300 hover:text-white">
            <BuildingLibraryIcon className="h-6 w-6 mr-2" />
            Your Library
          </a>
        </nav>
      </div>
      
      <div className="mt-8">
        <div className="flex items-center space-x-2 mb-4">
          <button className="flex items-center text-gray-300 hover:text-white">
            <PlusCircleIcon className="h-6 w-6 mr-2" />
            Create Playlist
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex items-center text-gray-300 hover:text-white">
            <HeartIcon className="h-6 w-6 mr-2" />
            Liked Songs
          </button>
        </div>
      </div>
      
      <div className="mt-6 border-t border-gray-800 pt-6">
        <div className="space-y-4">
          <div className="text-gray-300 hover:text-white cursor-pointer">My Playlist #1</div>
          <div className="text-gray-300 hover:text-white cursor-pointer">Chill Vibes</div>
          <div className="text-gray-300 hover:text-white cursor-pointer">Rock Classics</div>
          <div className="text-gray-300 hover:text-white cursor-pointer">Workout Mix</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 