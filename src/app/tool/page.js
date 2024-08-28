import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

function ToolPage() {
  return (
    <div>
      <Header />
      <main className="container flex flex-col">
        <div>
          <Button>
            <Link href="/tool/leet-recorder" className="text-center">
              Leet-Recorder
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}

export default ToolPage;
