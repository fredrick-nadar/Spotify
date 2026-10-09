import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Shell from './components/Shell'
import AuthPage from './pages/AuthPage'
import Browse from './pages/Browse'
import Collection from './pages/Collection'
import Credits from './pages/Credits'
import Home from './pages/Home'
import Landing from './pages/Landing'
import Library from './pages/Library'
import Liked from './pages/Liked'
import NotFound from './pages/NotFound'
import Playlist from './pages/Playlist'
import PublicCredits from './pages/PublicCredits'
import Search from './pages/Search'

function Protected() {
  const { user } = useAuth()
  const location = useLocation()
  const atRoot = location.pathname === '/'
  // Visitors see the landing page at "/" (it also covers the brief session check).
  if (user === undefined) {
    return atRoot ? <Landing /> : <div role="status" className="grid min-h-dvh place-items-center text-muted">Loading…</div>
  }
  if (!user && atRoot) return <Landing />
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  return <Shell />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/signup" element={<AuthPage mode="signup" />} />
      <Route path="/welcome" element={<Landing />} />
      <Route path="/music-credits" element={<PublicCredits />} />
      <Route element={<Protected />}>
        <Route index element={<Home />} />
        <Route path="search" element={<Search />} />
        <Route path="browse" element={<Browse />} />
        <Route path="genre/:genre" element={<Browse />} />
        <Route path="library" element={<Library />} />
        <Route path="liked" element={<Liked />} />
        <Route path="playlist/:id" element={<Playlist />} />
        <Route path="artist/:name" element={<Collection kind="artist" />} />
        <Route path="album/:name" element={<Collection kind="album" />} />
        <Route path="credits" element={<Credits />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
