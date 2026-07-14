import { FieldValue, Timestamp, type Firestore } from "firebase-admin/firestore";
import type { Messaging } from "firebase-admin/messaging";

export interface ReminderResult {
  checked: number;
  notified: number;
  skippedWithoutToken: number;
}

const MINUTE_MS = 60 * 1000;
const LEGACY_48H_MINUTES = 48 * 60;
const MAX_REMINDER_MINUTES = 30 * 24 * 60;

type ReminderTask = {
  userId: string;
  title: string;
  dueDate: Timestamp;
  reminderEnabled?: boolean;
  reminderMinutes?: number;
  reminderSentAt?: Timestamp | null;
  remind48h?: boolean;
  notified48h?: boolean;
};

export function reminderLeadMinutes(task: ReminderTask): number {
  if (Number.isFinite(task.reminderMinutes) && task.reminderMinutes! >= 60) {
    return Math.min(Math.round(task.reminderMinutes!), MAX_REMINDER_MINUTES);
  }
  return LEGACY_48H_MINUTES;
}

export function shouldSendReminder(task: ReminderTask, nowMillis: number): boolean {
  const enabled = task.reminderEnabled ?? task.remind48h ?? false;
  const alreadySent = Boolean(task.reminderSentAt) || task.notified48h === true;
  const dueMillis = task.dueDate.toMillis();
  return enabled && !alreadySent && dueMillis > nowMillis && dueMillis - reminderLeadMinutes(task) * MINUTE_MS <= nowMillis;
}

function formatLeadTime(minutes: number): string {
  if (minutes % (24 * 60) === 0) {
    const days = minutes / (24 * 60);
    return `${days} ${days === 1 ? "día" : "días"}`;
  }
  const hours = Math.round(minutes / 60);
  return `${hours} ${hours === 1 ? "hora" : "horas"}`;
}

export async function sendTaskReminders(db: Firestore, messaging: Messaging): Promise<ReminderResult> {
  const now = Timestamp.now();
  const limit = Timestamp.fromMillis(now.toMillis() + MAX_REMINDER_MINUTES * MINUTE_MS);
  const tasks = await db.collection("tasks")
    .where("status", "==", "pending")
    .where("dueDate", ">", now)
    .where("dueDate", "<=", limit)
    .get();

  const dueTasks = tasks.docs.filter((taskDoc) => shouldSendReminder(taskDoc.data() as ReminderTask, now.toMillis()));
  const result: ReminderResult = { checked: dueTasks.length, notified: 0, skippedWithoutToken: 0 };

  for (const taskDoc of dueTasks) {
    const task = taskDoc.data() as ReminderTask;
    const leadTime = formatLeadTime(reminderLeadMinutes(task));
    const tokensSnapshot = await db.collection("pushTokens").where("userId", "==", task.userId).get();
    const tokenDocs = tokensSnapshot.docs.filter((tokenDoc) => typeof tokenDoc.data().token === "string");

    if (!tokenDocs.length) {
      result.skippedWithoutToken += 1;
      continue;
    }

    let delivered = false;
    for (let offset = 0; offset < tokenDocs.length; offset += 500) {
      const chunk = tokenDocs.slice(offset, offset + 500);
      const response = await messaging.sendEachForMulticast({
        tokens: chunk.map((tokenDoc) => tokenDoc.data().token as string),
        data: { taskId: taskDoc.id, url: `/tasks/${taskDoc.id}/edit`, title: "✦ Recordatorio PrismAgenda", body: `Faltan ${leadTime} para: ${task.title}` },
        webpush: { headers: { Urgency: "high" } },
      });
      delivered ||= response.successCount > 0;

      const invalidTokens = response.responses
        .map((item, index) => ({ code: item.error?.code, ref: chunk[index].ref }))
        .filter(({ code }) => code === "messaging/registration-token-not-registered" || code === "messaging/invalid-registration-token");
      if (invalidTokens.length) {
        const cleanup = db.batch();
        invalidTokens.forEach(({ ref }) => cleanup.delete(ref));
        await cleanup.commit();
      }
    }

    if (delivered) {
      await taskDoc.ref.update({ reminderSentAt: FieldValue.serverTimestamp(), notified48h: true, updatedAt: FieldValue.serverTimestamp() });
      result.notified += 1;
    }
  }

  return result;
}

/** Backwards-compatible export for any external caller using the old name. */
export const send48hTaskReminders = sendTaskReminders;
