import { PageHeading } from "@/components/PageHeading";
import { TaskForm } from "@/components/TaskForm";

export default function NewTaskPage() {
  return <main className="mx-auto max-w-4xl px-5 pb-10 pt-4 sm:px-8 sm:pt-8"><PageHeading eyebrow="Un paso a la vez" title="Nueva tarea" description="Poné una fecha realista y dejá que CapiAgenda cuide el resto." /><TaskForm /></main>;
}
