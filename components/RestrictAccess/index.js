import React from "react";
import Layout from "@/Layout/other";
import { ApiPort, CMSAPIUrl } from "$ACTIONS/TLCAPI";
import { get, post } from "$ACTIONS/TlcRequest";
import { Input, Form, message, Button, DatePicker, Spin } from "antd";
import { formItemLayout } from "$ACTIONS/constantsData";
import { realyNameReg, emailReg } from "$ACTIONS/reg";
import moment from "moment";
import Router from "next/router";
const { Item } = Form;

class RestrictAccess extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            RestrictAccessCode: "", // 帳戶關閉或失效的代號
            attempts: 3, // 驗證剩餘次數，預設3
            VerifyStep: 0, // 驗證步驟,0通知框，1驗證框，2成功框，3失敗框
            memberInfo: {
                // 驗證提交數據
                userName: "",
                dob: "",
                email: "",
                FirstName: "",
                LastName: "",
            },
            isValid: null, // 驗證數據是否有符合
            message: "", // api返回description
            isLoading: false,
            imageName: "img-restricted", // 左圖變化
            isComplete: false, // 會員資料是否完善
            isDisable: true, // 按鈕控制
            logoHref: "",
        };

        this.defaultMinDate = moment(new Date()).subtract(18, "year");
        this.openServer = this.openServer.bind(this);
        this.PopUpLiveChat = this.PopUpLiveChat.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this); // 提交驗證
        this.disabledDate = this.disabledDate.bind(this); // 获取生日可选范围
        this.buttonStatus = this.buttonStatus.bind(this); // 控制提交按鈕是否disable
        this.TLCLive = null;
    }

    componentDidMount() {
        this.setState({
            RestrictAccessCode: localStorage.getItem("RestrictAccessCode"), // 獲取RestrictAccessCode
            memberInfo: {
                ...this.state.memberInfo,
                userName: localStorage.getItem("userName"),
            },
        });

        // const logoHref = sessionStorage.getItem("logoHref");
        // logoHref
        //     ? this.setState({ logoHref })
        //     : get(
        //           CMSAPIUrl +
        //               `/vi-vn/api/v1/web/webbanners/position/home_main_logo?login=before`
        //       ).then((res) => {
        //           if (Array.isArray(res) && res.length) {
        //               sessionStorage.setItem("logoHref", res[0].cmsImageUrl);
        //               this.setState({ logoHref: res[0].cmsImageUrl });
        //           }
        //       });

        //this.getMemberVerification();
        // this.getConfiscatedAccountInfoValidation();
    }

    openServer(tlcServerUrl) {
        this.TLCLive.document.title = "FUN88VN Live Chat";
        this.TLCLive.location.href = tlcServerUrl;
        this.TLCLive.focus();
    }

    PopUpLiveChat() {
        this.TLCLive && this.TLCLive.close();
        this.TLCLive = window.open(
            "about:blank",
            "chat",
            "toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=540, height=650",
        );
        const serverUrl = localStorage.getItem("serverUrl");

        if (!serverUrl) {
            get(ApiPort.GETLiveChat).then((res) => {
                if (res) {
                    localStorage.setItem("serverUrl", res.url);
                    this.openServer(res.url);
                }
            });
        } else {
            this.openServer(serverUrl);
        }
    }

    verifySuccess() {
        //驗證成功
        localStorage.setItem("autoLogin", true);
        setTimeout(() => {
            Router.push("/");
        }, 3000);
    }

    getMemberVerification() {
        // 獲取次數
        let data = { userName: localStorage.getItem("userName") };

        // post(ApiPort.ConfiscatedMemberVerifyAttempts, data)
        //     .then((res) => {
        //         this.setState({ attempts: res && res.result.attemptRemaining });
        //     })
        //     .catch((error) => {
        //         console.log("RestrictAccess", error);
        //     });
    }

    getConfiscatedAccountInfoValidation() {
        // 獲取會員是否完整
        let data = { userName: localStorage.getItem("userName") };

        this.setState({ isLoading: true });
        post(ApiPort.ConfiscatedAccountInfoValidation, data)
            .then((res) => {
                this.setState({
                    isLoading: false,
                    isComplete:
                        res && res.result.code === "MEM00057" ? true : false,
                });
            })
            .catch((error) => {
                console.log("RestrictAccess", error);
            });
    }

    handleSubmit(e) {
        e.preventDefault();
        const { memberInfo } = this.state;
        // const testName = /^[\u4e00-\u9fa5]+$|^[a-zA-Z\s]+$/
        if (!memberInfo.dob) return message.error("出生日期无效。");
        // if (!testName.test(memberInfo.firstName)) return message.error('真实姓名为无效格式。');
        if (!emailReg.test(memberInfo.email))
            return message.error("电子邮箱地址为无效格式。");
        this.setState({ isLoading: true });

        post(ApiPort.ConfiscatedMemberVerification, memberInfo)
            .then((res) => {
                if (res != undefined && res.isSuccess) {
                    this.setState({
                        isValid: res.result.isValid,
                        message: res.result.message,
                        isLoading: false,
                    });

                    if (res.result && res.result.attempts != undefined) {
                        // 判斷是否有attempts次數，若會員基本資料不齊全，則api不返回attempts
                        this.setState({ attempts: res.result.attempts });
                        if (res.result.attempts === 0) {
                            this.setState({ VerifyStep: 3 });
                        }
                    }

                    if (res.result && res.result.code) {
                        // 會員資料不完善，
                        // this.setState({ isComplete: res.result.code, VerifyStep: 0 })
                        return message.error(res.result.message);
                    }

                    if (res.result && res.result.isValid) {
                        // 驗證成功
                        this.setState({
                            VerifyStep: 2,
                            imageName: "img-success",
                        });
                    }
                }

                if (res != undefined && !res.isSuccess)
                    return message.error(res.result.message);
            })
            .catch((error) => {
                console.log("RestrictAccess", error);
            });
    }

    verifyChange(type, e) {
        const { memberInfo } = this.state;
        if (type == "Name") {
            this.setState(
                {
                    memberInfo: {
                        ...memberInfo,
                        FirstName: e.target.value.trim(),
                    },
                },
                () => this.buttonStatus(),
            );
        } else if (type == "dob") {
            this.setState(
                {
                    memberInfo: {
                        ...memberInfo,
                        dob: moment(e._d).format("YYYY-MM-DD"),
                    },
                },
                () => this.buttonStatus(),
            );
        } else if (type == "email") {
            this.setState(
                { memberInfo: { ...memberInfo, email: e.target.value.trim() } },
                () => this.buttonStatus(),
            );
        }
    }

    buttonStatus() {
        const { memberInfo } = this.state;
        if (
            memberInfo.dob.length &&
            memberInfo.email.length &&
            memberInfo.firstName.length
        ) {
            this.setState({ isDisable: false });
        } else {
            this.setState({ isDisable: true });
        }
    }

    disabledDate(current) {
        return (
            current &&
            (current <= moment(new Date("1930/01/01")) ||
                current >= moment(new Date()).subtract(18, "year"))
        );
    }

    render() {
        const {
            RestrictAccessCode,
            attempts,
            VerifyStep,
            isValid,
            message,
            isLoading,
            imageName,
            isComplete,
            isDisable,
        } = this.state;
        const { httpStatus } = this.props;
        return (
            <Layout>
                <div className="maintain-content">
                    <div className="maintain-img inline-block center"></div>
                    <div className="maintain-info inline-block">
                        <Spin spinning={isLoading}>
                            {RestrictAccessCode == "MEM00140" &&
                                httpStatus != "4" && ( // 帳戶關閉
                                    <React.Fragment>
                                        <h2>您的账户已关闭</h2>
                                        <p className="description">
                                            因为您长时间未游戏，您的账户已关闭。请注册新的账号或与客服联系。
                                        </p>
                                    </React.Fragment>
                                )}

                            {RestrictAccessCode == "MEM00141" &&
                                httpStatus != "4" &&
                                VerifyStep == 0 && ( // 帳戶失效
                                    <React.Fragment>
                                        <h2>您的账户已被禁止使用</h2>
                                        {attempts && isComplete
                                            ? "请回答与您的账户相关的安全问题，或与在线客服联系验证您的身份。"
                                            : !attempts
                                              ? "您的账户已被禁止使用，您最多只能提交验证3次，请联系在线客服。"
                                              : !isComplete
                                                ? "您的验证尚未完成，请与在线客服联系以验证您的身份。"
                                                : null}
                                        <button
                                            style={{
                                                display:
                                                    attempts && isComplete
                                                        ? "block"
                                                        : "none",
                                            }}
                                            className="verify-btn"
                                            onClick={() =>
                                                this.setState({
                                                    VerifyStep: 1,
                                                })
                                            }
                                        >
                                            <span>开始验证</span>
                                        </button>
                                    </React.Fragment>
                                )}

                            {isValid &&
                                VerifyStep == 2 && ( // 驗證成功
                                    <React.Fragment>
                                        <h2>账户验证成功</h2>
                                        <p className="description">{message}</p>
                                    </React.Fragment>
                                )}

                            {isValid === false &&
                                attempts === 0 &&
                                VerifyStep == 3 && ( // 驗證失敗
                                    <React.Fragment>
                                        <h2>账户验证失败</h2>
                                        <p className="description">{message}</p>
                                    </React.Fragment>
                                )}

                            {attempts !== 0 &&
                                VerifyStep == 1 && ( // 失效驗證步驟
                                    <React.Fragment>
                                        <h2 style={{ marginTop: 0 }}>
                                            账户验证
                                        </h2>
                                        <p className="description verify-des">
                                            请回答以下问题，以验证您的身份，并重新启动您的账户。
                                        </p>

                                        {isValid === false && (
                                            <p className="description verify-des">
                                                请提供有效信息以便我们处理您的请求，您最多只能再提交{" "}
                                                <span className="red">
                                                    {attempts}
                                                </span>{" "}
                                                次。或是请联系
                                                <span
                                                    className="cs-blue"
                                                    onClick={this.PopUpLiveChat}
                                                >
                                                    在线客服
                                                </span>
                                                。
                                            </p>
                                        )}

                                        <Form
                                            {...formItemLayout}
                                            onSubmit={this.handleSubmit}
                                        >
                                            <Item label="生日日期">
                                                <DatePicker
                                                    className="tlc-date"
                                                    onChange={this.verifyChange.bind(
                                                        this,
                                                        "dob",
                                                    )}
                                                    defaultPickerValue={moment(
                                                        this.defaultMinDate,
                                                    )}
                                                    disabledDate={
                                                        this.disabledDate
                                                    }
                                                    showToday={false}
                                                    allowClear={false}
                                                    style={{
                                                        width: "100%",
                                                    }}
                                                    size="large"
                                                    placeholder="请选择日期"
                                                    format="YYYY-MM-DD"
                                                />
                                            </Item>
                                            <Item label="注册姓名">
                                                <Input
                                                    placeholder="请输入您的姓名"
                                                    onChange={this.verifyChange.bind(
                                                        this,
                                                        "Name",
                                                    )}
                                                    size="large"
                                                />
                                            </Item>
                                            <Item label="邮箱地址">
                                                <Input
                                                    placeholder="请输入邮箱地址"
                                                    onChange={this.verifyChange.bind(
                                                        this,
                                                        "email",
                                                    )}
                                                    size="large"
                                                />
                                            </Item>
                                            <Button
                                                className={`verify-btn ${
                                                    isDisable
                                                        ? "isDisable"
                                                        : null
                                                }`}
                                                size="large"
                                                type="primary"
                                                htmlType="submit"
                                                disabled={isDisable}
                                            >
                                                提交
                                            </Button>
                                        </Form>
                                    </React.Fragment>
                                )}
                            <React.Fragment>
                                <img
                                    src={`${process.env.BASE_PATH}/img/closeIcon/closeIcon.svg`}
                                    alt="乐天堂"
                                ></img>
                                <h2>帐号违反乐天堂条规</h2>
                                <p>
                                    对不起，您的账号违反乐天堂条规，我们将暂停服务或关闭您的用户账户。
                                </p>
                            </React.Fragment>
                            {VerifyStep !== 2 && (
                                <button
                                    className="theme-btn"
                                    onClick={this.PopUpLiveChat}
                                >
                                    <i className="tlc-sprite maintain-service"></i>
                                    <span>在线客服</span>
                                </button>
                            )}
                            {VerifyStep === 2 && (
                                <button
                                    className="theme-btn"
                                    onClick={this.verifySuccess.bind(this)}
                                >
                                    <span>确定</span>
                                </button>
                            )}
                            {attempts && VerifyStep == 1 ? (
                                <div className="reminder">
                                    可提交次数还剩{" "}
                                    <span className="red">{attempts}</span> 次
                                </div>
                            ) : null}
                        </Spin>
                    </div>
                </div>
            </Layout>
        );
    }
}

export default RestrictAccess;
