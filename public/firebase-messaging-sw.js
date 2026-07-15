/* global firebase */
importScripts("https://www.gstatic.com/firebasejs/11.10.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.10.0/firebase-messaging-compat.js");

const params = new URL(self.location.href).searchParams;
const config = {
  apiKey: params.get("apiKey"),
  authDomain: params.get("authDomain"),
  projectId: params.get("projectId"),
  storageBucket: params.get("storageBucket"),
  messagingSenderId: params.get("messagingSenderId"),
  appId: params.get("appId"),
};

if (config.apiKey && config.projectId) {
  firebase.initializeApp(config);
  const messaging = firebase.messaging();
  messaging.onBackgroundMessage((payload) => {
    // FCM displays messages with a notification payload automatically.
    // Keep this fallback only for older data-only messages.
    if (payload.notification) return;
    const title = payload.data?.title || "✦ Recordatorio PrismAgenda";
    const options = {
      body: payload.data?.body || "Tenés una tarea que necesita atención.",
      icon: "/prism-icon-192.png",
      badge: "/prism-icon-192.png",
      tag: payload.data?.taskId ? `task-${payload.data.taskId}` : "prismagenda-reminder",
      renotify: false,
      data: { url: payload.data?.url || "/dashboard" },
    };
    self.registration.showNotification(title, options);
  });
}

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = event.notification.data?.url || "/dashboard";
  event.waitUntil(clients.matchAll({ type: "window", includeUncontrolled: true }).then((windows) => {
    const existing = windows.find((windowClient) => new URL(windowClient.url).pathname === target);
    return existing ? existing.focus() : clients.openWindow(target);
  }));
});
