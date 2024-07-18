import React, { useState, useEffect } from "react";
import { Row, Col, Button, Modal, Spin } from "antd";
import EmailVerify from "@/Verification/EmailVerify";
import PhoneVerify from "@/Verification/PhoneVerify";
import ReadMore from "./ReadMore";
import PassWordVerify from "./PassWordVerify";
import { get } from "$ACTIONS/TlcRequest";
import { ApiPort } from "$ACTIONS/TLCAPI";
import { translate } from "$ACTIONS/Translate";
import { getVerificationAttempt } from "$DATA/userinfo";

function OtpPopUp({
    otpVisible,
    otpModal,
    otpParam,
    memberInfo,
    GetThroughoutVerification,
}) {
    // 初次彈窗顯示，控制彈窗，彈窗類別參數，會員信息
    const [readStep, setReadStep] = useState(0); // 0 選擇驗證框、1 了解更多框   4.密码修改
    const [bgHover, setBgHover] = useState(null); // hover 控制狀態
    const [phoneVisible, setPhoneVisible] = useState(false); // 彈手機驗證框
    const [emailVisible, setEmailVisible] = useState(false); // 彈email驗證框
    const [attemptRemaining, setAttemptRemaining] = useState(5); // 电话剩餘次數
    const [emailattemptRemaining, setEmailAttemptRemaining] = useState(5); // 邮箱剩餘次數
    const [loading, setLoading] = useState(false); // 加载状态
    const [verifyList, updateVerifyList] = useState([]); //可验证的方式
    const prams = {
        // 引用參數
        memberInfo: memberInfo && memberInfo,
        closeModal: () => setPhoneVisible(false),
        otpParam: otpParam,
        attemptRemaining: attemptRemaining,
        setAttemptRemaining: setAttemptRemaining,
        emailattemptRemaining: emailattemptRemaining,
        setEmailAttemptRemaining: setEmailAttemptRemaining,
        GetThroughoutVerification: GetThroughoutVerification,
    };

    useEffect(() => {
        const action = otpParam === "login-otpPwd" ? "Revalidate" : "OTP";
        // 获取用户验证次数 (SMS/Voice)/Email 短信/语音/邮箱
        // SMS/Voice 共用次数
        const fetchData = async () => {
            try {
                setLoading(true);
                const [res1, res2] = await Promise.all([
                    get(
                        ApiPort.VerificationAttempt +
                            `&channelType=Email&serviceAction=${action}`,
                    ),
                    get(
                        ApiPort.VerificationAttempt +
                            `&channelType=SMS&serviceAction=${action}`,
                    ),
                ]);
                if (res1?.isSuccess && res1.result?.attempt) {
                    setEmailAttemptRemaining(res1.result.attempt);
                }
                if (res2?.isSuccess && res2.result?.attempt) {
                    setAttemptRemaining(res2.result.attempt);
                }
            } catch (error) {
                console.error(
                    "Error VerificationAttempt 获取用户验证次数:",
                    error,
                );
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        let verifyList = "";
        if (attemptRemaining <= 0 && emailattemptRemaining > 0) {
            verifyList = [
                {
                    name: "Email",
                    content: translate("认证方式电子邮件"),
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
                },
            ];
        }
        updateVerifyList(verifyList);
    }, [attemptRemaining, emailattemptRemaining]);

    /**
     * 关闭弹窗
     * @param {STring} type 类型
     * @param {Bool} otpVisible 开关
     * @param {Bool} status 开关
     */
    const VerifyCategory = (type, otpVisible, status) => {
        console.log(
            "🚀 ~ VerifyCategory ~ type, otpVisible, status:",
            type,
            otpVisible,
            status,
        );
        if (type == "Phone") {
            setPhoneVisible(status);
            setReadStep(0);
            otpModal(otpVisible);
        } else if (type == "Email") {
            setEmailVisible(status);
            setReadStep(0);
            otpModal(otpVisible);
        } else if (type == "CS") {
            PopUpLiveChat();
            global.globalExit();
        }
    };
    console.log("🚀 ~ readStep::", readStep);

    return (
        <React.Fragment>
            <Modal
                title={translate("帐户验证")}
                className={`${readStep === 0 ? "loginOTPModal" : ""} ${
                    readStep == 1 ? "SecurityAnnouncement" : ""
                } modal-pubilc  OTP-modal `}
                visible={!memberInfo.isVerifiedEmail ? false : otpVisible} //会有老会员没有邮箱的情况
                closable
                centered={true}
                width={readStep == 0 ? 400 : 500}
                footer={null}
                zIndex={1500}
                onCancel={() => {
                    setReadStep(0);
                    readStep === 0 && global.globalExit();
                }}
                maskClosable={false}
            >
                <Spin size="large" tip={translate("加载中")} spinning={loading}>
                    {readStep == 0 && (
                        <React.Fragment>
                            <Row>
                                <Col span={24}>
                                    <div className="otp-modal-description">
                                        <h3 className="otp-modal-title">
                                            {translate("身份验证保护帐户")}
                                        </h3>
                                        {translate(
                                            "请验证您的信息，以确保您的账户安全可靠，防止信息被盗，降低交易风险。",
                                        )}
                                        <Button
                                            className="otpBtn"
                                            onClick={() => {
                                                setReadStep(1);
                                                Pushgtagdata(
                                                    "Details_loginOTP",
                                                );
                                            }}
                                            block
                                        >
                                            {translate("了解更多")}
                                        </Button>
                                    </div>
                                </Col>

                                <div className="OtpList">
                                    {memberInfo &&
                                        Array.isArray(verifyList) &&
                                        verifyList.length &&
                                        verifyList.map((item, index) => {
                                            if (
                                                !memberInfo.isVerifiedEmail &&
                                                item.name == "Email"
                                            )
                                                return;
                                            return (
                                                <div
                                                    key={index}
                                                    className="otpBox"
                                                >
                                                    <div
                                                        className={`verify-icon-wrap ${
                                                            item.name == bgHover
                                                                ? "red-" +
                                                                  item.name
                                                                : "default"
                                                        }`}
                                                        onClick={() => {
                                                            VerifyCategory(
                                                                item.name,
                                                                false,
                                                                true,
                                                            );
                                                            Pushgtagdata(
                                                                "Verification",
                                                                "Click",
                                                                `${item.name}_LoginOTP`,
                                                            );
                                                        }}
                                                        onMouseEnter={() =>
                                                            setBgHover(
                                                                item.name,
                                                            )
                                                        }
                                                        onMouseLeave={() =>
                                                            setBgHover(null)
                                                        }
                                                    >
                                                        <img
                                                            className="verify-icon"
                                                            src={
                                                                item.defaultImg
                                                            }
                                                            alt={item.name}
                                                        />
                                                    </div>
                                                    <Button
                                                        type="primary"
                                                        onClick={() => {
                                                            VerifyCategory(
                                                                item.name,
                                                                false,
                                                                true,
                                                            );
                                                            Pushgtagdata(
                                                                "Verification",
                                                                "Click",
                                                                `${item.name}_LoginOTP`,
                                                            );
                                                        }}
                                                        className={`${verifyList.length === 1 ? "one-button" : ""}`}
                                                    >
                                                        {item.content}
                                                    </Button>
                                                </div>
                                            );
                                        })}
                                </div>
                                {Array.isArray(verifyList) &&
                                    verifyList.length === 0 && (
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
                                                        Pushgtagdata(
                                                            "CS_loginOTP",
                                                        );
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
                                                        Pushgtagdata(
                                                            "CS_loginOTP",
                                                        );
                                                    }}
                                                    className="one-button"
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
                    {readStep == 1 && <ReadMore setReadStep={setReadStep} />}
                </Spin>
            </Modal>

            <EmailVerify
                {...prams}
                visible={emailVisible}
                email={
                    memberInfo.isVerifiedEmail && memberInfo.isVerifiedEmail[0]
                }
                changeVerify={VerifyCategory}
                setReadStep={setReadStep}
            />

            <PhoneVerify
                {...prams}
                visible={phoneVisible}
                changeVerify={VerifyCategory}
                setReadStep={setReadStep}
            />
            {readStep == 4 && (
                <PassWordVerify
                    otpPwdVisible={readStep == 4}
                    setReadStep={setReadStep}
                />
            )}
        </React.Fragment>
    );
}

export default OtpPopUp;
