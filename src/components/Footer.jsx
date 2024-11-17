export default function Footer() {
  return (
    <footer className="h-16 relative z-20 flex items-center">
      <div className="container flex flex-col items-center justify-center">
        <span className="text-sm sm:text-base">
          Powered by <a href="https://nextjs.org/">Next.js</a>,{" "}
          <a href="https://vercel.com/">Vercel</a> and{" "}
          <a href="https://ui.shadcn.com/">shadcn/ui</a>
        </span>
      </div>
    </footer>
  );
}
