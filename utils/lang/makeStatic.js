import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import i18nextConfig from '../../next-i18next.config';

export async function getI18nProps(ctx, ns = ['common']) {
    let locale = ctx?.params?.locale || i18nextConfig.i18n.defaultLocale;

    console.log('localeTestparams ',ctx?.params)
    
    const props = {
        ...(await serverSideTranslations(locale, ns))
    };
    return props;
}

export function makeStaticProps(ns = {}) {
    return async function getStaticProps(ctx) {
        return {
            props: await getI18nProps(ctx, ns)
        };
    };
}