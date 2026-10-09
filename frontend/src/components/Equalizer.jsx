export default function Equalizer({ className = 'h-4' }) {
  return (
    <span aria-hidden="true" className={`flex items-end gap-[2px] ${className}`}>
      {[0, 0.3, 0.15].map((delay) => <span key={delay} className="eq-bar w-[3px] flex-1 bg-accent" style={{ height: '100%', animationDelay: `${delay}s` }} />)}
    </span>
  )
}
