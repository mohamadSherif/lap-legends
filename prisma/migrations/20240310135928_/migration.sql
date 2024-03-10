/*
  Warnings:

  - You are about to drop the `_SessionCreator` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_SessionCreator" DROP CONSTRAINT "_SessionCreator_A_fkey";

-- DropForeignKey
ALTER TABLE "_SessionCreator" DROP CONSTRAINT "_SessionCreator_B_fkey";

-- AlterTable
ALTER TABLE "Driver" ADD COLUMN     "createdSessions" TEXT[];

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "creatorId" DROP DEFAULT;

-- DropTable
DROP TABLE "_SessionCreator";
