import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { readJSON, writeJSON } from '../lib/storage'
import { SongPlayed } from '../lib/clevertap'
import { useLibrary } from './LibraryContext'

const PlayerContext = createContext(null)
const VOLUME_KEY = 'spot:volume'

const shuffled = (list) => {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const EMPTY = { original: [], queue: [], index: -1, shuffle: false, repeat: 'off' }

export function PlayerProvider({ children }) {
  const addRecent = useLibrary()?.addRecent
  const [audio] = useState(() => new Audio())
  const [q, setQ] = useState(EMPTY)
  const qRef = useRef(EMPTY)
  const [status, setStatus] = useState('idle') // idle | loading | playing | paused | error
  const [buffering, setBuffering] = useState(false)
  const [volume, setVolumeState] = useState(() => {
    const v = readJSON(VOLUME_KEY)
    return typeof v === 'number' && v >= 0 && v <= 1 ? v : 0.8
  })
  const [muted, setMuted] = useState(false)
  const recentRef = useRef(addRecent)
  useEffect(() => { recentRef.current = addRecent }, [addRecent])

  const commit = useCallback((next) => {
    qRef.current = next
    setQ(next)
  }, [])

  const startTrack = useCallback((track) => {
    setStatus('loading')
    setBuffering(false)
    audio.src = track.audioUrl
    audio.play().catch((err) => {
      if (err.name === 'AbortError') return // superseded by a newer track
      setStatus(err.name === 'NotAllowedError' ? 'paused' : 'error')
    })
    recentRef.current?.(track.id)
    SongPlayed(track)
  }, [audio])

  const goTo = useCallback((index) => {
    const cur = qRef.current
    commit({ ...cur, index })
    startTrack(cur.queue[index])
  }, [commit, startTrack])

  const next = useCallback((auto = false) => {
    const { queue, index, repeat } = qRef.current
    if (!queue.length) return
    if (index + 1 < queue.length) return goTo(index + 1)
    if (repeat === 'all' || !auto) return goTo(0)
    audio.pause()
    audio.currentTime = 0
    setStatus('paused')
  }, [audio, goTo])

  const prev = useCallback(() => {
    const { queue, index } = qRef.current
    if (!queue.length) return
    if (audio.currentTime > 3 || index === 0) {
      audio.currentTime = 0
      return
    }
    goTo(index - 1)
  }, [audio, goTo])

  const playTracks = useCallback((list, startIndex = 0, { shuffle } = {}) => {
    if (!list.length) return
    const shuffleOn = shuffle ?? qRef.current.shuffle
    const first = list[startIndex]
    const queue = shuffleOn ? [first, ...shuffled(list.filter((_, i) => i !== startIndex))] : list
    commit({ ...qRef.current, original: list, queue, index: shuffleOn ? 0 : startIndex, shuffle: shuffleOn })
    startTrack(first)
  }, [commit, startTrack])

  const togglePlay = useCallback(() => {
    if (!audio.src || qRef.current.index < 0) return
    if (audio.paused) {
      if (qRef.current.index >= 0 && status === 'error') return startTrack(qRef.current.queue[qRef.current.index])
      audio.play().catch(() => setStatus('error'))
    } else {
      audio.pause()
    }
  }, [audio, status, startTrack])

  const toggleShuffle = useCallback(() => {
    const cur = qRef.current
    if (cur.index < 0) return commit({ ...cur, shuffle: !cur.shuffle })
    const current = cur.queue[cur.index]
    if (!cur.shuffle) {
      commit({ ...cur, shuffle: true, queue: [current, ...shuffled(cur.original.filter((t) => t.id !== current.id))], index: 0 })
    } else {
      commit({ ...cur, shuffle: false, queue: cur.original, index: cur.original.findIndex((t) => t.id === current.id) })
    }
  }, [commit])

  const cycleRepeat = useCallback(() => {
    const cur = qRef.current
    commit({ ...cur, repeat: { off: 'all', all: 'one', one: 'off' }[cur.repeat] })
  }, [commit])

  const seek = useCallback((t) => { if (audio.src) audio.currentTime = t }, [audio])
  const setVolume = useCallback((v) => {
    setVolumeState(v)
    setMuted(false)
    writeJSON(VOLUME_KEY, v)
  }, [])
  const toggleMute = useCallback(() => setMuted((m) => !m), [])

  useEffect(() => { audio.volume = volume; audio.muted = muted }, [audio, volume, muted])
  useEffect(() => { audio.loop = q.repeat === 'one' }, [audio, q.repeat])

  useEffect(() => {
    const on = {
      playing: () => { setStatus('playing'); setBuffering(false) },
      pause: () => setStatus((s) => (s === 'playing' ? 'paused' : s)),
      waiting: () => setBuffering(true),
      canplay: () => setBuffering(false),
      ended: () => next(true),
      error: () => { if (audio.src) { setStatus('error'); setBuffering(false) } },
    }
    for (const [e, fn] of Object.entries(on)) audio.addEventListener(e, fn)
    return () => {
      for (const [e, fn] of Object.entries(on)) audio.removeEventListener(e, fn)
      audio.pause()
      audio.removeAttribute('src')
      audio.load()
    }
  }, [audio, next])

  const currentTrack = q.index >= 0 ? q.queue[q.index] : null

  const value = useMemo(
    () => ({
      audio, currentTrack, status, buffering, volume, muted,
      shuffle: q.shuffle, repeat: q.repeat, queue: q.queue,
      isPlaying: status === 'playing' || status === 'loading',
      playTracks, togglePlay, next: () => next(false), prev, seek, setVolume, toggleMute, toggleShuffle, cycleRepeat,
    }),
    [audio, currentTrack, status, buffering, volume, muted, q.shuffle, q.repeat, q.queue, playTracks, togglePlay, next, prev, seek, setVolume, toggleMute, toggleShuffle, cycleRepeat],
  )
  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePlayer = () => useContext(PlayerContext)
