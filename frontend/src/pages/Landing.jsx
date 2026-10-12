import { Link } from 'react-router-dom'
import { HeartIcon, MagnifyingGlassIcon, QueueListIcon } from '@heroicons/react/24/outline'
import { PauseIcon, PlayIcon } from '@heroicons/react/24/solid'
import { useAuth } from '../context/AuthContext'
import { PlayerProvider, usePlayer } from '../context/PlayerContext'
import { getTrack } from '../lib/catalogue'
import Cover from '../components/Cover'
import Equalizer from '../components/Equalizer'
import MiniPlayer from '../components/landing/MiniPlayer'
import Reveal from '../components/landing/Reveal'
import { LandingFooter, LandingNav } from '../components/landing/LandingChrome'

// Tracks with real cover art, so the page leads with proper artwork.
const FEATURED_IDS = [
  'alan-walker-fade', 'cartoon-on-and-on', 'deaf-kev-invincible',
  'janji-heroes-tonight', 'elektronomia-sky-high', 'thefatrat-unity',
]
const featured = FEATURED_IDS.map(getTrack).filter(Boolean)

const btn = 'inline-flex h-12 items-center justify-center rounded-full px-7 text-[15px] font-bold transition duration-200 active:scale-[.97]'

// Plays or pauses a featured track through the shared player.
function usePreview() {
  const { currentTrack, isPlaying, playTracks, togglePlay } = usePlayer()
  return {
    isCurrent: (t) => currentTrack?.id === t.id,
    isPlaying: (t) => currentTrack?.id === t.id && isPlaying,
    toggle: (t) => (currentTrack?.id === t.id ? togglePlay() : playTracks(featured, featured.indexOf(t))),
  }
}

function FloatCover({ track, className, rotate, delay, drift, size }) {
  const preview = usePreview()
  const playing = preview.isPlaying(track)
  return (
    <div className={`absolute ${className}`} style={{ transform: `rotate(${rotate}deg)` }}>
      <div className="rise" style={{ '--d': `${delay}s` }}>
        <div className="drift" style={{ '--t': `${drift}s`, '--dd': `${-drift / 2}s` }}>
          <button
            type="button" onClick={() => preview.toggle(track)} aria-label={`${playing ? 'Pause' : 'Play'} ${track.title} by ${track.artist}`}
            className={`group relative block overflow-hidden rounded-2xl shadow-2xl shadow-black/70 ring-1 transition duration-300 hover:scale-[1.04] active:scale-100 ${size} ${playing ? 'ring-2 ring-accent' : 'ring-white/15'}`}
          >
            <Cover src={track.artworkUrl} seed={track.album} className="h-full w-full !rounded-none" />
            <span className={`absolute inset-0 grid place-items-center bg-black/40 transition-opacity duration-200 ${playing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'}`}>
              <span className="grid h-12 w-12 place-items-center rounded-full bg-accent text-black">{playing ? <PauseIcon className="h-6 w-6" /> : <PlayIcon className="h-6 w-6" />}</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

function Hero() {
  const { user } = useAuth()
  const preview = usePreview()
  const [a, b, c] = featured
  const playing = a && preview.isPlaying(a)
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="absolute -top-40 right-[-10%] -z-10 h-[40rem] w-[40rem] rounded-full bg-accent/15 blur-[120px]" />
      <div aria-hidden="true" className="absolute -bottom-40 left-[-10%] -z-10 h-[32rem] w-[32rem] rounded-full bg-violet-600/15 blur-[120px]" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-20 pt-12 sm:px-8 lg:min-h-[44rem] lg:grid-cols-[1.05fr_1fr] lg:gap-6 lg:pb-28 lg:pt-16">
        <div>
          <p className="rise mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/80" style={{ '--d': '0.05s' }}>
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Free, open-licensed music
          </p>
          <h1 id="hero-title" className="rise text-[2.75rem] font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl" style={{ '--d': '0.12s' }}>
            Find your next <span className="bg-gradient-to-r from-accent to-emerald-200 bg-clip-text text-transparent">favourite sound.</span>
          </h1>
          <p className="rise mt-6 max-w-lg text-lg leading-relaxed text-white/70" style={{ '--d': '0.22s' }}>
            Stream a growing library of Creative Commons music, build playlists, and save the songs you keep coming back to.
          </p>
          <div className="rise mt-9 flex flex-col gap-3 sm:flex-row" style={{ '--d': '0.32s' }}>
            <Link to={user ? '/' : '/signup'} viewTransition className={`${btn} bg-accent text-black hover:scale-105 hover:bg-accent-hover`}>Start Listening</Link>
            <a href="#discover" className={`${btn} border border-white/25 text-white hover:border-white hover:bg-white/10`}>Explore Music</a>
          </div>
        </div>

        {a && b && c && (
          <div className="relative mx-auto aspect-square w-full max-w-[26rem] sm:max-w-[32rem]">
            <FloatCover track={b} className="right-0 top-0 z-10" size="h-[9.5rem] w-[9.5rem] sm:h-52 sm:w-52" rotate={7} delay={0.3} drift={10} />
            <FloatCover track={c} className="left-0 top-[34%] z-10" size="h-32 w-32 sm:h-44 sm:w-44" rotate={-8} delay={0.42} drift={12} />
            <FloatCover track={a} className="left-[18%] top-[4%] z-20" size="h-48 w-48 sm:h-72 sm:w-72" rotate={-3} delay={0.2} drift={9} />
            <div className="rise absolute inset-x-[6%] bottom-[2%] z-30" style={{ '--d': '0.55s' }}>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-neutral-900/70 p-3 shadow-2xl shadow-black/60 backdrop-blur-xl">
                <Cover src={a.artworkUrl} seed={a.album} className="h-12 w-12 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-white/60">{playing ? <><Equalizer className="h-3 w-3.5" /> Now playing</> : 'Ready to play'}</p>
                  <p className="truncate text-sm font-bold">{a.title}</p>
                  <p className="truncate text-xs text-white/60">{a.artist}</p>
                </div>
                <button type="button" aria-label={`${playing ? 'Pause' : 'Play'} ${a.title}`} onClick={() => preview.toggle(a)} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-black transition hover:scale-105 active:scale-95">
                  {playing ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function Discover() {
  const preview = usePreview()
  return (
    <section id="discover" aria-labelledby="discover-title" className="scroll-mt-20 border-t border-white/5 bg-neutral-950">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <Reveal className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="discover-title" className="text-3xl font-extrabold tracking-tight sm:text-5xl">Start with these</h2>
            <p className="mt-3 max-w-md text-white/70">A few tracks from the catalogue. Press play, no account needed.</p>
          </div>
          <Link to="/browse" viewTransition className="text-sm font-bold text-white/80 underline-offset-4 hover:text-white hover:underline">Browse the full catalogue →</Link>
        </Reveal>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
          {featured.map((t, i) => {
            const playing = preview.isPlaying(t)
            return (
              <Reveal as="li" key={t.id} delay={i * 0.06}>
                <button type="button" onClick={() => preview.toggle(t)} aria-label={`${playing ? 'Pause' : 'Play'} ${t.title} by ${t.artist}`} className="group block w-full text-left">
                  <span className={`relative mb-3 block overflow-hidden rounded-xl shadow-xl shadow-black/50 ring-1 transition duration-300 group-hover:-translate-y-1 group-active:translate-y-0 ${playing ? 'ring-2 ring-accent' : 'ring-white/10'}`}>
                    <Cover src={t.artworkUrl} seed={t.album} className="w-full !rounded-none" />
                    <span className={`absolute inset-0 grid place-items-center bg-black/45 transition-opacity duration-200 ${playing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'}`}>
                      <span className="grid h-12 w-12 place-items-center rounded-full bg-accent text-black">{playing ? <PauseIcon className="h-6 w-6" /> : <PlayIcon className="h-6 w-6" />}</span>
                    </span>
                  </span>
                  <span className={`flex items-center gap-1.5 truncate font-bold ${playing ? 'text-accent' : ''}`}>{playing && <Equalizer className="h-3.5 w-4 shrink-0" />}<span className="truncate">{t.title}</span></span>
                  <span className="block truncate text-sm text-white/60">{t.artist}</span>
                  <span className="mt-1 block text-xs uppercase tracking-wider text-white/40">{t.genre}</span>
                </button>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

const FEATURES = [
  { icon: MagnifyingGlassIcon, title: 'Discover', text: 'Search by song, artist, album or genre, or browse the catalogue by mood.' },
  { icon: QueueListIcon, title: 'Playlists', text: 'Create playlists, add and remove songs, and play them in order or shuffled.' },
  { icon: HeartIcon, title: 'Liked songs', text: 'Heart a track to save it. Your library is kept per account in this browser.' },
]

function Features() {
  return (
    <section id="features" aria-labelledby="features-title" className="scroll-mt-20 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <Reveal><h2 id="features-title" className="max-w-xl text-3xl font-extrabold tracking-tight sm:text-5xl">Everything you need to just listen</h2></Reveal>
        <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3">
          {FEATURES.map((f, i) => {
            const Icon = f.icon
            return (
              <Reveal as="li" key={f.title} delay={i * 0.1} className="bg-black p-7 sm:p-9">
                <Icon className="mb-6 h-7 w-7 text-accent" />
                <h3 className="mb-2 text-xl font-bold">{f.title}</h3>
                <p className="text-white/70">{f.text}</p>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

function FinalCta() {
  const { user } = useAuth()
  return (
    <section aria-labelledby="cta-title" className="relative isolate overflow-hidden border-t border-white/5">
      <div aria-hidden="true" className="absolute left-1/2 top-1/2 -z-10 h-[28rem] w-[44rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/15 blur-[120px]" />
      <Reveal className="mx-auto max-w-3xl px-5 py-24 text-center sm:px-8 lg:py-32">
        <h2 id="cta-title" className="text-4xl font-extrabold tracking-tight sm:text-6xl">Ready when you are.</h2>
        <p className="mx-auto mt-5 max-w-md text-lg text-white/70">{user ? 'Your library is waiting.' : 'Create a free account and press play.'}</p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to={user ? '/' : '/signup'} viewTransition className={`${btn} bg-accent text-black hover:scale-105 hover:bg-accent-hover`}>{user ? 'Open player' : 'Create free account'}</Link>
          {user === null && <Link to="/login" viewTransition className={`${btn} border border-white/25 hover:border-white hover:bg-white/10`}>Sign in</Link>}
        </div>
      </Reveal>
    </section>
  )
}

function Page() {
  const { currentTrack } = usePlayer()
  return (
    <div className="min-h-dvh bg-black text-white">
      <a href="#hero-title" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-black">Skip to content</a>
      <LandingNav />
      <main>
        <Hero />
        <Discover />
        <Features />
        <FinalCta />
      </main>
      <div className={currentTrack ? 'pb-24' : ''}><LandingFooter /></div>
      <MiniPlayer />
    </div>
  )
}

// The landing page has its own player instance (the in-app player lives behind sign-in),
// so previews work for visitors who are not logged in.
export default function Landing() {
  return <PlayerProvider><Page /></PlayerProvider>
}
