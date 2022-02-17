import { PlaylistWrapper } from '../components/PlaylistContext'

import '../styles/globals.css'

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

function MyApp({ Component, pageProps }) {
  return(
    <PlaylistWrapper>
      <Component {...pageProps} />
    </PlaylistWrapper>
  )
}

export default MyApp
