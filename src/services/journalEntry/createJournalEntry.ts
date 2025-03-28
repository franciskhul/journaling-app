import type { TransactionClient } from "@/lib/types/prisma";
import type { PrismaClient } from "@prisma/client";

type JournlalEntryInput = {
  title: string;
  content: string;
  userId: string;
  categoryId: string;
};

export default async function createJournalEntry(
  journalEntryInput: JournlalEntryInput,
  tx: TransactionClient | PrismaClient
) {
  return await tx.journalEntry.create({
    data: {
      title: journalEntryInput.title,
      content: journalEntryInput.content,
      userId: journalEntryInput.userId,
      JournalEntryCategory: {
        create: {
          categoryId: journalEntryInput.categoryId,
        },
      },
    },
    include: {
      JournalEntryCategory: {
        include: {
          category: true,
        },
      },
    },
  });
}
