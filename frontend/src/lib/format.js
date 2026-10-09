export function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const total = Math.floor(seconds)
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`
}

export function formatTotal(seconds) {
  const mins = Math.round(seconds / 60)
  if (mins < 60) return `${mins} min`
  return `${Math.floor(mins / 60)} hr ${mins % 60} min`
}

export const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`

export const slug = (s) => encodeURIComponent(s)
