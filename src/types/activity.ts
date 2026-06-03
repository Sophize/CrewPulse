export type ActivityType =
  | "completed"
  | "updated"
  | "learning"
  | "joined"
  | "status";

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  message: string;
  actor: string;
  timestamp: string;
}
