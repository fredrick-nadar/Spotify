import clevertap from 'clevertap-web-sdk'

clevertap.spa = true

const accountId = import.meta.env.VITE_CLEVERTAP_ACCOUNT_ID

if (accountId) {
  clevertap.init(accountId)
} else {
  console.error(
    '[CleverTap] Initialization failed: Missing environment variables.',
    {
      accountIdPresent: Boolean(accountId),
    }
  )
}
// Attach the account to its CleverTap profile so later events are tied to this user.
export function identify(user) {
  clevertap.onUserLogin.push({ Site: { Identity: user.id, Name: user.name, Email: user.email } })
}

export function Signup(user) {
  identify(user)
  clevertap.event.push('Signed Up', { Method: 'Email' })
}

export function Login(user) {
  identify(user)
  clevertap.event.push('Logged In', { Method: 'Email' })
}

export function SongPlayed(track) {
  clevertap.event.push('Song Played', {
    'Track ID': track.id,
    'Track name': track.title,
    Artist: track.artist,
    Genre: track.genre,
  })
}

export function PlaylistCreated(playlist) {
  clevertap.event.push('Playlist Created', {
    'Playlist ID': playlist.id,
    'Playlist name': playlist.name,
    'Track count': playlist.trackIds.length,
  })
}

export default clevertap
