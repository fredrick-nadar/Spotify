import { tracks } from '../data/catalogue'

export { tracks }

const byId = new Map(tracks.map((t) => [t.id, t]))
export const getTrack = (id) => byId.get(id)
export const resolveTracks = (ids) => ids.map(getTrack).filter(Boolean)

const group = (key) => {
  const map = new Map()
  for (const t of tracks) map.set(t[key], [...(map.get(t[key]) ?? []), t])
  return map
}

const byGenre = group('genre')
const byArtist = group('artist')
const byAlbum = group('album')

export const genres = [...byGenre.keys()].sort()
export const tracksByGenre = (g) => byGenre.get(g) ?? []
export const tracksByArtist = (a) => byArtist.get(a) ?? []
export const tracksByAlbum = (a) => byAlbum.get(a) ?? []

const unique = (key) => [...group(key).entries()].map(([name, list]) => ({ name, tracks: list, artworkUrl: list[0].artworkUrl, artist: list[0].artist }))
export const artists = unique('artist').sort((a, b) => a.name.localeCompare(b.name))
export const albums = unique('album').sort((a, b) => a.name.localeCompare(b.name))

const norm = (s) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')

export function search(query) {
  const terms = norm(query).split(/\s+/).filter(Boolean)
  if (!terms.length) return { tracks: [], artists: [], albums: [] }
  const hit = (...fields) => {
    const hay = norm(fields.join(' '))
    return terms.every((t) => hay.includes(t))
  }
  return {
    tracks: tracks.filter((t) => hit(t.title, t.artist, t.album, t.genre)),
    artists: artists.filter((a) => hit(a.name)),
    albums: albums.filter((a) => hit(a.name, a.artist)),
  }
}

export const totalDuration = (list) => list.reduce((sum, t) => sum + (t.durationSec || 0), 0)
