import { useState, useEffect } from "react";

const useIsDesktop = () => {
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const checkIsDesktop = () => {
            setIsDesktop(window.innerWidth >= 768);
        };

        // 初始檢查
        checkIsDesktop();

        // 監聽視窗大小變化
        window.addEventListener("resize", checkIsDesktop);

        // 清理函數
        return () => {
            window.removeEventListener("resize", checkIsDesktop);
        };
    }, []);

    return isDesktop;
};

export default useIsDesktop;
