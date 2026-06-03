import type { EmployeeRow } from "@/features/admin/components/EmployeesTable";

export interface EmployeesResult {
  rows: EmployeeRow[];
}

export async function getEmployees(): Promise<EmployeesResult> {
  const res = await fetch("/api/employees");

  if (!res.ok) {
    throw new Error("Failed to fetch employees");
  }

  return res.json();
}