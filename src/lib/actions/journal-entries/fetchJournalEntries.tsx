"use server";

import { getJournalEntriesByMonth } from "@/services/journalEntry/getUserEntries";

export default async function fetchJournalEntries(
  userId: string,
  month: number,
  year: number
) {
  return await getJournalEntriesByMonth(userId, month, year);
}
