/*
  Warnings:

  - You are about to drop the `Fee` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Fee" DROP CONSTRAINT "Fee_studentId_fkey";

-- DropTable
DROP TABLE "Fee";

-- DropEnum
DROP TYPE "FeeStatus";
