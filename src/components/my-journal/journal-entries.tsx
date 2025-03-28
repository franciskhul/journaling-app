import fetchJournalEntries from "@/lib/actions/journal-entries/fetchJournalEntries";
import { JournalEntryCard } from "./journal-entry";

export default async function JournalEntriesList({
  userId,
  month,
  year,
}: {
  userId: string;
  month: number;
  year: number;
}) {
  const { entries: journalEntries } = await fetchJournalEntries(
    userId,
    month,
    year
  );

  return (
    <>
      {journalEntries.map((entry) => (
        <JournalEntryCard journalEntry={entry} key={entry.id} />
      ))}
    </>
  );
}
