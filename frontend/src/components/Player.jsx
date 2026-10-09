import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BackwardIcon, ForwardIcon, HeartIcon as HeartSolid, PauseIcon, PlayIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/solid'
import { ArrowPathIcon, ArrowsRightLeftIcon, ExclamationTriangleIcon, HeartIcon } from '@heroicons/react/24/outline'
import { usePlayer } from '../context/PlayerContext'
import { useLibrary } from '../context/LibraryContext'
import { formatTime, slug } from '../lib/format'
import Cover from './Cover'

// Subscribes to the audio element directly so only this component re-renders on every tick.
function useProgress(audio, fallbackDuration) {
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  useEffect(() => {
    const sync = () => {
      setTime(audio.currentTime || 0)
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0)
    }
    const events = ['timeupdate', 'durationchange', 'loadedmetadata', 'seeked', 'emptied']
    events.forEach((e) => audio.addEventListener(e, sync))
    sync()
    return () => events.forEach((e) => audio.removeEventListener(e, sync))
  }, [audio])
  return { time, duration: duration || fallbackDuration || 0 }
}

function Slider({ label, value, max, onChange, valueText, className = '' }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  return (
    <div className={`slider-wrap ${className}`}>
      <input
        type="range" className="slider" aria-label={label} aria-valuetext={valueText}
        min={0} max={max || 1} step="any" value={Math.min(value, max || 1)} disabled={!max}
        onChange={(e) => onChange(Number(e.target.value))} style={{ '--pct': `${pct}%` }}
      />
    </div>
  )
}

const ctrl = 'grid h-9 w-9 place-items-center rounded-full transition'

export default function Player() {
  const p = usePlayer()
  const { likedSet, toggleLike } = useLibrary()
  const { currentTrack: track } = p
  const { time, duration } = useProgress(p.audio, track?.durationSec)

  if (!track) {
    return (
      <footer className="flex h-16 shrink-0 items-center justify-center px-4 text-sm text-muted md:h-[4.5rem]">
        Pick a song to start listening.
      </footer>
    )
  }

  const liked = likedSet.has(track.id)
  const failed = p.status === 'error'
  const PlayPause = p.status === 'playing' || p.status === 'loading' ? PauseIcon : PlayIcon
  const playLabel = PlayPause === PauseIcon ? 'Pause' : 'Play'
  const volumeLevel = p.muted ? 0 : p.volume

  return (
    <footer aria-label="Player" className="shrink-0 px-2 pb-2 md:px-4 md:pb-3">
      {failed && (
        <div role="alert" className="mb-2 flex items-center gap-2 rounded-md bg-danger px-3 py-2 text-sm font-medium text-black">
          <ExclamationTriangleIcon className="h-5 w-5 shrink-0" />
          <span className="min-w-0 flex-1">“{track.title}” can’t be played right now — the audio source is unavailable.</span>
          <button type="button" onClick={p.next} className="shrink-0 rounded-full bg-black px-3 py-1 text-xs font-bold text-white">Next track</button>
        </div>
      )}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 rounded-lg bg-raised p-2 md:grid-cols-[1fr_minmax(22rem,40rem)_1fr] md:bg-transparent md:p-0">
        <div className="flex min-w-0 items-center gap-3">
          <Cover src={track.artworkUrl} seed={track.album} className="h-12 w-12 shrink-0 md:h-14 md:w-14" />
          <div className="min-w-0">
            <Link to={`/album/${slug(track.album)}`} className="block truncate text-sm font-medium hover:underline">{track.title}</Link>
            <Link to={`/artist/${slug(track.artist)}`} className="block truncate text-xs text-muted hover:text-white hover:underline">{track.artist}</Link>
          </div>
          <button type="button" aria-pressed={liked} aria-label={liked ? 'Remove from Liked Songs' : 'Save to Liked Songs'} onClick={() => toggleLike(track.id)} className={`${ctrl} shrink-0 text-muted hover:text-white`}>
            {liked ? <HeartSolid className="h-5 w-5 text-accent" /> : <HeartIcon className="h-5 w-5" />}
          </button>
        </div>

        <div className="flex flex-col items-center gap-1 max-md:contents">
          <div className="flex items-center gap-1 max-md:justify-self-end">
            <button type="button" aria-label="Shuffle" aria-pressed={p.shuffle} onClick={p.toggleShuffle} className={`${ctrl} max-md:hidden ${p.shuffle ? 'text-accent' : 'text-muted hover:text-white'}`}><ArrowsRightLeftIcon className="h-5 w-5" /></button>
            <button type="button" aria-label="Previous track" onClick={p.prev} className={`${ctrl} text-muted hover:text-white`}><BackwardIcon className="h-5 w-5" /></button>
            <button type="button" aria-label={playLabel} onClick={p.togglePlay} className="grid h-10 w-10 place-items-center rounded-full bg-white text-black transition hover:scale-105">
              <PlayPause className="h-5 w-5" />
            </button>
            <button type="button" aria-label="Next track" onClick={p.next} className={`${ctrl} text-muted hover:text-white`}><ForwardIcon className="h-5 w-5" /></button>
            <button type="button" aria-label={`Repeat: ${p.repeat}`} aria-pressed={p.repeat !== 'off'} onClick={p.cycleRepeat} className={`${ctrl} relative max-md:hidden ${p.repeat !== 'off' ? 'text-accent' : 'text-muted hover:text-white'}`}>
              <ArrowPathIcon className="h-5 w-5" />
              {p.repeat === 'one' && <span aria-hidden="true" className="absolute right-1 top-1 text-[9px] font-extrabold">1</span>}
            </button>
          </div>
          <div className="flex w-full items-center gap-2 text-xs tabular-nums text-muted max-md:col-span-2">
            <span className="w-10 text-right" aria-hidden="true">{formatTime(time)}</span>
            <Slider className="flex-1" label="Seek" value={time} max={duration} onChange={p.seek} valueText={`${formatTime(time)} of ${formatTime(duration)}`} />
            <span className="w-10" aria-hidden="true">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 max-md:hidden">
          {p.buffering && <span className="text-xs text-muted" role="status">Buffering…</span>}
          <button type="button" aria-label={p.muted ? 'Unmute' : 'Mute'} aria-pressed={p.muted} onClick={p.toggleMute} className={`${ctrl} text-muted hover:text-white`}>
            {volumeLevel === 0 ? <SpeakerXMarkIcon className="h-5 w-5" /> : <SpeakerWaveIcon className="h-5 w-5" />}
          </button>
          <Slider className="w-28" label="Volume" value={volumeLevel} max={1} onChange={p.setVolume} valueText={`${Math.round(volumeLevel * 100)}%`} />
        </div>
      </div>
    </footer>
  )
}
