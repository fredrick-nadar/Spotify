import { useEffect, useRef } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

// Native <dialog> gives focus trapping, Escape-to-close and an inert background.
export default function Modal({ open, onClose, title, children }) {
  const ref = useRef(null)
  useEffect(() => {
    const dialog = ref.current
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby="modal-title"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className="m-auto w-[min(92vw,26rem)] rounded-xl border border-line bg-raised p-0 text-white shadow-2xl"
    >
      {open && (
        <div className="p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <h2 id="modal-title" className="text-xl font-bold">{title}</h2>
            <button type="button" aria-label="Close" onClick={onClose} className="rounded-full p-1 text-muted hover:text-white">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  )
}
