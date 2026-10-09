import { useEffect, useState } from 'react'
import { BackwardIcon, ForwardIcon, PauseIcon, PlayIcon } from '@heroicons/react/24/solid'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { usePlayer } from '../../context/PlayerContext'
import Cover from '../Cover'
import Equalizer from '../Equalizer'

function useFraction(audio) {
  const [f, setF] = useState(0)
  useEffect(() => {
    const sync = () => setF(audio.duration > 0 && Number.isFinite(audio.duration) ? audio.currentTime / audio.duration : 0)
    const events = ['timeupdate', 'durationchange', 'emptied']
    events.forEach((e) => audio.addEventListener(e, sync))
    return () => events.forEach((e) => audio.removeEventListener(e, sync))
  }, [audio])
  return f
}

// Compact transport shown on the landing page once a preview has started.
export default function MiniPlayer() {
  const p = usePlayer()
  const fraction = useFraction(p.audio)
  const t = p.currentTrack
  if (!t) return null
  const failed = p.status === 'error'
  const Icon = p.isPlaying ? PauseIcon : PlayIcon
  return (
    <div role="region" aria-label="Preview player" className="rise fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/80 shadow-2xl shadow-black/60 backdrop-blur-xl" style={{ '--d': '0s' }}>
      <div className="flex items-center gap-3 p-2.5 pr-3">
        <Cover src={t.artworkUrl} seed={t.album} className="h-12 w-12 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">{t.title}</p>
          <p className={`flex items-center gap-1.5 truncate text-xs ${failed ? 'text-danger' : 'text-white/60'}`}>
            {failed ? <><ExclamationTriangleIcon className="h-4 w-4 shrink-0" /> Audio unavailable</> : <>{p.status === 'playing' && <Equalizer className="h-3 w-3.5 shrink-0" />}{t.artist}</>}
          </p>
        </div>
        <button type="button" aria-label="Previous track" onClick={p.prev} className="grid h-10 w-10 place-items-center rounded-full text-white/70 hover:text-white"><BackwardIcon className="h-5 w-5" /></button>
        <button type="button" aria-label={p.isPlaying ? 'Pause' : 'Play'} onClick={p.togglePlay} className="grid h-10 w-10 place-items-center rounded-full bg-white text-black transition hover:scale-105 active:scale-95"><Icon className="h-5 w-5" /></button>
        <button type="button" aria-label="Next track" onClick={p.next} className="grid h-10 w-10 place-items-center rounded-full text-white/70 hover:text-white"><ForwardIcon className="h-5 w-5" /></button>
      </div>
      <div className="h-0.5 bg-white/10" role="presentation"><div className="h-full origin-left bg-accent" style={{ transform: `scaleX(${fraction})` }} /></div>
    </div>
  )
}
