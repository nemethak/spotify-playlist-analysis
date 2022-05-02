import { getSession } from 'next-auth/react';
import prisma from "../../lib/prisma"

export default async function handle(req, res) {
    const { selectedPlaylist, playlists, topGenres, topArtists, audioFeatures } = req.body;
    const session = await getSession({ req });
    const user = session?.user?.id;

    let playlistData = playlists.find(playlist => {
      return playlist.id === selectedPlaylist
    });
    console.log(topGenres);

    const playlist = await prisma.playlist.create({
      data: {
        playlistId: selectedPlaylist,
        name: playlistData.name,
        numOfTracks: playlistData.tracks.total,
        acousticness: audioFeatures.acousticness,
        danceability: audioFeatures.danceability,
        energy: audioFeatures.energy,
        valence: audioFeatures.valence,
        duration: audioFeatures.duration,
        createdAt: new Date().toLocaleString(),
        userId: user,
      },
    });
    console.log(playlist)

    const collection = await prisma.$transaction(
      topGenres.map(cur =>
        prisma.genre.upsert({
          where: { id: cur.id },
          update: {
              playlists: {
                  connect: {
                      id: playlist.id
                  }
              }
          },
          create: { 
              id: cur.id,
              playlists: {
                  connect: {
                      id: playlist.id
                  }
              }
          },
        })
      )
    )
    console.log(collection)

    const genreOccurences = await prisma.$transaction(
      topGenres.map(cur =>
        prisma.genreOccurence.create({
            data: {
              genreId: cur.id,
              occurences: cur.occurences,
              playlistId: playlist.id
            }
        })
      )
    )
    console.log(genreOccurences)

    const artists = await prisma.$transaction(
      topArtists.map(cur =>
        prisma.artist.upsert({
          where: { id: cur.id },
          update: {
              playlists: {
                  connect: {
                      id: playlist.id
                  }
              }
          },
          create: { 
              id: cur.id,
              name: cur.name,
              playlists: {
                  connect: {
                      id: playlist.id
                  }
              }
          },
        })
      )
    )
    console.log(artists)

    const artistOccurences = await prisma.$transaction(
      topArtists.map(cur =>
        prisma.artistOccurence.create({
            data: {
              artistId: cur.id,
              occurences: cur.occurences,
              playlistId: playlist.id
            }
        })
      )
    )
    console.log(artistOccurences)

    res.json(playlist);
  }