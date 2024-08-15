import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import LanguageSwitchLink from "../LanguageSwitchLink";
import i18nextConfig from "../../next-i18next.config";
import { useState } from "react";
import { getLocale } from "$UTILS/lang/getStatic";

export default function Footer() {
    const router = useRouter();
    const { t } = useTranslation();
    const currentLocale = getLocale(router);

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const languageNames = {
        en: "English",
        hi: "हिन्दी",
    };

    return (
        <footer className="bg-gray-800 py-4 text-white">
            <p className="text-center">{t("footer")}</p>
            <div className="text-center mt-2  text-3xl">
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
