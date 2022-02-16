import Image from 'next/image'
import styles from '../styles/Playlist.module.scss'

function Playlist({ data }) {
    // console.log(data)
  return (
    <a href={ data.url } target="_blank">
        <div className={ styles.container }>
            <div className={ styles.image }>
                <Image layout="responsive" src={ data.image.src } width="640" height="640" />
            </div>
            <div className={ styles.info }>
                <h2 className={ styles.name }>{ data.name }</h2>
                <div className={ styles.count }>
                    <p className={ styles.songCount }>
                        { data.tracks.count }
                    </p>
                </div>
            </div>
        </div>
    </a>
  )
}

export default Playlist