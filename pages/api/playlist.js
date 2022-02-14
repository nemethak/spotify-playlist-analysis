import {getPlaylist} from '../../lib/spotify';
import {getSession} from 'next-auth/react';

const handler = async (req, res) => {
  const {
    token: {accessToken},
  } = await getSession({req});
  const {pid} = req.query;
  const response = await getPlaylist(accessToken, pid);
  const {items} = await response.json();

  return res.status(200).json({items});
};

export default handler;
