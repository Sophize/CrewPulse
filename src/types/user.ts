export type UserRole = "ADMIN" | "EMPLOYEE";

export type TaskStatus = "NO_TASKS" | "IN_PROGRESS" | "COMPLETED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;

  taskStatus: TaskStatus;
  currentLearning: string | null;
  learningDetails: string | null;
  learningStatus: string | null;

  createdAt: string;
  updatedAt: string;
}
