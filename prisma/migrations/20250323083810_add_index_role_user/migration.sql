-- DropIndex
DROP INDEX "User_id_idx";

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");
