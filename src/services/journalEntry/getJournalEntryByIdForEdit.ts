// services/journal/getJournalEntryById.ts
import { db } from "@/lib/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Role } from "@prisma/client";
import { JournalEntryInput } from "@/lib/validations/journalEntry";

interface GetJournalEntryParams {
  journalEntryId: string;
  userId: string;
  userRole: Role;
}

export async function getJournalEntryByIdForEdit({
  journalEntryId,
  userId,
  userRole,
}: GetJournalEntryParams): Promise<JournalEntryInput> {
  try {
    // Fetch the entry with its first category
    const entry = await db.journalEntry.findUnique({
      where: { id: journalEntryId },
      include: {
        JournalEntryCategory: {
          select: {
            categoryId: true,
          },
          take: 1, // Only get the first category
        },
      },
    });

    // Check if entry exists
    if (!entry) {
      throw new Error("Journal entry not found");
    }

    // Check ownership (unless admin)
    if (userRole !== "ADMIN" && entry.userId !== userId) {
      throw new Error("Unauthorized access to journal entry");
    }

    // Extract the first category ID if it exists
    const categoryId = entry.JournalEntryCategory[0]?.categoryId || null;

    return {
      title: entry.title,
      content: entry.content,
      categoryId: categoryId || "",
    };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      console.error("[JOURNAL_ENTRY_SERVICE_ERROR]", error);
      throw new Error("Failed to fetch journal entry");
    }
    throw error;
  }
}
