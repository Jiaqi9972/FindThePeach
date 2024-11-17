import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Tag from "./Tag";

export default function SidebarCard({ title, contents, path, type }) {
  function kababify(text) {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\d\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  }

  // Process headings to create a hierarchical structure
  const processHeadings = (headings) => {
    let result = [];
    let currentMain = null;

    headings.forEach((heading) => {
      const cleanHeading = heading.replace(/^#+\s+/, "");

      if (heading.startsWith("## ")) {
        currentMain = {
          text: cleanHeading,
          subItems: [],
        };
        result.push(currentMain);
      } else if (heading.startsWith("### ") && currentMain) {
        currentMain.subItems.push(cleanHeading);
      }
    });

    return result;
  };

  return (
    <nav className="hidden md:block">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col max-h-[calc(100vh-12rem)] overflow-y-auto">
          {type === "menu" && (
            <div className="space-y-2">
              {processHeadings(contents).map((item, index) => (
                <div key={index} className="space-y-1">
                  <Link
                    href={`${path}/#${kababify(item.text)}`}
                    className="block font-medium hover:text-primary transition-colors"
                  >
                    {item.text}
                  </Link>
                  {item.subItems.length > 0 && (
                    <ul className="pl-4 space-y-1">
                      {item.subItems.map((subItem, subIndex) => (
                        <li key={subIndex} className="list-disc list-inside">
                          <Link
                            href={`${path}/#${kababify(subItem)}`}
                            className="text-sm hover:text-primary transition-colors"
                          >
                            {subItem}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
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
    </nav>
  );
}
