import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import LanguageSwitchLink from "../LanguageSwitchLink";
import i18nextConfig from "../../next-i18next.config";
import { useState } from "react";
import { getLocale } from "$UTILS/lang/getStatic";
import { FOOTERGAMEITEMS, FOOTERINFOITEMS } from "../../constants/footerItem";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/ui/accordion";

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
        <footer className="mx-4 mt-6 rounded-lg bg-white px-5 text-black md:mx-0 md:mt-4 md:rounded-none md:px-20">
            {/* <p className="text-center">{t("footer")}</p>
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
            </div> */}

            <Accordion type="single" collapsible>
                <AccordionItem value="item-1" className="border-none">
                    <AccordionTrigger
                        className="py-4 text-md font-semibold md:text-lg"
                        iconClassName={"size-5"}
                    >
                        Top games and more
                    </AccordionTrigger>
                    <AccordionContent className="border-t-bgDarkGray">
                        <div className="relative w-full">
                            <div className="mb-4 h-[1px] w-full bg-bgDarkGray" />
                            <div className="grid grid-cols-2 gap-y-7 md:grid-cols-4">
                                {FOOTERGAMEITEMS.map((category) => (
                                    <div className="" key={category.title}>
                                        <h2 className="mb-3 text-md font-semibold md:text-lg">
                                            {category.title}
                                        </h2>
                                        <ul className="flex flex-col gap-3">
                                            {category.games.map((item) => (
                                                <li
                                                    className="text-sm font-semibold text-grayBlue md:text-md md:font-normal"
                                                    key={item}
                                                >
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <div className="mb-4 h-[1px] w-full bg-bgDarkGray" />
            <div>
                <div className="grid grid-cols-2 gap-y-7 md:grid-cols-6">
                    {FOOTERINFOITEMS.map((info) => (
                        <div>
                            <h2 className="mb-3 text-md font-semibold md:text-lg">
                                {info.title}
                            </h2>
                            <ul className="flex flex-col gap-3">
                                {info.items.map((item) => (
                                    <li
                                        className="text-sm font-semibold text-grayBlue md:text-md md:font-normal"
                                        key={item}
                                    >
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <p className="mt-2 text-center">
                Current language: {currentLocale}
            </p>
        </footer>
    );
}
