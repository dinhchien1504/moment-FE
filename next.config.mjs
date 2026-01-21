import withPWA from "next-pwa";
import path from "path";
import { readFileSync, writeFileSync } from "fs";

/** @type {import('next').NextConfig} */

const generateServiceWorker = () => {
  const templatePath = path.resolve("firebase-messaging-sw.template.js");
  const outputPath = path.resolve("public", "firebase-messaging-sw.js");

  const template = readFileSync(templatePath, "utf8");

  const result = template
    .replace("__API_KEY__", process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "")
    .replace("__AUTH_DOMAIN__", process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "")
    .replace("__PROJECT_ID__", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "")
    .replace("__MESSAGING_SENDER_ID__", process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "")
    .replace("__APP_ID__", process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "");

  writeFileSync(outputPath, result);
};

// 👉 Gọi trước khi xuất config
generateServiceWorker();
const nextConfig = {
    experimental: {
      serverActions: {
        bodySizeLimit: "10mb", // Tăng giới hạn body size lên 10MB
      },
    },
  reactStrictMode: false,
  swcMinify: true,
  ...withPWA({

  // Cấu hình plugin PWA
  pwa: {
    dest: "public", // Thư mục chứa Service Worker
    register: true, // Tự động đăng ký Service Worker
    skipWaiting: true, // Bỏ qua bước chờ, áp dụng Service Worker mới ngay lập tức
  }}),
};

export default nextConfig;