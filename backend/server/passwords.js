import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

// scrypt (OWASP-recommended parameters: N=2^17 is preferred, N=2^15 r=8 p=1 is the accepted minimum
// profile for interactive logins) from node:crypto — no third-party dependency.
const scryptAsync = promisify(scrypt)
const N = 2 ** 15
const R = 8
const P = 1
const KEYLEN = 64
const OPTIONS = { N, r: R, p: P, maxmem: 128 * N * R * 2 }

export async function hashPassword(password) {
  const salt = randomBytes(16)
  const key = await scryptAsync(password, salt, KEYLEN, OPTIONS)
  return `scrypt$${N}$${R}$${P}$${salt.toString('base64')}$${key.toString('base64')}`
}

export async function verifyPassword(password, stored) {
  const [scheme, n, r, p, salt, hash] = stored.split('$')
  if (scheme !== 'scrypt' || !hash) return false
  const expected = Buffer.from(hash, 'base64')
  const key = await scryptAsync(password, Buffer.from(salt, 'base64'), expected.length, {
    N: Number(n),
    r: Number(r),
    p: Number(p),
    maxmem: 128 * Number(n) * Number(r) * 2,
  })
  return timingSafeEqual(key, expected)
}
