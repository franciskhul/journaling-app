import { checkAuth } from "@/lib/next-auth/checkAuth";
import { JournalEntriesSkeleton } from "@/components/skeleton/journal-entries-skeleton";
import { Suspense } from "react";
import JournalEntriesList from "@/components/my-journal/journal-entries";

export default async function JournalEntriesPage({
  searchParams,
}: {
  searchParams: { month?: string; year?: string };
}) {
  const { user } = await checkAuth();

  if (!user?.id) {
    return <div>Not authenticated</div>;
  }

  const month = searchParams.month
    ? parseInt(searchParams.month)
    : new Date().getMonth();
  const year = searchParams.year
    ? parseInt(searchParams.year)
    : new Date().getFullYear();

  return (
    <div className="flex flex-col items-center mx-auto space-y-6 py-8 max-w-6xl ">
      <Suspense fallback={<JournalEntriesSkeleton />}>
        <JournalEntriesList userId={user.id} month={month} year={year} />
      </Suspense>
    </div>
  );
}
