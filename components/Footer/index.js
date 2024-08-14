import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import LanguageSwitchLink from "../LanguageSwitchLink";
import i18nextConfig from "../../next-i18next.config";
import { getLocale } from "$UTILS/lang/getStatic";

export default function Footer() {
    const router = useRouter();
    const { t } = useTranslation();
    const currentLocale = getLocale(router);

    const languageNames = {
        en: "English",
        hi: "हिन्दी",
    };

    return (
        <footer className="bg-gray-800 text-white py-4">
            <p className="text-center">{t("footer")}</p>
            <div className="text-center mt-2">
                {i18nextConfig.i18n.locales.map((locale) => {
                    if (locale === currentLocale) return null;
                    return (
                        <LanguageSwitchLink
                            key={locale}
                            locale={locale}
                            className="text-blue-400 hover:text-blue-600 mr-2"
                        >
                            {languageNames[locale]}
                        </LanguageSwitchLink>
                    );
                })}
            </div>
            <p className="text-center mt-2">Current language: {currentLocale}</p>
        </footer>
    );
}