import {SessionProvider} from 'next-auth/react';
import NextNProgress from "nextjs-progressbar";
import '../styles/globals.css';

export default function App({Component, pageProps: {session, ...pageProps}}) {
  return (
    <SessionProvider session={session}>
      <NextNProgress options={{ showSpinner: false }}/>
      <Component {...pageProps} />
    </SessionProvider>
  );
};