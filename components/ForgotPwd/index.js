import React from "react";
import { post } from "$ACTIONS/TlcRequest";
import { ApiPort, APISETS } from "$ACTIONS/TLCAPI";
import { Button, message, Input, Form, Modal, Tabs } from "antd";
import { getQueryVariable,getDisplayPublicError } from "$ACTIONS/helper";
import {translate} from "$ACTIONS/Translate";
import {emailReg as emailRegex,regSymbols} from "$ACTIONS/reg";
const TabPane = Tabs.TabPane;
message.config({
    top: 100,
    duration: 2,
    maxCount: 1,
});

class ForgotPwd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            NEWPWD: "",
            OLDPWD: "",
            visible: false,
            Name: "",
            Email: "",
            EmailForForgetUser: "",
            loading: false,
            defaultkey: "1",
            activeIndex: "1",
            errorname: "",
            erroremail: "",
            erroremailForForgetUser: "",
            errorMessage: "",
            errorMessageForForgetUser: "",
            submitstatus: false,
            invalidInput: true,
            invalidInputForForgetUser: true,
        };
        this.UpdateMemberPWD = this.UpdateMemberPWD.bind(this);
        this.MemberChange = this.MemberChange.bind(this);
        this.EmailForgetPassword = this.EmailForgetPassword.bind(this);
        this.Forgetuser = this.Forgetuser.bind(this);
    }
    componentDidMount() {
        this.setState({
            defaultkey: this.props.Forgotkey,
        });
        const actionParam = getQueryVariable("action");
        actionParam === "forget" && this.showModal(1);
    }

    MemberChange(type, e) {
        if (type == "OLDPWD") {
            this.setState({ OLDPWD: e.target.value });
        } else if (type == "Name") {
            this.setState({ Name: e.target.value }, () => {
                const { Name, Email } = this.state;

                if (Name.trim().length === 0) {
                    this.setState({
                        errorname: translate("填写用户名"),
                        invalidInput: true,
                    });
                    return;
                }

                if (emailRegex.test(Email) && Name.trim().length != 0) {
                    this.setState({ invalidInput: false });
                }
            });
        } else if (type == "Email") {
            this.setState({ Email: e.target.value }, () => {
                const { Email, Name } = this.state;

                if (!emailRegex.test(Email) && Email.trim().length > 0) {
                    this.setState({
                        erroremail: translate("无效电子邮件格式"),
                        invalidInput: true,
                    });
                    return;
                }
                if (Email.trim().length === 0) {
                    this.setState({
                        erroremail: translate("请输入电子邮箱"),
                        invalidInput: true,
                    });
                    return;
                }

                if (emailRegex.test(Email) && Name.trim().length != 0) {
                    this.setState({ invalidInput: false });
                }
            });
        } else if (type == "EmailForForgetUser") {
            this.setState({ EmailForForgetUser: e.target.value }, () => {
                const { EmailForForgetUser } = this.state;

                if (
                    !emailRegex.test(EmailForForgetUser) &&
                    EmailForForgetUser.trim().length > 0
                ) {
                    this.setState({
                        erroremailForForgetUser: translate("无效电子邮件格式"),
                        invalidInputForForgetUser: true,
                    });
                    return;
                }
                if (EmailForForgetUser.trim().length === 0) {
                    this.setState({
                        erroremailForForgetUser: translate("请输入电子邮箱"),
                        invalidInputForForgetUser: true,
                    });
                    return;
                }

                this.setState({ invalidInputForForgetUser: false });
            });
        } else {
            this.setState({ NEWPWD: e.target.value });
        }
    }

    showModal = (e) => {
        this.setState({
            visible: true,
            defaultkey: e,
        });
        if(e === 1){
            global.Pushgtagpiwikurl("forget_password","Forget Password");
        }
    };

    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
        //	this.props.pwdModalClose('isShowPwdModal', false);
    };

    EmailForgetPassword() {
        this.setState({
            submitstatus: true,
        });

        let { Email, Name } = this.state;

        Name = Name.trim();

        if (Name == "") {
            this.setState({
                errorname: translate("填写用户名"),
            });
            return;
        }
        if (regSymbols.test(Email)) {
            this.setState({
                erroremail: translate("无效电子邮件格式"),
            });
            return;
        }
        if (emailRegex.test(Email) == false) {
            this.setState({
                erroremail: translate("无效电子邮件格式"),
            });
            return;
        }

        this.setState({
            loading: true,
        });

        let params = { username: Name, email: Email };
        let responseData = {};
        post(`${ApiPort.POSTEmailForgetPassword}`, params)
            .then((res) => {
                if (res?.isSuccess) {
                    Modal.info({
                        className: "confirm-modal-of-public forgetPwdModal",
                        icon: <></>,
                        title: translate("发送订单成功"),
                        centered: true,
                        okText: translate("关闭"),
                        zIndex: 2000,
                        content: (
                            <div
                                style={{ textAlign: "center" }}
                                dangerouslySetInnerHTML={{
                                    __html: translate("密码更新链接已发送至您的邮箱，请检查您的注册邮箱"),
                                }}
                            />
                        ),
                    });
                    return;
                } else {
                    this.setState({ errorMessage: getDisplayPublicError(res) || translate("电子邮件或用户名无效，请重试")});
                }
                responseData = res;
            }).catch((error) => {
                console.log(error);
                responseData(error)
            }).finally(()=>{
                this.setState({
                    loading: false,
                });
                const messages = responseData?.isSuccess ? "" : getDisplayPublicError(responseData);
                Pushgtagdata(
                    "ForgetPassword", 
                    "Submit Forget Password", 
                    "ForgetPassword_S_Email&Name",
                    responseData?.isSuccess ? 2 : 1,
                    [
                        {customVariableKey: responseData?.isSuccess ? false : "ForgetPassword_S_Email&Name_ErrorMsg",
                        customVariableValue: responseData?.isSuccess ? false : messages || translate("电子邮件地址无效，请重试")}
                    ]
                );
            });
    }

    Forgetuser() {
        this.setState({
            submitstatus: true,
        });
        if (regSymbols.test(this.state.EmailForForgetUser)) {
            this.setState({
                erroremailForForgetUser: translate("无效电子邮件格式"),
            });
            return;
        }
        if (emailRegex.test(this.state.EmailForForgetUser) != true) {
            this.setState({
                erroremailForForgetUser: translate("无效电子邮件格式"),
            });
            return;
        }
        this.setState({
            loading: true,
        });
        let responseData = {};
        post(
            ApiPort.POSTForgetUsername +
                "email=" +
                this.state.EmailForForgetUser +
                "&redirectUrl=" +
                ApiPort.LOCAL_HOST +
                APISETS
        ).then((res) => {
            if (res?.isSuccess) {
                Modal.info({
                    className: "confirm-modal-of-forgetuser",
                    icon: <></>,
                    title: translate("发送订单成功"),
                    centered: true,
                    okText: translate("关闭"),
                    closable: true,
                    zIndex: 2000,
                    content: (
                        <div
                            style={{ textAlign: "center" }}
                            dangerouslySetInnerHTML={{
                                __html: translate("您的用户名已成功发送到您的电子邮件地址"),
                            }}
                        />
                    ),
                });
            } else {
                this.setState({
                    errorMessageForForgetUser: getDisplayPublicError(res) || translate("电子邮件地址无效，请重试"),
                });
            }
            responseData = res;
        }).catch((error) => {
                this.setState({
                    errorMessageForForgetUser: getDisplayPublicError(error) || translate("电子邮件地址无效，请重试"),
                });
                responseData = error;
        }).finally(()=>{
            this.setState({
                loading: false,
            });
            const messages = responseData?.isSuccess ? "" : getDisplayPublicError(responseData);
            Pushgtagdata(
                "ForgetUsername", 
                "Submit Forget Username", 
                "ForgetUsername_S_Email",
                responseData?.isSuccess ? 2 : 1,
                [
                    {customVariableKey: responseData?.isSuccess ? false : "Forget_Username_S_Email_ErrorMsg",
                    customVariableValue: responseData?.isSuccess ? false : messages || translate("电子邮件地址无效，请重试")}
                ]
            );
        })
    }
    UpdateMemberPWD() {
        const { NEWPWD, OLDPWD } = this.state;
        const MemberData = {
            oldPassword: OLDPWD,
            newPassword: NEWPWD,
        };

        post(PUTMemberPassword, MemberData)
            .then((res) => {
                console.log(res);
                this.setState({
                    loading: false,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    onTabChange(key) {
        this.setState({
            Email: "",
            activeIndex: key,
            submitstatus: false,
        });
        if(key == "1"){
            global.Pushgtagpiwikurl("forget_password","Forget Password");
            Pushgtagdata("ForgetUsername","Go to Forget Password","ForgetUsername_C_ForgetPassword")
        }
        else {
            global.Pushgtagpiwikurl("forget_username","Forget User Name");
            Pushgtagdata("ForgetPassword","Go to Forget Username","ForgetPassword_C_ForgetName")
        }
    }

    render() {
        const {
            loading,
            defaultkey,
            activeIndex,
            visible,
            Name,
            Email,
            EmailForForgetUser,
            errorname,
            erroremail,
            erroremailForForgetUser,
            submitstatus,
        } = this.state;
        return (
            <Modal
                title={translate(activeIndex == 1 ? "忘记密码了" : "忘记用户名了")}
                visible={visible}
                onOk={this.handleCancel}
                onCancel={this.handleCancel}
                destroyOnClose={true}
                footer={null}
                className="modal-pubilc ForgotPwdModal"
                width={400}
                zIndex={2000}
            >
                <Tabs
                    defaultActiveKey={String(defaultkey)}
                    className="Forget-pwd-tabs tabs-modal-pubilc"
                    size="small"
                    tabPosition="top"
                    onChange={(activeKey) => {
                        this.onTabChange.call(this, activeKey);
                    }}
                >
                    <TabPane tab={translate("密码")} key="1">
                        {this.state.errorMessage && (
                            <div className="invalid-input-error">
                                {this.state.errorMessage}
                            </div>
                        )}
                        <div className="IputBox">
                            <div>
                                <label>{translate("电子邮箱地址")}</label>
                                <Input
                                    type="email"
                                    value={Email}
                                    placeholder={translate("填写邮箱地址")}
                                    className={
                                        (submitstatus || erroremail) &&
                                        (Email === "" ||
                                            !emailRegex.test(Email))
                                            ? "invalid-input-box-error"
                                            : ""
                                    }
                                    onChange={this.MemberChange.bind(
                                        this,
                                        "Email"
                                    )}
                                    onPressEnter={this.EmailForgetPassword.bind(
                                        this
                                    )}
                                    size="large"
                                />
                                {(submitstatus || erroremail) &&
                                    (Email === "" ||
                                        !emailRegex.test(Email)) && (
                                        <div className="error">
                                            {erroremail}
                                        </div>
                                    )}
                            </div>
                            <div>
                                <label>{translate("用户名")}</label>
                                <Input
                                    value={Name}
                                    placeholder={translate("填写用户名")}
                                    className={
                                        (submitstatus || errorname) &&
                                        Name === ""
                                            ? "invalid-input-box-error"
                                            : ""
                                    }
                                    onChange={this.MemberChange.bind(
                                        this,
                                        "Name"
                                    )}
                                    onPressEnter={this.EmailForgetPassword.bind(
                                        this
                                    )}
                                    size="large"
                                    maxLength={20}
                                />
                                {(submitstatus || errorname) && Name === "" && (
                                    <div className="error">{errorname}</div>
                                )}
                            </div>
                        </div>
                        <Button
                            disabled={this.state.invalidInput}
                            type="primary"
                            size="large"
                            onClick={() => {
                                this.EmailForgetPassword.call(this);
                            }}
                            loading={loading}
                            style={{ width: "100%" }}
                        >
                            {translate("提交")}
                        </Button>
                    </TabPane>
                    <TabPane tab={translate("忘记用户名")} key="2">
                        {/* <p>请填写您的电子邮箱地址。此邮件地址将被用来发送账户重要信息和申请奖金时所必需的优惠代码。</p> */}
                        {this.state.errorMessageForForgetUser && (
                            <div className="invalid-input-error">
                                {this.state.errorMessageForForgetUser}
                            </div>
                        )}
                        <label>{translate("电子邮箱地址")}</label>
                        <div className="IputBox forgetuser-input">
                            <Input
                                type="email"
                                value={EmailForForgetUser}
                                placeholder={translate("填写邮箱地址")}
                                className={
                                    (submitstatus || erroremailForForgetUser) &&
                                    (EmailForForgetUser === "" ||
                                        !emailRegex.test(EmailForForgetUser))
                                        ? "invalid-input-box-error"
                                        : ""
                                }
                                onChange={this.MemberChange.bind(
                                    this,
                                    "EmailForForgetUser"
                                )}
                                onPressEnter={this.Forgetuser.bind(this)}
                                size="large"
                            />
                            {(submitstatus || erroremailForForgetUser) &&
                                (EmailForForgetUser === "" ||
                                    !emailRegex.test(EmailForForgetUser)) && (
                                    <div className="error">
                                        {erroremailForForgetUser}
                                    </div>
                                )}
                        </div>
                        <Button
                            disabled={this.state.invalidInputForForgetUser}
                            type="primary"
                            size="large"
                            loading={loading}
                            onClick={() => {
                                this.Forgetuser.call(this);
                            }}
                            // className="GreenBtn LoginGreenbtn"
                            style={{ width: "100%" }}
                        >
                            {translate("提交")}
                        </Button>
                        {/* <Button
							type="default"
							size="large"
							onClick={() => {
								this.setState({
									visible: false
								});
							}}
							style={{ width: '100%', marginTop: '10px' }}
						>
							返回
						</Button> */}
                    </TabPane>
                </Tabs>
            </Modal>
        );
    }
}
export default ForgotPwd;
