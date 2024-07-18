import React from "react";
import { Form, Input, Button, Spin, message } from "antd";
import { formItemLayout, tailFormItemLayout } from "$ACTIONS/constantsData";
import { dateFormat, formatSeconds } from "$ACTIONS/util";
import { Cookie } from "$ACTIONS/helper";
import { post, get, patch } from "$ACTIONS/TlcRequest";
import { emailReg } from "$ACTIONS/reg";
import { ApiPort, APISETS } from "$ACTIONS/TLCAPI";
import { setMemberInfo } from "$DATA/userinfo";
import { otpNumReg } from "$ACTIONS/reg";
import ExceedVerify from "@/OTP/ExceedVerify";
import classNames from "classnames";
import { mailConversion } from "$ACTIONS/util";
import { translate } from "$ACTIONS/Translate";
import { showResultModal } from "$ACTIONS/helper";

const { Item } = Form;
class EmailVerify extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            remainingTime: -1,
            buttonStatus: false,
            memberInfo: JSON.parse(localStorage.getItem("memberInfo")),
        };
        this.EmailVerify = this.EmailVerify.bind(this); // 发送验证码
        this.checkUrlVerifyCode = this.checkUrlVerifyCode.bind(this); // 验证手机号
        this.startCountDown = this.startCountDown.bind(this); // 倒计时
        this.timeTimer = null; // 倒计时Timer
    }

    componentDidMount() {
        clearInterval(this.timeTimer);
        this.getEmailOTPAttempts();
        // Cookie.Get("emailTime") !== null
        //     ? this.startCountDown() :
        //  clearInterval(this.timeTimer);
    }

    componentWillUnmount() {
        clearInterval(this.timeTimer);
        this.setState = () => false;
    }
    /**
     * 获取邮箱验证次数
     */
    getEmailOTPAttempts = () => {
        this.setState({ isLoading: true });
        get(
            ApiPort.GetOTPAttempts +
                `&channelType=Email&serviceAction=WithdrawalVerification`,
        )
            .then((res) => {
                if (res && res.result) {
                    if (res.result.attempt < 1) {
                        this.props.setExceedVisible();
                    } else if (res.result.attempt) {
                        this.props.setEmailAttemptRemaining(res.result.attempt);
                    }
                }
            })
            .catch((error) => {
                console.log("获取邮箱验证次数 error:", error);
            })
            .finally(() => {
                this.setState({ isLoading: false });
            });
    };

    /**
     * @description: 提交数据
     * @param {*}
     * @return {*}
     */

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.checkUrlVerifyCode(values.verifyCode);
            }
        });

        Pushgtagdata(`Verification`, "Submit", `Verify_Email_WithdrawPage`);
    };

    /**
     * @description: 倒计时
     * @return {*}
     */

    startCountDown() {
        clearInterval(this.timeTimer);
        const time =
            Cookie.Get("emailTime").replace("-", "/").replace("-", "/") || -1;
        let times = 600;

        let lastSeconds = parseInt(
            times - (new Date().getTime() - new Date(time).getTime()) / 1000,
        );

        this.setState({ remainingTime: lastSeconds });
        if (time !== null && time !== "") {
            this.timeTimer = setInterval(() => {
                this.setState({ buttonStatus: true });
                if (lastSeconds <= 0) {
                    Cookie.Get("emailTime", null);
                    clearInterval(this.timeTimer);
                    // this.setState({ buttonStatus: false });
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
    /**
     * 发送验证码
     * @param {*} isResend
     */
    EmailVerify(isResend) {
        const promiseVerification = this.props.form.validateFields([
            "emailAddress",
        ]);
        promiseVerification.then(() => {
            const { memberCode } = this.state.memberInfo;
            const emailAccount = this.state.memberInfo.isVerifiedEmail[0];
            let EmailData = {
                serviceAction: "WithdrawalVerification",
                memberCode: memberCode,
                email: this.state.memberInfo.isVerifiedEmail[0],
                ipAddress: "",
                siteId: 16,
            };

            const sendEmailCode = () => {
                this.setState({ isLoading: true });
                post(ApiPort.POSTEmailVerifyAPI, EmailData)
                    .then((res) => {
                        if (res.isSuccess == true && res.result.isSent) {
                            Cookie.Create("emailTime", dateFormat(), 1);
                            this.startCountDown();
                        } else if (res.isSuccess == false) {
                            const { description, errorCode } = res.errors[0];
                            if (
                                errorCode == "REVA0001" ||
                                errorCode == "VAL18015"
                            ) {
                                this.props.setExceedVisible();
                            } else {
                                message.error(
                                    description || translate("发送失败"),
                                );
                            }
                        }
                    })
                    .catch((error) => {
                        console.log("POSTEmailVerifyAPI" + error);
                    })
                    .finally(() => {
                        this.setState({ isLoading: false });
                    });
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
                                          sendEmailCode,
                                      );
                              } else {
                                  this.setState({ isLoading: false });
                                  message.error(res.message);
                              }
                          },
                      );
                  })();
        });

        Pushgtagdata(
            `Verification`,
            "Click",
            `${
                isResend
                    ? "ResendCode_Email_WithdrawPage"
                    : "Send_Email_WithdrawPage"
            }`,
        );
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
        const { memberCode } = this.state.memberInfo;
        let EmailData = {
            memberCode: memberCode,
            email: this.state.memberInfo.isVerifiedEmail[0],
            serviceAction: "WithdrawalVerification",
            tac: code,
            siteId: 16,
        };
        this.setState({ isLoading: true });
        patch(ApiPort.POSTEmailVerifyAPI, EmailData)
            .then((res) => {
                if (res) {
                    let { result } = res;
                    if (res.isSuccess && res.result.isVerified) {
                        showResultModal(
                            translate("验证成功"),
                            true,
                            1501,
                            "otp",
                            "authentication-succeeded",
                        );
                        this.props.getMemberData();
                    } else {
                        if (res.errors && res.errors.length > 0) {
                            this.props.form.setFields({
                                verifyCode: {
                                    value: "",
                                    errors: [
                                        new Error(res.errors[0].description),
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
                            this.props.setEmailAttemptRemaining(
                                result.remainingAttempt,
                            );
                        }
                    }
                }
            })
            .finally(() => {
                this.setState({ isLoading: false });
            });
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { remainingTime, buttonStatus, memberInfo } = this.state;
        const verificationCode = getFieldValue("verifyCode");
        const email = memberInfo && memberInfo.isVerifiedEmail[0];

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
                        <div className="line-distance" />
                        <label
                            style={{
                                font: "normal normal bold 14px/24px Microsoft YaHei",
                                marginBottom: "5px",
                                display: "block",
                                color: "#222222",
                            }}
                        >
                            {translate("验证您的电子邮件地址以继续")}
                        </label>
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
                                        validator: (rule, value, callback) => {
                                            if (value && !email) {
                                                !emailReg.test(email) &&
                                                    callback("邮件格式错误！");
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
                                />,
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
                                        "",
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
                                                        this.EmailVerify(true);
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
                                />,
                            )}
                        </Item>
                        <div className="line-distance" />
                        <Item {...tailFormItemLayout}>
                            <div className="btn-wrap otp-btn-wrap otp-email-btn">
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
                                >
                                    {translate("立即验证")}
                                </Button>
                            </div>
                        </Item>
                        {this.props.otpParam && (
                            <center>
                                {translate("您还剩")}（
                                <span className="blue">
                                    {this.props.emailattemptRemaining}
                                </span>
                                ）{translate("次尝试")}
                            </center>
                        )}
                    </Form>
                </Spin>
            </React.Fragment>
        );
    }
}

export default Form.create({ name: "EmailVerify" })(EmailVerify);
