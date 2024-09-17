import { Card } from "@/components/ui/card";

function ToolPage() {
  return (
    <main className="container min-h-[calc(100vh-10rem)] flex flex-col gap-8">
      <div className="mt-8 flex flex-col md:flex-row  gap-8">
        <Card className="p-8 flex flex-col items-center">
          <a href="https://leetcode-records.vercel.app/">Leetcode Records</a>
        </Card>
        <Card className="p-8 flex flex-col items-center">
          <a href="https://zippystarter.com/tools/shadcn-ui-theme-generator">
            Shadcn/ui theme generator
          </a>
        </Card>
        <Card className="p-8 flex flex-col items-center">
          <a href="https://placehold.jp/">Placeholder generator</a>
        </Card>
      </div>
      <div>
        <span>More tools to be continued...</span>
      </div>
    </main>
  );
}

export default ToolPage;
