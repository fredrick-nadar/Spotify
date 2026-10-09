import { Link } from 'react-router-dom'
import { slug } from '../lib/format'
import { tracksByGenre } from '../lib/catalogue'

const COLORS = ['bg-emerald-700', 'bg-indigo-600', 'bg-rose-700', 'bg-amber-700', 'bg-sky-700', 'bg-fuchsia-700', 'bg-teal-700', 'bg-orange-700']
const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7)

export default function GenreTile({ genre }) {
  return (
    <Link to={`/genre/${slug(genre)}`} className={`relative flex h-24 overflow-hidden rounded-lg p-4 text-xl font-bold transition hover:scale-[1.02] sm:h-32 ${COLORS[hash(genre) % COLORS.length]}`}>
      <span>{genre}<span className="mt-1 block text-xs font-medium text-white/80">{tracksByGenre(genre).length} songs</span></span>
    </Link>
  )
}
