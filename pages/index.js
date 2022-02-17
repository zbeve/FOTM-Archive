import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.scss'
import Link from 'next/link'
import { getAllPlaylists, getPlaylists } from '../lib/spotify'
import Playlist from '../components/Playlist'

export default function Home({ playlists }) {
  // const nameFilter = ["fotm", "FOTM", "FotM", "foty", "FOTY", "Group", "group", "GROUP"]

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

