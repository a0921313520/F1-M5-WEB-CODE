import { useRouter } from "next/router";

//取得當前路徑(除了locale)
const useCurrentPath = () => {
    const router = useRouter();
    const { asPath } = router; // 獲取當前完整路徑

    // 提取路徑部分
    const pathWithoutQuery = asPath.split("?")[0]; // 只取 '?' 之前的部分
    const pathSegments = pathWithoutQuery
        .split("/")
        .filter((segment) => segment); // 分割路徑並去除空值

    // 根據目前語言設定決定是否去除語言前綴
    const currentLocale = router.locale || "en"; // 取得當前語言
    const isDefaultLocale = currentLocale === "en"; // 檢查是否為預設語言

    // 如果是預設語言，直接返回最後一個路徑段；如果是非預設語言，則返回第二個路徑段
    return isDefaultLocale
        ? pathSegments[pathSegments.length - 1]
        : pathSegments[pathSegments.length - 2];
};

export default useCurrentPath;
