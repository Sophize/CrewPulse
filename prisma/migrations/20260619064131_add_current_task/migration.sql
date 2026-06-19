/*
  Warnings:

  - The values [NO_TASKS] on the enum `TaskStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TaskStatus_new" AS ENUM ('BLOCKED', 'IN_PROGRESS', 'COMPLETED');
ALTER TABLE "public"."User" ALTER COLUMN "taskStatus" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "taskStatus" TYPE "TaskStatus_new" USING ("taskStatus"::text::"TaskStatus_new");
ALTER TYPE "TaskStatus" RENAME TO "TaskStatus_old";
ALTER TYPE "TaskStatus_new" RENAME TO "TaskStatus";
DROP TYPE "public"."TaskStatus_old";
ALTER TABLE "User" ALTER COLUMN "taskStatus" SET DEFAULT 'BLOCKED';
COMMIT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "currentTask" TEXT,
ALTER COLUMN "taskStatus" SET DEFAULT 'BLOCKED';
