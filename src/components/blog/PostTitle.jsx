import { Calendar, Tags } from "lucide-react";
import Link from "next/link";
import Tag from "./Tag";

export default function PostTitle({ slug, title, tags, date }) {
  return (
    <article
      className="flex flex-row flex-wrap gap-2 border-border border-b py-3"
      key={slug}
    >
      <h2 className="text-xl font-bold">
        <Link href={"/post/" + slug}>{title}</Link>
      </h2>
      <div className="flex justify-between items-center">
        <dl>
          <dt className="sr-only">Published On</dt>
          <dd className="text-sm sm:text-base font-medium flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <time dateTime={date}>{date}</time>
          </dd>
        </dl>
      </div>
      <div className="flex gap-2">
        <Tags />
        {tags?.map((tag) => (
          <Tag tag={tag} key={tag} />
        ))}
      </div>
    </article>
  );
}
