import { deleteToken, getToken } from "firebase/messaging";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { getFirebaseDb, getFirebaseMessaging } from "./firebase";

// Esta es la clave pública Web Push de CapiAgenda. Está diseñada para enviarse al navegador.
const FIREBASE_VAPID_PUBLIC_KEY = "BEVt5XruD2a9OoWlRIy7AZ1BK_lgRUDzdnfo4MR_E3eSJ5jgDRQ2Uync_Oh2SyXzL89URee7g9DhCuXEF8x1Qc8";

function tokenDocumentId(userId: string, token: string) {
  return `${userId}_${token.replaceAll("/", "_")}`.slice(0, 1200);
}

function decodeVapidKey(value: string) {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const decoded = atob((value + padding).replaceAll("-", "+").replaceAll("_", "/"));
  return Uint8Array.from(decoded, (character) => character.charCodeAt(0));
}

export async function enableNotifications(userId: string): Promise<void> {
  if (!("Notification" in window) || !("serviceWorker" in navigator)) {
    throw new Error("Este navegador no admite notificaciones push.");
  }
  if (!window.isSecureContext) {
    throw new Error("Las notificaciones requieren HTTPS. Probálas desde la app publicada en Vercel.");
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
    version: "3",
  });
  const configuredVapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY?.trim();
  const vapidKey = configuredVapidKey?.length === 87 ? configuredVapidKey : FIREBASE_VAPID_PUBLIC_KEY;

  const registration = await navigator.serviceWorker.register(`/firebase-messaging-sw.js?${config}`, {
    updateViaCache: "none",
  });
  await registration.update();
  const activeRegistration = await navigator.serviceWorker.ready;
  const currentSubscription = await activeRegistration.pushManager.getSubscription();
  if (!currentSubscription) {
    await activeRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: decodeVapidKey(vapidKey),
    });
  }
  const token = await getToken(messaging, {
    vapidKey,
    serviceWorkerRegistration: activeRegistration,
  });
  if (!token) throw new Error("No pudimos crear el token de notificaciones.");

  const tokenRef = doc(getFirebaseDb(), "pushTokens", tokenDocumentId(userId, token));
  await setDoc(tokenRef, {
    userId,
    token,
    platform: "web",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function disableNotifications(): Promise<void> {
  const messaging = await getFirebaseMessaging();
  if (messaging) await deleteToken(messaging);
}
