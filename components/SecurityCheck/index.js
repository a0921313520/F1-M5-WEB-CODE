/*
 * @Author: Alan
 * @Date: 2023-01-12 09:46:43
 * @LastEditors: Alan
 * @LastEditTime: 2023-03-08 13:36:59
 * @Description:安全检查
 * @FilePath: \F1-M1-WEB-Code\components\SecurityCheck\index.js
 */
import React from "react";
import classNames from "classnames";
import EmailVerify from "@/Verification/EmailVerify";
import PhoneVerify from "@/Verification/PhoneVerify";
import { get } from "$ACTIONS/TlcRequest";
import { ApiPort } from "$ACTIONS/TLCAPI";
import { Button } from "antd";
import {translate} from "$ACTIONS/Translate";

class SecurityCheck extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            announcement: false,
            emailattemptRemaining: 5,
            attemptRemaining: 5,
            phoneVisible: false,
            emailVisible: false,
        };
    }
    componentDidMount() {
        this.SecurityCheckInfo();
    }

    SecurityCheckInfo() {
        let memberInfo = JSON.parse(localStorage.getItem("memberInfo"));
        let Low, Medium, High;
        if (memberInfo) {
            //低安全等级
            Low =
                (memberInfo.isVerifiedPhone &&
                !memberInfo.isVerifiedPhone[1] &&
                memberInfo.isVerifiedEmail &&
                !memberInfo.isVerifiedEmail[1] &&
                memberInfo.firstName == "") ||
                (memberInfo.isVerifiedPhone &&
                memberInfo.isVerifiedPhone[1] ||
                memberInfo.isVerifiedEmail &&
                memberInfo.isVerifiedEmail[1] ||
                memberInfo.firstName !== "");
            //中安全等级
            Medium =
                (memberInfo.isVerifiedPhone &&
                    memberInfo.isVerifiedPhone[1] &&
                    memberInfo.isVerifiedEmail &&
                    memberInfo.isVerifiedEmail[1]) ||
                (memberInfo.isVerifiedEmail &&
                    memberInfo.isVerifiedEmail[1] &&
                    memberInfo.firstName !== "") ||
                (memberInfo.isVerifiedPhone &&
                    memberInfo.isVerifiedPhone[1] &&
                    memberInfo.firstName !== "");
            //高安全等级
            High =
                memberInfo.isVerifiedPhone &&
                memberInfo.isVerifiedPhone[1] &&
                memberInfo.isVerifiedEmail &&
                memberInfo.isVerifiedEmail[1] &&
                memberInfo.firstName !== "";
            this.setState({
                firstName: memberInfo.firstName,
                Low: Low,
                Medium: Medium,
                High: High,
                isVerifiedEmail: memberInfo.isVerifiedEmail
                    ? memberInfo.isVerifiedEmail[1]
                    : false,
                isVerifiedPhone: memberInfo.isVerifiedPhone
                    ? memberInfo.isVerifiedPhone[1]
                    : false,
            });
        }
    }

    VerifyCategory = (param, otpVisible, status) => {
        if (param == "Email") return this.setState({ emailVisible: status });
        if (param == "Phone") return this.setState({ phoneVisible: status });
    };

    render() {
        const {
            High,
            Medium,
            Low,
            firstName,
            isVerifiedEmail,
            isVerifiedPhone,
        } = this.state;
        return (
            <div className="account-wrap SecurityCheck">
                <h2>{translate("帐户验证")}</h2>
                <p>
                    {translate("安全级别：")} <b>{High ? translate("高") : Medium ? translate("中") : translate("低")}</b>
                </p>

                <div className="Progress">
                    <div
                        className={classNames({
                            Bar: true,
                            redBar: !High && !Medium && Low,
                            greenBar: High,
                            yellowBar: !High && Medium,
                        })}
                        style={{
                            width: High ? "100%" : Medium ? "66%" : "33%",
                        }}
                    />
                </div>

                <p className="txt">
                    <small>{translate("为了提高安全性，请验证您的帐户")}</small>
                </p>
                <p className="note">
                    {translate("FUN88始终遵守规则、条款和隐私，提供安全可靠的服务。 验证您的帐户以提高安全性")}
                </p>
                <div className="CheckBox">
                    <div className="List">
                        <img
                            src={`${process.env.BASE_PATH}/img/icon/info.png`}
                            width="40px"
                            height="30px"
                        />
                        <div className="typeTitle">
                            <b>{translate("身份验证")}<br/>{translate("公民身份")}</b>
                        </div>
                        <div className="TypeName">{translate("验证您的真实姓名")}</div>
                        {!firstName && (
                            <Button
                                type="primary"
                                onClick={() => {
                                    this.props.goPage("userinfo");
                                }}
                            >
                                {translate("立即验证")}
                            </Button>
                        )}
                        {firstName && (
                            <div className="iconChecked">
                                <img
                                    src={`${process.env.BASE_PATH}/img/icons/icon-checked.png`}
                                    width="20px"
                                    height="20px"
                                />
                                {translate("已验证")}
                            </div>
                        )}
                    </div>
                    <div className="List">
                        <img
                            src={`${process.env.BASE_PATH}/img/icon/phone.png`}
                            width="20px"
                            height="32px"
                        />
                        <div className="typeTitle">
                            <b>{translate("身份验证")}<br/>{translate("电话号码")}</b>
                        </div>

                        <div className="TypeName">{translate("有效电话号码验证")}</div>
                        {!isVerifiedPhone ? (
                            <Button
                                type="primary"
                                onClick={() => {
                                    this.setState({ phoneVisible: true });
                                }}
                            >
                                {translate("立即验证")}
                            </Button>
                        ) : (
                            <div className="iconChecked">
                                <img
                                    src={`${process.env.BASE_PATH}/img/icons/icon-checked.png`}
                                    width="20px"
                                    height="20px"
                                />
                                {translate("已验证")}
                            </div>
                        )}
                    </div>
                    <div className="List">
                        <img
                            src={`${process.env.BASE_PATH}/img/icon/email.png`}
                            width="38px"
                            height="25px"
                        />

                        <div className="typeTitle">
                            <b>{translate("身份验证")}<br/>{translate("邮箱")}</b>
                        </div>

                        <div className="TypeName">{translate("有效电子邮件验证")}</div>
                        {!isVerifiedEmail ? (
                            <Button
                                type="primary"
                                onClick={() => {
                                    this.setState({ emailVisible: true });
                                }}
                            >
                                {translate("立即验证")}
                            </Button>
                        ) : (
                            <div className="iconChecked">
                                <img
                                    src={`${process.env.BASE_PATH}/img/icons/icon-checked.png`}
                                    width="20px"
                                    height="20px"
                                />
                                {translate("已验证")}
                            </div>
                        )}
                    </div>
                </div>
                <EmailVerify
                    memberInfo={this.props.memberInfo}
                    visible={this.state.emailVisible}
                    closeModal={() => this.setState({ emailVisible: false })}
                    correctMemberInfo={() => {
                        this.props.getmemberInfo(this);
                    }}
                    changeVerify={this.VerifyCategory}
                    otpParam={`memberProfile-otp`}
                    emailattemptRemaining={this.state.emailattemptRemaining}
                    setEmailAttemptRemaining={(v) =>
                        this.setState({ emailattemptRemaining: v })
                    }
                />
                <PhoneVerify
                    isEditPhone={false}
                    memberInfo={this.props.memberInfo}
                    visible={this.state.phoneVisible}
                    closeModal={() => this.setState({ phoneVisible: false })}
                    correctMemberInfo={() => {
                        this.props.getmemberInfo(this);
                    }}
                    changeVerify={this.VerifyCategory}
                    otpParam={`memberProfile-otp`}
                    attemptRemaining={this.state.attemptRemaining}
                    setAttemptRemaining={(v) =>
                        this.setState({ attemptRemaining: v })
                    }
                />
            </div>
        );
    }
}

export default SecurityCheck;
