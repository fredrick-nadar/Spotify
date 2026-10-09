import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { genres, tracks, tracksByGenre } from '../lib/catalogue'
import { slug } from '../lib/format'
import EmptyState from '../components/EmptyState'
import TrackList from '../components/TrackList'
import { MusicalNoteIcon } from '@heroicons/react/24/outline'

const SORTS = {
  default: ['Featured', null],
  title: ['Title', (a, b) => a.title.localeCompare(b.title)],
  artist: ['Artist', (a, b) => a.artist.localeCompare(b.artist) || a.title.localeCompare(b.title)],
  duration: ['Duration', (a, b) => a.durationSec - b.durationSec],
}

// Serves both /browse (all songs) and /genre/:genre.
export default function Browse() {
  const { genre } = useParams()
  const [sort, setSort] = useState('default')
  const list = useMemo(() => {
    const base = genre ? tracksByGenre(genre) : tracks
    const cmp = SORTS[sort][1]
    return cmp ? [...base].sort(cmp) : base
  }, [genre, sort])

  const chip = (active) => `rounded-full px-4 py-1.5 text-sm font-medium transition ${active ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20'}`

  return (
    <>
      <h1 className="mb-1 text-3xl font-extrabold tracking-tight">{genre ? `${genre} songs` : 'Browse songs'}</h1>
      <p className="mb-5 text-sm text-muted">{list.length} {list.length === 1 ? 'song' : 'songs'}</p>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <nav aria-label="Genres" className="flex flex-wrap gap-2">
          <Link to="/browse" aria-current={!genre ? 'page' : undefined} className={chip(!genre)}>All</Link>
          {genres.map((g) => <Link key={g} to={`/genre/${slug(g)}`} aria-current={g === genre ? 'page' : undefined} className={chip(g === genre)}>{g}</Link>)}
        </nav>
        <label className="ml-auto flex items-center gap-2 text-sm text-muted">
          Sort by
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-md border border-line bg-raised px-2 py-1.5 text-white">
            {Object.entries(SORTS).map(([k, [label]]) => <option key={k} value={k}>{label}</option>)}
          </select>
        </label>
      </div>
      {list.length ? <TrackList tracks={list} /> : <EmptyState icon={MusicalNoteIcon} title="No songs in this genre">Try another genre from the list above.</EmptyState>}
    </>
  )
}
