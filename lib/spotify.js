import querystring from 'querystring';

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

const getAccessToken = async () => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token
    })
  });

  await new Promise(r => setTimeout(r, 200 * (Math.random() * 10)));

  return response.json();
};

export const getPlaylists = async (limit, offset) => {
  const { access_token } = await getAccessToken();
  const PLAYLISTS_ENDPOINT = `https://api.spotify.com/v1/me/playlists?limit=` + limit + `&offset=` + offset;

  return fetch(PLAYLISTS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  });
};

export const getAllPlaylists = async () => {
  let MAX_PLAYLISTS = 200
  const limit = 50
  const offset = 50

  const playlists = []

  for(let i = 0; i < MAX_PLAYLISTS; i += offset ) {
      const response = await getPlaylists(limit, i)
      const { items, total } = await response.json()

      if (items != null) {
        MAX_PLAYLISTS = total

        const filtered = items.filter(playlist => nameFilter(playlist.name))
  
        filtered.forEach((playlist, index) => playlists.push({
            index:          index,
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
  }

  return playlists
}

function nameFilter(playlistName) {
  const nameFilter = ["fotm", "FOTM", "FotM", "foty", "FOTY", "Group", "group", "GROUP"]
  return nameFilter.some(el => playlistName.includes(el))
}

export const getPlaylistData = async (playlistID) => {
  const { access_token } = await getAccessToken();
  const PLAYLIST_DATA_ENDPOINT = 	`https://api.spotify.com/v1/playlists/${ playlistID }`

  return fetch(PLAYLIST_DATA_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  })
}

export const getSongData = async (songID) => {
  const { access_token } = await getAccessToken();
  const SONG_DATA_ENDPOINT = 	`https://api.spotify.com/v1/audio-features?ids=${ songID }`

  return fetch(SONG_DATA_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
      Accept: "application/json",
      'Content-Type': "application/json"
    }
  })
}

export const getAllSongData = async (tracks) => {
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

  let songIDs = ''

  let contributors = {}

  for(let i = 0; i < (tracks.length / 100); i++){
    songIDs = ''

    for(let j = 0; j < 100 && (j + (i * 100)) < tracks.length; j++) {
      contributors[tracks[[j + (i * 100)]].added_by.id] = (contributors[tracks[[j + (i * 100)]].added_by.id] || 0) + 1

      if(songIDs == '') {
        songIDs = songIDs.concat(tracks[j + (i * 100)].track.id)
      }
      else {
        songIDs = songIDs.concat(",", tracks[j + (i * 100)].track.id)
      }
    }

    const response = await getSongData(songIDs)
    const songs = await response.json()

    // console.log(songs)

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
  }

  for(const key in averages) {
    averages[key] = (averages[key] * 100)
    averages[key] = (averages[key] / tracks.length).toFixed(3)
  }

  loudness = (loudness / tracks.length).toFixed(3)
  tempo = (tempo / tracks.length).toFixed(3)

  return {
    averages,
    loudness,
    tempo,
    contributors
  }
}

export const spotifyFetch = async (ENDPOINT) => {
  const { access_token } = await getAccessToken();

  return fetch(ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  })
}