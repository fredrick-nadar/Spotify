import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, UserCircleIcon } from '@heroicons/react/24/solid';

const Navbar = () => {
  return (
    <div className="h-16 bg-[#121212] flex items-center justify-between px-8">
      <div className="flex items-center space-x-4">
        <button className="bg-black rounded-full p-1">
          <ChevronLeftIcon className="h-6 w-6 text-gray-400" />
        </button>
        <button className="bg-black rounded-full p-1">
          <ChevronRightIcon className="h-6 w-6 text-gray-400" />
        </button>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="bg-white text-black px-6 py-2 rounded-full font-medium hover:scale-105">
          Upgrade
        </button>
        <button className="flex items-center space-x-2 bg-black rounded-full p-1 px-2 hover:bg-gray-900">
          <UserCircleIcon className="h-8 w-8 text-gray-300" />
          <span className="text-white pr-2">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar; 