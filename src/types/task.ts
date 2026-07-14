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
  reminderEnabled: boolean;
  reminderMinutes: number;
  reminderSentAt?: Timestamp | null;
  /** Legacy fields kept while existing Firestore documents are migrated naturally. */
  remind48h?: boolean;
  notified48h?: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface TaskInput {
  title: string;
  description?: string;
  dueDate: Date;
  priority: Priority;
  reminderEnabled: boolean;
  reminderMinutes: number;
}
