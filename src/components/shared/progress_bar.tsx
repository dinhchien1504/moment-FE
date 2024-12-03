// components/ProgressBar.tsx
"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import NProgress from 'nprogress';
import "@/styles/nprogress.css"


const ProgressBar = () => {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.start();

    // Khi pathname thay đổi, NProgress sẽ dừng sau khi trang mới đã render
    NProgress.done();
  }, [pathname]);

  return null;
};

export default ProgressBar;