const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const PLAYLISTS_ENDPOINT = 'https://api.spotify.com/v1/me/playlists?limit=50';

const getAccessToken = async (refresh_token) => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
    }),
  });
  return response.json();
};

export const getUsersPlaylists = async (refresh_token) => {
  const {access_token} = await getAccessToken(refresh_token);
  return fetch(PLAYLISTS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

export const getPlaylist = async (refresh_token, playlist_id, offset) => {
  const {access_token} = await getAccessToken(refresh_token);
  const PLAYLIST_ENDPOINT = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks?offset=${offset}`;
  return fetch(PLAYLIST_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

export const getArtists = async (refresh_token, artist_ids) => {
  const {access_token} = await getAccessToken(refresh_token);
  const ARTISTS_ENDPOINT = `https://api.spotify.com/v1/artists?ids=${artist_ids}`;
  return fetch(ARTISTS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

export const getAudioFeatures = async (refresh_token, track_ids) => {
  const {access_token} = await getAccessToken(refresh_token);
  const AUDIO_FEATURES_ENDPOINT = `https://api.spotify.com/v1/audio-features?ids=${track_ids}`;
  return fetch(AUDIO_FEATURES_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};