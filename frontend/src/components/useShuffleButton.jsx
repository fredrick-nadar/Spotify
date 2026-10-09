import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline'
import { usePlayer } from '../context/PlayerContext'

// Play/pause logic for a track collection plus a shuffle-play button.
export function useShuffleButton(tracks) {
  const { queue, isPlaying, currentTrack, playTracks, togglePlay } = usePlayer()
  const ids = new Set(tracks.map((t) => t.id))
  const inThisList = currentTrack && ids.has(currentTrack.id) && queue.length === tracks.length && queue.every((t) => ids.has(t.id))
  const playing = Boolean(inThisList && isPlaying)
  const toggle = () => (inThisList ? togglePlay() : playTracks(tracks, 0, { shuffle: false }))
  const shuffleBtn = (
    <button type="button" aria-label="Shuffle play" onClick={() => playTracks(tracks, Math.floor(Math.random() * tracks.length), { shuffle: true })} className="rounded-full p-2 text-muted hover:text-white">
      <ArrowsRightLeftIcon className="h-8 w-8" />
    </button>
  )
  return { playing, toggle, shuffleBtn }
}
