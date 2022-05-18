import styles from '../styles/Header.module.css';
import Link from 'next/link';
import {signOut} from 'next-auth/react';

export const Header = props => {
  const menuItems = [];
  if (props.currentPage === "index") {
    menuItems.push(
      <Link key="history" href={`/history/${props.userId}`}>
        <a data-testid="history">History</a>
      </Link>
    );
  } else {
    menuItems.push(
      <Link key="index" href="/">
        <a data-testid="index">Main Page</a>
      </Link>
    )
  };
  
  return (
    <div className={styles.header}>
      <h1 data-testid="title">Playlist Stats for Spotify</h1>
      <div className={styles.dropdown} data-testid="dropdown">
        <img src={props.profileImage} className={styles.profile_image} data-testid="profile-image" />
        <div className={styles.dropdown_content}>
          {menuItems?.map((item) => (
            item
          ))}
          <a onClick={() => signOut()} data-testid="sign-out">Sign out</a>
        </div>
      </div>
    </div>
  );
}