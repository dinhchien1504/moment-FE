// =============================
// 🔥 IMPORT FIREBASE SDK
// =============================
importScripts("https://www.gstatic.com/firebasejs/11.9.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.9.1/firebase-messaging-compat.js");

// =============================
// 🔧 INIT FIREBASE APP
// =============================
firebase.initializeApp({
  apiKey: "__API_KEY__",
  authDomain: "__AUTH_DOMAIN__",
  projectId: "__PROJECT_ID__",
  messagingSenderId: "__MESSAGING_SENDER_ID__",
  appId: "__APP_ID__",
});


// =============================
// 🔔 BACKGROUND FCM HANDLER
// =============================
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("📩 [firebase-messaging-sw.js] Background message:", payload);

  const { title, body, url } = payload.data;

  self.registration.showNotification(title, {
    body,
    data: { url }, // Dùng để redirect khi bấm
    icon: '/images/logo-removebg.192.png', // tuỳ chỉnh
  });
});

// =============================
// 🖱 CLICK VÀO THÔNG BÁO
// =============================
self.addEventListener("notificationclick", function(event) {
  const targetUrl = event.notification.data?.url || "/";
  event.notification.close();
  event.waitUntil(clients.openWindow(targetUrl));
});


