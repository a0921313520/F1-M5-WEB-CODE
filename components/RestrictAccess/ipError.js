import React from "react";
import Layout from "@/Layout/other";
import { PopUpLiveChat } from "$ACTIONS/util";
import {translate} from "$ACTIONS/Translate";
//export時會被靜態頁面取代(moveFile.js)

export default function Custom404() {
    return (
        <Layout>
            <div className="error-wrapper">
                <div className="error-img">
                    <img
                        src={`${process.env.BASE_PATH}/img/restrictAccess/restricyAccessImg.png`}
                        alt="restricyAccessImg"
                    />
                </div>
                <div className="error-right">
                    <div className="error-item">
                        <p className="error-text">{translate("访问受限")}</p>
                        <div className="error-block">
                            <img
                                src={`${process.env.BASE_PATH}/img/restrictAccess/block.png`}
                                alt="404Icon"
                            />
                        </div>
                        <span
                            className="error-mes"
                            style={{ textAlign: "initial" }}
                        >
                            {translate("欢迎。 我们意识到您正在从未经授权支持和使用该服务的国家/地区进行访问。 请联系客户服务部门寻求帮助或刷新应用程序。")}
                        </span>
                        <button
                            className="error-btn"
                            onClick={() => PopUpLiveChat()}
                        >
                            <img
                                src={`${process.env.BASE_PATH}/img/error404/service.png`}
                                alt="customerServiceIcon"
                            />
                            <span>{translate("在线客服")}</span>
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
