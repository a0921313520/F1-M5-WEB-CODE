import React, { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "../redux/store";
import { appWithTranslation } from "next-i18next";
import "../styles/globals.scss";
import "../styles/tailwindcss.css";
import "central-payment-m5/web/styles/themes/F1/F1.scss";

import { useLanguageSwitch } from "$UTILS/lang/useLanguageSwitch";

function MyApp({ Component, pageProps }) {
    const { status, text } = useSelector((state) => state.spin);

    console.log("Redux Store State:", store.getState());
    useLanguageSwitch();

    useEffect(() => {
        window.piwikLoadFinished = true;
    }, []);

    return <Component {...pageProps} />;
}

function App({ Component, pageProps }) {
    return (
        <Provider store={store}>
            <MyApp Component={Component} pageProps={pageProps} />
        </Provider>
    );
}

export default appWithTranslation(App);
