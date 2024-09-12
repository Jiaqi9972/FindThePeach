import { Skeleton } from "@/components/ui/skeleton";

export default function SekeletonPost() {
  return (
    <div className="flex flex-col gap-2 border-border border-b py-3">
      <Skeleton className="h-8 w-9/12" />
      <Skeleton className="h-5 w-1/4" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-5 w-1/3" />
    </div>
  );
}
