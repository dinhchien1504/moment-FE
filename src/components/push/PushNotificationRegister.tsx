"use client";

import { useEffect } from "react";
import { getToken } from "firebase/messaging";
import { messagingPromise } from "@/firebase/firebase";
import { useUserContext } from "@/context/user_context";
import { FetchClientPostApi } from "@/api/fetch_client_api";
import API from "@/api/api";

export const PushNotificationRegister = () => {
  const { user } = useUserContext();

  useEffect(() => {
    console.log("check_user: ", user);
    if (!user) return; // Chờ user có dữ liệu mới thực hiện

    const register = async () => {
      try {
        const permission = Notification.permission;

        if (permission === "denied") {
          console.warn(" Người dùng đã từ chối thông báo.");
          return;
        }

        if (permission !== "granted") {
          const newPermission = await Notification.requestPermission();
          console.log("🔔 Kết quả yêu cầu quyền:", newPermission);
          if (newPermission !== "granted") {
            console.warn("🔕 Người dùng chưa cấp quyền.");
            return;
          }
        }

        const messaging = await messagingPromise;
        if (!messaging) {
          console.error("❌ Messaging instance is null.");
          return;
        }

        const existingReg = await navigator.serviceWorker.getRegistration(
          "/firebase-messaging-sw.js"
        );

        const registration =
          existingReg ||
          (await navigator.serviceWorker.register("/firebase-messaging-sw.js"));

        console.log("✅ Service Worker đã được đăng ký:", registration);

        // Đợi SW active
        if (!registration.active) {
          console.log("⏳ Chờ kích hoạt Service Worker...");
          await new Promise((resolve) => {
            const sw = registration.installing || registration.waiting;
            if (sw) {
              sw.addEventListener("statechange", () => {
                if (sw.state === "activated") {
                  console.log("✅ Service Worker đã được kích hoạt.");
                  resolve(true);
                }
              });
            } else {
              resolve(true);
            }
          });
        }

        const vapidKey = process.env.NEXT_PUBLIC_VAPID_KEY;
        const token = await getToken(messaging, {
          vapidKey,
          serviceWorkerRegistration: registration,
        });

        handleSaveToken(token);
      } catch (err) {
        console.error("❌ Đăng ký FCM thất bại:", err);
      }
    };

    const handleSaveToken = async (token: string) => {
      const savedToken = localStorage.getItem("fcmToken");
        console.log("da co fcmToken: ",savedToken)
      if (savedToken !== token) {
        try {
          const res = await FetchClientPostApi(API.NOTI_PUSH.SAVE_TOKEN_NOTI, {
            token,
            accountId: user.id,
          });

          console.log("Token FCM đã được gửi lên server:", {
            token,
            accountId: user.id,
            response: res,
          });

          localStorage.setItem("fcmToken", token);
        } catch (err) {
          console.error("Lỗi khi gửi token FCM lên server:", err);
        }
      } else {
        console.log("Token đã tồn tại và không thay đổi. Bỏ qua gửi lên server.");
      }
    };

    register();
  }, [user]);

  return null;
};
