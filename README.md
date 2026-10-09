# Spot – Spotify-style web player

React 19 + Vite + Tailwind 4 frontend (`frontend/`) and a small Express + SQLite auth API (`backend/`).
Music is streamed from the Internet Archive under Creative Commons licences (see `/credits` in the app).

## Run

```bash
# 1. backend (Node >= 22.13; uses built-in node:sqlite)
cd backend && npm install
cp .env.example .env     # then set JWT_SECRET (>= 32 random chars)
npm start                # http://localhost:4000

# 2. frontend
cd frontend && npm install
npm run dev              # http://localhost:5173 (proxies /api to the backend)
```

Tests/checks: `cd backend && npm test`, `cd frontend && npm run lint && npm run build`.

## Notes

- Accounts live in `backend/data/spot.db` (gitignored). Playlists, liked songs and recently played are stored
  per user in the browser's localStorage and do not sync across devices.
- Auth: scrypt password hashes, HS256 JWT in an HttpOnly `SameSite=Strict` cookie, server-side session rows
  (logout revokes), Origin check on state-changing requests, rate-limited auth routes.
- Catalogue: `frontend/src/data/catalogue.js`. Many tracks are CC BY-NC(-SA): non-commercial use only.
