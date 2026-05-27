export type ActivityType = "upload" | "late" | "missing" | "joined" | "approved";

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  message: string;
  actor: string;
  timestamp: string;
}
