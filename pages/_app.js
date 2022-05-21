import {SessionProvider} from 'next-auth/react';
import NextNProgress from "nextjs-progressbar";
import Head from "next/head";
import '../styles/globals.css';

export default function App({Component, pageProps: {session, ...pageProps}}) {
  return (
    <div>
      <Head>
        <title>Home - Playlist Stats for Spotify</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <SessionProvider session={session}>
        <NextNProgress color="#90a1bc" options={{ showSpinner: false }}/>
        <Component {...pageProps} />
      </SessionProvider>
    </div>
  );
};