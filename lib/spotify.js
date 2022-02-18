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

  return playlists
}

function nameFilter(playlistName) {
  const nameFilter = ["fotm", "FOTM", "FotM", "foty", "FOTY", "Group", "group", "GROUP"]
  return nameFilter.some(el => playlistName.includes(el))
}

export const getPlaylistData = async (playlistID) => {
  const { access_token } = await getAccessToken();
  const PLAYLIST_DATA_ENDPOINT = 	`https://api.spotify.com/v1/playlists/${ playlistID }`

  console.log(PLAYLIST_DATA_ENDPOINT)

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