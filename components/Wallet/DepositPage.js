import React, { Component,useEffect,useState } from 'react';
import { Button, Input, message, Spin, Row, Col, Modal, Form, version } from "antd";
import { setFEWalletParams, setFEWalletParam,getFEWalletParams } from 'central-payment/platform.pay.config';
// import { setFEWalletParams, setFEWalletParam,getFEWalletParams } from '../../Central-Payment/platform.pay.config';
import Deposit from '$Deposits/Web/deposit'
import { getE2BBValue,showResultModal } from "$ACTIONS/helper";
import HostConfig from "$ACTIONS/Host.config";
import {ApiPort, APISETS } from "$ACTIONS/TLCAPI";
import { get, post } from "$ACTIONS/TlcRequest";
import { connect } from "react-redux";
import { translate } from "$ACTIONS/Translate";
import {realyNameReg} from "$ACTIONS/reg";
import { getMemberInfo, setMemberInfo } from "$DATA/userinfo";
import { userCenterActions } from "$STORE/userCenterSlice";
import AddBankCard from "@/BankAccount/AddBankCard";
import Router from 'next/router';
import Announcement from '@/Announcement/';
import DepositUSDTLesson from "@/DepositLesson/CTC";
import DepositPHCLesson from "@/DepositLesson/PHC";
import {replaceMultipleSpacesWithSingle} from "$ACTIONS/util";

const { Item } = Form;
const { LocalHost, HostApi, BffscHostApi } = HostConfig.Config;
const paymentFebff = [
    "/api/Payment/DepositAccountByAmount",
    "/api/Payment/BindReverseDepositAccount",
];
class DepositPage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loadinglogin: '',
            show: false,
            name:"",
            nameModalVisible:false,
            showAddCard:false,
            lessonModal: false,
            depositLessonTab: 1,
            phcLessonModal: false,
            nameModalLoad:false
        };
        const { setLoading ,dialogTabKey} = this.props;
        console.log("🚀 ~ DepositPage ~ constructor ~ dialogTabKey:", dialogTabKey)
        const bonusId = dialogTabKey?.bonusId && String(dialogTabKey?.bonusId) ||"";
        const methodCode = dialogTabKey?.currentPayValue ?? "";
        const apis = APISETS.slice(1)
        this.privateParams = {
            device: 'WEB',
            platformType: 'F1',
            languageType: 'M3',
            domainName: LocalHost,
            successUrl: LocalHost,
            siteId: 40,
            ActiveMethods: methodCode,//指定存款,默认第一个
            bonusId: bonusId,
            firstName: 'zzz',
            BackClick: () => {this.nextStep()},
            LivechatClick: () => { global.PopUpLiveChat() },
            AddBankClick: (type = 'deposit', category = 'bank') => {this.addBankCardModal()},//deposit存款, bank是普通银行，其他是虚拟币钱包,添加银行成功后去更新银行call this.props.GetDepositMemberBanks && this.props.GetDepositMemberBanks()
            HistoryClick: (type = 'Deposit') => {this.navigationPage("records") },//type = Deposit存款记录,Withdrawals提款记录
            goRecord:(type = 'Deposit',method)=>{ console.log('method:',method),this.navigationPage("records")},
            ApiGet: (url) => {
                let host = HostApi;
                if (paymentFebff.includes(url.split("?")[0])) {
                    host = BffscHostApi;
                }
                return get(host + url + apis);
            },
            ApiPost: (url, postdata = '') => {
                let host = HostApi;
                if (paymentFebff.includes(url.split("?")[0])) {
                    host = BffscHostApi;
                }
                return post(host + url + apis, postdata);
            },
            goVerifyContact: () => {},
            goFinishKYCInfo: () => {this.navigationPage("uploadFiles")},//KYC
            goFinishMemberInfo: () => {this.fillInName()},
            toastTip: {
                loading: () => { setLoading && setLoading(true) },
                hide: () => { setLoading && setLoading(false) },
                success: (msg) => { message.success(msg) },
                error: (msg) => { message.error(msg) },
            },
            openTutorial: (v) => {
                this.openTutorial(v)
            },
            webPiwikEvent:() => {},
            webPiwikUrl: () => {},
            appPiwikEvent: () => {},
            appPiwikUrl: () => {},
        }
        setFEWalletParams(this.privateParams)
    }

    componentDidMount() {
        setFEWalletParam('e2Backbox', getE2BBValue() || '')
        setTimeout(() => {
            this.setState({ show: true })
        }, 300);
        if(!!sessionStorage.getItem("promoDeposit")){
            const {bonusId="",bonusTitle="",bonusProduct=""} = JSON.parse(sessionStorage.getItem("promoDeposit"))||{};
            this.privateParams = {
                ...this.privateParams,
                bonusId: bonusId,
                bonusName: bonusTitle,
                depositingWallet: bonusProduct,
            }
        }
        setFEWalletParams(this.privateParams)
    }

    componentWillUnmount() {
        this.setState = () => false;
        this.privateParams = null;
        getFEWalletParams();
    }

    /**
     * 充值完成后页面的按钮
     */
    nextStep =()=> {
        if(!!sessionStorage.getItem("promoDeposit")){
            sessionStorage.removeItem("promoDeposit")
        }
        this.props.onCancel();
        if(!global.location.pathname.includes("/vn/promotions")){
            Router.push("/promotions")
        }
    }

    openTutorial =(v)=> {
        this.setState({
            lessonModal: v && v === "DCTC",
            phcLessonModal: v && v === "DPHC"
        })
    }
    /**
     * 跳转page
     * @param {*} key 
     */
    navigationPage=(key)=>{
        switch(key){
            case "records":
                if (~global.location.pathname.indexOf("/vn/transaction-record")) {
                    this.props.setRefreshCurrentPage("deposit");
                    this.props.onCancel();
                } else{
                    this.props.changeUserCenterTabKey(key);
                    Router.push("/transaction-record");
                }
                break;
            case "uploadFiles":
                if (~global.location.pathname.indexOf("/vn/me/upload-files")) {
                    this.props.onCancel();
                } else{
                    this.props.changeUserCenterTabKey(key);
                    Router.push("/me/upload-files");
                }
                break;
            default:
                break;
        }
    }

    fillInName =()=> {
        Modal.confirm({
            width:"400px",
            icon: null,
            centered: true,
            title: translate("需要身份验证"),
            content: translate("为了您的账户安全，请先完成实名认证"),
            okText: translate("立即验证"),
            cancelText: translate("稍后认证"),
            className:"confirm-modal-of-public elementTextLeft",
            onOk: () => {
                this.setState({nameModalVisible:true})
            },
            onCancel: () => {
                this.props.onCancel();
            }
        })
    }
    handleChange = (e)=>{
        let name = "";
        if(e.target.value){
            name = replaceMultipleSpacesWithSingle(e.target.value)
        }
        this.setState({name})
    }
    handleSubmit = ()=>{
        this.setState({nameModalLoad:true})
        setMemberInfo(
            {
                key: "firstName",
                value1: this.state.name.trim(),
            },
            (res) => {
                this.setState({nameModalLoad:false})
                if (res && res.isSuccess) {
                    showResultModal(translate("认证成功"),true,1501,'otp','authentication-succeeded');
                    this.setState({nameModalVisible: false})
                    getMemberInfo((result)=>{
                        this.props.updateMemberInfo(result)
                    },true)
                } else {
                    showResultModal(translate("失败"),false,1501,'otp','authentication-succeeded');
                }
            }
        );
    }
    /**
     * 添加银行卡
     */
    addBankCardModal=()=>{
        this.setState({showAddCard: true})
    }
    /**
     * usdt教程 tab切换
     * @param {*} n 
     */
    handleChangeDepositLessonTab = (n) => {
        this.setState({ depositLessonTab: n });
        switch (n) {
            case "1":
                // Pushgtagdata("Channel_tutorial_crypto");
                break;
            case "2":
                // Pushgtagdata("Invoice_tutorial_crypto");
                break;
            default:
                break;
        }
    };
    render() {
        const {
            nameModalVisible,
            name,
            showAddCard,
            nameModalLoad
        } = this.state;
        return (
            <React.Fragment>
                <Loading />
                <div>
                    {
                        this.state.show && <Deposit />
                    }
                </div>
                <Modal
                    className="modal-pubilc finnInNameModal"
                    width={400}
                    centered
                    title={translate("验证真实姓名")}
                    closable={false}
                    visible={nameModalVisible}
                    okText={translate("立即验证")}
                    cancelText={translate("稍后认证")}
                    onCancel={() => {
                        this.setState({nameModalVisible: false})
                        this.props.onCancel();
                    }}
                    onOk={this.handleSubmit}
                    okButtonProps={{disabled : !realyNameReg.test(name)}}
                >
                    <Spin
                        spinning={nameModalLoad}
                    >
                        <div>
                            <span>{translate("为了您的账户安全，请先完成实名认证")}</span>
                            <Item label={translate("真实姓名")}>
                                <Input
                                    size="large"
                                    className="tlc-input-disabled"
                                    placeholder={translate("请输入您的真实姓名")}
                                    onChange={(e)=>{this.handleChange(e)}}
                                />
                            </Item>
                        </div>
                    </Spin>
                </Modal>
                {/* 紧急公告弹窗 */}
                <Announcement 
					optionType="Deposit"
				/>
                {showAddCard && <AddBankCard
                    visible={showAddCard}
                    closeModal={() => {
                        this.setState({ showAddCard: false });
                    }}
                    alreadyBindBanks={[]}
                    getMemberBanksList={this.props.GetDepositMemberBanks && this.props.GetDepositMemberBanks()}
                />}
                {/* usdt 充值教程 */}
                <Modal
                    footer={null}
                    maskClosable={true}
                    onCancel={()=>{this.setState({lessonModal: false})}}
                    visible={this.state.lessonModal}
                    width={600}
                    title={translate("usdt充值教程")}
                    closable={false}
                >
                    <DepositUSDTLesson
                        onhandleCancel={()=>{this.setState({lessonModal: false})}}
                        tabNum={this.state.depositLessonTab}
                        handleChangeDepositLessonTab={
                            this.handleChangeDepositLessonTab
                        }
                    />
                </Modal>
                {/* PHC 充值教程 */}
                <Modal
                    footer={null}
                    maskClosable={true}
                    onCancel={()=>{this.setState({phcLessonModal: false})}}
                    visible={this.state.phcLessonModal}
                    width={600}
                    title={translate("刮刮卡充值教程")}
                    closable={false}
                >
                    <DepositPHCLesson
                        onhandleCancel={()=>{this.setState({phcLessonModal: false})}}
                    />
                </Modal>
            </React.Fragment>
        );
    }
}

export class Toast {
    static loading(title, time) {
        Loading.setContentLarge(title, time)
    }
    static hide() {
        Loading.clearContent()
    }

}

//loading
let ToasViewInstance = null;
class Loading extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: '',
        };
        this.timeOut = null
        ToasViewInstance = this
    }
    componentWillUnmount() {
        this.timeOut && clearTimeout(this.timeOut)
        this.timeOut = null
        ToasViewInstance = null
    }
    static setContentLarge(tips = 'Loading...', time = 20) {
        ToasViewInstance && ToasViewInstance.show(tips, time)
    }
    show = (tips, time) => {
        this.setState({ modalVisible: tips })
        this.timeOut = setTimeout(() => {
            this.setState({ modalVisible: '' })
            this.timeOut && clearTimeout(this.timeOut)
            this.timeOut = null
        }, time * 1000);
    }
    static clearContent() {
        ToasViewInstance && ToasViewInstance.hide()
    }
    hide = () => {
        this.setState({ modalVisible: '' })
        this.timeOut && clearTimeout(this.timeOut)
        this.timeOut = null
    }
    render() {
        const { modalVisible } = this.state;
        return (
            <Modal
                width="135px"
                keyboard={false}
                closable={false}
                className="Spin_modal"
                footer={null}
                visible={Boolean(modalVisible)}
                maskClosable={false}
            >
                <Spin tip={modalVisible || 'Loading...'} />
            </Modal>
        )
    }
}

const mapDispatchToProps = function (dispatch) {
    return {
        changeUserCenterTabKey:(tabkey)=>{
            dispatch(userCenterActions.changeUserCenterTabKey(tabkey))
        },
        updateMemberInfo:(value)=>{
            dispatch(userCenterActions.setMemberInfo(value))
        },
        setRefreshCurrentPage:(v)=>{
            dispatch(userCenterActions.setRefreshCurrentPage(v))
        }
    };
};
export default connect(null, mapDispatchToProps)(DepositPage);
