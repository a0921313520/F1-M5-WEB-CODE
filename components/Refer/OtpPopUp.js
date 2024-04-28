import React, { useState, useEffect } from "react";
import { Row, Col, Button, Modal, Spin } from "antd";
import ReadMore from "@/OTP/ReadMore";
import { get } from "$ACTIONS/TlcRequest";
import { ApiPort } from "$ACTIONS/TLCAPI";
import {translate} from "$ACTIONS/Translate";
function OtpPopUp({
    otpVisible,
    memberInfo,
    otpModal,
    allowClose,
    setPhoneVisible,
    setEmailVisible
}) {
    // 初次彈窗顯示，控制彈窗，彈窗類別參數，會員信息
    const [readStep, setReadStep] = useState(0); // 0 選擇驗證框、1 了解更多框   4.密码修改
    const [bgHover, setBgHover] = useState(null); // hover 控制狀態
    const [attemptRemaining, setAttemptRemaining] = useState(5); // 电话剩餘次數
    const [emailattemptRemaining, setEmailAttemptRemaining] = useState(5); // 邮箱剩餘次數
    const [loading, setloading] = useState(false); // 加载状态

    useEffect(() => {
        GetVerificationAttempt("Phone");
        GetVerificationAttempt("Email");
    }, []);

    let verifyList = [];
    if (attemptRemaining <= 0 && emailattemptRemaining > 0) {
        verifyList = [
            {
                name: "Email",
                content:  translate("认证方式电子邮件"),
                defaultImg: "/vn/img/user/otpVerify/e.svg",
            },
        ];
    } else if (emailattemptRemaining <= 0 && attemptRemaining > 0) {
        verifyList = [
            {
                name: "Phone",
                content: translate("认证方式电话号码"),
                defaultImg: "/vn/img/user/otpVerify/p.svg",
            },
        ];
    } else if (emailattemptRemaining > 0 && attemptRemaining > 0) {
        verifyList = [
            {
                name: "Phone",
                content: translate("认证方式电话号码"),
                defaultImg: "/vn/img/user/otpVerify/p.svg",
            },
            {
                name: "Email",
                content: translate("认证方式电子邮件"),
                defaultImg: "/vn/img/user/otpVerify/e.svg",
            }
        ];
    }

    /**
     * 获取剩余验证次数
     * @param {String} verifyType 
     */
    const GetVerificationAttempt = (verifyType) => {
        setloading(true);
        let channelType = verifyType == "Phone" ? "SMS" : "Email";
        get(ApiPort.VerificationAttempt +`&channelType=${channelType}&serviceAction=ContactVerification`)
            .then((data) => {
                setloading(false);
                if (data.isSuccess) {
                    if (channelType === "SMS") {
                        setAttemptRemaining(data.result.attempt);
                    } else {
                        setEmailAttemptRemaining(data.result.attempt);
                    }
                }
            })
            .catch((err) => {
                setloading(false);
            });
    };

    /**
     * 关闭弹窗
     * @param {String} param 
     * @param {Boolean} otpVisible
     * @param {Boolean} status 
     * @returns 
     */
    const VerifyCategory = (param, otpVisible, status) => {
        otpModal(otpVisible)
        if (param == "Phone") return memberInfo && setPhoneVisible(status);
        if (param == "Email") return memberInfo && setEmailVisible(status);
        if (param == "CS" ) return otpModal(false) && global.PopUpLiveChat();
    };

    return (
        <React.Fragment>
            <Modal
                title={translate("帐户验证")}
                className={`${readStep === 0 ? "loginOTPModal" : ""} ${
                    readStep == 1 ? "SecurityAnnouncement" : ""
                } modal-pubilc  OTP-modal `}
                visible={!memberInfo.isVerifiedEmail ? false : otpVisible} //会有老会员没有邮箱的情况
                closable={readStep == 1||allowClose ? true : false}
                centered={true}
                width={readStep == 0 ? 400 : 500}
                footer={null}
                zIndex={1500}
                onCancel={() => {
                    allowClose ? VerifyCategory("",false,false) :setReadStep(0);
                }}
            >
                {loading && <Spin size="large" tip="加载中" />}
                {readStep == 0 && (
                    <React.Fragment>
                        <Row>
                            <Col span={24}>
                                <div className="otp-modal-description">
                                <h3 className="otp-modal-title">{translate("身份验证保护帐户")}</h3>
                                    {translate("请验证您的信息，以确保您的账户安全可靠，防止信息被盗，降低交易风险。")}
                                    <Button
                                        className="otpBtn"
                                        onClick={() => {
                                            setReadStep(1);
                                            Pushgtagdata("Details_loginOTP");
                                        }}
                                        block
                                    >
                                        {translate("了解更多")}
                                    </Button>
                                </div>
                            </Col>

                            <div className="OtpList">
                                {memberInfo &&
                                    verifyList &&
                                    verifyList.map((item, index) => {
                                        if (!memberInfo.isVerifiedEmail && item.name == "Email") return;
                                        return (
                                            <div key={index} className="otpBox">
                                                <div
                                                    className={`verify-icon-wrap ${
                                                        item.name == bgHover
                                                            ? "red-" + item.name
                                                            : "default"
                                                    }`}
                                                    onClick={() => {
                                                        VerifyCategory(
                                                            item.name,
                                                            false,
                                                            true
                                                        );
                                                        Pushgtagdata(
                                                            "Verification",
                                                            "Click",
                                                            `${item.name}_LoginOTP`
                                                        );
                                                    }}
                                                    onMouseEnter={() =>
                                                        setBgHover(item.name)
                                                    }
                                                    onMouseLeave={() =>
                                                        setBgHover(null)
                                                    }
                                                >
                                                    <img
                                                        className="verify-icon"
                                                        src={item.defaultImg}
                                                        alt={item.name}
                                                    />
                                                </div>
                                                <Button
                                                    type="primary"
                                                    onClick={() => {
                                                        VerifyCategory(
                                                            item.name,
                                                            false,
                                                            true
                                                        );
                                                        Pushgtagdata(
                                                            "Verification",
                                                            "Click",
                                                            `${item.name}_LoginOTP`
                                                        );
                                                    }}
                                                >
                                                    {item.content}
                                                </Button>
                                            </div>
                                        );
                                    })}
                            </div>
                            {!verifyList && (
                                <div className="OtpList">
                                    <div className="otpBox">
                                        <div
                                            className={`verify-icon-wrap ${
                                                "CS" == bgHover
                                                    ? "red-" + "CS"
                                                    : "default"
                                            }`}
                                            onClick={() => {
                                                VerifyCategory("CS");
                                                Pushgtagdata("CS_loginOTP");
                                            }}
                                            onMouseEnter={() =>
                                                setBgHover("CS")
                                            }
                                            onMouseLeave={() =>
                                                setBgHover(null)
                                            }
                                        >
                                            <img
                                                className="verify-icon"
                                                src={`${process.env.BASE_PATH}/img/user/otpVerify/cs.svg`}
                                                alt="CS"
                                            />
                                        </div>
                                        <Button
                                            type="primary"
                                            onClick={() => {
                                                VerifyCategory("CS");
                                                Pushgtagdata("CS_loginOTP");
                                            }}
                                        >
                                            {translate("在线客服")}
                                        </Button>
                                    </div>
                                </div>
                            )}
                            <br />
                            <Button
                                onClick={() => {
                                    global.globalExit();
                                }}
                                block
                                ghost
                            >
                                {translate("稍后认证")}
                            </Button>
                        </Row>
                    </React.Fragment>
                )}
                {/* 了解更多 */}
                {readStep == 1 && (
                    <ReadMore
                        VerifyCategory={VerifyCategory}
                        setReadStep={setReadStep}
                    />
                )}
            </Modal>
        </React.Fragment>
    );
}

export default OtpPopUp;
