import PlayButton from './PlayButton'
import { useShuffleButton } from './useShuffleButton'

// Hero header used by playlist, album, artist and liked-songs pages.
export default function PageHeader({ kind, title, meta, cover, tracks, tint = 'from-emerald-800/70', children }) {
  const { playing, toggle, shuffleBtn } = useShuffleButton(tracks)
  return (
    <header className={`-mx-4 -mt-4 mb-6 bg-gradient-to-b ${tint} to-transparent px-4 pb-6 pt-10 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8`}>
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-end sm:gap-6">
        <div className="h-44 w-44 shrink-0 shadow-2xl shadow-black/60 sm:h-52 sm:w-52">{cover}</div>
        <div className="min-w-0 text-center sm:text-left">
          <p className="text-sm font-bold">{kind}</p>
          <h1 className="my-2 break-words text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">{title}</h1>
          <p className="text-sm text-muted">{meta}</p>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-center gap-4 sm:justify-start">
        {tracks.length > 0 && (
          <>
            <PlayButton size="lg" playing={playing} label={playing ? `Pause ${title}` : `Play ${title}`} onClick={toggle} />
            {shuffleBtn}
          </>
        )}
        {children}
      </div>
    </header>
  )
}
