import Head from "next/head";
import dynamic from "next/dynamic";
import Header from "@/Header";
import Footer from "@/Footer";
import "../../config/Global";
import "../../config/Globalfun";
import React, { useState, useEffect } from "react";
import Router from "next/router";
import SeoFooterContainer from "@/Footer/SeoContainer";

function MainComponent(props) {
    const commonParams = {
        headerHeightLock: props.headerHeightLock,
        setLockHeader: props.setLockHeader,
        setLoginStatus: props.setLoginStatus,
        setCircleHasUnRead: props.setCircleHasUnRead,
        setUsercnnterCircle: props.setUsercnnterCircle,
        setUserCenterMoney: props.setUserCenterMoney,
        setUserCenterMemberInfo: props.setUserCenterMemberInfo,
        getPromotionList: props.getPromotionList,
        definedHeaderNode: props.definedHeaderNode,
    };
    const globalStatusKey = global.HttpStatus || props.status || 1;

    switch (globalStatusKey) {
        case 1:
            return (
                <div
                    className={`tlc-container-wrapper ${
                        props.wrapperClassName ? props.wrapperClassName : ""
                    } ${
                        props.headerHeightLock
                            ? "_" + props.headerHeightLock
                            : ""
                    }`}
                >
                    <Header key="main-header" {...commonParams} />
                    {props.children}
                    <Footer key="main-footer" />
                    {props.seoContainer ? (
                        <SeoFooterContainer seocontent={props.seoContainer} />
                    ) : null}
                </div>
            );
        case 2:
            return (
                <div
                    className={`tlc-container-wrapper ${
                        props.wrapperClassName ? props.wrapperClassName : ""
                    } ${
                        props.headerHeightLock
                            ? "_" + props.headerHeightLock
                            : ""
                    }`}
                >
                    <Header key="main-header" {...commonParams} />
                    {props.children}
                </div>
            );
        case 3:
            return null;
        case 4:
            return null;
        case 5:
            return <React.Fragment>{props.children}</React.Fragment>;
        case 6:
            return (
                <div
                    className={`tlc-container-wrapper-Diamond ${
                        props.wrapperClassName ? props.wrapperClassName : ""
                    } ${
                        props.headerHeightLock
                            ? "_" + props.headerHeightLock
                            : ""
                    }`}
                >
                    <Header key="main-header" {...commonParams} />
                    {props.children}
                    <Footer key="main-footer" />
                </div>
            );
        case 7:
            return <DynamicRestrictAccess />;
        default:
            return <div>500 Error!</div>;
    }
}

export default ({
                    status,
                    children,
                    setLockHeader,
                    setLoginStatus,
                    headerHeightLock,
                    setCircleHasUnRead,
                    setUsercnnterCircle,
                    setUserCenterMoney,
                    setUserCenterMemberInfo,
                    wrapperClassName,
                    definedHeaderNode,
                    title = "FUN88VN",
                    description = "",
                    Keywords = "",
                    getPromotionList,
                    seoContainer = "",
                    seoData,
                }) => {
    // 抓取當前 domain
    const host = typeof window !== "undefined" ? window.location.hostname : "";

    // 判斷是否為 p5stag1 到 p5stag5
    const isP5Staging = /p5stag[1-5]/.test(host);

    // 根據判斷結果設置 robots meta 標籤
    const robotsContent = isP5Staging ? "index,follow" : "noindex,nofollow";

    // 更新 seoData，如果是 P5 Staging 環境
    if (isP5Staging) {
        seoData = {
            title: "P5 Staging Environment",
            description: "This is the P5 Staging environment",
            keywords: "staging, p5, environment",
            ...seoData,
        };
    }

    return [
        <Head key="layout-head">
            <meta charSet="utf-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
            <link
                rel="shortcut icon"
                type="image/x-icon"
                href={`${process.env.BASE_PATH}/img/logo/favicon.ico`}
            />
            <title>{seoData?.title ?? title}</title>
            <meta
                name="description"
                content={seoData?.description ?? description}
            />
            <meta name="Keywords" content={seoData?.keyword ?? Keywords} />
            <meta name="robots" content={robotsContent} />
        </Head>,
        <>
            <MainComponent
                key="main-component"
                status={status}
                setLockHeader={setLockHeader}
                setLoginStatus={setLoginStatus}
                wrapperClassName={wrapperClassName}
                headerHeightLock={headerHeightLock}
                setCircleHasUnRead={setCircleHasUnRead}
                setUsercnnterCircle={setUsercnnterCircle}
                setUserCenterMoney={setUserCenterMoney}
                setUserCenterMemberInfo={setUserCenterMemberInfo}
                children={children}
                getPromotionList={getPromotionList}
                definedHeaderNode={definedHeaderNode}
                seoContainer={seoData?.webFooter ?? seoContainer?.content}
            />
        </>,
    ];
};
