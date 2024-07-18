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
import { Cookie, showResultModal } from "$ACTIONS/helper";
import { get, post, patch } from "$ACTIONS/TlcRequest";
import { ApiPort, APISET, APISETS } from "$ACTIONS/TLCAPI";
import { otpNumReg } from "$ACTIONS/reg";
import PhoneEdit from "@/Verification/PhoneEdit";
import Router from "next/router";
import classNames from "classnames";
import { translate } from "$ACTIONS/Translate";

const { Item } = Form;
const { Step } = Steps;
class PhoneVerify extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            remainingTime: -1,
            buttonStatus: false,
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
    componentDidMount() {
        clearInterval(this.timeTimer);
        this.getPhoneOTPAttempts();
    }

    componentWillUnmount() {
        clearInterval(this.timeTimer);
        this.setState = () => false;
    }

    getPhoneOTPAttempts = (callback) => {
        this.setState({ isLoading: true });
        get(
            ApiPort.GetOTPAttempts +
                `&channelType=SMS&serviceAction=WithdrawalVerification&`,
        )
            .then((res) => {
                this.setState({ isLoading: false });
                if (res && res.result) {
                    if (res.result.attempt < 1) {
                        this.props.setExceedVisible();
                    } else if (res.result.attempt) {
                        this.props.setAttemptRemaining(res.result.attempt);
                        typeof callback === "function" &&
                            callback(res.result.attempts);
                    }
                }
            })
            .catch((error) => {
                console.log("获取手机验证次数 error:", error);
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

        Pushgtagdata(`Verification`, "Submit", `Verify_Phone_WithdrawPage`);
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
                    this.props.judgeOTPVerification &&
                        this.props.judgeOTPVerification(
                            this.props.usdtWithdrawType,
                        ); // cryOtp
                }
                this.setState({ remainingTime: lastSeconds-- }); // 將button status寫在倒計時，refresh時仍可以正常為true
            }, 1000);
        }
    }

    clearTime(result) {
        Cookie.Delete("phoneTime");
        clearInterval(this.timeTimer);
        // this.setState({ buttonStatus: false });  //為確保五分鐘後仍能提交驗證碼，故comment掉
        if (this.props.otpParam && result) {
            this.setState({ remainingTime: "" });
            this.props.form.setFieldsValue({ verifyCode: "" }); // 輸入匡改為空值
            return;
        }
    }

    PhoneVerify(isResend) {
        if (!this.state.sendBtnDisable) {
            const SMSAPI =
                ApiPort.POSTPhoneVerifyAPI + "?isFirstRequest=false" + APISETS;
            const VOICEAPI = ApiPort.POSTPhoneVoiceVerifyAPI + APISET;
            let URL = this.state.phoneVerifyType === "sms" ? SMSAPI : VOICEAPI;
            const { UserName, currency, MemberCode } = this.state.memberInfo;
            let PhoneData = {
                msIsdn: this.state.memberInfo.isVerifiedPhone[0],
                isRegistration: false, // 是不是注册
                isOneTimeService: false, // 只有注册时候才为true
                userName: UserName,
                memberCode: MemberCode,
                currencyCode: currency,
                siteId: 16,
                isMandatoryStep: false,
                serviceAction: "WithdrawalVerification",
            };

            this.setState({ isLoading: true });
            post(URL, PhoneData)
                .then((res) => {
                    this.setState({ isLoading: false });
                    let { isSuccess, result = {}, errors = [] } = res || {};
                    const [{ errorCode, description: description = "" } = {}] =
                        errors;
                    if (isSuccess == true) {
                        Cookie.Create("phoneTime", dateFormat(), 1);
                        message.success(translate("发送成功"));
                        this.startCountDown();
                    } else {
                        if (
                            errorCode == "REVA0001" ||
                            errorCode == "VAL18015"
                        ) {
                            this.props.setExceedVisible();
                        } else {
                            message.error(description || translate("发送失败"));
                        }
                    }
                })
                .catch((error) => {
                    console.log("POSTPhoneVerifyAPI" + error);
                });

            Pushgtagdata(
                `Verification`,
                "Click",
                `${
                    isResend
                        ? "ResendCode_Phone_WithdrawPage"
                        : "Send_Phone_WithdrawPage"
                }`,
            );
        }
    }

    /**
     * 提交验证码
     * @param {*} code
     * @returns
     */
    checkUrlVerifyCode(code) {
        if (!otpNumReg.test(code))
            return showResultModal(
                translate("验证码格式错误"),
                false,
                1501,
                "otp",
                "authentication-succeeded",
            );
        let URL = ApiPort.POSTPhoneVerifyTAC;
        let PhoneData = {
            verificationCode: code,
            isregistration: false,
            msIsdn: this.state.memberInfo.isVerifiedPhone[0],
            serviceAction: "WithdrawalVerification",
            userName: this.state.memberInfo.userName,
            siteId: 16,
            memberCode: this.state.memberInfo.memberCode,
        };

        this.setState({ isLoading: true });
        patch(URL, PhoneData).then((res) => {
            this.setState({ isLoading: false });

            let { isSuccess, result = {}, errors = [] } = res || {};
            const [{ errorCode, message: errorMessage = "" } = {}] = errors;

            if (isSuccess && result.isVerified) {
                showResultModal(
                    translate("验证成功"),
                    true,
                    1501,
                    "otp",
                    "authentication-succeeded",
                );
                this.props.getMemberData();
                this.clearTime(isSuccess);
            } else {
                if (res.errors && res.errors.length > 0) {
                    this.props.form.setFields({
                        verifyCode: {
                            value: "",
                            errors: [new Error(res.errors[0].description)],
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
                    this.props.setAttemptRemaining(result.remainingAttempt);
                    return;
                } else {
                    // 超過驗證次數
                    this.props.setExceedVisible();
                    return;
                }
            }
        });
    }
    changePhoneVerifyTypeToVoice = () => {
        if (this.state.remainingTime !== 0) {
            return;
        } else {
            const type =
                this.state.phoneVerifyType === "voice" ? "sms" : "voice";
            this.setState(
                {
                    phoneVerifyType: type,
                    remainingTime: -1,
                },
                () => {
                    this.getPhoneOTPAttempts((res) => {
                        if (res > 0) {
                            this.PhoneVerify();
                        }
                    });
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
    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { remainingTime, buttonStatus, memberInfo, phoneVerifyType } =
            this.state;
        const verificationCode = getFieldValue("verifyCode");
        const phone =
            memberInfo && memberInfo.isVerifiedPhone[0].replace("84-", "");
        return (
            <React.Fragment>
                <Spin
                    spinning={this.state.isLoading}
                    tip={translate("加载中")}
                    style={{ backgroundColor: "initial" }}
                >
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
                        {!this.props.isEditPhone ? (
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
                                            value={phone.replace(
                                                /\d(?=\d{4})/g,
                                                "*",
                                            )}
                                        />
                                    </Col>
                                </Row>
                            </Item>
                        ) : (
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
                        )}

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

                        <Item label={translate("验证码")}>
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
                                                {translate("重新发送验证码")}{" "}
                                                {formatSeconds(remainingTime)}
                                            </div>
                                        ) : (
                                            !remainingTime && (
                                                <div
                                                    onClick={() => {
                                                        this.PhoneVerify(true);
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

                        <Item {...tailFormItemLayout}>
                            <div className="btn-wrap otp-btn-wrap verificationSubmitBtn">
                                <Button
                                    size="large"
                                    className="changeVerify"
                                    onClick={this.changePhoneVerifyTypeToVoice}
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
                                            verificationCode.length >= 6 &&
                                            buttonStatus,
                                    })}
                                    disabled={
                                        verificationCode &&
                                        verificationCode.length >= 6 &&
                                        buttonStatus
                                            ? false
                                            : true
                                    }
                                    block
                                >
                                    {translate("立即验证")}
                                </Button>
                            </div>
                        </Item>
                        <center>
                            {translate("您还剩")} (
                            <span className="blue">
                                {this.props.attemptRemaining}
                            </span>
                            ) {translate("次尝试")}
                        </center>
                        <div className="line-distance" />
                        {remainingTime > 0 ? (
                            <center className="change-loginOTP-method">
                                <span
                                    className="blue"
                                    onClick={() => {
                                        this.changeVerificationMethod;
                                    }}
                                >
                                    {translate("更改验证方式")}
                                </span>
                            </center>
                        ) : null}
                    </Form>
                </Spin>
            </React.Fragment>
        );
    }
}

export default Form.create({ name: "PhoneVerify" })(PhoneVerify);
