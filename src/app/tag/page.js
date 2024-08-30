"use client";

import Header from "@/components/Header";
import Tag from "@/components/Tag";
import { Tags } from "lucide-react";
import PostTitle from "@/components/PostTitle";
import { usePosts } from "@/context/PostsContext";
import Footer from "@/components/Footer";

function TagPage() {
  const { posts, tags } = usePosts();

  function kababify(text) {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  }

  return (
    <div>
      <Header />
      <main className="container py-4">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="flex flex-row gap-4">
            <Tags />
            <h1>Tags</h1>
          </div>
          <div className="flex flex-row flex-wrap justify-start gap-4 mt-4">
            {tags?.map((tag) => (
              <Tag tag={tag} key={tag} />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-12">
          {tags?.map((tag) => (
            <div key={tag} id={kababify(tag)}>
              <h2 className="text-2xl font-bold mb-4">{tag}</h2>
              <div className="flex flex-col gap-4">
                {posts
                  .filter((post) => post.tags.includes(tag))
                  .map((post) => (
                    <PostTitle
                      key={post.slug}
                      slug={post.slug}
                      title={post.title}
                      tags={post.tags}
                      date={post.date}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default TagPage;
