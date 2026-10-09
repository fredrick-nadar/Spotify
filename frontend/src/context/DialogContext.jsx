import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { CheckIcon, PlusIcon } from '@heroicons/react/24/solid'
import Modal from '../components/Modal'
import { useLibrary } from './LibraryContext'
import { useToast } from './ToastContext'

const DialogContext = createContext(null)

// Hosts the create-playlist, add-to-playlist and confirm dialogs for the whole shell.
export function DialogProvider({ children }) {
  const { addToPlaylist } = useLibrary()
  const [dialog, setDialog] = useState(null)
  const close = useCallback(() => setDialog(null), [])

  const value = useMemo(
    () => ({
      createPlaylist: (onCreated) => setDialog({ type: 'create', onCreated }),
      addToPlaylist: (track) => setDialog({ type: 'add', track }),
      confirm: (opts) => setDialog({ type: 'confirm', ...opts }),
    }),
    [],
  )

  return (
    <DialogContext.Provider value={value}>
      {children}
      <Modal open={dialog?.type === 'create'} onClose={close} title="Create playlist">
        {dialog?.type === 'create' && <CreateForm onDone={(id) => { dialog.onCreated?.(id); close() }} />}
      </Modal>
      <Modal open={dialog?.type === 'add'} onClose={close} title="Add to playlist">
        {dialog?.type === 'add' && <AddList track={dialog.track} onNew={() => setDialog({ type: 'create', onCreated: (id) => addToPlaylist(id, dialog.track.id) })} />}
      </Modal>
      <Modal open={dialog?.type === 'confirm'} onClose={close} title={dialog?.title ?? ''}>
        {dialog?.type === 'confirm' && (
          <>
            <p className="mb-6 text-sm text-muted">{dialog.message}</p>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={close} className="rounded-full px-5 py-2 text-sm font-bold text-muted hover:text-white">Cancel</button>
              <button type="button" autoFocus onClick={() => { dialog.onConfirm(); close() }} className="rounded-full bg-danger px-5 py-2 text-sm font-bold text-black hover:scale-105">
                {dialog.confirmLabel ?? 'Delete'}
              </button>
            </div>
          </>
        )}
      </Modal>
    </DialogContext.Provider>
  )
}

function CreateForm({ onDone }) {
  const { createPlaylist, playlists } = useLibrary()
  const { notify } = useToast()
  const [name, setName] = useState(`My playlist #${playlists.length + 1}`)
  const submit = (e) => {
    e.preventDefault()
    const id = createPlaylist(name)
    if (!id) return
    notify(`Created “${name.trim()}”`)
    onDone(id)
  }
  return (
    <form onSubmit={submit}>
      <label htmlFor="playlist-name" className="mb-1 block text-sm font-medium text-muted">Name</label>
      <input
        id="playlist-name" autoFocus required maxLength={60} value={name} onFocus={(e) => e.target.select()}
        onChange={(e) => setName(e.target.value)}
        className="mb-6 w-full rounded-md border border-line bg-hover px-3 py-2.5 text-white placeholder:text-faint focus:border-white focus:outline-none"
      />
      <div className="flex justify-end">
        <button type="submit" disabled={!name.trim()} className="rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-black hover:scale-105 disabled:opacity-50 disabled:hover:scale-100">Create</button>
      </div>
    </form>
  )
}

function AddList({ track, onNew }) {
  const { playlists, addToPlaylist, removeFromPlaylist } = useLibrary()
  const { notify } = useToast()
  return (
    <>
      <p className="mb-3 truncate text-sm text-muted">{track.title} · {track.artist}</p>
      <button type="button" onClick={onNew} className="mb-2 flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium hover:bg-hover">
        <PlusIcon className="h-5 w-5 text-accent" /> New playlist
      </button>
      {playlists.length === 0 ? (
        <p className="px-3 py-2 text-sm text-faint">You have no playlists yet.</p>
      ) : (
        <ul className="max-h-64 overflow-y-auto">
          {playlists.map((p) => {
            const inList = p.trackIds.includes(track.id)
            return (
              <li key={p.id}>
                <button
                  type="button" role="checkbox" aria-checked={inList}
                  onClick={() => {
                    if (inList) removeFromPlaylist(p.id, track.id)
                    else addToPlaylist(p.id, track.id)
                    notify(inList ? `Removed from ${p.name}` : `Added to ${p.name}`)
                  }}
                  className="flex w-full items-center justify-between gap-3 rounded-md px-3 py-2.5 text-left text-sm hover:bg-hover"
                >
                  <span className="truncate">{p.name}</span>
                  {inList && <CheckIcon className="h-5 w-5 shrink-0 text-accent" />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useDialogs = () => useContext(DialogContext)
