import Link from "next/link";
import { badgeVariants } from "./ui/badge";
import { slugify } from "@/lib/posts";

export default function Tag({ tag, count }) {
  return (
    <Link
      className={badgeVariants({
        variant: "outline",
        className: "no-underline rounded-md",
      })}
      href={`/tag/#${slugify(tag)}`}
      replace
    >
      {tag} {count ? `(${count})` : null}
    </Link>
  );
}
