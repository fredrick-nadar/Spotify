import { Link } from 'react-router-dom'
import Cover from './Cover'
import PlayButton from './PlayButton'

// Card linking to a detail page, with an optional quick-play button.
export default function MediaCard({ to, title, subtitle, artworkUrl, round, onPlay, playing, playLabel }) {
  return (
    <div className="group relative rounded-lg bg-raised/60 p-3 transition hover:bg-hover sm:p-4">
      <Link to={to} className="block after:absolute after:inset-0 after:rounded-lg after:content-['']">
        <Cover src={artworkUrl} seed={title} round={round} className="mb-3 w-full shadow-lg shadow-black/40" />
        <p className="truncate font-bold">{title}</p>
        <p className="mt-0.5 line-clamp-2 min-h-[2.5rem] text-sm text-muted">{subtitle}</p>
      </Link>
      {onPlay && (
        <PlayButton
          size="sm" playing={playing} label={playLabel ?? `Play ${title}`} onClick={onPlay}
          className="absolute bottom-[4.75rem] right-5 z-10 translate-y-2 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100 max-md:translate-y-0 max-md:opacity-100"
        />
      )}
    </div>
  )
}
