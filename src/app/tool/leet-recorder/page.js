"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RecordForm from "@/components/leet-recorder/RecordForm";
import CountsComponent from "@/components/leet-recorder/CountsComponent";
import DailyRecordComponent from "@/components/leet-recorder/DailyRecordComponent";
import RecordChart from "@/components/leet-recorder/RecordChart";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";

function LeetRecorderPage() {
  const { user, loadingUser } = useContext(UserContext);

  return (
    <div>
      <Header />
      <main className="container flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-4">
        {!loadingUser && user && <RecordForm />}

        <CountsComponent />

        <RecordChart />

        <DailyRecordComponent />
      </main>
      <Footer />
    </div>
  );
}

export default LeetRecorderPage;
