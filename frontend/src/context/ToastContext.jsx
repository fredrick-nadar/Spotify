import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)
  const timer = useRef(null)

  const notify = useCallback((message, tone = 'info') => {
    clearTimeout(timer.current)
    setToast({ message, tone })
    timer.current = setTimeout(() => setToast(null), 3500)
  }, [])

  const value = useMemo(() => ({ notify }), [notify])
  return (
    <ToastContext.Provider value={value}>
      {children}
      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-36 z-[70] flex justify-center px-4 md:bottom-28">
        {toast && (
          <div className={`rounded-md px-4 py-2.5 text-sm font-medium shadow-lg ${toast.tone === 'error' ? 'bg-danger text-black' : 'bg-white text-black'}`}>
            {toast.message}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => useContext(ToastContext)
