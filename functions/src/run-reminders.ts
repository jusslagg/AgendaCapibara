import { cert, getApps, initializeApp, type ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";
import { sendTaskReminders } from "./index.js";

function getServiceAccount(): ServiceAccount {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("Falta el secreto FIREBASE_SERVICE_ACCOUNT_JSON.");
  try {
    return JSON.parse(raw) as ServiceAccount;
  } catch {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON no contiene un JSON válido.");
  }
}

async function main() {
  if (!getApps().length) initializeApp({ credential: cert(getServiceAccount()) });
  const result = await sendTaskReminders(getFirestore(), getMessaging());
  console.log(`Revisión terminada: ${result.checked} tareas, ${result.notified} notificadas, ${result.skippedWithoutToken} sin token.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
