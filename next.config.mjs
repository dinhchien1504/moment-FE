/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverActions: {
        bodySizeLimit: "10mb", // Tăng giới hạn body size lên 10MB
      },
    },
  reactStrictMode: true,
  swcMinify: true,

  // Cấu hình plugin PWA
  pwa: {
    dest: "public", // Thư mục chứa Service Worker
    register: true, // Tự động đăng ký Service Worker
    skipWaiting: true, // Bỏ qua bước chờ, áp dụng Service Worker mới ngay lập tức
  },
};

export default nextConfig;