import React, { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "../redux/store";
import { appWithTranslation, useTranslation } from "next-i18next";
import "../styles/globals.scss";
import "../styles/tailwindcss.css";
import { useLanguageSwitch } from "$UTILS/lang/useLanguageSwitch";
import { ToastContainer } from "react-toastify";

function MyApp({ Component, pageProps }) {
    const { i18n } = useTranslation();

    console.log("Redux Store State:", store.getState());
    useLanguageSwitch();

    useEffect(() => {
        window.piwikLoadFinished = true;
    }, []);

    //根據不同語言設定字體和 HTML lang 屬性
    useEffect(() => {
        // 設置 HTML lang 屬性
        document.documentElement.lang = i18n.language;
        // 設置字體類
        document.body.className =
            i18n.language === "hi" ? "font-hind" : "font-roboto";
    }, [i18n.language]);

    return <Component {...pageProps} />;
}

function App({ Component, pageProps }) {
    return (
        <Provider store={store}>
            <MyApp Component={Component} pageProps={pageProps} />
            <ToastContainer
                style={{
                    top: "2.5rem",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "auto",
                    maxWidth: "90%",
                }}
                toastStyle={{
                    margin: "0 auto",
                    marginBottom: ".5rem",
                }}
            />
        </Provider>
    );
}

export default appWithTranslation(App);
