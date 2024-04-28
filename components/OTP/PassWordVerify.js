import React from "react";
import { Modal, Form, Input, Button, Spin, Steps } from "antd";
import moment from "moment";
import { formatAmount, sub, dateFormat, formatSeconds } from "$ACTIONS/util";
import { Cookie,showResultModal,getDisplayPublicError} from "$ACTIONS/helper";
import { put } from "$ACTIONS/TlcRequest";
import { ApiPort } from "$ACTIONS/TLCAPI";
import { pwdReg } from "$ACTIONS/reg";
import { formItemLayout, tailFormItemLayout } from "$ACTIONS/constantsData";
import Router from "next/router";
import {translate} from "$ACTIONS/Translate";

const { Item } = Form;
const { Step } = Steps;
class PassWordVerify extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            userPassWord: "",
            confirmUserPwd: "",
            userPassWordError: "",
            confirmUserPwdError: "",
            btnStatus: true,
            remainingTime: "10:00",
            verificationTimedOut: false, //提示过期 modal
            pwdType1: "password",
            pwdType2: "password",
            iconName1: "close",
            iconName2: "close",
            firstModal: true,
        };
        this.timeTimer = null; // 倒计时Timer
        this.startCountDown = this.startCountDown.bind(this); // 倒计时
    }
    componentDidMount() {
        Cookie.Create("pwdTime", dateFormat(), { expires: 10 });
        this.startCountDown();
    }
    componentWillUnmount() {
        Cookie.Create("pwdTime", null);
        clearInterval(this.timeTimer);
    }
    startCountDown() {
        this.setState({ remainingTime: "10:00" });
        clearInterval(this.timeTimer);
        const pwdTime = Cookie.Get("pwdTime")
            .replace("-", "/")
            .replace("-", "/");
        let lastSeconds = parseInt(
            600 - (new Date().getTime() - new Date(pwdTime).getTime()) / 1000
        );
        this.timeTimer = setInterval(() => {
            if (lastSeconds <= 0) {
                Cookie.Create("pwdTime", null);
                clearInterval(this.timeTimer);
                this.setState({
                    // verificationTimedOut: true,
                    firstModal: false,
                });
            } else {
                this.setState({ remainingTime: formatSeconds(lastSeconds--) });
            }
        }, 1000);
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const MemberData = {
            newPassword: this.state.userPassWord,
        };
        this.setState({ isLoading: true });
        put(ApiPort.SetChangePassword, MemberData)
            .then((res) => {
                this.setState({ isLoading: false });
                if (res.isSuccess == true) {
                    this.setState({
                        apiError: undefined,
                    });
                    this.setState({ firstModal: false });
                    this.props.setReadStep(0);
                    showResultModal(translate("更新成功"), true, 1501, "otp",'authentication-succeeded');
                    Cookie.Create("pwdTime", null);
                    setTimeout(() => {
                        localStorage.setItem("login-otpPwd", true); // 驗證成功
                        Modal.info({
                            title: translate("重设密码"),
                            centered: true,
                            okText: translate("关闭"),
                            className: `confirm-modal-of-public oneButton dont-show-close-button`,
                            icon: null,
                            content: (
                                <div className="note">
                                    {translate("您已成功重置密码，请使用新密码登录！")}
                                </div>
                            ),
                            onOk: () => {
                                global.globalExit()
                            },
                            zIndex:1502
                        });
                    }, 3000);
                } else {
                    if (res.errors) {
                        this.setState({
                            apiError: getDisplayPublicError(error)||translate("密码重置失败"),
                        });
                    }
                }
            })
            .catch((error) => {
                console.log("updatePassword error:", error);
                this.setState({ isLoading: false });
                if(error?.result?.Code === "MEM00145"){
                    Modal.info({
                        title: translate("密码重置失败"),
                        centered: true,
                        okText: translate("关闭"),
                        className: `confirm-modal-of-public oneButton dont-show-close-button`,
                        icon: null,
                        content: (
                            <div className="note">
                                {translate("新密码不能与旧密码相同")}
                            </div>
                        ),
                        onOk: () => {},
                        zIndex:1502
                    });
                } 
                else {
                    this.setState({
                        apiError: getDisplayPublicError(error)||translate("密码重置失败"),
                    });
                }
            });
    };
    changePassword = (e, v) => {
        if (v === "pwd") {
            this.setState({ 
                userPassWord: e.target.value 
            },()=>{
                if(e.target.value.length < 1){
                    this.setState({
                        userPassWordError: translate('新密码不能为空'),
                        btnStatus: true,
                    });
                } else if (e.target.value && !pwdReg.test(e.target.value)) {
                    this.setState({
                        userPassWordError: translate("密码必须包含 6-20 个字母数字字符“A-Z”、“a-z”、“0-9”，并且可以包含 4 个特殊字符 ^# $@"),
                        btnStatus: true,
                    });
                } else if(e.target.value && pwdReg.test(e.target.value)){
                    this.setState({ userPassWordError: ""});
                    if ( e.target.value === this.state.confirmUserPwd ) {
                        this.setState({ btnStatus: false,confirmUserPwdError: ""});
                    } else{
                        this.setState({ btnStatus: true });
                    }
                } 
            });
        }

        if (v === "confirmpwd") {
            this.setState({ 
                confirmUserPwd: e.target.value 
            },()=>{
                if(e.target.value.length < 1){
                    this.setState({
                        confirmUserPwdError: translate('需要确认密码'),
                        btnStatus: true,
                    });
                } else if (this.state.userPassWord !== e.target.value) {
                    this.setState({
                        confirmUserPwdError: translate('确认密码和新密码不一致'),
                        btnStatus: true,
                    });
                } else {
                    if (this.state.userPassWord === e.target.value) {
                        this.setState({ btnStatus: false, confirmUserPwdError: "",userPassWordError:"" });
                    } else{
                        this.setState({ btnStatus: true });
                    }
                }
            })
        }
    }

    closeModal = () => {
        this.setState({ verificationTimedOut: false });
        Cookie.Create("pwdTime", null);
        global.globalExit();
    };
    onChangePwd(value) {
        if (value === "1") {
            if (this.state.pwdType1 === "password") {
                this.setState({ pwdType1: "text", iconName1: "open" });
            } else {
                this.setState({ pwdType1: "password", iconName1: "close" });
            }
        }
        if (value === "2") {
            if (this.state.pwdType2 === "password") {
                this.setState({ pwdType2: "text", iconName2: "open" });
            } else {
                this.setState({ pwdType2: "password", iconName2: "close" });
            }
        }
    }
    render() {
        const {
            confirmUserPwdError,
            userPassWordError,
            btnStatus,
            remainingTime,
            verificationTimedOut,
            pwdType1,
            pwdType2,
            firstModal,
            iconName1,
            iconName2,
            apiError,
            userPassWord
        } = this.state;
        return (
            <React.Fragment>
                {firstModal && (
                    <Modal
                        title={translate("更改密码")}
                        className="SecurityAnnouncement modal-pubilc OTP-modal"
                        visible={this.props.otpPwdVisible}
                        closable={false}
                        centered={true}
                        width={400}
                        footer={null}
                        zIndex={1500}
                    >
                        <Spin spinning={this.state.isLoading}>
                            <div className="StepsBox SecuritySteps">
                                <Steps current={1} size="small">
                                    <Step />
                                    <Step />
                                </Steps>
                            </div>

                            <Form
                                className="verification-form-wrap"
                                {...formItemLayout}
                                onSubmit={this.handleSubmit}
                            >
                                <div className="line-distance" />
                                <div className="text-tip TextLightYellow">
                                    {translate("您有")} {remainingTime} {translate("分钟更新新密码。 请在时间用完之前更改您的密码。")}
                                </div>
                                <div className="line-distance" />
                                <Item label={translate("新的密码")}>
                                    <Input
                                        size="large"
                                        placeholder={translate("新的密码(小写)")}
                                        className="tlc-input-disabled"
                                        autoComplete="off"
                                        onChange={(e) =>
                                            this.changePassword(e, "pwd")
                                        }
                                        type={pwdType1}
                                        suffix={
                                            <img
                                                className={`icon-${pwdType1}-eyes`}
                                                src={`${process.env.BASE_PATH}/img/user/otpVerify/icon-${iconName1}-eyes.png`}
                                                alt=""
                                                onClick={() =>
                                                    this.onChangePwd("1")
                                                }
                                            />
                                        }
                                    />
                                    {userPassWordError && !userPassWord ? (
                                        <p className="error-tip TextLightRed">
                                            {userPassWordError}
                                        </p>
                                    ) : userPassWordError && userPassWord ?
                                        <p className="TextLight-Off-white">{userPassWordError}</p> : null
                                    }
                                </Item>
                                {apiError && (
                                    <p className="error-tip TextLightRed">
                                        {apiError}
                                    </p>
                                )}
                                <Item label={translate("重新输入新密码")}>
                                    <Input
                                        size="large"
                                        placeholder={translate("重新输入新密码(小写)")}
                                        className="tlc-input-disabled"
                                        autoComplete="off"
                                        onChange={(e) =>
                                            this.changePassword(e, "confirmpwd")
                                        }
                                        type={pwdType2}
                                        suffix={
                                            <img
                                                className={`icon-${pwdType2}-eyes`}
                                                src={`${process.env.BASE_PATH}/img/user/otpVerify/icon-${iconName2}-eyes.png`}
                                                onClick={() =>
                                                    this.onChangePwd("2")
                                                }
                                            />
                                        }
                                    />
                                </Item>
                                {confirmUserPwdError && (
                                    <p className="error-tip TextLightRed">
                                        {confirmUserPwdError}
                                    </p>
                                )}
                                <Item {...tailFormItemLayout}>
                                    <div className="btn-wrap">
                                        <Button
                                            size="large"
                                            type="primary"
                                            htmlType="submit"
                                            block
                                            disabled={btnStatus}
                                        >
                                            {translate("提交")}
                                        </Button>
                                    </div>
                                </Item>
                                {/* <div className="timeTip">请在 {remainingTime} 前完成密码更新。</div> */}
                            </Form>
                        </Spin>
                    </Modal>
                )}

                <Modal
                    title={`等待超时`}
                    className="modal-pubilc OTP-modal "
                    visible={verificationTimedOut}
                    closable={false}
                    centered={true}
                    width={400}
                    footer={null}
                    zIndex={1500}
                >
                    <Spin spinning={this.state.isLoading}>
                        <Form
                            className="verification-form-wrap"
                            {...formItemLayout}
                            onSubmit={this.closeModal}
                        >
                            <div className="line-distance" />
                            <div className={`otpPwdModal-Item`}>
                                {/* <i>
									<img src="/vn/img/user/otpVerify/icon-warn.png" />
								</i> */}
                                {/* <p className="text1">该次登录已经超时</p> */}
                                <p className="text2">
                                    您该次登录已经超时，请再次登录以验证并更新密码。
                                </p>
                            </div>
                            <Item {...tailFormItemLayout}>
                                <div className="btn-wrap">
                                    <Button
                                        size="large"
                                        type="primary"
                                        htmlType="submit"
                                        block
                                    >
                                        重新登录
                                    </Button>
                                </div>
                            </Item>
                        </Form>
                    </Spin>
                </Modal>
            </React.Fragment>
        );
    }
}

export default PassWordVerify;
