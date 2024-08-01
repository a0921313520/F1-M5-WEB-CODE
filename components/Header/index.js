import React, { useState } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { Button } from "@/ui/button";
import { Squash as Hamburger } from "hamburger-react";
import { formatNumberWithCommas } from "@/lib/utils";
import usePathWithoutLocale from "/hooks/usePathWithoutLocale";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();
    const path = usePathWithoutLocale(); //取得網址
    console.log(path);
    let isLogin = false;
    return (
        <header className="fixed top-0 h-[44px] w-screen bg-primary px-4 py-2 md:h-[56px] md:px-5 md:py-1">
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
                        onClick={() => router.push(`/${router.query.locale}`)}
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
                                            {formatNumberWithCommas(123456227)}
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
                                    className="rounded-md"
                                    type="green"
                                    onClick={() =>
                                        router.push(
                                            `/${router.query.locale}/register`
                                        )
                                    }
                                >
                                    Register
                                </Button>
                                {path === "login" && (
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
