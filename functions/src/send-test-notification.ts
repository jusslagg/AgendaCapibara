import { cert, getApps, initializeApp, type ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";

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

  const db = getFirestore();
  const messaging = getMessaging();
  const snapshot = await db.collection("pushTokens").get();
  const tokenDocs = snapshot.docs.filter((item) => typeof item.data().token === "string" && item.data().token.length > 0);
  const uniqueTokenDocs = [...new Map(tokenDocs.map((item) => [item.data().token as string, item])).values()];

  if (!uniqueTokenDocs.length) {
    console.log("Prueba terminada: no hay dispositivos registrados.");
    return;
  }

  let accepted = 0;
  let failed = 0;
  let removed = 0;
  for (let offset = 0; offset < uniqueTokenDocs.length; offset += 500) {
    const chunk = uniqueTokenDocs.slice(offset, offset + 500);
    const title = "✦ Prueba de PrismAgenda";
    const body = "Este es un recordatorio de prueba. Si lo recibiste, las notificaciones funcionan correctamente.";
    const response = await messaging.sendEachForMulticast({
      tokens: chunk.map((item) => item.data().token as string),
      notification: { title, body },
      data: { url: "/settings", title, body, test: "true" },
      webpush: {
        headers: { Urgency: "high" },
        notification: {
          title,
          body,
          icon: "/prism-icon-192.png",
          badge: "/prism-icon-192.png",
          tag: "prismagenda-notification-test",
          renotify: true,
          data: { url: "/settings" },
        },
      },
    });

    accepted += response.successCount;
    failed += response.failureCount;
    const invalidDocs = response.responses
      .map((item, index) => ({ code: item.error?.code, ref: chunk[index].ref }))
      .filter(({ code }) => code === "messaging/registration-token-not-registered" || code === "messaging/invalid-registration-token");
    if (invalidDocs.length) {
      const cleanup = db.batch();
      invalidDocs.forEach(({ ref }) => cleanup.delete(ref));
      await cleanup.commit();
      removed += invalidDocs.length;
    }
  }

  console.log(`Prueba terminada: ${uniqueTokenDocs.length} dispositivos, ${accepted} aceptados, ${failed} fallidos, ${removed} tokens inválidos eliminados.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
