import Header from "@/components/Header";
import Tag from "@/components/Tag";
import { Tags } from "lucide-react";
import PostTitle from "@/components/PostTitle";
import { getAllPosts, slugify } from "@/lib/posts";

function TagPage() {
  const posts = getAllPosts();

  const uniqueTags = Array.from(new Set(posts.flatMap((post) => post.tags)));

  return (
    <div>
      <Header />
      <main className="container">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="flex flex-row gap-4">
            <Tags />
            <h1>Tags</h1>
          </div>
          <div className="flex flex-row flex-wrap justify-start gap-4 mt-4">
            {uniqueTags?.map((tag) => (
              <Tag tag={tag} key={tag} />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-8">
          {uniqueTags?.map((tag) => (
            <div key={tag} id={slugify(tag)} className="pt-8">
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
    </div>
  );
}

export default TagPage;
