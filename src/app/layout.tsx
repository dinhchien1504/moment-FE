import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import { UserProvider } from "@/context/user_context";
import Header from "@/components/shared/header";
import ProgressBar from "@/components/shared/progress_bar";
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
        <UserProvider>
          <Header/>
          <ProgressBar/>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
