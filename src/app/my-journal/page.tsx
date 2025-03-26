import { JournalEntryCard } from "@/components/my-journal/journal-entry";
import { JournalEntry } from "./entries/[id]/page";

const entry: JournalEntry = {
  id: "1",
  title: "My Amazing Adventure in the Mountains",
  contentSummary:
    "The crisp morning air filled my lungs as I laced up my hiking boots...",
  content: `The crisp morning air filled my lungs as I laced up my hiking boots. Today was the day I'd conquer Eagle Peak Trail—a challenge I'd set for myself months ago. 

  As I ascended, the trees thinned, revealing panoramic views that made every aching muscle worth it. Halfway up, I met a curious marmot who seemed just as interested in me as I was in him. We shared a quiet moment, him nibbling on wildflowers, me catching my breath.
  
  The summit brought an unexpected rain shower, but rather than ruin the day, it created a rainbow that arched perfectly over the valley below. Nature's reward for perseverance.`,
  category: "Travel",
  createdAt: new Date("2023-11-15"),
  readingTime: 3,
  mood: "excited",
};

export default function DashboardPage() {
  return <JournalEntryCard journalEntry={entry} />;
}
