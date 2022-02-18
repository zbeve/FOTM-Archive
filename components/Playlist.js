import Image from 'next/image'
import Link from 'next/link'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMusic, faPerson } from '@fortawesome/free-solid-svg-icons'

import styles from '../styles/Playlist.module.scss'

function Playlist({ playlist }) {
  return (
    <div className={ styles.container }>
        <div className={ styles.image }>
            <Image layout="responsive" src={ playlist.image.src } width="640" height="640" />
        </div>
        <div className={ styles.info }>
            <h2 className={ styles.name }>{ playlist.name }</h2>

            <div className={ styles.buttons }>
                <Link as={`/playlist/${playlist.id}`} href="/playlist/[slug]">
                    <button className={ styles.button }>Stats</button>
                </Link>
                <Link href={ playlist.url }>
                    <a target="_blank" className={ styles.button }>Open In Spotify</a>
                    {/* <button target="_blank" className={ styles.button }>Open In Spotify</button> */}
                </Link>
            </div>
        </div>
        <div className={ styles.count }>
            <FontAwesomeIcon className={ styles.icon } icon={ faMusic } />
            <p className={ styles.songCount }>    
                { playlist.tracks.count }
            </p>
        </div>
    </div>
  )
}

export default Playlist