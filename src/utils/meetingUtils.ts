export type MeetingFrequency = "DAILY" | "WEEKLY" | "MONTHLY";

export function convertClientTimeToIST(timeStr: string, fromTimeZone: string): string {
  if (!timeStr) return "";
  const parts = timeStr.split(":");
  if (parts.length < 2) return timeStr;
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  if (isNaN(hours) || isNaN(minutes)) return timeStr;

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");

  const isoLocalStr = `${year}-${month}-${day}T${hh}:${mm}:00`;

  try {
    const targetDate = new Date(
      new Date(isoLocalStr).toLocaleString("en-US", { timeZone: fromTimeZone }),
    );
    const utcDate = new Date(
      new Date(isoLocalStr).toLocaleString("en-US", { timeZone: "UTC" }),
    );
    const offsetDiffMs = targetDate.getTime() - utcDate.getTime();
    const realUtcTime = new Date(`${isoLocalStr}Z`).getTime() - offsetDiffMs;

    return new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date(realUtcTime));
  } catch (err) {
    console.error("Timezone conversion error:", err);
    return timeStr;
  }
}

export function getOrdinalSuffix(date: number) {
  if (date >= 11 && date <= 13) {
    return "th";
  }

  switch (date % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

export function formatDate(dateStr: string) {
  const d = new Date(dateStr);

  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
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

  const nowIST = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
  );

  const formatLabel = (d: Date) => {
    const todayIST = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
    );
    const tomorrowIST = new Date(todayIST);
    tomorrowIST.setDate(tomorrowIST.getDate() + 1);

    const isSameDay = (a: Date, b: Date) =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();

    const timeLabel = `${String(meetHour).padStart(2, "0")}:${String(meetMin).padStart(2, "0")}`;

    if (isSameDay(d, todayIST)) return `Today, ${timeLabel}`;
    if (isSameDay(d, tomorrowIST)) return `Tomorrow, ${timeLabel}`;

    return (
      new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kolkata",
        weekday: "short",
        day: "numeric",
        month: "short",
      }).format(d) + `, ${timeLabel}`
    );
  };

  if (frequency === "DAILY") {
    const candidate = new Date(nowIST);
    candidate.setHours(meetHour, meetMin, 0, 0);
    if (candidate <= nowIST) {
      candidate.setDate(candidate.getDate() + 1);
    }
    return formatLabel(candidate);
  }

  if (frequency === "WEEKLY") {
    if (daysOfWeek.length === 0) return "No days set";
    const sortedDays = [...daysOfWeek].sort((a, b) => a - b);
    let nearest: Date | null = null;

    for (let offset = 0; offset < 8; offset++) {
      const candidate = new Date(nowIST);
      candidate.setDate(candidate.getDate() + offset);
      candidate.setHours(meetHour, meetMin, 0, 0);
      const dayOfWeek = candidate.getDay();

      if (sortedDays.includes(dayOfWeek)) {
        if (offset === 0 && candidate <= nowIST) continue;
        nearest = candidate;
        break;
      }
    }
    return nearest ? formatLabel(nearest) : "—";
  }

  if (frequency === "MONTHLY") {
    if (datesOfMonth.length === 0) return "No dates set";
    const sortedDates = [...datesOfMonth].sort((a, b) => a - b);
    let nearest: Date | null = null;

    for (let monthOffset = 0; monthOffset < 3; monthOffset++) {
      for (const dateNum of sortedDates) {
        const candidate = new Date(nowIST);
        candidate.setMonth(candidate.getMonth() + monthOffset);
        candidate.setDate(dateNum);
        candidate.setHours(meetHour, meetMin, 0, 0);

        if (candidate <= nowIST) continue;
        if (!nearest || candidate < nearest) nearest = candidate;
      }
      if (nearest) break;
    }
    return nearest ? formatLabel(nearest) : "—";
  }

  return "—";
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
