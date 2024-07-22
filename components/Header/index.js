import React from "react";
import { Row, Col, Button, Icon, Menu, Modal, message, Spin } from "antd";
import dynamic from "next/dynamic";
import Router from "next/router";
import HasLogged from "./HasLogged";
import NotLogged from "./NotLogged";
import HeaderMenuBar from "./HeaderMenuBar";
import UserSign from "@/UserSign";
import { ApiPort, CMSAPIUrl } from "$ACTIONS/TLCAPI";
import {
    Cookie,
    formatAmount,
    getUrlVars,
    PopUpLiveChat as ContactCustomerService,
} from "$ACTIONS/util";
import { getMemberInfo } from "$DATA/userinfo";
import { get, post } from "$ACTIONS/TlcRequest";
import { LEARN_TIME } from "$ACTIONS/constantsData";
import HostConfig from "$ACTIONS/Host.config";
import CMSOBJ from "$DATA/stage.live.static.id";
import {
    getQueryVariable,
    getAffiliateReferralCode,
    Cookie as Cookiehelper,
} from "$ACTIONS/helper";
import OpenGame from "@/Games/openGame";
import ImageWithFallback from "@/ImageWithFallback/imgLocal";
import { translate } from "$ACTIONS/Translate";
import { connect } from "react-redux";
import { userCenterActions } from "$STORE/userCenterSlice";
import { pathNameList } from "$DATA/me.static";
// 邮箱链接重置密码
// const DynamicResetPassword = dynamic(import('@/ResetPassword'), {
// 	loading: () => (""),
// 	ssr: true
// });
import useZustandStore from "../../zustand/zustandStore";

function HeaderComponent(props) {
    switch (props.status) {
        case 0:
            return (
                <NotLogged
                    smallHeader={props.smallHeader}
                    AlreadLogin={() => props.this.AlreadLogin()}
                    {...props}
                />
            );
        case 1:
            return (
                <HasLogged
                    LoginExit={() => props.this.LoginExit()}
                    {...props}
                    key={JSON.stringify(props.status)}
                />
            );
        default:
            return null;
    }
}
const Header = () => {
    return (
        <header className="bg-blue-500 p-4 flex items-center justify-between">
            <div className="flex items-center">
                <button className="text-white mr-4 md:hidden">
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>
                <div className="text-white">FUN88</div>
            </div>
            <nav className="hidden md:flex space-x-4 items-center">
                <a href="#" className="text-white flex flex-col items-center">
                    <svg className="w-6 h-6" /* SVG for Home icon */></svg>
                    <span>Home</span>
                </a>
                <a href="#" className="text-white flex flex-col items-center">
                    <svg className="w-6 h-6" /* SVG for Sports icon */></svg>
                    <span>Sports</span>
                </a>
                {/* Add more links as needed */}
            </nav>
            <div className="flex items-center space-x-2">
                <button className="text-white">
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                    </svg>
                </button>
                <button
                    onClick={() => {
                        console.log("Login button clicked");
                        Router.push("/second-page");
                    }}
                    className="bg-white text-blue-500 px-4 py-2 rounded"
                >
                    Login
                </button>
                <button className="bg-green-500 text-white px-4 py-2 rounded">
                    Register
                </button>
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
