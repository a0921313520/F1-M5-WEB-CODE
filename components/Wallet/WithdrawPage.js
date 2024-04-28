import React from "react";
import Router from 'next/router';
import { Modal,  message } from "antd";
import HostConfig from "$ACTIONS/Host.config";
import { get, post } from "$ACTIONS/TlcRequest";
import {ApiPort, APISETS } from "$ACTIONS/TLCAPI";
const { LocalHost, HostApi } = HostConfig.Config;
import { connect } from "react-redux";
import { userCenterActions } from "$STORE/userCenterSlice";
import HeadBlance from "./HeadBlance";
import WithdrawLesson from "../WithdrawLesson";
import Withdrawal from "central-payment/Main/Web/M23/Withdrawal";
import {setFEWalletParams,getFEWalletParams} from "central-payment/platform.pay.config";
// import Withdrawal from "../../Central-Payment/Main/Web/M23/Withdrawal";
// import { setFEWalletParams,getFEWalletParams } from '../../Central-Payment/platform.pay.config';
import Announcement from '@/Announcement/';
import { translate } from "$ACTIONS/Translate";
import AddWalletAddress from "@/BankAccount/AddWalletAddress";
import {usdtWalleNameReg, usdtERC20WalleAddressReg, usdtTRC20WalleAddressReg, usdtWalleAddressReg2} from "$ACTIONS/reg";
import PhoneVerify from '@/Verification/PhoneVerify';
import ExceedVerify from '@/OTP/ExceedVerify';
import AddBankCard from "@/BankAccount/AddBankCard";
import {AddExchangeRateWallets} from "$DATA/wallet";
import { getMemberInfo } from "$DATA/userinfo";
import AccountVerification from "./withdrawComponents/AccountVerification"; //提款验证（Email/Phone）考虑到可能后续会有其他的信息验证所以单独写,不放在otp验证里面

class WithdrawPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            withdrawMethods:[],    //api返回的提款的方式
            currentWithdrawKey:"", //当前选择提款方式: LB / CCW
            visibleExchangeRateWallet: false, //添加泰达币钱包
            leaveAddWalletVisible: false,
            addTDBBtnStatue: false, //泰达币添加钱包按钮状态
            tDBName:"",
            tDBAddress: "",
            tDBNameError: false,
            tDBAddressError: false,
            tDBAddressError2: false,
            ctcMethod: "", // 当前USDT提款类型
            showAddCard: false, //添加银行卡
            phoneVisible: false,
            checkAbleSmsOTP: {
				isAbleSmsOTP: false, //OTP驗證
				attempts: 5 // 剩餘次數
			},
            toAccountVerification: false,
            withdrawalVerifyStep:-1,
            exceedVisible: false
        };
        this.isChooseNotHint = false;  // USDT提款汇率提示不再显示单选项值
        this.tdbfunction = {}
        const { setLoading } = this.props;
        const apis = APISETS.slice(1);
        this.privateParams = {
            device: 'WEB',
            platformType: 'F1',
            languageType: 'M3',
            domainName: LocalHost,
            LocalHost:LocalHost,
            siteId: 40,
            ActiveMethods: '',//指定存款,默认第一个
            bonusId: '',
            firstName: 'zzz',
            BackClick: () => { 
                this.props.onCancel();
            },
            LivechatClick: () => { global.PopUpLiveChat() },
            AddBankClick: () => {},
            HistoryClick: () => {this.navigationPage("records") },
            ApiGet: (url) => (get(HostApi + url + apis)),
            ApiPost: (url, postdata = '') => (post(HostApi + url + apis, postdata)),
            goVerifyContact: () => {this.verifyContact() },
            goFinishKYCInfo: () => {this.navigationPage("uploadFiles")},
            goFinishMemberInfo: () => {console.log("goFinishMemberInfo-withdraw")},
            goDeposit: () => {this.props.goDeposit("deposit")},
            goAddBankInfo: (type="",typekey="",callback=()=>{}) => {this.addBankCard(type,typekey,callback)},
            goRecord: () => {this.navigationPage("records")},
            toastTip: {
                loading: () => { setLoading && setLoading(true) },
                hide: () => { setLoading && setLoading(false) },
                success: (msg) => { message.success(msg) },
                error: (msg) => { message.error(msg) },
            },
            modalTip: {
                info: (data={closable:false}) => {
                    Modal.info({
                        icon: null,
                        centered: true,
                        title: data?.title,
                        className: "confirm-modal-of-public confirm-modal-of-forgetuser",
                        closable: data?.closable,
                        content: (
                            <div style={{ textAlign: "center" }}>
                                {data?.children}
                            </div>
                        ),
                        okText: data?.okBtnTxt,
                        cancelText: data?.noBtnTxt,
                        onOk: () => {
                            data?.okFunction && typeof data.okFunction === "function" && data.okFunction()
                        },
                        onCancel: () => {
                            data?.noFunction && typeof data.noFunction === "function" && data.noFunction()
                        }
                    });
                },
                confirm: (data={}) => {
                    const textAlignStyle = data?.children?.type?.name === "PhoneEmailVerification" ? "left" :"center"
                    Modal.confirm({
                        icon: null,
                        centered: true,
                        title: data?.title,
                        className:`confirm-modal-of-public ${textAlignStyle === "left" ? "withdraw-confirm-modal" :""}`,
                        closable: data?.closable,
                        content: (
                            <div style={{ textAlign: textAlignStyle }}>
                                {data?.children}
                            </div>
                        ),
                        okText: data?.okBtnTxt,
                        cancelText: data?.noBtnTxt,
                        onOk: () => {
                            data?.okFunction && typeof data.okFunction === "function" && data.okFunction()
                        },
                        onCancel: () => {
                            data?.noFunction && typeof data.noFunction === "function" && data.noFunction()
                        }
                    })
                }
            },
            webPiwikEvent:() => {},
            webPiwikUrl: () => {},
            appPiwikEvent: () => {},
            appPiwikUrl: () => {},
        }
        setFEWalletParams(this.privateParams)
    }
    componentDidMount() {
        this.correctMemberInfo(null,false)
    }
    componentDidUpdate(prevProps, prevState) {
        if(
            prevState.withdrawMethods !== this.state.withdrawMethods && 
            Array.isArray(this.state.withdrawMethods) &&
            this.state.withdrawMethods.length
        ){
            this.props.setWithdrawList(this.state.withdrawMethods,this.state.currentWithdrawKey)
        }

        if(prevProps.currentWithdrawKey !== this.props.currentWithdrawKey && this.props.currentWithdrawKey){
            this.payMethodChange(this.props.currentWithdrawKey)
            this.tdbfunction = {};
        }
    }
    componentWillUnmount() {
        this.setState = () => false;
        this.privateParams = null;
        getFEWalletParams();
        this.tdbfunction = {}
    }

    navigationPage=(key)=>{
        switch(key){
            case "records":
                if (~global.location.pathname.indexOf("/vn/transaction-record")) {
                    this.props.setRefreshCurrentPage("withdraw");
                    this.props.onCancel();
                } else {
                    this.props.changeUserCenterTabKey(key);
                    Router.push("/transaction-record");
                }
                break;
            case "uploadFiles":
                this.props.changeUserCenterTabKey(key);
                Router.push("/me/upload-files");
                break;
            default:
                break;
        }
        this.props.onCancel && typeof this.props.onCancel === "function" && this.props.onCancel()
    }
    leaveWalletButtonHandle(pram) {
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
            });
        }
    }
    handleOk() {
        this.props.setLoading(true);
        this.setState({ visibleExchangeRateWallet: false });
        const datas = {
            WalletName: this.state.tDBName,
            WalletAddress: this.state.tDBAddress,
            CryptocurrencyCode: this.state.ctcMethod,
            IsDefault: "false",
            passCode: this.state.verificationCode,
        };
        AddExchangeRateWallets(datas, (res) => {
            this.props.setLoading(false);
            if (res.isSuccess == true) {
                message.success(translate("设置成功"));
                typeof this.tdbfunction === "function" && this.tdbfunction(this.state.ctcMethod);
                this.setState({
                    tDBName: "",
                    tDBAddress: "",
                    addTDBBtnStatue: false,
                    tDBAddressError:false,
                    tDBAddressError2:false,
                    tDBNameError:false,
                    visibleExchangeRateWallet:false
                });
            } else if (res.isSuccess == false) {
                if (res.walletAddressErrorList.length) {
                    message.error(
                        res.walletAddressErrorList[0].description
                    );
                } else if (res.walletNameErrorList.length) {
                    message.error(res.walletNameErrorList[0].description);
                } else {
                    message.error(res.message);
                }
            }
        });
    }
    addBankCard =(type,typekey,callback)=> {
        if(!type) return
        type === "bank" && this.addBankCardModal(type) 
        type === "usdt" && this.judgeOTPVerification(type,typekey,callback)
    }
    /**
     * 添加银行卡
     */
     addBankCardModal=(type) => {
        this.setState({showAddCard: true})
    }
    /**
     * 添加usdt 钱包
     * @param {string} type usdt
     * @param {string} typekey trc20/erc20
     * @param {function} callback callback 
     */
    addExchangeRateWallets =(type,typekey,callback)=> {
        console.log("🚀 ~ file: WithdrawPage.js:274 ~ WithdrawPage ~ addExchangeRateWallets ~ type,typekey,callbac:", type,typekey,callback)
        this.setState({ 
            visibleExchangeRateWallet: true,
            ctcMethod:typekey,
        });
        this.tdbfunction = callback;
    }

    VerifyStatus = (PhoneParam, walletVisible, exceed) => {
        // 控制驗證彈窗，phone驗證，錢包,超過次數
        this.setState({
            phoneVisible: PhoneParam,
            visibleExchangeRateWallet: walletVisible,
            exceedVisible: exceed,
        });
    };
    exchangeRateWalletTest = (e, t) => {
        const walleAddressTest =
            this.state.ctcMethod === "USDT-ERC20"
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
        const { tDBNameError, tDBAddressError, tDBAddress, tDBName } = this.state;
        if (tDBAddressError && tDBNameError && tDBAddress && tDBName) {
            this.setState({ addTDBBtnStatue: true });
        } else {
            this.setState({ addTDBBtnStatue: false });
        }
    }
    handleCancelModal = () => {
        this.setState({ lessonModal: false });
    };


    /**
     * 查询会员是否能够请求验证OTP
     * @param {*} type usdt
     * @param {*} typekey   类型ERC20/TRC20
     * @param {*} callback  添加完后更新usdt钱包列表
     * @param {*} call  短信和语言切换查询完次数后请求发送验证码
     */
    judgeOTPVerification =(type,typekey,callback,call)=> {
		this.props.setLoading(true);
		get(ApiPort.CheckIsAbleSmsOTP)
			.then((res) => {
				if (res?.isSuccess  && res?.result?.isAbleSmsOTP && res?.result?.attempts) {
                    this.setState({
                        checkAbleSmsOTP: {
                            isAbleSmsOTP: res.result.isAbleSmsOTP,
                            attempts: res.result.attempts
                        },
                    });
                    //开启添加usdt地址窗口
                    type && typekey && callback && typeof callback === "function" && this.addExchangeRateWallets(type,typekey,callback)
                    //短信和语言切换查询完次数后 call
                    typeof call === "function" && call(res.result.attempts)
				} else {
                    this.setState({
                        exceedVisible: true,
                        phoneVisible: false,
                        usdtWithdrawType: typekey,
                    });
                }
			})
			.catch((error) => {
				console.log("查询会员是否能够请求验证OTP:",error);
			}).finally(()=>{
                this.props.setLoading(false);
            })
	}

    openNoticeOTP =()=> {
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

    // 修改剩餘次數
    setAttemptRemaining = (e) => {
		this.setState({
			checkAbleSmsOTP: { ...this.state.checkAbleSmsOTP, attempts: e }
		});
	};
    getVerificationCode =(v)=> {
		this.setState({ verificationCode: v },()=>{
            this.handleOk()
        });
	}
    verifyContact=() => {
        const {memberInfo} = this.props;
        console.log("🚀 ~ file: WithdrawPage.js:360 ~ WithdrawPage ~ memberInfo:", memberInfo)
        if(memberInfo && memberInfo.withdrawalVerifyStep){
            this.setState({
                toAccountVerification: true,
                withdrawalVerifyStep: memberInfo.withdrawalVerifyStep
            })
        }
    }

    correctMemberInfo =(call,status=true)=> {
        status && this.props.setLoading(true);
        getMemberInfo((res) => {
            this.props.setMemberInfo(res);
            status && this.props.setLoading(false);
            typeof call === "function" && call();
            this.setState({
                withdrawalVerifyStep: res.withdrawalVerifyStep
            })
        }, true);
    }

    render() {
        const {
            visibleExchangeRateWallet,
            addTDBBtnStatue,
            tDBName,
            tDBAddress,
            tDBNameError,
            tDBAddressError,
            ctcMethod,
            tDBAddressError2,
            currentWithdrawKey,
            phoneVisible,
            checkAbleSmsOTP,
            showAddCard,
            lessonModal,
            toAccountVerification,
            withdrawalVerifyStep
        } = this.state;
            console.log("🚀 ~ file: WithdrawPage.js:405 ~ WithdrawPage ~ render ~ checkAbleSmsOTP:", checkAbleSmsOTP)
        const {
            memberInfo
        } = this.props;
        return (
            <React.Fragment>
                {/* {currentWithdrawKey == "CCW" && (
                    <a
                        className="deposit-help-link"
                        onClick={() => {
                            this.setState({ lessonModal: true });
                        }}
                    >
                        {translate("提款说明")}
                    </a>
                )} */}
                <HeadBlance setLoading={this.props.setLoading}/>
                <Withdrawal
                    setCurrKey={
                        (key)=>{this.setState({currentWithdrawKey:key})}
                    }
                    setPayMethods={
                        (list)=>{this.setState({withdrawMethods: list})}
                    }
                    setPayMethodChange={
                        (run)=>{this.payMethodChange = run}
                    }
                    
                />
              
                {/* <Modal
                    title={translate("加密货币提款说明")}
                    footer={null}
                    maskClosable={true}
                    onCancel={this.handleCancelModal}
                    visible={lessonModal}
                    width={600}
                    centered
                    closable={false}
                >
                    <WithdrawLesson onhandleCancel={this.handleCancelModal} />
                </Modal> */}

                <Announcement
					optionType="Withdrawal"
				/>

                <AddWalletAddress
                    visibleExchangeRateWallet={visibleExchangeRateWallet}
                    leaveAddWallet={() =>
                        this.setState({ visibleExchangeRateWallet: false })
                    }
                    exchangeRateWalletTest={this.exchangeRateWalletTest}
                    handleOk={this.openNoticeOTP}
                    addTDBBtnStatue={addTDBBtnStatue}
                    tDBName={tDBName}
                    tDBAddress={tDBAddress}
                    tDBNameError={tDBNameError}
                    tDBAddressError={tDBAddressError}
                    ctcMethod={ctcMethod}
                    tDBAddressError2={tDBAddressError2}
                />

                {/* 添加usdt钱包的电话验证，目前只需验证电话 */}
                {phoneVisible && <PhoneVerify
					visible={phoneVisible}
					closeModal={() => this.setState({ phoneVisible: false })}
					otpParam={`cry-otp`}
					changeVerify={this.VerifyStatus}
					attemptRemaining={checkAbleSmsOTP.attempts}
					setAttemptRemaining={this.setAttemptRemaining}
					getVerificationCode={this.getVerificationCode}
                    judgeOTPVerification={this.judgeOTPVerification}
                    usdtWithdrawType={ctcMethod}
				/>}

                {/* otp 超過次數彈窗 */}
                <ExceedVerify 
					exceedVisible={this.state.exceedVisible}
					onCancel={() => {
                        this.setState({ exceedVisible: false });
                        setTimeout(() => {
                            global.globalExit();
                        }, 1500)
                    }}
				/>
                
                {/* 提款验证（邮箱和电话） */}
				{toAccountVerification &&
                withdrawalVerifyStep && (
                    <AccountVerification
                        otpVisible={toAccountVerification}
                        otpModal={(v) => {
                            this.props.onCancel();
                        }}
                        otpParam={"withdraw-otp"}
                        memberInfo={memberInfo}
                        getMemberData={()=>{this.correctMemberInfo(null,false)}}
                        readStep={withdrawalVerifyStep}
                        coloseVisible={() => {
                            this.setState({
                                toAccountVerification: false
                            });
                        }}
                    />
                )}
                
                {showAddCard && <AddBankCard
                    visible={showAddCard}
                    closeModal={() => {
                        this.setState({ showAddCard: false });
                    }}
                    alreadyBindBanks={[]}
                    getMemberBanksList={this.props.GetDepositMemberBanks && this.props.GetDepositMemberBanks()}
                />}
            </React.Fragment>
        );
    }
}
const mapStateToProps = function (state) {
    return {
        memberInfo: state.userCenter.memberInfo,
    };
};
const mapDispatchToProps = function (dispatch) {
    return {
        changeUserCenterTabKey:(tabkey)=>{
            dispatch(userCenterActions.changeUserCenterTabKey(tabkey))
        },
        setMemberInfo: (memberObj) => {
            dispatch(userCenterActions.setMemberInfo(memberObj));
        },
        setRefreshCurrentPage: (v) =>{
            dispatch(userCenterActions.setRefreshCurrentPage(v));
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(WithdrawPage);
