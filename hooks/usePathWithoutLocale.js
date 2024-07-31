import { useRouter } from "next/router";

//取得網址
export default function usePathWithoutLocale() {
    const router = useRouter();

    const fullPath = router.asPath;
    const pathWithoutLeadingSlash = fullPath.startsWith("/")
        ? fullPath.slice(1)
        : fullPath;
    const pathParts = pathWithoutLeadingSlash.split("/");
    return pathParts.slice(1).join("");
}
