import type { Timestamp } from "firebase/firestore";

export type Priority = "low" | "medium" | "high";
export type TaskStatus = "pending" | "completed";

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  dueDate: Timestamp;
  priority: Priority;
  status: TaskStatus;
  remind48h: boolean;
  notified48h: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface TaskInput {
  title: string;
  description?: string;
  dueDate: Date;
  priority: Priority;
  remind48h: boolean;
}
