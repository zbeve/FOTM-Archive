import styles from '../styles/Home.module.scss'
import { getAllPlaylists } from '../lib/spotify'
import Playlist from '../components/Playlist'

export default function Home({ playlists }) {
  return (
    <div className={ styles.container }>
      { playlists.map((playlist, index) => (
          <div className={ styles.playlistContainer } key={ playlist.id }>
            <Playlist playlist={ playlist } />
          </div>
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

