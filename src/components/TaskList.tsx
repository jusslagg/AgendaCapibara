import type { Task } from "@/types/task";
import { EmptyState } from "./EmptyState";
import { TaskCard } from "./TaskCard";

export function TaskList({ tasks, completed = false }: { tasks: Task[]; completed?: boolean }) {
  if (!tasks.length) return <EmptyState completed={completed} />;
  return <div className="grid gap-4 xl:grid-cols-2">{tasks.map((task) => <TaskCard key={task.id} task={task} />)}</div>;
}
