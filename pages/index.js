import {useSession, signIn, signOut} from 'next-auth/react';
import {useState} from 'react';

export default function Home() {
  const {data: session} = useSession();
  const [list, setList] = useState([]);

  const getPlaylists = async () => {
    const res = await fetch('/api/playlists');
    const {items} = await res.json();
    setList(items);
  };

  if (session) {
    return (
      <>
        Signed in as {session?.token?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
        <hr />
        <button onClick={() => getPlaylists()}>Get all my playlists</button>
        {list.map((item) => (
          <div key={item.id}>
            <p>{item.name}</p>
            <img src={item.images[0]?.url} width="300" height="300"/>
          </div>
        ))}
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