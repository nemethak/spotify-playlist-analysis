import { getSession, useSession} from 'next-auth/react';
import Link from 'next/link';
import {useState} from 'react';
import styles from '../../styles/History.module.css';
import 'swiper/css';
import "swiper/css/navigation";
import prisma from "../../lib/prisma";
import { trackPromise } from "react-promise-tracker";
import { LoadingIndicator } from '../../components/loadingindicator';
import { setBars } from '../../lib/utils';
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

//TODO audioFeature may not change when it would be changed to 0

export default function History( { playlists } ) {
  const {data: session} = useSession();
  const [allItems, setAllItems] = useState([]);
  const [showMe, setShowMe] = useState(false);

  const getStatistics = async (save_id) => {
    const res = await fetch(`/api/history?sid=${save_id}`);
    const {allItems} = await res.json();
    console.log(allItems)
    setAllItems(allItems);
    const audioFeatures = {
      "acousticness": allItems.playlist.acousticness,
      "danceability": allItems.playlist.danceability,
      "energy": allItems.playlist.energy,
      "valence": allItems.playlist.valence,
    }
    setShowMe(true);
    setBars(audioFeatures);
  };

  return (
    <>
      <Header profileImage={session?.token?.picture} userId={session?.user?.id} currentPage="history" />
      <div className={styles.card}>
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
        <StatisticsComponent topGenres={allItems?.topGenres} topArtists={allItems?.topArtists}/>
      </div>
    </>
  );
}