import React from "react";
import {
    Row,
    Col,
    Modal,
    Form,
    Input,
    Button,
    Spin,
    message,
    Steps,
} from "antd";
import { formItemLayout, tailFormItemLayout } from "$ACTIONS/constantsData";
import { dateFormat, formatSeconds, numberConversion } from "$ACTIONS/util";
import {
    Cookie,
    showResultModal,
    getDisplayPublicError,
} from "$ACTIONS/helper";
import { get, post, patch } from "$ACTIONS/TlcRequest";
import { ApiPort, APISET, APISETS } from "$ACTIONS/TLCAPI";
import { otpNumReg } from "$ACTIONS/reg";
// import PhoneEdit from "@/Verification/PhoneEdit";
import Router from "next/router";
import ExceedVerify from "@/OTP/ExceedVerify";
import classNames from "classnames";
import { translate } from "$ACTIONS/Translate";
import { otpServiceActionList } from "$DATA/me.static";

const { Item } = Form;
const { Step } = Steps;
class PhoneVerify extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            remainingTime: -1,
            exceedVisible: false, // otp 超過驗證次數判斷
            buttonStatus: false,
            phone: "",
            sendBtnDisable: false,
            memberInfo: JSON.parse(localStorage.getItem("memberInfo")),
            phoneVerifyType: "sms",
        };

        this.PhoneVerify = this.PhoneVerify.bind(this); // 发送验证码
        this.checkUrlVerifyCode = this.checkUrlVerifyCode.bind(this); // 验证手机号
        this.startCountDown = this.startCountDown.bind(this); // 倒计时
        this.phoneNumber = ""; // 仅允许单词更改手机号，为了保证更改后能够实时获取到数据，采用本地属性记录方式
        this.timeTimer = null; // 倒计时Timer
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.visible !== this.props.visible && this.props.visible) {
            // Cookie.Get("phoneTime") !== "" ? this.startCountDown() : clearInterval(this.timeTimer);
            clearInterval(this.timeTimer);
            if (
                ["login-otp", "login-otpPwd"].some(
                    (item) => item === this.props.otpParam,
                )
            ) {
                if (this.props.attemptRemaining < 1) {
                    this.props.changeVerify("Phone", false, false);
                    this.setState({
                        exceedVisible: true,
                    });
                }
            } else if (
                ["recommendFriend-otp", "memberProfile-otp"].some(
                    (item) => item === this.props.otpParam,
                )
            ) {
                this.getPhoneOTPAttempts();
            }
        }
    }
    componentWillUnmount() {
        clearInterval(this.timeTimer);
        this.setState = () => false;
    }
    /**
     * 获取手机验证次数
     * 所有用到此组件验证，都用父组件传递过来的次数
     * 提交code后也先更新给父组件然后在传回来
     * 这样写是因为 login-otp/login-otpPwd/cry-otp的次数是来自父组件，其他（recommendFriend-otp/memberProfile-otp）的方式就跟这他们统一写好了。
     */
    getPhoneOTPAttempts = (callback) => {
        const { otpParam } = this.props;
        const type = otpServiceActionList[otpParam];
        this.setState({ isLoading: true });
        get(ApiPort.GetOTPAttempts + `&channelType=SMS&serviceAction=${type}`)
            .then((res) => {
                if (res && res.result) {
                    if (res.result.attempt < 1) {
                        this.props.closeModal();
                        this.setState({
                            exceedVisible: true,
                        });
                    } else if (res.result.attempt) {
                        this.props.setAttemptRemaining(res.result.attempt);
                        typeof callback === "function" &&
                            callback(res.result.attempt);
                    }
                }
            })
            .catch((error) => {
                console.log("获取手机验证次数 error:", error);
            })
            .finally(() => {
                this.setState({ isLoading: false });
            });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.checkUrlVerifyCode(values.verifyCode);
            }
        });

        if (this.props.otpParam === "login-otp") {
            Pushgtagdata("Verification", "Submit", "Verify_Phone_LoginOTP");
        } else if (this.props.otpParam === "cry-otp") {
            Pushgtagdata("Verification", "Submit", "Verify_Phone_cry-OTP");
        } else if (this.props.otpParam === "memberProfile-otp") {
            Pushgtagdata("Verification", "Submit", "Verify_Phone_ProfilePage");
        } else {
            Pushgtagdata("Verification", "Submit", "Submit_phoneverification");
        }
    };

    startCountDown() {
        let times = 300;
        this.setState({ remainingTime: times });
        clearInterval(this.timeTimer);
        if (Cookie.Get("phoneTime")) {
            const phoneTime = Cookie.Get("phoneTime")
                .replace("-", "/")
                .replace("-", "/");
            let lastSeconds = parseInt(
                times -
                    (new Date().getTime() - new Date(phoneTime).getTime()) /
                        1000,
            );
            this.setState({ buttonStatus: true });
            this.timeTimer = setInterval(() => {
                if (lastSeconds <= 0) {
                    this.clearTime();
                }
                this.setState({ remainingTime: lastSeconds-- }); // 將button status寫在倒計時，refresh時仍可以正常為true
            }, 1000);
        }
    }

    clearTime(result) {
        Cookie.Delete("phoneTime");
        clearInterval(this.timeTimer);
        if (this.props.otpParam && result) {
            this.setState({ remainingTime: "" });
            this.props.form.setFieldsValue({ verifyCode: "" }); // 輸入匡改為空值
            return;
        }
    }

    /**
     * 发送验证码
     * @param {Bool} isResend 是否是重新发送
     * phoneVerifyType  (sms/voice) 1.短信验证(sms) 2.电话验证(voice)
     */
    PhoneVerify(isResend) {
        if (!this.state.sendBtnDisable) {
            const { otpParam } = this.props;
            const { phoneVerifyType } = this.state;
            this.props.form.setFieldsValue({ verifyCode: "" });
            const { userName, currency, memberCode, isVerifiedPhone } =
                this.state.memberInfo;
            let PhoneData = {
                msisdn: isVerifiedPhone[0],
                isRegistration: false,
                isOneTimeService: false,
                memberCode: memberCode,
                currencyCode: currency,
                siteId: 16,
                isMandatoryStep: true,
                serviceAction: otpServiceActionList[otpParam],
            };
            let requestURL = "";
            if (otpParam === "cry-otp" && phoneVerifyType === "sms") {
                //添加usdt钱包短信验证
                requestURL = ApiPort.PostSendSmsOTP + APISET;
            } else if (phoneVerifyType === "sms") {
                //短信验证
                requestURL = ApiPort.POSTPhoneVerifyAPI + APISET;
            } else {
                //语音验证
                requestURL = ApiPort.POSTPhoneVoiceVerifyAPI + APISET;
            }
            this.setState({ isLoading: true });
            post(requestURL, PhoneData)
                .then((res) => {
                    let { errors = [] } = res || {};
                    const [{ errorCode } = {}] = errors;
                    if (res?.isSuccess) {
                        Cookie.Create("phoneTime", dateFormat(), 1);
                        message.success(translate("发送成功"));
                        this.startCountDown();
                    } else {
                        if (
                            ["login-otp", "login-otpPwd"].some(
                                (item) => item === otpParam,
                            )
                        ) {
                            // logintop & 重置密码 超过请求次数
                            if (
                                errorCode == "REVA0001" ||
                                errorCode == "VAL18015"
                            ) {
                                this.props.changeVerify("Phone", false, false);
                                this.setState({ exceedVisible: true });
                            } else {
                                message.error(
                                    getDisplayPublicError(res) ||
                                        translate("发送失败"),
                                );
                            }
                        } else if (
                            ["recommendFriend-otp", "memberProfile-otp"].some(
                                (item) => item === otpParam,
                            )
                        ) {
                            // 个人资料 && ref 超过请求次数
                            if (
                                errorCode == "REVA0001" ||
                                errorCode == "VAL18015"
                            ) {
                                this.props.closeModal();
                                this.setState({ exceedVisible: true });
                            } else {
                                message.error(
                                    getDisplayPublicError(res) ||
                                        translate("发送失败"),
                                );
                            }
                        } else if (otpParam === "cry-otp") {
                            //添加usdt 超过请求次数
                            if (
                                errorCode == "REVA0001" ||
                                errorCode == "VAL18015"
                            ) {
                                this.props.changeVerify(false, false, true);
                            } else {
                                message.error(
                                    getDisplayPublicError(res) ||
                                        translate("发送失败"),
                                );
                            }
                        } else {
                            message.error(
                                getDisplayPublicError(res) ||
                                    translate("发送失败"),
                            );
                        }
                    }
                })
                .catch((error) => {
                    console.log("POSTPhoneVerifyAPI" + error);
                })
                .finally(() => {
                    this.setState({ isLoading: false });
                });
        }
    }

    /**
     * 提交验证码
     * @param {*} code
     * @returns
     */
    checkUrlVerifyCode(code) {
        const { otpParam } = this.props;
        const { phoneVerifyType } = this.state;
        if (!otpNumReg.test(code))
            return showResultModal(
                translate("验证码格式错误"),
                false,
                1501,
                "otp",
                "authentication-succeeded",
            );
        let requestURL =
            phoneVerifyType === "sms"
                ? ApiPort.POSTPhoneVerifyTAC
                : ApiPort.PATCHPhoneVoiceVerifyAPI;
        let PhoneData = {
            verificationCode: code,
            isregistration: false,
            msIsdn: this.state.memberInfo.isVerifiedPhone[0],
            siteId: 16,
            memberCode: this.state.memberInfo.memberCode,
            isMandatorySetp: true,
            currencyCode: this.state.memberInfo.currency,
            serviceAction: otpServiceActionList[otpParam],
        };
        if (otpParam === "login-otpPwd") {
            PhoneData.isMandatorySetp = false;
        } else if (otpParam === "cry-otp" && phoneVerifyType === "sms") {
            requestURL = ApiPort.PostVerifySmsOTP + APISET;
        }
        this.setState({ isLoading: true });
        patch(requestURL, PhoneData)
            .then((res) => {
                if (res) {
                    let { isSuccess, result = {}, errors = [] } = res || {};
                    const [{ errorCode } = {}] = errors;
                    if (otpParam === "login-otp") {
                        if (isSuccess && result.isVerified) {
                            showResultModal(
                                translate("验证成功"),
                                true,
                                1501,
                                "otp",
                                "authentication-succeeded",
                            );
                            localStorage.setItem("login-otp", true); // 驗證成功

                            if (res.result.queleaReferreeStatus) {
                                this.props.GetThroughoutVerification();
                            }
                            this.clearTime(isSuccess);
                            setTimeout(() => {
                                this.props.changeVerify("Phone", false, false); // 關閉彈窗
                                Router.push("/");
                            }, 3000);
                            return;
                        } else {
                            if (res.errors && res.errors.length > 0) {
                                this.props.form.setFields({
                                    verifyCode: {
                                        value: "",
                                        errors: [
                                            new Error(
                                                getDisplayPublicError(res) ||
                                                    translate(
                                                        "验证码已过期，请单击“重新发送代码”以接收另一个代码。",
                                                    ),
                                            ),
                                        ],
                                    },
                                });
                                return;
                            }
                            if (result.remainingAttempt) {
                                this.props.form.setFields({
                                    verifyCode: {
                                        value: "",
                                        errors: [new Error(result.message)],
                                    },
                                });
                                this.props.setAttemptRemaining(
                                    result.remainingAttempt,
                                );
                                return;
                            } else {
                                // 超過驗證次數
                                this.props.changeVerify("Phone", false, false); // 關閉彈窗
                                this.setState({ exceedVisible: true });
                                return;
                            }
                        }
                    } else if (otpParam === "cry-otp") {
                        if (isSuccess && result.isVerified) {
                            const verificationCode =
                                this.props.form.getFieldValue("verifyCode");
                            this.props.getVerificationCode(verificationCode);
                            showResultModal(
                                translate("验证成功"),
                                true,
                                1501,
                                "otp",
                                "authentication-succeeded",
                            );
                            this.clearTime(isSuccess);
                            if (res.result.queleaReferreeStatus) {
                                this.props.GetThroughoutVerification();
                            }
                            setTimeout(() => {
                                this.props.changeVerify(false, true, false);
                            }, 3000);
                        } else {
                            if (phoneVerifyType === "sms") {
                                //这支sms api失败会是400，不会返回剩余次数，所以再请求剩余次数
                                //短信
                                this.props.judgeOTPVerification(
                                    "",
                                    this.props.usdtWithdrawType,
                                );
                            } else {
                                //语音
                                if (result.remainingAttempt) {
                                    this.props.setAttemptRemaining(
                                        result.remainingAttempt,
                                    );
                                } else {
                                    if (
                                        errorCode === "VAL18013" ||
                                        result.remainingAttempt < 1
                                    ) {
                                        //限制
                                        this.props.changeVerify(
                                            false,
                                            false,
                                            true,
                                        );
                                    } else {
                                        //语音也有400 不回传剩余次数的情况，再请求剩余次数
                                        this.props.judgeOTPVerification(
                                            "",
                                            this.props.usdtWithdrawType,
                                        );
                                    }
                                }
                            }
                            this.props.form.setFields({
                                verifyCode: {
                                    value: "",
                                    errors: [
                                        new Error(
                                            getDisplayPublicError(res) ||
                                                result.message ||
                                                translate("发送失败"),
                                        ),
                                    ],
                                },
                            });
                        }
                    } else if (otpParam === "login-otpPwd") {
                        if (isSuccess && result.isVerified) {
                            showResultModal(
                                translate("验证成功"),
                                true,
                                1501,
                                "otp",
                                "authentication-succeeded",
                            );
                            this.clearTime(isSuccess);
                            if (res.result.queleaReferreeStatus) {
                                this.props.GetThroughoutVerification();
                            }
                            setTimeout(() => {
                                this.props.changeVerify("Phone", false, false); // 關閉彈窗
                                this.props.setReadStep(4); //打开修改密码弹窗
                            }, 3000);
                            return;
                        } else {
                            if (result.remainingAttempt) {
                                this.props.form.setFields({
                                    verifyCode: {
                                        value: "",
                                        errors: [new Error(result.message)],
                                    },
                                });
                                this.props.setAttemptRemaining(
                                    result.remainingAttempt,
                                );
                                return;
                            }
                            if (
                                errorCode === "REVA0001" ||
                                errorCode == "VAL18015"
                            ) {
                                // 超過驗證次數
                                this.props.changeVerify("Phone", false, false); // 關閉彈窗
                                this.setState({ exceedVisible: true });
                                return;
                            } else {
                                showResultModal(
                                    result.message || translate("发送失败"),
                                    false,
                                    1501,
                                    "otp",
                                    "authentication-succeeded",
                                );
                                this.props.setAttemptRemaining(
                                    result.remainingAttempt,
                                );
                            }
                        }
                    } else if (
                        ["recommendFriend-otp", "memberProfile-otp"].some(
                            (item) => item === otpParam,
                        )
                    ) {
                        if (isSuccess && result.isVerified) {
                            showResultModal(
                                translate("验证成功"),
                                true,
                                1501,
                                "otp",
                                "authentication-succeeded",
                            );
                            this.clearTime(isSuccess);
                            this.props.correctMemberInfo();
                            setTimeout(() => {
                                this.props.closeModal(); // 關閉彈窗
                            }, 3000);
                            if (res.result.queleaReferreeStatus) {
                                this.props.GetThroughoutVerification();
                            }
                        } else {
                            if (result.remainingAttempt) {
                                this.props.form.setFields({
                                    verifyCode: {
                                        value: "",
                                        errors: [new Error(result.message)],
                                    },
                                });
                                this.props.setAttemptRemaining(
                                    result.remainingAttempt,
                                );
                                return;
                            }
                            if (!result.remainingAttempt) {
                                // 超過驗證次數
                                this.props.closeModal(); // 關閉彈窗
                                this.setState({ exceedVisible: true });
                                return;
                            } else {
                                showResultModal(
                                    getDisplayPublicError(res) ||
                                        translate("失败"),
                                    false,
                                );
                                this.props.setAttemptRemaining(
                                    result.attemptRemaining,
                                );
                            }
                        }
                    } else {
                        // 非otp 驗證
                        if (!result.exception) {
                            message.success(
                                result.message || translate("验证成功"),
                            );
                            !this.props.otpParam &&
                                this.props.correctMemberInfo();
                            !this.props.otpParam && this.props.closeModal();
                        } else {
                            message.error(
                                getDisplayPublicError(res) ||
                                    translate(
                                        "验证码不正确，请再次检查并确保输入的验证码正确",
                                    ),
                            );
                        }
                    }
                }
            })
            .finally(() => {
                this.setState({ isLoading: false });
            });
    }

    //短信和语音切换
    changePhoneVerifyTypeToVoice = () => {
        const { otpParam } = this.props;
        if (this.state.remainingTime > 0) {
            return;
        } else {
            this.setState(
                {
                    phoneVerifyType: "voice",
                    remainingTime: -1,
                },
                () => {
                    if (otpParam === "cry-otp") {
                        this.props.judgeOTPVerification(
                            "",
                            this.props.usdtWithdrawType,
                            "",
                            (res) => {
                                if (res > 0) {
                                    this.PhoneVerify();
                                }
                            },
                        );
                    } else {
                        this.getPhoneOTPAttempts((res) => {
                            if (res > 0) {
                                this.PhoneVerify();
                            }
                        });
                    }
                },
            );
            this.props.form.setFields({
                verifyCode: {
                    value: "",
                    errors: "",
                },
            });
        }
    };
    /**
     * 切换
     */
    changeVerificationMethod = () => {
        this.props.changeVerify("Phone", true, false);
        this.props.form.setFieldsValue({ verifyCode: "" });
        Pushgtagdata("Change_phone_loginOTP");
    };
    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const {
            exceedVisible,
            remainingTime,
            buttonStatus,
            memberInfo,
            phoneVerifyType,
        } = this.state;
        console.log(
            "🚀 ~ file: PhoneVerify.js:585 ~ PhoneVerify ~ render ~ phoneVerifyType:",
            phoneVerifyType,
            ",remainingTime:",
            remainingTime,
            ",剩余提交次数：" + this.props.attemptRemaining,
        );
        const verificationCode = getFieldValue("verifyCode");
        const phone = memberInfo?.isVerifiedPhone[0]?.replace("84-", "") ?? "";

        return (
            <React.Fragment>
                <Modal
                    className="general-modal modal-otpVerification"
                    title={translate("电话号码认证")}
                    visible={this.props.visible}
                    width={400}
                    footer={null}
                    centered={true}
                    closable={true}
                    maskClosable={false}
                    onCancel={() => {
                        if (
                            ["login-otp", "login-otpPwd"].some(
                                (item) => item === this.props.otpParam,
                            )
                        ) {
                            this.props.changeVerify("Phone", true, false);
                        } else {
                            this.props.closeModal();
                        }
                    }}
                    zIndex={1500}
                >
                    <Spin
                        spinning={this.state.isLoading}
                        tip={translate("加载中")}
                        style={{ backgroundColor: "initial" }}
                    >
                        {this.props.otpParam == "login-otpPwd" && (
                            <div className="StepsBox">
                                <Steps current={0} size="small">
                                    <Step />
                                    <Step />
                                </Steps>
                            </div>
                        )}

                        <Form
                            className="verification-form-wrap"
                            {...formItemLayout}
                            onSubmit={this.handleSubmit}
                        >
                            <h3 className="Otptxt">
                                {translate("验证电话号码以继续")}
                            </h3>
                            <div>
                                {translate(
                                    "一次性密码验证码将通过短信发送或通过您的电话号码拨打",
                                )}
                            </div>
                            <div className="line-distance" />
                            {/* {!this.props.isEditPhone ? ( */}
                            <Item label={translate("电话号码")}>
                                <Row gutter={14}>
                                    <Col span={7}>
                                        <Input
                                            size="large"
                                            className="tlc-input-disabled"
                                            disabled={true}
                                            value="+84"
                                        />
                                    </Col>
                                    <Col span={17}>
                                        <Input
                                            size="large"
                                            className="tlc-input-disabled"
                                            disabled={true}
                                            value={phone?.replace(
                                                /\d(?=\d{4})/g,
                                                "*",
                                            )}
                                        />
                                    </Col>
                                </Row>
                            </Item>
                            {/* ) : (
                                <PhoneEdit
                                    disableEdit={buttonStatus}
                                    memberCode={memberInfo.memberCode}
                                    phoneNumber={phone}
                                    isDeposited={memberInfo.isDeposited}
                                    dialogVisible={this.props.visible}
                                    setRemainingTime={(v) => {
                                        this.setState({ remainingTime: v });
                                    }}
                                    updatePhoneNumber={(v) => {
                                        this.phoneNumber = v;
                                    }}
                                    setSendBtnDisable={(v) => {
                                        this.setState({ sendBtnDisable: v });
                                    }}
                                    setLoading={(v) => {
                                        this.setState({ isLoading: v });
                                    }}
                                />
                            )} */}
                            <div className="otp-cs-tip">
                                {translate("如果您想更新电话号码。 请联系")}
                                <span
                                    className="otp-cs"
                                    onClick={() => {
                                        global.PopUpLiveChat();
                                        Pushgtagdata("CS_loginOTP");
                                    }}
                                >
                                    {translate("在线客服")}
                                </span>
                            </div>
                            <Item
                                label={translate("验证码")}
                                className="otp-phone-verifyCode-Item"
                            >
                                {getFieldDecorator("verifyCode", {
                                    rules: [
                                        {
                                            required: true,
                                            message: translate("请输入验证码"),
                                        },
                                    ],
                                    getValueFromEvent: (event) => {
                                        return event.target.value.replace(
                                            /\D/g,
                                            "",
                                        );
                                    },
                                })(
                                    <Input
                                        maxLength={6}
                                        addonAfter={
                                            remainingTime < 0 ? (
                                                <div
                                                    onClick={() => {
                                                        this.PhoneVerify();
                                                    }}
                                                >
                                                    {translate("发送代码")}
                                                </div>
                                            ) : remainingTime > 0 ? (
                                                <div style={{ color: "#FFF" }}>
                                                    {translate(
                                                        "重新发送验证码",
                                                    )}{" "}
                                                    {formatSeconds(
                                                        remainingTime,
                                                    )}
                                                </div>
                                            ) : (
                                                !remainingTime && (
                                                    <div
                                                        onClick={() => {
                                                            this.PhoneVerify(
                                                                true,
                                                            );
                                                        }}
                                                    >
                                                        {translate("发送代码")}
                                                    </div>
                                                )
                                            )
                                        }
                                        size="large"
                                        autoComplete="off"
                                        className={
                                            remainingTime > 0 ||
                                            this.state.sendBtnDisable
                                                ? "disabled-time"
                                                : "abled-time"
                                        }
                                        placeholder={translate("请输入验证码")}
                                    />,
                                )}
                            </Item>
                            <div className="line-distance" />
                            {remainingTime > -1 ||
                            phoneVerifyType === "voice" ? (
                                <Item {...tailFormItemLayout}>
                                    <div className="btn-wrap otp-btn-wrap verificationSubmitBtn">
                                        <Button
                                            size="large"
                                            className="changeVerify"
                                            onClick={
                                                this
                                                    .changePhoneVerifyTypeToVoice
                                            }
                                            disabled={remainingTime > 0}
                                        >
                                            {phoneVerifyType === "sms"
                                                ? translate("通过语音发送 OTP")
                                                : translate("通过短信发送 OTP")}
                                        </Button>
                                        <Button
                                            size="large"
                                            type="primary"
                                            htmlType="submit"
                                            className={classNames({
                                                GreenBtn:
                                                    verificationCode &&
                                                    verificationCode.length >=
                                                        6 &&
                                                    buttonStatus,
                                            })}
                                            disabled={
                                                verificationCode &&
                                                verificationCode.length >= 6 &&
                                                buttonStatus
                                                    ? false
                                                    : true
                                            }
                                        >
                                            {translate("立即验证")}
                                        </Button>
                                    </div>
                                </Item>
                            ) : null}

                            <center>
                                {translate("您还剩")} (
                                <span className="blue">
                                    {this.props.attemptRemaining}
                                </span>
                                ) {translate("次尝试")}{" "}
                            </center>
                            <div className="line-distance" />
                            {remainingTime > 0 &&
                            this.props.otpParam !== "cry-otp" ? (
                                <center className="change-loginOTP-method">
                                    <span
                                        className="blue"
                                        onClick={this.changeVerificationMethod}
                                    >
                                        {translate("更改验证方式")}
                                    </span>
                                </center>
                            ) : null}
                        </Form>
                    </Spin>
                </Modal>

                <ExceedVerify /* otp 超過次數彈窗 */
                    exceedVisible={exceedVisible}
                    onCancel={() => {
                        this.setState({ exceedVisible: false });
                        setTimeout(() => {
                            global.globalExit();
                        }, 1500);
                    }}
                />
            </React.Fragment>
        );
    }
}

export default Form.create({ name: "PhoneVerify" })(PhoneVerify);
