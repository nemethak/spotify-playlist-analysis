import {useSession, signIn, signOut} from 'next-auth/react';
import Link from 'next/link';
import {useState} from 'react';
import { Swiper, SwiperSlide, useSwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import 'swiper/css';
import "swiper/css/navigation";

export default function Home() {
  const {data: session} = useSession();
  const [playlists, setPlayists] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [topGenres, setTopGenres] = useState([]);

  function splitArray(array, chunk_size){
    let index = 0;
    let arrayLength = array.length;
    let tempArray = [];
    
    for (index = 0; index < arrayLength; index += chunk_size) {
        let chunk = array.slice(index, index+chunk_size);
        tempArray.push(chunk);
    }
    return tempArray;
}

  const getPlaylists = async () => {
    const res = await fetch('/api/playlists');
    const {items} = await res.json();
    setPlayists(items);
  };

  const getPlaylistItems = async (playlist_id) => {
    const res = await fetch(`/api/playlist?pid=${playlist_id}`);
    const {items} = await res.json();
    return items;
  };

  const getArtists = async (artists_ids) => {
    const res = await fetch(`/api/artists?ids=${artists_ids}`);
    const {items} = await res.json();
    return items;
  };

  const getPlaylistStatistics = async (playlist_id) => {
    const playlistItems = await getPlaylistItems(playlist_id);
    let artistsOnPlaylist = {};
    for (let i=0; i < playlistItems.length; i++) {
      if (playlistItems[i].track) {
        let artists = playlistItems[i].track.artists;
        for (let j=0; j < artists.length; j++) {
          artistsOnPlaylist[artists[j].id] = {name: artists[j].name, occurences: (artistsOnPlaylist[artists[j].id]?.occurences || 0) + 1};
        }
      }
    }

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
      if (artists[i].genres) {
        let genres = artists[i].genres;
        for (let j=0; j < genres.length; j++) {
          genresOnPlaylist[`"${genres[j]}"`] = (genresOnPlaylist[`"${genres[j]}"`] || 0) + 1 + artistsOnPlaylist[artists[i].id].occurences;
        }
      }
    }
    let sortedGenres = Object.keys(genresOnPlaylist).sort((a,b) => (genresOnPlaylist[b] - genresOnPlaylist[a]));
    sortedGenres.length = Math.min(sortedGenres.length, 5);
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
        Signed in as {session?.token?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
        <hr />
        <button onClick={() => getPlaylists()}>Get all my playlists</button>
        <Swiper
          spaceBetween={50}
          slidesPerView={3}
          loop={true}
          navigation={true}
          modules={[Navigation]}
          onSlideChange={() => console.log('slide change')}
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
        {topArtists.map((item) => (
        <div key={item.id}>
          <p>{item.name}</p>
          <hr />
        </div>
      ))}
      <hr />
      {topGenres.map((item) => (
        <div key={item}>
          <p>{item.slice(1,item.length-1)}</p>
          <hr />
        </div>
      ))}
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