import { getSession } from 'next-auth/react';
import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient()

export default async function handle(req, res) {
    const { selectedPlaylist, playlists, topGenres, topArtists } = req.body;
    const session = await getSession({ req });

    let playlistData = playlists.find(playlist => {
        return playlist.id === selectedPlaylist
      });
    console.log(topGenres);
      
    const result = await prisma.playlist.create({
      data: {
        playlistId: selectedPlaylist,
        name: playlistData.name,
        numOfTracks: playlistData.tracks.total,
      },
    });

    const collection = await prisma.$transaction(
      topGenres.map(cur =>
        prisma.genre.upsert({
          where: { id: cur.id },
          update: {
              playlists: {
                  connect: {
                      id: result.id
                  }
              }
          },
          create: { 
              id: cur.id,
              playlists: {
                  connect: {
                      id: result.id
                  }
              }
          },
        })
      )
    )

    const genreOccurences = await prisma.$transaction(
      topGenres.map(cur =>
        prisma.genreOccurence.create({
            data: {
              genreId: cur.id,
              occurences: cur.occurences,
              playlistId: result.id
            }
        })
      )
    )

    const artists = await prisma.$transaction(
      topArtists.map(cur =>
        prisma.artist.upsert({
          where: { id: cur.id },
          update: {
              playlists: {
                  connect: {
                      id: result.id
                  }
              }
          },
          create: { 
              id: cur.id,
              name: cur.name,
              playlists: {
                  connect: {
                      id: result.id
                  }
              }
          },
        })
      )
    )

    const artistOccurences = await prisma.$transaction(
      topArtists.map(cur =>
        prisma.artistOccurence.create({
            data: {
              artistId: cur.id,
              occurences: cur.occurences,
              playlistId: result.id
            }
        })
      )
    )

    res.json(result);
  }