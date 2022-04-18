import {useSession, signIn, signOut} from 'next-auth/react';
import Link from 'next/link';
import {useState} from 'react';
import { Swiper, SwiperSlide, useSwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import styles from '../../styles/Styles.module.css';
import 'swiper/css';
import "swiper/css/navigation";
import prisma from "../../lib/prisma"

export const getServerSideProps = async ( req ) => {
  const userId = req.query.uid;
  const playlists = await prisma.playlist.findMany({
    where: {
      userId: userId,
     }
  });
  return {
    props : { playlists }
  }
}

export default function History( { playlists } ) {
  const {data: session} = useSession();

  if (session) {
    return (
      <>
        <div className={styles.header}>
          <div className={styles.dropdown}>
            <Link href="/">
              <img src={session?.token?.picture} className={styles.profile_image}/>
            </Link>
            <div className={styles.dropdown_content}>
              <Link href="/">
                <a>Main Page</a>
              </Link>
              <a onClick={() => signOut()}>Sign out</a>
            </div>
          </div>
        </div>
        
        <div className={styles.top_genres}>
          {playlists.map((item) => (
             <li key={item.id}>{item.name} - {item.createdAt}</li>
          ))}
        </div>
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