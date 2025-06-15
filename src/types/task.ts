export type TaskStatus = "new" | "pending" | "done" | "failed";

export interface Task {
  id: string;
  title: string;
  desc: string;
  status: TaskStatus;
  createdAt: Date;
}
