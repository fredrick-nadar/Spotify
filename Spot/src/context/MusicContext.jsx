import React, { createContext, useContext, useState } from 'react';
import { songs, playlists } from '../data/musicData';

const MusicContext = createContext();

export const useMusicContext = () => useContext(MusicContext);

export const MusicProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [queue, setQueue] = useState([]);

  const playSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const playPlaylist = (playlist) => {
    setCurrentPlaylist(playlist);
    const playlistSongs = playlist.songs.map(id => songs.find(song => song.id === id));
    setQueue(playlistSongs);
    if (playlistSongs.length > 0) {
      setCurrentSong(playlistSongs[0]);
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextSong = () => {
    if (!queue.length) return;
    const currentIndex = queue.findIndex(song => song.id === currentSong.id);
    if (currentIndex < queue.length - 1) {
      setCurrentSong(queue[currentIndex + 1]);
    }
  };

  const previousSong = () => {
    if (!queue.length) return;
    const currentIndex = queue.findIndex(song => song.id === currentSong.id);
    if (currentIndex > 0) {
      setCurrentSong(queue[currentIndex - 1]);
    }
  };

  return (
    <MusicContext.Provider
      value={{
        currentSong,
        isPlaying,
        currentPlaylist,
        queue,
        playSong,
        playPlaylist,
        togglePlay,
        nextSong,
        previousSong,
        allSongs: songs,
        allPlaylists: playlists,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}; 