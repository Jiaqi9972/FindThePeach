"use client";

import { ArrowBigUp } from "lucide-react";
import { Button } from "./ui/button";

export default function ScrollToTop() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className="fixed bottom-4 right-4"
      onClick={scrollToTop}
    >
      <ArrowBigUp />
    </Button>
  );
}
