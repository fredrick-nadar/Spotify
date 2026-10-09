import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Bars3Icon, MusicalNoteIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../../context/AuthContext'

export function Logo({ className = '' }) {
  return (
    <Link to="/welcome" viewTransition className={`flex items-center gap-2.5 text-xl font-extrabold tracking-tight ${className}`}>
      <span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-black"><MusicalNoteIcon className="h-5 w-5" strokeWidth={2.2} /></span>
      Spot
    </Link>
  )
}

// In-page anchors on the landing page itself; full links from other public pages.
function useLinks() {
  const { pathname } = useLocation()
  const base = pathname === '/' || pathname === '/welcome' ? '' : '/welcome'
  return [['Explore', `${base}#discover`], ['Features', `${base}#features`]]
}
const pill = 'inline-flex h-10 items-center rounded-full px-5 text-sm font-bold transition duration-200 active:scale-[.97]'

function AuthActions({ onNavigate }) {
  const { user } = useAuth()
  // Hold the space while the session check runs so the nav doesn't shift.
  if (user === undefined) return <span className="h-10 w-40" aria-hidden="true" />
  return user ? (
    <Link to="/" viewTransition onClick={onNavigate} className={`${pill} bg-white text-black hover:scale-105`}>Open player</Link>
  ) : (
    <>
      <Link to="/login" viewTransition onClick={onNavigate} className={`${pill} text-white/80 hover:text-white`}>Sign in</Link>
      <Link to="/signup" viewTransition onClick={onNavigate} className={`${pill} bg-white text-black hover:scale-105`}>Get started</Link>
    </>
  )
}

export function LandingNav() {
  const LINKS = useLinks()
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!open) return
    const esc = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', esc)
    return () => document.removeEventListener('keydown', esc)
  }, [open])

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-black/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-5 sm:px-8">
        <Logo />
        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {LINKS.map(([label, href]) => <a key={label} href={href} className="rounded-full px-4 py-2 text-sm font-medium text-white/70 transition hover:text-white">{label}</a>)}
        </nav>
        <div className="ml-auto hidden items-center gap-2 md:flex"><AuthActions /></div>
        <button type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)} className="ml-auto grid h-11 w-11 place-items-center rounded-full hover:bg-white/10 md:hidden">
          {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <div id="mobile-menu" className="rise border-t border-white/5 px-5 pb-6 pt-3 md:hidden" style={{ '--d': '0s' }}>
          <nav aria-label="Mobile" className="flex flex-col">
            {LINKS.map(([label, href]) => <a key={label} href={href} onClick={() => setOpen(false)} className="rounded-lg px-2 py-3.5 text-lg font-bold">{label}</a>)}
          </nav>
          <div className="mt-3 flex items-center gap-2"><AuthActions onNavigate={() => setOpen(false)} /></div>
        </div>
      )}
    </header>
  )
}

export function LandingFooter() {
  const { user } = useAuth()
  const [explore, features] = useLinks()
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-12 sm:px-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-sm text-white/60">A music player demo built on Creative Commons music from the Internet Archive.</p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm text-white/70">
          <a href={explore[1]} className="hover:text-white">Explore</a>
          <a href={features[1]} className="hover:text-white">Features</a>
          <Link to="/music-credits" viewTransition className="hover:text-white">Music credits</Link>
          {user === null && <Link to="/login" viewTransition className="hover:text-white">Sign in</Link>}
          {user && <Link to="/" viewTransition className="hover:text-white">Open player</Link>}
        </nav>
      </div>
    </footer>
  )
}
