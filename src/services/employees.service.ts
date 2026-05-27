import {
  MOCK_CURRENT_UPLOADS,
  MOCK_DEPT_MAP,
  MOCK_USERS,
} from "@/mock";
import type { EmployeeRow } from "@/features/admin/components/EmployeesTable";
import type { UploadStatus, User } from "@/types";

export interface EmployeesResult {
  rows: EmployeeRow[];
  users: User[];
  adminCount: number;
  employeeCount: number;
  totalUsers: number;
}

export async function getEmployees(): Promise<EmployeesResult> {
  const rows = MOCK_USERS.filter((user) => user.role === "EMPLOYEE").map(
    (user) => {
      const upload = MOCK_CURRENT_UPLOADS.find((u) => u.userId === user.id);
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: MOCK_DEPT_MAP[user.id] ?? "Unknown",
        currentStatus: (upload?.status ?? "MISSING") as UploadStatus,
        createdAt: user.createdAt,
      };
    },
  );

  return Promise.resolve({
    rows,
    users: MOCK_USERS,
    adminCount: MOCK_USERS.filter((user) => user.role === "ADMIN").length,
    employeeCount: rows.length,
    totalUsers: MOCK_USERS.length,
  });
}
