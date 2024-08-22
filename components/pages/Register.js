import React, { useState } from "react";
import Layout from "@/Layout";
import { Check, Dot } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/ui/accordion";

const Register = () => {
    const { t } = useTranslation("register");
    const [eyeOpen, setEyeOpen] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [referralCode, setReferralCode] = useState("");
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [isPasswordBlurred, setIsPasswordBlurred] = useState(false);
    const [isPhoneNumberBlurred, setIsPhoneNumberBlurred] = useState(false);

    //phoneNumber validation
    const phoneNumberLengthValid = phoneNumber.length === 10;
    const allPhoneNumberValid =
        phoneNumberLengthValid && phoneNumber.length > 0;

    const showPhoneNumberErrorMsg = () => {
        if (phoneNumber.length === 0) {
            return t("phone-number-is-required");
        }
        if (!phoneNumberLengthValid) {
            return t("phone-number-must-be-10-digits");
        }
        // 輸入10位數之後，會call api 看這個電話符不符合
        // return "Phone number is invalid, please try another";
    };

    //讓phoneNumber只接受數字
    const handlePhoneNumberChange = (e) => {
        const value = e.target.value;
        // 只允許數字輸入，移除所有非數字字符
        const numericValue = value.replace(/\D/g, "");
        setPhoneNumber(numericValue);
    };

    //password validation
    const isLengthValid = password.length >= 6 && password.length <= 16;
    const hasNoSpecialChars =
        password.length >= 6 && /^[a-zA-Z0-9]*$/.test(password); //判斷密碼是否有特殊字元
    const hasAlphabetAndNumber =
        password.length >= 6 && /^(?=.*[a-zA-Z])(?=.*\d)/.test(password); //判斷密碼是否有英文和數字
    const allPasswordValid = //判斷密碼條件是否全部都通過
        isLengthValid &&
        hasNoSpecialChars &&
        hasAlphabetAndNumber &&
        password.length > 0;
    const showPasswordErrorMsg = () => {
        if (password.length === 0) {
            return t("password-is-required");
        }
        if (!isLengthValid) {
            return t("password-must-be-at-least-6-characters-long");
        }
        if (!hasNoSpecialChars) {
            return t("password-contain-special-characters");
        }
        if (!hasAlphabetAndNumber) {
            return t("password-must-contain-at-least-1-alphabet-and-1-number");
        }
        return "";
    };

    const isSubmitEnabled = () => {
        return allPhoneNumberValid && allPasswordValid;
    };

    //註冊提交
    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <Layout footer={false}>
            <div className="w-full">
                {/* 上方白色 Register 背景 */}
                <div className="w-full bg-white">
                    <div className="mx-auto max-w-[500px] px-4">
                        <div className="flex h-11 w-full items-center justify-between md:h-14">
                            <img
                                src="/img/icon/icon_close_black.svg"
                                className="cursor-pointer"
                                alt="close icon"
                            />
                            <h1 className="text-lg font-bold text-black md:text-xl">
                                {t("register")}
                            </h1>
                            <div className="w-5" />
                        </div>
                    </div>
                </div>
                {/* sponsor image */}
                <div className="mb-5 mt-6 flex flex-col items-center justify-center md:mb-6">
                    <img
                        className="mb-2 size-16"
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

                {/* 下方 register 表單 */}
                <div className="mx-auto max-w-[500px] px-4">
                    {/* whatsapp */}
                    <div
                        className="flex h-11 w-full cursor-pointer items-center justify-between rounded-full
                                 bg-[#00c036] px-4 py-3 text-md text-white hover:bg-[#00B633]"
                    >
                        <div>{t("get-id-instantly-on-whatsapp")}</div>
                        <img
                            src="/img/icon/icon_whatsApp1.svg"
                            alt="whatsapp icon"
                        />
                    </div>
                    {/* divider */}
                    <div className="my-5 flex w-full items-center md:my-6">
                        <div className="flex-grow border-t border-gray2"></div>
                        <span className="mx-2 flex-shrink text-sm text-gray2">
                            {t("or")}
                        </span>
                        <div className="flex-grow border-t border-gray2"></div>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-3">
                        {/* Phone Number input */}
                        <div className="relative w-full">
                            <Input
                                type="tel"
                                value={phoneNumber}
                                placeholder={t("phone-number")}
                                onChange={handlePhoneNumberChange}
                                onFocus={() => setIsPhoneNumberBlurred(false)}
                                onBlur={() => setIsPhoneNumberBlurred(true)}
                                pattern="[0-9]*"
                                inputMode="numeric"
                                maxLength={10}
                                icon={"/img/icon/icon_phone.svg"}
                                prefix="+91"
                                error={
                                    isPhoneNumberBlurred &&
                                    !allPhoneNumberValid &&
                                    showPhoneNumberErrorMsg()
                                }
                            />
                        </div>
                        {/* Password input */}
                        <div className="relative w-full">
                            <Input
                                type={`${eyeOpen ? "text" : "password"}`}
                                value={password}
                                placeholder={t("password")}
                                icon={"/img/icon/icon_lock01.svg"}
                                onFocus={() => {
                                    setIsPasswordFocused(true);
                                    setIsPasswordBlurred(false);
                                }}
                                onBlur={() => {
                                    setIsPasswordFocused(false);
                                    setIsPasswordBlurred(true);
                                }}
                                onChange={(e) => setPassword(e.target.value)}
                                error={
                                    isPasswordBlurred &&
                                    !allPasswordValid &&
                                    showPasswordErrorMsg()
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

                        {/* password input validation */}
                        {isPasswordFocused && (
                            <ul className="mt-2 space-y-1 text-sm">
                                <li
                                    className={`flex items-center ${
                                        isLengthValid
                                            ? "text-green-500"
                                            : "text-gray-500"
                                    }`}
                                >
                                    {isLengthValid ? (
                                        <Check size={16} />
                                    ) : (
                                        <Dot size={16} />
                                    )}
                                    <span className="ml-2">
                                        {t("6-16-characters")}
                                    </span>
                                </li>
                                <li
                                    className={`flex items-center ${
                                        hasNoSpecialChars
                                            ? "text-green-500"
                                            : "text-gray-500"
                                    }`}
                                >
                                    {hasNoSpecialChars ? (
                                        <Check size={16} />
                                    ) : (
                                        <Dot size={16} />
                                    )}
                                    <span className="ml-2">
                                        {t("no-special-characters")}
                                    </span>
                                </li>
                                <li
                                    className={`flex items-center ${
                                        hasAlphabetAndNumber
                                            ? "text-green-500"
                                            : "text-gray-500"
                                    }`}
                                >
                                    {hasAlphabetAndNumber ? (
                                        <Check size={16} />
                                    ) : (
                                        <Dot size={16} />
                                    )}
                                    <span className="ml-2">
                                        {t("at-least-1-alphabet-and-1-number")}
                                    </span>
                                </li>
                            </ul>
                        )}
                        {/* referral code input */}
                        <Accordion type="single" collapsible>
                            <AccordionItem
                                value="item-1"
                                className="border-none"
                            >
                                <AccordionTrigger className="justify-start py-2 text-sm font-normal text-black">
                                    {t("i-have-referral-code")}
                                </AccordionTrigger>
                                <AccordionContent className="m-[1px]">
                                    <div className="relative w-full">
                                        <Input
                                            icon={
                                                "/img/icon/icon_referral_code.svg"
                                            }
                                            type="text"
                                            placeholder="referral code (optional)"
                                            value={referralCode}
                                            onChange={(e) =>
                                                setReferralCode(e.target.value)
                                            }
                                        />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        <div className="pb-2 text-sm text-gray1">
                            {t("register-legal-age")}
                        </div>
                        {/* Register button */}
                        <Button
                            type={`${isSubmitEnabled() ? "green" : "disabled"}`}
                            disabled={!isSubmitEnabled()}
                            className="h-11 w-full text-lg md:h-11 md:w-full"
                        >
                            {t("register")}
                        </Button>
                    </form>

                    {/* Have an account */}
                    <div className="mt-5 flex items-center justify-center gap-1 text-sm md:mt-6">
                        <div className="text-black">Have an account?</div>
                        <span className="cursor-pointer font-bold text-primary">
                            {t("login")}
                        </span>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Register;
