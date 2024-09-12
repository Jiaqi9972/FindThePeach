import Link from "next/link";
import { badgeVariants } from "@/components/ui/badge";

export default function Tag({ tag, count }) {
  function kababify(text) {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  }

  return (
    <Link
      className={badgeVariants({
        variant: "secondary",
        className: "no-underline rounded-md",
      })}
      href={`/tag/#${kababify(tag)}`}
      replace
    >
      {tag} {count ? `(${count})` : null}
    </Link>
  );
}
