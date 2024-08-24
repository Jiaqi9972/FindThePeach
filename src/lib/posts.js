import fs from "fs";
import path from "path";
import matter from "gray-matter";

export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export function getPostBySlug(slug) {
  const postsDirectory = path.join(process.cwd(), "posts");
  const filenames = fs.readdirSync(postsDirectory);

  const matchedFile = filenames.find((filename) => {
    const [year, month, day, ...slugParts] = filename
      .replace(/\.mdx$/, "")
      .split("-");
    const filenameSlug = slugParts.join("-");
    return filenameSlug === slug;
  });

  if (!matchedFile) {
    throw new Error(`No post found for slug: ${slug}`);
  }

  const filePath = path.join(postsDirectory, matchedFile);
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    slug,
    date: data.date,
    title: data.title,
    content,
    tags: data.tags,
    description: data.description,
  };
}

export function getAllPosts() {
  const postsDirectory = path.join(process.cwd(), "posts");
  const filenames = fs.readdirSync(postsDirectory);

  const posts = filenames.map((filename) => {
    const [year, month, day, ...slugParts] = filename
      .replace(/\.mdx$/, "")
      .split("-");
    const slug = slugParts.join("-");

    const filePath = path.join(postsDirectory, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);

    return {
      slug,
      date: data.date,
      title: data.title,
      tags: data.tags,
      description: data.description,
      year,
    };
  });

  return posts;
}
