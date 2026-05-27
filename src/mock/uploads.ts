import type { UploadRow } from "@/types";
import { MOCK_USERS_BY_ID, MOCK_DEPT_MAP } from "./users";

// Week label helper — used to keep week strings consistent.
const W21 = "May 19 – 25";
const W20 = "May 12 – 18";
const W19 = "May 5 – 11";

// Builds a full UploadRow from the minimal fields needed.
// This mirrors what a real API route would return after a Prisma
// findMany with `include: { user: true }`.
function makeUpload(
  id: string,
  userId: string,
  fileName: string,
  uploadedAt: string,
  status: UploadRow["status"],
  weekLabel: string,
  fileSizeBytes?: number,
): UploadRow {
  const user = MOCK_USERS_BY_ID[userId]!;
  return {
    id,
    fileName,
    uploadedAt,
    status,
    userId,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    department: MOCK_DEPT_MAP[userId] ?? "Unknown",
    weekLabel,
    fileSizeBytes,
  };
}

export const MOCK_UPLOADS: UploadRow[] = [
  // ── Week 21 (current week) ─────────────────────────────────────

  // Engineering — 2 UPDATED, 1 LATE, 1 PENDING
  makeUpload(
    "upld_001",
    "clx0user000001",
    "timesheet_priya_w21.xlsx",
    "2025-05-27T09:12:00.000Z",
    "UPDATED",
    W21,
    49_152,
  ),
  makeUpload(
    "upld_002",
    "clx0user000002",
    "week21_ravi.csv",
    "2025-05-27T09:24:00.000Z",
    "UPDATED",
    W21,
    12_288,
  ),
  makeUpload(
    "upld_003",
    "clx0user000003",
    "lena_timesheet_may.xlsx",
    "2025-05-27T19:44:00.000Z",
    "LATE",
    W21,
    61_440,
  ),
  // Omar — PENDING (no file yet this week)
  makeUpload("upld_004", "clx0user000004", "", "", "PENDING", W21),

  // Design — 1 UPDATED, 1 LATE
  makeUpload(
    "upld_005",
    "clx0user000005",
    "sneha_w21.xlsx",
    "2025-05-27T18:55:00.000Z",
    "LATE",
    W21,
    38_912,
  ),
  makeUpload(
    "upld_006",
    "clx0user000006",
    "carlos_timesheet.xlsx",
    "2025-05-27T08:30:00.000Z",
    "UPDATED",
    W21,
    55_296,
  ),

  // Marketing — 1 MISSING, 1 PENDING
  makeUpload("upld_007", "clx0user000007", "", "", "MISSING", W21),
  makeUpload("upld_008", "clx0user000008", "", "", "PENDING", W21),

  // Sales — 1 UPDATED, 1 MISSING
  makeUpload(
    "upld_009",
    "clx0user000009",
    "arjun_w21.csv",
    "2025-05-27T10:05:00.000Z",
    "UPDATED",
    W21,
    9_216,
  ),
  makeUpload("upld_010", "clx0user000010", "", "", "MISSING", W21),

  // ── Week 20 (prior week — all submitted) ───────────────────────
  makeUpload(
    "upld_011",
    "clx0user000001",
    "timesheet_priya_w20.xlsx",
    "2025-05-20T09:05:00.000Z",
    "UPDATED",
    W20,
    47_104,
  ),
  makeUpload(
    "upld_012",
    "clx0user000002",
    "week20_ravi.csv",
    "2025-05-21T17:58:00.000Z",
    "LATE",
    W20,
    11_264,
  ),
  makeUpload(
    "upld_013",
    "clx0user000003",
    "lena_may12.xlsx",
    "2025-05-19T08:50:00.000Z",
    "UPDATED",
    W20,
    59_392,
  ),
  makeUpload(
    "upld_014",
    "clx0user000004",
    "omar_w20.xlsx",
    "2025-05-19T14:22:00.000Z",
    "UPDATED",
    W20,
    43_008,
  ),
  makeUpload(
    "upld_015",
    "clx0user000005",
    "sneha_w20.xlsx",
    "2025-05-19T09:15:00.000Z",
    "UPDATED",
    W20,
    37_888,
  ),
  makeUpload(
    "upld_016",
    "clx0user000007",
    "divya_w20.xlsx",
    "2025-05-20T10:30:00.000Z",
    "UPDATED",
    W20,
    28_672,
  ),
  makeUpload(
    "upld_017",
    "clx0user000009",
    "arjun_w20.csv",
    "2025-05-19T11:00:00.000Z",
    "UPDATED",
    W20,
    8_192,
  ),

  // ── Week 19 (two weeks ago — some missing) ─────────────────────
  makeUpload(
    "upld_018",
    "clx0user000001",
    "timesheet_priya_w19.xlsx",
    "2025-05-12T09:10:00.000Z",
    "UPDATED",
    W19,
    46_080,
  ),
  makeUpload("upld_019", "clx0user000007", "", "", "MISSING", W19),
  makeUpload("upld_020", "clx0user000010", "", "", "MISSING", W19),
];

// Most-recent upload per employee (week 21 only).
export const MOCK_CURRENT_UPLOADS = MOCK_UPLOADS.filter(
  (u) => u.weekLabel === W21,
);
