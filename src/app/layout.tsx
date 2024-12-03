import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import NextTopLoader from "nextjs-toploader";
import { UserProvider } from "@/context/user_context";
import Header from "@/components/shared/header";
const inter = Inter({ subsets: ["latin"] });

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <header>
          <NextTopLoader
            color="linear-gradient(268deg, #ec3d04 0%, #FF2A69 100%)"
            initialPosition={0.08}
            crawlSpeed={50}
            height={3}
            crawl={true}
            easing="ease"
            speed={50}
            zIndex={1600}
            showAtBottom={false}
          />
        </header>
        <UserProvider>
          <Header/>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
