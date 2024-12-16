/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Clicks` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "createdAtIndex";

-- AlterTable
ALTER TABLE "Clicks" DROP COLUMN "createdAt",
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "timestampIndex" ON "Clicks"("timestamp");
