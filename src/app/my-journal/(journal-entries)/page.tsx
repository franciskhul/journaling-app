import { checkAuth } from "@/lib/next-auth/checkAuth";
import { JournalEntriesSkeleton } from "@/components/skeleton/journal-entries-skeleton";
import { Suspense } from "react";
import JournalEntriesList from "@/components/my-journal/journal-entries";
import { redirect } from "next/navigation";

export default async function JournalEntriesPage({
  searchParams,
}: {
  searchParams: { month?: string; year?: string };
}) {
  const { user } = await checkAuth();

  if (!user?.id)
    redirect(
      "/auth/login?callbackUrl=" + encodeURIComponent(window.location.pathname)
    );

  const params = await searchParams;

  const month = params.month ? parseInt(params.month) : new Date().getMonth();
  const year = params.year ? parseInt(params.year) : new Date().getFullYear();

  return (
    <div className="flex flex-col items-center mx-auto space-y-6 py-8 max-w-6xl ">
      <Suspense fallback={<JournalEntriesSkeleton />}>
        <JournalEntriesList userId={user.id} month={month} year={year} />
      </Suspense>
    </div>
  );
}
