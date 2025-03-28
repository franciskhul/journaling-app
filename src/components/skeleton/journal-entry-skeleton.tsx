import { Skeleton } from "@/components/ui/skeleton";

export function JournalEntrySkeleton() {
  return (
    <div className="border-2 border-yellow-100 bg-yellow-50 rounded-lg w-full">
      <div className="flex">
        {/* Calendar date skeleton on left */}
        <div className="flex-shrink-0 pl-4 pt-4">
          <Skeleton className="h-16 w-16 rounded-lg" />
        </div>

        {/* Content skeleton on right */}
        <div className="flex-1 p-4 space-y-4">
          {/* Header section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-48 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>

          {/* Content section */}
          <div className="space-y-3">
            <Skeleton className="h-5 w-full rounded" />
            <Skeleton className="h-5 w-5/6 rounded" />
            <Skeleton className="h-5 w-4/6 rounded" />
          </div>

          {/* Footer section */}
          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-16 rounded" />
              </div>
              <div className="flex items-center gap-1">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-16 rounded" />
              </div>
            </div>

            <div className="flex gap-2">
              <Skeleton className="h-9 w-20 rounded-md" />
              <Skeleton className="h-9 w-20 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
