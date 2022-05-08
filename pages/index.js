import {getSession, useSession} from 'next-auth/react';
import {useState, useEffect} from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import { trackPromise } from "react-promise-tracker";
import { LoadingIndicator } from '../components/loadingindicator';
import { setBars, splitArray, millisToTime } from '../lib/utils';
import 'swiper/css';
import "swiper/css/navigation";
import styles from '../styles/Index.module.css';
import { StatisticsComponent } from '../components/statisticscomponent';
import { Header } from '../components/header';

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
  return {
    props: { session }
  }
}

export default function Home() {
  const {data: session} = useSession();
  const [playlists, setPlayists] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [topGenres, setTopGenres] = useState([]);
  const [audioFeatures, setAudioFeatures] = useState({});
  const [selectedPlaylist, setSelectedPlaylist] = useState("");
  const [showStatistics, setShowStatstics] = useState(false);
  const [showPlaylists, setShowPlaylists] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);  
  useEffect(() => { const {duration, ...rest} = audioFeatures; setBars(rest); }, [audioFeatures]);

  const getPlaylists = async () => {
    const res = await fetch('/api/playlists');
    const {items} = await res.json();
    setPlayists(items);
    setShowPlaylists(true);
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
      }).then((res) => {
        console.log(res);
        if (res.status === 200) {
          document.getElementById("popUp").textContent = "Succesfully saved playlist statistics.";
        } else {
          document.getElementById("popUp").textContent = "Could not save playlist statistics, an error occured.";
        }
        setShowPopUp(true);
        setTimeout(() => setShowPopUp(false), 3000);
      });

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
      "duration": 0,
    };
    for (const trackIds of allTrackIds) {
      let trackIdsQuery = trackIds.join();
      const tempAudioFeatures = await getAudioFeatures(trackIdsQuery);
      //TODO: what if there are null values among the audio features
      Object.keys(tempAudioFeatures).forEach((key) => {
        audioFeatures[key] += tempAudioFeatures[key];
      });
    }
    const {duration, ...rest} = audioFeatures;
    Object.keys(rest).forEach((key) => {
      audioFeatures[key] /= tracksOnPlaylist.length;
    });
    
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
    setShowStatstics(true);
    setAudioFeatures(audioFeatures);
  }

  return (
    <>
      <Header profileImage={session?.token?.picture} userId={session?.user?.id} currentPage="index" />
      <button onClick={() => {setShowPlaylists(false); trackPromise(getPlaylists())}}>Get all my playlists</button>
      <Swiper
        style={{display: showPlaylists?"block":"none"}}
        spaceBetween={50}
        slidesPerView={3}
        loop={true}
        navigation={true}
        modules={[Navigation]}
        className={styles.swiper}
      >
        <div>
          {playlists.map((item) => (
            <SwiperSlide key={item.id}>
              <div className={styles.slide}>
                <div>
                  <img src={item.images[0]?.url} onClick={() => {setShowStatstics(false); trackPromise(getPlaylistStatistics(item.id))}} width="300" height="300"/>
                  <p>{item.name}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </div>
      </Swiper>
              
      <LoadingIndicator/>

      <div style={{display: showStatistics?"block":"none"}}>
        <StatisticsComponent topGenres={topGenres} topArtists={topArtists} duration={millisToTime(audioFeatures.duration)}/>          
        <button onClick={() => trackPromise(savePlaylistStats())}>Save playlist statistics</button>
        <div id="popUp" className={styles.popup} style={{display: showPopUp?"block":"none"}}> Popup Message </div>
      </div>
    </>
  );
}