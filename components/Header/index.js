import React, { useState } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { Button } from "@/ui/button";
import { Squash as Hamburger } from "hamburger-react";
import { formatNumberWithCommas } from "@/lib/utils";
import usePathWithoutLocale from "../../hooks/usePathWithoutLocale";
import { ChevronDown } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { NAV_ITEMS, BOTTOM_ITEMS } from "../../constants/navigation";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();
    const path = usePathWithoutLocale(); //取得網址
    const { locale, pathname, asPath, query } = router;
    console.log(path);
    let isLogin = false;
    const languages = [
        { code: "en", label: "English", flag: "/img/icon/icon_English02.svg" },
        { code: "hi", label: "हिंदी", flag: "/img/icon/icon_india.svg" },
    ];
    const changeLanguage = (code) => {};
    return (
        <>
            <header className="fixed top-0 z-20 h-[44px] w-screen bg-primary px-4 py-2 md:h-[56px] md:px-5 md:py-1">
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
                            className="cursor-pointer md:h-[25px] md:w-[100px]"
                            alt="fun88-logo"
                            onClick={() =>
                                router.push(`/${router.query.locale}`)
                            }
                        />
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
                                    className="mr-3 size-5 cursor-pointer md:size-6"
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
                                        router.push(
                                            `/${router.query.locale}/deposit`
                                        )
                                    }
                                >
                                    Deposit
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        className={`rounded-md ${
                                            path === "login" ? "hidden" : ""
                                        }`}
                                        type="white"
                                        onClick={() =>
                                            router.push(
                                                `/${router.query.locale}/login`
                                            )
                                        }
                                    >
                                        Login
                                    </Button>
                                    <Button
                                        className={`rounded-md ${
                                            path === "register" ? "hidden" : ""
                                        }`}
                                        type="green"
                                        onClick={() =>
                                            router.push(
                                                `/${router.query.locale}/register`
                                            )
                                        }
                                    >
                                        Register
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
            <div className="h-[44px] md:h-[56px]"></div>

            {/* 導覽選單 */}
            <nav
                className={`fixed inset-0 bottom-0 z-10 h-full w-full transform overflow-y-auto bg-white pb-[84px] pt-[44px]
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
                                        src="/img/icon/icon_English02.svg"
                                        alt=""
                                    />
                                    <div className="text-md">English</div>
                                </div>
                                <ChevronDown className="ml-1 h-4 w-4 text-black" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full">
                            {languages.map((lang) => (
                                <DropdownMenuItem
                                    key={lang.code}
                                    onSelect={() => changeLanguage(lang.code)}
                                >
                                    <img
                                        src={lang.flag}
                                        alt={lang.label}
                                        className="mr-2 h-4 w-4"
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
                            <div
                                className="flex h-11 items-center gap-4"
                                key={`nav-item-${index}`}
                            >
                                <img
                                    className="size-6"
                                    src={item.img}
                                    alt={item.text + " icon"}
                                />
                                <div className="text-md">{item.text}</div>
                            </div>
                        );
                    })}
                </div>
            </nav>
            {/* 底部導覽行 */}
            <div className="fixed bottom-0 z-20 h-[84px] w-full bg-white px-[20px] pt-[10px] md:hidden">
                <div className="flex items-center justify-between">
                    {BOTTOM_ITEMS.map((item, index) => {
                        if (item === "Menu") {
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
                                        Menu
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div
                                className="flex flex-col items-center gap-1.5"
                                key={`bottom-item-${index}`}
                            >
                                <img
                                    className="size-[26px]"
                                    src={item.img}
                                    alt={`${item.text} icon`}
                                />
                                <div className="text-sm text-grayBlue">
                                    {item.text}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

const mapStateToProps = function (state) {
    return {
        userCenterTabKey: state.userCenter.userCenterPageTabKey,
    };
};

const mapDispatchToProps = function (dispatch) {
    return {
        changeUserCenterTabKey: (tabkey) => {
            dispatch(userCenterActions.changeUserCenterTabKey(tabkey));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
