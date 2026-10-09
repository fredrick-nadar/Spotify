import { useEffect, useRef, useState } from 'react'

// Fades/slides content in once it scrolls into view. Content is shown immediately when
// IntersectionObserver is unavailable.
export default function Reveal({ as = 'div', delay = 0, className = '', children, ...rest }) {
  const Tag = as
  const ref = useRef(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) { setShown(true); return }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setShown(true); io.disconnect() }
    }, { rootMargin: '0px 0px -8% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return <Tag ref={ref} style={{ '--d': `${delay}s` }} className={`reveal ${shown ? 'in' : ''} ${className}`} {...rest}>{children}</Tag>
}
