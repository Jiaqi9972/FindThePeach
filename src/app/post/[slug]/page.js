"use client";

import ReactMarkdown from "react-markdown";
import SidebarCard from "@/components/blog/SideBarCard";
import React, { useEffect, useState } from "react";
import rehypeSlug from "rehype-slug";
import Tag from "@/components/blog/Tag";
import { Calendar, Tags } from "lucide-react";
import MenuSheet from "@/components/blog/MenuSheet";

const CustomH1 = ({ node, ...props }) => (
  <h2 className="text-2xl pb-4" {...props} />
);

const CustomParagraph = ({ node, ...props }) => (
  <p className="pb-4" {...props} />
);

export default function PostPage({ params }) {
  const [post, setPost] = useState(null);
  const [headings, setHeadings] = useState([]);
  const { slug } = params;

  useEffect(() => {
    if (slug) {
      async function fetchPost() {
        const response = await fetch(`/api/blog/get-post-by-slug?slug=${slug}`);
        const data = await response.json();

        if (!data.error) {
          setPost(data);
          const extractedHeadings = [];
          const regex = /^# (.*$)/gm;
          let match;
          while ((match = regex.exec(data.content)) !== null) {
            extractedHeadings.push(match[1]);
          }
          setHeadings(extractedHeadings);
        } else {
          console.error("Error fetching post:", data.error);
        }
      }

      fetchPost();
    }
  }, [slug]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <main className="container pt-8 flex gap-8 text-primary">
      <MenuSheet title="Menu" contents={headings} path={`/post/${slug}`} />
      <div className="w-full md:w-3/4">
        <h1 className="text-4xl pb-8">{post.title}</h1>
        <div className="flex gap-8 items-center pb-8">
          <div className="flex gap-2 items-center">
            <Calendar className="h-4 w-4" />
            <time dateTime={post.date}>{post.date}</time>
          </div>
          <div className="flex gap-2 items-center">
            <Tags />
            {post.tags?.map((tag) => (
              <Tag tag={tag} key={tag} />
            ))}
          </div>
        </div>

        <ReactMarkdown
          rehypePlugins={[rehypeSlug]}
          components={{
            h1: CustomH1,
            p: CustomParagraph,
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>
      <div className="hidden md:block md:w-1/4">
        <div className="sticky top-8">
          <SidebarCard
            type="menu"
            title="Menu"
            contents={headings}
            path={`/post/${post.slug}`}
          />
        </div>
      </div>
    </main>
  );
}
