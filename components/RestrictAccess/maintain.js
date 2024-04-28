import React, { useState, useEffect } from "react";
import { Row, Col } from "antd";
import Layout from "@/Layout/other";
import { PopUpLiveChat } from "$ACTIONS/util";
import { translate } from "$ACTIONS/Translate";
import { isWebPSupported, Cookie } from "$ACTIONS/helper";
import Countdown from "react-countdown";
import Router from "next/router";

export default function Maintain() {
    const [time, setTime] = useState("00:00:00");
    useEffect(() => {
            const  maintainTime = Cookie.Get("maintainTime");
            // const maintainTime = new Date("2023-08-30T17:37:00");
            const now = new Date()
            setTime(maintainTime ? maintainTime : now)
    }, [])

    const navigatorPage = ()=>{
        Cookie.Delete("maintainTime")
        Router.push("/")
    } 

    return (
        <Layout>
            <div className="error-wrapper">
                <div className="error-img">
                    <img src={`${process.env.BASE_PATH}/img/restrictAccess/maintain.${isWebPSupported() ? "webp" : "png"}`} alt="maintainImg" />
                </div>
                <div className="error-right">
                    <div className="error-item">
                        <p className="error-text">{translate("系统维护")}</p>
                        <span
                            className="error-mes"
                            style={{ textAlign: "initial" }}
                        >
                            {translate("我们的系统正在维护中，请稍后尝试登录或通过以下方式联系在线客服")}
                        </span>
                        <div className="maintain-time">
                            <label>{translate("预计完成时间：")}</label>
                            <Countdown
                                daysInHours={true}
                                date={new Date(time)}
                                renderer={
                                    ({ days, hours, minutes, seconds, completed }) => {
                                        if (completed) {
                                            return(
                                                <Row type="flex" justify="space-between">
                                                    <Col>
                                                        <div className="time">{0}</div>
                                                        <center>{translate("时")}</center>
                                                    </Col>
                                                    <Col>
                                                        <div className="time">{0}</div>
                                                        <center>{translate("分")}</center>
                                                    </Col>
                                                    <Col>
                                                        <div className="time">{0}</div>
                                                        <center>{translate("秒")}</center>
                                                    </Col>
                                                </Row>
                                            )
                                        } else {
                                            return (
                                                <Row type="flex" justify="space-between">
                                                    <Col>
                                                        <div className="time">{hours}</div>
                                                        <center>{translate("时")}</center>
                                                    </Col>
                                                    <Col>
                                                        <div className="time">{minutes}</div>
                                                        <center>{translate("分")}</center>
                                                    </Col>
                                                    <Col>
                                                        <div className="time">{seconds}</div>
                                                        <center>{translate("秒")}</center>
                                                    </Col>
                                                </Row>
                                            );
                                        }
                                    }
                                }
                                onComplete={navigatorPage}
                            />
                        </div>
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
                            <div className="error-info-text">
                                <span>{translate("邮箱")}:</span>
                                <a href="#">cs@fun88.com</a>
                            </div>
                            <div className="error-info-text">
                                <span>{translate("联系电话")}:</span>
                                <a href="#">+84 400 842 345</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
