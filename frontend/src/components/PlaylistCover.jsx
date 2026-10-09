import { MusicalNoteIcon } from '@heroicons/react/24/solid'
import { resolveTracks } from '../lib/catalogue'
import Cover from './Cover'

// Mosaic of the first four distinct album covers, or a single cover / placeholder.
export default function PlaylistCover({ ids, className = '' }) {
  const arts = [...new Set(resolveTracks(ids).map((t) => t.artworkUrl))].filter(Boolean)
  if (arts.length === 0) {
    return <div aria-hidden="true" className={`grid place-items-center rounded bg-hover ${className}`}><MusicalNoteIcon className="h-1/2 w-1/2 text-faint" /></div>
  }
  if (arts.length < 4) return <Cover src={arts[0]} className={`rounded ${className}`} />
  return (
    <div aria-hidden="true" className={`grid grid-cols-2 overflow-hidden rounded ${className}`}>
      {arts.slice(0, 4).map((a) => <Cover key={a} src={a} className="h-full w-full !rounded-none" />)}
    </div>
  )
}
