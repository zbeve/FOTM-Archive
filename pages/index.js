import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.scss'
import Link from 'next/link'
import { getAllPlaylists, getPlaylists } from '../lib/spotify'
import Playlist from '../components/Playlist'

// import { usePlaylistContext } from '../components/PlaylistContext'

export default function Home({ playlists }) {
  // const playlistList = usePlaylistContext()
  // playlistList.setPlaylistList(playlists)

  return (
    <div className={ styles.container }>
      { playlists.map((playlist, index) => (
          <div className={ styles.playlistContainer } key={ playlist.id }>
            <Playlist playlist={ playlist } />
          </div>
        // <>
        //   { nameFilter.some(el => playlist.name.includes(el)) ?
        //     <div className={ styles.playlistContainer } key={ playlist.id }>
        //       <Playlist playlist={ playlist } />
        //     </div>
        //     :
        //     // Nothing
        //     <></>
        //   }
        // </>
      ))}
    </div>
  )
}

export async function getStaticProps() {
  const response = await getAllPlaylists()
  const playlists = await response

  return {
    props: { playlists },
    revalidate: 600,
  }
}

