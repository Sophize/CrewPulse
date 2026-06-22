export type UserRole = "ADMIN" | "EMPLOYEE";

export type TaskStatus = "BLOCKED" | "IN_PROGRESS" | "COMPLETED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;

  taskStatus: TaskStatus;
  currentLearning: string | null;
  learningDetails: string | null;
  learningStatus: string | null;
  currentTask: string | null;
  timesheetUrl: string | null;
  timesheetUpdatedAt: string | null;

  createdAt: string;
  updatedAt: string;
}
