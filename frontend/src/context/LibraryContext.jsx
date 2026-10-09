import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { getTrack } from '../lib/catalogue'
import { readJSON, writeJSON } from '../lib/storage'
import { useToast } from './ToastContext'

const LibraryContext = createContext(null)

const MAX_RECENT = 20
const MAX_PLAYLISTS = 50
const MAX_NAME = 60
const storageKey = (userId) => `spot:library:v1:${userId}`

const validIds = (list) => [...new Set(Array.isArray(list) ? list.filter((id) => typeof id === 'string' && getTrack(id)) : [])]

// Stored data is untrusted: rebuild a clean shape and drop anything unexpected.
function load(userId) {
  const raw = readJSON(storageKey(userId))
  const playlists = Array.isArray(raw?.playlists) ? raw.playlists : []
  return {
    liked: validIds(raw?.liked),
    recent: validIds(raw?.recent).slice(0, MAX_RECENT),
    playlists: playlists
      .filter((p) => p && typeof p.id === 'string' && typeof p.name === 'string' && p.name.trim())
      .slice(0, MAX_PLAYLISTS)
      .map((p) => ({ id: p.id, name: p.name.trim().slice(0, MAX_NAME), trackIds: validIds(p.trackIds) })),
  }
}

// Keyed by user id in the shell, so each account starts from its own stored library.
export function LibraryProvider({ userId, children }) {
  const { notify } = useToast()
  const [state, setState] = useState(() => load(userId))
  const warned = useRef(false)

  useEffect(() => {
    if (!writeJSON(storageKey(userId), state) && !warned.current) {
      warned.current = true
      notify('Browser storage is unavailable, so changes will not be saved.', 'error')
    }
  }, [state, userId, notify])

  const toggleLike = useCallback((id) => {
    setState((s) => ({
      ...s,
      liked: s.liked.includes(id) ? s.liked.filter((x) => x !== id) : [id, ...s.liked],
    }))
  }, [])

  const createPlaylist = useCallback((name) => {
    const clean = name.trim().slice(0, MAX_NAME)
    if (!clean) return null
    const id = crypto.randomUUID()
    setState((s) => (s.playlists.length >= MAX_PLAYLISTS ? s : { ...s, playlists: [...s.playlists, { id, name: clean, trackIds: [] }] }))
    return id
  }, [])

  const deletePlaylist = useCallback((id) => {
    setState((s) => ({ ...s, playlists: s.playlists.filter((p) => p.id !== id) }))
  }, [])

  const updatePlaylist = useCallback((id, fn) => {
    setState((s) => ({ ...s, playlists: s.playlists.map((p) => (p.id === id ? { ...p, trackIds: fn(p.trackIds) } : p)) }))
  }, [])

  const addToPlaylist = useCallback((id, trackId) => updatePlaylist(id, (ids) => (ids.includes(trackId) ? ids : [...ids, trackId])), [updatePlaylist])
  const removeFromPlaylist = useCallback((id, trackId) => updatePlaylist(id, (ids) => ids.filter((x) => x !== trackId)), [updatePlaylist])

  const addRecent = useCallback((id) => {
    setState((s) => (s.recent[0] === id ? s : { ...s, recent: [id, ...s.recent.filter((x) => x !== id)].slice(0, MAX_RECENT) }))
  }, [])

  const value = useMemo(
    () => ({
      ...state,
      likedSet: new Set(state.liked),
      toggleLike,
      createPlaylist,
      deletePlaylist,
      addToPlaylist,
      removeFromPlaylist,
      addRecent,
    }),
    [state, toggleLike, createPlaylist, deletePlaylist, addToPlaylist, removeFromPlaylist, addRecent],
  )
  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLibrary = () => useContext(LibraryContext)
