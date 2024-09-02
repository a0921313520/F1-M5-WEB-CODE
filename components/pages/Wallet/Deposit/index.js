import React, { useEffect, useState } from "react";
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
import { get, post } from "../../../../services/Request";
// import { ApiPort } from "../../../../services/API";

// styles
import "react-loading-skeleton/dist/skeleton.css";

// central payment
import CentralPaymentEntry from "$CentralPayment/web/src";
import { setConfig, getConfig } from "$CentralPayment/config";

const privateParams = {
    device: "WEB",
    platformType: "F1",
    languageType: "M5",
    paymentModule: "deposit",
    // ApiDomain: ApiPort.URL,
    // successUrl: 'f1p5native://',
    // domainName: window.SBTDomain,
    // e2Backbox: window.E2Backbox || '',
    // firstName: "zzz",
    networkIp: "123.123.123.123",
    // playerCurrency: "INR", // 當前貨幣 種類
    // StyleSetting: styleSetting,
    // PiwikEventDataHandle: () => {},
    BackClick: () => {
        // Actions.pop()
    },
    // LivechatClick: () => {
    //     LiveChatOpenGlobe()
    // },
    // goRecord: (type = 'deposit', methods) => {
    //     Actions.recordes({
    //         recordIndex: 0,
    //         methods,
    //     })
    // }, //type = deposit存款记录,withdrawals提款记录
    ApiGet: (url) => get(url),
    ApiPost: (url, postdata = {}) => post(url, postdata),
    SetFooter: () => <Footer />,
    // modalTip: {
    //     info: (data) => {},
    //     confirm: (data) => {},
    // },
    // toastTip: {
    //     loading: (msg) => Toast.loading(msg || 'Loading', 50),
    //     success: (msg) => NotifyToast.success(msg),
    //     fail: (msg) => NotifyToast.fail(msg),
    //     hide: () => Toast.removeAll(),
    // },
    // webPiwikEvent: () => {},
    // webPiwikUrl: () => {},
    // appPiwikEvent: () => {},
    // appPiwikUrl: () => {},
};

const Deposit = () => {
    const { t } = useTranslation(["common", "footer", "header"]);
    const { value, increment, decrement } = useBearStore();
    const isDesktop = useIsDesktop();

    const path = useCurrentPath(); //取得網址
    const router = useRouter();
    const currentLocale = getLocale(router);

    const { navigateTo, changeLanguage } = useLanguageNavigation();
    const [pageKey, setPageKey] = useState(Math.random());
    const [configSet, setConfigSet] = useState(false);

    useEffect(() => {
        (async () => {
            await setConfig(privateParams);

            console.log("getConfig()", getConfig());
            if (Object.keys(getConfig())?.length) {
                setConfigSet(true);
            }
        })();
    }, []);

    if (!configSet) {
        return <div>Loading...</div>;
    }
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
                <div className="mt-5 flex justify-center">
                    <CentralPaymentEntry
                        key={pageKey}
                        moduleName={"deposits"}
                        language={currentLocale == "en" ? "english" : "hindi"}
                    />
                </div>
            </Layout>
        </>
    );
};

export default Deposit;
