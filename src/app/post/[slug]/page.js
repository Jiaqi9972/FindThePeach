"use client";

import ReactMarkdown from "react-markdown";
import SidebarCard from "@/components/blog/SideBarCard";
import React, { useEffect, useState } from "react";
import rehypeSlug from "rehype-slug";
import rehypePrism from "rehype-prism-plus";
import Tag from "@/components/blog/Tag";
import { Calendar, Tags } from "lucide-react";
import MenuSheet from "@/components/blog/MenuSheet";
import "prismjs/themes/prism-tomorrow.css";
import ScrollToTop from "@/components/ScrollToTop";

// Unified heading styles using shadcn design system
const headingStyles = {
  h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
  h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0",
  h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
  h4: "scroll-m-20 text-xl font-semibold tracking-tight",
  h5: "scroll-m-20 text-lg font-semibold tracking-tight",
  h6: "scroll-m-20 text-base font-semibold tracking-tight",
};

// Custom paragraph component with proper spacing
const CustomParagraph = ({ node, ...props }) => (
  <p className="leading-7 [&:not(:first-child)]:my-4" {...props} />
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
          // Extract headings with better structure detection
          const lines = data.content.split("\n");
          const headings = lines.filter(
            (line) => line.startsWith("#") || /^\d+\.\s/.test(line)
          );
          setHeadings(headings);
        }
      }
      fetchPost();
    }
  }, [slug]);

  // Show loading state while fetching post
  if (!post) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-20rem)]">
        Loading...
      </div>
    );
  }

  return (
    <main className="container pt-8 flex gap-8 min-h-[calc(100vh-8rem)]">
      <ScrollToTop />
      <MenuSheet title="Menu" contents={headings} path={`/post/${slug}`} />
      <div className="w-full md:w-3/4">
        {/* Post header section */}
        <h1 className="text-4xl pb-8 font-bold">{post.title}</h1>
        <div className="flex gap-8 items-center pb-8">
          <div className="flex gap-2 items-center">
            <Calendar className="h-4 w-4" />
            <time dateTime={post.date}>{post.date}</time>
          </div>
          <div className="flex gap-2 items-center">
            <Tags className="h-4 w-4" />
            {post.tags?.map((tag) => (
              <Tag tag={tag} key={tag} />
            ))}
          </div>
        </div>

        {/* Markdown content with custom components */}
        <ReactMarkdown
          rehypePlugins={[rehypeSlug, rehypePrism]}
          components={{
            h1: ({ children, id }) => (
              <h1 id={id} className={headingStyles.h1}>
                {children}
              </h1>
            ),
            h2: ({ children, id }) => (
              <h2 id={id} className={headingStyles.h2}>
                {children}
              </h2>
            ),
            h3: ({ children, id }) => (
              <h3 id={id} className={headingStyles.h3}>
                {children}
              </h3>
            ),
            h4: ({ children, id }) => (
              <h4 id={id} className={headingStyles.h4}>
                {children}
              </h4>
            ),
            h5: ({ children, id }) => (
              <h5 id={id} className={headingStyles.h5}>
                {children}
              </h5>
            ),
            h6: ({ children, id }) => (
              <h6 id={id} className={headingStyles.h6}>
                {children}
              </h6>
            ),
            p: CustomParagraph,
            // Code block handling with syntax highlighting
            code: ({ node, inline, className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <pre className=" overflow-x-auto rounded-lg py-4">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              ) : (
                <code
                  className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm"
                  {...props}
                >
                  {children}
                </code>
              );
            },
            // List styling
            ul: ({ children }) => (
              <ul className="my-6 ml-6 list-disc [&>li]:mt-2">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">{children}</ol>
            ),
            // Link styling
            a: ({ href, children }) => (
              <a
                href={href}
                className="font-medium text-primary underline underline-offset-4"
              >
                {children}
              </a>
            ),
            // Blockquote styling
            blockquote: ({ children }) => (
              <blockquote className="mt-6 border-l-2 border-primary pl-6 italic">
                {children}
              </blockquote>
            ),
            // Table styling
            table: ({ children }) => (
              <div className="my-6 w-full overflow-y-auto">
                <table className="w-full">{children}</table>
              </div>
            ),
            th: ({ children }) => (
              <th className="border px-4 py-2 text-left font-bold">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border px-4 py-2">{children}</td>
            ),
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>
      {/* Table of contents sidebar */}
      <div className="hidden md:block md:w-1/4">
        <div className="sticky top-8">
          <SidebarCard
            type="menu"
            title="Menu"
            contents={headings}
            path={`/post/${slug}`}
          />
        </div>
      </div>
    </main>
  );
}
