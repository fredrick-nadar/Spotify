import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { MusicalNoteIcon } from '@heroicons/react/24/solid'
import { useAuth } from '../context/AuthContext'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(mode, v) {
  const e = {}
  if (mode === 'signup' && !v.name.trim()) e.name = 'Enter your name.'
  if (!EMAIL_RE.test(v.email.trim())) e.email = 'Enter a valid email address.'
  if (mode === 'signup') {
    if (v.password.length < 10) e.password = 'Use at least 10 characters.'
    if (v.confirm !== v.password) e.confirm = 'Passwords do not match.'
  } else if (!v.password) e.password = 'Enter your password.'
  return e
}

function Field({ id, label, error, ...input }) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="mb-1.5 block text-sm font-bold">{label}</label>
      <input id={id} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} {...input}
        className={`h-12 w-full rounded-md border bg-raised px-3 text-white placeholder:text-faint focus:border-white focus:outline-none ${error ? 'border-danger' : 'border-faint hover:border-white/70'}`} />
      {error && <p id={`${id}-error`} className="mt-1.5 text-sm text-danger">{error}</p>}
    </div>
  )
}

// Only follow same-origin absolute paths when returning after login.
const safePath = (p) => (typeof p === 'string' && /^\/(?![/\\])/.test(p) ? p : '/')

export default function AuthPage({ mode }) {
  const signup = mode === 'signup'
  const { user, login, signup: register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [values, setValues] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [busy, setBusy] = useState(false)

  const from = safePath(location.state?.from)
  if (user) return <Navigate to={from} replace />

  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setFormError('')
    const found = validate(mode, values)
    setErrors(found)
    if (Object.keys(found).length) return
    setBusy(true)
    try {
      if (signup) await register({ name: values.name.trim(), email: values.email.trim(), password: values.password })
      else await login({ email: values.email.trim(), password: values.password })
      navigate(from, { replace: true })
    } catch (err) {
      setErrors(err.fields ?? {})
      setFormError(err.fields && Object.keys(err.fields).length ? '' : err.message)
      setBusy(false)
    }
  }

  return (
    <main className="min-h-dvh bg-gradient-to-b from-emerald-950 to-black px-4 py-10">
      <div className="mx-auto w-full max-w-md rounded-xl bg-panel p-6 shadow-2xl sm:p-10">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-accent text-black"><MusicalNoteIcon className="h-7 w-7" /></span>
          <h1 className="text-3xl font-extrabold tracking-tight">{signup ? 'Sign up to start listening' : 'Log in to Spot'}</h1>
        </div>
        <form onSubmit={submit} noValidate>
          {formError && <p role="alert" className="mb-4 rounded-md bg-danger/15 px-3 py-2.5 text-sm text-danger">{formError}</p>}
          {signup && <Field id="name" label="Name" type="text" autoComplete="name" maxLength={60} value={values.name} onChange={set('name')} error={errors.name} />}
          <Field id="email" label="Email address" type="email" autoComplete="email" maxLength={254} placeholder="name@example.com" value={values.email} onChange={set('email')} error={errors.email} />
          <Field id="password" label="Password" type="password" autoComplete={signup ? 'new-password' : 'current-password'} maxLength={128} value={values.password} onChange={set('password')} error={errors.password} />
          {signup && <Field id="confirm" label="Confirm password" type="password" autoComplete="new-password" maxLength={128} value={values.confirm} onChange={set('confirm')} error={errors.confirm} />}
          <button type="submit" disabled={busy} className="mt-2 h-12 w-full rounded-full bg-accent font-bold text-black transition hover:scale-[1.02] hover:bg-accent-hover disabled:opacity-60 disabled:hover:scale-100">
            {busy ? (signup ? 'Creating account…' : 'Logging in…') : signup ? 'Sign up' : 'Log in'}
          </button>
        </form>
        <p className="mt-8 border-t border-line pt-6 text-center text-sm text-muted">
          {signup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <Link to={signup ? '/login' : '/signup'} state={location.state} className="font-bold text-white underline">{signup ? 'Log in here' : 'Sign up for Spot'}</Link>
        </p>
      </div>
    </main>
  )
}
