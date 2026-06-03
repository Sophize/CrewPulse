export type UserRole = "ADMIN" | "EMPLOYEE";

export type TaskStatus = "NO_TASKS" | "IN_PROGRESS" | "COMPLETED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;

  taskStatus: TaskStatus;
  currentLearning: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
