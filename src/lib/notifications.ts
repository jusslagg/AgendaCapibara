import { deleteToken, getToken } from "firebase/messaging";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { getFirebaseDb, getFirebaseMessaging } from "./firebase";

function tokenDocumentId(token: string) {
  return token.replaceAll("/", "_").slice(0, 1200);
}

export async function enableNotifications(userId: string): Promise<void> {
  if (!("Notification" in window) || !("serviceWorker" in navigator)) {
    throw new Error("Este navegador no admite notificaciones push.");
  }
  const permission = await Notification.requestPermission();
  if (permission !== "granted") throw new Error("Necesitamos tu permiso para activar los recordatorios.");

  const messaging = await getFirebaseMessaging();
  if (!messaging) throw new Error("Firebase Messaging no está disponible en este dispositivo.");
  const config = new URLSearchParams({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  });
  const registration = await navigator.serviceWorker.register(`/firebase-messaging-sw.js?${config}`);
  const token = await getToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration: registration,
  });
  if (!token) throw new Error("No pudimos crear el token de notificaciones.");

  const tokenRef = doc(getFirebaseDb(), "pushTokens", tokenDocumentId(token));
  const existing = await getDoc(tokenRef);
  await setDoc(tokenRef, {
    userId,
    token,
    platform: "web",
    ...(!existing.exists() ? { createdAt: serverTimestamp() } : {}),
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function disableNotifications(): Promise<void> {
  const messaging = await getFirebaseMessaging();
  if (messaging) await deleteToken(messaging);
}
