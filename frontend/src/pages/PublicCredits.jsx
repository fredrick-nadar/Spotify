import { LandingFooter, LandingNav } from '../components/landing/LandingChrome'
import Credits from './Credits'

export default function PublicCredits() {
  return (
    <div className="min-h-dvh bg-black text-white">
      <LandingNav />
      <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8"><Credits /></main>
      <LandingFooter />
    </div>
  )
}
