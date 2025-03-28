import { JournalEntrySkeleton } from "./journal-entry-skeleton";

export function JournalEntriesSkeleton() {
  return (
    <div className="flex flex-col items-center mx-auto space-y-6 py-8 max-w-6xl w-full">
      {[...Array(3)].map((_, i) => (
        <JournalEntrySkeleton key={i} />
      ))}
    </div>
  );
}
