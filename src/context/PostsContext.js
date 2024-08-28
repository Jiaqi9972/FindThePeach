"use client";

import React, { createContext, useState, useEffect } from "react";

const PostsContext = createContext();

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    async function fetchAllPosts() {
      const response = await fetch("/api/blog/get-all-posts");
      const data = await response.json();
      setPosts(data);

      setTags(Array.from(new Set(data.flatMap((post) => post.tags))));
    }

    fetchAllPosts();
  }, []);

  return (
    <PostsContext.Provider value={{ posts, tags }}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  return React.useContext(PostsContext);
}
