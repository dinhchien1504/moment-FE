// components/ProgressBar.tsx
"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import NProgress from 'nprogress';
import "@/styles/nprogress.css"

const ProgressBar = () => {
  const pathname = usePathname();

  useEffect(() => {
    const overlay = document.getElementById("nprogress-overlay");
    if (overlay) {
      overlay.style.display = "block";
    }

    NProgress.start();

    // Khi pathname thay đổi, NProgress sẽ dừng sau khi trang mới đã render
    const timeout =  setTimeout(() => {
      NProgress.done();
      if (overlay) {
        overlay.style.display = "none";
      }
    }, 400);

    return () => clearTimeout(timeout);


  }, [pathname]);

  return null;
};

export default ProgressBar;