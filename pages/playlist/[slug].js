import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import { getPlaylistData, getAllPlaylists, getAllSongData, spotifyFetch } from '../../lib/spotify'
import Image from 'next/image'
import { usePlaylistContext } from '../../components/PlaylistContext'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMusic, faPerson } from '@fortawesome/free-solid-svg-icons'

import styles from '../../styles/Slug.module.scss'
import StatsBar from '../../components/StatsBar'
import Link from 'next/link'

export default function Playlist({ playlist, songData, nextSlug, prevSlug }) {
  const router = useRouter()

  if (!router.isFallback && !playlist?.id) {
    return <ErrorPage statusCode={404} />
  }

  // const playlistList = usePlaylistContext()
  // let currentIndex = 0
  
  // playlistList.playlistList.find((el, index) => {
  //   if(el.id == playlist.id) {
  //     currentIndex = index
  //     return true
  //   }
  // })

  // console.log(playlistList.playlistList[currentIndex].id)

  return (
    <>
        {router.isFallback ? (
            <h1>...loading</h1>
        ) : (
            <div className={ styles.container }>
              {/* { console.log(playlist) }
              { console.log("-----------------") }
              { console.log(songs) }
              { console.log("-----------------") }
              { console.log(contributors )}
              { console.log("-----------------") }
              { console.log(averages )} */}

              <div className={ styles.navigation }>
                { prevSlug == undefined ?
                  <></>
                  :
                  <Link as={`/playlist/${prevSlug}`} href="/playlist/[slug]">
                    Prev
                  </Link>
                }
                { nextSlug == undefined ?
                  <></>
                  :
                  <Link as={`/playlist/${nextSlug}`} href="/playlist/[slug]">
                    Next
                  </Link>
                }
              </div>

              <div className={ styles.image }>
                <Image layout="responsive" src={ playlist.images[0].url } width="640" height="640" />
              </div>

              <div className={ styles.stats }>
                <h1 className={ styles.name }>{ playlist.name }</h1>
                <div className={ styles.counts }>
                  <div className={ styles.wrapper }>
                    <FontAwesomeIcon icon={ faMusic } />
                    <p className={ styles.song }>{ playlist.tracks.total }</p>
                  </div>
                  <div className={ styles.wrapper}>
                    <FontAwesomeIcon icon={ faPerson } />
                    <p className={ styles.followers }>{ playlist.followers.total }</p>
                  </div>
                </div>
                <div className={ styles.stats }>
                  { Object.keys(songData.averages).map((key, value) => (
                    <StatsBar key={ key.id } name={ key } value={ parseFloat(songData.averages[key]) }/>
                  ))}
                </div>
              </div>
            </div>
        )}
    </>
  )
}

export async function getStaticProps({ params }) {
    const response = await getPlaylistData(params.slug)
    const playlist = await response.json()

    let contributors = {}
    let songIDs = ''

    playlist.tracks.items

    // console.log(playlist.tracks)

    let tracks = []
    let next = playlist.tracks.next

    playlist.tracks.items.map((track) => {
      tracks.push(track)
    })

    while(next != null) {
      const fetch = await spotifyFetch(next)
      const data = await fetch.json()

      data.items.map((track) => {
        tracks.push(track)
      })

      next = data.next
    }

    const allSongData = await getAllSongData(tracks)
    const songData = await allSongData

    const responsePlaylists = await getAllPlaylists()
    const playlists = await responsePlaylists

    let prevSlug = ""
    let nextSlug = ""

    playlists.map((playlist, index) => {
      if(index > 0 && index < (playlists.length - 1) && playlist.id == params.slug) {
        prevSlug = playlists[index - 1].id
        nextSlug = playlists[index + 1].id
      }
      else if (index == 0 && playlist.id == params.slug) {
        prevSlug = playlists[playlists.length - 1].id
        nextSlug = playlists[index + 1].id
      }
      else if (index == (playlists.length - 1) && playlist.id == params.slug) {
        prevSlug = playlists[index - 1].id
        nextSlug = playlists[0].id
      }
    })

    return {
        props: {
          playlist,
          songData,
          prevSlug,
          nextSlug
        },
        revalidate: 600,
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