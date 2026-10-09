import { Navigate, useNavigate, useParams, Link } from 'react-router-dom'
import { TrashIcon } from '@heroicons/react/24/outline'
import { MusicalNoteIcon } from '@heroicons/react/24/outline'
import { useLibrary } from '../context/LibraryContext'
import { useDialogs } from '../context/DialogContext'
import { useToast } from '../context/ToastContext'
import { resolveTracks, totalDuration, tracks as catalogue } from '../lib/catalogue'
import { formatTotal, plural } from '../lib/format'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import PlaylistCover from '../components/PlaylistCover'
import TrackList from '../components/TrackList'

export default function Playlist() {
  const { id } = useParams()
  const { playlists, deletePlaylist, removeFromPlaylist, addToPlaylist } = useLibrary()
  const dialogs = useDialogs()
  const { notify } = useToast()
  const navigate = useNavigate()
  const playlist = playlists.find((p) => p.id === id)
  if (!playlist) return <Navigate to="/library" replace />

  const tracks = resolveTracks(playlist.trackIds)
  const suggestions = catalogue.filter((t) => !playlist.trackIds.includes(t.id)).slice(0, 5)

  const remove = () => dialogs.confirm({
    title: 'Delete playlist?',
    message: `“${playlist.name}” will be permanently removed from your library. Your songs stay in the catalogue.`,
    onConfirm: () => { deletePlaylist(playlist.id); notify(`Deleted “${playlist.name}”`); navigate('/library', { replace: true }) },
  })

  return (
    <>
      <PageHeader
        kind="Playlist" title={playlist.name} tracks={tracks}
        meta={`${plural(tracks.length, 'song')}${tracks.length ? ` · ${formatTotal(totalDuration(tracks))}` : ''}`}
        cover={<PlaylistCover ids={playlist.trackIds} className="h-full w-full shadow-2xl" />}
      >
        <button type="button" aria-label={`Delete playlist ${playlist.name}`} onClick={remove} className="rounded-full p-2 text-muted hover:text-danger"><TrashIcon className="h-7 w-7" /></button>
      </PageHeader>

      {tracks.length > 0 && <TrackList tracks={tracks} onRemove={(t) => { removeFromPlaylist(playlist.id, t.id); notify(`Removed ${t.title}`) }} />}
      {tracks.length === 0 && <EmptyState icon={MusicalNoteIcon} title="This playlist is empty">Add songs below, or use the + button on any song in <Link to="/browse" className="font-bold text-white underline">Browse</Link>.</EmptyState>}

      {suggestions.length > 0 && (
        <section aria-label="Add songs" className="mt-10">
          <h2 className="mb-3 text-xl font-bold">Add some songs</h2>
          <ul>
            {suggestions.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-3 rounded-md px-2 py-2 hover:bg-white/10">
                <span className="min-w-0"><span className="block truncate font-medium">{t.title}</span><span className="block truncate text-sm text-muted">{t.artist}</span></span>
                <button type="button" onClick={() => { addToPlaylist(playlist.id, t.id); notify(`Added ${t.title}`) }} aria-label={`Add ${t.title} to ${playlist.name}`} className="shrink-0 rounded-full border border-faint px-4 py-1.5 text-sm font-bold hover:scale-105 hover:border-white">Add</button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}
