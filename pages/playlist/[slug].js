import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import { getPlaylistData, getAllPlaylists } from '../../lib/spotify'

export default function Playlist({ playlist }) {
  const router = useRouter()

  if (!router.isFallback && !playlist?.id) {
    return <ErrorPage statusCode={404} />
  }
  
  return (
    <>
        {router.isFallback ? (
            <h1>...loading</h1>
        ) : (
            <div>
                <p>{ playlist.name }</p>
            </div>
        )}
    </>
  )
}

export async function getStaticProps({ params }) {

    const response = await getPlaylistData(params.slug)
    const playlist = await response.json()

    return {
        props: { playlist },
    }
}

export async function getStaticPaths() {
  const response = await getAllPlaylists()
  const playlists = await response

  return {
    paths: playlists.map((playlist) => {
      return {
        params: {
          slug: playlist.id,
        },
      }
    }),
    fallback: false,
  }
}