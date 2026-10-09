import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState'

export default function NotFound() {
  return (
    <EmptyState title="Page not found">
      That page doesn&rsquo;t exist. <Link to="/" className="font-bold text-white underline">Go home</Link>.
    </EmptyState>
  )
}
