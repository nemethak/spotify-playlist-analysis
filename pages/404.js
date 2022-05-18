import Head from "next/head";
import Link from "next/link";
import styles from '../styles/404.module.css';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 - Playlist Stats for Spotify</title>
      </Head>
      <style jsx global>
        {`
          html, body {
            background: url('/login-cover.png') no-repeat center center fixed; 
            -webkit-background-size: cover;
            -moz-background-size: cover;
            -o-background-size: cover;
            background-size: cover;
          }
        `}
      </style>
      <div className={styles.page}>
        <h1>404 - Page Not Found</h1>
        <Link key="index" href="/">
          <button>Back to site</button>
        </Link>
      </div>
    </>
  )
}