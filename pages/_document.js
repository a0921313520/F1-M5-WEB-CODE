import Document, { Html, Head, Main, NextScript } from "next/document";
import i18nextConfig from "../next-i18next.config";

export default class MyDocument extends Document {
    render() {
        const currentLocale =
            this.props.__NEXT_DATA__.query.locale ||
            i18nextConfig.i18n.defaultLocale;
        return (
            <Html lang={currentLocale}>
                <Head>
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `if (!!window.ActiveXObject || "ActiveXObject" in window) {
                                    var script = document.createElement("script");
                                    script.src = "/vn/js/polyfill.min.js";
                                    document.getElementsByTagName("head")[0].appendChild(script);
                                }`,
                        }}
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
