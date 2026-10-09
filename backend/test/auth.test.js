import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { SignJWT } from 'jose'
import { loadConfig } from '../server/config.js'
import { openDatabase } from '../server/db.js'
import { createApp } from '../server/app.js'

const ORIGIN = 'http://localhost:5173'
const SECRET = 'x'.repeat(40)
let dir, dbPath, db, server, base

const config = () => loadConfig({ JWT_SECRET: SECRET, DB_PATH: dbPath, AUTH_RATE_LIMIT: '1000' })

function start(cfg = config()) {
  db = openDatabase(cfg.dbPath)
  return new Promise((resolve) => {
    server = createApp({ db, config: cfg }).listen(0, '127.0.0.1', () => {
      base = `http://127.0.0.1:${server.address().port}`
      resolve()
    })
  })
}
const stop = () => new Promise((resolve) => server.close(() => { db.close(); resolve() }))

async function call(method, url, { body, cookie, origin = ORIGIN, raw } = {}) {
  const headers = {}
  if (body !== undefined || raw) headers['content-type'] = 'application/json'
  if (origin) headers.origin = origin
  if (cookie) headers.cookie = cookie
  const res = await fetch(base + url, { method, headers, body: raw ?? (body && JSON.stringify(body)) })
  const text = await res.text()
  const setCookie = res.headers.get('set-cookie')
  return { status: res.status, json: text ? JSON.parse(text) : null, cookie: setCookie?.split(';')[0], setCookie }
}

const alice = { name: 'Alice', email: 'Alice@Example.com', password: 'correct horse battery' }
const bob = { name: 'Bob', email: 'bob@example.com', password: 'another long password' }

before(async () => {
  dir = mkdtempSync(path.join(tmpdir(), 'spot-test-'))
  dbPath = path.join(dir, 'test.db')
  await start()
})
after(async () => {
  await stop()
  rmSync(dir, { recursive: true, force: true })
})

test('signup creates a user with a hashed password and an HttpOnly strict cookie', async () => {
  const res = await call('POST', '/api/auth/signup', { body: alice })
  assert.equal(res.status, 201)
  assert.deepEqual(Object.keys(res.json.user).sort(), ['email', 'id', 'name'])
  assert.equal(res.json.user.email, 'alice@example.com')
  assert.match(res.setCookie, /HttpOnly/i)
  assert.match(res.setCookie, /SameSite=Strict/i)
  const row = db.prepare('SELECT password_hash FROM users WHERE email = ?').get('alice@example.com')
  assert.match(row.password_hash, /^scrypt\$/)
  assert.ok(!row.password_hash.includes(alice.password))
})

test('duplicate email is rejected (case-insensitive) by the database constraint', async () => {
  const res = await call('POST', '/api/auth/signup', { body: { ...alice, email: 'ALICE@example.com' } })
  assert.equal(res.status, 409)
})

test('login succeeds, wrong password and unknown email get the same generic 401', async () => {
  const ok = await call('POST', '/api/auth/login', { body: { email: alice.email, password: alice.password } })
  assert.equal(ok.status, 200)
  const wrong = await call('POST', '/api/auth/login', { body: { email: alice.email, password: 'nope nope nope' } })
  const unknown = await call('POST', '/api/auth/login', { body: { email: 'ghost@example.com', password: 'nope nope nope' } })
  assert.equal(wrong.status, 401)
  assert.deepEqual(wrong.json, unknown.json)
  assert.equal(unknown.status, 401)
})

test('/me requires auth and returns only the signed-in user; users are independent', async () => {
  assert.equal((await call('GET', '/api/auth/me')).status, 401)
  const a = await call('POST', '/api/auth/login', { body: { email: alice.email, password: alice.password } })
  const b = await call('POST', '/api/auth/signup', { body: bob })
  const meA = await call('GET', '/api/auth/me', { cookie: a.cookie })
  const meB = await call('GET', '/api/auth/me', { cookie: b.cookie })
  assert.equal(meA.json.user.email, 'alice@example.com')
  assert.equal(meB.json.user.email, 'bob@example.com')
  assert.notEqual(meA.json.user.id, meB.json.user.id)
  assert.ok(!JSON.stringify(meA.json).includes('hash'))
})

test('logout revokes the session server-side, even for a replayed cookie', async () => {
  const login = await call('POST', '/api/auth/login', { body: { email: alice.email, password: alice.password } })
  assert.equal((await call('GET', '/api/auth/me', { cookie: login.cookie })).status, 200)
  const out = await call('POST', '/api/auth/logout', { cookie: login.cookie })
  assert.equal(out.status, 204)
  assert.equal((await call('GET', '/api/auth/me', { cookie: login.cookie })).status, 401)
})

test('tampered, malformed, wrong-secret and expired tokens are rejected', async () => {
  const login = await call('POST', '/api/auth/login', { body: { email: alice.email, password: alice.password } })
  const token = login.cookie.split('=')[1]
  const tampered = `spot_session=${token.slice(0, -3)}abc`
  assert.equal((await call('GET', '/api/auth/me', { cookie: tampered })).status, 401)
  assert.equal((await call('GET', '/api/auth/me', { cookie: 'spot_session=garbage' })).status, 401)

  const user = db.prepare('SELECT id FROM users WHERE email = ?').get('alice@example.com')
  const forge = (secret, exp) =>
    new SignJWT({}).setProtectedHeader({ alg: 'HS256' }).setIssuer('spot-backend').setAudience('spot-web')
      .setSubject(String(user.id)).setJti('forged').setIssuedAt(exp - 100).setExpirationTime(exp)
      .sign(new TextEncoder().encode(secret))
  const future = Math.floor(Date.now() / 1000) + 600
  assert.equal((await call('GET', '/api/auth/me', { cookie: `spot_session=${await forge('y'.repeat(40), future)}` })).status, 401)
  assert.equal((await call('GET', '/api/auth/me', { cookie: `spot_session=${await forge(SECRET, future)}` })).status, 401, 'valid signature but no session row')
  assert.equal((await call('GET', '/api/auth/me', { cookie: `spot_session=${await forge(SECRET, Math.floor(Date.now() / 1000) - 10)}` })).status, 401, 'expired')
})

test('session row past its expiry is rejected even with a valid JWT', async () => {
  const login = await call('POST', '/api/auth/login', { body: { email: bob.email, password: bob.password } })
  db.prepare('UPDATE sessions SET expires_at = 1').run()
  assert.equal((await call('GET', '/api/auth/me', { cookie: login.cookie })).status, 401)
})

test('invalid and malformed input is handled safely', async () => {
  const bad = await call('POST', '/api/auth/signup', { body: { name: '', email: 'nope', password: 'short' } })
  assert.equal(bad.status, 400)
  assert.deepEqual(Object.keys(bad.json.fields).sort(), ['email', 'name', 'password'])
  assert.equal((await call('POST', '/api/auth/signup', { body: { name: { $ne: 1 }, email: ['a'], password: 5 } })).status, 400)
  assert.equal((await call('POST', '/api/auth/login', { body: { email: { a: 1 }, password: [] } })).status, 401)
  assert.equal((await call('POST', '/api/auth/login', { raw: '{bad json' })).status, 400)
  assert.equal((await call('POST', '/api/auth/signup', { body: { name: 'x', email: 'a@b.co', password: 'p'.repeat(20000) } })).status, 413)
  const sqli = await call('POST', '/api/auth/login', { body: { email: "' OR 1=1 --", password: 'whatever long' } })
  assert.equal(sqli.status, 401)
  assert.equal((await call('GET', '/api/nope')).status, 404)
})

test('CSRF: state-changing requests need an allowed Origin and JSON content', async () => {
  const body = { email: alice.email, password: alice.password }
  assert.equal((await call('POST', '/api/auth/login', { body, origin: 'https://evil.example' })).status, 403)
  assert.equal((await call('POST', '/api/auth/login', { body, origin: null })).status, 403)
  const res = await fetch(`${base}/api/auth/login`, {
    method: 'POST', headers: { origin: ORIGIN, 'content-type': 'text/plain' }, body: JSON.stringify(body),
  })
  assert.equal(res.status, 415)
})

test('responses carry security headers and no stack traces', async () => {
  const res = await fetch(`${base}/api/auth/me`)
  assert.equal(res.headers.get('x-content-type-options'), 'nosniff')
  assert.equal(res.headers.get('x-powered-by'), null)
})

test('accounts survive a backend restart', async () => {
  await stop()
  await start()
  const login = await call('POST', '/api/auth/login', { body: { email: bob.email, password: bob.password } })
  assert.equal(login.status, 200)
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM users').get().n, 2)
})

test('auth endpoints are rate limited', async () => {
  await stop()
  await start({ ...config(), authRateLimit: 3 })
  const attempt = () => call('POST', '/api/auth/login', { body: { email: 'x@example.com', password: 'wrong password' } })
  const statuses = []
  for (let i = 0; i < 5; i++) statuses.push((await attempt()).status)
  assert.deepEqual(statuses, [401, 401, 401, 429, 429])
})

test('server refuses to start with a weak or missing secret', () => {
  assert.throws(() => loadConfig({ JWT_SECRET: 'short' }), /JWT_SECRET/)
  assert.throws(() => loadConfig({}), /JWT_SECRET/)
})
