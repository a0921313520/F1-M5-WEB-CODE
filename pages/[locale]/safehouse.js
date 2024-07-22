import React from "react";
import Router from "next/router";
import { Form, Button, Input, message } from "antd";
import { ApiPort } from "$ACTIONS/TLCAPI";
import { get, post } from "$ACTIONS/TlcRequest";
import { nameReg, pwdReg } from "$ACTIONS/reg";
import { Cookie } from "$ACTIONS/helper";
import Captcha from "@/Captcha";
import Layout from "@/Layout";
import PublicHead from "@/Layout/PublicHead";
import { getMemberInfo } from "$DATA/userinfo";
import { translate } from "$ACTIONS/Translate";
import { getStaticPropsFromStrapiSEOSetting } from "$DATA/seo";

global.NamePwdVerify = false;
const { Item } = Form;

export async function getStaticProps({ params }) {
    return await getStaticPropsFromStrapiSEOSetting("/safehouse");
}

export async function getStaticPaths() {
    // Define all possible paths
    const paths = [
        { params: { locale: 'en' } },
        { params: { locale: 'hi' } },
    ];

    return {
        paths,
        fallback: false,
    };
}

class Safehouse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // OpenGeetest: false,
            Domdone: false,
            challengeUuid: "",
            captchaVisible: false,
        };

        global.redirectDomin = this.redirectDomin.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.isCaptchaOn = false;
    }

    componentDidMount() {
        // var jqscript = document.createElement('script');
        // jqscript.type = 'text/javascript';
        // jqscript.src = '/vn/Geetest/jquery-3.6.0.min.js';
        // document.querySelectorAll('body')[0].appendChild(jqscript);
        // jqscript.onload = () => {
        // 	var _doc = document.getElementsByTagName('head')[0];
        // 	var js = document.createElement('script');
        // 	js.setAttribute('type', 'text/javascript');
        // 	js.setAttribute('src', '/vn/Geetest/gee-test.js?v=2');
        // 	_doc.appendChild(js);
        // 	js.onload = () => {
        // 		this.setState({
        // 			Domdone: true
        // 		});
        // 	};
        // };
    }

    redirectDomin() {
        get(ApiPort.GETDomainUrl)
            .then((res) => {
                if (res) {
                    if (res.mainSiteURL) {
                        window.location.href = res.mainSiteURL;
                    }
                }
            })
            .catch((error) => {});
    }

    handleSubmit = (e) => {
        if (e) {
            e.preventDefault();
        }
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (Cookie.Get("FaileCoun") >= 3) {
                    if (this.state.challengeUuid == "") {
                        this.setState({ captchaVisible: true });
                        return;
                    }
                }
                this.checkUserLogin(values);
            }
        });
    };
    continueToLogin = (values) => {
        const Postdata = {
            hostName: global.location.origin, // global.location.origin
            captchaId: "",
            captchaCode: "",
            grantType: "password",
            clientId: "Fun88.VN.App",
            clientSecret: "FUNmuittenVN",
            username: values.username.trim(),
            password: values.password,
            scope: "Mobile.Service offline_access",
            appId: "net.funpodium.fun88",
            siteId: 37,
            DeviceSignatureBlackBox: window.E2GetBlackbox
                ? window.E2GetBlackbox().blackbox == "" ||
                  window.E2GetBlackbox().blackbox == undefined
                    ? ""
                    : window.E2GetBlackbox().blackbox
                : "",
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
            ipAddress: "",
        };
        this.hide = message.loading(translate("加载中"));

        post(ApiPort.PostLogin, Postdata)
            .then((res) => {
                if (res.isSuccess) {
                    this.successLogin(res?.result, values.username);
                }
            })
            .catch((error) => {
                console.log(
                    "🚀 ~ file: Safehouse.js:119 ~ Safehouse ~ error:",
                    error,
                );
                this.setState({
                    showError: error.errors[0].description,
                });
                this.hide();
                this.setState({
                    challengeUuid: "",
                });
                // let errorList =["MEM00004","MEM00059","MEM00060","MEM00140","CAPTCHA_ERROR"]
                if (this.isCaptchaOn) {
                    this.logInputFaile();
                }
            });
    };

    successLogin(result, userName, isRedirect) {
        if (
            result?.accessToken?.accessToken &&
            result.accessToken.refreshToken
        ) {
            this.setState({
                isLogin: true,
                UserName: userName,
                isLoginVisible: false,
            });
            Cookie.Delete("FaileCoun");
            localStorage.setItem("UserName", userName);
            localStorage.setItem(
                "access_token",
                JSON.stringify("bearer " + result.accessToken.accessToken),
            );
            localStorage.setItem(
                "refresh_token",
                JSON.stringify(result.accessToken.refreshToken),
            );
            //获取会员资料
            // getMemberInfo((res) => {
            // 	this.hide();
            // 	Router.push('/');
            // 	// this.setState({
            // 	// 	loadinglogin: false
            // 	// });
            // }, true);
            Router.push("/");
            sessionStorage.setItem("isLogin", true);
        } else {
            this.hide();
            // this.setState({
            // 	loadinglogin: false
            // });
        }
    }

    checkUserLogin = (values) => {
        const hide = message.loading(translate("加载中"));
        const username = values.username.trim();
        get(
            ApiPort.Safehouse +
                `&username=${username}&domain=${window.location.origin}`,
        )
            .then((data) => {
                if (data.isSuccess && data.result) {
                    this.continueToLogin(values);
                }
                hide();
            })
            .catch((error) => {
                hide();
            });
    };
    logInputFaile = () => {
        /* 输入错误次数 */
        var count = Cookie.Get("FaileCoun");
        if (count == null || count == "") {
            //第一次输入错误
            Cookie.Create("FaileCoun", 1);
        } else {
            var count = Cookie.Get("FaileCoun");
            let num = ++count;
            if (count <= 2) {
                Cookie.Create("FaileCoun", num);
            } else {
                Cookie.Create("FaileCoun", num);
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
                this.handleSubmit();
            },
        );
    };
    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { captchaVisible, showError } = this.state;
        let status = true;
        let error = Object.values(this.props.form.getFieldsError()).some(
            (v) => v !== undefined,
        );
        let errors = Object.values(this.props.form.getFieldsValue()).some(
            (v) => v == "" || v == undefined,
        );
        if (!errors && !error) {
            status = false;
        }
        console.log(
            "🚀 ~ file: Safehouse.js:225 ~ Safehouse ~ render ~ status:",
            status,
        );
        return (
            <Layout
                title="FUN88"
                Keywords=""
                description=""
                status={5}
                setLoginStatus={(v) => {
                    this.setState({ isLogin: v });
                }}
                seoData={this.props.seoData}
            >
                <div id="maintain" className="common-distance-wrap">
                    <div className="maintain-header-wrap">
                        <PublicHead />
                    </div>
                    <div className="BoxOther sf">
                        <div className="Box_Content">
                            <h3>{translate("登录")}</h3>
                            {showError && (
                                <div className="ErrorShow">
                                    <small>{showError}</small>
                                </div>
                            )}

                            <Form
                                className="security-login-wrap"
                                onSubmit={this.handleSubmit}
                            >
                                <Item label={translate("用户名")}>
                                    {getFieldDecorator("username", {
                                        rules: [
                                            {
                                                required: true,
                                                message:
                                                    translate("请输入用户名"),
                                            },
                                            {
                                                validator: (
                                                    rule,
                                                    value,
                                                    callback,
                                                ) => {
                                                    // if (value && !nameReg.test(value)) {
                                                    // 	callback(translate("用户名长度必须至少有6个字符，不能超过14个字符，仅可使用字母 'A-Z', 'a-z' , 数字 '0-9'。"));
                                                    // }
                                                    callback();
                                                },
                                            },
                                        ],
                                    })(
                                        <Input
                                            size="large"
                                            className="tlc-input-disabled"
                                            placeholder={translate(
                                                "填写用户名",
                                            )}
                                            maxLength={20}
                                            autoComplete="off"
                                        />,
                                    )}
                                </Item>
                                <Item label={translate("密码")}>
                                    {getFieldDecorator("password", {
                                        rules: [
                                            {
                                                required: true,
                                                message:
                                                    translate("请输入密码"),
                                            },
                                            {
                                                validator: (
                                                    rule,
                                                    value,
                                                    callback,
                                                ) => {
                                                    if (
                                                        value &&
                                                        !pwdReg.test(value)
                                                    ) {
                                                        callback(
                                                            translate(
                                                                "密码必须包含 6-20 个字母数字字符“A-Z”、“a-z”、“0-9”，并且可以包含 4 个特殊字符 ^# $@",
                                                            ),
                                                        );
                                                    }

                                                    callback();
                                                },
                                            },
                                        ],
                                    })(
                                        <Input
                                            size="large"
                                            type="password"
                                            className="tlc-input-disabled"
                                            placeholder={translate("输入密码")}
                                            maxLength={50}
                                            autoComplete="off"
                                        />,
                                    )}
                                </Item>
                                <Button
                                    size="large"
                                    type="primary"
                                    id="SubmitGeet"
                                    data-gt
                                    htmlType="submit"
                                    disabled={status}
                                >
                                    {translate("提交")}
                                </Button>
                            </Form>
                        </div>
                        {/* <Captcha
							captchaVisible={captchaVisible}
							setCaptchaVisible={(v) => {
								this.setState({ captchaVisible: v });
							}}
							onMatch={this.onMatch}
						/> */}
                    </div>
                </div>
            </Layout>
        );
    }
}

export default Form.create({ name: "Safehouse" })(Safehouse);
