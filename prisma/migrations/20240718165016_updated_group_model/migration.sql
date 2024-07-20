/*
  Warnings:

  - You are about to drop the column `grpupId` on the `User` table. All the data in the column will be lost.
  - Added the required column `CreatedBy` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_grpupId_fkey";

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "CreatedBy" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "grpupId",
ADD COLUMN     "groupId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;
