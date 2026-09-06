import dayjs, { type Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);

export type MeetingFrequency = "DAILY" | "WEEKLY" | "MONTHLY";

export function convertClientTimeToIST(
  timeStr: string,
  fromTimeZone: string,
): string {
  if (!timeStr) return "";

  try {
    const [hour, minute] = timeStr.split(":").map(Number);

    const clientTime = dayjs()
      .tz(fromTimeZone)
      .hour(hour)
      .minute(minute)
      .second(0)
      .millisecond(0);

    return clientTime.tz("Asia/Kolkata").format("HH:mm");
  } catch (err) {
    console.error("Timezone conversion error:", err);
    return timeStr;
  }
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  return dayjs(dateStr).format("DD MMM YYYY");
}

export function statusColor(status: string) {
  switch (status) {
    case "COMPLETED":
      return "green";
    case "BLOCKED":
      return "red";
    case "IN_PROGRESS":
    default:
      return "blue";
  }
}

export function statusLabel(status: string) {
  switch (status) {
    case "COMPLETED":
      return "Completed";
    case "BLOCKED":
      return "Blocked";
    case "IN_PROGRESS":
    default:
      return "In Progress";
  }
}

export function frequencyLabel(frequency: MeetingFrequency) {
  switch (frequency) {
    case "DAILY":
      return "Daily";
    case "WEEKLY":
      return "Weekly";
    case "MONTHLY":
      return "Monthly";
    default:
      return frequency;
  }
}

export function getNextOccurrence(
  frequency: MeetingFrequency,
  daysOfWeek: number[],
  datesOfMonth: number[],
  meetingTime: string,
): string {
  if (!meetingTime) return "—";

  const timeParts = meetingTime.split(":").map(Number);
  if (timeParts.length < 2 || timeParts.some(isNaN)) return meetingTime;
  const [meetHour, meetMin] = timeParts;

  const nowIST = dayjs().tz("Asia/Kolkata");

  const applyTime = (d: Dayjs) =>
    d.hour(meetHour).minute(meetMin).second(0).millisecond(0);

  const formatLabel = (d: Dayjs) => {
    const todayIST = nowIST.startOf("day");
    const tomorrowIST = todayIST.add(1, "day");
    const candidateDay = d.startOf("day");

    const timeLabel = `${String(meetHour).padStart(2, "0")}:${String(meetMin).padStart(2, "0")}`;

    if (candidateDay.isSame(todayIST)) return `Today, ${timeLabel}`;
    if (candidateDay.isSame(tomorrowIST)) return `Tomorrow, ${timeLabel}`;

    return `${d.format("ddd, D MMM")}, ${timeLabel}`;
  };

  if (frequency === "DAILY") {
    let candidate = applyTime(nowIST);
    if (candidate.isSameOrBefore(nowIST)) {
      candidate = applyTime(nowIST.add(1, "day"));
    }
    return formatLabel(candidate);
  }

  if (frequency === "WEEKLY") {
    if (!daysOfWeek || daysOfWeek.length === 0) return "No days set";
    const sortedDays = [...daysOfWeek].sort((a, b) => a - b);

    for (let offset = 0; offset <= 7; offset++) {
      const candidate = applyTime(nowIST.add(offset, "day"));
      if (sortedDays.includes(candidate.day())) {
        if (offset === 0 && candidate.isSameOrBefore(nowIST)) continue;
        return formatLabel(candidate);
      }
    }
    return "—";
  }

  if (frequency === "MONTHLY") {
    if (!datesOfMonth || datesOfMonth.length === 0) return "No dates set";
    const sortedDates = [...datesOfMonth].sort((a, b) => a - b);

    for (let monthOffset = 0; monthOffset < 3; monthOffset++) {
      for (const dateNum of sortedDates) {
        const base = nowIST.add(monthOffset, "month").date(dateNum);
        if (base.date() !== dateNum) continue;

        const candidate = applyTime(base);
        if (candidate.isSameOrBefore(nowIST)) continue;

        return formatLabel(candidate);
      }
    }
    return "—";
  }

  return "—";
}
