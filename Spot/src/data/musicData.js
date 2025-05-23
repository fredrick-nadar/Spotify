export const categories = [
  { id: 1, name: 'Pop' },
  { id: 2, name: 'Hip-Hop' },
  { id: 3, name: 'Rock' },
  { id: 4, name: 'Electronic' },
  { id: 5, name: 'Latin' },
  { id: 6, name: 'Jazz' },
];

export const songs = [
  {
    id: 1,
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    duration: "3:20",
    imageUrl: "https://i.scdn.co/image/ab67616d00001e02ef10c9adbf42a608e76c3b0e",
    category: "Pop"
  },
  {
    id: 2,
    title: "Stay",
    artist: "Kid LAROI & Justin Bieber",
    album: "F*CK LOVE 3: OVER YOU",
    duration: "2:21",
    imageUrl: "https://i.scdn.co/image/ab67616d00001e0241e31d6ea1d493dd77933ee5",
    category: "Pop"
  },
  {
    id: 3,
    title: "Heat Waves",
    artist: "Glass Animals",
    album: "Dreamland",
    duration: "3:59",
    imageUrl: "https://i.scdn.co/image/ab67616d00001e02712701c5e263efc8726b1464",
    category: "Pop"
  },
  {
    id: 4,
    title: "Industry Baby",
    artist: "Lil Nas X & Jack Harlow",
    album: "MONTERO",
    duration: "3:32",
    imageUrl: "https://i.scdn.co/image/ab67616d00001e02ba26678947112dff3c3158bf",
    category: "Hip-Hop"
  },
  {
    id: 5,
    title: "Sweet Child O' Mine",
    artist: "Guns N' Roses",
    album: "Appetite for Destruction",
    duration: "5:56",
    imageUrl: "https://i.scdn.co/image/ab67616d00001e029f66c6ea3a9aa359fa1d75c4",
    category: "Rock"
  },
  {
    id: 6,
    title: "Strobe",
    artist: "Deadmau5",
    album: "For Lack of a Better Name",
    duration: "10:37",
    imageUrl: "https://i.scdn.co/image/ab67616d00001e0267c738a703dc979f5c3c52ef",
    category: "Electronic"
  }
];

export const playlists = [
  {
    id: 1,
    title: "Today's Top Hits",
    description: "The hottest tracks right now",
    imageUrl: "https://i.scdn.co/image/ab67706f000000027ea4d505212b9de1f72c5112",
    songs: [1, 2, 3, 4]
  },
  {
    id: 2,
    title: "Rock Classics",
    description: "Rock legends & epic songs",
    imageUrl: "https://i.scdn.co/image/ab67706f0000000278b4745cb9ce8ffe32daaf7e",
    songs: [5]
  },
  {
    id: 3,
    title: "Electronic Mix",
    description: "The best electronic music selection",
    imageUrl: "https://i.scdn.co/image/ab67706f00000002b0fe40a6e1692822f5a9d8f1",
    songs: [6]
  }
]; 