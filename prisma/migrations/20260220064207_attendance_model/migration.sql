/*
  Warnings:

  - You are about to drop the column `markedBy` on the `Attendance` table. All the data in the column will be lost.
  - Added the required column `batchId` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "markedBy",
ADD COLUMN     "batchId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Attendance_batchId_idx" ON "Attendance"("batchId");

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
