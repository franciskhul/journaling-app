-- CreateTable
CREATE TABLE "JWT_Denylist" (
    "id" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "JWT_Denylist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JWT_Denylist_token_key" ON "JWT_Denylist"("token");

-- CreateIndex
CREATE INDEX "JWT_Denylist_userId_idx" ON "JWT_Denylist"("userId");

-- CreateIndex
CREATE INDEX "JWT_Denylist_token_idx" ON "JWT_Denylist"("token");

-- AddForeignKey
ALTER TABLE "JWT_Denylist" ADD CONSTRAINT "JWT_Denylist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
