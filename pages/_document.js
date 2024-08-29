import Document, { Html, Head, Main, NextScript } from "next/document";
export default class MyDocument extends Document {
    render() {
        return (
            <Html>
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
