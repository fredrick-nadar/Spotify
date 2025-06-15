import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { songs, playlists } from '../data/musicData';

const MusicContext = createContext();

export const useMusicContext = () => useContext(MusicContext);

// Add actual audio files for the songs - using local files and royalty-free music samples
const songAudioMap = {
  1: '/src/data/Songs/Blinding Lights.mp3', // Blinding Lights - local file
  2: '/src/data/Songs/As It Was.mp3', // As It Was - using "Good Night"
  3: '/src/data/Songs/Miley Cyrus - Flowers.mp3', // Flowers - using "Summer Walk"
  4: '/src/data/Songs/Travis Scott - SICKO MODE ft. Drake.mp3', // SICKO MODE - using "Trap Beat"
  5: 'https://cdn.pixabay.com/download/audio/2022/05/13/audio_cb1b0f8b0a.mp3', // Bohemian Rhapsody - using "Epic Orchestra"
  6: 'https://cdn.pixabay.com/download/audio/2022/01/16/audio_d16737d4ea.mp3', // Strobe - using "Electronic Future"
  7: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c2f1b4af7a.mp3', // Humble - using "Hip Hop Beat"
  8: 'https://cdn.pixabay.com/download/audio/2022/04/27/audio_9f71c1d820.mp3', // Die For You - using "Chill R&B"
  9: 'https://cdn.pixabay.com/download/audio/2022/01/21/audio_8fe9e127e1.mp3', // Glimpse of Us - using "Slow Motion"
  10: 'https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe92c21.mp3', // Everlong - using "Rock Intro"
  11: 'https://cdn.pixabay.com/download/audio/2022/07/04/audio_bbc1050f22.mp3', // Tití Me Preguntó - using "Latin Pop"
  12: 'https://cdn.pixabay.com/download/audio/2022/01/13/audio_d1a6c14488.mp3', // Midnight City - using "Synthwave"
  13: 'https://cdn.pixabay.com/download/audio/2022/06/29/audio_7b7e5b3a42.mp3', // 505 - using "Indie Rock"
  14: 'https://cdn.pixabay.com/download/audio/2022/02/22/audio_8cb749090d.mp3', // Redbone - using "Soul Groove"
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
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error('Error playing audio:', error);
            // Auto-play was prevented, set isPlaying to false
            setIsPlaying(false);
          });
        }
      }
    }
  }, [currentSong]);
  
  // Handle play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Error playing audio:', error);
          // Auto-play was prevented, set isPlaying to false
          setIsPlaying(false);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying]);
  
  // Handle volume changes
  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  const playSong = (song) => {
    // If song is already playing, toggle play/pause
    if (currentSong && currentSong.id === song.id) {
      togglePlay();
      return;
    }
    
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

  const playPlaylist = (playlist) => {
    // If playlist is an object, extract the id
    const id = typeof playlist === 'object' ? playlist.id : playlist;
    const playlistObj = playlists.find(p => p.id === id);
    
    if (playlistObj) {
      setCurrentPlaylist(playlistObj);
      const playlistSongs = playlistObj.songs.map(id => songs.find(song => song.id === id)).filter(Boolean);
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
    const currentIndex = queue.findIndex(song => song.id === currentSong?.id);
    if (currentIndex < queue.length - 1) {
      setCurrentSong(queue[currentIndex + 1]);
      setIsPlaying(true);
    } else if (currentIndex === queue.length - 1) {
      // Loop back to first song in playlist
      setCurrentSong(queue[0]);
      setIsPlaying(true);
    }
  };

  const previousSong = () => {
    if (!queue.length) return;
    const currentIndex = queue.findIndex(song => song.id === currentSong?.id);
    
    // If we're more than 3 seconds into the song, restart it instead of going to previous
    if (currentTime > 3) {
      seekTo(0);
      return;
    }
    
    if (currentIndex > 0) {
      setCurrentSong(queue[currentIndex - 1]);
      setIsPlaying(true);
    } else {
      // If we're at the first song, go to the last song
      setCurrentSong(queue[queue.length - 1]);
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