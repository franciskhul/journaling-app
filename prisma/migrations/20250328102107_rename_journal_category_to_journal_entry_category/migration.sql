/*
  Warnings:

  - You are about to drop the `JournalCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "JournalCategory" DROP CONSTRAINT "JournalCategory_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "JournalCategory" DROP CONSTRAINT "JournalCategory_journalId_fkey";

-- DropTable
DROP TABLE "JournalCategory";

-- CreateTable
CREATE TABLE "JournalEntryCategory" (
    "journalId" UUID NOT NULL,
    "categoryId" UUID NOT NULL,

    CONSTRAINT "JournalEntryCategory_pkey" PRIMARY KEY ("journalId","categoryId")
);

-- AddForeignKey
ALTER TABLE "JournalEntryCategory" ADD CONSTRAINT "JournalEntryCategory_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "JournalEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalEntryCategory" ADD CONSTRAINT "JournalEntryCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
