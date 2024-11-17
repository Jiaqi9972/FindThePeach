"use client";

import PostTitle from "@/components/blog/PostTitle";
import SidebarCard from "@/components/blog/SideBarCard";
import ScrollToTop from "@/components/ScrollToTop";
import { usePosts } from "@/context/PostsContext";

function ArchivePage() {
  const { posts } = usePosts();

  const postsByYear = posts.reduce((groupedPosts, post) => {
    const year = post.year;
    if (!groupedPosts[year]) {
      groupedPosts[year] = [];
    }
    groupedPosts[year].push(post);
    return groupedPosts;
  }, {});

  const sortedYears = Object.keys(postsByYear).sort((a, b) => b - a);

  return (
    <main className="container flex gap-8 mt-8">
      <ScrollToTop />
      <div className="w-full md:w-3/4">
        {sortedYears.map((year) => (
          <div key={year} className="pb-16">
            <h2 id={year} className="text-2xl font-bold mb-4">
              {year}
            </h2>
            <div className="flex flex-col gap-4">
              {postsByYear[year].map((post) => (
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
      <div className="hidden md:block md:w-1/4">
        <div className="sticky top-8">
          <SidebarCard
            title="Years"
            contents={sortedYears}
            path="/archive"
            type="year"
          />
        </div>
      </div>
    </main>
  );
}

export default ArchivePage;
