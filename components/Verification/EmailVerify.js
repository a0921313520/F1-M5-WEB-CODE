import React from "react";
import { Modal, Form, Input, Button, Spin, message, Steps } from "antd";
import { formItemLayout, tailFormItemLayout } from "$ACTIONS/constantsData";
import { dateFormat, formatSeconds } from "$ACTIONS/util";
import { Cookie ,getDisplayPublicError} from "$ACTIONS/helper";
import { post, get, patch } from "$ACTIONS/TlcRequest";
import { emailReg } from "$ACTIONS/reg";
import { ApiPort, APISETS } from "$ACTIONS/TLCAPI";
import { setMemberInfo } from "$DATA/userinfo";
import { otpNumReg } from "$ACTIONS/reg";
import Router from "next/router";
import ExceedVerify from "@/OTP/ExceedVerify";
import classNames from "classnames";
import { connect } from "react-redux";
import { mailConversion } from "$ACTIONS/util";
import {translate} from "$ACTIONS/Translate";
import { showResultModal } from "$ACTIONS/helper";
import { otpServiceActionList } from "$DATA/me.static";

const { Item } = Form;
const { Step } = Steps;
class EmailVerify extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            remainingTime: -1,
            exceedVisible: false, // otp 超過驗證次數判斷
            buttonStatus: false,
            memberInfo: JSON.parse(localStorage.getItem("memberInfo")),
        };

        this.EmailVerify = this.EmailVerify.bind(this); // 发送验证码
        this.checkUrlVerifyCode = this.checkUrlVerifyCode.bind(this); // 验证手机号
        this.startCountDown = this.startCountDown.bind(this); // 倒计时
        this.timeTimer = null; // 倒计时Timer
    }
   
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.visible !== this.props.visible && this.props.visible) {
            // Cookie.Get("emailTime") !== null && this.props.visible ? this.startCountDown(): clearInterval(this.timeTimer);
            clearInterval(this.timeTimer);
            if (["login-otp", "login-otpPwd"].some((item) => item === this.props.otpParam)) {
                if (this.props.attemptRemaining < 1) {
                    this.props.changeVerify("Email", false, false);
                    this.setState({
                        exceedVisible: true,
                    });
                }
            }
            else if (["recommendFriend-otp", "memberProfile-otp"].some((item) => item === this.props.otpParam)) {
                this.getEmailOTPAttempts()
            }
        }
    }
    componentWillUnmount() {
        clearInterval(this.timeTimer);
        this.setState = ()=> false
    }
    /**
     * 获取邮箱验证次数
     * 所有用到此组件的，验证次数都用 夫组件件传递过来的次数
     * 提交code后也更新给父组件,在传回来
     * 这样写是因为 login-otp/login-otpPwd 的次数是来自父组件，其他（recommendFriend-otp/memberProfile-otp）的方式就跟这他们统一写好了。
     */
    getEmailOTPAttempts = () => {
        const { otpParam } = this.props;
        const type = otpServiceActionList[otpParam];
        this.setState({ isLoading: true });
        get(ApiPort.GetOTPAttempts +`&channelType=${"Email"}&serviceAction=${type}&`)
            .then((res) => {
                if (res && res.result) {
                    if (res.result.attempt < 1) {
                        this.props.closeModal();
                        this.setState({
                            exceedVisible: true,
                        });
                    } else if (res.result.attempt) {
                        this.props.setEmailAttemptRemaining(res.result.attempt);
                    }
                }
            }).catch((error) => {
                console.log("获取邮箱验证次数 error:", error);
            }).finally(()=>{
                this.setState({ isLoading: false });
            })
        
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.checkUrlVerifyCode(values.verifyCode);
            }
        });

        if (this.props.otpParam === "login-otp") {
            Pushgtagdata("Verification", "Submit", "Verify_Email_LoginOTP");
        } else if (this.props.otpParam === "cry-otp") {
            Pushgtagdata("Verification", "Submit", "Verify_Email_cry-OTP");
        } else if (this.props.otpParam === "memberProfile-otp") {
            Pushgtagdata("Verification", "Submit", "Verify_Email_ProfilePage");
        } else {
            Pushgtagdata("Verification", "Submit", "Submit_Emailverification");
        }
    };

    startCountDown() {
        clearInterval(this.timeTimer);
        const time =
            Cookie.Get("emailTime").replace("-", "/").replace("-", "/") || -1;
        let times = 600;
        
        let lastSeconds = parseInt(
            times - (new Date().getTime() - new Date(time).getTime()) / 1000
        );

        this.setState({ remainingTime: lastSeconds });
        if (time !== null && time !== "") {
            this.timeTimer = setInterval(() => {
                this.setState({ buttonStatus: true });
                if (lastSeconds <= 0) {
                    Cookie.Get("emailTime", null);
                    clearInterval(this.timeTimer);
                    //this.setState({ buttonStatus: false });
                    if (this.props.otpParam) {
                        this.props.form.setFieldsValue({ verifyCode: "" }); // 輸入匡改為空值
                    }
                }
                this.setState({ remainingTime: lastSeconds-- });
            }, 1000);
        } else {
            Cookie.Get("emailTime", null);
        }
    }

    //点击发送验证码
    EmailVerify(isResend) {
        const promiseVerification = this.props.form.validateFields(["emailAddress"]);
        const { otpParam } = this.props;
        promiseVerification.then(() => {
            const { memberCode } = this.state.memberInfo;
            const emailAccount = this.state.memberInfo?.isVerifiedEmail[0];
            let EmailData = {
                memberCode: memberCode,
                email: emailAccount,
                siteId: 16,
                domainUrl: global.location.href,
                ipAddress: "",
                serviceAction: otpServiceActionList[otpParam]
            }
            
            const sendEmailCode = () => {
                this.setState({ isLoading: true });
                post(ApiPort.POSTEmailVerifyAPI, EmailData)
                    .then((res) => {
                        if (res.isSuccess == true && res.result.isSent) {
                            Cookie.Create("emailTime", dateFormat(), 10);
                            this.startCountDown();
                        } 
                        else if (res.isSuccess == false) {
                            const { description, errorCode } = res.errors[0];
                            if (["login-otp", "login-otpPwd"].some((item) => item === otpParam)) {
                                // logintop & 重置密码 超过请求次数
                                if (
                                    errorCode == "REVA0001" ||
                                    errorCode == "VAL18015"
                                ) {
                                    this.props.changeVerify(
                                        "Email",
                                        false,
                                        false
                                    );
                                    this.setState({ exceedVisible: true });
                                } else {
                                    message.error(description || translate("发送失败"));
                                }
                            } 
                            else if (["recommendFriend-otp", "memberProfile-otp"].some((item) => item === otpParam)) {
                                // 个人资料 && ref 超过请求次数
                                if (
                                    errorCode == "REVA0001" ||
                                    errorCode == "VAL18015"
                                ) {
                                    this.props.closeModal();
                                    this.setState({ exceedVisible: true });
                                } else {
                                    message.error(description ||translate("发送失败"));
                                }
                            } 
                            else {
                                message.error(description ||translate("发送失败"));
                            }
                        }
                    }).catch((error) => {
                        console.log("POSTEmailVerifyAPI 发送验证码:" + error);
                    }).finally(()=>{
                        this.setState({ isLoading: false });
                    })
            };

            this.state.memberInfo && this.state.memberInfo.isVerifiedEmail
                ? sendEmailCode()
                : (() => {
                      this.setState({ isLoading: true });
                      setMemberInfo(
                          {
                              key: "Email",
                              value1: emailAccount,
                          },
                          (res) => {
                              if (res.isSuccess) {
                                  !this.props.otpParam &&
                                      this.props.correctMemberInfo(
                                          sendEmailCode
                                      );
                              } else {
                                  this.setState({ isLoading: false });
                                  message.error(res.message);
                              }
                          }
                      );
                  })();
        });

        if (this.props.otpParam === "login-otp") {
            Pushgtagdata(
                !isResend ? "Click" : "Login OTP",
                !isResend ? "Click" : "Request",
                !isResend ? "SendCode_Email" : "ResendCode_Email"
            );
        } else if (this.props.otpParam === "memberProfile-otp") {
            Pushgtagdata(
                "Verification",
                "Click",
                !isResend
                    ? "SendCode_Email_ProfilePage"
                    : "ResendCode_Email_ProfilePage"
            );
        } else {
            Pushgtagdata(
                "Verification",
                "Click",
                !isResend
                    ? "Sendcode_Emailverification"
                    : "Resendcode_Emailverification"
            );
        }
    }

    //提交验证码
    checkUrlVerifyCode(code) {
        if (!otpNumReg.test(code)) return showResultModal(translate("验证码格式错误"), false);
        const { memberCode } = this.state.memberInfo;
        const email = this.state.memberInfo?.isVerifiedEmail[0];
        const { otpParam } = this.props;
        let EmailData = {
            memberCode: memberCode,
            email,
            tac: code,
            siteId: 16,
            serviceAction: otpServiceActionList[otpParam]
        };
        this.setState({ isLoading: true });
        patch(ApiPort.POSTEmailVerifyAPI, EmailData).then((res) => {
            if (res) {
                let { result } = res;
                if (this.props.otpParam) {
                    if (res.isSuccess && res.result.isVerified) {
                        showResultModal(translate("验证成功"), true,1501,'otp','authentication-succeeded');
                        if (res.result.queleaReferreeStatus) {
                            this.props.GetThroughoutVerification();
                        }
                        setTimeout(() => {
                            if (this.props.isNext) {
                                this.props.correctMemberInfo();
                                this.props.nextStep();
                                this.props.visible && this.props.closeModal();
                                return;
                            }
                            if (otpParam === "login-otpPwd") {
                                this.props.changeVerify("Email", false, false);
                                this.props.setReadStep(4);
                            } else if (["recommendFriend-otp", "memberProfile-otp"].some((item) => item === otpParam)) {
                                this.props.closeModal();
                                this.props.correctMemberInfo();
                            } else if(otpParam === "login-otp"){
                                localStorage.setItem("login-otp", true);
                                this.props.changeVerify("Email", false, false);
                                Router.push("/");
                            }
                        }, 3000);
                    } else {
                        if (res.errors && res.errors.length > 0) {
                            this.props.form.setFields({
                                verifyCode: {
                                    value: "",
                                    errors: [
                                        new Error(getDisplayPublicError(res)),
                                    ],
                                },
                            });
                            return;
                        }
                        if (result.remainingAttempt) {
                            this.props.form.setFields({
                                verifyCode: {
                                    value: "",
                                    errors: [new Error(result.message || getDisplayPublicError(res))],
                                },
                            });
                            this.props.setEmailAttemptRemaining(
                                result.remainingAttempt
                            );
                        } else {
                            // 超過驗證次數
                            this.props.changeVerify("Email", false, false); // 關閉彈窗
                            this.setState({ exceedVisible: true });
                            return;
                        }
                    }
                } else if (!result.exception) {
                    // 非otp驗證
                    message.success(translate("验证成功"));
                    !this.props.otpParam && this.props.correctMemberInfo();
                    if (this.props.isNext) {
                        this.props.nextStep();
                        this.props.visible && this.props.closeModal();
                    } else {
                        this.props.closeModal();
                    }
                    if (res && res.result && res.result.queleaReferreeStatus) {
                        this.props.GetThroughoutVerification();
                    }
                } else {
                    message.error(getDisplayPublicError(res) || translate("验证码不正确，请再次检查并确保输入的验证码正确"));
                }
            }
        }).finally(()=>{
            this.setState({ isLoading: false });
        })
    }
    
    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { exceedVisible, remainingTime, buttonStatus } = this.state;
        const verificationCode = getFieldValue("verifyCode");
        const email = this.state.memberInfo?.isVerifiedEmail[0] ?? "";
        
        return (
            <React.Fragment>
                <Modal
                    className="general-modal modal-otpVerification"
                    title={translate("认证方式电子邮件")}
                    visible={this.props.visible}
                    width={400}
                    footer={null}
                    centered={true}
                    closable={true}
                    maskClosable={
                        this.props.otpParam == "login-otp" ? false : true
                    }
                    onCancel={() => {
                        this.props.changeVerify("Email", true, false);
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
                                {translate("验证您的电子邮件地址以继续")}
                            </h3>
                            <div>{`${translate("点击")} "${translate("发送验证码")}", ${translate("您的邮箱中将收到一次性密码")}`}</div>
                            <div className="line-distance" />
                            <Item label={translate("邮箱")}>
                                {getFieldDecorator("emailAddress", {
                                    initialValue: email
                                        ? mailConversion(email)
                                        : "",
                                    rules: [
                                        {
                                            required: true,
                                            message: translate("请输入电子邮箱"),
                                        },
                                        {
                                            validator: (
                                                rule,
                                                value,
                                                callback
                                            ) => {
                                                if (value && !email) {
                                                    !emailReg.test(email) &&
                                                        callback(
                                                            "邮件格式错误！"
                                                        );
                                                }
                                                callback();
                                            },
                                        },
                                    ],
                                })(
                                    <Input
                                        size="large"
                                        placeholder={translate("请输入电子邮箱")}
                                        className="tlc-input-disabled"
                                        autoComplete="off"
                                        disabled={!!email}
                                    />
                                )}
                            </Item>
                            <div className="otp-cs-tip">
                                {translate("如果您想更新您的电子邮件地址。 请联系")}
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
                                            ""
                                        );
                                    },
                                })(
                                    <Input
                                        addonAfter={
                                            remainingTime < 0 ? (
                                                <div
                                                    onClick={() => {
                                                        this.EmailVerify();
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
                                                            this.EmailVerify(
                                                                true
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
                                            remainingTime > 0
                                                ? "disabled-time"
                                                : "abled-time"
                                        }
                                        placeholder={translate("请输入验证码")}
                                        maxLength={6}
                                    />
                                )}
                            </Item>
                            <div className="line-distance" />
                            {remainingTime > 0 ? <Item {...tailFormItemLayout}>
                                <div className="btn-wrap otp-btn-wrap otp-email-btn">
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
                            </Item> :null}
                            {this.props.otpParam && (
                                <center>
                                    {translate("您还剩")} (
                                    <span className="blue">
                                        {this.props.emailattemptRemaining}
                                    </span>
                                    ) {translate("次尝试")}{" "}
                                </center>
                            )}
                            <div className="line-distance" />
                            {remainingTime > 0 ?<center className="change-loginOTP-method">
                                <span className="blue" 
                                    onClick={() => {
                                        this.props.changeVerify(
                                            "Email",
                                            true,
                                            false
                                        );
                                        Pushgtagdata(
                                            `Change_email_loginOTP`
                                        );
                                    }}
                                >
                                    {translate("更改验证方式")}
                                </span>
                            </center> :null}
                        </Form>
                    </Spin>
                </Modal>
                
                {/*otp 超過次數彈窗 */}
                {exceedVisible && (
                    <ExceedVerify
                        exceedVisible={exceedVisible}
                        onCancel={() => {
                            this.setState({ exceedVisible: false });
                            setTimeout(() => {
                                global.globalExit();
                            }, 1500);
                        }}
                    />
                )}
            </React.Fragment>
        );
    }
}

export default Form.create({ name: "EmailVerify" })(EmailVerify);
