import React, { useState, useEffect } from 'react';
import { useMusicContext } from '../context/MusicContext';
import TrackCard from './TrackCard';
import { categories } from '../data/musicData';
import { PlayIcon, PauseIcon, ClockIcon, MusicalNoteIcon } from '@heroicons/react/24/solid';
import { 
  FireIcon, 
  SparklesIcon, 
  BoltIcon, 
  MicrophoneIcon, 
  RocketLaunchIcon,
  BeakerIcon
} from '@heroicons/react/24/solid';

const MainContent = () => {
  const { 
    allSongs, 
    allPlaylists, 
    playPlaylist, 
    playSong, 
    currentSong, 
    isPlaying, 
    togglePlay,
    currentPlaylist 
  } = useMusicContext();
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activePlaylist, setActivePlaylist] = useState(null);
  const [headerBgColor, setHeaderBgColor] = useState('rgb(83, 83, 83)');

  const filteredSongs = selectedCategory === 'All' 
    ? allSongs 
    : allSongs.filter(song => song.category === selectedCategory);

  // Set a random background color for the header based on the playlist or current view
  useEffect(() => {
    const colors = [
      'rgb(30, 215, 96)', // Spotify green
      'rgb(132, 0, 231)',  // Purple
      'rgb(30, 50, 100)',   // Blue
      'rgb(232, 17, 91)',   // Pink
      'rgb(140, 25, 50)',   // Red
      'rgb(141, 103, 171)', // Lavender
      'rgb(20, 138, 8)',    // Dark green
      'rgb(188, 89, 0)',    // Orange
      'rgb(233, 20, 41)',   // Bright red
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setHeaderBgColor(randomColor);
  }, [currentPlaylist]);
  
  // Get appropriate icon based on playlist's primary category
  const getPlaylistIcon = (playlist) => {
    // Determine primary category based on first song in playlist
    if (!playlist || !playlist.songs || playlist.songs.length === 0) {
      return <MusicalNoteIcon className="h-5 w-5 text-gray-400" />;
    }
    
    const firstSongId = playlist.songs[0];
    const firstSong = allSongs.find(song => song.id === firstSongId);
    const category = firstSong?.category || 'Unknown';
    
    switch(category) {
      case 'Pop':
        return <SparklesIcon className="h-5 w-5 text-pink-400" />;
      case 'Hip-Hop':
        return <MicrophoneIcon className="h-5 w-5 text-yellow-400" />;
      case 'Rock':
        return <BoltIcon className="h-5 w-5 text-red-500" />;
      case 'Electronic':
        return <BeakerIcon className="h-5 w-5 text-blue-400" />;
      case 'R&B':
        return <FireIcon className="h-5 w-5 text-purple-400" />;
      case 'Indie':
        return <RocketLaunchIcon className="h-5 w-5 text-green-400" />;
      default:
        return <MusicalNoteIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="flex-1 bg-gradient-to-b from-[#121212] via-[#121212] to-black overflow-y-auto p-6 main-content-scroll">
      {/* Top Section with Greeting */}
      <section className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
          {getGreeting()}
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {allPlaylists.slice(0, 6).map((playlist) => (
            <div 
              key={playlist.id} 
              className="bg-[#181818] hover:bg-[#282828] p-3 rounded-lg transition-all duration-200 cursor-pointer flex items-center group"
              onClick={() => playPlaylist(playlist)}
            >
              <div className="relative">
                <img 
                  src={playlist.imageUrl} 
                  alt={playlist.title} 
                  className="h-12 w-12 rounded shadow-lg mr-3" 
                />
                <div className="absolute -top-1 -right-1 bg-[#121212] rounded-full p-0.5">
                  {getPlaylistIcon(playlist)}
                </div>
              </div>
              <span className="text-white font-medium text-sm line-clamp-2">{playlist.title}</span>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="bg-[#1ed760] rounded-full p-2 shadow-lg transform translate-x-2 hover:scale-105">
                  <PlayIcon className="h-5 w-5 text-black" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mb-8">
        <div className="flex overflow-x-auto pb-2 space-x-2 scrollbar-hide mb-6">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              selectedCategory === 'All'
                ? 'bg-white text-black font-bold'
                : 'bg-[#232323] text-white hover:bg-[#2a2a2a]'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.name)}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                selectedCategory === category.name
                  ? 'bg-white text-black font-bold'
                  : 'bg-[#232323] text-white hover:bg-[#2a2a2a]'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Playlists */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold text-white">Featured Playlists</h2>
          <a href="#" className="text-sm font-bold text-gray-400 hover:underline uppercase tracking-wider">See all</a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {allPlaylists.map((playlist) => (
            <div 
              key={playlist.id} 
              className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition-all duration-200 cursor-pointer group"
              onClick={() => playPlaylist(playlist)}
            >
              <div className="relative mb-4">
                <img 
                  src={playlist.imageUrl} 
                  alt={playlist.title} 
                  className="w-full aspect-square object-cover rounded shadow-lg" 
                />
                <div className="absolute top-2 right-2 bg-[#121212] bg-opacity-70 rounded-full p-1">
                  {getPlaylistIcon(playlist)}
                </div>
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-y-0 translate-y-4">
                  <button className="bg-[#1ed760] rounded-full p-3 shadow-lg hover:scale-105 hover:bg-[#1fdf64]">
                    <PlayIcon className="h-6 w-6 text-black" />
                  </button>
                </div>
              </div>
              <h3 className="text-white font-semibold mb-1 line-clamp-1">{playlist.title}</h3>
              <p className="text-gray-400 text-sm line-clamp-2">{playlist.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Songs */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold text-white">
            {selectedCategory === 'All' ? 'Popular Songs' : `${selectedCategory} Songs`}
          </h2>
          <a href="#" className="text-sm font-bold text-gray-400 hover:underline uppercase tracking-wider">See all</a>
        </div>
        <div className="space-y-1">
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

// Helper function to get greeting based on time of day
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

export default MainContent;