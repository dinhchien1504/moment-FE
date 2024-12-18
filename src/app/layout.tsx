import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import { UserProvider } from "@/context/user_context";
import Header from "@/components/shared/header";
import ProgressBar from "@/components/shared/progress_bar";
import "@fortawesome/fontawesome-free/css/all.min.css"


const inter = Inter({ subsets: ["latin"] });

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Moment",
  description: "Nơi chia sẻ ảnh và theo dõi bạn bè",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/logo-removebg.png" />
      </head>
      <body className={`${inter.className}`}>
      <div id="nprogress-overlay"></div>
        <UserProvider>
          <Header />
          <ProgressBar />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
