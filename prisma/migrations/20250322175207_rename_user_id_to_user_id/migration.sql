/*
  Warnings:

  - You are about to drop the column `user_id` on the `Journal` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Journal` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Journal" DROP CONSTRAINT "Journal_user_id_fkey";

-- DropIndex
DROP INDEX "Journal_user_id_idx";

-- AlterTable
ALTER TABLE "Journal" DROP COLUMN "user_id",
ADD COLUMN     "userId" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "Journal_userId_idx" ON "Journal"("userId");

-- AddForeignKey
ALTER TABLE "Journal" ADD CONSTRAINT "Journal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
