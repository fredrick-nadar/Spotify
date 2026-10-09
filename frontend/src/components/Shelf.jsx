import { Link } from 'react-router-dom'

export default function Shelf({ title, to, children }) {
  return (
    <section className="mb-10" aria-label={title}>
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {to && <Link to={to} className="text-sm font-bold text-muted hover:text-white hover:underline">Show all</Link>}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 2xl:grid-cols-6">{children}</div>
    </section>
  )
}
