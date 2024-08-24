import { Book } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import Link from "next/link";
import { slugify } from "@/lib/posts";

export default function MenuSheet({ title, contents, path }) {
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
            key={slugify(content)}
            href={`${path}/#${slugify(content)}`}
            replace
          >
            {content}
          </Link>
        ))}
      </SheetContent>
    </Sheet>
  );
}
