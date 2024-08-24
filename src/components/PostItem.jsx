import { Calendar, Tags } from "lucide-react";
import Link from "next/link";
import Tag from "./Tag";

export default function PostItem({ slug, description, tags, date, title }) {
  return (
    <article
      className="flex flex-col gap-2 border-border border-b py-3"
      key={slug}
    >
      <div>
        <h2 className="text-2xl font-bold">
          <Link href={"/post/" + slug}>{title}</Link>
        </h2>
      </div>
      <div className="flex gap-2">
        <Tags />
        {tags?.map((tag) => (
          <Tag tag={tag} key={tag} />
        ))}
      </div>
      {description ? (
        <div className="max-w-none text-muted-foreground">{description}</div>
      ) : (
        <></>
      )}
      <div className="flex justify-between items-center">
        <dl>
          <dt className="sr-only">Published On</dt>
          <dd className="text-sm sm:text-base font-medium flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <time dateTime={date}>{date}</time>
          </dd>
        </dl>
        <Link href={"/post/" + slug}>Read more →</Link>
      </div>
    </article>
  );
}
