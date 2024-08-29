import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/ui/button";
import { Squash as Hamburger } from "hamburger-react";
import { formatNumberWithCommas } from "@/lib/utils";
import useCurrentPath from "$HOOKS/useCurrentPath";
import useLanguageNavigation from "$HOOKS/useLanguageNavigation";
import { getLocale } from "$UTILS/lang/getStatic";
import { ChevronDown } from "lucide-react";
import { ReactSVG } from "react-svg";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { NAV_ITEMS, BOTTOM_ITEMS, HEADER_ITEMS } from "$DATA/navigation";
import { LANGUAGES } from "$DATA/language";
import { useTranslation } from "react-i18next";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const path = useCurrentPath(); //取得網址
    const router = useRouter();
    const currentLocale = getLocale(router);
    const { t } = useTranslation(["header"]);

    const { navigateTo, changeLanguage } = useLanguageNavigation();

    let isLogin = false;

    let currentLanguage = LANGUAGES.find((lang) => lang.code === currentLocale);

    return (
        <>
            <header className="fixed top-0 z-40 h-[44px] w-screen bg-primary px-4 py-2 md:h-[64px] md:px-5 md:py-2">
                <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="hidden md:block">
                            <Hamburger
                                toggled={isMenuOpen}
                                toggle={setIsMenuOpen}
                                size={28}
                                color="#fff"
                                rounded
                            />
                        </div>
                        <img
                            src="/img/icon/Logo.svg"
                            className="cursor-pointer md:min-h-[25px] md:min-w-[100px]"
                            alt="fun88-logo"
                            onClick={() => navigateTo("/")}
                        />
                    </div>
                    {/* header中間遊戲導航 */}
                    <div className="mx-10 hidden max-w-[900px] flex-1 items-center justify-between xl:flex">
                        {HEADER_ITEMS.map((item) => (
                            <div
                                className="flex flex-col items-center justify-center gap-[5.5px] text-sm text-white"
                                key={item.text}
                            >
                                <img
                                    className="size-6"
                                    src={item.img}
                                    alt={`${item.text} icon`}
                                />
                                <span>{item.text}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center">
                        <div className="flex items-center gap-3 md:gap-6">
                            {isLogin && (
                                <>
                                    <div className="flex items-center">
                                        <div className="mr-1 text-white md:mr-2">
                                            <div className="text-end text-xxs md:text-md">
                                                INR
                                            </div>
                                            <div className="text-sm md:text-md">
                                                {formatNumberWithCommas(
                                                    123456227
                                                )}
                                            </div>
                                        </div>
                                        <img
                                            src="/img/icon/icon_account.svg"
                                            className="size-5 cursor-pointer md:size-6"
                                            alt="account"
                                        />
                                    </div>
                                    <img
                                        src="/img/icon/icon_bell.svg"
                                        className="size-5 cursor-pointer md:size-6"
                                        alt="bell"
                                    />
                                </>
                            )}

                            {path !== "login" && path !== "register" && (
                                <img
                                    src="/img/icon/icon_search_white.svg"
                                    className="mr-3 size-5 cursor-pointer md:size-6 md:min-h-6 md:min-w-6"
                                    alt="search icon"
                                />
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            {isLogin ? (
                                <Button
                                    className="rounded-md"
                                    type="green"
                                    onClick={() =>
                                        navigateTo("/wallet/deposit")
                                    }
                                >
                                    {t("deposit")}
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        className={`rounded-md ${
                                            path === "login" ? "hidden" : ""
                                        }`}
                                        type="white"
                                        onClick={() => navigateTo("/login")}
                                    >
                                        {t("login")}
                                    </Button>
                                    <Button
                                        className={`rounded-md ${
                                            path === "register" ? "hidden" : ""
                                        }`}
                                        type="green"
                                        onClick={() => navigateTo("/register")}
                                    >
                                        {t("register")}
                                    </Button>
                                    {(path === "login" ||
                                        path === "register") && (
                                        <img
                                            src="/img/icon/icon_CS.svg"
                                            className="cursor-pointer md:size-7"
                                            alt="Custom service"
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>
            {/* 佔位元素 */}
            <div className="h-[44px] md:h-[64px]"></div>

            {/* 導覽選單 */}
            <nav
                className={`fixed inset-0 bottom-0 z-20 h-full w-full transform overflow-y-auto bg-white pb-[84px] pt-[44px]
                            transition-all duration-500 md:bottom-auto md:left-0 md:right-auto md:top-14 md:h-[calc(100vh-56px)] md:w-[320px] md:pb-0 md:pt-0
                    ${
                        isMenuOpen
                            ? "translate-y-0 md:translate-x-0"
                            : "translate-y-full md:-translate-x-full md:translate-y-0"
                    }
                `}
            >
                <div className="space-y-2 p-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="flex h-11 items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <img
                                        className="size-6"
                                        src={currentLanguage.img}
                                        alt={currentLanguage.label}
                                    />
                                    <div className="text-md">
                                        {currentLanguage.label}
                                    </div>
                                </div>
                                <ChevronDown className="ml-1 h-4 w-4 text-black" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full">
                            {LANGUAGES.map((lang) => (
                                <DropdownMenuItem
                                    key={lang.code}
                                    onSelect={() => changeLanguage(lang.code)}
                                    disabled={lang.code === currentLocale}
                                    className="h-9 w-[calc(100vw-60px)] hover:bg-bgPrimaryLight md:w-[280px]"
                                >
                                    <img
                                        src={lang.img}
                                        alt={lang.label}
                                        className="mr-2 h-4 w-4 object-cover"
                                    />
                                    <span>{lang.label}</span>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {NAV_ITEMS.map((item, index) => {
                        if (item === "divider") {
                            return (
                                <div
                                    className="h-[1px] w-full bg-bgDarkGray"
                                    key={`nav-item-${index}`}
                                />
                            );
                        }
                        return (
                            <div className="relative" key={`nav-item-${index}`}>
                                <div className="flex h-11 cursor-pointer items-center gap-4">
                                    <img
                                        className="size-6"
                                        src={item.img}
                                        alt={item.text + " icon"}
                                    />
                                    <div className="text-md">
                                        {t(item.text)}
                                    </div>
                                </div>
                                {item.isNew && (
                                    <div className="absolute right-0 top-2 rounded bg-[#f42766] px-[5px] py-0.5 text-sm text-white">
                                        {t("new")}
                                    </div>
                                )}
                                {item.isUpdated && (
                                    <div className="absolute right-0 top-2 rounded bg-[#1fd1a1] px-[5px] py-0.5 text-sm text-white">
                                        {t("update")}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </nav>
            {/* 底部導覽行(768px以下才顯示) */}
            {path !== "login" &&
                path !== "register" &&
                path !== "forgot-password" && (
                    <div className="fixed bottom-0 z-40 h-[84px] w-full bg-white px-[20px] pt-[10px] md:hidden">
                        <div className="flex items-center justify-between">
                            {BOTTOM_ITEMS.map((item, index) => {
                                const isAcive =
                                    item.link === path && !isMenuOpen; //如果menu已被打開，該item就不active
                                if (item === "menu") {
                                    return (
                                        <div
                                            className="flex flex-col items-center gap-1.5"
                                            key={`bottom-item-${index}`}
                                        >
                                            <div className="size-[26px] -translate-x-2.5 -translate-y-2">
                                                <Hamburger
                                                    toggled={isMenuOpen}
                                                    toggle={setIsMenuOpen}
                                                    size={26}
                                                    color={`${
                                                        isMenuOpen
                                                            ? "rgba(0, 166, 255, 1)"
                                                            : "rgba(152, 157, 171, 1)"
                                                    }`}
                                                    rounded
                                                />
                                            </div>
                                            <div
                                                className={`text-sm  ${
                                                    isMenuOpen
                                                        ? "text-primary"
                                                        : "text-grayBlue"
                                                }`}
                                            >
                                                {t("menu")}
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <div
                                        className="flex flex-col items-center gap-1.5"
                                        key={`bottom-item-${index}`}
                                    >
                                        <ReactSVG
                                            className="size-[26px]"
                                            src={
                                                isAcive
                                                    ? item.activeImg
                                                    : item.img
                                            }
                                            alt={`${item.text} icon`}
                                        />
                                        <div
                                            className={`text-sm ${
                                                isAcive
                                                    ? "text-primary"
                                                    : "text-grayBlue"
                                            }`}
                                        >
                                            {t(item.text)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
        </>
    );
};

export default Header;
