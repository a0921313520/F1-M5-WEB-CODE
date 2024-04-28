/*
 * @Author: Alan
 * @Date: 2023-06-14 15:11:45
 * @LastEditors: Alan
 * @LastEditTime: 2023-06-21 08:25:43
 * @Description: 404页面
 * @FilePath: /F1-M1-WEB-Code/pages/404.js
 */
import React from "react";
import Layout from "@/Layout/other";
import { PopUpLiveChat } from "$ACTIONS/util";
import {translate} from "$ACTIONS/Translate";

//export時會被靜態頁面取代(moveFile.js)
export default function Custom404() {
    return (
        <Layout notFound={true}>
            <div className="error-wrapper">
                <div className="error-img">
                    <img src={`${process.env.BASE_PATH}/img/error404/errorImage.png`} alt="404Image" />
                </div>
                <div className="error-right">
                    <div className="error-item">
                        <p className="error-text">{translate("无法找到页面")}</p>
                        <div className="error-icon">
                            <img
                                src={`${process.env.BASE_PATH}/img/error404/errorIcon.png`}
                                alt="404Icon"
                            />
                        </div>
                        <span className="error-mes">
                            {translate("您的网页暂时无法找到。若仍然无法打开页面，请您尽快联系客服。")}
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
                        <div className="error-information">
                            {/* <div className="error-info-text">
                                <span>电子邮箱:</span>
                                <a href="#">cs@fun88.com</a>
                            </div> */}
                            <div className="error-info-text">
                                <span>{translate("电话号码")}:</span>
                                <a href="#"> +84 400 842 345 </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
