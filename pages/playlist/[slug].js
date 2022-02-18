import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import { getPlaylistData, getAllPlaylists, getSongData } from '../../lib/spotify'
import Image from 'next/image'
import { usePlaylistContext } from '../../components/PlaylistContext'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMusic, faPerson } from '@fortawesome/free-solid-svg-icons'

import styles from '../../styles/Slug.module.scss'
import StatsBar from '../../components/StatsBar'
import Link from 'next/link'

export default function Playlist({ playlist, songs, contributors, averages, nextSlug, prevSlug }) {
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
                  { Object.keys(averages).map((key, value) => (
                    <StatsBar key={ key.id } name={ key } value ={ averages[key] }/>
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

    for(const track of playlist.tracks.items) {
      contributors[track.added_by.id] = (contributors[track.added_by.id] || 0) + 1

      if(songIDs == '') {
        songIDs = songIDs.concat(track.track.id)
      }
      else {
        songIDs = songIDs.concat(",", track.track.id)
      }
    }

    const responseSong = await getSongData(songIDs)
    const songs = await responseSong.json()

    let averages = {
      danceability: 0,
      energy: 0,
      valence: 0,
      acousticness: 0,
      instrumentalness: 0,
      liveness: 0,
      speechiness: 0,
    }

    let loudness = 0
    let tempo = 0

    for(const song of songs.audio_features) {
      if(song == null) continue

      averages["acousticness"] += song.acousticness
      averages["danceability"] += song.danceability
      averages["energy"] += song.energy
      averages["instrumentalness"] += song.instrumentalness
      averages["liveness"] += song.liveness
      averages["speechiness"] += song.speechiness
      averages["valence"] += song.valence

      loudness += song.loudness
      tempo += song.tempo
    }

    for(const key in averages) {
      averages[key] = (averages[key] / songs.audio_features.length).toFixed(3)
    }

    loudness = (loudness / songs.audio_features.length).toFixed(3)
    tempo = (tempo / songs.audio_features.length).toFixed(3)

    averages["acousticness"] *= 100
    averages["danceability"] *= 100
    averages["energy"] *= 100
    averages["instrumentalness"] *= 100
    averages["liveness"] *= 100
    averages["speechiness"] *= 100
    averages["valence"] *= 100

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
        props: { playlist, songs, contributors, averages, prevSlug, nextSlug },
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