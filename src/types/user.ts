export type UserRole = "ADMIN" | "EMPLOYEE";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string; // ISO 8601 string — serialized from Prisma Date
}

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
