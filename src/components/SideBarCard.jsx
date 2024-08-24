import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tags } from "lucide-react";
import Tag from "./Tag";
import { slugify } from "@/lib/posts";

export default function SidebarCard({ title, contents, path, type }) {
  return (
    <>
      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col">
          {type === "menu" &&
            contents.map((content) => (
              <Link
                key={slugify(content)}
                href={`${path}/#${slugify(content)}`}
                replace
              >
                {content}
              </Link>
            ))}
          {type === "tags" && (
            <div className="flex flex-wrap gap-2 items-center">
              {contents.map((content) => (
                <Tag tag={content} key={content} />
              ))}
            </div>
          )}
          {type === "year" &&
            contents.map((content) => (
              <Link
                key={slugify(content)}
                href={`${path}/#${slugify(content)}`}
                replace
              >
                {content}
              </Link>
            ))}
        </CardContent>
      </Card>
    </>
  );
}
