import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const envFile = path.join(root, '.env')
if (existsSync(envFile)) process.loadEnvFile(envFile)

export function loadConfig(env = process.env) {
  const jwtSecret = env.JWT_SECRET ?? ''
  if (jwtSecret.length < 32) {
    throw new Error('JWT_SECRET must be set to at least 32 characters (see .env.example)')
  }
  return {
    port: Number(env.PORT) || 4000,
    jwtSecret,
    dbPath: env.DB_PATH ? path.resolve(env.DB_PATH) : path.join(root, 'data', 'spot.db'),
    allowedOrigins: (env.CLIENT_ORIGIN ?? 'http://localhost:5173').split(',').map((o) => o.trim()),
    cookieSecure: env.COOKIE_SECURE === 'true',
    sessionTtlSeconds: Number(env.SESSION_TTL_SECONDS) || 7 * 24 * 60 * 60,
    authRateLimit: Number(env.AUTH_RATE_LIMIT) || 10,
  }
}
