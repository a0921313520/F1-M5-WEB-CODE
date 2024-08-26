import i18nextConfig from "../../next-i18next.config";

export const getStaticPaths = () => ({
    fallback: false,
    paths: i18nextConfig.i18n.locales
        .filter((locale) => locale !== i18nextConfig.i18n.defaultLocale)
        .map((locale) => ({ params: { locale } })),
});

export function getLocale(router) {
    // console.log("getLocale", router);
    return router.query.locale || i18nextConfig.i18n.defaultLocale;
}
