import React, { useState } from 'react';
import { useMusicContext } from '../context/MusicContext';
import TrackCard from './TrackCard';
import { categories } from '../data/musicData';
import { PlayIcon } from '@heroicons/react/24/solid';

const MainContent = () => {
  const { allPlaylists, allSongs, playPlaylist, playSong } = useMusicContext();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredSongs = selectedCategory === 'All' 
    ? allSongs 
    : allSongs.filter(song => song.category === selectedCategory);

  return (
    <div className="flex-1 bg-gradient-to-b from-[#121212] to-black overflow-y-auto p-8">
      {/* Categories */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Browse by Category</h2>
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-full ${
              selectedCategory === 'All'
                ? 'bg-green-500 text-white'
                : 'bg-[#282828] text-gray-300 hover:bg-[#383838]'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.name)}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === category.name
                  ? 'bg-green-500 text-white'
                  : 'bg-[#282828] text-gray-300 hover:bg-[#383838]'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Playlists */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">Featured Playlists</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allPlaylists.map((playlist) => (
            <div 
              key={playlist.id} 
              className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition-colors cursor-pointer group"
              onClick={() => playPlaylist(playlist)}
            >
              <div className="relative">
                <img 
                  src={playlist.imageUrl} 
                  alt={playlist.title} 
                  className="w-full aspect-square object-cover rounded-md shadow-lg mb-4" 
                />
                <button className="absolute bottom-2 right-2 bg-green-500 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                  <PlayIcon className="h-6 w-6 text-black" />
                </button>
              </div>
              <h3 className="text-white font-semibold mb-1">{playlist.title}</h3>
              <p className="text-gray-400 text-sm">{playlist.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Songs */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6">
          {selectedCategory === 'All' ? 'Popular Songs' : `${selectedCategory} Songs`}
        </h2>
        <div className="space-y-4">
          {filteredSongs.map((song) => (
            <TrackCard 
              key={song.id}
              {...song}
              onClick={() => playSong(song)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default MainContent; 