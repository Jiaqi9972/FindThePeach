"use client";

import Header from "@/components/Header";
import RecordForm from "@/components/leet-recorder/RecordForm";
import { auth } from "@/config/firebase";

export default function Test() {
  const user = auth.currentUser;
  console.log(auth);
  return (
    <div>
      <Header />
      <main className="container flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-4">
        {user && <RecordForm />}
      </main>
    </div>
  );
}
