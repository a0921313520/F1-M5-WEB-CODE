import React from "react";
import { Modal, Icon, Spin, Form, Input, Button, Select, message } from "antd";
import { get, post, patch } from "$ACTIONS/TlcRequest";
import { ApiPort, APISETS } from "$ACTIONS/TLCAPI";
import { dateFormat, formatSeconds } from "$ACTIONS/util";
import { Cookie,showResultModal } from "$ACTIONS/helper";
import { formItemLayout, tailFormItemLayout } from "$ACTIONS/constantsData";
import { getMemberInfo, setMemberInfo } from "$DATA/userinfo";
import { memberId, bankNumberReg, realyNameReg } from "$ACTIONS/reg";
import PhoneEdit from "@/Verification/PhoneEdit";
import VerifyCode from "@/RealyName/VerifyCode";
import UploadImage from "@/RealyName/UploadImage";
import { I } from "caniuse-lite/data/agents";
import BankList from "$DATA/bank.static";
/**
 * 完善姓名更新
 * 1. 完善姓名和身份证号  2. 验证手机号码
 * @method CardId
 * @param {object} form   Antd Form组件外包属性，详情请参考Antd 3.x官方文档
 * @param {object} userInfo   本组件需要用到的个人信息(memberInfo: {userName, currency, memberCode, isDeposited, realyName, cardId, phoneNumber, phoneStatus})
 * @param {int} submitOTPAttempts  剩余可尝试验证的次数
 * @param {int} step   当step为0时默认为第一步骤，为1时也是第一步骤，为2时需要手动切换为第二步骤
 * @param {boolean} realyNameVisible   控制是否弹出当前完善信息、验证窗口
 * @param {function(userInfo)} onChangeUserInfo   更新本组件需要用到的memberInfo属性
 * @param {function(step)} nextStep   控制总体步骤情况(1 and 2 / only 1 / only 2)
 * @param {function} closeAllModal   控制关闭所有充值相关窗口
 * @param {function} verifySuccess   验证成功后关闭当前完善信息和验证窗口
 * @param {function} exceedTryNumber   超过5次验证的提示窗口
 * @param {object|undefined} setLoading   用来设置父级loading状态
 */
const { Item } = Form;
const { Option } = Select;
class CardId extends React.Component {
    static defaultProps = {
        step: 0, // 0: 双步骤 1: 仅需1步骤 2: 仅需2步骤
        userInfo: {
            userName: "",
            currency: "CNY",
            memberCode: "",
            isDeposited: 0, // 0 未存款，可更新  1 以存款，禁更新
            realyName: "",
            cardId: "",
            phoneNumber: "",
            isBankCardValidated: false,
            phoneStatus: false,
        },
    };
    constructor(props) {
        super(props);
        this.state = {
            phone: "",
            isEditPhone: false,
            isPhoneEditable: false,
            updatePhoneStatus: 0, // 0 图标  1 更新禁用  2 更新启用
            currentStep: 1,
            remainingTime: -1,
            isLoading: false,
            verifySubmitDisable: true,
            fullInfoBtnDisable: true,
            defaultDisable: false, // 默认禁用提交验证码按钮
            bankList: [],
            sendBtnDisable: false,
            verifyCodeVisible: false, // 验证银行卡号相关信息OTP弹窗是否显示
            isNeedBankAccountOTP: true, // 是否需要验证完善银行卡信息 OTP
            setBankCard: {
                searchValue: "",
                showBankList: false,
                bankAlphabetic: "",
            },
            openUploadImage: false,
            btnValue: "上传身份证及银行卡",
            fileId1: "",
            fileId2: "",
            fileId3: "",
            clearFiles: false,
            userNamesStatus: "",
        };

        this.handleSubmit1 = this.handleSubmit1.bind(this);
        this.handleSubmit2 = this.handleSubmit2.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
        this.sendVerifyCode = this.sendVerifyCode.bind(this);
        this.postPhoneTAC = this.postPhoneTAC.bind(this);
        this.clearTime = this.clearTime.bind(this);
        this.startCountDown = this.startCountDown.bind(this);
        this.bankAccountVerifySuccess =
            this.bankAccountVerifySuccess.bind(this);

        this.clearDialogTimer = null; // 自动半黑透明提示窗隐藏Timer
        this.timeTimer = null; // 倒计时Timer
        this.phoneNumber = "";

        this.fullInfoFormNames = ["realyName", "bankaccount", "banknumber"];
        this.needUploadImages = false;
    }
    componentDidMount() {
        console.log("Cookie", Cookie);
        if (this.props.step === 1) {
            Cookie.Get("phoneTime") !== null
                ? this.startCountDown()
                : clearInterval(this.timeTimer);
        }
        get(ApiPort.GETWithdrawalbank)
            .then((res) => {
                if (res) {
                    let filterDupBank = res.result.banks.filter(
                        (obj, pos, arr) => {
                            return (
                                arr
                                    .map((mapObj) => mapObj.Name)
                                    .indexOf(obj.Name) == pos
                            );
                        }
                    );
                    this.setState({
                        bankList: filterDupBank,
                    });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }
    componentDidUpdate(prevProps, prevState) {
        // 当step为0时默认为第一步骤，为1时也是第一步骤，为2时需要手动切换为第二步骤
        if (prevProps.step !== this.props.step && this.props.step === 2) {
            this.setState({ currentStep: 2 });
        }

        if (this.inputSelection) {
            const banknumber = this.props.form.getFieldValue(
                this.fullInfoFormNames[2]
            );
            if (
                banknumber &&
                this.inputSelection.start < banknumber.toString().length
            ) {
                const input = this.bankNumberInput;
                input.selectionStart = this.inputSelection.start;
                input.selectionEnd = this.inputSelection.end;
                this.inputSelection = null;
            }
        }
        if (
            prevProps.banksVerificationManual !==
                this.props.banksVerificationManual &&
            this.props.banksVerificationManual
        ) {
            this.props.verifySuccess(true);
            this.needUploadImages = true;
            this.handleFormChange();
        }
    }
    componentWillUnmount() {
        clearInterval(this.timeTimer);
        clearTimeout(this.clearDialogTimer);
    }
    handleSubmit2(e) {
        e.preventDefault();
        this.props.form.validateFields(
            this.fullInfoFormNames,
            (err, values) => {
                if (!err) {
                    this.values = values;
                    if (
                        this.state.isNeedBankAccountOTP &&
                        !this.needUploadImages
                    ) {
                        this.props.setLoading(true);
                        this.setState({ isLoading: true });
                        get(
                            ApiPort.GetOTPAttempts +
                                "&serviceAction=BankCardValidation&channelType=SMS"
                        ).then((remain) => {
                            this.props.setLoading(false);
                            this.setState({ isLoading: false });
                            if (!!remain.submitOTPAttempts) {
                                this.setState({ verifyCodeVisible: true });
                            } else {
                                this.props.exceedTryNumber(() => {
                                    this.setState({ verifyCodeVisible: false });
                                });
                            }
                        });
                    } else {
                        this.bankAccountVerifySuccess();
                    }
                }
            }
        );

        Pushgtagdata("Verification​", "Submit", "ID_Bank_PII_DepositPage​");
    }
    handleSubmit1(e) {
        e.preventDefault();
        this.props.form.validateFields(["verifyCode"], (err, values) => {
            if (!err) {
                this.props.setLoading(true);
                this.setState({ isLoading: true });

                this.postPhoneTAC(
                    values.verifyCode, 
                    () => {
                        // 更新用户信息
                        getMemberInfo((memberRes) => {
                            showResultModal("验证成功", true);
                            this.updateProfile(memberRes);
                            this.setState({ isLoading: false });
                            this.props.setLoading &&
                                this.props.setLoading(false);
                        }, true);
                    },
                    (res) => {
                        if (this.props.className === "wallet-deposit") {
                            this.props.form.setFields({
                                verifyCode: {
                                    value: "",
                                    errors: [new Error(res.result.message)],
                                },
                            });
                        } else {
                            res.result.remainingAttempt !== 0 &&
                                message.error(
                                    res.result.message ||
                                        res.result.errorMessage ||
                                        "系统错误"
                                );
                        }

                        this.setState({ isLoading: false });
                        this.props.setLoading && this.props.setLoading(false);
                    }
                );
            }
        });
        Pushgtagdata("Verification​", "Submit", "VerifyOTP_Phone_DepositPage");
    }
    // 银行卡信息验证 OTP 成功回调
    bankAccountVerifySuccess() {
        if (this.needUploadImages) {
            this.verificationManual();
            return;
        }
        if (!this.values) {
            return alert(
                "请检查个人信息是否完善，如仍无法提交请联系客服回馈错误！"
            );
        }
        this.props.setLoading(true);
        this.setState({ isLoading: true });

        let [accountHolderName, bankName, accountNumber] = Object.values(
            this.values
        );
        post(ApiPort.POSTRememberBanks, {
            accountHolderName,
            bankName:
                bankName == undefined
                    ? this.state.setBankCard.searchValue
                    : bankName,
            accountNumber: accountNumber.replace(/\s/g, ""),
            branch: "",
            city: "",
            province: "",
            type: "W",
            isDefault: false,
            isDepositVerification: true,
        })
            .then((res) => {
                if (res.isSuccess) {
                    getMemberInfo((memberRes) => {
                        showResultModal("验证成功", true);
                        this.props.verifySuccess(false);
                        this.updateProfile(memberRes);
                        this.props.setLoading && this.props.setLoading(false);
                        this.setState({ isLoading: false });
                        this.props.getPayMethod(false);
                    }, true);
                } else {
                    this.props.setLoading && this.props.setLoading(false);
                    this.setState({
                        isNeedBankAccountOTP: false,
                        isLoading: false,
                    });
                    if (res.errorCode == "BV00005") {
                        Modal.info({
                            title: "",
                            width: 340,
                            zIndex: "1600",
                            content: (
                                <div className="inline-link-btn">
                                    <div>
                                        <img
                                            src={
                                                "/vn/img/maintain/img-restricted.png"
                                            }
                                            style={{
                                                width: "120px",
                                                height: "130px",
                                            }}
                                        />
                                    </div>
                                    <h3
                                        style={{
                                            fontSize: "18px",
                                            fontWeight: 900,
                                            marginTop: "20px",
                                        }}
                                    >
                                        用户账号违反同乐城规章
                                    </h3>
                                    <div style={{ textAlign: "center" }}>
                                        抱歉 ，
                                        由于您的账号违反同乐城规章，即日起已被关闭
                                    </div>
                                </div>
                            ),
                            okText: (
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <img
                                        src="/vn/img/icons/icon-cs.png"
                                        style={{ marginRight: "10px" }}
                                    />
                                    在线客服
                                </div>
                            ),
                            onOk: () => {
                                global.PopUpLiveChat();
                                global.globalExit();
                            },
                            onCancel: () => {
                                global.globalExit();
                            },
                        });
                    } else if (res.remainingAttempts < 1) {
                        //超过验证次数
                        this.props.form.resetFields();
                        this.props.verifySuccess(false);
                        this.setState(
                            { setBankCard: { searchValue: "" } },
                            () => {
                                this.handleFormChange();
                            }
                        );
                        this.props.exceedTryNumber();
                    } else {
                        const verifyErrSign = Modal.confirm({
                            width: 326,
                            icon: null,
                            centered: true,
                            className:
                                "bankinfo-verify-otp confirm-clear-mar tlc-closable-clear",
                            content: (
                                <div className="inline-link-btn">
                                    <div>
                                        <img
                                            src={"/vn/img/icons/icon-warn.png"}
                                        />
                                    </div>
                                    <h3>验证失败</h3>
                                    <div style={{ textAlign: "left" }}>
                                        个人信息验证失败，建议您重新确认您所输入的资料后再次提交，或者尝试手动绑定。
                                    </div>
                                </div>
                            ),
                            okText: "手动绑定",
                            cancelText: "重新验证",
                            okButtonProps: {
                                type: "primary",
                                shape: "round",
                                style: { width: "46%", marginTop: -16 },
                                onClick: () => {
                                    verifyErrSign.destroy();
                                    this.needUploadImages = true;
                                    this.handleFormChange();
                                },
                            },
                            cancelButtonProps: {
                                ghost: true,
                                type: "danger",
                                shape: "round",
                                style: { width: "46%", marginTop: -16 },
                                onClick: () => {
                                    verifyErrSign.destroy();
                                },
                            },
                        });
                    }
                }
            })
            .catch((error) => {
                this.props.setLoading && this.props.setLoading(false);
                this.setState({ isLoading: false });
                console.log(error);
            });
    }
    // verifyCode { string|{verifyCode: ???, type: ??? }}
    postPhoneTAC(verifyCode, resolve, reject) {
        const phoneNum = this.phoneNumber || this.props.userInfo.phoneNumber; // 有更新手机号则使用最新参数，否则使用传入的参数
        const { userName, currency } = this.props.userInfo;
        const isStr = typeof verifyCode === "string";

        patch(ApiPort.POSTPhoneVerifyTAC, {
            verificationCode: isStr ? verifyCode : verifyCode.verifyCode,
            isRegistration: false,
            msIsdn: "86-" + phoneNum,
            siteId: 37,
            serviceAction: isStr ? "DepositVerification" : verifyCode.type,
        })
            .then((res) => {
                console.log("patch res: ", res);

                if (!res.isSuccess && res.errors) {
                    this.props.form.setFields({
                        verifyCode: {
                            value: "",
                            errors: [new Error(res.errors[0].description)],
                        },
                    });
                }

                let result = res.result;
                if (res.isSuccess && result.isVerified) {
                    typeof resolve === "function" && resolve(res);

                    this.clearTime();
                } else {
                    typeof reject === "function" && reject(res);

                    console.log(
                        "result.remainedAttempt: ",
                        result.remainingAttempt
                    );

                    this.props.setSubmitOTPAttempts(result.remainingAttempt);
                    if (result.remainingAttempt === 0) {
                        this.clearTime();
                        this.props.exceedTryNumber(() => {
                            this.setState({ verifyCodeVisible: false });
                        });
                    }
                }
            })
            .catch((error) => {
                console.log("error: ", error);
                this.setState({ isLoading: false });
                this.props.setLoading && this.props.setLoading(false);
                console.error("系统错误");
            });
    }
    updateProfile(res) {
        let phoneNumber = "";
        let phoneStatus = "";
        if (res.contacts) {
            phoneStatus = res.contacts.some((v) => {
                const inPhoneStatus = v.contactType === "Phone";
                inPhoneStatus && (phoneNumber = v.contact);
                return inPhoneStatus && v.status === "Verified";
            });
        } else {
            phoneStatus = res.phoneStatus;
            phoneNumber = res.phoneNumber;
        }
        this.props.onChangeUserInfo({
            userName: res.userName,
            currency: res.currency,
            memberCode: res.memberCode,
            isDeposited: res.isDeposited,
            realyName: res.firstName,
            cardId: res.documentID,
            isBankCardValidated: res.isBankCardValidated,
            phoneNumber: phoneNumber.replace("86-", ""),
            phoneStatus: phoneStatus,
        });
        if (res.firstName && phoneStatus) {
            this.props.verifySuccess(false);
        }
        typeof global.setGlobalMemberInfo === "function" &&
            global.setGlobalMemberInfo(res);
        return phoneNumber;
    }
    clearTime() {
        Cookie.Delete("phoneTime");
        clearInterval(this.timeTimer);
        this.setState({ defaultDisable: true }); // 發送驗證碼五分鐘後，仍然可以輸入驗證碼來提交
    }
    startCountDown() {
        this.setState({ remainingTime: 300 });
        clearInterval(this.timeTimer);

        if (Cookie.Get("phoneTime")) {
            const phoneTime = Cookie.Get("phoneTime")
                .replace("-", "/")
                .replace("-", "/");
            let lastSeconds = parseInt(
                300 -
                    (new Date().getTime() - new Date(phoneTime).getTime()) /
                        1000
            );
            this.setState({ defaultDisable: true });
            this.timeTimer = setInterval(() => {
                if (lastSeconds <= 0) {
                    this.clearTime();
                }
                this.setState({ remainingTime: lastSeconds-- });
            }, 1000);
        } else {
            Cookie.Create("phoneTime", null);
        }
    }
    // 发送验证码
    sendVerifyCode(callback, type, isResend) {
        if (!this.state.sendBtnDisable || type) {
            const { userName, currency, phoneNumber } = this.props.userInfo;
            const phoneNum = this.phoneNumber || phoneNumber; // 有更新手机号则使用最新参数，否则使用传入的参数
            this.setState({ isLoading: true });
            post(
                ApiPort.POSTPhoneVerifyAPI + "?isFirstRequest=false" + APISETS,
                {
                    siteId: 37,
                    MsIsdn: "86-" + phoneNum,
                    isRegistration: false,
                    isOneTimeService: false,
                    CurrencyCode: currency,
                    isMandatoryStep: false,
                    serviceAction: "DepositVerification",
                }
            )
                .then((res) => {
                    this.setState({ isLoading: false });
                    typeof callback === "function" && callback();
                    if (res.isSuccess == true) {
                        // 更新手機號
                        this.isEditPhoneHandler.updatePhoneNumber();
                        message.success("发送成功");

                        Cookie.Create("phoneTime", dateFormat(), 5);

                        this.startCountDown();
                    } else if (res.isSuccess == false) {
                        if (
                            !res.result &&
                            res.errors[0].errorCode === "VAL18015"
                        ) {
                            //没有发送验证码的机会去到限制页面
                            this.clearTime();
                            this.props.exceedTryNumber(() => {
                                this.setState({ verifyCodeVisible: false });
                            });
                        } else if (res.errors) {
                            message.error(res.errors[0].description);
                        }
                    }
                })
                .catch((error) => {
                    console.log("POSTPhoneVerifyAPI" + error);
                });

            Pushgtagdata(
                "Verification​",
                "Request",
                isResend
                    ? "ResendCode_Phone_DepositPage"
                    : "SendCode_Phone_DepositPage"
            );
        }
    }
    // 确认要退出吗？
    confirmExit = () => {
        if (this.state.currentStep == 1) {
            const verifyOutSign = Modal.confirm({
                title: "温馨提醒",
                width: 400,
                icon: <div />,
                centered: true,
                className: "confirm-modal-of-public",
                content: (
                    <div className="inline-link-btn">
                        <div>
                            <img src={"/vn/img/icons/icon-warn_yellow.png"} />
                        </div>
                        <div
                            className="content"
                            style={{ marginTop: 20, padding: "0 15px" }}
                        >
                            <p>
                                请填写您的真实姓名并完成手机号码验证可确保
                                账号安全和存款快速到账。
                            </p>
                        </div>
                    </div>
                ),
                okText: "继续验证",
                cancelText: "离开",
                okButtonProps: {
                    type: "primary",
                    shape: "round",
                    style: { width: "46%" },
                    onClick: () => {
                        verifyOutSign.destroy();
                        Pushgtagdata(
                            "Verification​",
                            "Click",
                            "Confirm_Skip_PII_DepositPage"
                        );
                    },
                },
                cancelButtonProps: {
                    ghost: true,
                    type: "danger",
                    shape: "round",
                    onClick: () => {
                        verifyOutSign.destroy();
                        this.setState({
                            verifyCodeVisible: false,
                            setBankCard: { showBankList: false },
                        });
                        this.props.closeAllModal();
                        Pushgtagdata(
                            "Verification​",
                            "Click",
                            "Confirm_Skip_Phone_DepositPage"
                        );
                    },
                },
            });
        } else {
            const verifyOutSign = Modal.confirm({
                title: "温馨提示",
                width: 326,
                icon: (
                    <Icon
                        type="close"
                        style={{
                            fontSize: "20px",
                            color: "#000",
                            float: "right",
                            marginRight: -10,
                        }}
                        onClick={() => {
                            verifyOutSign.destroy();
                            this.setState({
                                verifyCodeVisible: false,
                                clearFiles: true,
                            });
                        }}
                    />
                ),
                centered: true,
                className: "bankinfo-verify-otp tlc-closable-clear",
                content: (
                    <div className="inline-link-btn">
                        <div>
                            {" "}
                            ，您需要先完成信息验证才能享有更多充值与提现方式哦，确定离开此页面？
                        </div>
                    </div>
                ),
                okText: "确定",
                cancelText: "继续验证",
                okButtonProps: {
                    type: "primary",
                    shape: "round",
                    style: { width: "46%" },
                    onClick: () => {
                        verifyOutSign.destroy();
                        this.setState({
                            verifyCodeVisible: false,
                            setBankCard: { showBankList: false },
                            clearFiles: true,
                            fullInfoBtnDisable: true,
                        });
                        this.needUploadImages = false;
                        this.props.verifySuccess(false);
                        this.props.setBanksVerificationManual(false);
                        this.props.form.resetFields();
                        Pushgtagdata(
                            "Verification​",
                            "Click",
                            "Confirm_Skip_PII_DepositPage"
                        );
                    },
                },
                cancelButtonProps: {
                    ghost: true,
                    type: "danger",
                    shape: "round",
                    style: { width: "46%" },
                    onClick: () => {
                        verifyOutSign.destroy();
                    },
                },
            });
        }
    };
    // 完善姓名身份证银行账户卡号按钮禁用
    handleFormChange = () => {
        let status =
            Object.entries(
                this.props.form.getFieldsError(this.fullInfoFormNames)
            ).every((v) => v[1] === undefined) &&
            this.props.form.getFieldValue(this.fullInfoFormNames[0]) !==
                undefined &&
            this.props.form.getFieldValue(this.fullInfoFormNames[0]) !== "" &&
            this.props.form.getFieldValue(this.fullInfoFormNames[2]) !==
                undefined &&
            (this.props.form.getFieldValue(this.fullInfoFormNames[1]) ==
            undefined
                ? this.state.setBankCard.searchValue
                : this.props.form.getFieldValue(this.fullInfoFormNames[1])) &&
            ((this.needUploadImages &&
                this.state.btnValue == "已上传" &&
                this.props.form.getFieldValue("cardId")) ||
                !this.needUploadImages)
                ? true
                : false;
        this.setState({ fullInfoBtnDisable: !status });
        console.log(
            "完善姓名身份证银行账户卡号按钮禁用:",
            this.props.form.getFieldsValue(this.fullInfoFormNames)
        );
    };
    // 记录银行卡号输入光标位置
    handleChange = () => {
        if (this.bankNumberInput) {
            this.inputSelection = {
                start: this.bankNumberInput.selectionStart,
                end: this.bankNumberInput.selectionEnd,
            };
        }
    };
    openMenu = () => {
        this.setState({
            setBankCard: {
                showBankList: !this.state.setBankCard.showBankList,
            },
        });
    };
    changeBankName = (value, option) => {
        this.setState(
            {
                setBankCard: {
                    searchValue: value,
                    showBankList: false,
                    bankAlphabetic: option.props.children[0].props.src,
                },
            },
            () => {
                this.handleFormChange();
            }
        );
        if (value) {
            this.props.form.resetFields(this.fullInfoFormNames[1]);
        } else {
            this.setState({ fullInfoBtnDisable: false });
        }
        console.log(
            "getFieldValue",
            this.props.form.getFieldsValue(this.fullInfoFormNames)
        );
    };
    openUploadModal = () => {
        this.setState({ openUploadImage: true });
    };
    verifySuccessModal = () => {
        const onUnderstand = () => {
            this.props.verifySuccess(false);
            this.props.getPayMethod(false);
            this.needUploadImages = false;
            this.setState({
                clearFiles: true,
            });
        };
        Modal.info({
            title: "信息验证",
            width: 340,
            zIndex: 1600,
            content: (
                <div className="inline-link-btn">
                    <div>
                        <img
                            src={"/vn/img/icons/icon-done.png"}
                            style={{ width: "60px", height: "60px" }}
                        />
                    </div>
                    <h3
                        style={{
                            fontSize: "18px",
                            fontWeight: 900,
                            marginTop: "20px",
                        }}
                    >
                        上传成功， 处理中。
                    </h3>
                    <div style={{ textAlign: "center" }}>
                        , 您的身份证及银行卡号验证请求已提交,
                        目前我们正在为您核实中, 将在 48
                        小时内完成验证后发送至您的个人信箱。
                    </div>
                </div>
            ),
            okText: <div>明白了</div>,
            onOk: onUnderstand,
            onCancel: onUnderstand,
        });
    };
    verificationManual = () => {
        if (!this.values && !this.props.form.getFieldValue("cardId")) {
            return alert(
                "请检查个人信息是否完善，如仍无法提交请联系客服回馈错误！"
            );
        }
        this.setState({ isLoading: true });
        const { fileId1, fileId2, fileId3 } = this.state;
        let [accountHolderName, bankName, accountNumber] = Object.values(
            this.values
        );
        const cardId = this.props.form.getFieldValue("cardId");
        const data = {
            accountHolderName: accountHolderName,
            accountNumber: accountNumber.replace(/\s/g, ""),
            bankName:
                bankName == undefined
                    ? this.state.setBankCard.searchValue
                    : bankName,
            documentId: cardId,
            files: [fileId1, fileId2, fileId3],
        };
        post(ApiPort.MemberBanksVerificationManual, data)
            .then((res) => {
                this.setState({ isLoading: false });
                if (res.isSuccess) {
                    this.verifySuccessModal();
                } else {
                    if (
                        res.errorCode == "BV00013" ||
                        res.errorCode == "BV00006"
                    ) {
                        showResultModal(
                            "上传失败，请稍后再试 或联系在线客服协助",
                            false,
                            1501,
                            "otp",
                            "depositLoading"
                        );
                    } else if (res.errorCode == "BV00005") {
                        // 黑名单
                        Modal.info({
                            title: "",
                            width: 340,
                            zIndex: "1600",
                            content: (
                                <div className="inline-link-btn">
                                    <div>
                                        <img
                                            src={
                                                "/vn/img/maintain/img-restricted.png"
                                            }
                                            style={{
                                                width: "120px",
                                                height: "130px",
                                            }}
                                        />
                                    </div>
                                    <h3
                                        style={{
                                            fontSize: "18px",
                                            fontWeight: 900,
                                            marginTop: "20px",
                                        }}
                                    >
                                        用户账号违反同乐城规章
                                    </h3>
                                    <div style={{ textAlign: "center" }}>
                                        抱歉 ，
                                        由于您的账号违反同乐城规章，即日起已被关闭
                                    </div>
                                </div>
                            ),
                            okText: (
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <img
                                        src="/vn/img/icons/icon-cs.png"
                                        style={{ marginRight: "10px" }}
                                    />
                                    在线客服
                                </div>
                            ),
                            onOk: () => {
                                global.PopUpLiveChat();
                                global.globalExit();
                            },
                            onCancel: () => {
                                global.globalExit();
                            },
                        });
                    } else if (
                        res.errorCode == "BV00001" ||
                        res.errorCode == "BV00002" ||
                        res.errorCode == "BV00010"
                    ) {
                        this.verifySuccessModal();
                    } else {
                        showResultModal(
                            "上传失败，请稍后再试 或联系在线客服协助",
                            false,
                            1501,
                            "otp",
                            "depositLoading"
                        );
                    }
                }
            })
            .catch((error) => {
                this.setState({ isLoading: false });
                showResultModal(
                    "上传失败，请稍后再试 或联系在线客服协助",
                    false,
                    1501,
                    "otp",
                    "depositLoading"
                );
            });
    };
    updateMemberInfo = () => {
        if (!this.props.form.getFieldValue("userNames")) return;
        this.props.form.validateFields(["userNames"], (err, values) => {
            const name = this.props.form.getFieldValue("userNames");
            const data = {
                key: "FirstName",
                value1: name,
            };
            if (!err) {
                this.props.setLoading(true);
                this.setState({ isLoading: true });
                setMemberInfo(data, (res) => {
                    if (res.isSuccess) {
                        getMemberInfo((memberRes) => {
                            showResultModal("验证成功", true);
                            this.updateProfile(memberRes);
                            this.props.form.resetFields("userNames"); //设置了这个用户名才会变（例子： 阿斯顿 变成 **顿）
                            this.setState({ isLoading: false });
                            this.props.setLoading &&
                                this.props.setLoading(false);
                        }, true);
                    } else {
                        showResultModal("验证失败", false);
                        this.setState({ isLoading: false });
                        this.props.setLoading && this.props.setLoading(false);
                    }
                });
            }
        });
    };
    render() {
        const {
            currentStep,
            sendBtnDisable,
            fullInfoBtnDisable,
            setBankCard,
            openUploadImage,
            clearFiles,
            userNamesStatus,
            isPhoneEditable,
        } = this.state;
        const { step, form, realyNameVisible, userInfo } = this.props;
        const { getFieldDecorator } = form;

        const isWalletDeposit = this.props.className === "wallet-deposit";
        return (
            <React.Fragment>
                <Modal
                    className={this.props.className}
                    title="账户验证"
                    visible={realyNameVisible}
                    onCancel={this.confirmExit}
                    centered={true}
                    width={420}
                    footer={null}
                    maskClosable={false}
                >
                    <Spin spinning={this.state.isLoading}>
                        <Form
                            className="verification-form-wrap transprant-addon-btn inline-link-btn"
                            style={{
                                display: currentStep === 1 ? "block" : "none",
                            }}
                            {...formItemLayout}
                            onSubmit={this.handleSubmit1}
                        >
                            <div
                                className="modal-prompt-info clear-margin-bottom"
                                style={{ fontSize: "12px" }}
                            >
                                您好，为了您的账户安全，请填写您的真实姓名并验证您的手机号码。真实姓名一旦填写即不能随意更改，请确保您填写的姓名与您银行账户持有者姓名一致，以利存款快速到账
                            </div>
                            <div className="line-distance" />
                            <Item label="真实姓名" className="realName">
                                <div
                                    className="otp-cs-tip"
                                    style={{ fontSize: "12px", color: "#666" }}
                                >
                                    请正确输入您的真实姓名,
                                    当前信息将用于核实您日后的存款账户。
                                </div>
                                <div className="input-label">姓名</div>
                                {getFieldDecorator("userNames", {
                                    initialValue: userInfo.realyName.replace(
                                        /[\u4E00-\u9FA5]/g,
                                        "*"
                                    ),
                                    rules: [
                                        { required: true, message: "格式错误" },
                                        {
                                            validator: (
                                                rule,
                                                value,
                                                callback
                                            ) => {
                                                if (
                                                    !userInfo.realyName &&
                                                    value &&
                                                    !realyNameReg.test(value)
                                                ) {
                                                    callback(
                                                        "真实姓名格式错误"
                                                    );
                                                    this.setState({
                                                        userNamesStatus: false,
                                                    });
                                                    return;
                                                } else if (!value) {
                                                    this.setState({
                                                        userNamesStatus: false,
                                                    });
                                                    callback();
                                                    return;
                                                }
                                                callback();
                                                this.setState({
                                                    userNamesStatus: true,
                                                });
                                            },
                                        },
                                    ],
                                })(
                                    <Input
                                        size="large"
                                        placeholder={
                                            isWalletDeposit
                                                ? "真实姓名"
                                                : "姓名"
                                        }
                                        className={`tlc-input-disabled userNames-input ${
                                            userNamesStatus &&
                                            !userInfo.realyName
                                                ? "active"
                                                : !!userInfo.realyName
                                                ? "havename"
                                                : ""
                                        }`}
                                        autoComplete="off"
                                        disabled={!!userInfo.realyName}
                                        addonAfter={
                                            userInfo.realyName ? (
                                                <div>
                                                    <img
                                                        src="/vn/img/icons/icon-checked.png"
                                                        style={{
                                                            width: 16,
                                                            height: "auto",
                                                            marginRight: 5,
                                                        }}
                                                    />
                                                    提交成功
                                                </div>
                                            ) : userNamesStatus ? (
                                                <div
                                                    onClick={
                                                        this.updateMemberInfo
                                                    }
                                                >
                                                    提交
                                                </div>
                                            ) : (
                                                <div>提交</div>
                                            )
                                        }
                                    />
                                )}
                            </Item>
                            <Item
                                label="验证您的手机号"
                                className="wallet-label-phoneNum"
                            />
                            <div
                                className="otp-cs-tip"
                                style={{ fontSize: "12px", color: "#666" }}
                            >
                                确认您的手机号码，然后选择通过短信接受一次性密码。
                            </div>
                            <PhoneEdit
                                className="wallet-deposit_phoneEdit"
                                disableEdit={this.state.defaultDisable}
                                memberCode={userInfo.memberCode}
                                phoneNumber={userInfo.phoneNumber}
                                isDeposited={userInfo.isDeposited}
                                dialogVisible={realyNameVisible}
                                updateProfile={this.updateProfile}
                                setPhoneEditable={(v) => {
                                    this.setState({ isPhoneEditable: v });
                                }}
                                setRemainingTime={(v) => {
                                    this.setState({ remainingTime: v });
                                }}
                                updatePhoneNumber={(v) => {
                                    this.phoneNumber = v;
                                }}
                                setSendBtnDisable={(v) => {
                                    this.setState({ sendBtnDisable: v });
                                }}
                                setLoading={(v) => {
                                    this.props.setLoading(v);
                                    this.setState({ isLoading: v });
                                }}
                                phoneStatus={userInfo.phoneStatus}
                                GetThroughoutVerification={() => {
                                    this.props.GetThroughoutVerification();
                                }}
                                isEditPhoneHandler={(v) => {
                                    this.isEditPhoneHandler = v;
                                }}
                            />
                            {!isPhoneEditable ? (
                                <div className="otp-cs-tip">
                                    如果您想更新手机号码，请联系我们的
                                    <Button
                                        type="link"
                                        onClick={global.PopUpLiveChat}
                                    >
                                        在线客服
                                    </Button>
                                    。
                                </div>
                            ) : (
                                <div className="otp-cs-tip">
                                    发送验证码后，如需修改手机号，请联系我们的
                                    <Button
                                        type="link"
                                        onClick={global.PopUpLiveChat}
                                    >
                                        在线客服
                                    </Button>
                                </div>
                            )}
                            {userInfo.phoneStatus ? (
                                <div
                                    className="phverifySuccess"
                                    style={{
                                        fontWeight: "bold",
                                        marginBottom: 21,
                                    }}
                                >
                                    <img
                                        src="/vn/img/icons/icon-checked.png"
                                        style={{
                                            width: 16,
                                            height: "auto",
                                            marginRight: 5,
                                        }}
                                    />
                                    验证成功
                                </div>
                            ) : (
                                <div>
                                    <Item
                                        label="验证码"
                                        className="wallet-label-otp"
                                    >
                                        {getFieldDecorator("verifyCode", {
                                            rules: [
                                                {
                                                    validator: (
                                                        rule,
                                                        value,
                                                        callback
                                                    ) => {
                                                        // 默认禁用提交验证码按钮
                                                        this.setState({
                                                            verifySubmitDisable: true,
                                                        });
                                                        if (!value) {
                                                            callback(
                                                                "请输入验证码"
                                                            );
                                                            return;
                                                        }
                                                        if (
                                                            value &&
                                                            !/^[0-9]{6}$/.test(
                                                                value
                                                            )
                                                        ) {
                                                            callback(
                                                                "验证码有误，请检查并确保您输入了正确的验证码。"
                                                            );
                                                            return;
                                                        }

                                                        // 手机号格式通过后更正更新按钮状态
                                                        this.setState({
                                                            verifySubmitDisable: false,
                                                        });
                                                        callback();
                                                    },
                                                },
                                            ],
                                        })(
                                            <Input
                                                addonAfter={
                                                    this.state.remainingTime <
                                                    0 ? (
                                                        <div
                                                            onClick={() => {
                                                                this.sendVerifyCode();
                                                            }}
                                                        >
                                                            {isWalletDeposit
                                                                ? "发送"
                                                                : "发送验证码"}
                                                        </div>
                                                    ) : this.state
                                                          .remainingTime > 0 ? (
                                                        <div>
                                                            重发
                                                            {formatSeconds(
                                                                this.state
                                                                    .remainingTime
                                                            )}
                                                        </div>
                                                    ) : (
                                                        !this.state
                                                            .remainingTime && (
                                                            <div
                                                                onClick={() => {
                                                                    this.sendVerifyCode(
                                                                        null,
                                                                        null,
                                                                        true
                                                                    );
                                                                }}
                                                            >
                                                                {isWalletDeposit
                                                                    ? "重发"
                                                                    : "重发验证码"}
                                                            </div>
                                                        )
                                                    )
                                                }
                                                size="large"
                                                autoComplete="off"
                                                className={
                                                    this.state.remainingTime >
                                                        0 || sendBtnDisable
                                                        ? "disabled-time"
                                                        : isWalletDeposit
                                                        ? "forWalletDeposit"
                                                        : ""
                                                }
                                                placeholder="输入验证码"
                                                maxLength={6}
                                            />
                                        )}
                                    </Item>
                                    <p className="otp-cs-tip last-cs-tip">
                                        注意：如果您在5分钟内未收到验证码，请点击重新发送验证码以获取一个新的验证码。
                                    </p>
                                    {isWalletDeposit ? (
                                        ""
                                    ) : (
                                        <div className="line-distance" />
                                    )}
                                    <Item {...tailFormItemLayout}>
                                        <div className="btn-wrap">
                                            <Button
                                                size="large"
                                                type="primary"
                                                htmlType="submit"
                                                disabled={
                                                    this.state.defaultDisable
                                                        ? this.state
                                                              .verifySubmitDisable
                                                        : true
                                                }
                                                block
                                            >
                                                验证
                                            </Button>
                                        </div>
                                    </Item>
                                    {this.props.submitOTPAttempts ? (
                                        <div className="remain">
                                            您还有 (
                                            <span>
                                                {this.props.submitOTPAttempts}
                                            </span>
                                            ) 次尝试机会
                                        </div>
                                    ) : null}
                                </div>
                            )}
                            <div className="skip" style={{ cursor: "pointer" }}>
                                <div
                                    className="skip-btn"
                                    onClick={this.confirmExit}
                                >
                                    跳过验证
                                </div>
                            </div>
                        </Form>
                        <Form
                            className="finish-form-wrap"
                            style={{
                                display: currentStep === 2 ? "block" : "none",
                            }}
                            {...formItemLayout}
                            onSubmit={this.handleSubmit2}
                            onChange={this.handleFormChange}
                        >
                            <div className="line-distance" />
                            <div className="inline-link-btn">
                                ，
                                请完善以下栏位以进行个人信息验证。若您无法验证，请联系
                                <Button
                                    type="link"
                                    onClick={global.PopUpLiveChat}
                                >
                                    在线客服
                                </Button>
                                协助。
                            </div>
                            <div className="line-distance" />
                            <div className="line-distance" />
                            <Item label="开户名">
                                {getFieldDecorator(this.fullInfoFormNames[0], {
                                    initialValue: userInfo.realyName,
                                    rules: [
                                        {
                                            required: true,
                                            message: "请输入开户名",
                                        },
                                        {
                                            validator: (
                                                rule,
                                                value,
                                                callback
                                            ) => {
                                                if (
                                                    !userInfo.realyName &&
                                                    value &&
                                                    !/^[\u4E00-\u9FA5]+$/.test(
                                                        value
                                                    )
                                                ) {
                                                    callback("开户名格式错误");
                                                    return;
                                                }
                                                callback();
                                            },
                                        },
                                    ],
                                })(
                                    <Input
                                        size="large"
                                        placeholder="请输入开户名"
                                        className="tlc-input-disabled"
                                        autoComplete="off"
                                        disabled={!!userInfo.realyName}
                                    />
                                )}
                            </Item>
                            {this.needUploadImages && (
                                <Item label="身份证号码">
                                    {getFieldDecorator("cardId", {
                                        initialValue: userInfo.cardId,
                                        rules: [
                                            {
                                                required: true,
                                                message: "请输入身份证号码",
                                            },
                                            {
                                                validator: (
                                                    rule,
                                                    value,
                                                    callback
                                                ) => {
                                                    if (
                                                        !userInfo.cardId &&
                                                        value &&
                                                        !memberId.test(value)
                                                    ) {
                                                        callback(
                                                            "请输入18位有效身份证号码"
                                                        );
                                                        return;
                                                    }
                                                    callback();
                                                },
                                            },
                                        ],
                                    })(
                                        <Input
                                            size="large"
                                            maxLength={18}
                                            placeholder="请输入身份证号码"
                                            className="tlc-input-disabled"
                                            autoComplete="off"
                                            disabled={!!userInfo.cardId}
                                        />
                                    )}
                                </Item>
                            )}
                            <Item
                                label="银行名称"
                                className={`Item-bankName ${
                                    setBankCard.showBankList
                                        ? "active"
                                        : "inactive"
                                }`}
                            >
                                {getFieldDecorator(this.fullInfoFormNames[1], {
                                    initialValue: setBankCard.searchValue,
                                    rules: [
                                        {
                                            required: true,
                                            message: "请选择银行",
                                        },
                                        {
                                            validator: (
                                                rule,
                                                value,
                                                callback
                                            ) => {
                                                if (
                                                    setBankCard.searchValue &&
                                                    value &&
                                                    /^[\u4E00-\u9FA5]+$/.test(
                                                        value
                                                    )
                                                ) {
                                                    this.props.form.setFieldsValue(
                                                        { bankaccount: value }
                                                    );
                                                    console.log(
                                                        "value:",
                                                        value
                                                    );
                                                }
                                                callback();
                                            },
                                        },
                                    ],
                                })(
                                    <div>
                                        <Input
                                            className={`bankNamewrap ${
                                                setBankCard.searchValue
                                                    ? "have"
                                                    : ""
                                            } ${
                                                setBankCard.showBankList
                                                    ? "active"
                                                    : "inactive"
                                            }`}
                                            size="large"
                                            autoComplete="off"
                                            value={setBankCard.searchValue}
                                            readOnly={true}
                                            placeholder={"请选择银行"}
                                            prefix={
                                                setBankCard.searchValue ? (
                                                    <img
                                                        src={`${setBankCard.bankAlphabetic}`}
                                                        style={{
                                                            width: 24,
                                                            height: 24,
                                                            marginRight: 10,
                                                        }}
                                                    />
                                                ) : (
                                                    <span />
                                                )
                                            }
                                            suffix={
                                                !setBankCard.showBankList && (
                                                    <Icon
                                                        type={`${
                                                            !setBankCard.showBankList
                                                                ? "caret-down"
                                                                : "caret-up"
                                                        }`}
                                                        onClick={this.openMenu}
                                                    />
                                                )
                                            }
                                        />
                                        {setBankCard.showBankList && (
                                            <Select
                                                loading={
                                                    !this.state.bankList.length
                                                }
                                                size="large"
                                                key={"bankcardVerification" + 0}
                                                onChange={this.changeBankName}
                                                open={setBankCard.showBankList}
                                                showArrow={false}
                                                showSearch={true}
                                                optionFilterProp="children"
                                                filterOption={(
                                                    input,
                                                    option
                                                ) => {
                                                    return option.props.value.includes(
                                                        input
                                                    );
                                                }}
                                                className="bankNameSelect"
                                                dropdownClassName="bankNameSelectDropdown"
                                                dropdownStyle={{
                                                    borderTopLeftRadius: 0,
                                                    borderTopRightRadius: 0,
                                                }}
                                                placeholder={
                                                    <div className="searchwrap">
                                                        <Icon
                                                            type="search"
                                                            style={{
                                                                fontSize: 16,
                                                                marginRight: 6,
                                                            }}
                                                        />
                                                        <span>搜索</span>
                                                    </div>
                                                }
                                            >
                                                {this.state.bankList.map(
                                                    (val, index) => {
                                                        let bankname =
                                                            BankList.filter(
                                                                (item) =>
                                                                    item.Name ===
                                                                    val.Name
                                                            );
                                                        return (
                                                            <Option
                                                                key={index}
                                                                value={val.Name}
                                                            >
                                                                <img
                                                                    style={{
                                                                        width: 24,
                                                                        height: 24,
                                                                        marginRight: 10,
                                                                    }}
                                                                    src={`/vn/img/bank/${
                                                                        bankname.length &&
                                                                        bankname[0]
                                                                            .Img
                                                                            ? bankname[0]
                                                                                  .Img
                                                                            : "generic"
                                                                    }.png`}
                                                                />
                                                                {val.Name}
                                                            </Option>
                                                        );
                                                    }
                                                )}
                                            </Select>
                                        )}
                                    </div>
                                )}
                            </Item>
                            <Item label="银行卡号">
                                {getFieldDecorator(this.fullInfoFormNames[2], {
                                    normalize: (value) => {
                                        if (!value) return;
                                        return value
                                            .replace(/\D/g, "")
                                            .replace(/....(?!$)/g, "$& ");
                                    },
                                    rules: [
                                        {
                                            required: true,
                                            message: "请输入银行卡号",
                                        },
                                        {
                                            validator: (
                                                rule,
                                                value,
                                                callback
                                            ) => {
                                                if (
                                                    value &&
                                                    !bankNumberReg.test(
                                                        value.replace(/\s/g, "")
                                                    )
                                                ) {
                                                    callback(
                                                        "银行卡号应为14到19位"
                                                    );
                                                    return;
                                                }
                                                callback();
                                            },
                                        },
                                    ],
                                })(
                                    <Input
                                        size="large"
                                        maxLength={23} // 最大19位银行卡号限制，鉴于需要格式化空格，所以限制为23位
                                        placeholder="请输入银行卡号"
                                        className="tlc-input-disabled"
                                        autoComplete="off"
                                        ref={(c) => {
                                            this.bankNumberInput = c;
                                        }}
                                        onChange={(e) => {
                                            this.handleChange(e);
                                        }}
                                    />
                                )}
                            </Item>
                            {this.needUploadImages && (
                                <Item label="上传身份证及银行卡">
                                    <div className="contentBtn">
                                        <span>{this.state.btnValue}</span>
                                        <Icon
                                            type="right"
                                            style={{
                                                fontSize: 16,
                                                marginRight: 6,
                                                color: "#222222",
                                            }}
                                            onClick={this.openUploadModal}
                                        />
                                    </div>
                                </Item>
                            )}
                            <Item {...tailFormItemLayout}>
                                <div className="btn-wrap">
                                    <Button
                                        disabled={fullInfoBtnDisable}
                                        size="large"
                                        type="primary"
                                        htmlType="submit"
                                        block
                                    >
                                        提交
                                    </Button>
                                </div>
                            </Item>
                        </Form>
                    </Spin>
                </Modal>
                <VerifyCode
                    visible={this.state.verifyCodeVisible}
                    onCancel={() => {
                        this.setState({ verifyCodeVisible: false });
                    }}
                    phoneNumber={this.phoneNumber || userInfo.phoneNumber}
                    sendVerifyCode={this.sendVerifyCode}
                    remainingTime={this.state.remainingTime}
                    submitOTPAttempts={this.props.submitOTPAttempts}
                    submitOTPCode={this.postPhoneTAC}
                    bankAccountVerifySuccess={this.bankAccountVerifySuccess}
                />
                <UploadImage
                    openUploadImage={openUploadImage}
                    closeUploadImage={(v) => {
                        this.setState({ openUploadImage: false });
                    }}
                    btnValue={this.state.btnValue}
                    setbtnValue={(v) => {
                        this.setState({ btnValue: v }, () =>
                            this.handleFormChange()
                        );
                    }}
                    setfileId1={(v) => this.setState({ fileId1: v })}
                    setfileId2={(v) => this.setState({ fileId2: v })}
                    setfileId3={(v) => this.setState({ fileId3: v })}
                    clearFiles={clearFiles}
                />
            </React.Fragment>
        );
    }
}

export default Form.create({ name: "CardId" })(CardId);
