import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { songs, playlists } from '../data/musicData';

const MusicContext = createContext();

export const useMusicContext = () => useContext(MusicContext);

// Add actual audio files for the songs
const songAudioMap = {
  1: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Blinding Lights
  2: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', // Stay
  3: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', // Heat Waves
  4: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', // Industry Baby
  5: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', // Sweet Child O' Mine
  6: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', // Strobe
};

export const MusicProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [queue, setQueue] = useState([]);
  const [showPlaylistInPlayer, setShowPlaylistInPlayer] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  
  const audioRef = useRef(new Audio());
  
  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    
    const handleEnded = () => {
      nextSong();
    };
    
    // Add event listeners
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    
    // Set volume
    audio.volume = volume;
    
    return () => {
      // Remove event listeners on cleanup
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);
  
  // Handle song changes
  useEffect(() => {
    if (currentSong) {
      const audio = audioRef.current;
      audio.src = songAudioMap[currentSong.id] || '';
      audio.load();
      if (isPlaying) {
        audio.play().catch(error => console.error('Error playing audio:', error));
      }
    }
  }, [currentSong]);
  
  // Handle play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.play().catch(error => console.error('Error playing audio:', error));
    } else {
      audio.pause();
    }
  }, [isPlaying]);
  
  // Handle volume changes
  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  const playSong = (song) => {
    // If song is an ID, find the song object
    if (typeof song === 'number') {
      const songObj = songs.find(s => s.id === song);
      if (songObj) {
        setCurrentSong(songObj);
        setIsPlaying(true);
      }
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  const playPlaylist = (playlistId) => {
    // If playlistId is an object, extract the id
    const id = typeof playlistId === 'object' ? playlistId.id : playlistId;
    const playlist = playlists.find(p => p.id === id);
    
    if (playlist) {
      setCurrentPlaylist(playlist);
      const playlistSongs = playlist.songs.map(id => songs.find(song => song.id === id));
      setQueue(playlistSongs);
      if (playlistSongs.length > 0) {
        setCurrentSong(playlistSongs[0]);
        setIsPlaying(true);
      }
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
      setIsPlaying(true);
    }
  };

  const previousSong = () => {
    if (!queue.length) return;
    const currentIndex = queue.findIndex(song => song.id === currentSong.id);
    if (currentIndex > 0) {
      setCurrentSong(queue[currentIndex - 1]);
      setIsPlaying(true);
    }
  };
  
  const togglePlaylistInPlayer = () => {
    setShowPlaylistInPlayer(!showPlaylistInPlayer);
  };
  
  const seekTo = (time) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  };
  
  const setAudioVolume = (newVolume) => {
    setVolume(newVolume);
  };

  return (
    <MusicContext.Provider
      value={{
        currentSong,
        isPlaying,
        currentPlaylist,
        queue,
        showPlaylistInPlayer,
        currentTime,
        duration,
        volume,
        playSong,
        playPlaylist,
        togglePlay,
        nextSong,
        previousSong,
        togglePlaylistInPlayer,
        seekTo,
        setAudioVolume,
        allSongs: songs,
        allPlaylists: playlists,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};