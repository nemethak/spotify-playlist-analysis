import { getProviders, signIn } from "next-auth/react"
export default function LogIn({ providers }) {
  return (
    <>
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button onClick={() => signIn(provider.id, {
      callbackUrl: `${window.location.origin}`,
      })}>
            Log in with {provider.name}
          </button>
        </div>
      ))}
    </>
  );
}
export async function getServerSideProps(context) {
  return { props: { providers: await getProviders() } };
}