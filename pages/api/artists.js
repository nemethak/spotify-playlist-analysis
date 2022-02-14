import {getArtists} from '../../lib/spotify';
import {getSession} from 'next-auth/react';

const handler = async (req, res) => {
  const {
    token: {accessToken},
  } = await getSession({req});
  const {ids} = req.query;
  const items = await getArtists(accessToken, ids).then(response => response.json());

  return res.status(200).json({items});
};

export default handler;
