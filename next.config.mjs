/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
          bodySizeLimit: "10mb", // Tăng giới hạn body size lên 10MB
        },
      },
};

export default nextConfig;