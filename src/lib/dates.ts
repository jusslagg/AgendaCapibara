export function formatDueDate(date: Date) {
  return new Intl.DateTimeFormat("es-AR", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(date);
}

export function hoursUntil(date: Date) { return (date.getTime() - Date.now()) / 3_600_000; }

export function isDueSoon(date: Date) {
  const hours = hoursUntil(date);
  return hours >= 0 && hours <= 48;
}

export function toDateTimeLocal(date: Date) {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16);
}
