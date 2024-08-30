import { useState } from "react";
import { useRouter } from "next/router";
import { Check, Dot } from "lucide-react";
import { useTranslation } from "react-i18next";

//components
import Layout from "@/Layout";
import { Input } from "@/ui/input";
import { Button } from "@/ui/button";
import Toast from "@/common/Toast";

const CreateNewPassword = () => {
    const { t } = useTranslation(["register"]);
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [isPasswordBlurred, setIsPasswordBlurred] = useState(false);
    //控制新密碼的error顯示
    const [isNewPasswordBlurred, setIsNewPasswordBlurred] = useState(false);

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

    const showNewPasswordErrorMsg = () => {
        if (newPassword.length === 0) {
            return t("confirmed-password-is-required");
        }
        if (allPasswordValid && newPassword !== password) {
            return "Both passwords not match";
        }
        return "";
    };

    const isSubmitEnabled = allPasswordValid && newPassword === password;

    const handleSubmit = (e) => {
        //如果新密碼和舊密碼一樣
        Toast.error("New password cannot be the same as current password");
    };

    return (
        <Layout footer={false} status={2}>
            <div className="w-full">
                {/* 上方白色 Retrieval 背景 */}
                <div className="fixed top-11 w-full bg-white md:top-[64px]">
                    <div className="mx-auto max-w-[500px] px-4">
                        <div className="flex h-11 w-full items-center justify-between md:h-14">
                            <img
                                src="/img/icon/icon_arrow_left.svg"
                                className="size-5 cursor-pointer"
                                alt="close icon"
                                onClick={() => router.back()}
                            />
                            <h1 className="text-lg font-bold text-black md:text-xl">
                                Create New Password
                            </h1>
                            <div className="w-5" />
                        </div>
                    </div>
                </div>
                {/* 佔位元素 */}
                <div className="h-11 md:h-[56px]" />
                {/* image */}
                <div className="mb-10 mt-6 flex justify-center">
                    <img
                        className="h-[160px] w-[200px]"
                        src="/img/login/create-new-password.png"
                        alt="forgot password icon"
                    />
                </div>
                <div className="mx-auto max-w-[500px] px-4">
                    {/* Password input */}
                    <Input
                        type="password"
                        value={password}
                        placeholder={"password"}
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

                    {/* new password input */}
                    <Input
                        className="mt-3"
                        type="password"
                        value={newPassword}
                        placeholder={"Confirm New Password"}
                        icon={"/img/icon/icon_lock01.svg"}
                        onFocus={() => {
                            setIsNewPasswordBlurred(false);
                        }}
                        onBlur={() => {
                            setIsNewPasswordBlurred(true);
                        }}
                        onChange={(e) => setNewPassword(e.target.value)}
                        error={
                            isNewPasswordBlurred && showNewPasswordErrorMsg()
                        }
                    />
                </div>
                <div className="mx-auto max-w-[500px] px-4">
                    {/* 提交 */}
                    <Button
                        type={`${isSubmitEnabled ? "primary" : "disabled"}`}
                        disabled={!isSubmitEnabled}
                        className="mt-5 h-11 w-full text-lg md:mt-6 md:h-11 md:w-full"
                        onClick={handleSubmit}
                    >
                        Update
                    </Button>
                </div>
            </div>
        </Layout>
    );
};

export default CreateNewPassword;
