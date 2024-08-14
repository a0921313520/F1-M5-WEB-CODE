import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import i18nextConfig from "../../next-i18next.config";

export const getI18nPaths = () =>
    i18nextConfig.i18n.locales.map((lng) => ({
        params: {
            locale: lng,
        },
    }));

// export const getStaticPaths = () => ({
//     fallback: false,
//     paths: getI18nPaths(),
// });

export async function getI18nProps(ctx, ns = ["common"]) {
    // 使用默认语言，如果 ctx.params.locale 未定义
    const locale = ctx?.locale || i18nextConfig.i18n.defaultLocale;
    console.log("localelocale ", ctx);
    console.log("localelocale ", locale);
    // 如果 locale 仍然未定义，抛出一个错误，避免调用 serverSideTranslations 时出错
    if (!locale) {
        throw new Error("Locale is not defined");
    }

    let props = {
        ...(await serverSideTranslations(locale, ns)),
    };
    return props;
}

export function makeStaticProps(ns = []) {
    return async function getStaticProps(ctx) {
        console.log("getStaticProps ", getStaticProps);
        return {
            props: await getI18nProps(ctx, ns),
        };
    };
}
