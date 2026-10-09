import { HeartIcon } from '@heroicons/react/24/solid'
import { Link } from 'react-router-dom'
import { useLibrary } from '../context/LibraryContext'
import { resolveTracks, totalDuration } from '../lib/catalogue'
import { formatTotal, plural } from '../lib/format'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import TrackList from '../components/TrackList'

export default function Liked() {
  const { liked } = useLibrary()
  const tracks = resolveTracks(liked)
  return (
    <>
      <PageHeader
        kind="Playlist" title="Liked Songs" tracks={tracks} tint="from-indigo-700/70"
        meta={`${plural(tracks.length, 'song')}${tracks.length ? ` · ${formatTotal(totalDuration(tracks))}` : ''}`}
        cover={<span className="grid h-full w-full place-items-center rounded-md bg-gradient-to-br from-indigo-500 to-emerald-300"><HeartIcon className="h-1/2 w-1/2 text-white" /></span>}
      />
      {tracks.length ? <TrackList tracks={tracks} /> : (
        <EmptyState icon={HeartIcon} title="Songs you like will appear here">
          Save songs by tapping the heart. <Link to="/browse" className="font-bold text-white underline">Find something to play</Link>.
        </EmptyState>
      )}
    </>
  )
}
