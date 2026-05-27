import type { User } from "@/types";

// 10 employees spread across Engineering, Design, Marketing, Sales
// + 1 admin. IDs use the same cuid-style format Prisma generates
// so swapping to real DB records later requires no code changes.

export const MOCK_USERS: User[] = [
  // ── Admin ──────────────────────────────────────────────────────
  {
    id: "clx0admin000001",
    name: "James Dorsey",
    email: "james.dorsey@crewpulse.io",
    role: "ADMIN",
    createdAt: "2024-01-08T09:00:00.000Z",
  },

  // ── Engineering (4 members) ────────────────────────────────────
  {
    id: "clx0user000001",
    name: "Priya Nair",
    email: "priya.nair@crewpulse.io",
    role: "EMPLOYEE",
    createdAt: "2024-01-12T09:00:00.000Z",
  },
  {
    id: "clx0user000002",
    name: "Ravi Kumar",
    email: "ravi.kumar@crewpulse.io",
    role: "EMPLOYEE",
    createdAt: "2024-03-03T09:00:00.000Z",
  },
  {
    id: "clx0user000003",
    name: "Lena Fischer",
    email: "lena.fischer@crewpulse.io",
    role: "EMPLOYEE",
    createdAt: "2024-05-21T09:00:00.000Z",
  },
  {
    id: "clx0user000004",
    name: "Omar Shaikh",
    email: "omar.shaikh@crewpulse.io",
    role: "EMPLOYEE",
    createdAt: "2024-07-15T09:00:00.000Z",
  },

  // ── Design (2 members) ─────────────────────────────────────────
  {
    id: "clx0user000005",
    name: "Sneha Iyer",
    email: "sneha.iyer@crewpulse.io",
    role: "EMPLOYEE",
    createdAt: "2024-02-19T09:00:00.000Z",
  },
  {
    id: "clx0user000006",
    name: "Carlos Vega",
    email: "carlos.vega@crewpulse.io",
    role: "EMPLOYEE",
    createdAt: "2024-09-02T09:00:00.000Z",
  },

  // ── Marketing (2 members) ──────────────────────────────────────
  {
    id: "clx0user000007",
    name: "Divya Sharma",
    email: "divya.sharma@crewpulse.io",
    role: "EMPLOYEE",
    createdAt: "2024-04-14T09:00:00.000Z",
  },
  {
    id: "clx0user000008",
    name: "Aisha Mensah",
    email: "aisha.mensah@crewpulse.io",
    role: "EMPLOYEE",
    createdAt: "2024-11-06T09:00:00.000Z",
  },

  // ── Sales (2 members) ──────────────────────────────────────────
  {
    id: "clx0user000009",
    name: "Arjun Mehta",
    email: "arjun.mehta@crewpulse.io",
    role: "EMPLOYEE",
    createdAt: "2025-04-07T09:00:00.000Z",
  },
  {
    id: "clx0user000010",
    name: "Sofia Ricci",
    email: "sofia.ricci@crewpulse.io",
    role: "EMPLOYEE",
    createdAt: "2025-05-01T09:00:00.000Z",
  },
];

// Lookup map — O(1) access by id anywhere in the app.
export const MOCK_USERS_BY_ID: Record<string, User> = Object.fromEntries(
  MOCK_USERS.map((u) => [u.id, u]),
);

// Convenience — employees only, admin excluded.
export const MOCK_EMPLOYEES = MOCK_USERS.filter((u) => u.role === "EMPLOYEE");

// Department assignment — kept here so mock data stays consistent.
// The real schema will add a department column to a Profile table.
export const MOCK_DEPT_MAP: Record<string, string> = {
  clx0user000001: "Engineering",
  clx0user000002: "Engineering",
  clx0user000003: "Engineering",
  clx0user000004: "Engineering",
  clx0user000005: "Design",
  clx0user000006: "Design",
  clx0user000007: "Marketing",
  clx0user000008: "Marketing",
  clx0user000009: "Sales",
  clx0user000010: "Sales",
};
