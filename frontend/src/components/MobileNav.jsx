import { NavLink } from 'react-router-dom'
import { HeartIcon, HomeIcon, MagnifyingGlassIcon, RectangleStackIcon } from '@heroicons/react/24/solid'

const item = ({ isActive }) => `flex min-h-12 flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium ${isActive ? 'text-white' : 'text-muted'}`

export default function MobileNav() {
  return (
    <nav aria-label="Main" className="flex shrink-0 border-t border-line bg-black pb-[env(safe-area-inset-bottom)] md:hidden">
      <NavLink to="/" end className={item}><HomeIcon className="h-6 w-6" />Home</NavLink>
      <NavLink to="/search" className={item}><MagnifyingGlassIcon className="h-6 w-6" />Search</NavLink>
      <NavLink to="/library" className={item}><RectangleStackIcon className="h-6 w-6" />Library</NavLink>
      <NavLink to="/liked" className={item}><HeartIcon className="h-6 w-6" />Liked</NavLink>
    </nav>
  )
}
