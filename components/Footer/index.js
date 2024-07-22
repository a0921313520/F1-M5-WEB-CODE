import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import LanguageSwitchLink from "../LanguageSwitchLink";
import i18nextConfig from "../../next-i18next.config";
import { useState } from "react";

export default function Footer() {
    const router = useRouter();
    const { t } = useTranslation("footer");
    const currentLocale =
        router.query.locale || i18nextConfig.i18n.defaultLocale;
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    return (
        <footer className="bg-gray-800 text-white py-4">
            <p className="text-center">{t("footer")}</p>
            <div className="text-center mt-2 relative inline-block">
                <button
                    onClick={toggleDropdown}
                    className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded inline-flex items-center"
                >
                    <span className="mr-1">切換語言</span>
                    <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                    >
                        <path d="M0 0h20v20H0z" fill="none" />
                        <path d="M10 12l-6-6h12z" />
                    </svg>
                </button>
                {dropdownOpen && (
                    <ul className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl z-20">
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
