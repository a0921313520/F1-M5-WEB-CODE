import React, { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "../redux/store";
import { useRouter } from "next/router";
import { NextIntlClientProvider } from "next-intl";

import "../styles/globals.scss";
import "../styles/tailwindcss.css";

function MyApp({ Component, pageProps }) {
    const { status, text } = useSelector((state) => state.spin);

    console.log("Redux Store State:", store.getState());

    useEffect(() => {
        window.piwikLoadFinished = true;
    }, []);

    return <Component {...pageProps} />;
}

function App({ Component, pageProps }) {
    const router = useRouter();

    return (
        <NextIntlClientProvider
            locale={router.locale}
            timeZone="Europe/Vienna"
            messages={pageProps.messages}
        >
            <Provider store={store}>
                <MyApp Component={Component} pageProps={pageProps} />
            </Provider>
        </NextIntlClientProvider>
    );
}

export default App;
