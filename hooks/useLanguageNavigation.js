import { useRouter } from "next/router";
import i18nextConfig from "../next-i18next.config";
import languageDetector from "../utils/lang/languageDetector";
import { getLocale } from "$UTILS/lang/getStatic";

const useLanguageNavigation = () => {
    const router = useRouter();
    const defaultLocale = i18nextConfig.i18n.defaultLocale;
    const currentLocale = getLocale(router);

    // 更換語言的 function
    const changeLanguage = (locale) => {
        if (locale === currentLocale) return;

        const currentPath = router.asPath;
        const currentLocale = router.query.locale || defaultLocale;

        // 移除當前語言前綴
        const newPath = currentPath.replace(`/${currentLocale}`, "");

        // 為非默認語言添加前綴
        const href =
            locale !== defaultLocale ? `/${locale}${newPath}` : newPath;

        // 更新語言到緩存
        languageDetector.cache(locale);

        // 使用 router.push 切換語言
        router.push(href, href, { locale });
    };

    const getLocalizedHref = (href, locale) => {
        locale = locale || router.query.locale || defaultLocale;

        if (href.indexOf("http") === 0) return href;

        if (locale && locale !== defaultLocale) {
            href = href
                ? `/${locale}${href}`
                : router.pathname.replace("[locale]", locale);
        } else {
            href = href.replace(`/${locale}`, "");
        }

        return href;
    };
    //切換路徑
    const navigateTo = (href, options = {}) => {
        const localizedHref = getLocalizedHref(href, currentLocale);
        router.push(localizedHref, localizedHref, options);
    };
    return { changeLanguage, navigateTo };
};

export default useLanguageNavigation;
