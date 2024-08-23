import Layout from "@/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { Input } from "@/ui/input";
import { Button } from "@/ui/button";
import { useState } from "react";
import { useRouter } from "next/router";

const ForgotPassword = () => {
    const [mainTab, setMainTab] = useState("Password");
    const router = useRouter();

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
                        onValueChange={(value) => setMainTab(value)}
                    >
                        <TabsList className="mb-5 flex items-center justify-center rounded-none border-b border-b-gray2 bg-transparent">
                            <TabsTrigger
                                value="Password"
                                className="w-full text-lg font-normal data-[state=active]:rounded-none data-[state=active]:border-b-2 data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:text-lg data-[state=active]:text-primary data-[state=active]:shadow-transparent"
                            >
                                Forgot Password
                            </TabsTrigger>
                            <TabsTrigger
                                value="Username"
                                className="w-full text-lg font-normal data-[state=active]:rounded-none data-[state=active]:border-b-2 data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:text-lg data-[state=active]:text-primary data-[state=active]:shadow-transparent"
                            >
                                Forgot Username
                            </TabsTrigger>
                        </TabsList>
                        {/* Forgot Password part */}
                        <TabsContent value="Password">
                            <Tabs
                                defaultValue="Phone Number"
                                className="w-full"
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
                                        <Input
                                            type="tel"
                                            placeholder={"Phone Number"}
                                            icon={"/img/icon/icon_phone.svg"}
                                            prefix="+91"
                                            // value={phoneNumber}
                                            // onChange={handlePhoneNumberChange}
                                            pattern="[0-9]*"
                                            inputMode="numeric"
                                            maxLength={10}
                                        />
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
                                        <Input
                                            type="email"
                                            placeholder={"Email"}
                                            icon={"/img/icon/icon_email.svg"}
                                            // value={phoneNumber}
                                            // onChange={handlePhoneNumberChange}
                                        />
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </TabsContent>

                        {/* Forgot Username part */}
                        <TabsContent value="Username">
                            <Tabs
                                defaultValue="Phone Number"
                                className="w-full"
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
                                        <Input
                                            type="tel"
                                            placeholder={"Phone Number"}
                                            icon={"/img/icon/icon_phone.svg"}
                                            prefix="+91"
                                            // value={phoneNumber}
                                            // onChange={handlePhoneNumberChange}
                                            pattern="[0-9]*"
                                            inputMode="numeric"
                                            maxLength={10}
                                        />
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
                                        <Input
                                            type="email"
                                            placeholder={"Email"}
                                            icon={"/img/icon/icon_email.svg"}
                                            // value={phoneNumber}
                                            // onChange={handlePhoneNumberChange}
                                        />
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
