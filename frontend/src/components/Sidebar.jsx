import { NavLink, Link, useNavigate } from 'react-router-dom'
import { HeartIcon, HomeIcon, MusicalNoteIcon, MagnifyingGlassIcon, PlusIcon, RectangleStackIcon, Squares2X2Icon } from '@heroicons/react/24/solid'
import { useLibrary } from '../context/LibraryContext'
import { useDialogs } from '../context/DialogContext'
import { plural } from '../lib/format'
import PlaylistCover from './PlaylistCover'
import { tracks } from '../lib/catalogue'

const link = ({ isActive }) => `flex items-center gap-4 rounded-md px-3 py-2.5 text-[15px] font-bold transition ${isActive ? 'text-white' : 'text-muted hover:text-white'}`

export default function Sidebar() {
  const { playlists, liked } = useLibrary()
  const dialogs = useDialogs()
  const nav = useNavigate()
  return (
    <aside className="hidden w-72 shrink-0 flex-col gap-2 md:flex lg:w-80">
      <nav aria-label="Main" className="rounded-lg bg-panel p-2">
        <Link to="/" className="mb-2 flex items-center gap-2 px-3 py-3 text-xl font-extrabold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-black"><MusicalNoteIcon className="h-5 w-5" /></span> Spot
        </Link>
        <NavLink to="/" end className={link}><HomeIcon className="h-6 w-6" /> Home</NavLink>
        <NavLink to="/search" className={link}><MagnifyingGlassIcon className="h-6 w-6" /> Search</NavLink>
        <NavLink to="/browse" className={link}><Squares2X2Icon className="h-6 w-6" /> Browse songs</NavLink>
      </nav>

      <nav aria-label="Your library" className="flex min-h-0 flex-1 flex-col rounded-lg bg-panel p-2">
        <div className="flex items-center justify-between px-3 py-2">
          <NavLink to="/library" end className={link}><RectangleStackIcon className="h-6 w-6" /> Your Library</NavLink>
          <button type="button" aria-label="Create playlist" onClick={() => dialogs.createPlaylist((id) => nav(`/playlist/${id}`))} className="rounded-full p-2 text-muted hover:bg-hover hover:text-white">
            <PlusIcon className="h-5 w-5" />
          </button>
        </div>
        <ul className="scroll-panel min-h-0 flex-1 overflow-y-auto">
          <li>
            <NavLink to="/liked" className={({ isActive }) => `flex items-center gap-3 rounded-md p-2 hover:bg-hover ${isActive ? 'bg-hover' : ''}`}>
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded bg-gradient-to-br from-indigo-500 to-emerald-300"><HeartIcon className="h-6 w-6 text-white" /></span>
              <span className="min-w-0"><span className="block truncate font-medium">Liked Songs</span><span className="block text-sm text-muted">Playlist · {plural(liked.length, 'song')}</span></span>
            </NavLink>
          </li>
          {playlists.map((p) => (
            <li key={p.id}>
              <NavLink to={`/playlist/${p.id}`} className={({ isActive }) => `flex items-center gap-3 rounded-md p-2 hover:bg-hover ${isActive ? 'bg-hover' : ''}`}>
                <PlaylistCover ids={p.trackIds} className="h-12 w-12 shrink-0" />
                <span className="min-w-0"><span className="block truncate font-medium">{p.name}</span><span className="block text-sm text-muted">Playlist · {plural(p.trackIds.length, 'song')}</span></span>
              </NavLink>
            </li>
          ))}
        </ul>
        {playlists.length === 0 && (
          <div className="m-1 rounded-lg bg-raised p-4">
            <p className="font-bold">Create your first playlist</p>
            <p className="mb-3 mt-1 text-sm text-muted">It&rsquo;s easy, we&rsquo;ll help you.</p>
            <button type="button" onClick={() => dialogs.createPlaylist((id) => nav(`/playlist/${id}`))} className="rounded-full bg-white px-4 py-1.5 text-sm font-bold text-black hover:scale-105">Create playlist</button>
          </div>
        )}
        <p className="px-3 pt-2 text-xs text-faint">
          {plural(tracks.length, 'track')} · <Link to="/credits" className="hover:text-white hover:underline">Music credits</Link>
        </p>
      </nav>
    </aside>
  )
}
