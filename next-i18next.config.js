const path = require("path");

module.exports = {
    i18n: {
        locales: ["en", "hi"],
        defaultLocale: "en",
        localeDetection: false,
    },
    localePath: path.resolve("./public/locales"),
};
