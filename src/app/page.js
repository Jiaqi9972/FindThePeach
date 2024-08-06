"use client";
import { useEffect, useState } from "react";

function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      console.log("fetch here");
      const res = await fetch("/api/getData");
      if (res.ok) {
        const result = await res.json();
        console.log(result);
        setData(result);
      } else {
        console.error("Failed to fetch data");
      }
    }
    fetchData();
  }, []);

  return (
    <main>
      <h1>Hello, blog</h1>
      <ul>
        {data.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </main>
  );
}

export default Home;
