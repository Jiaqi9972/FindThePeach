"use client";

import Header from "@/components/Header";
import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import PostItem from "@/components/PostItem";
import SidebarCard from "@/components/SideBarCard";
import { usePosts } from "@/context/PostsContext";
import SkeletonPost from "@/components/SkeletonPost";
import Footer from "@/components/Footer";

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const postsPerPage = 5;

  useEffect(() => {
    async function fetchPostsByPage() {
      const response = await fetch(
        `/api/blog/get-posts-by-page?page=${currentPage}&postsPerPage=${postsPerPage}`
      );
      const data = await response.json();
      setPosts(data.posts);
      setTotalPosts(data.totalPosts);
    }
    fetchPostsByPage();
  }, [currentPage]);

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const { tags } = usePosts();

  return (
    <div>
      <Header />
      <main className="container">
        <div className="flex gap-8">
          <div className="w-full md:w-3/4">
            {posts && posts.length > 0
              ? posts.map((post) => (
                  <PostItem
                    key={post.slug}
                    slug={post.slug}
                    title={post.title}
                    description={post.description}
                    tags={post.tags}
                    date={post.date}
                  />
                ))
              : Array.from({ length: 5 }).map((_, index) => (
                  <SkeletonPost key={index} />
                ))}
            <Pagination className="pt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage <= 1}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      href="#"
                      onClick={() => setCurrentPage(index + 1)}
                      className={currentPage === index + 1 ? "font-bold" : ""}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage >= totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
          <div className="hidden md:block md:w-1/4 pt-8">
            <div className="sticky top-8">
              <SidebarCard
                type="tags"
                title="Tags"
                contents={tags}
                path="/tag"
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
