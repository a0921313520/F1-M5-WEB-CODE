import { useState } from "react";
import { useI18n } from "../../utils/lang/LangContext"; // Use your custom translation context

export default function Footer() {
    // Use the custom useI18n hook for translations
    const { t, toggleLanguage, language } = useI18n();
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
                        {/* Map over available languages */}
                        {["en", "hi"].map((locale) => {
                            if (locale === language) return null; // Skip current language
                            return null;
                        })}
                    </ul>
                )}
            </div>
        </footer>
    );
}
