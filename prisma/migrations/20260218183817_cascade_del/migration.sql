-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_batchId_fkey";

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
