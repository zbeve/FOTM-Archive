import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.scss'
import Link from 'next/link'
import { getPlaylists } from '../lib/spotify'
import Playlist from '../components/Playlist'

export default function Home({ playlists }) {
  const nameFilter = ["fotm", "FOTM", "FotM", "foty", "FOTY", "Group", "group", "GROUP"]

  return (
    <div className={ styles.container }>
      { playlists.map((playlist, index) => (
        <>
          { nameFilter.some(el => playlist.name.includes(el)) ?
            <div className={ styles.playlistContainer } key={ playlist.id }>
              <Playlist data={ playlist } />
            </div>
            :
            // Nothing
            <></>
          }
        </>
      ))}
    </div>
  )
}

export async function getServerSideProps() {
  const MAX_PLAYLISTS = 100
  const limit = 10
  const offset = 10

  const playlists = []

  for(let i = 0; i < MAX_PLAYLISTS; i += offset ) {
      const response = await getPlaylists(limit, i)
      const { items } = await response.json()

      // playlists.push( items.map((playlist) => ({
      //     collaborative:  playlist.collaborative,
      //     url:            playlist.external_urls.spotify,
      //     image:
      //     {
      //         src:        playlist.images[0].url,
      //         width:      playlist.images[0].width,
      //         height:     playlist.images[0].height,
      //     },
      //     name:           playlist.name,
      //     tracks:
      //     {
      //         count:      playlist.tracks.total,
      //         src:        playlist.tracks.href,
      //     },
      // })))

      // items.forEach(playlist => console.log(playlist.images[0]))

      items.forEach(playlist => playlists.push({
          collaborative:  playlist.collaborative,
          url:            playlist.external_urls.spotify,
          image:
          {
              src:        playlist.images[0].url,
              width:      playlist.images[0].width,
              height:     playlist.images[0].height,
          },
          name:           playlist.name,
          tracks:
          {
              count:      playlist.tracks.total,
              src:        playlist.tracks.href,
          },
      }))
  }

  return {
    props: { playlists },
  }
};