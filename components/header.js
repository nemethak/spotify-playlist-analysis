import styles from '../styles/Header.module.css';
import Link from 'next/link';
import {signOut} from 'next-auth/react';

export const Header = props => {
  const menuItems = [];
  if (props.currentPage === "index") {
    menuItems.push(
      <Link key="history" href={`/history/${props.userId}`}>
        <a>History</a>
      </Link>
    );
  } else {
    menuItems.push(
      <Link key="index" href="/">
        <a>Main Page</a>
      </Link>
    )
  };
  
  return (
    <div className={styles.header}>
      <div className={styles.dropdown}>
        <img src={props.profileImage} className={styles.profile_image}/>
        <div className={styles.dropdown_content}>
          {menuItems?.map((item) => (
            item
          ))}
          <a onClick={() => signOut()}>Sign out</a>
        </div>
      </div>
    </div>
  );
}