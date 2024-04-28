import React from "react";
import { get, post } from "$ACTIONS/TlcRequest";
import { Button, Input, message, Spin, Row, Col, Modal, Form } from "antd";
import { ApiPort } from "$ACTIONS/TLCAPI";
import { regforLogin, regforLoginReg,pwdReg,nameReg} from "$ACTIONS/reg";
import Router from "next/router";
import CryptoJS from "crypto-js";
import { getQueryVariable, Cookie, getDisplayPublicError,getE2BBValue } from "$ACTIONS/helper";
import { Cookie as CookieUtil } from "$ACTIONS/util";
import Captcha from "../Captcha";
import { getMemberInfo } from "$DATA/userinfo";
import { SuccessIcon } from "./RegisterIcnoSvg";
import { toast } from "react-toastify";
import ForgotPwd from "@/ForgotPwd/";
import {translate} from "$ACTIONS/Translate";

const CustomToast = ({ message }) => (
    <div className="custom-toast">
        <SuccessIcon />
        <span>{message}</span>
    </div>
);
class _Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            UserName: "",
            Password: "",
            userNameInputLengthIsValid: false,
            passwordInputLengthIsValid: false,
            loginAt: "homepage",
            errorMessage: "", // for login modal
            captchaCode: "",
            isLogin: false,
            Spin: false,
            loadinglogin: false,
            isRegister: false,
            // OpenGeetest: false,
            challengeUuid: "",
            captchaVisible: false,
        };

        this.Login = this.Login.bind(this);
        this.successLogin = this.successLogin.bind(this);
        this.isFirstLogin = null;
        this.isCaptchaOn = true;
        this.ForgotPwd = React.createRef();
    }

    componentDidMount() {
        this.props.RefLogin && this.props.RefLogin(this);
        // QRT 参数自动登陆
        function decrypt(text, key) {
            let md5Key = CryptoJS.MD5(key).toString();
            let keyHex = CryptoJS.enc.Hex.parse(md5Key);
            let decrypt = CryptoJS.TripleDES.decrypt(text, keyHex, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7,
            });
            //解析数据后转为UTF-8
            let parseData = decrypt.toString(CryptoJS.enc.Utf8);
            return parseData;
        }

        // QRT加密参数登录
        const QRT = getQueryVariable("QRT");
        if (QRT) {
            const str = decrypt(decodeURIComponent(QRT), "TLCQuickReg");
            const tokenArray = str.split("&");
            let tokenObject = {};
            tokenArray.forEach((v) => {
                let tokenKeyVal = v.split("=");
                tokenObject[tokenKeyVal[0]] = tokenKeyVal[1];
            });
            this.RefreshTokenApi(
                tokenObject.refreshToken,
                "Bearer " + tokenObject.token,
                tokenObject.isRegistration
            );
        }

        // redirectToken参数登录
        // const redirectToken = getQueryVariable('redirectToken');
        // if (redirectToken) {
        // 	console.log(redirectToken, global.redirectTokenVariable);
        // 	if (redirectToken === global.redirectTokenVariable) return;
        // 	global.redirectTokenVariable = redirectToken;
        // 	post(ApiPort.VerifyRedirectToken, {
        // 		Source: '8Shop',
        // 		Destination: 'TLCP4',
        // 		RedirectToken: redirectToken,
        // 		ClientId: 'TLC.Native.App',
        // 		ClientSecret: 'muitten',
        // 		Scope: 'Mobile.Service offline_access',
        // 		AppId: 'net.funpodium.tlc',
        // 		SiteId: '16'
        // 	})
        // 		.then((res) => {
        // 			if (res.isSuccess) {
        // 				// 传function代表临时退出，8shop会更新会员信息。
        // 				localStorage.getItem('access_token') && global.globalExit(true);
        // 				/**res.result.isNewlyCreated
        // 			 * 为true：会员从八号商店登录到官网，会包含memberInfo 参数
        // 			 * 为false：会员在官网登入，跳转至8号店，然后又从8号店跳转回去官网，不会包含memberInfo 参数
        // 			 */
        // 				if (res.result.isNewlyCreated) {
        // 					this.successLogin(res.result.accessToken, res.result.memberInfo, true);
        // 				} else {

        // 				}
        // 			} else {
        // 				Router.push('/');
        // 			}
        // 		})
        // 		.catch((err) => {
        // 			console.log(err);
        // 		});
        // }

        if (localStorage.getItem("autoLogin")) {
            this.setState(
                {
                    UserName: localStorage.getItem("userName"),
                    Password: localStorage.getItem("userNum"),
                },
                () =>
                    setTimeout(() => {
                        this.Login();
                    }, 3000)
            );
        }

        global.Pushgtagpiwikurl && global.Pushgtagpiwikurl("login");
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (
            prevState.userNameInputLengthIsValid !==
                this.state.userNameInputLengthIsValid ||
            prevState.passwordInputLengthIsValid !==
                this.state.passwordInputLengthIsValid
        ) {
            if (
                this.state.userNameInputLengthIsValid &&
                this.state.passwordInputLengthIsValid
            ) {
                this.setState({
                    errorMessage: "",
                });
            }
        }
    };
    componentWillUnmount() {
        this.setState = () => false;
    }
    RefreshTokenApi(refreshToken, memberToken, isRegistration) {
        const data = {
            grantType: "refresh_token",
            clientId: "Fun88.VN.App",
            clientSecret: "FUNmuittenVN",
            refreshToken: refreshToken,
        };
        this.setState({ loadinglogin: true });
        const isOldAccount = !!localStorage.getItem("access_token");
        if (isOldAccount) {
            CookieUtil(null, null);
            localStorage.clear();
            sessionStorage.clear();
        }
        post(ApiPort.RefreshTokenapi, data, memberToken)
            .then((res) => {
                if (res?.isSuccess && res.result) {
                    if (res.result.accessToken?.accessToken && res.result.accessToken?.refreshToken) {
                        localStorage.setItem(
                            "access_token",
                            JSON.stringify("bearer " + res.result.accessToken.accessToken)
                        );
                        localStorage.setItem(
                            "refresh_token",
                            JSON.stringify(res.result.accessToken.refreshToken)
                        );
                        get(ApiPort.GETMemberlistAPI)
                            .then((memeberInfoResponse) => {
                                this.setState({ loadinglogin: false });
                                const memeberInfoResponseResultMemberInfo =
                                    memeberInfoResponse.result.memberInfo;
                                let tokenMemberInfo = {
                                    loginOTP:
                                        memeberInfoResponse.result.loginOTP,
                                };
                                isRegistration === "1" &&
                                    (this.isFirstLogin = true);
                                for (const property in memeberInfoResponseResultMemberInfo) {
                                    tokenMemberInfo[
                                        property
                                            .substr(0, 1)
                                            .toLocaleLowerCase() +
                                            property.substr(
                                                1,
                                                property.length - 1
                                            )
                                    ] =
                                        memeberInfoResponseResultMemberInfo[
                                            property
                                        ];
                                }
                                this.successLogin(
                                    res,
                                    tokenMemberInfo,
                                    isOldAccount ? "refresh" : undefined
                                );
                            })
                            .catch((error) => {
                                this.setState({ loadinglogin: false });
                                console.log(error);
                            });
                    } else {
                        this.setState({ loadinglogin: false });
                        message.error(translate("请重新登录，访问过期"), 3);
                        setTimeout(() => {
                            global.globalExit();
                        }, 2000);
                    }
                }
            })
            .catch((err) => {
                console.log(err);
                this.setState({ loadinglogin: false });
            });
    }

    Login(name, pwd, Register) {
        const { UserName, Password, loginAt } = this.state;
        if(UserName.trim().length === 0 && Password.trim().length === 0){
            if (loginAt === "homepage") {
                message.error(translate("请填写您的登录信息"), 3);
                return;
            }
        }
        if (UserName.trim().length === 0) {
            if (loginAt === "homepage") {
                message.error(translate("请输入用户名"), 3);
                return;
            }
            this.setState({
                errorMessage: translate("请输入用户名"),
            });
            return;
        }
        if (Password.trim().length === 0) {
            if (loginAt === "homepage") {
                message.error(translate("请输入密码"), 3);
                return;
            }
            this.setState({
                errorMessage: translate("请输入密码"),
            });
            return;
        }

        // if (!nameReg.test(UserName) || !pwdReg.test(Password)) {
        //     message.error(translate("用户名或密码格式错误"));
        //     return;
        // }
        let Times = this.Captcha ? this.Captcha.state.attempts : 3;
        const limitTries = 5;
        const loggedInTimes = Cookie.Get("FaileCoun" + UserName);
        if (loggedInTimes >= Times && loggedInTimes < limitTries) {
            if (this.state.challengeUuid == "") {
                this.setState({ captchaVisible: true });
                return;
            }
        }
        else if(loggedInTimes >= limitTries){
            Modal.info({
                icon: "",
                okText: translate("在线客服"),
                className: "confirm-modal-of-forgetuser",
                title: translate("登录次数超出"),
                content: (
                    <div style={{ textAlign: "center",padding:"0 20px" }}>
                        <img src={`${process.env.BASE_PATH}/img/icons/icon-warn.svg`} />
                        <div className="line-distance"></div>
                        {translate("您已登录失败 5 次，请联系在线聊天寻求支持")}
                    </div>
                ),
                centered:true,
                zIndex:2001,
                onOk: () => {
                    global.PopUpLiveChat();
                    Cookie.Delete("FaileCoun" + UserName);
                },
                onCancel: ()=>{
                    Cookie.Delete("FaileCoun" + UserName);
                }
            })
            return;
        }
        this.continueToLogin(name, pwd, Register);
        if (this.Captcha) {
			this.Captcha.getCaptchaInfo(UserName);
		}
    }
    continueToLogin = (name, pwd, Register) => {
        this.setState({
            loadinglogin: true,
            errorMessage: "",
        });
        const { UserName, Password } = this.state;
        const Postdata = {
            hostName: global.location.origin,
            captchaId: Register == "Register" ? "" : this.state.captchaId,
            captchaCode: Register == "Register" ? "" : this.state.captchaCode,
            grantType: "password",
            clientId: "Fun88.VN.App",
            clientSecret: "FUNmuittenVN",
            username: Register == "Register" ? name : UserName.trim(),
            password: Register == "Register" ? pwd : Password,
            scope: "Mobile.Service offline_access",
            appId: "net.funpodium.fun88",
            siteId: 37,
            DeviceSignatureBlackBox: getE2BBValue(),
            captcha:
                this.state.challengeUuid != ""
                    ? {
                          challenge: this.state.challengeUuid,
                          seccode: "",
                          type: "",
                          userId: "",
                          validate: "",
                      }
                    : "",
            ipAddress:""
        };
        let responseData = {};
        post(ApiPort.PostLogin, Postdata)
            .then((res) => {
                if (res?.isSuccess && res.result) {
                    this.successLogin(
                        res.result,
                        Register == "Register" ? name : UserName
                    );
                } else {
                    let errorMsg = getDisplayPublicError(res) || translate("用户名或密码无效");
                    this.props.home  ? message.error(errorMsg) : "";
                    this.setState({
                        loadinglogin: false,
                        errorMessage: errorMsg,
                        challengeUuid: "",
                    });
                }
                responseData = res;
            }).catch((error) => {
                let errorMsg = getDisplayPublicError(error) || translate("用户名或密码无效")
                this.props.home  ? message.error(errorMsg) : "";
                this.setState({
                    loadinglogin: false,
                    challengeUuid: "",
                    errorMessage: errorMsg
                });
                responseData = error;
            }).finally(() => {
                if (this.isCaptchaOn && !responseData?.isSuccess) {
                    this.logInputFaile();
                }
                const messages = responseData?.isSuccess ? "" : getDisplayPublicError(responseData);
                if(this.props.home){
                    Pushgtagdata(
                        "Home",
                        "Submit Login",
                        "Home_S_Login",
                        responseData?.isSuccess ? 2 : 1,
                        [
                            {customVariableKey: responseData?.isSuccess ? false : "Login_S_Login_ErroMsg",
                            customVariableValue: responseData?.isSuccess ? false : messages || translate("用户名或密码无效")}
                        ]
                    );
                } else{
                    Pushgtagdata(
                        "Login", 
                        "Password Login", 
                        "Login_S_Login",
                        responseData?.isSuccess ? 2 : 1,
                        [
                            {customVariableKey: responseData?.isSuccess ? false : "Login_S_Login_ErroMsg",
                            customVariableValue: responseData?.isSuccess ? false : messages || translate("用户名或密码无效")}
                        ]
                    );
                }
            })
    }

    successLogin(result, userName, isRedirect) {
        if (result.accessToken?.accessToken  && result.accessToken.refreshToken) {
            this.setState({
                isLogin: true,
                UserName: userName,
                isLoginVisible: false,
            });
            Cookie.Delete("FaileCoun" + userName);
            localStorage.setItem("UserName", userName);
            localStorage.setItem(
                "access_token",
                JSON.stringify("bearer " + result.accessToken.accessToken)
            );
            localStorage.setItem(
                "refresh_token",
                JSON.stringify(result.accessToken.refreshToken)
            );
            //获取会员资料
            getMemberInfo((res) => {
                // 第一次註冊後的登入，只顯示註冊成功彈窗
                if (this.state.isRegister) {
                    console.log("hi~");
                } else {
                    toast.info(
                        <CustomToast message={translate("欢迎光临") +":"+ userName} />,
                        {
                            position: toast.POSITION.TOP_CENTER,
                            toastClassName: "login-success",
                            toastId: "login-success",
                            autoClose: 1000,
                            hideProgressBar: true,
                            closeOnClick: false,
                            pauseOnHover: false,
                            draggable: false,
                            closeButton: false,
                            odyClassName: "login-success",
                        }
                    );
                }
                if (isRedirect) {
                    Router.push("/").then(() => {
                        this.props.AlreadLogin(); // UI登录成功
                    });
                } else {
                    this.props.AlreadLogin(); // UI登录成功
                }
                this.setState({
                    loadinglogin: false,
                });
                //客服链接更正
                get(ApiPort.GETLiveChat).then((res) => {
                    if (res && res.url) {
                        localStorage.setItem("serverUrl", res.url);
                    }
                });
            }, true);
            sessionStorage.setItem("isLogin", true);
            if (!this.props.home) {
                this.props.handleEvent(); // 关闭弹窗
            }
            if (this.state.isRegister || this.isFirstLogin) {
                Router.push("/");
                toast.info(<CustomToast message={translate("欢迎光临") +":"+ userName} />, {
                    position: toast.POSITION.TOP_CENTER,
                    toastClassName: "register-success",
                    toastId: "register-success",
                    autoClose: 1000,
                    hideProgressBar: true,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: false,
                    closeButton: false,
                    odyClassName: "register-success",
                });
                sessionStorage.setItem("isRegisterEvent", true);
                return;
            }
            if (isRedirect === "refresh") {
                window.location.href = "/";
                return;
            }
        } else {
            this.setState({
                loadinglogin: false,
            });
        }

        localStorage.removeItem("userName");
        localStorage.removeItem("userNum");
        localStorage.removeItem("autoLogin");
        localStorage.removeItem("RestrictAccessCode");
    }

    UserInput = (e, t) => {
        let tempValue = e.target.value;
        tempValue = tempValue.replace(/[<>.\s\/\\="']/, "");
        if (t == "USER") {
            this.setState({
                UserName: tempValue,
                userNameInputLengthIsValid: tempValue.length != 0,
                // tempValue.length >= 6 && tempValue.length <= 14,
            },()=>this.OnBlur());
            localStorage.setItem("userName", tempValue);
        } else if (t == "PWD") {
            this.setState({
                Password: tempValue,
                passwordInputLengthIsValid: tempValue.length != 0,
                // tempValue.length >= 6 && tempValue.length <= 20,
            },()=>this.OnBlur());
            localStorage.setItem("userNum", tempValue);
        } else {
            this.setState({
                captchaCode: tempValue,
            });
        }
    };

    OnBlur = () => {
        const { UserName, Password } = this.state;
        if (UserName.trim().length === 0 && Password.trim().length === 0) {
            this.setState({ errorMessage: translate("请填写您的用户名和密码") });
            return;
        }
        if (UserName.trim().length === 0) {
            this.setState({ errorMessage: translate("请输入用户名") });
            return;
        }  
        if (Password.trim().length === 0) {
            this.setState({ errorMessage: translate("请输入密码") });
            return;
        }
    };

    Registerdata(name, pwd) {
        this.setState({
            UserName: name,
            Password: pwd,
            isRegister: true,
        });
    }

    HandleEnterKey = (e) => {
        if (this.state.loadinglogin != true) {
            if (
                localStorage.getItem("access_token") == null &&
                this.state.isLogin == false
            ) {
                if (this.props.home) {
                    document.getElementById("SubmitGeet").click();
                } else {
                    document.getElementById("SubmitGeetPopUp").click();
                }
            }
        }
    };

    logInputFaile = () => {
        const { UserName } = this.state;
		const FaileCounName = 'FaileCoun' + UserName;
        /* 输入错误次数 */
        var count = Cookie.Get(FaileCounName);
        if (count == null || count == "") {
            //第一次输入错误
            Cookie.Create(FaileCounName, 1);
        } else {
            var count = Cookie.Get(FaileCounName);
            let num = ++count;
            if (count <= 2) {
                Cookie.Create(FaileCounName, num);
            } else {
                Cookie.Create(FaileCounName, num);
            }
        }
    };
    onMatch = (id) => {
        this.setState(
            {
                challengeUuid: id,
                captchaVisible: false,
            },
            () => {
                this.Login();
            }
        );
    };
    render() {
        const { UserName, Password, captchaVisible, sucessModal } = this.state;
        return (
            <div>
                <Captcha
                    captchaVisible={captchaVisible}
                    setCaptchaVisible={(v) => {
                        this.setState({ captchaVisible: v });
                    }}
                    onMatch={this.onMatch}
                    getCaptchaInfo={(props) => {
						this.Captcha = props;
					}}
                    type="Login"
                />

                {/* 首页Header Input框登录 */}
                {this.props.home ? (
                    <Col span={12} className="tlc-sign">
                        <Modal
                            width="135px"
                            keyboard={false}
                            closable={false}
                            className="Spin_modal"
                            footer={null}
                            visible={this.state.loadinglogin}
                            maskClosable={false}
                        >
                            <Spin tip={translate("加载中")} />
                        </Modal>
                        <div className="login-wrap">
                            <div className="forget-password">
                                <Button
                                    type="link"
                                    size="small"
                                    onClick={() => {
                                        this.ForgotPwd.current.showModal(1);
                                    }}
                                >
                                    {translate("忘记用户名或密码？")}
                                </Button>
                            </div>
                            <div className="input-wrap">
                                <Input
                                    placeholder={translate("用户名")}
                                    onChange={(e) => {
                                        this.setState({ loginAt: "homepage" });
                                        this.UserInput(e, "USER");
                                    }}
                                    onPressEnter={() => this.HandleEnterKey()}
                                    value={this.state.UserName}
                                    minLength={1}
                                    maxLength={30}
                                />

                                <Input
                                    type="Password"
                                    placeholder={translate("密码")}
                                    onChange={(e) => {
                                        this.setState({ loginAt: "homepage" });
                                        this.UserInput(e, "PWD");
                                    }}
                                    onPressEnter={() => this.HandleEnterKey()}
                                    value={this.state.Password}
                                    minLength={1}
                                    maxLength={20}
                                />
                            </div>
                        </div>
                        <div
                            className="login-btn notice-section-btn offset-small-y"
                            id="SubmitGeet"
                            data-gt
                            onClick={() => {
                                this.setState({ loginAt: "homepage" });
                                this.Login();
                            }}
                        >
                            {translate("登录")}
                        </div>

                        <div
                            className="register-btn notice-section-btn offset-small-y"
                            onClick={() => {
                                global.goUserSign("2");
                                Pushgtagdata(
                                    "Home",
                                    "Go to Register",
                                    "Home_C_Register"
                                );
                            }}
                        >
                            {translate("注册")}
                        </div>
                    </Col>
                ) : (
                    /* 弹窗登录 */
                    <Spin
                        spinning={this.state.loadinglogin}
                        tip={translate("加载中")}
                    >
                        <div className="user-modal">
                            {this.state.errorMessage && (
                                <div className="login-error">
                                    {this.state.errorMessage}
                                </div>
                            )}
                            <div className="IputBox">
                                <Input
                                    size="large"
                                    placeholder={translate("用户名")}
                                    prefix={
                                        <img src={`${process.env.BASE_PATH}/img/icons/user.svg`} />
                                    }
                                    onChange={(e) => {
                                        this.setState({ loginAt: "modal" });
                                        this.UserInput(e, "USER");
                                    }}
                                    // onFocus={this.OnBlur}
                                    // onBlur={this.OnBlur}
                                    onPressEnter={() => this.HandleEnterKey()}
                                    minLength={1}
                                    maxLength={30}
                                    value={this.state.UserName}
                                />
                            </div>
                            <div className="IputBox">
                                <Input.Password
                                    type="Password"
                                    size="large"
                                    placeholder={translate("密码")}
                                    prefix={
                                        <img src={`${process.env.BASE_PATH}/img/icons/password.svg`} />
                                    }
                                    onChange={(e) => {
                                        this.setState({ loginAt: "modal" });
                                        this.UserInput(e, "PWD");
                                    }}
                                    // onFocus={this.OnBlur}
                                    // onBlur={this.OnBlur}
                                    onPressEnter={() => this.HandleEnterKey()}
                                    minLength={1}
                                    maxLength={20}
                                    value={this.state.Password}
                                />
                            </div>
                            <div className="link-box">
                                <Button
                                    type="link"
                                    onClick={() => {
                                        this.props.openForgotPwd();
                                        Pushgtagdata("Login","Go to Forget Password","Login_C_ForgetPassword");
                                    }}
                                >
                                    {translate("忘记用户名或密码？")}
                                </Button>
                            </div>
                            <Button
                                disabled={
                                    !this.state.userNameInputLengthIsValid ||
                                    !this.state.passwordInputLengthIsValid
                                }
                                size="large"
                                type="primary"
                                block
                                id="SubmitGeetPopUp"
                                data-gt
                                className="btn-cta"
                                onClick={() => {
                                    this.setState({ loginAt: "modal" });
                                    this.Login();
                                }}
                            >
                                {translate("登录")}
                            </Button>
                        </div>
                    </Spin>
                )}
                <ForgotPwd ref={this.ForgotPwd} />
            </div>
        );
    }
}

export default _Login;
