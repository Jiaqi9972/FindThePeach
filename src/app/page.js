import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ShapeEffect from "@/components/ShapeEffect";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative">
      {/* Header with z-20 to ensure it stays above ShapeEffect */}
      <header className="relative z-20">
        <Header />
      </header>

      {/* Main content with z-20 to ensure it stays above ShapeEffect */}
      <main className="container flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] gap-8 text-center z-20 relative">
        <h1 className="text-3xl">Hello, I&apos;m Jackie!</h1>
        <span className="text-2xl">
          A full-stack developer with passion to build interesting applications.
        </span>
        <span className="text-xl">
          This is my personal blog to post some articles and implement some
          useful tools.
        </span>
        <Button variant="secondary">
          <Link href="/posts">Start to read...</Link>
        </Button>
      </main>

      {/* ShapeEffect with z-10 to make sure it's behind the content */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <ShapeEffect count={20} sizes={[30, 60]} />
      </div>

      {/* Footer with z-20 to ensure it stays above ShapeEffect */}
      <footer className="relative z-15">
        <Footer />
      </footer>
    </div>
  );
}
