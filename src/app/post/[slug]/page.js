import ReactMarkdown from "react-markdown";
import Header from "@/components/Header";
import SidebarCard from "@/components/SideBarCard";
import React from "react";
import rehypeSlug from "rehype-slug";
import Tag from "@/components/Tag";
import { Calendar, Tags } from "lucide-react";
import MenuSheet from "@/components/MenuSheet";
import { getPostBySlug } from "@/lib/posts";

const CustomH1 = ({ node, ...props }) => (
  <h2 className="text-2xl pb-4" {...props} />
);

const CustomParagraph = ({ node, ...props }) => (
  <p className="pb-4" {...props} />
);

export default function PostPage({ params }) {
  const { slug } = params;

  const post = getPostBySlug(slug);

  const headings = [];
  const regex = /^# (.*$)/gm;
  let match;

  while ((match = regex.exec(post.content)) !== null) {
    headings.push(match[1]);
  }

  return (
    <div>
      <Header />
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
    </div>
  );
}
