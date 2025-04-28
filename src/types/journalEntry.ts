export type JournalEntry = {
  id: string;
  title: string;
  contentSummary: string;
  content: string;
  category: string;
  createdAt: Date;
  readingTime: number; // in minutes
  mood?: string;
  month: string;
};

export type JournalEntriesResponse = {
  entries: JournalEntry[];
  totalCount: number;
};
