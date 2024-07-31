import React from "react";
import Layout from "@/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
const login = () => {
    return (
        <Layout footer={false}>
            <div className="mx-auto max-w-[500px]">
                <div className="flex h-11 w-full items-center justify-between bg-white px-4 md:h-14">
                    <img
                        src="/img/icon/icon_close_black.svg"
                        className="cursor-pointer"
                        alt="close icon"
                    />
                    <h1 className="text-lg font-bold md:text-xl">Login</h1>
                    <div></div>
                </div>
                <div className="border">
                    <Tabs
                        defaultValue="Phone Number"
                        className="mx-auto w-full"
                    >
                        <TabsList>
                            <TabsTrigger value="Phone Number">
                                Phone Number
                            </TabsTrigger>
                            <TabsTrigger value="Username">Username</TabsTrigger>
                        </TabsList>
                        <TabsContent value="Phone Number">
                            Make changes to your account here.
                        </TabsContent>
                        <TabsContent value="Username">
                            Change your password here.
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </Layout>
    );
};

export default login;
