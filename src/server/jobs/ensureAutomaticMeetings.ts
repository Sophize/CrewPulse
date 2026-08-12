import { prisma } from "@/lib/prisma";

async function ensureAutomaticMeetings() {
  const automaticSchedules = await prisma.meetingScheduleConfig.findMany({
    where: {
      automatic: true,
    },
  });

  for (const schedule of automaticSchedules) {
    const upcomingMeeting = await prisma.meetingSchedule.findFirst({
      where: {
        projectId: schedule.projectId,
        scheduledAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        scheduledAt: "asc",
      },
    });

    if (upcomingMeeting) {
      continue;
    }

    const nextMeetingTime = calculateNextMonday(schedule.meetingTime, schedule.clientTimeZone);

    await prisma.meetingSchedule.create({
      data: {
        projectId: schedule.projectId,
        clientTimeZone: schedule.clientTimeZone,
        scheduledAt: nextMeetingTime,
      },
    });
  }
}
