import React from "react";
import Router from "next/router";
import { ApiPort } from "$SERVICES/TLCAPI";
import { get, post } from "$SERVICES/TlcRequest";
// import { nameReg, pwdReg } from "$DATA/reg";
import { Cookie } from "$UTILS/helper";
import Layout from "@/Layout";
// import PublicHead from "@/Layout/PublicHead";
import { getStaticPropsFromStrapiSEOSetting } from "$DATA/seo";

global.NamePwdVerify = false;
const { Item } = Form;

export async function getStaticProps({ params }) {
    return await getStaticPropsFromStrapiSEOSetting("/safehouse");
}

export async function getStaticPaths() {
    // Define all possible paths
    const paths = [{ params: { locale: "en" } }, { params: { locale: "hi" } }];

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
        this.hide = message.loading("加载中");

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
        const hide = message.loading("加载中");
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
                safe house
            </Layout>
        );
    }
}

export default Form.create({ name: "Safehouse" })(Safehouse);
