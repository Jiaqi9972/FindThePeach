import fs from "fs";
import path from "path";
import matter from "gray-matter";

let allPosts = null;

// load all posts
export function loadAllPosts() {
  if (allPosts) return allPosts;

  const postsDirectory = path.join(process.cwd(), "posts");
  const filenames = fs
    .readdirSync(postsDirectory)
    .filter((filename) => filename !== ".DS_Store");

  allPosts = filenames
    .map((filename) => {
      const [year, month, day, ...slugParts] = filename
        .replace(/\.mdx$/, "")
        .split("-");
      const slug = slugParts.join("-");

      const filePath = path.join(postsDirectory, filename);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);

      return {
        slug,
        date: data.date,
        title: data.title,
        content,
        tags: data.tags,
        description: data.description,
        year,
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return allPosts;
}

// get post by slug
export function getPostBySlug(slug) {
  const posts = loadAllPosts();

  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    throw new Error(`No post found for slug: ${slug}`);
  }

  return post;
}

// get all posts
export function getAllPosts() {
  return loadAllPosts();
}

// get posts by page
export function getPostsByPage(page, postsPerPage) {
  const posts = loadAllPosts();
  const offset = (page - 1) * postsPerPage;
  return {
    posts: posts.slice(offset, offset + postsPerPage),
    totalPosts: posts.length,
  };
}

// get all tags
export function getUniqueTags() {
  const posts = getAllPosts();
  const tags = posts.flatMap((post) => post.tags);
  return Array.from(new Set(tags));
}
