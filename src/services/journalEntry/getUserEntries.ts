// services/journal/getEntriesByMonth.ts
import { db } from "@/lib/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import type { JournalEntriesResponse } from "@/types/journalEntry";
import { transformJournalEntry } from "@/lib/transformers/journalEntryTransformer";

export async function getJournalEntriesByMonth(
  userId: string,
  month: number,
  year: number
): Promise<JournalEntriesResponse> {
  try {
    // Validate month input
    if (month < 0 || month > 11) {
      throw new Error("Month must be between 0 and 11");
    }

    // Create date range
    const startDate = new Date(year, month, 1, 0, 0, 0, 0);
    const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);

    const [entries, totalCount] = await Promise.all([
      db.journalEntry.findMany({
        where: {
          userId,
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          JournalEntryCategory: {
            select: {
              category: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      db.journalEntry.count({
        where: {
          userId,
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
    ]);

    return {
      entries: entries.map(transformJournalEntry),
      totalCount,
    };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      console.error("[JOURNAL_SERVICE_ERROR]", error);
      throw new Error("Failed to fetch journal entries");
    }
    throw error;
  }
}
