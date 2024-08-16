import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import LanguageSwitchLink from "../LanguageSwitchLink";
import i18nextConfig from "../../next-i18next.config";
import { useState } from "react";
import { getLocale } from "$UTILS/lang/getStatic";
import { ChevronDown } from "lucide-react";
import {
    FOOTERGAMEITEMS,
    FOOTERINFOITEMS,
    FOOTERPAYMENTMETHODS,
    FOOTERSOCIALNETWORKS,
    FOOTERRESPONSIBILITY,
} from "../../constants/footerItemList";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/ui/accordion";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/ui/dropdown-menu";

export default function Footer() {
    const router = useRouter();
    const { t } = useTranslation();
    const currentLocale = getLocale(router);

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const languageNames = {
        en: "English",
        hi: "हिन्दी",
    };

    const languages = [
        { code: "en", label: "English", flag: "/img/icon/icon_English02.svg" },
        { code: "hi", label: "हिंदी", flag: "/img/icon/icon_india.svg" },
    ];

    const handleClick = (url) => {
        // 在這裡可以添加一些邏輯，比如記錄點擊事件
        window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
        <>
            <footer className="mx-4 mb-6 mt-6 rounded-t-lg bg-white px-5 text-black md:mx-0 md:mb-0 md:mt-4 md:rounded-none md:px-20">
                <div className="relative mt-2 inline-block text-center">
                    {i18nextConfig.i18n.locales.map((locale) => {
                        if (locale === currentLocale) return null;
                        return (
                            <LanguageSwitchLink
                                key={locale}
                                locale={locale}
                                className="mr-2 text-blue-400 hover:text-blue-600"
                            >
                                {languageNames[locale]}
                            </LanguageSwitchLink>
                        );
                    })}
                </div>
                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1" className="border-none">
                        <AccordionTrigger
                            className="py-4 text-md font-semibold md:py-6 md:text-lg"
                            iconClassName={"size-5"}
                        >
                            Top games and more
                        </AccordionTrigger>
                        <AccordionContent className="border-t-bgDarkGray">
                            <div className="relative w-full">
                                <div className="mb-4 h-[1px] w-full bg-bgDarkGray md:mb-6" />
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

                <div className="mb-4 h-[1px] w-full bg-bgDarkGray md:mb-6" />
                <div className="grid grid-cols-2 gap-y-7 md:grid-cols-6">
                    {FOOTERINFOITEMS.map((info) => (
                        <div>
                            <h2 className="mb-3 text-md font-semibold md:text-lg">
                                {info.title}
                            </h2>
                            <ul className="flex flex-col gap-3">
                                {info.items.map((item) => {
                                    //切換語言
                                    if (item === "Language") {
                                        return (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <div className="flex h-[40px] w-[120px] items-center justify-between rounded-lg border border-bgDarkGray px-2 py-2.5">
                                                        <div className="flex items-center gap-1.5">
                                                            <img
                                                                className="size-[16px] object-cover"
                                                                src="/img/icon/icon_English02.svg"
                                                                alt=""
                                                            />
                                                            <div className="text-sm text-grayBlue md:text-md">
                                                                English
                                                            </div>
                                                        </div>
                                                        <ChevronDown className="ml-1 h-4 w-4 text-grayBlue" />
                                                    </div>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-[112px]">
                                                    {languages.map((lang) => (
                                                        <DropdownMenuItem
                                                            key={lang.code}
                                                            onSelect={() =>
                                                                switchLanguage(
                                                                    lang.code
                                                                )
                                                            }
                                                            className="h-9 w-[calc(100vw-60px)] hover:bg-bgPrimaryLight md:w-[280px]"
                                                        >
                                                            <img
                                                                src={lang.flag}
                                                                alt={lang.label}
                                                                className="mr-2 h-4 w-4 object-cover"
                                                            />
                                                            <span>
                                                                {lang.label}
                                                            </span>
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        );
                                    }
                                    return (
                                        <li
                                            className="text-sm font-semibold text-grayBlue md:text-md md:font-normal"
                                            key={item}
                                        >
                                            {item}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="my-4 h-[1px] w-full bg-bgDarkGray md:my-6" />
                {/* Payment Method */}
                <h2 className="mb-2 text-md font-semibold md:text-lg">
                    Payment Methods
                </h2>
                <div className="flex flex-wrap gap-3 md:gap-4">
                    {FOOTERPAYMENTMETHODS.map((method) => (
                        <div className="flex h-[44px] w-[68px] items-center justify-center rounded-lg border border-bgDarkGray">
                            <img src={method.img} alt={method.name} />
                        </div>
                    ))}
                </div>

                <div className="my-4 h-[1px] w-full bg-bgDarkGray md:my-6" />
                {/* Social Network */}
                <h2 className="mb-2 text-md font-semibold md:text-lg">
                    Social Network
                </h2>
                <div className="flex flex-wrap gap-3">
                    {FOOTERSOCIALNETWORKS.map((item) => (
                        <div
                            className="flex size-[44px] cursor-pointer items-center justify-center rounded-lg border border-bgDarkGray"
                            onClick={() => handleClick(item.link)}
                        >
                            <img
                                className="size-[28px]"
                                src={item.img}
                                alt={item.name}
                            />
                        </div>
                    ))}
                </div>

                <div className="my-4 h-[1px] w-full bg-bgDarkGray md:my-6" />
                {/* Responsibility */}
                <h2 className="mb-2 text-md font-semibold md:text-lg">
                    Responsibility
                </h2>
                <div className="flex flex-wrap gap-3">
                    {FOOTERRESPONSIBILITY.map((item) => (
                        <div
                            className="flex size-[44px] items-center justify-center rounded-lg border border-bgDarkGray"
                            onClick={() => handleClick(item.link)}
                        >
                            <img
                                className="size-[28px]"
                                src={item.img}
                                alt={item.name}
                            />
                        </div>
                    ))}
                </div>

                <div className="my-4 h-[1px] w-full bg-bgDarkGray md:my-6" />
                {/* License */}
                <h2 className="mb-2 text-md font-semibold md:text-lg">
                    License
                </h2>
                <div className="flex flex-col gap-4 md:flex-row">
                    <div className="flex h-[100px] w-[100px] flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-bgDarkGray">
                        <img
                            className="size-[80px] object-cover"
                            src="/img/footer/License/license.svg"
                            alt="license image"
                        />
                    </div>
                    {/* Legal statement */}
                    <div className="flex flex-col gap-3 pb-4 text-sm text-grayBlue md:mb-0 md:pb-9">
                        <p>
                            www.fun88.com is operated by E Gambling Montenegro
                            d.o.o. (81000 Podgorica, Moskovska br. 65., reg.
                            no.5-0615951) in cooperation with OG GLOBAL ACCESS
                            LIMITED (P.O. Box 3340, Road Town, Tortola, British
                            Virgin Islands.
                        </p>
                        <p>
                            E Gambling Montenegro d.o.o. (81000 Podgorica,
                            Moskovska br. 65., reg. no.5-0615951) hereby
                            certifies that under the concession (serial no. AA
                            001588, numeric no. 133-01/15 4A and 1ER) and
                            approval (no. 02/01-118/4), organize and operate
                            games of chance in Montenegro on website
                            www.fun88.com , in accordance with the Agreement,
                            concluded between E Gambling Montenegro d.o.o. and
                            OG GLOBAL ACCESS LIMITED (P.O. Box 3340, Road Town,
                            Tortola, British Virgin Islands, reg. no. 1923130)
                            on 07 October 2021.
                        </p>
                    </div>
                </div>
                {/* <p className="mt-2 text-center">
                Current language: {currentLocale}
            </p> */}
            </footer>
            {/* 底部導覽行佔位元素 */}
            <div className="h-[84px] md:hidden" />
        </>
    );
}
