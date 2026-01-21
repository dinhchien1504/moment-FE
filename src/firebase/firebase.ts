  // src/firebase/firebase.ts
  "use client";

  import { getApps, initializeApp } from "firebase/app";
  import { getMessaging, isSupported, Messaging } from "firebase/messaging";

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };

  const firebaseApp =
    getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

  // ✅ Messaging chỉ được tạo nếu môi trường hỗ trợ
  export const messagingPromise: Promise<Messaging | null> = (async () => {
    try {
      if (typeof window === "undefined") return null; // SSR an toàn
      const supported = await isSupported();
      if (!supported) {
        console.warn("⚠️ Trình duyệt không hỗ trợ Firebase Messaging.");
        return null;
      }
      const messaging = getMessaging(firebaseApp);
      return messaging;
    } catch (err) {
      console.error("❌ Lỗi khởi tạo Firebase Messaging:", err);
      return null;
    }
  })();
