import { Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";

export default function MenuSheet({ title, contents, path }) {
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
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed top-24 right-8 md:hidden"
        >
          <Book />
        </Button>
      </SheetTrigger>

      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        {contents.map((content) => (
          <Link
            key={kababify(content)}
            href={`${path}/#${kababify(content)}`}
            replace
          >
            {content}
          </Link>
        ))}
      </SheetContent>
    </Sheet>
  );
}
