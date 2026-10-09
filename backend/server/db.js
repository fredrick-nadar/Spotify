import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'

// Ordered migrations; PRAGMA user_version records how many have been applied.
const migrations = [
  `CREATE TABLE users (
     id            INTEGER PRIMARY KEY AUTOINCREMENT,
     name          TEXT NOT NULL,
     email         TEXT NOT NULL UNIQUE,
     password_hash TEXT NOT NULL,
     created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
   );
   CREATE TABLE sessions (
     id         TEXT PRIMARY KEY,
     user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     expires_at INTEGER NOT NULL,
     created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
   );
   CREATE INDEX sessions_user_id ON sessions(user_id);`,
]

export function openDatabase(dbPath) {
  if (dbPath !== ':memory:') mkdirSync(path.dirname(dbPath), { recursive: true })
  const db = new DatabaseSync(dbPath)
  db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;')

  const { user_version: applied } = db.prepare('PRAGMA user_version').get()
  for (let v = applied; v < migrations.length; v++) {
    db.exec('BEGIN')
    try {
      db.exec(migrations[v])
      db.exec(`PRAGMA user_version = ${v + 1}`)
      db.exec('COMMIT')
    } catch (err) {
      db.exec('ROLLBACK')
      throw err
    }
  }
  return db
}
