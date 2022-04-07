import { getSession } from 'next-auth/react';
import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient()

export default async function handle(req, res) {
    const { selectedPlaylist, playlists, topGenres } = req.body;
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

      const occurences = await prisma.$transaction(
        topGenres.map(cur =>
          prisma.occurence.create({
              data: {
                genreId: cur.id,
                occurences: cur.occurences,
                playlistId: result.id
              }
          })
        )
      )
    console.log(occurences);
    res.json(result);
  }