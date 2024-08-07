"use client";

import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

function Dashboard() {
  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/error");
    },
  });
  return (
    <main>
      <h1>Hello this is the admin dashboard.</h1>
      <div>{session?.data?.user?.email}</div>
      <button
        onClick={() =>
          signOut({
            callbackUrl: "/",
          })
        }
      >
        Logout
      </button>
    </main>
  );
}

export default Dashboard;
