import {useSession, signIn, signOut} from 'next-auth/react';
import Link from 'next/link';
import {useState} from 'react';
import styles from '../../styles/Styles.module.css';
import 'swiper/css';
import "swiper/css/navigation";
import prisma from "../../lib/prisma";
import { trackPromise } from "react-promise-tracker";
import { LoadingIndicator } from '../../lib/loadingindicator';
import { setBars } from '../../lib/utils';
import { StatisticsComponent } from '../../lib/statisticscomponent';

export const getServerSideProps = async ( req ) => {
  const userId = req.query.uid;
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

  if (session) {
    return (
      <>
        <div className={styles.header}>
          <div className={styles.dropdown}>
            <Link href="/">
              <img src={session?.token?.picture} className={styles.profile_image}/>
            </Link>
            <div className={styles.dropdown_content}>
              <Link href="/">
                <a>Main Page</a>
              </Link>
              <a onClick={() => signOut()}>Sign out</a>
            </div>
          </div>
        </div>
        
        <div className={styles.top_artists}>
          {playlists.map((item) => (
            <details key={item.id}>
              <summary>{item.name}</summary>
              <ul>
                {item.instances.map((instance) => (
                  <li key={instance.id} onClick={() =>  {setShowMe(false); trackPromise(getStatistics(instance.id))}}>{instance.createdAt}</li>
              ))}
            </ul>  
            </details>
          ))}
        </div>
        
        <LoadingIndicator/>

        <div style={{display: showMe?"block":"none"}}>
          <StatisticsComponent topGenres={allItems?.topGenres} topArtists={allItems?.topArtists}/>
        </div>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn('spotify')}>Sign in</button>
    </>
  );
}