import { useRouter } from "next/router";

//取得當前路徑(不包含語言以及?query)
const useCurrentPath = () => {
    const router = useRouter();
    const { asPath } = router;

    // 如果 pathname 不包含 [locale]，直接返回
    if (!asPath.startsWith("/hi")) {
        return asPath;
    }

    // 移除 /[locale] 部分
    const pathWithoutLocale = asPath.replace(/^\/hi/, "");

    // 如果移除後為空，返回 '/'
    return pathWithoutLocale || "/";
};

export default useCurrentPath;
