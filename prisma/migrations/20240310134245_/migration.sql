-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_creatorId_fkey";

-- CreateTable
CREATE TABLE "_SessionCreator" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SessionCreator_AB_unique" ON "_SessionCreator"("A", "B");

-- CreateIndex
CREATE INDEX "_SessionCreator_B_index" ON "_SessionCreator"("B");

-- AddForeignKey
ALTER TABLE "_SessionCreator" ADD CONSTRAINT "_SessionCreator_A_fkey" FOREIGN KEY ("A") REFERENCES "Driver"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SessionCreator" ADD CONSTRAINT "_SessionCreator_B_fkey" FOREIGN KEY ("B") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;
