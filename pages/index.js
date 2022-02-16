import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.scss'
import Link from 'next/link'
import { getPlaylists, getPlaylistData } from '../lib/spotify'
import Playlist from '../components/Playlist'

export default function Home({ playlistsData }) {
  // const nameFilter = ["fotm", "FOTM", "FotM", "foty", "FOTY", "Group", "group", "GROUP"]

  return (
    <div className={ styles.container }>
      { playlistsData.map((playlist, index) => (
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

      // items.forEach(playlist => console.log(playlist))
      // console.log(items[10])

      const filtered = items.filter(playlist => nameFilter(playlist.name))
      // console.log(test)

      filtered.forEach(playlist => playlists.push({
          id:             playlist.id,
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

  const playlistsData = []

  for(const playlist of playlists) {
    const response = await getPlaylistData(playlist.id)
    const item = await response.json()

    playlistsData.push({
      id:             playlist.id,
      collaborative:  playlist.collaborative,
      url:            playlist.url,
      image:          playlist.image,
      name:           playlist.name,
      followers:      item.followers.total,
      tracks:         item.tracks
    })
  }

  // playlists.forEach(playlist => {
  //   const response = await getFollowers(playlist.id)
  //   const items = await response.json()

  //   console.log(items)
  // })

  // console.log(playlists[2])

  // console.log(itemsToo)
  // itemsToo.forEach(stat => console.log(stat))

  return {
    props: { playlistsData },
    revalidate: 600,
  }
}

function nameFilter(playlistName) {
  const nameFilter = ["fotm", "FOTM", "FotM", "foty", "FOTY", "Group", "group", "GROUP"]
  return nameFilter.some(el => playlistName.includes(el))
}