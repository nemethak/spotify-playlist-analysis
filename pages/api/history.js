import prisma from "../../lib/prisma"

const handler = async (req, res) => {
    const allItems = {};
    const {sid} = req.query;
    
    const playlist = await prisma.playlist.findUnique({
        where: {
            id: sid,
        },
    })
    allItems["playlist"] = playlist;
    const topGenres = await prisma.genreOccurence.findMany({
        where: {
          playlistId: sid,
        },
    })
    allItems["topGenres"] = topGenres;
    const topArtists = await prisma.artistOccurence.findMany({
        where: {
          playlistId: sid,
        },
    })
    for (const artist of topArtists) {
        const artistName = await prisma.artist.findUnique({
            where: {
                id: artist.artistId,
            },
        });
        artist["name"] = artistName.name;
    }
    console.log(playlist)
    allItems["topArtists"] = topArtists;
    res.status(200).json({allItems});
  };
  
  export default handler;
  