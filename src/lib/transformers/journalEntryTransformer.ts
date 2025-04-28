// lib/transformers/journalEntryTransformer.ts
import { JournalEntry } from "@/types/journalEntry";

const READING_SPEED_WORDS_PER_MINUTE = 200;
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function transformJournalEntry(entry: {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  mood?: string;
  JournalEntryCategory: {
    category: {
      name: string;
    };
  }[];
}): JournalEntry {
  const wordCount = entry.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / READING_SPEED_WORDS_PER_MINUTE);
  const monthName = MONTH_NAMES[entry.createdAt.getMonth()];

  return {
    id: entry.id,
    title: entry.title,
    contentSummary: generateContentSummary(entry.content),
    content: entry.content,
    category: entry.JournalEntryCategory[0]?.category.name || "Uncategorized",
    createdAt: entry.createdAt,
    readingTime,
    mood: "neutral",
    month: monthName, // Added month field
  };
}

function generateContentSummary(content: string): string {
  const sentences = content.split(/(?<=[.!?])\s+/);
  const summary = sentences.slice(0, 2).join(" ");
  return summary.length > 150 ? summary.substring(0, 150) + "..." : summary;
}
