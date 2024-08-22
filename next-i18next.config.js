// used for SSR (getServerSideProps)
// const path = require('path')
// const localePath = path.resolve('./public/locales')

module.exports = {
    // https://www.i18next.com/overview/configuration-options#logging
    debug: process.env.NODE_ENV === "development",
    i18n: {
        defaultLocale: "en",
        locales: ["en", "hi"],
    },
    fallbackLng: {
        default: ["en"], //當指定某個語言的翻譯不存在時，可把此翻譯做為後備語言
    },
    // localePath,
    reloadOnPrerender: process.env.NODE_ENV === "development",
    // serializeConfig: false,
};
