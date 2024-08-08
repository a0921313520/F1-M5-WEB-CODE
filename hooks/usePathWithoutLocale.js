import { useRouter } from "next/router";

//取得網址
export default function usePathWithoutLocale() {
    const router = useRouter();

    const getMainPath = () => {
        // 使用 asPath 來獲取完整的 URL，包括查詢參數
        const { asPath } = router;

        // 移除查詢參數
        const pathWithoutQuery = asPath.split("?")[0];

        // 分割路徑
        const pathSegments = pathWithoutQuery
            .split("/")
            .filter((segment) => segment !== "");

        // 返回第二個段（索引 1），即語言代碼之後的第一個段
        // 如果不存在，則返回空字符串
        return pathSegments[1] || "";
    };

    return getMainPath();
}
