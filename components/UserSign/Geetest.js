import React from "react";
import { Cookie } from "$ACTIONS/helper";
import { ApiPort } from "$ACTIONS/TLCAPI";
import { get } from "$ACTIONS/TlcRequest";
import { message } from "antd";
class _Geetest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            UserName: "",
            Captchadata: "",
        };
        this.FunpodiumGT = null;
    }

    componentDidMount() {
        return;
        get(ApiPort.Captchaswitch).then((res) => {
            if (res) {
                if (!res.isCaptchaOn) return;
                global.GeetestFaile = () => this.logInputFaile();

                const idName = "t_geetest_script";
                if (document.getElementById(idName) && this.loadDoneGeetest) {
                    this.Geet();
                } else {
                    var script = document.createElement("script");
                    script.id = idName;
                    script.src = "/vn/Geetest/jquery-3.6.0.geetest.min.js";
                    script.onload = () => {
                        this.loadDoneGeetest = true;
                        this.Geet();
                    };
                    document
                        .getElementsByTagName("head")[0]
                        .appendChild(script);
                }
            }
        });
    }

    /* 验证码 */
    Geet = () => {
        if (!localStorage.getItem("access_token")) {
            /* 极验初始化 */
            this.GeetOpen();
            this.GeetListener();
        }
    };

    /* 用户登录3次错误后 开启极验验证 */
    GeetOpen = () => {
        let _this = this;
        this.FunpodiumGT = new FunpodiumGeetest();
        let ApiDevGeetDomain = Boolean(
            [
                "member.stagingp4.china.tlc88.biz:8003",
                "member.stagingp4.china.tlc88.biz",
                "member.staging1p4.china.tlc88.biz",
                "member.staging2p4.china.tlc88.biz",
                "member.staging3p4.china.tlc88.biz",
                "member.staging4p4.china.tlc88.biz",
                "member.staging5p4.china.tlc88.biz",
                "member.staging6p4.china.tlc88.biz",
                "member.staging7p4.china.tlc88.biz",
                "member.staging8p4.china.tlc88.biz",
                "member.staging9p4.china.tlc88.biz",
            ].find((v) => global.location.href.includes(v))
        );
        this.FunpodiumGT.init({
            apiUrl: ApiDevGeetDomain
                ? "https://shstlckpf.funpo.com:2041/captcha-service/api/v1.0"
                : global.location.host == "react.tlc161.com"
                ? "https://shsltlckpf.funpo.com:2041/captcha-service/api/v1.0" //'https://shsltlckpf.funpo.com:2041/captcha-service/api/v1.0'
                : "https://shptlckpftp.zbbcr216.com:2041/captcha-service/api/v1.0", //'https://shptlckpf.funpo.com:2041/captcha-service/api/v1.0',
            extendTime: 180,
            gtParams: {
                lang: "zh",
                product: "bind",
            },
        });
        console.log(Cookie.Get("FaileLoc"));
        if (Cookie.Get("FaileLoc") == "MemberLock") {
            if ($("#SubmitGeet").length) {
                this.FunpodiumGT.registerCaptcha(
                    "#SubmitGeet",
                    function (captchaObject) {
                        console.log(captchaObject);
                        _this.setState({
                            Captchadata: captchaObject,
                        });
                        if (captchaObject.SubmitGeet.isValidated) {
                            _this.props.OpenGeetest(false);
                        }
                    }
                );
                $("#SubmitGeet").length && $("#SubmitGeet").off();
            }
            if ($("#SubmitGeetPopUp").length) {
                this.FunpodiumGT.registerCaptcha(
                    "#SubmitGeetPopUp",
                    function (captchaObject) {
                        console.log(captchaObject);
                        _this.setState({
                            Captchadata: captchaObject,
                        });
                        if (captchaObject.SubmitGeetPopUp.isValidated) {
                            _this.props.OpenGeetest(false);
                        }
                    }
                );
                $("#SubmitGeetPopUp").length && $("#SubmitGeetPopUp").off();
            }
            _this.props.OpenGeetest(true);
        }
    };

    GeetListener = () => {
        let Domid = document.getElementById("SubmitGeet");
        let Domidpopup = document.getElementById("SubmitGeetPopUp");
        let _this = this;
        if (Domid) {
            Domid.addEventListener("click", function () {
                console.log(_this.props.UserName);
                if (
                    _this.props.UserName &&
                    _this.props.UserName != "" &&
                    _this.props.Password &&
                    _this.props.Password != "" &&
                    localStorage.getItem("access_token") == null
                ) {
                    NamePwdVerify = true;
                } else {
                    NamePwdVerify = false;
                }
            });
        }
        if (Domidpopup) {
            Domidpopup.addEventListener("click", function () {
                if (
                    _this.props.UserName != "" &&
                    _this.props.Password != "" &&
                    localStorage.getItem("access_token") == null
                ) {
                    NamePwdVerify = true;
                } else {
                    NamePwdVerify = false;
                }
            });
        }
    };
    logInputFaile = () => {
        /* 输入错误次数 */
        var count = Cookie.Get("FaileCoun");
        var lockTim = Cookie.Get("FaileLoc");
        var expireDate = new Date();
        if (lockTim == null || lockTim == "") {
            //未锁定
            expireDate.setTime(expireDate.getTime() + 24 * 60 * 60 * 1000);
            if (count == null || count == "") {
                //第一次输入错误
                Cookie.Create("FaileCoun", 1, expireDate.toGMTString(), "/");
                return false;
            } else {
                expireDate.setTime(expireDate.getTime() + 24 * 60 * 60 * 1000);
                var count = Cookie.Get("FaileCoun");
                let num = ++count;
                if (count <= 2) {
                    Cookie.Create(
                        "FaileCoun",
                        num,
                        expireDate.toGMTString(),
                        "/"
                    );
                    return false;
                } else {
                    //第三次的时候 就要初始化验证码 否则会延迟
                    expireDate.setTime(expireDate.getTime() + 30 * 60 * 1000);
                    Cookie.Create(
                        "FaileLoc",
                        "MemberLock",
                        expireDate.toGMTString(),
                        "/"
                    );
                    this.GeetOpen();
                    return true;
                }
            }
        } else {
            this.GeetOpen();
            return true;
        }
    };

    render() {
        return <div />;
    }
}

export default _Geetest;
