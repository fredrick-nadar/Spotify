import { useNavigate } from 'react-router-dom'
import { HeartIcon, PlusIcon } from '@heroicons/react/24/solid'
import { Link } from 'react-router-dom'
import { useLibrary } from '../context/LibraryContext'
import { useDialogs } from '../context/DialogContext'
import { plural } from '../lib/format'
import PlaylistCover from '../components/PlaylistCover'

export default function Library() {
  const { playlists, liked } = useLibrary()
  const dialogs = useDialogs()
  const navigate = useNavigate()
  const create = () => dialogs.createPlaylist((id) => navigate(`/playlist/${id}`))
  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold tracking-tight">Your Library</h1>
        <button type="button" onClick={create} className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-black hover:scale-105"><PlusIcon className="h-4 w-4" /> Create playlist</button>
      </div>
      <p className="mb-6 text-sm text-faint">Your library is saved in this browser for your account. It doesn&rsquo;t sync across devices.</p>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 2xl:grid-cols-6">
        <li>
          <Link to="/liked" className="block rounded-lg bg-raised/60 p-3 transition hover:bg-hover sm:p-4">
            <span className="mb-3 grid aspect-square place-items-center rounded-md bg-gradient-to-br from-indigo-500 to-emerald-300"><HeartIcon className="h-1/3 w-1/3 text-white" /></span>
            <span className="block truncate font-bold">Liked Songs</span>
            <span className="text-sm text-muted">Playlist · {plural(liked.length, 'song')}</span>
          </Link>
        </li>
        {playlists.map((p) => (
          <li key={p.id}>
            <Link to={`/playlist/${p.id}`} className="block rounded-lg bg-raised/60 p-3 transition hover:bg-hover sm:p-4">
              <PlaylistCover ids={p.trackIds} className="mb-3 aspect-square w-full" />
              <span className="block truncate font-bold">{p.name}</span>
              <span className="text-sm text-muted">Playlist · {plural(p.trackIds.length, 'song')}</span>
            </Link>
          </li>
        ))}
      </ul>
      {playlists.length === 0 && <p className="mt-8 text-center text-sm text-muted">No playlists yet. Create one to start collecting songs.</p>}
    </>
  )
}
