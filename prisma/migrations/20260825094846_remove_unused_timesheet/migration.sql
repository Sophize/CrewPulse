/*
  Warnings:

  - You are about to drop the `Timesheet` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Timesheet" DROP CONSTRAINT "Timesheet_userId_fkey";

-- DropTable
DROP TABLE "Timesheet";
