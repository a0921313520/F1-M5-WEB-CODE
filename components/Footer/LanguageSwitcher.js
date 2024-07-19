import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const router = useRouter();
    const { pathname, asPath, query } = router;
    const [isOpen, setIsOpen] = useState(false);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setIsOpen(false); // 切換語言後關閉選單
        console.log("lng ", lng);
        router.push({ pathname, query }, asPath, { locale: lng }); // 更新URL
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative flex items-center">
            <label className="mr-2 text-lg font-semibold">Language</label>
            <button
                onClick={toggleDropdown}
                className="flex items-center border rounded-lg p-2 focus:outline-none"
            >
                <img
                    src={`/flags/${i18n.language}.png`}
                    alt={i18n.language}
                    className="w-5 h-5 mr-2"
                />
                <span className="capitalize">{i18n.language}</span>
                <svg
                    className={`w-4 h-4 ml-2 transform ${
                        isOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>
            {isOpen && (
                <div className="absolute top-12 left-0 mt-2 w-full bg-white border rounded-lg shadow-lg">
                    <button
                        onClick={() => changeLanguage("en")}
                        className="flex items-center w-full p-2 hover:bg-gray-200 focus:outline-none"
                    >
                        <img
                            src="/flags/uk.png"
                            alt="English"
                            className="w-5 h-5 mr-2"
                        />
                        English
                    </button>
                    <button
                        onClick={() => changeLanguage("hi")}
                        className="flex items-center w-full p-2 hover:bg-gray-200 focus:outline-none"
                    >
                        <img
                            src="/flags/in.png"
                            alt="Hindi"
                            className="w-5 h-5 mr-2"
                        />
                        Hindi
                    </button>
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;
