import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Tag from "./Tag";

export default function SidebarCard({ title, contents, path, type }) {
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
    <>
      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col">
          {type === "menu" &&
            contents.map((content) => (
              <Link
                key={kababify(content)}
                href={`${path}/#${kababify(content)}`}
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
                key={kababify(content)}
                href={`${path}/#${kababify(content)}`}
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
