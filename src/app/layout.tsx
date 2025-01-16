import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import { UserProvider } from "@/context/user_context";
import Header from "@/components/shared/header";
import "@fortawesome/fontawesome-free/css/all.min.css"
import { SocketProvider } from "@/context/socket_context";
import NextTopLoader from "nextjs-toploader";
import { LoadingProvider } from "@/context/loading_context";
import LoadingSpiner from "@/components/shared/loading_spiner";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


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
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#ff0064" />
        <link rel="manifest" href="/manifest.json"/>

      </head>
      <body className={`${inter.className}`}>
        <div id="nprogress-overlay"></div>
        <LoadingProvider>
          <SocketProvider>
            <UserProvider>
              <Header />
              <NextTopLoader
                color="linear-gradient(268deg,rgb(12, 147, 250) 0%,rgb(206, 230, 249) 100%)"
                initialPosition={0.08}
                crawlSpeed={50}
                height={3}
                crawl={true}
                easing="ease"
                speed={50}
                zIndex={1600}
                showAtBottom={false}
              />
              <LoadingSpiner/>
              {children}
            </UserProvider>
          </SocketProvider>
        </LoadingProvider>

        <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
      </body>
    </html>
  );
}
