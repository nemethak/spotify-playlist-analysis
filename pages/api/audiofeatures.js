import {getAudioFeatures} from '../../lib/spotify';
import {getSession} from 'next-auth/react';

const handler = async (req, res) => {
  const {
    token: {accessToken},
  } = await getSession({req});
  const {ids} = req.query;
  const items = await getAudioFeatures(accessToken, ids).then(response => response.json());
  console.log(items);
  const audio_features = {
    "acousticness": 0,
    "danceability": 0,
    "energy": 0,
    "valence": 0,
    "duration": 0
  }

  for ( const item of items.audio_features ) {
    audio_features.acousticness += item?.acousticness;
    audio_features.danceability += item?.danceability;
    audio_features.energy += item?.energy;
    audio_features.valence += item?.valence;
    audio_features.duration += item?.duration_ms;
  };

  return res.status(200).json({audio_features});
};

export default handler;
