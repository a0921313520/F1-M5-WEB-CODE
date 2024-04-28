import Head from "next/head";
import dynamic from "next/dynamic";
import Header from "@/Header";
import Footer from "@/Footer";
import { Spin } from "antd";
import "../../config/Global";
import "../../config/Globalfun";
import React, { useState, useEffect } from "react";
import SelfExclusionModal from "../SelfExclusionModal";
import Router from "next/router";
import { translate } from "$ACTIONS/Translate";
import SeoFooterContainer from "@/Footer/SeoContainer";

const DynamicRestrictAccess = dynamic(import("@/RestrictAccess/ipError"), {
    loading: () => (
        <Spin
            style={{ position: "absolute", top: "30%", left: 0, right: 0 }}
            spinning={true}
            size="large"
            tip={translate("加载中")}
        />
    ),
    ssr: false,
});

const DynamicMaintain = dynamic(import("@/RestrictAccess/maintain"), {
    loading: () => (
        <Spin
            style={{ position: "absolute", top: "30%", left: 0, right: 0 }}
            spinning={true}
            size="large"
            tip={translate("加载中")}
        />
    ),
    ssr: false,
});
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
    // global.HttpStatus =4;
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
                    {!!props.seoContainer ? <SeoFooterContainer seocontent={props.seoContainer}/> : null}
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
            return <DynamicMaintain />;
        case 4:
            return <DynamicRestrictAccess httpStatus={global.HttpStatus} />;
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
    // 默认需要的内容
    children,
    // 锁定Header状态栏大小
    setLockHeader,
    // 设置登陆状态
    setLoginStatus,
    // 锁定Header状态栏大小所需要的配置参数
    headerHeightLock,
    // 设置Header部分未读标识（小红点）
    setCircleHasUnRead,
    // 设置UserCenter部分未读标识（小红点）
    setUsercnnterCircle,
    // 设置UserCenter的钱
    setUserCenterMoney,
    // 设置UserCenter的会员信息
    setUserCenterMemberInfo,
    // 顶层样式表名称
    wrapperClassName,
    // 自定义Header
    definedHeaderNode,
    title = "FUN88VN",
    description = "",
    Keywords = "",
    getPromotionList,
    seoContainer="",
    seoData
}) => [
    <Head key="layout-head">
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <link
            rel="shortcut icon"
            type="image/x-icon"
            href={`${process.env.BASE_PATH}/img/logo/favicon.ico`}
        />
        <title>{seoData?.title ?? title}</title>
        <meta name="description" content={seoData?.description ?? description} />
        <meta name="Keywords" content={seoData?.keyword ?? Keywords} />
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
        {/* <SelfExclusionModal
            ModalType={1}
            OpenModalUrl="Home"
            afterCloseModal={() => {
                Router.push("/");
            }}
        /> */}
    </>,
];
