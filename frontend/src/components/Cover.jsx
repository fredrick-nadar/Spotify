import { useState } from 'react'
import { MusicalNoteIcon } from '@heroicons/react/24/solid'

const GRADIENTS = [
  'from-emerald-700 to-teal-900', 'from-indigo-600 to-slate-900', 'from-rose-600 to-purple-900',
  'from-amber-600 to-orange-900', 'from-sky-600 to-blue-900', 'from-fuchsia-700 to-violet-900',
]
const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7)

// Artwork with a themed fallback when the image is missing or fails to load.
export default function Cover({ src, seed = '', className = '', round = false }) {
  const [failedSrc, setFailedSrc] = useState(null)
  const shape = round ? 'rounded-full' : 'rounded-md'
  if (!src || failedSrc === src) {
    return (
      <div aria-hidden="true" className={`grid aspect-square place-items-center bg-gradient-to-br ${GRADIENTS[hash(seed) % GRADIENTS.length]} ${shape} ${className}`}>
        <MusicalNoteIcon className="h-1/3 w-1/3 text-white/70" />
      </div>
    )
  }
  return <img src={src} alt="" loading="lazy" onError={() => setFailedSrc(src)} onLoad={(e) => { const { naturalWidth: w, naturalHeight: h } = e.currentTarget; if (w && h && Math.abs(w / h - 1) > 0.25) setFailedSrc(src) }} className={`aspect-square bg-hover object-cover ${shape} ${className}`} />
}
