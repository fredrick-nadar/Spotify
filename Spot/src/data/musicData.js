export const categories = [
  { id: 1, name: 'Pop' },
  { id: 2, name: 'Hip-Hop' },
  { id: 3, name: 'Rock' },
  { id: 4, name: 'Electronic' },
  { id: 5, name: 'R&B' },
  { id: 6, name: 'Indie' },
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
    title: "As It Was",
    artist: "Harry Styles",
    album: "Harry's House",
    duration: "2:47",
    imageUrl: "https://i.scdn.co/image/ab67616d00001e02b46f74097655d7f353caab14",
    category: "Pop"
  },
  {
    id: 3,
    title: "Flowers",
    artist: "Miley Cyrus",
    album: "Endless Summer Vacation",
    duration: "3:21",
    imageUrl: "https://i.scdn.co/image/ab67616d00001e02963703a759a2ffe89d640830",
    category: "Pop"
  },
  {
    id: 4,
    title: "SICKO MODE",
    artist: "Travis Scott",
    album: "ASTROWORLD",
    duration: "5:12",
    imageUrl: "https://i.scdn.co/image/ab67616d00001e02072e9faef2ef7b6db63834a3",
    category: "Hip-Hop"
  },
  {
    id: 5,
    title: "Bohemian Rhapsody",
    artist: "Queen",
    album: "A Night at the Opera",
    duration: "5:55",
    imageUrl: "https://i.scdn.co/image/ab67616d00001e02d0e4e84af2f2bf17b88b9a43",
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
  },
  {
    id: 7,
    title: "Humble",
    artist: "Kendrick Lamar",
    album: "DAMN.",
    duration: "2:57",
    imageUrl: "https://i.scdn.co/image/ab67616d00001e02d8e436c3c95a53d2b5d1b067",
    category: "Hip-Hop"
  },
  {
    id: 8,
    title: "Die For You",
    artist: "The Weeknd",
    album: "Starboy",
    duration: "4:20",
    imageUrl: "https://i.scdn.co/image/ab67616d00001e02c5903e4933d65e5c9b06bbf2",
    category: "R&B"
  },
  {
    id: 9,
    title: "Glimpse of Us",
    artist: "Joji",
    album: "SMITHEREENS",
    duration: "3:53",
    imageUrl: "https://i.scdn.co/image/ab67616d00001e02b2592bea5d41a1a5b357723c",
    category: "R&B"
  },
  {
    id: 10,
    title: "Everlong",
    artist: "Foo Fighters",
    album: "The Colour and the Shape",
    duration: "4:10",
    imageUrl: "https://i.scdn.co/image/ab67616d00001e02e0f81bc289a98fb8b8e09a49",
    category: "Rock"
  },
  {
    id: 11,
    title: "Tití Me Preguntó",
    artist: "Bad Bunny",
    album: "Un Verano Sin Ti",
    duration: "4:03",
    imageUrl: "https://i.scdn.co/image/ab67616d00001e02d3e2d41c9539a4c9e1cd3666",
    category: "Pop"
  },
  {
    id: 12,
    title: "Midnight City",
    artist: "M83",
    album: "Hurry Up, We're Dreaming",
    duration: "4:03",
    imageUrl: "https://i.scdn.co/image/ab67616d00001e02b53dc75bf6f8ee907d46c605",
    category: "Electronic"
  },
  {
    id: 13,
    title: "505",
    artist: "Arctic Monkeys",
    album: "Favourite Worst Nightmare",
    duration: "4:13",
    imageUrl: "https://i.scdn.co/image/ab67616d00001e02621c6b18ed06a084dde6c1b4",
    category: "Indie"
  },
  {
    id: 14,
    title: "Redbone",
    artist: "Childish Gambino",
    album: "Awaken, My Love!",
    duration: "5:26",
    imageUrl: "https://i.scdn.co/image/ab67616d00001e02f254f2bdd40aa34aa82f2b4a",
    category: "R&B"
  }
];

export const playlists = [
  {
    id: 1,
    title: "Today's Top Hits",
    description: "The hottest tracks right now",
    imageUrl: "https://i.scdn.co/image/ab67706f000000027ea4d505212b9de1f72c5112",
    songs: [2, 3, 7, 11]
  },
  {
    id: 2,
    title: "Rock Classics",
    description: "Rock legends & epic songs",
    imageUrl: "https://i.scdn.co/image/ab67706f0000000278b4745cb9ce8ffe32daaf7e",
    songs: [5, 10]
  },
  {
    id: 3,
    title: "Electronic Mix",
    description: "The best electronic music selection",
    imageUrl: "https://i.scdn.co/image/ab67706f00000002b0fe40a6e1692822f5a9d8f1",
    songs: [6, 12]
  },
  {
    id: 4,
    title: "Hip-Hop Essentials",
    description: "The essential hip-hop tracks",
    imageUrl: "https://i.scdn.co/image/ab67706f00000002aa93fe4e8c2d24fc62556cba",
    songs: [4, 7]
  },
  {
    id: 5,
    title: "Chill Vibes",
    description: "Relax and unwind with these smooth tracks",
    imageUrl: "https://i.scdn.co/image/ab67706f00000002c414e7daf34690c9f983f76e",
    songs: [8, 9, 14]
  },
  {
    id: 6,
    title: "Indie Radar",
    description: "The best indie tracks on our radar",
    imageUrl: "https://i.scdn.co/image/ab67706f0000000208ca740941aa65b5a4879c86",
    songs: [13]
  }
]; 