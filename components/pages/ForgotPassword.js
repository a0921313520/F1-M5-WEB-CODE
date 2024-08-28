import { useState } from "react";
import { useRouter } from "next/router";
//components
import Layout from "@/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { Input } from "@/ui/input";
import { Button } from "@/ui/button";

const ForgotPassword = () => {
    const [mainTab, setMainTab] = useState("Password");
    const [subTab, setSubTab] = useState("Phone Number");
    const [inputValue, setInputValue] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const router = useRouter();

    const onMainTabChange = (value) => {
        setMainTab(value);
        setInputValue("");
        setErrorMsg("");
    };

    const onSubTabChange = (value) => {
        setSubTab(value);
        setInputValue("");
        setErrorMsg("");
    };

    const renderInput = () => {
        const isPhoneNumber = subTab === "Phone Number";
        return (
            <Input
                type={isPhoneNumber ? "tel" : "email"}
                placeholder={isPhoneNumber ? "Phone Number" : "Email"}
                icon={
                    isPhoneNumber
                        ? "/img/icon/icon_phone.svg"
                        : "/img/icon/icon_email.svg"
                }
                value={inputValue}
                onChange={handleInputChange}
                error={inputValue.length > 0 && errorMsg}
                prefix={isPhoneNumber ? "+91" : null}
                pattern={isPhoneNumber ? "[0-9]*" : null}
                inputMode={isPhoneNumber ? "numeric" : null}
                maxLength={isPhoneNumber ? 10 : null}
            />
        );
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        if (subTab === "Phone Number") {
            // 只允許數字輸入，移除所有非數字字符
            const numericValue = value.replace(/\D/g, "");
            setInputValue(numericValue);
        } else {
            setInputValue(value);
        }

        //會call api 驗證 input 是否正確
        //如果不正確，顯示 error message

        if (subTab === "Phone Number") {
            setErrorMsg("Phone Number is invalid.");
        } else if (subTab === "Email") {
            setErrorMsg("Email is invalid.");
        }
    };

    return (
        <Layout footer={false}>
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
                                Retrieval
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
                        src="/img/login/forgot-password.png"
                        alt="forgot password icon"
                    />
                </div>

                <div className="mx-auto max-w-[500px] px-4">
                    <Tabs
                        defaultValue="Password"
                        className=""
                        onValueChange={(value) => onMainTabChange(value)}
                    >
                        <TabsList className="mb-5 flex items-center justify-center rounded-none border-b border-b-gray2 bg-transparent px-0 pb-0">
                            {["Password", "Username"].map((tab) => (
                                <TabsTrigger
                                    key={tab}
                                    value={tab}
                                    className="w-full text-lg font-normal data-[state=active]:rounded-none data-[state=active]:border-b-2 data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:text-lg data-[state=active]:text-primary data-[state=active]:shadow-transparent"
                                >
                                    {tab}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        {/* Forgot Password part */}
                        <TabsContent value="Password">
                            <Tabs
                                defaultValue="Phone Number"
                                className="w-full"
                                onValueChange={(value) => onSubTabChange(value)}
                            >
                                <TabsList className="mb-5 flex items-center justify-center rounded-full">
                                    <TabsTrigger
                                        value="Phone Number"
                                        className="w-full rounded-full"
                                    >
                                        Phone Number
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="Email"
                                        className="w-full rounded-full"
                                    >
                                        Email
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent
                                    value="Phone Number"
                                    className="space-y-5 md:space-y-6"
                                >
                                    <p className="text-sm">
                                        Please enter the registered phone number
                                        where you need to retrieve the login
                                        password.
                                    </p>
                                    <div className="relative w-full">
                                        {renderInput()}
                                    </div>
                                </TabsContent>
                                <TabsContent
                                    value="Email"
                                    className="space-y-5 md:space-y-6"
                                >
                                    <p className="text-sm">
                                        Please enter the registered email you
                                        need to retrieve the login password.
                                    </p>
                                    <div className="relative w-full">
                                        {renderInput()}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </TabsContent>

                        {/* Forgot Username part */}
                        <TabsContent value="Username">
                            <Tabs
                                defaultValue="Phone Number"
                                className="w-full"
                                onValueChange={(value) => onSubTabChange(value)}
                            >
                                <TabsList className="mb-5 flex items-center justify-center rounded-full">
                                    <TabsTrigger
                                        value="Phone Number"
                                        className="w-full rounded-full"
                                    >
                                        Phone Number
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="Email"
                                        className="w-full rounded-full"
                                    >
                                        Email
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent
                                    value="Phone Number"
                                    className="space-y-5 md:space-y-6"
                                >
                                    <p className="text-sm">
                                        Please enter registered phone number
                                        where you need to retrieve the username.
                                    </p>
                                    <div className="relative w-full">
                                        {renderInput()}
                                    </div>
                                </TabsContent>
                                <TabsContent
                                    value="Email"
                                    className="space-y-5 md:space-y-6"
                                >
                                    <p className="text-sm">
                                        Please enter registered email where you
                                        need to retrieve the username.
                                    </p>
                                    <div className="relative w-full">
                                        {renderInput()}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </TabsContent>
                    </Tabs>
                    {/* 提交 */}
                    <Button
                        type={"primary"}
                        // disabled={!isSubmitEnabled()}
                        className="mt-5 h-11 w-full text-lg md:mt-6 md:h-11 md:w-full"
                    >
                        Recover {mainTab}
                    </Button>
                </div>
            </div>
        </Layout>
    );
};

export default ForgotPassword;
