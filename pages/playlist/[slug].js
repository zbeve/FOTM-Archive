import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import { getPlaylistData, getAllPlaylists, getAllSongData, spotifyFetch } from '../../lib/spotify'
import Image from 'next/image'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMusic, faPerson, faHouse, faChevronRight, faChevronLeft, faHourglass, faVolumeHigh, faStar } from '@fortawesome/free-solid-svg-icons'

import styles from '../../styles/Slug.module.scss'
import StatsBar from '../../components/StatsBar'
import Link from 'next/link'

export default function Playlist({ playlist, songData, nextSlug, prevSlug }) {
  const router = useRouter()

  const explanations = [
    {
      name: "Introduction",
      description: "The statistics above are calculated using Spotify's web API. How these numbers are exactly calculated is unknown (to me, at least), but the following descriptions are translated from their documentation. These are decided on a track by track basis. To calculate metrics for an entire playlist, these are processed for every track within a given playlist and averaged (this may lead to most playlists having similar metrics, and those with less tracks being more skewed). Obviously this introduces a bit of bias, but nonetheless fun insight into playlist 'feeling'. I suppose gates could be implemented to show larger variation in the data over the given set, but oh well. Enjoy",
    },
    {
      name: "Danceability",
      description: "Danceability describes how suitable a playlist is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. A value of 0 is least danceable and 100 is most danceable.",
    },
    {
      name: "Energy",
      description: "Energy is a measure from 0 to 100 and represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale. Perceptual features contributing to this attribute include dynamic range, perceived loudness, timbre, onset rate, and general entropy.",
    },
    {
      name: "Valence",
      description: "A measure from 0 to 100 describing the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry).",
    },
    {
      name: "Acousticness",
      description: "A confidence measure from 0 to 100 of whether the playlist's tracks are acoustic. 100% represents high confidence the playlist is acoustic.",
    },
    {
      name: "Instrumentalness",
      description: "Predicts whether a track contains no vocals. 'Ooh' and 'aah' sounds are treated as instrumental in this context. Rap or spoken word tracks are clearly 'vocal'. The closer the instrumentalness value is to 100, the greater likelihood the track contains no vocal content. Values above 50 are intended to represent instrumental tracks, but confidence is higher as the value approaches 100.",
    },
    {
      name: "Liveness",
      description: "Detects the presence of an audience in the recording. Higher liveness values represent an increased probability that the track was performed live. A value above 80 provides strong likelihood that the track is live.",
    },
    {
      name: "Speechiness",
      description: "Speechiness detects the presence of spoken words in a track. The more exclusively speech-like the recording (e.g. talk show, audio book, poetry), the closer to 100 the attribute value. Values above 66 describe tracks that are probably made entirely of spoken words. Values between 33 and 66 describe tracks that may contain both music and speech, either in sections or layered, including such cases as rap music. Values below 33 most likely represent music and other non-speech-like tracks.",
    },
    {
      name: "Tempo",
      description: "(represented by the hourglass icon) The overall estimated tempo of a track in beats per minute (BPM). In musical terminology, tempo is the speed or pace of a given piece and derives directly from the average beat duration.",
    },
    {
      name: "Loudness",
      description: "(represented by the volume icon) The overall loudness of a track in decibels (dB). Loudness values are averaged across the entire track and are useful for comparing relative loudness of tracks. Loudness is the quality of a sound that is the primary psychological correlate of physical strength (amplitude). Values typically range between -60 and 0 db.",
    },
    {
      name: "Top Contributor",
      description: "(represented by the star icon) The user who contributed the most songs to the playlist.",
    },
  ]

  if (!router.isFallback && !playlist?.id) {
    return <ErrorPage statusCode={404} />
  }

  return (
    <>
        {router.isFallback ? (
            <h1>...loading</h1>
        ) : (
          <>
            <div className={ styles.navigation }>
              <div className={ styles.navButton }>
                { prevSlug == undefined ?
                  <></>
                  :
                  <Link as={`/playlist/${prevSlug}`} href="/playlist/[slug]">
                    <FontAwesomeIcon icon={ faChevronLeft } />
                  </Link>
                }
              </div>
              <div className={ styles.navButton }>
                <Link as="/" href="/">
                  <FontAwesomeIcon icon={ faHouse } />
                </Link>
              </div>
              <div className={ styles.navButton }>
                { nextSlug == undefined ?
                  <></>
                  :
                  <Link as={`/playlist/${nextSlug}`} href="/playlist/[slug]">
                    <FontAwesomeIcon icon={ faChevronRight } />
                  </Link>
                }
              </div>
            </div>

            <div className={ styles.container }>
              <div className={ styles.image }>
                <Image layout="responsive" src={ playlist.images[0].url } width="640" height="640" />
              </div>

              <div className={ styles.stats }>
                <h1 className={ styles.name }>{ playlist.name }</h1>
                <p className={ styles.description }>{ playlist.description }</p>
                <div className={ styles.button }>
                  <Link href={ playlist.external_urls.spotify }>
                      <a target="_blank" >Open In Spotify</a>
                  </Link>
                </div>
                <div className={ styles.counts }>
                  <div className={ styles.wrapper}>
                    <FontAwesomeIcon icon={ faPerson } />
                    <p className={ styles.text }>{ playlist.followers.total }</p>
                  </div>
                  <div className={ styles.wrapper }>
                    <FontAwesomeIcon icon={ faMusic } />
                    <p className={ styles.text }>{ playlist.tracks.total }</p>
                  </div>
                  <div className={ styles.wrapper}>
                    <FontAwesomeIcon icon={ faHourglass } />
                    <p className={ styles.text }>{ songData.tempo } bpm</p>
                  </div>
                  <div className={ styles.wrapper}>
                    <FontAwesomeIcon icon={ faVolumeHigh } />
                    <p className={ styles.text }>{ songData.loudness } db</p>
                  </div>
                  <div className={ styles.wrapper}>
                    <FontAwesomeIcon icon={ faStar } />
                    <p className={ styles.text }>{ songData.topContributor.display_name }</p>
                  </div>
                </div>
                <div className={ styles.stats }>
                  { Object.keys(songData.averages).map((key, value) => (
                    <StatsBar key={ key.id } name={ key } value={ parseFloat(songData.averages[key]) }/>
                  ))}
                </div>
                <div className={ styles.statsExplained }>
                  { explanations.map(explanation => (
                    <div key={ explanation.id } className={ styles.explanation }>
                      <hr></hr>
                      <h2 className={ styles.name }>{ explanation.name }</h2>
                      <p className={ styles.description }>{ explanation.description }</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
    </>
  )
}

export async function getStaticProps({ params }) {
    const response = await getPlaylistData(params.slug)
    const playlist = await response.json()

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

    await new Promise(r => setTimeout(r, 1000));

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