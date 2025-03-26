import { JournalEntryCard } from "@/components/my-journal/journal-entry";

export default function DashboardPage() {
  return (
    <JournalEntryCard
      id="entry-1"
      title="My Weekend Adventure"
      contentSummary="We explored the coastal trails and discovered a hidden beach with crystal clear waters..."
      // category="Travel"
      emotion="happy"
      date={new Date()}
      readingTime={5}
      // readingTime="5 min read"
    />
  );
}
