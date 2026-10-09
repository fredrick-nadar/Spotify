import { randomUUID } from 'node:crypto'
import { SignJWT, jwtVerify } from 'jose'

export const COOKIE_NAME = 'spot_session'
const ISSUER = 'spot-backend'
const AUDIENCE = 'spot-web'

export function createSessions(db, config) {
  const key = new TextEncoder().encode(config.jwtSecret)
  const insert = db.prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)')
  const find = db.prepare(
    `SELECT u.id, u.name, u.email FROM sessions s JOIN users u ON u.id = s.user_id
     WHERE s.id = ? AND s.expires_at > ?`,
  )
  const remove = db.prepare('DELETE FROM sessions WHERE id = ?')
  const purgeExpired = db.prepare('DELETE FROM sessions WHERE expires_at <= ?')

  const cookieOptions = {
    httpOnly: true,
    sameSite: 'strict',
    secure: config.cookieSecure,
    path: '/',
  }

  async function verify(token) {
    try {
      const { payload } = await jwtVerify(token, key, {
        issuer: ISSUER,
        audience: AUDIENCE,
        algorithms: ['HS256'],
      })
      return payload.jti && payload.sub ? payload : null
    } catch {
      return null
    }
  }

  return {
    async start(res, userId) {
      const now = Math.floor(Date.now() / 1000)
      const exp = now + config.sessionTtlSeconds
      const jti = randomUUID()
      purgeExpired.run(now)
      insert.run(jti, userId, exp)
      const token = await new SignJWT({})
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuer(ISSUER)
        .setAudience(AUDIENCE)
        .setSubject(String(userId))
        .setJti(jti)
        .setIssuedAt(now)
        .setExpirationTime(exp)
        .sign(key)
      res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: config.sessionTtlSeconds * 1000 })
    },

    async resolve(token) {
      if (!token) return null
      const payload = await verify(token)
      if (!payload) return null
      const user = find.get(payload.jti, Math.floor(Date.now() / 1000))
      return user && String(user.id) === payload.sub ? { user, jti: payload.jti } : null
    },

    end(res, jti) {
      if (jti) remove.run(jti)
      res.clearCookie(COOKIE_NAME, cookieOptions)
    },
  }
}
