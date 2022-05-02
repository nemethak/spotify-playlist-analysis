import {useSession, signIn, signOut} from 'next-auth/react';
import Link from 'next/link';
import {useState} from 'react';
import { Swiper, SwiperSlide, useSwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import styles from '../../styles/Styles.module.css';
import 'swiper/css';
import "swiper/css/navigation";
import prisma from "../../lib/prisma";

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

function setBar(bar, value) {
  let i = 0;
  if (i == 0) {
    i = 1;
    let elem = document.getElementById(bar);
    let width = 0;
    let id = setInterval(frame, 10);
    function frame() {
      if (width >= value) {
        clearInterval(id);
        i = 0;
      } else {
        width++;
        elem.style.width = width + "%";
      }
    }
  }
}

function setBars(audioFeatures) {
  Object.keys(audioFeatures).forEach((key) => {
    setBar(`${key}Bar`,audioFeatures[key]*100)
  });
}

//TODO audioFeature may not change when it would be changed to 0

export default function History( { playlists } ) {
  const {data: session} = useSession();
  const [allItems, setAllItems] = useState([]);

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
                  <li key={instance.id} onClick={() => getStatistics(instance.id)}>{instance.createdAt}</li>
               ))}
             </ul>  
            </details>
          ))}
        </div>

        <p>Acousticness</p>
        <div className={styles.my_progress}>
          <div id="acousticnessBar" className={styles.my_bar}></div>
        </div>

        <p>Danceability</p>
        <div className={styles.my_progress}>
          <div id="danceabilityBar" className={styles.my_bar}></div>
        </div>

        <p>Energy</p>
        <div className={styles.my_progress}>
          <div id="energyBar" className={styles.my_bar}></div>
        </div>

        <p>Valence</p>
        <div className={styles.my_progress}>
          <div id="valenceBar" className={styles.my_bar}></div>
        </div>

        <div className={styles.top_genres}>
          {allItems?.topGenres?.map((item) => (
            <div key={item.id} className={styles.genre}>
              <p>{item.genreId.slice(1,item.genreId.length-1)}</p>
            </div>
          ))}
        </div>

        <div className={styles.top_artists}>
          {allItems.topArtists?.map((item) => (
          <div key={item.id} className={styles.artist}>
            <p>{item.name}</p>
          </div>
        ))}
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