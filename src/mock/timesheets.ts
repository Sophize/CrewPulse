import type { TimesheetRow, WeekSummary } from "@/types";
import { MOCK_USERS_BY_ID, MOCK_DEPT_MAP } from "./users";
import { MOCK_CURRENT_UPLOADS } from "./uploads";

// ISO dates for each working day of week 21.
const WEEK_21_DAYS = [
  "2025-05-19", // Monday
  "2025-05-20", // Tuesday
  "2025-05-21", // Wednesday
  "2025-05-22", // Thursday
  "2025-05-23", // Friday
];

const WEEK_START = "2025-05-19";
const WEEK_END = "2025-05-25";
const WEEK_LABEL = "May 19 – 25";

// Builds a TimesheetRow from a simple hours array (Mon–Fri).
// null in the array means no entry for that day.
function makeRow(userId: string, hoursPerDay: (number | null)[]): TimesheetRow {
  const user = MOCK_USERS_BY_ID[userId]!;
  const upload = MOCK_CURRENT_UPLOADS.find((u) => u.userId === userId);
  const days = WEEK_21_DAYS.map((date, i) => ({
    date,
    hours: hoursPerDay[i] ?? null,
  }));
  const filledHours = hoursPerDay.filter((h): h is number => h !== null);
  const totalHours =
    filledHours.length > 0 ? filledHours.reduce((sum, h) => sum + h, 0) : null;

  return {
    userId,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    department: MOCK_DEPT_MAP[userId] ?? "Unknown",
    weekStart: WEEK_START,
    weekEnd: WEEK_END,
    weekLabel: WEEK_LABEL,
    days,
    totalHours,
    status: upload?.status ?? "MISSING",
  };
}

// ── Engineering ───────────────────────────────────────────────────
const rowPriya = makeRow("clx0user000001", [8, 8, 9, 8, 7]); // 40h UPDATED
const rowRavi = makeRow("clx0user000002", [8, 8, 8, 8, 8]); // 40h UPDATED
const rowLena = makeRow("clx0user000003", [7, 9, 8, 9, 7]); // 40h LATE
const rowOmar = makeRow("clx0user000004", [null, null, null, null, null]); // PENDING

// ── Design ────────────────────────────────────────────────────────
const rowSneha = makeRow("clx0user000005", [8, 8, 7, 9, 8]); // 40h LATE
const rowCarlos = makeRow("clx0user000006", [8, 8, 8, 8, 8]); // 40h UPDATED

// ── Marketing ─────────────────────────────────────────────────────
const rowDivya = makeRow("clx0user000007", [null, null, null, null, null]); // MISSING
const rowAisha = makeRow("clx0user000008", [null, null, null, null, null]); // PENDING

// ── Sales ─────────────────────────────────────────────────────────
const rowArjun = makeRow("clx0user000009", [9, 8, 9, 8, 6]); // 40h UPDATED
const rowSofia = makeRow("clx0user000010", [null, null, null, null, null]); // MISSING

export const MOCK_TIMESHEETS: TimesheetRow[] = [
  rowPriya,
  rowRavi,
  rowLena,
  rowOmar,
  rowSneha,
  rowCarlos,
  rowDivya,
  rowAisha,
  rowArjun,
  rowSofia,
];

// Week summary card data — computed from the rows above.
const allHours = MOCK_TIMESHEETS.flatMap((r) =>
  r.days.map((d) => d.hours).filter((h): h is number => h !== null),
);
const totalLogged = allHours.reduce((s, h) => s + h, 0);
const employeesWithHours = MOCK_TIMESHEETS.filter((r) => r.totalHours !== null);
const avgHours =
  employeesWithHours.length > 0 ? totalLogged / employeesWithHours.length : 0;
const exceptions = MOCK_TIMESHEETS.filter(
  (r) => r.totalHours !== null && (r.totalHours > 45 || r.totalHours < 35),
).length;

export const MOCK_WEEK_SUMMARY: WeekSummary = {
  weekLabel: WEEK_LABEL,
  totalHoursLogged: totalLogged,
  averageHoursPerEmployee: Math.round(avgHours * 10) / 10,
  exceptionCount: exceptions,
  employeeCount: MOCK_TIMESHEETS.length,
};
