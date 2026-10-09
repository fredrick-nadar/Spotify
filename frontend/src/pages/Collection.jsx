import { Navigate, useParams } from 'react-router-dom'
import { albums, tracksByAlbum, tracksByArtist, totalDuration } from '../lib/catalogue'
import { formatTotal, plural, slug } from '../lib/format'
import Cover from '../components/Cover'
import PageHeader from '../components/PageHeader'
import TrackList from '../components/TrackList'
import MediaCard from '../components/MediaCard'
import Shelf from '../components/Shelf'

// Serves /artist/:name and /album/:name.
export default function Collection({ kind }) {
  const { name } = useParams()
  const isArtist = kind === 'artist'
  const tracks = isArtist ? tracksByArtist(name) : tracksByAlbum(name)
  if (!tracks.length) return <Navigate to="/" replace />
  const artistAlbums = isArtist ? albums.filter((a) => a.artist === name) : []

  return (
    <>
      <PageHeader
        kind={isArtist ? 'Artist' : 'Album'} title={name} tracks={tracks}
        meta={`${isArtist ? '' : `${tracks[0].artist} · `}${plural(tracks.length, 'song')} · ${formatTotal(totalDuration(tracks))}`}
        cover={<Cover src={tracks[0].artworkUrl} seed={name} round={isArtist} className="h-full w-full" />}
      />
      <TrackList tracks={tracks} />
      {artistAlbums.length > 0 && (
        <div className="mt-10">
          <Shelf title="Albums">
            {artistAlbums.map((a) => <MediaCard key={a.name} to={`/album/${slug(a.name)}`} title={a.name} subtitle={a.artist} artworkUrl={a.artworkUrl} />)}
          </Shelf>
        </div>
      )}
    </>
  )
}
