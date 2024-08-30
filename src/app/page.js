import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Header />
      <main className="container flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] gap-8 text-center">
        <h1 className="text-3xl">Hello, I'm Jackie!</h1>
        <span className="text-2xl">
          A full-stack developer with passion to build interesting applcations.
        </span>
        <span className="text-xl">
          This is my personal blog to post some articles and implement some
          useful tools.
        </span>
        <Button variant="secondary">
          <Link href="/posts">Start to read...</Link>
        </Button>
      </main>
      <Footer />
    </div>
  );
}
