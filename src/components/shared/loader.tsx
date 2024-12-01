"use client"; // Đảm bảo rằng đây là client component

import { useState } from "react";
import NextTopLoader from "nextjs-toploader";

const Loader = () => {
    const [loading, setLoading] = useState(false);

    // Hàm này có thể được gọi khi bắt đầu hoặc kết thúc fetch API
    const toggleLoading = (status: boolean) => {
        setLoading(status);
    };

    return (
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
            showSpinner={loading}
        />
    );
}

export default Loader