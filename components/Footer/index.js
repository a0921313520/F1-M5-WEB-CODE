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

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    return (
        <footer className="bg-gray-800 py-4 text-white">
            <p className="text-center">{t("footer")}</p>
            <div className="relative mt-2 inline-block text-center">
                <button
                    onClick={toggleDropdown}
                    className="inline-flex items-center rounded bg-gray-700 px-4 py-2 text-white hover:bg-gray-600"
                >
                    <span className="mr-1">切換語言</span>
                    <svg
                        className="h-4 w-4 fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                    >
                        <path d="M0 0h20v20H0z" fill="none" />
                        <path d="M10 12l-6-6h12z" />
                    </svg>
                </button>
                {dropdownOpen && (
                    <ul className="absolute right-0 z-20 mt-2 w-48 rounded-lg bg-white py-2 shadow-xl">
                        {i18nextConfig.i18n.locales.map((locale) => {
                            if (locale === currentLocale) return null;
                            return (
                                <li key={locale}>
                                    <LanguageSwitchLink
                                        locale={locale}
                                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                    />
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </footer>
    );
}
