/*
  Warnings:

  - You are about to drop the column `sessionId` on the `Driver` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Driver" DROP CONSTRAINT "Driver_sessionId_fkey";

-- AlterTable
ALTER TABLE "Driver" DROP COLUMN "sessionId";

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "creatorId" TEXT NOT NULL DEFAULT 'tempCreatorId',
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "_SessionDrivers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SessionDrivers_AB_unique" ON "_SessionDrivers"("A", "B");

-- CreateIndex
CREATE INDEX "_SessionDrivers_B_index" ON "_SessionDrivers"("B");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Driver"("privateId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SessionDrivers" ADD CONSTRAINT "_SessionDrivers_A_fkey" FOREIGN KEY ("A") REFERENCES "Driver"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SessionDrivers" ADD CONSTRAINT "_SessionDrivers_B_fkey" FOREIGN KEY ("B") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;
