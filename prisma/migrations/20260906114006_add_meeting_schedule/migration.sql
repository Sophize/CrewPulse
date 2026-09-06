-- CreateEnum
CREATE TYPE "MeetingFrequency" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY');

-- CreateTable
CREATE TABLE "MeetingSchedule" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "frequency" "MeetingFrequency" NOT NULL DEFAULT 'WEEKLY',
    "meetingTime" TEXT NOT NULL,
    "clientTimeZone" TEXT NOT NULL,
    "daysOfWeek" INTEGER[],
    "datesOfMonth" INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MeetingSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MeetingSchedule_projectId_idx" ON "MeetingSchedule"("projectId");

-- AddForeignKey
ALTER TABLE "MeetingSchedule" ADD CONSTRAINT "MeetingSchedule_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
