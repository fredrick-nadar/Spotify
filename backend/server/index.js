import { loadConfig } from './config.js'
import { openDatabase } from './db.js'
import { createApp } from './app.js'

const config = loadConfig()
const db = openDatabase(config.dbPath)
const server = createApp({ db, config }).listen(config.port, 'localhost', () => {
  console.log(`Spot API listening on http://localhost:${config.port}`)
})

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close(() => { db.close(); process.exit(0) }))
}
