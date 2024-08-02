import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx);
        const locale = ctx.query.locale || "hi"; // Default to 'hi' if not set
        return { ...initialProps, locale };
    }

    render() {
        const currentLocale = this.props.locale; // Using the locale passed from getInitialProps

        return (
            <Html lang={currentLocale}>
                <Head>
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                if (!!window.ActiveXObject || "ActiveXObject" in window) {
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
