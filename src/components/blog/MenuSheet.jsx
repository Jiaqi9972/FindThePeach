"use client";

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
import { useState } from "react";

export default function MenuSheet({ title, contents, path }) {
  const [open, setOpen] = useState(false);

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
    <Sheet open={open} onOpenChange={setOpen}>
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
        <div className="flex flex-col space-y-2 mt-4 overflow-y-auto pr-6">
          {processHeadings(contents).map((item, index) => (
            <div key={index} className="space-y-1">
              <Link
                href={`${path}/#${kababify(item.text)}`}
                className="block font-medium hover:text-primary transition-colors"
                onClick={() => setOpen(false)}
              >
                {item.text}
              </Link>
              {item.subItems.length > 0 && (
                <div className="pl-4 space-y-1">
                  {item.subItems.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      href={`${path}/#${kababify(subItem)}`}
                      className="block text-sm hover:text-primary transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      • {subItem}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
