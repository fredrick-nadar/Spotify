import { useSearchParams } from 'react-router-dom'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { genres, search } from '../lib/catalogue'
import { slug } from '../lib/format'
import { usePlayer } from '../context/PlayerContext'
import EmptyState from '../components/EmptyState'
import GenreTile from '../components/GenreTile'
import MediaCard from '../components/MediaCard'
import Shelf from '../components/Shelf'
import TrackList from '../components/TrackList'

export default function Search() {
  const [params, setParams] = useSearchParams()
  const { playTracks } = usePlayer()
  const q = params.get('q') ?? ''
  const results = search(q.slice(0, 100))
  const empty = !results.tracks.length && !results.artists.length && !results.albums.length

  return (
    <>
      <h1 className="sr-only">Search</h1>
      <form role="search" onSubmit={(e) => e.preventDefault()} className="relative mb-6 md:hidden">
        <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
        <input
          type="search" aria-label="Search songs, artists, albums and genres" placeholder="What do you want to play?" value={q} maxLength={100}
          onChange={(e) => setParams(e.target.value ? { q: e.target.value } : {}, { replace: true })}
          className="h-12 w-full rounded-full bg-raised pl-11 pr-4 text-sm placeholder:text-muted focus:outline-2 focus:outline-white"
        />
      </form>

      {!q.trim() ? (
        <section aria-label="Browse all genres">
          <h2 className="mb-4 text-2xl font-bold tracking-tight">Browse all</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">{genres.map((g) => <GenreTile key={g} genre={g} />)}</div>
        </section>
      ) : empty ? (
        <EmptyState icon={MagnifyingGlassIcon} title={`No results found for “${q}”`}>Check the spelling, or try a different title, artist, album or genre.</EmptyState>
      ) : (
        <>
          {results.tracks.length > 0 && (
            <section aria-label="Songs" className="mb-10">
              <h2 className="mb-4 text-2xl font-bold tracking-tight">Songs</h2>
              <TrackList tracks={results.tracks} />
            </section>
          )}
          {results.artists.length > 0 && (
            <Shelf title="Artists">
              {results.artists.map((a) => <MediaCard key={a.name} round to={`/artist/${slug(a.name)}`} title={a.name} subtitle="Artist" artworkUrl={a.artworkUrl} onPlay={() => playTracks(a.tracks, 0)} />)}
            </Shelf>
          )}
          {results.albums.length > 0 && (
            <Shelf title="Albums">
              {results.albums.map((a) => <MediaCard key={a.name} to={`/album/${slug(a.name)}`} title={a.name} subtitle={a.artist} artworkUrl={a.artworkUrl} onPlay={() => playTracks(a.tracks, 0)} />)}
            </Shelf>
          )}
        </>
      )}
    </>
  )
}
