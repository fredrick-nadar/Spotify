import { tracks } from '../lib/catalogue'

export default function Credits() {
  return (
    <>
      <h1 className="mb-2 text-3xl font-extrabold tracking-tight">Music credits</h1>
      <p className="mb-6 max-w-2xl text-sm text-muted">
        Every track is streamed under NoCopyrightSounds (NCS) or Creative Commons / copyright-free creator licences shown below.
        Music is free for non-commercial listening and creator usage with attribution. Artwork is provided by respective release archives.
      </p>
      <ul className="divide-y divide-line">
        {tracks.map((t) => (
          <li key={t.id} className="py-3 text-sm">
            <p className="font-medium">{t.title} <span className="text-muted">· {t.artist} · {t.album}</span></p>
            <p className="text-muted">
              <a href={t.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">{t.license}</a>
              {' · '}
              <a href={t.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">Source</a>
            </p>
          </li>
        ))}
      </ul>
    </>
  )
}
