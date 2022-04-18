import {useSession, signIn, signOut} from 'next-auth/react';
import Link from 'next/link';
import {useState, useEffect} from 'react';
import { Swiper, SwiperSlide, useSwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import styles from '../styles/Styles.module.css';
import 'swiper/css';
import "swiper/css/navigation";

export default function Home() {
  const {data: session} = useSession();
  const [playlists, setPlayists] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [topGenres, setTopGenres] = useState([]);
  const [audioFeatures, setAudioFeatures] = useState({});
  const [selectedPlaylist, setSelectedPlaylist] = useState("");
  useEffect(() => { setBars(); }, [audioFeatures]);

  function splitArray(array, chunk_size) {
    let index = 0;
    let arrayLength = array.length;
    let tempArray = [];
    
    for (index = 0; index < arrayLength; index += chunk_size) {
        let chunk = array.slice(index, index+chunk_size);
        tempArray.push(chunk);
    }
    return tempArray;
  }

  function setBar(bar, value) {
    let i = 0;
    if (i == 0) {
      i = 1;
      let elem = document.getElementById(bar);
      let width = 1;
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

  function setBars() {
    Object.keys(audioFeatures).forEach((key) => {
      setBar(`${key}Bar`,audioFeatures[key]*100)
    });
  }

  const getPlaylists = async () => {
    const res = await fetch('/api/playlists');
    const {items} = await res.json();
    setPlayists(items);
  };

  const getPlaylistItems = async (playlist_id) => {
    const res = await fetch(`/api/playlist?pid=${playlist_id}`);
    const {allItems} = await res.json();
    return allItems;
  };

  const getArtists = async (artist_ids) => {
    const res = await fetch(`/api/artists?ids=${artist_ids}`);
    const {items} = await res.json();
    return items;
  };

  const getAudioFeatures = async (track_ids) => {
    const res = await fetch(`/api/audiofeatures?ids=${track_ids}`);
    const {audio_features} = await res.json();
    return audio_features;
  };

  const savePlaylistStats = async () => {
    try {
      const body = { selectedPlaylist, playlists, topGenres, topArtists, audioFeatures };
      await fetch('api/statistics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    } catch (error) {
      console.error(error);
    }
  };

  const getPlaylistStatistics = async (playlist_id) => {
    setSelectedPlaylist(playlist_id);
    const playlistItems = await getPlaylistItems(playlist_id);
    let artistsOnPlaylist = {};
    let tracksOnPlaylist = [];
    for (let i=0; i < playlistItems.length; i++) {
      if (playlistItems[i].track) {
        tracksOnPlaylist.push(playlistItems[i].track.id);
        let artists = playlistItems[i].track.artists;
        for (let j=0; j < artists.length; j++) {
          artistsOnPlaylist[artists[j].id] = {name: artists[j].name, occurences: (artistsOnPlaylist[artists[j].id]?.occurences || 0) + 1};
        }
      }
    }

    let allTrackIds = splitArray(tracksOnPlaylist, 100);
    const audioFeatures = {
      "acousticness": 0,
      "danceability": 0,
      "energy": 0,
      "valence": 0,
    };
    for (const trackIds of allTrackIds) {
      let trackIdsQuery = trackIds.join();
      const tempAudioFeatures = await getAudioFeatures(trackIdsQuery);
      //TODO: what if there are null values among the audio features
      Object.keys(tempAudioFeatures).forEach((key) => {
        audioFeatures[key] += tempAudioFeatures[key];
      });
    }
    Object.keys(audioFeatures).forEach((key) => {
      audioFeatures[key] /= tracksOnPlaylist.length;
    });
    setAudioFeatures(audioFeatures);
    
    let allArtistsIds = splitArray(Object.keys(artistsOnPlaylist), 50);
    const artists = [];
    for (const artistsIds of allArtistsIds) {
      let artistIdsQuery = Object.values(artistsIds).join();
      const tempArtists = await getArtists(artistIdsQuery);
      for (const artist of tempArtists.artists) {
        artists.push(artist);
      }
    }

    let genresOnPlaylist = [];
    for (let i=0; i < artists.length; i++) {
      if (artists[i]) {
        let genres = artists[i].genres;
        for (let j=0; j < genres.length; j++) {
          genresOnPlaylist[`"${genres[j]}"`] = (genresOnPlaylist[`"${genres[j]}"`] || 0) + 1 + artistsOnPlaylist[artists[i].id].occurences;
        }
      }
    }
    let sortedGenres = Object.keys(genresOnPlaylist).sort((a,b) => (genresOnPlaylist[b] - genresOnPlaylist[a]));
    sortedGenres.length = Math.min(sortedGenres.length, 5);
    for (let i=0; i < sortedGenres.length; i++) {
      sortedGenres[i] = {
                          id: sortedGenres[i],
                          occurences: genresOnPlaylist[sortedGenres[i]]
                        }
    }
    setTopGenres(sortedGenres);

    let sortedArtists = Object.keys(artistsOnPlaylist).sort((a,b) => (artistsOnPlaylist[b].occurences - artistsOnPlaylist[a].occurences));
    sortedArtists.length = Math.min(sortedArtists.length, 5); 
    for (let i=0; i < sortedArtists.length; i++) {
      sortedArtists[i] = {
                          id: sortedArtists[i],
                          name: artistsOnPlaylist[sortedArtists[i]].name,
                          occurences: artistsOnPlaylist[sortedArtists[i]].occurences
                        }
    }
    setTopArtists(sortedArtists);
  }

  if (session) {
    return (
      <>
        <div className={styles.header}>
          <div className={styles.dropdown}>
            <img src={session?.token?.picture} className={styles.profile_image}/>
            <div className={styles.dropdown_content}>
              <Link href={`history/${session?.user?.id}`}>
                <a>History</a>
              </Link>
              <a onClick={() => signOut()}>Sign out</a>
            </div>
          </div>
        </div>

        <button onClick={() => getPlaylists()}>Get all my playlists</button>
        <Swiper
          spaceBetween={50}
          slidesPerView={3}
          loop={true}
          navigation={true}
          modules={[Navigation]}
          onSwiper={(swiper) => console.log(swiper)}
        >
          {playlists.map((item) => (
            <SwiperSlide key={item.id}>
              <div>
                <p>{item.name}</p>
                <img src={item.images[0]?.url} onClick={() => getPlaylistStatistics(item.id)} width="300" height="300"/>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <button onClick={() => savePlaylistStats()}>Save playlist statistics</button>

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
          {topGenres.map((item) => (
            <div key={item.id} className={styles.genre}>
              <p>{item.id.slice(1,item.id.length-1)}</p>
            </div>
          ))}
        </div>

        <div className={styles.top_artists}>
          {topArtists.map((item) => (
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