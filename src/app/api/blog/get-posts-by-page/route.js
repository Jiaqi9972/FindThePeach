import { NextResponse } from "next/server";
import { getPostsByPage } from "@/lib/posts";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const postsPerPage = parseInt(searchParams.get("postsPerPage") || "5", 10);

  const { posts, totalPosts } = getPostsByPage(page, postsPerPage);

  return NextResponse.json({
    posts,
    totalPosts,
  });
}
