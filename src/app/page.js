"use client";

import { useEffect, useState } from "react";

function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/getPosts");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <main className="p-4">
      <h1 className="text-3xl font-bold mb-4">Hello, blog</h1>
      {data.length === 0 ? (
        <p>Loading...</p>
      ) : (
        data.map((item) => (
          <div key={item.id} className="bg-white shadow-md rounded-lg p-6 mb-4">
            <h2 className="text-2xl font-semibold mb-2">{item.title}</h2>
            <p className="text-gray-700 mb-4">{item.content}</p>
            <p className="text-gray-500">
              <strong>Tags:</strong>{" "}
              {Array.isArray(item.tags)
                ? item.tags.join(", ")
                : "No tags available"}
            </p>
          </div>
        ))
      )}
    </main>
  );
}

export default Home;
