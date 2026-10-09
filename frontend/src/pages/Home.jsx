import { Link } from 'react-router-dom'
import { PlayIcon } from '@heroicons/react/24/solid'
import { useAuth } from '../context/AuthContext'
import { useLibrary } from '../context/LibraryContext'
import { usePlayer } from '../context/PlayerContext'
import { albums, artists, genres, resolveTracks, tracks, tracksByGenre } from '../lib/catalogue'
import { slug } from '../lib/format'
import Cover from '../components/Cover'
import MediaCard from '../components/MediaCard'
import Shelf from '../components/Shelf'
import TrackList from '../components/TrackList'
import GenreTile from '../components/GenreTile'

const greeting = () => {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
}

export default function Home() {
  const { user } = useAuth()
  const { recent, playlists } = useLibrary()
  const { playTracks, currentTrack } = usePlayer()
  const recentTracks = resolveTracks(recent).slice(0, 8)

  return (
    <>
      <h1 className="mb-6 text-3xl font-extrabold tracking-tight">{greeting()}, {user.name.split(' ')[0]}</h1>

      {recentTracks.length > 0 ? (
        <section aria-label="Recently played" className="mb-10">
          <h2 className="mb-4 text-2xl font-bold tracking-tight">Recently played</h2>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {recentTracks.map((t, i) => (
              <li key={t.id}>
                <button type="button" onClick={() => playTracks(recentTracks, i)} aria-label={`Play ${t.title} by ${t.artist}`} className="group flex w-full items-center gap-3 overflow-hidden rounded-md bg-white/10 pr-3 text-left transition hover:bg-white/20">
                  <Cover src={t.artworkUrl} seed={t.album} className="h-14 w-14 shrink-0 !rounded-none" />
                  <span className={`min-w-0 flex-1 truncate text-sm font-bold ${currentTrack?.id === t.id ? 'text-accent' : ''}`}>{t.title}</span>
                  <PlayIcon className="h-6 w-6 shrink-0 text-accent opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <p className="mb-10 rounded-lg bg-raised p-4 text-sm text-muted">Songs you play will show up here. Start with a mix below.</p>
      )}

      <Shelf title="Featured playlists">
        {genres.map((g) => {
          const list = tracksByGenre(g)
          return <MediaCard key={g} to={`/genre/${slug(g)}`} title={`${g} Mix`} subtitle={`${list.length} songs · ${[...new Set(list.map((t) => t.artist))].slice(0, 3).join(', ')}`} artworkUrl={list[0].artworkUrl} onPlay={() => playTracks(list, 0)} />
        })}
        {playlists.slice(0, 4).map((p) => {
          const list = resolveTracks(p.trackIds)
          return <MediaCard key={p.id} to={`/playlist/${p.id}`} title={p.name} subtitle={`Your playlist · ${list.length} songs`} artworkUrl={list[0]?.artworkUrl} onPlay={list.length ? () => playTracks(list, 0) : undefined} />
        })}
      </Shelf>

      <section aria-label="Featured songs" className="mb-10">
        <div className="mb-4 flex items-baseline justify-between"><h2 className="text-2xl font-bold tracking-tight">Featured songs</h2><Link to="/browse" className="text-sm font-bold text-muted hover:text-white hover:underline">Show all</Link></div>
        <TrackList tracks={tracks.slice(0, 8)} />
      </section>

      <section aria-label="Browse by genre" className="mb-10">
        <h2 className="mb-4 text-2xl font-bold tracking-tight">Browse by genre</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">{genres.map((g) => <GenreTile key={g} genre={g} />)}</div>
      </section>

      <Shelf title="Albums">
        {albums.map((a) => <MediaCard key={a.name} to={`/album/${slug(a.name)}`} title={a.name} subtitle={a.artist} artworkUrl={a.artworkUrl} onPlay={() => playTracks(a.tracks, 0)} />)}
      </Shelf>

      <Shelf title="Artists">
        {artists.map((a) => <MediaCard key={a.name} round to={`/artist/${slug(a.name)}`} title={a.name} subtitle="Artist" artworkUrl={a.artworkUrl} onPlay={() => playTracks(a.tracks, 0)} />)}
      </Shelf>
    </>
  )
}
