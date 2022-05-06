import { getProviders, signIn } from "next-auth/react";
import styles from '../styles/Login.module.css';
import Image from 'next/image';
import statistics from '../public/bar-chart.png';
import history from '../public/history.png'

export async function getServerSideProps() {
  return { props: { providers: await getProviders() } };
}

export default function LogIn({ providers }) {
  return (
    <>
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
        <h1>Playlist Stats for Spotify</h1>
        <p>Please log in with your spotify account to see your playlist statistics!</p>
        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button onClick={() => signIn(provider.id, {
              callbackUrl: `${window.location.origin}`,
              })}>
              Log in with {provider.name}
            </button>
          </div>
        ))}
        <div className={styles.section}>
          <div>
            <Image src={statistics} alt="Bar chart icon" />
          </div>
          <h2>Individual charts</h2>
          <p>{`Pick a playlist, and view its most prevalent genres and artists. You can also get estimations of the playlist's acousticness, danceability, energy and valence.`}</p>
        </div>
        <div className={styles.section}>
          <div>
            <Image src={history} alt="History icon" />
          </div>
          <h2>View past results</h2>
          <p>See how your playlist changed over time, by saving your statistics and going through the History section.</p>
        </div>
      </div>
    </>
  );
}