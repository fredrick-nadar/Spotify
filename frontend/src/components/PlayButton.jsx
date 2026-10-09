import { PauseIcon, PlayIcon } from '@heroicons/react/24/solid'

export default function PlayButton({ playing, label, onClick, size = 'md', className = '' }) {
  const dims = size === 'lg' ? 'h-14 w-14' : size === 'sm' ? 'h-10 w-10' : 'h-12 w-12'
  const Icon = playing ? PauseIcon : PlayIcon
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`grid ${dims} shrink-0 place-items-center rounded-full bg-accent text-black shadow-lg transition hover:scale-105 hover:bg-accent-hover active:scale-100 ${className}`}
    >
      <Icon className={size === 'sm' ? 'h-5 w-5' : 'h-6 w-6'} />
    </button>
  )
}
