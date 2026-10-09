import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { DialogProvider } from '../context/DialogContext'
import { LibraryProvider } from '../context/LibraryContext'
import { PlayerProvider, usePlayer } from '../context/PlayerContext'
import { ToastProvider } from '../context/ToastContext'
import MobileNav from './MobileNav'
import Player from './Player'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

function Layout() {
  const { togglePlay } = usePlayer()
  const { pathname } = useLocation()

  useEffect(() => {
    const onKey = (e) => {
      const el = e.target
      const typing = el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A'].includes(el.tagName)
      if (e.code === 'Space' && !typing && !e.repeat) { e.preventDefault(); togglePlay() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [togglePlay])

  useEffect(() => { document.getElementById('main')?.scrollTo(0, 0) }, [pathname])

  return (
    <div className="flex h-dvh flex-col bg-black">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-black">Skip to content</a>
      <div className="flex min-h-0 flex-1 gap-2 p-2 pb-0">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-lg bg-panel">
          <TopBar />
          <main id="main" tabIndex={-1} className="scroll-panel min-h-0 flex-1 overflow-y-auto px-4 pb-8 pt-4 focus:outline-none sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
      <Player />
      <MobileNav />
    </div>
  )
}

// Providers are keyed by user id: switching accounts remounts them, so no library or
// playback state from the previous account survives.
export default function Shell() {
  const { user } = useAuth()
  return (
    <ToastProvider key={user.id}>
      <LibraryProvider userId={user.id}>
        <PlayerProvider>
          <DialogProvider>
            <Layout />
          </DialogProvider>
        </PlayerProvider>
      </LibraryProvider>
    </ToastProvider>
  )
}
