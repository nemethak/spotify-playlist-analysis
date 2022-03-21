import {getPlaylist} from '../../lib/spotify';
import {getSession} from 'next-auth/react';

const getPlaylistParts = async (accessToken, pid, nextOffset, allItems) => {
  const response = await getPlaylist(accessToken, pid, nextOffset);
  const {items, next, offset} = await response.json();
  allItems.push(...items);
  if (next) {
    await getPlaylistParts(accessToken, pid, offset + 100, allItems);
  }
};

const handler = async (req, res) => {
  const allItems = [];
  const {
    token: {accessToken},
  } = await getSession({req});
  const {pid} = req.query;
  await getPlaylistParts(accessToken, pid, 0, allItems);
  res.status(200).json({allItems});
};

export default handler;
