import { Link } from 'react-router-dom'
import { HeartIcon as HeartSolid, PauseIcon, PlayIcon } from '@heroicons/react/24/solid'
import { HeartIcon, PlusCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { usePlayer } from '../context/PlayerContext'
import { useLibrary } from '../context/LibraryContext'
import { useDialogs } from '../context/DialogContext'
import { formatTime, slug } from '../lib/format'
import Cover from './Cover'
import Equalizer from './Equalizer'

const iconBtn = 'rounded-full p-1.5 text-muted transition hover:text-white focus-visible:opacity-100'

function TrackRow({ track, index, list, onRemove }) {
  const { currentTrack, isPlaying, playTracks, togglePlay } = usePlayer()
  const { likedSet, toggleLike } = useLibrary()
  const dialogs = useDialogs()
  const active = currentTrack?.id === track.id
  const playingNow = active && isPlaying
  const liked = likedSet.has(track.id)

  const play = () => (active ? togglePlay() : playTracks(list, index))

  return (
    <li
      onDoubleClick={play}
      className={`group grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-x-3 rounded-md px-2 py-1.5 hover:bg-white/10 md:grid-cols-[2rem_minmax(0,4fr)_minmax(0,3fr)_auto] md:gap-x-4 ${active ? 'bg-white/5' : ''}`}
    >
      <button type="button" onClick={play} aria-label={`${playingNow ? 'Pause' : 'Play'} ${track.title} by ${track.artist}`} className="grid h-8 w-8 place-items-center rounded text-sm text-muted">
        <span className={`${playingNow ? 'hidden' : 'group-hover:hidden group-focus-within:hidden'} tabular-nums ${active ? 'text-accent' : ''}`}>{active && !playingNow ? <PauseIcon className="h-4 w-4" /> : index + 1}</span>
        {playingNow && <span className="group-hover:hidden group-focus-within:hidden"><Equalizer /></span>}
        <span className="hidden text-white group-hover:block group-focus-within:block">
          {playingNow ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
        </span>
      </button>

      <div className="flex min-w-0 items-center gap-3">
        <Cover src={track.artworkUrl} seed={track.album} className="h-10 w-10 shrink-0" />
        <div className="min-w-0">
          <p className={`truncate text-[15px] font-medium ${active ? 'text-accent' : 'text-white'}`}>{track.title}</p>
          <p className="truncate text-sm text-muted">
            <Link to={`/artist/${slug(track.artist)}`} className="hover:text-white hover:underline">{track.artist}</Link>
          </p>
        </div>
      </div>

      <p className="hidden min-w-0 truncate text-sm text-muted md:block">
        <Link to={`/album/${slug(track.album)}`} className="hover:text-white hover:underline">{track.album}</Link>
      </p>

      <div className="flex items-center gap-0.5 sm:gap-1">
        <button type="button" aria-pressed={liked} aria-label={liked ? `Remove ${track.title} from Liked Songs` : `Save ${track.title} to Liked Songs`} onClick={() => toggleLike(track.id)} className={`${iconBtn} ${liked ? '' : 'md:opacity-0 md:group-hover:opacity-100'}`}>
          {liked ? <HeartSolid className="h-5 w-5 text-accent" /> : <HeartIcon className="h-5 w-5" />}
        </button>
        <span className="hidden w-10 text-right text-sm tabular-nums text-muted sm:block">{formatTime(track.durationSec)}</span>
        <button type="button" aria-label={`Add ${track.title} to playlist`} onClick={() => dialogs.addToPlaylist(track)} className={`${iconBtn} md:opacity-0 md:group-hover:opacity-100`}>
          <PlusCircleIcon className="h-5 w-5" />
        </button>
        {onRemove && (
          <button type="button" aria-label={`Remove ${track.title} from this playlist`} onClick={() => onRemove(track)} className={`${iconBtn} md:opacity-0 md:group-hover:opacity-100`}>
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    </li>
  )
}

export default function TrackList({ tracks, onRemove }) {
  return (
    <div>
      <div aria-hidden="true" className="mb-1 hidden grid-cols-[2rem_minmax(0,4fr)_minmax(0,3fr)_auto] gap-x-4 border-b border-line px-2 pb-2 text-xs uppercase tracking-wider text-faint md:grid">
        <span className="text-center">#</span><span>Title</span><span>Album</span><span className="w-[7.75rem] pr-1 text-right">Time</span>
      </div>
      <ul>
        {tracks.map((t, i) => <TrackRow key={t.id} track={t} index={i} list={tracks} onRemove={onRemove} />)}
      </ul>
    </div>
  )
}
