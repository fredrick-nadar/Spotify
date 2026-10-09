export default function EmptyState({ icon: Icon, title, children }) {
  return (
    <div className="flex flex-col items-center px-4 py-16 text-center">
      {Icon && <Icon className="mb-4 h-12 w-12 text-faint" />}
      <h2 className="mb-2 text-xl font-bold">{title}</h2>
      <div className="max-w-sm text-sm text-muted">{children}</div>
    </div>
  )
}
