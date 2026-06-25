import { getSession } from "@/server/better-auth/server";

export default async function Home() {
  const session = await getSession();

  if (!session) {
    return (
      <main>
        <h1>No Sign in</h1>
      </main>
    );
  }

  return (
    <main>
      <h1>Welcome back, {session.user.name}</h1>
    </main>
  );
}
