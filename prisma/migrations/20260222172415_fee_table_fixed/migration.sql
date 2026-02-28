/*
  Warnings:

  - You are about to drop the column `year` on the `Fee` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentId,month,orgId]` on the table `Fee` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Fee_studentId_month_year_orgId_key";

-- AlterTable
ALTER TABLE "Fee" DROP COLUMN "year",
ALTER COLUMN "month" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Fee_studentId_month_orgId_key" ON "Fee"("studentId", "month", "orgId");
