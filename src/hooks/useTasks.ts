"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { subscribeToTasks } from "@/lib/tasks";
import type { Task, TaskStatus } from "@/types/task";

export function useTasks(status: TaskStatus) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    return subscribeToTasks(user.uid, status, (items) => {
      setTasks(items); setLoading(false); setError("");
    }, (cause) => { setError(cause.message); setLoading(false); });
  }, [status, user]);
  return { tasks, loading, error };
}
