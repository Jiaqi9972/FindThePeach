import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

function ToolPage() {
  return (
    <div>
      <Header />
      <main className="container min-h-[calc(100vh-10rem)] flex flex-col gap-8">
        <div className="mt-8 flex flex-col md:flex-row  gap-8">
          <Card className="p-8 flex flex-col items-center">
            <Link href="/tool/leet-recorder">Leet-Recorder</Link>
          </Card>
          <Card className="p-8 flex flex-col items-center">
            <a href="https://zippystarter.com/tools/shadcn-ui-theme-generator">
              Shadcn/ui theme generator
            </a>
          </Card>
        </div>
        <div>
          <span>More tools to be continued...</span>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ToolPage;
