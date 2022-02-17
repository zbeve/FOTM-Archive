import Image from 'next/image'
import { getFollowers } from '../lib/spotify'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'

import styles from '../styles/Playlist.module.scss'

function Playlist({ playlist }) {
    // const [data, setData] = useState(null)

    // const fetchData = useCallback(async () => {
    //     const response = await getFollowers(playlist.id)
    //     const { items } = await response.json()
    //     setData(items)
    // }, [])

    // useEffect(() => {
    //     fetchData()
    // }, [fetchData])

    // console.log(playlist)
  return (
    <Link as={`/playlist/${playlist.id}`} href="/playlist/[slug]">
        <div className={ styles.container }>
            <div className={ styles.image }>
                <Image layout="responsive" src={ playlist.image.src } width="640" height="640" />
            </div>
            <div className={ styles.info }>
                <h2 className={ styles.name }>{ playlist.name }</h2>
                <div className={ styles.count }>
                    <p className={ styles.songCount }>
                        { playlist.tracks.total }
                    </p>
                    <p>
                        {playlist.followers}
                    </p>
                    <p>
                        {/* {playlist.tracks} */}
                    </p>
                </div>
            </div>
        </div>
    </Link>
  )
}

export default Playlist