-- CreateTable
CREATE TABLE "JournalCategory" (
    "journalId" UUID NOT NULL,
    "categoryId" UUID NOT NULL,

    CONSTRAINT "JournalCategory_pkey" PRIMARY KEY ("journalId","categoryId")
);

-- CreateTable
CREATE TABLE "_JournalCategories" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_JournalCategories_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_JournalCategories_B_index" ON "_JournalCategories"("B");

-- AddForeignKey
ALTER TABLE "JournalCategory" ADD CONSTRAINT "JournalCategory_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "Journal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalCategory" ADD CONSTRAINT "JournalCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JournalCategories" ADD CONSTRAINT "_JournalCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JournalCategories" ADD CONSTRAINT "_JournalCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "Journal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
