import { getSession, useSession} from 'next-auth/react';
import Head from 'next/head';
import {useState} from 'react';
import styles from '../../styles/History.module.css';
import 'swiper/css';
import "swiper/css/navigation";
import prisma from "../../lib/prisma";
import { trackPromise } from "react-promise-tracker";
import { LoadingIndicator } from '../../components/loadingindicator';
import { millisToTime, setBars } from '../../lib/utils';
import { StatisticsComponent } from '../../components/statisticscomponent';
import { Header } from '../../components/header';

export const getServerSideProps = async ( req ) => {
  const session = await getSession(req);
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const userId = req.query.uid;

  if (userId != session?.user?.id) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  const saves = await prisma.playlist.findMany({
    where: {
      userId: userId,
     }
  });
  const playlistIds = [...new Set(saves.map(({playlistId})=>playlistId))];
  
  const playlists = [];

  for (const playlistId of playlistIds) {
    let name = saves.filter(e => {return e.playlistId == playlistId})[0].name;
    let instances = saves.filter(e => {return e.playlistId == playlistId});
    playlists.push({
      "id": playlistId,
      "name": name,
      "instances": instances
    });
  }
  
  return {
    props : { playlists }
  }
}

export default function History( { playlists } ) {
  const {data: session} = useSession();
  const [allItems, setAllItems] = useState([]);
  const [showMe, setShowMe] = useState(false);
  const [duration, setDuration] = useState("");

  const getStatistics = async (save_id) => {
    const res = await fetch(`/api/history?sid=${save_id}`);
    const {allItems} = await res.json();
    setAllItems(allItems);
    const audioFeatures = {
      "acousticness": allItems.playlist.acousticness,
      "danceability": allItems.playlist.danceability,
      "energy": allItems.playlist.energy,
      "valence": allItems.playlist.valence,
    }
    setDuration(millisToTime(allItems?.playlist?.duration));
    setShowMe(true);
    setBars(audioFeatures);
  };

  if (playlists.length != 0) {
    return (
      <>
        <Head>
          <title>History - Playlist Stats for Spotify</title>
        </Head>
        <Header profileImage={session?.token?.picture} userId={session?.user?.id} currentPage="history" />
        <div className={styles.menu}>
          {playlists.map((item) => (
            <div key={item.id} className={styles.playlist}>
              <details>
                <summary>{item.name}</summary>
                <ul>
                  {item.instances.map((instance) => (
                    <li key={instance.id} onClick={() =>  {setShowMe(false); trackPromise(getStatistics(instance.id))}}>{instance.createdAt}</li>
                  ))}
                </ul>  
              </details>
            </div>
          ))}
        </div>
        
        <LoadingIndicator/>
  
        <div style={{display: showMe?"block":"none"}}>
          <StatisticsComponent topGenres={allItems?.topGenres} topArtists={allItems?.topArtists} duration={duration} />
        </div>
      </>
    );
  }
  else {
    return (
      <>
        <Head>
          <title>History - Playlist Stats for Spotify</title>
        </Head>
        <Header profileImage={session?.token?.picture} userId={session?.user?.id} currentPage="history" />
        <h3>{`You don't have any statistics yet.`}</h3>
        <p>Data saved on the main page will show up here.</p>
      </>
    );
  }
}