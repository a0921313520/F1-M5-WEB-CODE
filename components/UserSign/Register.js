import React from "react";
import Router from "next/router";
import { createForm } from "rc-form";
import { Button, Input, message, Row, Spin, Col } from "antd";
import Item from "../../components/View/Formitem";
import { pwdReg, emailReg,nameReg ,phoneReg} from "$ACTIONS/reg";
import { get, post } from "$ACTIONS/TlcRequest";
import { getAffiliateReferralCode, Cookie, getDisplayPublicError,getE2BBValue } from "$ACTIONS/helper";
import { ApiPort,APISETS } from "$ACTIONS/TLCAPI";
import HostConfig from "$ACTIONS/Host.config";
import CMSOBJ from "$DATA/stage.live.static.id";
import Captcha from "../Captcha";
import {translate} from "$ACTIONS/Translate";
import {throttle} from "$ACTIONS/util"
import {
    MemberIcon,
    PasswordIcon,
    PhoneIcon,
    EmailIcon,
    RecommendIcon,
} from "./RegisterIcnoSvg";
class _Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            UserName: "",
            UserPwd: "",
            UserPhone: "",
            EmailAccount: "",
            loading: false,
            affcode: "",
            disabled: false,
            showAffCode: true,
            captchaVisible: false,
            challengeUuid: "",
            isNameAvailable: false,
            isEmailAvailable: false,
            showEmailList: false,
            chooseTheRecommended: false
        };

        this.phonePrefix = [];
        this.maxLength = 9;
        this.minLength = 9;
        this.handleInputThrottled = null;
        this.emailSuffixList = [
            "@gmail.com",
            "@icloud.com",
            "@yahoo.com",
            "@yahoo.com.vn",
            "@hotmail.com",
            "@outlook.com",
            "@outlook.com.vn",
            "@caothang.edu.vn",
            "@love.com",
            "@cdktcnqn.edu.vn"
        ]
    }

    componentDidMount() {
        this.props.RefRegister && this.props.RefRegister(this);
        const isDisabled =
            Cookie.GetCookieKeyValue("CO_affiliate") != "undefined" &&
            Cookie.GetCookieKeyValue("CO_affiliate") != "";
        this.setState({
            showAffCode: !localStorage.getItem("queleaReferrerId"),
            affcode: getAffiliateReferralCode(),
            disabled: isDisabled,
        });

        this.getPhonePrefix()
        global.Pushgtagpiwikurl && global.Pushgtagpiwikurl("register");
        this.handleInputThrottled = throttle(this.handleInput, 2000);
    }
    componentWillUnmount() {
        this.handleInputThrottled = null;
        this.setState = () => false;
    }
    getPhonePrefix =()=>{
        get(ApiPort.PhonePrefix)
            .then((res) => {
                if(res?.isSuccess && res?.result){
                    this.phonePrefix = res.result.prefixes;
                    // this.maxLength = res.result.maxLength;
                    // this.minLength = res.result.minLength;
                }
            })
            .catch((error) => {
                console.log("PhonePrefix error:", error);
            });
    }
    handleInputChange = (key,value) => {
        this.handleInputThrottled(key,value)
    }
    handleInput = (key="",value) => {
        get(ApiPort.GETInfoValidity + "?key="+ key +"&value=" + value + APISETS)
            .then((res) => {
                if (res) {
                    switch (key){
                        case "Username":
                            if (res.isSuccess && res.result) {
                                this.setState({isNameAvailable: true})
                            } else {
                                //用户名被别人注册了
                                this.setState({isNameAvailable: false})
                            }
                            break;
                        case "Email":
                            if (res.isSuccess && res.result) {
                                this.setState({isEmailAvailable: true})
                            } else {
                                //邮箱被别人注册了或是格式不符合后端定义的邮箱格式
                                this.setState({isEmailAvailable: false});
                            } 
                            break;
                        default:
                            break;
                    }
                }
            }).catch((error) => {
                switch (key){
                    case "Username":
                        //用户名被别人注册了
                        this.setState({isNameAvailable: false})
                    break;
                    case "Email":
                        //邮箱被别人注册了或是格式不符合后端定义的邮箱格式
                        this.setState({isEmailAvailable: false});
                        break;
                    default:
                        break;
                }
            })
    }

    startRegister = () => {
        const {
            UserName,
            UserPwd,
            UserPhone,
            EmailAccount,
            referer,
        } = this.state;
        const phoneLength = UserPhone.toString().length;
        if (UserName == "") {
            message.error(translate("请输入用户名"));
            return;
        }
        if (nameReg.test(UserName) == false) {
            message.error(translate("用户名长度必须至少有6个字符，不能超过14个字符，仅可使用字母 'A-Z', 'a-z' , 数字 '0-9'。"));
            return;
        }
        if (UserPwd == "") {
            message.error(translate("请输入密码"));
            return;
        }
      
        if (pwdReg.test(UserPwd) === false) {
            message.error(translate("密码必须包含 6-20 个字母数字字符“A-Z”、“a-z”、“0-9”，并且可以包含 4 个特殊字符 ^# $@"));
            return;
        }

        if(Array.isArray(this.phonePrefix) && this.phonePrefix.length){
            if(
                !this.checkPrefix(UserPhone,this.phonePrefix) ||
                phoneLength > this.maxLength ||
                phoneLength < this.minLength ||
                /\D/.test(UserPhone.toString())
            ){
                message.error(translate("该电话号码无效，请输入正确的号码"));
                return;
            }
        } 
        // else if(!phoneReg.test(UserPhone)){
        //     //如果手机号前缀验证未加载完成或API Error,则只做基本的电话校验,其他交给API去校验
        //     message.error(translate("电话号码必须由9个数字组成，不要在前面填写0"));
        //     return;
        // }

        if (!emailReg.test(EmailAccount)) {
            message.error(translate("请填写有效的电子邮件地址"));
            return;
        }
        if (this.Captcha) {
			this.Captcha.getCaptchaInfo(UserName);
		}
        if (this.state.challengeUuid == '') {
            this.setState({ captchaVisible: true });
            return;
        }
        this.Register();
    };

    /*注册*/
    Register() {
        const {
            UserName,
            UserPwd,
            UserPhone,
            EmailAccount,
            referer,
        } = this.state;
        this.setState({ loading: true });
        const UserData = {
            HostName: ApiPort.LOCAL_HOST,
            RegWebsite: 37,
            Language: "vi-vn",
            Mobile: "84-" + UserPhone,
            Email: EmailAccount,
            Username: UserName,
            MediaCode: Cookie.GetCookieKeyValue("CO_Media") || null,
            Referer:
                Cookie.GetCookieKeyValue("CO_Referer") ||
                sessionStorage.getItem("affCode") ||
                null,
            affiliateCode: this.state.affcode === "" ? "" : this.state.affcode,
            Password: UserPwd,
            BrandCode: "FUN88",
            currency: "VND",
            queleaReferrerId: localStorage.getItem("queleaReferrerId"),
            Captch:{
            	challenge: this.state.challengeUuid
            },
            blackBoxValue:getE2BBValue(),
            e2BlackBoxValue: getE2BBValue(),
        };
        let responseData = {};
        post(ApiPort.PostRegister, UserData)
            .then((res) => {
                if (res) {
                    if (res.isSuccess == true) {
                        this.props.showmodal("1");
                        this.props.login(UserName, UserPwd, "Register");
                    } else if (res.isSuccess == false) {
                        if (res.result.errorCode == "MEM00026") {
                            message.error(res.message || translate("用户名已被其他人使用，请重新输入"));
                        }else {
                            message.error(res.message);

                        }
                    }
                    responseData = res;
                }
            })
            .catch((error) => {
                console.log(error);
                responseData = error;
            }).finally(()=>{
                this.setState({ 
                    loading: false,
                    challengeUuid: '' 
                });
                const messages = responseData.isSuccess ? "" : getDisplayPublicError(responseData);
                let refCode = 
                    Cookie.GetCookieKeyValue("CO_Referer") ||
                    sessionStorage.getItem("affCode") ||
                    ""
                Pushgtagdata(
                    "Register",
                    "Submit Register",
                    "Register_C_Register",
                    responseData.isSuccess ? 2 : 1,
                    [
                        {
                            customVariableKey: responseData.isSuccess ? false : "Register_S_Register_ErrorMsg",
                            customVariableValue: responseData.isSuccess ? false : messages || translate("系统错误，请稍后重试！")
                        },
                        {
                            customVariableKey: responseData.isSuccess ? false : "Register_S_Register_AffiliateCode",
                            customVariableValue: responseData.isSuccess ? false : refCode
                        }
                    ]
                );
            })
    }

    RegisterFormdata = (e, t) => {
        if (t == "name") {
            this.setState({
                UserName: e.target.value,
            });
            e.target.value && nameReg.test(e.target.value) && this.handleInputChange("Username",e.target.value)
        }
        if (t == "affcode") {
            this.setState({
                affcode: e.target.value,
            });
        }
        if (t == "pwd") {
            this.setState({
                UserPwd: e.target.value,
            });
        }
     
        if (t == "phone") {
            this.setState({
                UserPhone: e.target.value,
            });
        }
        if (t == "email") {
            const atIndex = e.target.value.indexOf("@");
            const suffixValue = (atIndex > 0 && e.target.value.slice(atIndex+1)) || "";
            this.setState({
                EmailAccount: e.target.value,
                showEmailList: atIndex > 0 && !suffixValue,
                chooseTheRecommended: false
            })
            e.target.value && emailReg.test(e.target.value) && this.handleInputChange("Email",e.target.value)
            let error = "";
            if(!e.target.value){
                error = translate("请输入电子邮箱")
            } else if(e.target.value && !emailReg.test(e.target.value)){
                error = translate("请填写有效的电子邮件地址")
            }
            this.props.form.setFields({
                emailNameState: {
                    value: e.target.value ?? "",
                    errors: [new Error(error)],
                },
            });
            this.props.form.validateFields(['emailNameState']);
        }
    };
    onMatch = (id) => {
        this.setState(
            {
                challengeUuid: id,
                captchaVisible: false,
            },
            () => {
                this.Register();
            }
        );
    };

    /**
     * @description: 如果通过验证 提交数据
     * @param {*}
     * @return {Bool} true 通过校验/false 不通过校验
     */
    submitBtnEnable = () => {
        let error = Object.values(this.props.form.getFieldsError()).some(
            (v) => v !== undefined
        );
        let errors = Object.values(this.props.form.getFieldsValue()).some(
            (v) => v == "" || v == undefined
        );
        // console.log(
        //     "🚀 ~ _Register ~ !errors && !error && this.state.isNameAvailable && this.state.isEmailAvailable:", !errors ,
        //     "!error:", !error ,
        //     "isNameAvailable:", this.state.isNameAvailable, 
        //     "isEmailAvailable:", this.state.isEmailAvailable
        // )
        return !errors && !error && this.state.isNameAvailable && this.state.isEmailAvailable;
    };

    /**
     * 选择邮箱后缀
     * @param {Sting} item 后缀
     */
    selectMailboxSuffix=(item) => {
        const value = item.slice(1)
        const atIndex = this.state.EmailAccount.indexOf('@');
        const finalyValue = this.state.EmailAccount.slice(0, atIndex + 1);
        const emailText = finalyValue + value;
        let emailText2 = { target: { value: emailText ?? "" } };
        this.setState({
            EmailAccount: emailText,
            showEmailList: false,
            chooseTheRecommended:true,
        },
            ()=>{this.RegisterFormdata(emailText2,"email")}
        )
    }

    /**
     * 检查输入的手机号前缀是否符合要求
     * @param {*} number 
     * @param {Array} prefixes 
     * @returns true符合，false不符合
     */
    checkPrefix(number, prefixes) {
        const numberStr = number.toString();
        let maxLength = 0;
        for (const prefix of prefixes) {
            if (prefix.length > maxLength) {
                maxLength = prefix.length;
            }
        }
        for (let i = 1; i <= maxLength; i++) {
            const prefix = numberStr.slice(0, i);
            if (prefixes.includes(prefix)) {
                return true;
            }
        }
        return false;
    }

    render() {
        const { 
            affcode, 
            captchaVisible,
            isNameAvailable,
            isEmailAvailable,
            UserName,
            EmailAccount,
            showEmailList,
            chooseTheRecommended
        } = this.state;
        const { getFieldDecorator, getFieldError } = this.props.form;
        return (
            <Spin
                spinning={this.state.loading}
                tip={translate("加载中")}
                style={{ backgroundColor: "initial" }}
            >
                <div className="user-modal">
                    {/* ------------------ 用戶名 ------------------*/}
                    <Item errorMessage={getFieldError("NameState")}>
                        <div className="IputBox">
                            {getFieldDecorator("NameState", {
                                rules: [
                                    { required: true, message: translate("请输入用户名") },
                                    {
                                        validator: (rule, value, callback) => {
                                            if (
                                                value && !nameReg.test(value)
                                            ) {
                                                callback(
                                                    translate("用户名长度必须至少有6个字符，不能超过14个字符，仅可使用字母 'A-Z', 'a-z' , 数字 '0-9'。")
                                                );
                                            }
                                            callback();
                                        },
                                    },
                                ],
                            })(
                                <Input
                                    size="large"
                                    placeholder={translate("用户名")}
                                    prefix={<MemberIcon />}
                                    onChange={(e) =>
                                        this.RegisterFormdata(e, "name")
                                    }
                                    maxLength={14}
                                />
                            )}
                        </div>
                        {nameReg.test(UserName) && !isNameAvailable ? <div className="input-error-message">{translate("用户名不可用，请尝试其他名称")}</div> : null}
                    </Item>

                    {/* ------------------ 密碼 ------------------*/}
                    <Item errorMessage={getFieldError("passwordState")}>
                        <div className="IputBox">
                            {getFieldDecorator("passwordState", {
                                rules: [
                                    { required: true, message: translate("请输入密码") },
                                    {
                                        validator: (rule, value, callback) => {
                                            if (
                                                value &&
                                                !pwdReg.test(value)
                                            ) {
                                                callback(
                                                    translate("密码必须包含 6-20 个字母数字字符“A-Z”、“a-z”、“0-9”，并且可以包含 4 个特殊字符 ^# $@")
                                                );
                                            }
                                            callback();
                                        },
                                    },
                                ],
                            })(
                                <Input.Password
                                    size="large"
                                    prefix={<PasswordIcon />}
                                    placeholder={translate("密码")}
                                    onChange={(e) =>
                                        this.RegisterFormdata(e, "pwd")
                                    }
                                    maxLength={20}
                                />
                            )}
                        </div>
                    </Item>

                    {/* ------------------ 联系电话 ------------------*/}
                    <Item errorMessage={getFieldError("numberState")}>
                        <div className="IputBox">
                            {getFieldDecorator("numberState", {
                                rules: [
                                    {
                                        required: true,
                                        message: translate("请输入联系电话"),
                                    },
                                    {
                                        validator: (rule, value, callback) => {
                                            if(value && !phoneReg.test(value)){
                                                callback(translate("电话号码必须由9个数字组成，不要在前面填写0"));
                                            }
                                            else if(Array.isArray(this.phonePrefix) && this.phonePrefix.length){
                                                const FirstThreeCheck = this.checkPrefix(value,this.phonePrefix);
                                                if (value && !FirstThreeCheck) {
                                                    callback(translate("该电话号码无效，请输入正确的号码"));
                                                }
                                            } 
                                            callback();
                                        },
                                    },
                                ],
                            })(
                                <Input
                                    size="large"
                                    className="registerPhone"
                                    prefix={<PhoneIcon text={"+ 84"} />}
                                    placeholder={translate("联系电话")}
                                    onChange={(e) =>
                                        this.RegisterFormdata(e, "phone")
                                    }
                                    maxLength={this.maxLength}
                                />
                            )}
                        </div>
                    </Item>

                    {/* ------------------ 电子邮箱 ------------------*/}
                    <Item errorMessage={getFieldError("emailNameState")}>
                        <div className="IputBox emailInput">
                            {getFieldDecorator("emailNameState", {
                                rules: [
                                    {
                                        required: true,
                                        message: translate("请输入电子邮箱"),
                                    },
                                    {
                                        validator: (rule, value, callback) => {
                                            if(value && value.length > 50){
                                                callback(translate("请填写最多50个字符"));
                                            }
                                            if (value && !emailReg.test(value)) {
                                                callback(translate("请填写有效的电子邮件地址"));
                                            }
                                            callback();
                                        },
                                    },
                                ],
                            })(
                                <>
                                    <Input
                                        size="large"
                                        prefix={<EmailIcon />}
                                        placeholder={translate("电子邮箱地址")}
                                        onChange={(e) =>
                                            this.RegisterFormdata(e, "email")
                                        }
                                        maxLength={60}
                                        value={EmailAccount}
                                    />
                                   <Row className={`emailList ${showEmailList}`}>
                                        {this.emailSuffixList.map((item)=>
                                            <Col 
                                                key={item}
                                                onClick={()=>this.selectMailboxSuffix(item)}
                                            >
                                                {EmailAccount ? (EmailAccount.slice(0, (EmailAccount.indexOf('@'))) + item) : item}
                                            </Col>
                                        )}
                                   </Row>
                                </>
                               
                            )}
                        </div>
                        {emailReg.test(EmailAccount) && !isEmailAvailable ? <div className="input-error-message">{translate("电子邮件地址不可用，请尝试使用其他电子邮件地址")}</div>: null}
                    </Item>
                    {/* ------------------ 推荐代码 ------------------*/}
                    {this.state.showAffCode ? (
                        <div className="IputBox fix-not-required-text">
                            <Input
                                size="large"
                                prefix={<RecommendIcon />}
                                placeholder={translate("推荐代码")}
                                disabled={this.state.disabled ? true : false}
                                defaultValue={affcode}
                                value={affcode}
                                key={this.state.disabled ? affcode : ""}
                                onChange={(e) =>
                                    this.RegisterFormdata(e, "affcode")
                                }
                                maxLength={16}
                            />
                            <div className="not-required-text">{translate("非必填")}</div>
                        </div>
                    ) : null}

                    {/* ------------------ 注册 ------------------*/}
                    <Button
                        size="large"
                        type="primary"
                        block
                        onClick={() => {
                            this.startRegister();
                        }}
                        disabled={!this.submitBtnEnable()}
                    >
                        {translate("注册")}
                    </Button>
                </div>

                <div className="protocol-box">
                    <p className="protocol">
                        {translate("点击“注册”按钮即表示您已年满 21 岁并同意")}
                        <a
                            onClick={() => {
                                console.log("🚀 ~ file: Register.js:575 ~ _Register ~ render ~ CMSOBJ[HostConfig.CMS_ID][25]:", CMSOBJ[HostConfig.CMS_ID][25])
                                Router.push(
                                    "/faq/responsible-gaming?type=Sub7&key=" +
                                        CMSOBJ[HostConfig.CMS_ID][27]
                                );
                                Pushgtagdata("Register","View TC","Register_V_T&C");
                            }}
                        >
                            {translate("条款")}
                        </a>
                        {translate("与")}
                        <br/>
                        <a
                            onClick={() => {
                                Router.push(
                                    "/faq/privacy-policy?type=Sub7&key=" +
                                        CMSOBJ[HostConfig.CMS_ID][21]
                                );
                                Pushgtagdata("Register","View TC","Register_V_T&C");
                            }}
                        >
                            {translate("隐私政策")}
                        </a>
                        {translate("我们的。")}
                    </p>
                </div>

                <Captcha
                    captchaVisible={captchaVisible}
                    setCaptchaVisible={(v) => {
                        this.setState({ captchaVisible: v });
                    }}
                    onMatch={this.onMatch}
                    type="Register"
                    getCaptchaInfo={(props) => {
						this.Captcha = props;
					}}
                />
            </Spin>
        );
    }
}

export default createForm({ fieldNameProp: "register" })(_Register);
