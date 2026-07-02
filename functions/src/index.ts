import { FieldValue, Timestamp, type Firestore } from "firebase-admin/firestore";
import type { Messaging } from "firebase-admin/messaging";

export interface ReminderResult {
  checked: number;
  notified: number;
  skippedWithoutToken: number;
}

export async function send48hTaskReminders(db: Firestore, messaging: Messaging): Promise<ReminderResult> {
  const now = Timestamp.now();
  const limit = Timestamp.fromMillis(now.toMillis() + 48 * 60 * 60 * 1000);
  const tasks = await db.collection("tasks")
    .where("status", "==", "pending")
    .where("remind48h", "==", true)
    .where("notified48h", "==", false)
    .where("dueDate", "<=", limit)
    .get();

  const result: ReminderResult = { checked: tasks.size, notified: 0, skippedWithoutToken: 0 };

  for (const taskDoc of tasks.docs) {
    const task = taskDoc.data() as { userId: string; title: string };
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
        notification: {
          title: "🦫 Recordatorio capibara",
          body: `Te quedan menos de 48 horas para: ${task.title}`,
        },
        data: { taskId: taskDoc.id, url: `/tasks/${taskDoc.id}/edit` },
        webpush: { notification: { icon: "/icon-192.png", badge: "/icon-192.png" } },
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
      await taskDoc.ref.update({ notified48h: true, updatedAt: FieldValue.serverTimestamp() });
      result.notified += 1;
    }
  }

  return result;
}
