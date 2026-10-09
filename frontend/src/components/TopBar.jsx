import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useSearchParams, Link } from 'react-router-dom'
import { ArrowRightStartOnRectangleIcon, MagnifyingGlassIcon, MusicalNoteIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../context/AuthContext'

export default function TopBar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [params] = useSearchParams()
  const onSearch = pathname === '/search'
  const query = onSearch ? (params.get('q') ?? '') : ''
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const away = (e) => !menuRef.current?.contains(e.target) && setOpen(false)
    const esc = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', away)
    document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('pointerdown', away); document.removeEventListener('keydown', esc) }
  }, [open])

  const setQuery = (value) => navigate(value ? `/search?q=${encodeURIComponent(value)}` : '/search', { replace: onSearch })

  return (
    <header className="flex items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
      <Link to="/" aria-label="Spot home" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-black md:hidden"><MusicalNoteIcon className="h-5 w-5" /></Link>
      <form role="search" onSubmit={(e) => e.preventDefault()} className="relative hidden w-full max-w-md md:block">
        <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
        <input
          type="search" aria-label="Search songs, artists, albums and genres" placeholder="What do you want to play?" value={query}
          onChange={(e) => setQuery(e.target.value)} onFocus={() => !onSearch && navigate('/search')}
          className="h-11 w-full rounded-full border border-transparent bg-raised pl-11 pr-10 text-sm placeholder:text-muted hover:border-line focus:border-white focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        {query && <button type="button" aria-label="Clear search" onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white"><XMarkIcon className="h-5 w-5" /></button>}
      </form>

      <div ref={menuRef} className="relative ml-auto">
        <button type="button" aria-haspopup="menu" aria-expanded={open} aria-label={`Account menu for ${user.name}`} onClick={() => setOpen((o) => !o)} className="grid h-10 w-10 place-items-center rounded-full bg-raised text-sm font-bold ring-2 ring-transparent hover:ring-white/30">
          {user.name.trim().charAt(0).toUpperCase()}
        </button>
        {open && (
          <div role="menu" className="absolute right-0 top-12 z-40 w-60 rounded-lg border border-line bg-raised p-1 shadow-2xl">
            <div className="border-b border-line px-3 py-2">
              <p className="truncate text-sm font-bold">{user.name}</p>
              <p className="truncate text-xs text-muted">{user.email}</p>
            </div>
            <button role="menuitem" type="button" autoFocus onClick={() => logout().catch(() => {})} className="mt-1 flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-hover">
              <ArrowRightStartOnRectangleIcon className="h-5 w-5" /> Log out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
