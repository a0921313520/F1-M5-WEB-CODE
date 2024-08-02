// context/I18nContext.js

import { createContext, useState, useContext } from "react";

// 假设 i18n 数据
const i18n = {
    en: {
        title: "Hello World",
        content: "This is an English page.",
    },
    hi: {
        title: "नमस्ते दुनिया",
        content: "यह हिंदी पृष्ठ है।",
    },
};

const I18nContext = createContext();

export function I18nProvider({ children }) {
    const [language, setLanguage] = useState("hi"); // 默认语言为 Hindi

    const toggleLanguage = () => {
        setLanguage((prevLanguage) => (prevLanguage === "hi" ? "en" : "hi"));
    };

    const t = (key) => i18n[language][key] || key; // 翻译函数

    return (
        <I18nContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    return useContext(I18nContext);
}
