import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
  type Unsubscribe,
} from "firebase/firestore";
import { getFirebaseDb } from "./firebase";
import type { Task, TaskInput, TaskStatus } from "@/types/task";

export function subscribeToTasks(
  userId: string,
  status: TaskStatus,
  onData: (tasks: Task[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const taskQuery = query(
    collection(getFirebaseDb(), "tasks"),
    where("userId", "==", userId),
    where("status", "==", status),
    orderBy("dueDate", "asc"),
  );
  return onSnapshot(taskQuery, (snapshot) => {
    onData(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Task));
  }, onError);
}

export async function getTask(taskId: string): Promise<Task | null> {
  const snapshot = await getDoc(doc(getFirebaseDb(), "tasks", taskId));
  return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as Task) : null;
}

export async function createTask(userId: string, input: TaskInput) {
  return addDoc(collection(getFirebaseDb(), "tasks"), {
    userId,
    title: input.title.trim(),
    description: input.description?.trim() || "",
    dueDate: Timestamp.fromDate(input.dueDate),
    priority: input.priority,
    status: "pending",
    remind48h: input.remind48h,
    notified48h: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateTask(taskId: string, input: TaskInput, previousDueDate: Date) {
  const dueDateChanged = input.dueDate.getTime() !== previousDueDate.getTime();
  return updateDoc(doc(getFirebaseDb(), "tasks", taskId), {
    title: input.title.trim(),
    description: input.description?.trim() || "",
    dueDate: Timestamp.fromDate(input.dueDate),
    priority: input.priority,
    remind48h: input.remind48h,
    ...(dueDateChanged ? { notified48h: false } : {}),
    updatedAt: serverTimestamp(),
  });
}

export async function setTaskCompleted(taskId: string, completed: boolean) {
  return updateDoc(doc(getFirebaseDb(), "tasks", taskId), {
    status: completed ? "completed" : "pending",
    updatedAt: serverTimestamp(),
  });
}

export async function removeTask(taskId: string) {
  return deleteDoc(doc(getFirebaseDb(), "tasks", taskId));
}
