import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { useTranslation } from "react-i18next";

//components
import Layout from "@/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";

//lib
import useLanguageNavigation from "$HOOKS/useLanguageNavigation";

import { post } from "../../services/Request";

const Login = () => {
    const { navigateTo } = useLanguageNavigation();
    const { t } = useTranslation("login");
    const [eyeOpen, setEyeOpen] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const [phoneNumber, setPhoneNumber] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const [isPhoneNumberBlurred, setIsPhoneNumberBlurred] = useState(false);
    const [isUserNameBlurred, setIsUserNameBlurred] = useState(false);
    const [isPasswordBlurred, setIsPasswordBlurred] = useState(false);

    const [activeTab, setActiveTab] = useState("Phone Number");

    const handleRememberMeChange = () => {
        setRememberMe(!rememberMe);
    };

    //讓phoneNumber只接受數字
    const handlePhoneNumberChange = (e) => {
        const value = e.target.value;
        // 只允許數字輸入，移除所有非數字字符
        const numericValue = value.replace(/\D/g, "");
        setPhoneNumber(numericValue);
    };

    //切換tabs時，清除password onBlur
    const handleTabChange = (value) => {
        setActiveTab(value);
        setIsPasswordBlurred(false);
    };

    const isSubmitEnabled = () => {
        if (activeTab === "Phone Number") {
            return phoneNumber.length > 0 && password.length > 0;
        } else {
            return userName.length > 0 && password.length > 0;
        }
    };

    const login = () => {
        const params = {
            playername: "test9001",
            password:
                "sTvR+5GMio0Tq8WvK8H+ei4bnz06ll4iCy027VtW16i8BTMcZ+QhVYwzQZK7Rjeb2P0idgtMh+e45PBA69l/2CwUneu39cZjExdob+wfElCg8CAJyQ1I+6YkxQOIrSmJl5UAimnYvmp/AFItReaPmzXr2WDKepKiByY8F+khVTGIRVKtKKoIqO4/Z8LErj4f9M9Z7JBVxZq8/rSGQB3Nxk/kwWxTUw3/SwMYWKnrXe3aPElmlMIFBXG4U8mUSiH6mi2WPhoR322f7iNGth0BCgTGeVZd43kXwO9ZeVFpr+s64QPe6RIZjUAPv/HlXYv21Uq4qTypDnMmt/QO06EXEQ==",
        };
        const url = "https://Stgf1m5kzapi.com" + "/api/acc-login";
        post(url, params);
    };

    return (
        <Layout footer={false}>
            <div className="w-full">
                {/* 上方白色 Login 背景 */}
                <div className="fixed top-11 w-full bg-white md:top-[64px]">
                    <div className="mx-auto max-w-[500px] px-4">
                        <div className="flex h-11 w-full items-center justify-between md:h-14">
                            <img
                                src="/img/icon/icon_close_black.svg"
                                className="cursor-pointer"
                                alt="close icon"
                                onClick={() => navigateTo("/")}
                            />
                            <h1 className="text-lg font-bold text-black md:text-xl">
                                {t("login")}
                            </h1>
                            <div className="w-5" />
                        </div>
                    </div>
                </div>

                {/* 佔位元素 */}
                <div className="h-11 md:h-[56px]" />

                {/* 中間image */}
                <div className="mb-5 mt-6 flex flex-col items-center justify-center md:mb-6">
                    <img
                        className="mb-2 size-[16]"
                        src="/img/login/NUFC.png"
                        alt="NUFC image"
                    />
                    <div className="text-xxs text-black">
                        {t("official-shirt-sponsor")}
                    </div>
                    <div className="text-xxs text-gray1">
                        {t("newcastle-united-fc")}
                    </div>
                </div>
                {/* 下方 Login 表單 */}
                <div className="mx-auto max-w-[500px] px-4">
                    <Tabs
                        defaultValue="Phone Number"
                        className="w-full"
                        onValueChange={handleTabChange}
                    >
                        <TabsList className="mb-5 flex items-center justify-center rounded-full">
                            <TabsTrigger
                                value="Phone Number"
                                className="w-full rounded-full"
                            >
                                {t("phone-number")}
                            </TabsTrigger>
                            <TabsTrigger
                                value="Username"
                                className="w-full rounded-full"
                            >
                                {t("username")}
                            </TabsTrigger>
                        </TabsList>
                        {/* phone number tab */}
                        <TabsContent
                            className="flex flex-col items-center justify-center gap-3"
                            value="Phone Number"
                        >
                            {/* Phone Number input */}
                            <div className="relative w-full">
                                <Input
                                    type="tel"
                                    placeholder={t("phone-number")}
                                    icon={"/img/icon/icon_phone.svg"}
                                    prefix="+91"
                                    value={phoneNumber}
                                    onChange={handlePhoneNumberChange}
                                    onFocus={() =>
                                        setIsPhoneNumberBlurred(false)
                                    }
                                    onBlur={() => setIsPhoneNumberBlurred(true)}
                                    pattern="[0-9]*"
                                    inputMode="numeric"
                                    maxLength={10}
                                    error={
                                        phoneNumber.length === 0 &&
                                        isPhoneNumberBlurred &&
                                        t("phone-number-is-required")
                                    }
                                />
                            </div>
                            {/* Password input */}
                            <div className="relative w-full">
                                <div className="absolute left-4 top-2.5 flex items-center">
                                    <img
                                        className="size-5"
                                        src="/img/icon/icon_lock01.svg"
                                        alt="phone icon"
                                    />
                                </div>
                                <Input
                                    type={`${eyeOpen ? "text" : "password"}`}
                                    placeholder={t("password")}
                                    icon={"/img/icon/icon_lock01.svg"}
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    onFocus={() => setIsPasswordBlurred(false)}
                                    onBlur={() => setIsPasswordBlurred(true)}
                                    error={
                                        password.length === 0 &&
                                        isPasswordBlurred &&
                                        t("password-is-required")
                                    }
                                />
                                <div className="absolute right-4 top-2.5 flex items-center">
                                    <img
                                        className="size-5 cursor-pointer"
                                        onClick={() => setEyeOpen(!eyeOpen)}
                                        src={`/img/icon/icon_eye_${
                                            eyeOpen ? "open" : "close"
                                        }.svg`}
                                        alt="eyes"
                                    />
                                </div>
                            </div>
                        </TabsContent>
                        {/* username tab */}
                        <TabsContent
                            value="Username"
                            className="flex flex-col items-center justify-center gap-3"
                        >
                            {/* username input */}
                            <div className="relative w-full">
                                <Input
                                    type="text"
                                    placeholder={t("username")}
                                    icon={"/img/icon/icon_profile.svg"}
                                    value={userName}
                                    onChange={(e) =>
                                        setUserName(e.target.value)
                                    }
                                    onFocus={() => setIsUserNameBlurred(false)}
                                    onBlur={() => setIsUserNameBlurred(true)}
                                    error={
                                        userName.length === 0 &&
                                        isUserNameBlurred &&
                                        t("username-is-required")
                                    }
                                />
                            </div>
                            {/* Password input */}
                            <div className="relative w-full">
                                <Input
                                    type={`${eyeOpen ? "text" : "password"}`}
                                    placeholder={t("password")}
                                    icon={"/img/icon/icon_lock01.svg"}
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    onFocus={() => setIsPasswordBlurred(false)}
                                    onBlur={() => setIsPasswordBlurred(true)}
                                    error={
                                        password.length === 0 &&
                                        isPasswordBlurred &&
                                        t("password-is-required")
                                    }
                                />
                                <div className="absolute right-4 top-2.5 flex items-center">
                                    <img
                                        className="size-5 cursor-pointer"
                                        onClick={() => setEyeOpen(!eyeOpen)}
                                        src={`/img/icon/icon_eye_${
                                            eyeOpen ? "open" : "close"
                                        }.svg`}
                                        alt="eyes"
                                    />
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                    {/* remember me part */}
                    <div className="my-5 flex w-full items-center justify-between text-sm md:my-6">
                        <div className="relative flex items-center gap-2">
                            <input
                                className="peer h-4 w-4 cursor-pointer appearance-none rounded
                                            bg-white checked:bg-primary hover:bg-primary checked:hover:bg-primary"
                                type="checkbox"
                                id="remember-me"
                                checked={rememberMe}
                                onChange={handleRememberMeChange}
                            />
                            <FaCheck className="pointer-events-none absolute left-0.5 top-0.5 h-3 w-3 text-white opacity-0 peer-checked:opacity-100" />
                            <label
                                className="cursor-pointer select-none text-black"
                                htmlFor="remember-me"
                            >
                                {t("remember-me")}
                            </label>
                        </div>
                        <div
                            className="cursor-pointer text-primary"
                            onClick={() => {
                                navigateTo("/forgot-password");
                            }}
                        >
                            {t("forgot")}
                        </div>
                    </div>
                    {/* Login button */}
                    <Button
                        type={`${isSubmitEnabled() ? "primary" : "disabled"}`}
                        disabled={!isSubmitEnabled()}
                        className="h-11 w-full text-lg md:h-11 md:w-full"
                        onClick={login}
                    >
                        {t("login")}
                    </Button>
                    {/* Dont have an account */}
                    <div className="mt-5 flex items-center justify-center gap-1 text-sm md:mt-6">
                        <div className="text-black">
                            {t("dont-have-an-account")}
                        </div>
                        <span
                            className="cursor-pointer font-bold text-primary"
                            onClick={() => navigateTo("/register")}
                        >
                            {t("register")}
                        </span>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Login;
