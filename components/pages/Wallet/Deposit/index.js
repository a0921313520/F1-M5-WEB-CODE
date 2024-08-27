import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

// component
import Layout from "@/Layout";
import Footer from "../../../Footer";

// hooks
import useCurrentPath from "$HOOKS/useCurrentPath";
import useLanguageNavigation from "$HOOKS/useLanguageNavigation";

// lib
import { getLocale } from "$UTILS/lang/getStatic";

import useBearStore from "$ZUSTAND_STORE/zustandStore";
import { HomePageSeo } from "$DATA/seo/seo.static";
import useIsDesktop from "$HOOKS/useIsDesktop";

import "react-loading-skeleton/dist/skeleton.css";

const Deposit = () => {
    const { t } = useTranslation(["common", "footer", "header"]);
    const { value, increment, decrement } = useBearStore();
    const isDesktop = useIsDesktop();

    const path = useCurrentPath(); //取得網址
    const router = useRouter();
    const currentLocale = getLocale(router);

    const { navigateTo, changeLanguage } = useLanguageNavigation();

    useEffect(() => {
        console.log("path", path);
        console.log("router", router);
        console.log("currentLocale", currentLocale);
        console.log("isDesktop", isDesktop);
    }, []);

    return (
        <>
            <Layout
                status={2}
                title={HomePageSeo.title}
                Keywords={HomePageSeo.Keywords}
                description={HomePageSeo.description}
                seoContainer={HomePageSeo.container}
                setLoginStatus={(v) => {}}
                setLockHeader={(setLockHeader) => {}}
                // seoData={this.props.seoData}
            >
                <div>index</div>
            </Layout>
        </>
    );
};

export default Deposit;
