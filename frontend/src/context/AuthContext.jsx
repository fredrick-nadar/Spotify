import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'
import { Signup, Login } from '../lib/clevertap'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // undefined = still checking the session cookie, null = signed out
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    let cancelled = false
    api('/auth/me')
      .then((data) => !cancelled && setUser(data.user))
      .catch(() => !cancelled && setUser(null))
    return () => { cancelled = true }
  }, [])

  const login = useCallback(async (credentials) => {
  const { user } = await api('/auth/login', {
    method: 'POST',
    body: credentials,
  })

  setUser(user)
  Login(user)
  console.log('CleverTap: User logged in and tracked:', user)
}, [])

  const signup = useCallback(async (details) => {
    const { user: created } = await api('/auth/signup', { method: 'POST', body: details })
    Signup(created)
    console.log('CleverTap: User signed up and tracked:', created)
    setUser(created)
  }, [])

  const logout = useCallback(async () => {
    try {
      await api('/auth/logout', { method: 'POST', body: {} })
    } finally {
      console.log('CleverTap: User logged out')
      setUser(null)
    }
  }, [])

  const value = useMemo(() => ({ user, login, signup, logout }), [user, login, signup, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
