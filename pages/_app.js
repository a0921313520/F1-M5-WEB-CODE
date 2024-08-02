import React, { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "../redux/store";
import "../styles/globals.scss";
import "../styles/tailwindcss.css";
import { I18nProvider } from "../utils/lang/LangContext";

function MyApp({ Component, pageProps }) {
    const { status, text } = useSelector((state) => state.spin);

    useEffect(() => {
        window.piwikLoadFinished = true;
    }, []);

    return <Component {...pageProps} />;
}

function App({ Component, pageProps }) {
    return (
        <I18nProvider>
            <Provider store={store}>
                <MyApp Component={Component} pageProps={pageProps} />
            </Provider>
        </I18nProvider>
    );
}

export default App;
