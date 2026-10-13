import { randomUUID } from 'node:crypto'
import express from 'express'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import { hashPassword, verifyPassword } from './passwords.js'
import { COOKIE_NAME, createSessions } from './session.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DUMMY_HASH_PROMISE = hashPassword('timing-equalisation-placeholder')

function readCookie(req, name) {
  for (const part of (req.headers.cookie ?? '').split(';')) {
    const i = part.indexOf('=')
    if (i > 0 && part.slice(0, i).trim() === name) return decodeURIComponent(part.slice(i + 1).trim())
  }
  return null
}

const publicUser = ({ id, name, email }) => ({ id, name, email })

function validateSignup(body) {
  const name = typeof body?.name === 'string' ? body.name.trim() : ''
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
  const password = typeof body?.password === 'string' ? body.password : ''
  const errors = {}
  if (name.length < 1 || name.length > 60) errors.name = 'Enter a name up to 60 characters.'
  if (email.length > 254 || !EMAIL_RE.test(email)) errors.email = 'Enter a valid email address.'
  if (password.length < 10 || password.length > 128) {
    errors.password = 'Password must be 10 to 128 characters.'
  }
  return { name, email, password, errors }
}

export function createApp({ db, config }) {
  const app = express()
  const sessions = createSessions(db, config)
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: config.authRateLimit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: 'Too many attempts. Try again later.' },
  })

  const insertUser = db.prepare('INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)')
  const userByEmail = db.prepare('SELECT * FROM users WHERE email = ?')

  app.disable('x-powered-by')
  app.use(helmet())
  app.use(express.json({ limit: '10kb' }))

  // CSRF defence in depth (cookie is also SameSite=Strict): state-changing requests must come
  // from an allowed Origin, and any request body must be JSON (which cross-site forms cannot send).
  app.use('/api', (req, res, next) => {
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next()
    if (!config.allowedOrigins.includes(req.headers.origin)) {
      return res.status(403).json({ error: 'Forbidden origin.' })
    }
    if (req.is('*/*') && !req.is('application/json')) return res.status(415).json({ error: 'JSON required.' })
    next()
  })

  const requireAuth = async (req, res, next) => {
    const session = await sessions.resolve(readCookie(req, COOKIE_NAME))
    if (!session) return res.status(401).json({ error: 'Not authenticated.' })
    req.session = session
    next()
  }

  app.post('/api/auth/signup', authLimiter, async (req, res) => {
    const { name, email, password, errors } = validateSignup(req.body)
    if (Object.keys(errors).length) return res.status(400).json({ error: 'Invalid input.', fields: errors })
    const hash = await hashPassword(password)
    const id = randomUUID()
    try {
      insertUser.run(id, name, email, hash)
    } catch (err) {
      if (err?.errcode === 2067 || /UNIQUE/.test(err?.message ?? '')) {
        return res.status(409).json({ error: 'An account with that email already exists.' })
      }
      throw err
    }
    await sessions.start(res, id)
    res.status(201).json({ user: { id, name, email } })
  })

  app.post('/api/auth/login', authLimiter, async (req, res) => {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : ''
    const password = typeof req.body?.password === 'string' ? req.body.password : ''
    const invalid = () => res.status(401).json({ error: 'Incorrect email or password.' })
    if (!email || !password || password.length > 128) return invalid()
    const user = userByEmail.get(email)
    // Always run one scrypt verification so unknown emails take as long as wrong passwords.
    const ok = await verifyPassword(password, user ? user.password_hash : await DUMMY_HASH_PROMISE)
    if (!user || !ok) return invalid()
    await sessions.start(res, user.id)
    res.json({ user: publicUser(user) })
  })

  app.post('/api/auth/logout', async (req, res) => {
    const session = await sessions.resolve(readCookie(req, COOKIE_NAME))
    sessions.end(res, session?.jti)
    res.status(204).end()
  })

  app.get('/api/auth/me', requireAuth, (req, res) => {
    res.json({ user: publicUser(req.session.user) })
  })

  app.use('/api', (req, res) => res.status(404).json({ error: 'Not found.' }))

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Malformed JSON.' })
    if (err.type === 'entity.too.large') return res.status(413).json({ error: 'Request too large.' })
    console.error('Unhandled error:', err.name, err.message)
    res.status(500).json({ error: 'Something went wrong.' })
  })

  return app
}
