import NextAuth from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';
import prisma from "../../../lib/prisma"

export default NextAuth({
  providers: [
    SpotifyProvider({
      authorization:
        'https://accounts.spotify.com/authorize?scope=user-read-email,playlist-read-private',
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({token, account}) {
      if (account) {
        token.accessToken = account.refresh_token;
      }
      return token;
    },
    async session(session, user) {
      const upsertUser = await prisma.user.upsert({
        where: {
          email: session?.token.email,
        },
        update: {},
        create: {
          email: session?.token.email,
          name: session?.token.name,
        },
      })
      session.user = upsertUser;
      return session;
    },
  },
});
