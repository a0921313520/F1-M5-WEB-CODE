import React from "react";
import {
    Modal,
    Dropdown,
    Button,
    Icon,
    message,
    Spin,
} from "antd";
import Router from "next/router";
import HostConfig from "$ACTIONS/Host.config";
import CMSOBJ from "$DATA/stage.live.static.id";
import {
    GetMemberBanks,
    CheckExchangeRateWallet,
    AddExchangeRateWallets,
    setTDBDefaultWallet,
} from "$DATA/wallet";
import { get, patch, del } from "$ACTIONS/TlcRequest";
import { ApiPort, APISET } from "$ACTIONS/TLCAPI";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { formatAmount } from "$ACTIONS/util";
import { translate } from "$ACTIONS/Translate";
import {usdtWalleNameReg, usdtERC20WalleAddressReg, usdtTRC20WalleAddressReg, usdtWalleAddressReg2} from "$ACTIONS/reg";
import dynamic from "next/dynamic";
import {showResultModal} from "$ACTIONS/helper";

const AddBankCard = dynamic(import("./AddBankCard"), {
    loading: () => "",
    ssr: false,
});
const PhoneVerify = dynamic(import("@/Verification/PhoneVerify"), {
    loading: () => "",
    ssr: false,
});
const ExceedVerify = dynamic(import("@/OTP/ExceedVerify"), {
    loading: () => "",
    ssr: false,
});
const AddWalletAddress = dynamic(import("./AddWalletAddress"), {
    loading: () => "",
    ssr: false,
});
const BankWithdrawalDetails = dynamic(import("./BankWithdrawalDetails"), {
    loading: () => "",
    ssr: false,
});
const BankAccountModals = dynamic(import("./BankAccountModals"), {
    loading: () => "",
    ssr: false,
});
class BankAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showAddCard: false,
            visibleDetail: false,
            alreadyBindBanks: [],
            bankDetail: {},
            tDBWalletERC20: [],
            tDBWalletTRC20: [],
            visibleExchangeRateWallet: false,
            addTDBBtnStatue: false, //泰达币添加钱包按钮状态
            tDBName: "",
            tDBAddress: "",
            tDBNameError: false,
            tDBAddressError: false,
            tDBAddressError2: false,
            checkAbleSmsOTP: {
                isAbleSmsOTP: false, // OTP驗證
                attempts: 0, // 剩餘次數
            },
            phoneVisible: false, // 手機驗證
            memberInfo: "",
            exceedVisible: false, // otp 彈窗
            isLoading: false,
            verificationCode: "",
            isShowbankAccountLimit: false,
            isShowBankDetail: false,
            numberOfWithdrawals: 0, //提现次数
            withdrawalAmount: 0, //提现金额
            percentageLimit: 0, //限额百分比
            usdtWithdrawType: "",

            isShowPopover: false, // 是否显示提示弹窗
            isShowPopoverMask: false,
        };

        this.getMemberBanksList = this.getMemberBanksList.bind(this);
        this.showBankDetail = this.showBankDetail.bind(this);
        this.deleteCard = this.deleteCard.bind(this);
        this.getTDBWallet = this.getTDBWallet.bind(this);
        this.addExchangeRateWallets = this.addExchangeRateWallets.bind(this); //添加泰达币钱包
        this.handleOk = this.handleOk.bind(this);
        this.copyEvent = this.copyEvent.bind(this);
        this.setDetaultWallet = this.setDetaultWallet.bind(this); //设置默认钱包
        this.changeModalBtnStatus = this.changeModalBtnStatus.bind(this);
        this.judgeOTPVerification = this.judgeOTPVerification.bind(this); // 查询会员是否能够请求短信OTP
        this.openNoticeOTP = this.openNoticeOTP.bind(this); // OTP注意彈窗
        this.setAttemptRemaining = this.setAttemptRemaining.bind(this); // cry otp 剩餘次數
        this.VerifyStatus = this.VerifyStatus.bind(this); // 驗證彈窗狀態
        this.getVerificationCode = this.getVerificationCode.bind(this); // 獲取otp驗證碼
    }
    componentDidMount() {
        if (localStorage.getItem("memberInfo") != undefined) {
            this.setState({
                memberInfo: JSON.parse(localStorage.getItem("memberInfo")),
            });
        }
        this.getMemberBanksList();
        this.getTDBWallet("USDT-ERC20");
        this.getTDBWallet("USDT-TRC20");
        // this.getMemberWithdrawalThresho();

        !localStorage.getItem("isShowPopover") &&
            this.setState({ isShowPopover: true, isShowPopoverMask: true });
    }
    componentWillUnmount(){
        sessionStorage.removeItem("withdrawalbankList")
    }
    getMemberBanksList() {
        this.props.setLoading(true);
        GetMemberBanks((res) => {
            this.props.setLoading(false);
            if (res.isSuccess && res.result) {
                this.setState({
                    alreadyBindBanks: res.result,
                });
            }
        });
    }

    getTDBWallet(usdtType) {
        this.props.setLoading(true);
        const datas = {
            CryptoCurrencyCode: usdtType,
        };
        CheckExchangeRateWallet(datas, (res) => {
            this.props.setLoading(false);
            if (res && res.result && res.result.length) { 
                let DefaultCard = res.result.find((ele) => ele.isDefault);
                if (!DefaultCard) {
                    this.setDetaultWallet("", res.result[0]["id"], usdtType);
                }

                let notDefaultCard = res.result.filter((ele) => !ele.isDefault);
                if (notDefaultCard) {
                    let BanksArr =
                        notDefaultCard.length && DefaultCard
                            ? [DefaultCard, ...notDefaultCard]
                            : notDefaultCard.length
                            ? [...notDefaultCard]
                            : [DefaultCard];

                    this.setState({
                        ["tDBWallet" + usdtType.substr(-5)]: BanksArr,
                    });
                }
            }
        });
    }
    getMemberWithdrawalThresho = () => {
        this.props.setLoading(true);
        get(ApiPort.GetMemberWithdrawalThreshold)
            .then((res) => {
                this.props.setLoading(false);
                if (res && res.result) {
                    this.setState({
                        numberOfWithdrawals:
                            res.result.withdrawalThresholdCount,
                        withdrawalAmount: res.result.withdrawalThresholdAmount,
                        percentageLimit: res.result.threshold,
                    });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };
    showBankDetail(val) {
        this.setState({
            bankDetail: val,
            visibleDetail: true,
        });
    }

    deleteCard(id) {
        // event.domEvent.stopPropagation();
        Modal.confirm({
            icon: null,
            centered: true,
            title: translate("删除银行账户"),
            content: translate("您确定要删除您的帐户吗？"),
            okText: translate("删除"),
            cancelText: translate("不是"),
            className: "confirm-modal-of-public",
            onOk: () => {
                this.props.setLoading(true);
                this.setState({visibleDetail:false})
                del(`${ApiPort.DELETEMemberBanksDefault}${APISET}&bankId=${id}`)
                    .then((res) => {
                        if (res.isSuccess == true) {
                            message.success(translate("删除成功"));
                            this.getMemberBanksList();
                        } else {
                            message.error(translate("删除失败"));
                        }
                    })
                    .catch((error) => {
                        console.log("DELETEMemberBanksDefault" + error);
                        message.error(translate("删除失败"));
                    }).finally(()=>{
                        this.props.setLoading(false);
                    })
            },
        });
        Pushgtagdata("Deletecard_bankacc_profilepage");
    }
    setDetault(event, id) {
        if (event != "") {
            event.domEvent.stopPropagation();
        }
        this.props.setLoading(true);
        patch(`${ApiPort.PATCHMemberBanksDefault}${APISET}&bankId=${id}`)
            .then((res) => {
                if (res.isSuccess == true) {
                    message.success(translate("设置成功"));
                    this.getMemberBanksList();
                } else {
                    message.error(translate("失败"));
                }
            })
            .catch((error) => {
                console.log("PATCHMemberBanksDefault" + error);
            }).finally(()=>{
                this.props.setLoading(false);
            })

        Pushgtagdata("Default_bankacc_profilepage");
    }
    handleCancel() {
        this.setState({
            visibleExchangeRateWallet: false,
            tDBName: "",
            tDBAddress: "",
            addTDBBtnStatue: false,
        });
    }
    exchangeRateWalletTest = (e, t, type) => {
        const walleAddressTest =
            type === "USDT-ERC20"
                ? usdtERC20WalleAddressReg
                : usdtTRC20WalleAddressReg;
        
        let value = e.target.value;
        if (t == "name") {
            this.setState({ tDBName: value }, () => {
                if (!usdtWalleNameReg.test(value)) {
                    this.setState({ tDBNameError: false }, () => {
                        this.changeModalBtnStatus();
                    });
                } else {
                    this.setState({ tDBNameError: true }, () => {
                        this.changeModalBtnStatus();
                    });
                }
            });
        }
        if (t == "address") {
            this.setState({ tDBAddress: value }, () => {
                if (!walleAddressTest.test(value)) {
                    this.setState({ tDBAddressError: false }, () => {
                        this.changeModalBtnStatus();
                    });
                } else {
                    this.setState({ tDBAddressError: true }, () => {
                        this.changeModalBtnStatus();
                    });
                }
                if (!value || !usdtWalleAddressReg2.test(value)) {
                    this.setState({ tDBAddressError2: false }, () => {
                        this.changeModalBtnStatus();
                    });
                } else {
                    this.setState({ tDBAddressError2: true }, () => {
                        this.changeModalBtnStatus();
                    });
                }
            });
        }
    };
    changeModalBtnStatus() {
        const {
            tDBNameError,
            tDBAddressError,
            tDBAddress,
            tDBName,
            tDBAddressError2,
        } = this.state;
        if (
            tDBAddressError &&
            tDBNameError &&
            tDBAddress &&
            tDBName &&
            tDBAddressError2
        ) {
            this.setState({ addTDBBtnStatue: true });
        } else {
            this.setState({ addTDBBtnStatue: false });
        }
    }
    handleOk() {
        this.props.setLoading(true);
        const datas = {
            walletName: this.state.tDBName,
            walletAddress: this.state.tDBAddress,
            cryptocurrencyCode: this.state.usdtWithdrawType,
            isDefault: "false",
            passCode: this.state.verificationCode,
        };
        AddExchangeRateWallets(datas, (res) => {
            this.props.setLoading(false);
            if (res.isSuccess == true) {;
                showResultModal(translate("验证成功"),true,1501,'otp','authentication-succeeded');
                this.getTDBWallet(this.state.usdtWithdrawType);
                this.setState({
                    tDBName: "",
                    tDBAddress: "",
                    addTDBBtnStatue: false,
                });
            } else if (res.isSuccess == false) {
                if (res.walletAddressErrorList?.length) {
                    showResultModal(res.walletAddressErrorList[0].Description || translate("验证失败"),false,1501,'otp','authentication-succeeded');
                } else if (res.walletNameErrorList?.length) {
                    showResultModal(res.walletNameErrorList[0].Description || translate("验证失败"),false,1501,'otp','authentication-succeeded');
                } else {
                    showResultModal(res.message || translate("验证失败"),false,1501,'otp','authentication-succeeded');
                }
            }
        });
    }
    addExchangeRateWallets() {
        this.setState({ visibleExchangeRateWallet: true });
    }
    copyEvent() {
        message.success(translate("复制成功"))
    }
    setDetaultWallet(event, id, type) {
        event != "" && event.domEvent.stopPropagation();
        this.props.setLoading(true);
        const datas = {
            WalletID: id,
        };
        setTDBDefaultWallet(datas, (res) => {
            this.props.setLoading(false);
            if (res.isSuccess == true) {
                message.success(translate("设置成功"));
                this.getTDBWallet(type);
            } else {
                message.error(translate("失败"), false);
            }
        });
        Pushgtagdata("Default_TDBWallet_profilepage");
    }

    openNoticeOTP() {
        Modal.confirm({
            className: "confirm-modal-of-public",
            title: translate("帐户验证"),
            icon: null,
            centered: true,
            okText: translate("立即验证"),
            cancelText: translate("取消"),
            content: (
                <div style={{ textAlign: "left" }}>
                    {translate("为保证您的账户安全，请在添加钱包地址前完成手机号码验证。")}
                </div>
            ),
            onOk: () => {
                this.setState({ phoneVisible: true });
                Pushgtagdata("Continue_TTH_Crypto");
            },
            onCancel: () => {
                Pushgtagdata("Leave_TTH_Crypto");
            },
        });
    }

    setAttemptRemaining = (e) => {
        // 修改剩餘次數
        this.setState({
            checkAbleSmsOTP: { ...this.state.checkAbleSmsOTP, attempts: e },
        });
    };

    /**
     * 控制驗證彈窗，phone驗證，錢包,超過次數
     * @param {*} PhoneParam  开关 phone 验证窗口
     * @param {*} walletVisible     开关添加钱包窗口
     * @param {*} exceed    开关限制窗口
     */
    VerifyStatus = (PhoneParam, walletVisible, exceed) => {
        this.setState({
            phoneVisible: PhoneParam,
            visibleExchangeRateWallet: walletVisible,
            exceedVisible: exceed,
        });
    };

    leaveWalletButtonHandle(pram) {
        console.log("🚀 ~ file: index.js:406 ~ BankAccount ~ leaveWalletButtonHandle ~ pram:", pram)
        // 離開添加錢包控制
        if (pram) {
            this.setState({ leaveAddWalletVisible: false });
            Pushgtagdata("Continue_TTH_Crypto");
        } else {
            Pushgtagdata("Leave_TTH_Crypto");
            this.setState({
                leaveAddWalletVisible: false, // 再次確認是否離開添加錢包
                visibleExchangeRateWallet: false,
                tDBName: "",
                tDBAddress: "",
                addTDBBtnStatue: false,
                tDBNameError: false,
                tDBAddressError: false,
                tDBAddressError2:false
            });
        }
    }

    /**
     * 查询会员是否能够请求短信OTP
     * @param {*} type  usdt
     * @param {*} typekey  usdt 类型
     * @param {*} callback  短信和语言切换查询完次数后请求发送验证码
     */
    judgeOTPVerification(type,typekey,cb,callback) {
        this.props.setLoading(true);
        get(ApiPort.CheckIsAbleSmsOTP)
            .then((res) => {
                if (res?.isSuccess && res?.result?.isAbleSmsOTP && res?.result?.attempts) {
                    this.setState({
                        usdtWithdrawType: typekey,
                        checkAbleSmsOTP: {
                            isAbleSmsOTP: res.result.isAbleSmsOTP,
                            attempts: res.result.attempts,
                        },
                        visibleExchangeRateWallet: true
                    });
                    typeof callback === "function" && callback(res.result.attempts)
                } else {
                    this.setState({
                        phoneVisible: false,
                        exceedVisible: true,
                        usdtWithdrawType: typekey,
                    });
                }
            }).catch((error) => {
                console.log("查询会员是否能够请求短信OTP:",error);
            }).finally(()=>{
                this.props.setLoading(false);
            })
    }

    getVerificationCode(v) {
        this.setState({ verificationCode: v },()=>{this.handleOk()});
    }

    render() {
        const {
            alreadyBindBanks,
            tDBWalletERC20,
            tDBWalletTRC20,
            visibleExchangeRateWallet,
            addTDBBtnStatue,
            tDBName,
            tDBAddress,
            tDBNameError,
            tDBAddressError,
            tDBAddressError2,
            checkAbleSmsOTP,
            phoneVisible,
            memberInfo,
            exceedVisible,
            isLoading,
            numberOfWithdrawals,
            withdrawalAmount,
            percentageLimit,
        } = this.state;
        const memberWithdrawalThresho = {
            numberOfWithdrawals,
            withdrawalAmount,
            percentageLimit,
        };
        return (
            <div className="account-wrap">
                {this.state.isShowPopoverMask ? (
                    <div
                        className="usercenter-mask transparent"
                        onClick={() => {
                            localStorage.setItem("isShowPopover", "true");
                            this.setState({
                                isShowPopover: false,
                                isShowPopoverMask: false,
                            });
                        }}
                    />
                ) : null}
                <h2>
                    {translate("银行和钱包")}
                    {/* <a
						className="usercenter-title-link"
						onClick={() => {
							Router.push("/help?type=2&key=" + CMSOBJ[HostConfig.CMS_ID][31]);
							Pushgtagdata("Tutorial_bankacc_profilepage");
						}}
					>
						查看操作教学
					</a> */}
                </h2>

                <p className="home-section-title">{translate("银行账户(大写)")}</p>
                {/* <div className="bank-account-limit">
                    <p>
                        <span>
                            银行账户限额设置​{" "}
                            <Popover
                                visible={this.state.isShowPopover}
                                onMouseEnter={() => {
                                    this.setState({ isShowPopover: true });
                                }}
                                onMouseLeave={() => {
                                    this.timer = setTimeout(() => {
                                        this.setState({ isShowPopover: false });
                                    }, 100);
                                }}
                                content={
                                    <div
                                        style={{ maxWidth: 400 }}
                                        onMouseEnter={() => {
                                            clearTimeout(this.timer);
                                            this.setState({
                                                isShowPopover: true,
                                            });
                                        }}
                                        onMouseLeave={() => {
                                            this.setState({
                                                isShowPopover: false,
                                            });
                                        }}
                                    >
                                        限额设置适用于所有提款银行账户。例：
                                        <br />
                                        提款次数= 50, <br />
                                        提款金额= 100,000
                                        <br />
                                        限额百分比= 50％
                                        <br />
                                        当您成功提款25笔或提款总额达50,000元人民币至同一银行账户时,
                                        系统将会提醒您注意账户安全，建议您添加或更换新的银行账户。
                                    </div>
                                }
                                placement="bottomLeft"
                                title=""
                                overlayClassName="popover-dark"
                                trigger="hover"
                            >
                                <span className="question-popover-tip">
                                    <img
                                        style={{ paddingBottom: "0.2rem" }}
                                        src={`${process.env.BASE_PATH}/img/icon/exclamationBlue.svg`}
                                    />
                                </span>
                                <span>&nbsp;</span>
                            </Popover>
                        </span>

                        <span
                            onClick={() => {
                                this.setState({ isShowbankAccountLimit: true });
                            }}
                        >
                            <img src={`${process.env.BASE_PATH}/img/icon/editIcon.svg`} />
                        </span>
                    </p>
                    <p>
                        <span>提款次数</span>
                        <span>{numberOfWithdrawals}次</span>
                    </p>
                    <p>
                        <span>提款金额</span>
                        <span>¥{formatAmount(withdrawalAmount)}</span>
                    </p>
                    <p>
                        <span>限额百分比</span>
                        <span>{percentageLimit}%</span>
                    </p>
                </div> */}
                {Array.isArray(alreadyBindBanks) && alreadyBindBanks.length ? 
                    (
                        <React.Fragment>
                            <div
                                className="bank-list-wrap"
                                style={{
                                    height:
                                        alreadyBindBanks.length < 3
                                            ? "150px"
                                            : "300px",
                                }}
                            >
                                {alreadyBindBanks.map((val, index) => {
                                    return (
                                        <div
                                            key={`bankitem${index}`}
                                            className={`bank-list-item`}
                                        >
                                            <div className="bank-img inline-block">
                                                <img
                                                    src={
                                                        `${process.env.BASE_PATH}/img/bank/${val.englishName
                                                        ? val.englishName.toUpperCase().replace(/[^0-9a-zA-Z]/ig, '')
                                                        : "generic"
                                                        }.png`
                                                    }
                                                />
                                            </div>
                                            <div className="bank-info inline-block">
                                                <h3>{val.bankName}</h3>
                                                <div className="bank-number">
                                                    {val.accountNumber.replace(/\d(?=\d{3})/g,"*")}
                                                </div>
                                            </div>
                                            <div className="bank-backgroundImg">
                                                {/* <Dropdown
													placement="bottomRight"
													overlayClassName="remove-promo-wrap small"
													overlay={
														<Menu
															onClick={(item) => {
																item.key === "1"
																	? this.setDetault(item, val.bankAccountID)
																	: this.deleteCard(item, val.bankAccountID);
															}}
														>
                                                        {val.isDefault ? ''  : <Item key="1">设为默认</Item>} <Item key="2">删除卡片</Item>
														</Menu>
													}
												>
													<Icon type="setting" />
												</Dropdown> */}
                                                <div className="bank-background"></div>
                                            </div>
                                            <div className="bank-details">
                                                {val.isDefault ? (
                                                    <p className="default">
                                                        <img
                                                            style={{
                                                                marginRight:
                                                                    "0.4rem",
                                                            }}
                                                            src={`${process.env.BASE_PATH}/img/icon/whiteTick.svg`}
                                                        />
                                                        {translate("默认")}
                                                    </p>
                                                ) : (
                                                    <p
                                                        onClick={() => {
                                                            this.setDetault(
                                                                "",
                                                                val.bankAccountID
                                                            );
                                                        }}
                                                        className="default"
                                                        style={{
                                                            color: "#62c9ff",
                                                            background: "white",
                                                            borderRadius:
                                                                "10px",
                                                            width: "105px",
                                                            lineHeight:
                                                                "24px",
                                                        }}
                                                    >
                                                        {translate("设置默认")}
                                                    </p>
                                                )}
                                                <div
                                                    className="default bdetail"
                                                    onClick={() => {
                                                        this.showBankDetail(val);
                                                    }}
                                                >
                                                    <img
                                                        src={`${process.env.BASE_PATH}/img/icon/arrow.svg`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {/* {alreadyBindBanks.length < 5 ? ( */}
                                    <div
                                        className="add-wallet-item"
                                        onClick={() => {
                                            this.setState({
                                                showAddCard: true,
                                            });
                                            Pushgtagdata(
                                                "Addbankcard_bankacc_profilepage"
                                            );
                                        }}
                                    >
                                        <p><Icon type="plus" />{" "}{translate("添加银行账户")}</p>
                                    </div>
                                {/* ) : null} */}
                            </div>
                            {/* <p className="walletTips">
                                {translate("您最多可以添加 5 张银行卡。 如果您需要删除银行卡，请联系")}
                                <span
                                    type="link"
                                    className="chatCs"
                                    onClick={() => {
                                        global.PopUpLiveChat();
                                        Pushgtagdata(
                                            "Contactcs_passcode_profilepage"
                                        );
                                    }}
                                >
                                    {translate("在线客服")}
                                </span>
                            </p> */}
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <div
                                className="bank-list-wrap"
                                style={{ height: "150px" }}
                            >
                                <div
                                    className="add-wallet-item"
                                    onClick={() => {
                                        this.setState({ showAddCard: true });
                                        Pushgtagdata(
                                            "Addbankcard_bankacc_profilepage"
                                        );
                                    }}
                                >
                                    <p><Icon type="plus" />{" "}{translate("添加银行账户")}</p>
                                </div>
                            </div>
                            <p className="walletTips">
                                {translate("您最多可以添加 5 张银行卡。 如果您需要删除银行卡，请联系")}
                                <span
                                    type="link"
                                    className="chatCs"
                                    onClick={() => {
                                        global.PopUpLiveChat();
                                        Pushgtagdata(
                                            "Contactcs_passcode_profilepage"
                                        );
                                    }}
                                >
                                    {translate("在线客服")}
                                </span>
                            </p>
                        </React.Fragment>
                    ) 
                }
                {this.state.showAddCard && <AddBankCard
                    visible={this.state.showAddCard}
                    closeModal={() => {
                        this.setState({ showAddCard: false });
                    }}
                    getMemberBanksList={this.getMemberBanksList}
                    alreadyBindBanks={alreadyBindBanks}
                />}
                <p className="home-section-title">{translate("泰达币 ERC20 提款​钱包")}</p>
                {Array.isArray(tDBWalletERC20) ? (
                    tDBWalletERC20.length ? (
                        <React.Fragment>
                            <div
                                className="bank-list-wrap"
                                style={{ overflow: "hidden" }}
                            >
                                <Spin spinning={isLoading}>
                                    {tDBWalletERC20.map((val, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className={`wllet-list-item ${val.memberCode}`}
                                            >
                                                <div className="bank-img inline-block">
                                                    <img
                                                        src={`${process.env.BASE_PATH}/img/wallet/icon-tether@2x.png`}
                                                    />
                                                </div>
                                                <div className="bank-info inline-block">
                                                    <h3>{val.walletName}</h3>
                                                    <div className="bank-number">
                                                        {val.walletAddress}
                                                    </div>
                                                </div>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "space-between",
                                                    }}
                                                >
                                                    {val.isDefault ? (
                                                        <p className="default">
                                                            <img
                                                                style={{
                                                                    marginRight:
                                                                        "0.4rem",
                                                                }}
                                                                src={`${process.env.BASE_PATH}/img/icon/whiteTick.svg`}
                                                            />
                                                            {translate("默认")}
                                                        </p>
                                                    ) : (
                                                        <p
                                                            onClick={() => {
                                                                this.setDetaultWallet(
                                                                    "",
                                                                    val.id,
                                                                    "USDT-ERC20"
                                                                );
                                                            }}
                                                            className="default"
                                                            style={{
                                                                color: "#62c9ff",
                                                                background:
                                                                    "white",
                                                                borderRadius:
                                                                    "10px",
                                                                width: "105px",
                                                                lineHeight:
                                                                    "24px",
                                                                textAlign:
                                                                    "center",
                                                            }}
                                                        >
                                                            {translate("设置默认")}
                                                        </p>
                                                    )}
                                                    <CopyToClipboard
                                                        text={val.walletAddress}
                                                        onCopy={this.copyEvent}
                                                    >
                                                        <img
                                                            style={{
                                                                marginRight:
                                                                    "0.4rem",
                                                            }}
                                                            src={`${process.env.BASE_PATH}/img/icon/copyIcon.svg`}
                                                        />
                                                    </CopyToClipboard>
                                                </div>
                                                {/* <CopyToClipboard text={val.walletAddress} onCopy={this.copyEvent}>
													<img style={{marginRight: '0.4rem'}} src={`${process.env.BASE_PATH}/img/icon/copyIcon.svg`} />
												</CopyToClipboard> */}
                                                {/* <Dropdown
													placement="bottomRight"
													overlayClassName="remove-promo-wrap small"
													overlay={
														<Menu
															onClick={(item) => {
																item.key === "1" ? this.setDetaultWallet(item, val.id, "USDT-ERC20") : null;
															}}
														>
															<Item key="1">设为默认</Item>
														</Menu>
													}
												>
													<Icon type="setting" />
												</Dropdown> */}
                                            </div>
                                        );
                                    })}
                                    {tDBWalletERC20.length < 3 ? (
                                        <div
                                            className="add-wallet-item"
                                            onClick={() => {
                                                this.judgeOTPVerification(
                                                    "usdt",
                                                    "USDT-ERC20"
                                                );
                                            }}
                                        >
                                            <p><Icon type="plus" /> {translate("添加泰达币 ERC20 提款​钱包")}</p>
                                        </div>
                                    ) : null}
                                </Spin>
                            </div>
                        </React.Fragment>
                    ) : (
                        <div
                            className="add-wallet-item"
                            onClick={() => {
                                this.judgeOTPVerification("usdt","USDT-ERC20");
                            }}
                        >
                            <p><Icon type="plus" /> {translate("添加泰达币 ERC20 提款​钱包")}</p>
                        </div>
                    )
                ) : null}

                <p
                    className="walletTip"
                    style={{
                        borderBottom: "1px solid #f0f0f0",
                        paddingBottom: "1em",
                    }}
                >
                    {translate("您最多可以添加 3 个钱包地址。 如果您需要删除钱包地址，请联系")}
                    <span
                        type="link"
                        className="chatCs"
                        onClick={() => {
                            global.PopUpLiveChat();
                            Pushgtagdata("Contactcs_passcode_profilepage");
                        }}
                    >
                        {translate("在线客服")}
                    </span>
                </p>
                <p className="home-section-title">{translate("泰达币 TRC20 提款​钱包")}</p>
                {Array.isArray(tDBWalletTRC20) ? (
                    tDBWalletTRC20.length ? (
                        <React.Fragment>
                            <div
                                className="bank-list-wrap"
                                style={{ overflow: "hidden" }}
                            >
                                <Spin spinning={isLoading}>
                                    {tDBWalletTRC20.map((val, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className={`wllet-list-item ${val.memberCode}`}
                                            >
                                                <div className="bank-img inline-block">
                                                    <img
                                                        src={`${process.env.BASE_PATH}/img/wallet/icon-tether@2x.png`}
                                                    />
                                                </div>
                                                <div className="bank-info inline-block">
                                                    <h3>{val.walletName}</h3>
                                                    <div className="bank-number">
                                                        {val.walletAddress}
                                                    </div>
                                                </div>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "space-between",
                                                    }}
                                                >
                                                    {val.isDefault ? (
                                                        <p className="default">
                                                            <img
                                                                style={{
                                                                    marginRight:
                                                                        "0.4rem",
                                                                }}
                                                                src={`${process.env.BASE_PATH}/img/icon/whiteTick.svg`}
                                                            />
                                                            {translate("默认")}
                                                        </p>
                                                    ) : (
                                                        <p
                                                            onClick={() => {
                                                                this.setDetaultWallet(
                                                                    "",
                                                                    val.id,
                                                                    "USDT-TRC20"
                                                                );
                                                            }}
                                                            className="default"
                                                            style={{
                                                                color: "#62c9ff",
                                                                background:
                                                                    "white",
                                                                borderRadius:
                                                                    "10px",
                                                                width: "105px",
                                                                lineHeight:
                                                                    "24px",
                                                                textAlign:
                                                                    "center",
                                                            }}
                                                        >
                                                            {translate("设置默认")}
                                                        </p>
                                                    )}
                                                    <CopyToClipboard
                                                        text={val.walletAddress}
                                                        onCopy={this.copyEvent}
                                                    >
                                                        <img
                                                            style={{
                                                                marginRight:
                                                                    "0.4rem",
                                                            }}
                                                            src={`${process.env.BASE_PATH}/img/icon/copyIcon.svg`}
                                                        />
                                                    </CopyToClipboard>
                                                </div>

                                                {/* <Dropdown
													placement="bottomRight"
													overlayClassName="remove-promo-wrap small"
													overlay={
														<Menu
															onClick={(item) => {
																item.key === "1" ? this.setDetaultWallet(item, val.id, "USDT-TRC20") : null;
															}}
														>
															<Item key="1">设为默认</Item>
														</Menu>
													}
												>
													<Icon type="setting" />
												</Dropdown> */}
                                            </div>
                                        );
                                    })}
                                    {tDBWalletTRC20.length < 3 ? (
                                        <div
                                            className="add-wallet-item"
                                            onClick={() => {
                                                this.judgeOTPVerification(
                                                    "usdt",
                                                    "USDT-TRC20"
                                                );
                                            }}
                                        >
                                            <p><Icon type="plus" /> {translate("添加泰达币 TRC20 提款​钱包")}</p>
                                        </div>
                                    ) : null}
                                </Spin>
                            </div>
                        </React.Fragment>
                    ) : (
                        <div
                            className="add-wallet-item"
                            onClick={() => {
                                this.judgeOTPVerification("usdt","USDT-TRC20");
                            }}
                        >
                            <p><Icon type="plus" /> {translate("添加泰达币 TRC20 提款​钱包")}</p>
                        </div>
                    )
                ) : null}

                <p className="walletTip">
                    {translate("您最多可以添加 3 个钱包地址。 如果您需要删除钱包地址，请联系")}
                    <span
                        type="link"
                        className="chatCs"
                        onClick={() => {
                            global.PopUpLiveChat();
                            Pushgtagdata("Contactcs_passcode_profilepage");
                        }}
                    >
                        {translate("在线客服")}
                    </span>
                </p>
                
                {/* 添加usdt钱包的电话验证，目前只需验证电话 */}
                <PhoneVerify
                    memberInfo={memberInfo && memberInfo}
                    visible={phoneVisible}
                    closeModal={() => this.setState({ phoneVisible: false })}
                    otpParam={`cry-otp`}
                    changeVerify={this.VerifyStatus}
                    attemptRemaining={checkAbleSmsOTP.attempts}
                    setAttemptRemaining={this.setAttemptRemaining}
                    usdtWithdrawType={this.state.usdtWithdrawType}
                    judgeOTPVerification={this.judgeOTPVerification}
                    getVerificationCode={this.getVerificationCode}
                />

                <ExceedVerify // otp 超過次數彈窗
                    exceedVisible={exceedVisible}
                    onCancel={() => {
                        this.setState({ exceedVisible: false });
                        setTimeout(() => {
                            global.globalExit();
                        }, 1500)
                    }}
                />

                <AddWalletAddress // 添加 USDT 钱包地址
                    visibleExchangeRateWallet={visibleExchangeRateWallet}
                    leaveAddWallet={() =>
                        this.setState({ leaveAddWalletVisible: true })
                    }
                    exchangeRateWalletTest={this.exchangeRateWalletTest}
                    handleOk={this.openNoticeOTP}
                    ctcMethod={this.state.usdtWithdrawType}
                    addTDBBtnStatue={addTDBBtnStatue}
                    tDBName={tDBName}
                    tDBAddress={tDBAddress}
                    tDBNameError={tDBNameError}
                    tDBAddressError={tDBAddressError}
                    tDBAddressError2={tDBAddressError2}
                />

                <Modal // 再次確認是否離開添加錢包;因為oncancel要求要與onOK一樣保留彈窗，故不使用modal.confirm
                    centered={true}
                    title={translate("帐户验证")}
                    footer={null}
                    maskClosable={false}
                    onCancel={this.leaveWalletButtonHandle.bind(this, true)}
                    visible={this.state.leaveAddWalletVisible}
                    width={400}
                    className="leaveAddWalletModal"
                >
                    <div className="content">
                        {translate("为保证您的账户安全，请在添加钱包地址前完成手机号码验证。")}
                    </div>
                    <div className="buttonWrap">
                        <Button
                            onClick={this.leaveWalletButtonHandle.bind(
                                this,
                                false
                            )}
                        >
                            {translate("取消")}
                        </Button>
                        <Button
                            onClick={this.leaveWalletButtonHandle.bind(
                                this,
                                true
                            )}
                        >
                            {translate("立即验证")}
                        </Button>
                    </div>
                </Modal>

                <BankAccountModals
                    visible={this.state.isShowbankAccountLimit}
                    closeModal={(v, initialValue) => {
                        this.setState({ isShowbankAccountLimit: v });
                        if (initialValue) {
                            initialValue();
                        }
                    }}
                    memberWithdrawalThresho={memberWithdrawalThresho}
                    getMemberWithdrawalThresho={this.getMemberWithdrawalThresho}
                />
                {this.state.visibleDetail && (
                    <BankWithdrawalDetails
                        visible={this.state.visibleDetail}
                        closeModal={(v) => {
                            this.setState({ 
                                visibleDetail: v,
                                bankDetail:{}
                            });
                        }}
                        itemBankDetail={this.state.bankDetail}
                        setIsLoading={(v) => {
                            this.props.setLoading(v);
                        }}
                        deleteCard={this.deleteCard}
                    />
                )}
            </div>
        );
    }
}

export default BankAccount;
