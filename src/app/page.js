import Header from "@/components/Header";
import PostItem from "@/components/PostItem";
import SidebarCard from "@/components/SideBarCard";
import { getAllPosts } from "@/lib/posts";

export default function Home() {
  const posts = getAllPosts();

  const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  const uniqueTags = Array.from(new Set(posts.flatMap((post) => post.tags)));

  return (
    // <div className="bg-[url('/background/light-mode-background.png')] dark:bg-[url('/background/dark-mode-background.png')] bg-cover bg-center min-h-screen">
    <div>
      <Header />
      <main className="container pt-8 flex gap-8 text-primary">
        <div className="w-full md:w-3/4">
          {sortedPosts.map((post) => (
            <PostItem
              key={post.slug}
              slug={post.slug}
              title={post.title}
              description={post.description}
              tags={post.tags}
              date={post.date}
            />
          ))}
        </div>
        <div className="hidden md:block md:w-1/4">
          <div className="sticky top-8">
            <SidebarCard
              type="tags"
              title="Tags"
              contents={uniqueTags}
              path="/tag"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
