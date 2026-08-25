export const queryKeys = {
  dashboardStats: ["dashboard", "stats"] as const,
  employees: ["employees"] as const,
  activityFeed: ["activity-feed"] as const,
  employeeStatus: ["employee-status"] as const,
  leaves: ["leaves"] as const,
  projects: ["projects"] as const,
  projectTasks: (projectId: string) => ["project-tasks", projectId] as const,
};
