import React, { useEffect } from "react";
import { useRouter } from "next/router";

// hooks
import useCurrentPath from "$HOOKS/useCurrentPath";
import useLanguageNavigation from "$HOOKS/useLanguageNavigation";

// components
import Deposit from "./Deposit";

function WalletPortal() {
    const path = useCurrentPath(); //取得網址
    const router = useRouter();
    const currentLocale = getLocale(router);

    const { navigateTo, changeLanguage } = useLanguageNavigation();

    useEffect(() => {
        console.log("path", path);
        console.log("router", router);
        console.log("currentLocale", currentLocale);
    }, []);
    return (
        <>
            <Deposit />
        </>
    );
}

export default WalletPortal;
