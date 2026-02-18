/*
  Warnings:

  - A unique constraint covering the columns `[email,batchId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Student_email_orgId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_batchId_key" ON "Student"("email", "batchId");
