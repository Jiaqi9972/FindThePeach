import ShapeEffect from "@/components/ShapeEffect";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <main className="container flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] gap-8 text-center z-10 relative">
        <h1 className="text-3xl">Hello, I&apos;m Jackie!</h1>
        <span className="text-2xl">
          A full-stack developer with passion to build interesting applications!
        </span>
        <span className="text-xl">
          This is my personal blog to post some articles and implement some
          useful tools.
        </span>
        <Button variant="secondary">
          <Link href="/posts">Start to read...</Link>
        </Button>
      </main>
      <div className="absolute inset-0 z-0">
        <ShapeEffect count={20} sizes={[30, 60]} />
      </div>
    </>
  );
}
