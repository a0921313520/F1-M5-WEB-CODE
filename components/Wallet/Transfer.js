import React from "react";
import Router from "next/router";
import HostConfig from "$ACTIONS/Host.config";
import CMSOBJ from "$DATA/stage.live.static.id";
import {
    Button,
    Input,
    Select,
    Form,
    Icon,
    Row,
    Col,
    Modal,
    Popover,
    message,
    Tabs,
} from "antd";
import { formItemLayout, tailFormItemLayout } from "$ACTIONS/constantsData";
import { GetWalletList, TransferSubmit } from "$DATA/wallet";
import BonusList from "./depositComponents/TargetAccount/BonusList";
import { Cookie,formatAmount } from "$ACTIONS/util";
import { get } from "$ACTIONS/TlcRequest";
import { ApiPort } from "../../actions/TLCAPI";
import Announcement from "@/Announcement";
import { BsFillCircleFill } from "react-icons/bs";
import SelfExclusionModal from "../SelfExclusionModal";
import UnfinishedGamePopUp from "./transferComponents/UnfinishedGamePopUp";
import classNames from "classnames";
import { translate } from "$ACTIONS/Translate";
let IconColor = {
    TotalBal: "#BCBEC3",
    Main: "#BCBEC3",
    Sportsbook: "#C1E0FF",
    LiveDealer: "#97D8A5",
    P2P: "#F5E496",
    Slots: "#AE96F6",
    Keno: "#FCA8A9",
};
const { Option } = Select;
const { Item } = Form;
const { TabPane } = Tabs;
message.config({
    top: 200,
    duration: 5,
    maxCount: 1,
});
class Transfer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fromWalletList: [],
            toWalletList: [],
            bonusVal: 0, // 可申请优惠Val值
            bonusName: "", // 可申请优惠名称
            selectIn: false,
            selectFrom: false,
            selectPromote: false,
            currentToMoney: null,
            currentFromMoney: null,
            inputMoney: null,
            showSelfExclusionModal: false,
        };

        this.defaultToWallet = "MAIN";
        this.handleTransfer = this.handleTransfer.bind(this); // 一键转账
        this.transferGetBalance = this.transferGetBalance.bind(this); // 钱包刷新余额方法
        this.handleTabsChange = this.handleTabsChange.bind(this);
        this.handleSelectOpen = this.handleSelectOpen.bind(this);
        this.handleFormSelect = this.handleFormSelect.bind(this);
        this.handleToSelect = this.handleToSelect.bind(this);
    }
    componentDidMount() {
        GetWalletList((res) => {
            const PREFER_WALLET = localStorage.getItem("PreferWallet");
            // PREFER_WALLET && (this.defaultToWallet = PREFER_WALLET); // 不顯示首選的預設帳戶，故注釋
            // this.setState({
            //     fromWalletList: res.result.fromWallet,
            //     toWalletList: res.result.toWallet,
            // });
            if (this.props.balanceList) {
                const SB = this.props.balanceList.find(
                    (item) => item.name == "SB"
                );
                //体育的维护状态
                const SbMaintenance = SB
                    ? SB.state != "UnderMaintenance"
                    : false;
                //不包含维护中的钱包
                const Available = this.props.balanceList.filter(
                    (item) =>
                        item.state != "UnderMaintenance" &&
                        item.name != "TotalBal" &&
                        item.name != "MAIN"
                );
                console.log(Available);
                this.setState({
                    currentToMoney: SbMaintenance ? "SB" : Available[0] && Available[0].name, //如果体育钱包未维护则末日体育钱包，反之其他钱包
                });
            } else {
                this.setState({
                    currentToMoney: "SB",
                });
            }
            this.setState({
                currentFromMoney: PREFER_WALLET,
            });
        });

        let learnStepString = Cookie("learnStep");
        typeof learnStepString === "string" &&
            learnStepString.substr(6, 1) === "0" &&
            this.props.setLearnType("transfer");

        this.transferGetBalance();
        global.Pushgtagpiwikurl && global.Pushgtagpiwikurl("transfer");

        if (this.props.bonusDetail) {
            this.setState({
                bonusVal: this.props.bonusDetail.id,
            });
        }
    }
    componentDidUpdate(prevProps, prevState) {
        // 对于更新锅默认账户的会员起到实时更新的目的
        if (prevProps.visible !== this.props.visible && this.props.visible) {
            const PREFER_WALLET = localStorage.getItem("PreferWallet");
            if (this.props.form.getFieldValue("fromWallet") !== PREFER_WALLET) {
                this.defaultToWallet = PREFER_WALLET;
                this.props.form.setFieldsValue({ toWallet: PREFER_WALLET });
            }
        }
    }
   
    handleTransfer(type, Transferdata) {
        this.props.setLoading(true);
        const isAllTransfer = typeof type === "string";

        let DATA =
            type == "ALL"
                ? {
                      fromAccount: "ALL",
                      toAccount: Transferdata.name,
                      amount: this.props.balanceList.find(
                          (item) => item.name == "TotalBal"
                      ).balance,
                      bonusId: 0,
                      bonusCoupon: "",
                      blackBoxValue: window.E2GetBlackbox
                          ? window.E2GetBlackbox().blackbox == "" ||
                            window.E2GetBlackbox().blackbox == undefined
                              ? ""
                              : window.E2GetBlackbox().blackbox
                          : "",
                      e2BlackBoxValue: window.E2GetBlackbox
                          ? window.E2GetBlackbox().blackbox == "" ||
                            window.E2GetBlackbox().blackbox == undefined
                              ? ""
                              : window.E2GetBlackbox().blackbox
                          : "",
                  }
                : {
                      fromAccount: type.fromWallet,
                      toAccount: type.toWallet,
                      amount: type.money,
                      bonusId: this.state.bonusVal,
                      bonusCoupon: type.bonusCode,
                      blackBoxValue: window.E2GetBlackbox
                          ? window.E2GetBlackbox().blackbox == "" ||
                            window.E2GetBlackbox().blackbox == undefined
                              ? ""
                              : window.E2GetBlackbox().blackbox
                          : "",
                      e2BlackBoxValue: window.E2GetBlackbox
                          ? window.E2GetBlackbox().blackbox == "" ||
                            window.E2GetBlackbox().blackbox == undefined
                              ? ""
                              : window.E2GetBlackbox().blackbox
                          : "",
                  };
        TransferSubmit(DATA, (res) => {
            this.props.setLoading(false);
            if (res) {
                // 0 – failed 失败
                // 1 - success 成功
                // 2 – pending  等待
                console.log(" TransferSubmit res ", res);

                /* 调试用 */
                // res = {
                //     result: {
                //         status: 2,
                //         transferId: 0,
                //         messages: "您还有数个未使用完的优惠",
                //         unfinishedGames: [
                //             {
                //                 gameCode: "queenOfAlexandriaWowpotDesktop",
                //                 gameName: "亚历山大女王 WOWPOT",
                //                 imgGameName:
                //                     "http://media.stagingp3.fun88.biz/Assets/images/Games/Slots/MGSQF/QueenOfAlexandriaWOWPOT.jpg",
                //                 translatedName: "亚历山大女王 WOWPOT",
                //                 gameId: "4444",
                //                 provider: "MGSQF",
                //                 platform: "Desktop",
                //             },
                //             {
                //                 gameCode: "F-SF02",
                //                 gameName: "捕鱼大战",
                //                 imgGameName:
                //                     "http://media.stagingp3.fun88.biz/Assets/images/Games/Slots/SPG/FishingWar.jpg",
                //                 translatedName: "捕鱼大战",
                //                 gameId: "4088",
                //                 provider: "SPG",
                //                 platform: "Desktop",
                //             },

                //         ],
                //         unfinishedGamesMessages:
                //             "系统侦测到您的账号正在进行游戏 请联系在线客服,为您提供最贴心的服务",
                //     },
                //     selfExclusionOption: {
                //         disableFundIn: false,
                //         isExceedLimit: false,
                //     },
                //     isSuccess: true,
                // };

                if (res.isSuccess && res.result.status == 1) {
                    message.success(res.result.messages);
                    this.transferGetBalance();
                } else if (
                    res.result.status == 2 &&
                    res.result.selfExclusionOption &&
                    res.result.selfExclusionOption.isExceedLimit
                ) {
                    const exclusionType = res.result.selfExclusionOption;

                    if (exclusionType.isExceedLimit) {
                        this.setState({
                            showExceedLimit: true,
                            showSelfExclusionModal: true,
                        });
                    } else if (exclusionType.disableFundIn) {
                        this.setState({
                            showExceedLimit: false,
                            showSelfExclusionModal: true,
                        });
                    } else {
                        // Modal.info({
                        // 	className: 'confirm-modal-of-forgetpassword',
                        // 	title: '转账失败',
                        // 	centered: true,
                        // 	icon: <div />,
                        // 	okText: '确认',
                        // 	content: res.result.messages
                        // });
                        message.error(res.result.messages);
                    }
                } else if (
                    res.result.status == 2 &&
                    res.result.unfinishedGamesMessages
                ) {
                    //未完成游戏列表弹窗
                    if (res.result.unfinishedGames.length != 0) {
                        //如果含有游戏列表
                        this.setState({
                            unfinishedGames: res.result.unfinishedGames,
                        });
                    }
                    this.setState({
                        visiblePopUp: true,
                        unfinishedGamesMessages:
                            res.result.unfinishedGamesMessages,
                    });
                } else {
                    // Modal.info({
                    // 	className: 'confirm-modal-of-public',
                    // 	title: '转账失败',
                    // 	centered: true,
                    // 	icon: <div />,
                    // 	okText: '确认',
                    // 	content: res.result.messages
                    // });
                    message.error(res.result.messages);
                }
            } else {
                message.error("转账出错，稍后重试！");
            }
        });

        switch (type) {
            case "MAIN":
                Pushgtagdata("Collectalltomain_1clicktranfer_transfer");
                break;
            case "SB":
                Pushgtagdata("BTiIMSPIMESTF_1clicktransfer_transfer");
                break;
            case "KYG":
                Pushgtagdata("KYGP2P_1clicktransfer_transfer");
                break;
            case "PT":
                Pushgtagdata("PT_1clicktransfer_transfer");
                break;
            case "AG":
                Pushgtagdata("Fishing2slot_1clicktransfer_transfer");
                break;
            case "SB":
                Pushgtagdata("SPsport__1clicktransfer_transfer");
                break;
            case "LD":
                Pushgtagdata("Live__1clicktransfer_transfer");
                break;
            case "BOY":
                Pushgtagdata("BYkeno_1clicktransfer_transfer");
                break;
            case "P2P":
                Pushgtagdata("BoleP2P_1clicktransfer_transfer");
                break;
            case "SLOT":
                Pushgtagdata("Slot__1clicktransfer_transfer");
                break;
            case "KENO":
                Pushgtagdata("VRkeno_1clicktransfer_transfer");
                break;
            default:
                break;
        }
    }
    transferGetBalance() {
        this.props.setLoading(true);
        this.props.getBalance(() => {
            this.props.setLoading(false);
        });
    }
    handleSubmit = (e) => {
        let isAllTransfer = false;
        typeof e === "string" ? (isAllTransfer = true) : e.preventDefault();
        sessionStorage.removeItem("promoDeposit");
        const formSubmitInner = (values) => {
            this.props.setLoading(true);
            this.handleTransfer(isAllTransfer ? e : values);
        };
        if (isAllTransfer) {
            formSubmitInner();
        } else {
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    formSubmitInner(values);
                }
            });
        }
        Pushgtagdata("Transfer", "Submit", "Normal_Transfer");
    };

    handleTabsChange(key) {
        console.log(key);
    }

    handleSelectOpen(type) {
        if (type === "from") {
            this.setState({
                selectFrom: !this.state.selectFrom,
            });
        } else if (type === "in") {
            this.setState({
                selectIn: !this.state.selectIn,
            });
        } else {
            this.setState({
                selectPromote: !this.state.selectPromote,
            });
        }
    }

    handleFormSelect(value, options) {
        console.log("options", parseInt(options.key));

        this.setState({
            currentFromMoney: options.key,
        });
        console.log("currentFromMoney", this.state.currentFromMoney);
    }

    handleToSelect(value, options) {
        console.log("options", options.key);
        this.setState({
            currentToMoney: options.key,
        });
    }

    checkInsufficientBalance = (value) => {
        const { currentFromMoney } = this.state;
        return parseInt(currentFromMoney) - parseInt(value) < 0;
    };

    /**
     * @description: 获取优惠数据
     * @param {*} data
     * @return {*}
     */
    CallBonusdata = (data) => {
        const { bonusVal } = this.state;
        const defaultval = data.find((Item) => Item.id == bonusVal);
        this.setState({
            Bonusdata: data,
            Bonusdefault: defaultval,
        });
    };

    render() {
        const {
            getFieldDecorator,
            getFieldValue,
            getFieldsError,
            getFieldError,
        } = this.props.form;
        const { balanceList } = this.props;

        const {
            currentFromMoney,
            currentToMoney,
            selectFrom,
            selectIn,
            selectPromote,
            visiblePopUp,
            unfinishedGamesMessages,
            unfinishedGames,
            Bonusdefault,
        } = this.state;
        const TransferMoney = this.props.form.getFieldValue("money");
        console.log("当前选中的优惠", Bonusdefault);
        console.log("DefaultFromWallet", this.state.DefaultFromWallet);
        return (
            <React.Fragment>
                {/* <a
                    className="deposit-help-link"
                    onClick={() => {
                        Router.push(
                            "/help?type=Sub3&key=" +
                                CMSOBJ[HostConfig.CMS_ID][28]
                        );
                        Pushgtagdata("Tutorial_tranfer_wallet");
                    }}
                >
                    查看转账教程
                </a> */}
                <Tabs
                    defaultActiveKey="1"
                    onChange={this.handleTabsChange}
                    style={{ overflow: "visible" }}
                >
                    <TabPane tab={translate("快速转账")} key="1">
                        <div className="transferAllItem">
                            {balanceList &&
                                balanceList.map((item, index) => {
                                    return (
                                        <React.Fragment key={index + "List"}>
                                            {item.category == "TotalBal" ? (
                                                <div className="totalBalItem">
                                                    <div className="totalBal">
                                                        <span>
                                                            {item.localizedName}
                                                        </span>
                                                    </div>
                                                    <div className="totalBalMonImg">
                                                        <span>{formatAmount(item.balance,"TwoDecimalSuffixes")} đ</span>
                                                        <Icon
                                                            type="reload"
                                                            onClick={
                                                                this.transferGetBalance
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <React.Fragment>
                                                    <div
                                                        className={classNames({
                                                            transferItem: true,
                                                            UnderMaintenance:
                                                                item.state == "UnderMaintenance" || 
                                                                item.state == "NotAvailable",
                                                        })}
                                                    >
                                                        <div className="transferDotName">
                                                            <i>
                                                                <BsFillCircleFill
                                                                    size="8"
                                                                    color={
                                                                        IconColor[
                                                                            item.category
                                                                        ]
                                                                    }
                                                                />
                                                            </i>
                                                            <span className="localizedName">
                                                                {
                                                                    item.localizedName
                                                                }
                                                            </span>
                                                            {/* {item.category ==
                                                                "Sportsbook" && (
                                                                <Popover
                                                                    overlayStyle={{
                                                                        zIndex: 1000,
                                                                    }}
                                                                    align={{
                                                                        offset: [
                                                                            -4,
                                                                            0,
                                                                        ],
                                                                    }}
                                                                    placement="bottomLeft"
                                                                    overlayClassName="popover-dark"
                                                                    content={
                                                                        <div>
                                                                            包含
                                                                            V2虚拟体育,
                                                                            沙巴体育,
                                                                            BTI
                                                                            体育,
                                                                            IM
                                                                            体育和电竞
                                                                        </div>
                                                                    }
                                                                    title=""
                                                                    trigger="hover"
                                                                >
                                                                    <span className="header-popover-inner-tip pointer">
                                                                        <img src="/vn/img/wallet/information.svg" />
                                                                    </span>
                                                                </Popover>
                                                            )} */}
                                                            {/* {item.name ==
                                                                "P2P" && (
                                                                <Popover
                                                                    overlayStyle={{
                                                                        zIndex: 1000,
                                                                    }}
                                                                    align={{
                                                                        offset: [
                                                                            -4,
                                                                            0,
                                                                        ],
                                                                    }}
                                                                    placement="bottomLeft"
                                                                    overlayClassName="popover-dark"
                                                                    content={
                                                                        <div>
                                                                            包含双赢棋牌，开元棋牌和小游戏​
                                                                        </div>
                                                                    }
                                                                    title=""
                                                                    trigger="hover"
                                                                >
                                                                    <span className="header-popover-inner-tip pointer">
                                                                        <img src="/vn/img/wallet/information.svg" />
                                                                    </span>
                                                                </Popover>
                                                            )} */}
                                                        </div>
                                                        {item.state ==
                                                        "UnderMaintenance" || item.state == "NotAvailable" ? (
                                                            <div className="transferMonImg Maintenance">
                                                                {translate("维护中")}
                                                            </div>
                                                        ) : (
                                                            <div className="transferMonImg">
                                                                <span>{formatAmount(item.balance,"TwoDecimalSuffixes")} đ</span>
                                                                <img
                                                                    src={`${process.env.BASE_PATH}/img/wallet/transfericon.svg`}
                                                                    onClick={() => {
                                                                        if (
                                                                            balanceList.find(
                                                                                (
                                                                                    item
                                                                                ) =>
                                                                                    item.category ==
                                                                                    "TotalBal"
                                                                            )
                                                                                .balance ==
                                                                            0
                                                                        ) {
                                                                            this.props.goDeposit(
                                                                                "deposit"
                                                                            );
                                                                        } else {
                                                                            this.handleTransfer(
                                                                                "ALL",
                                                                                item
                                                                            );
                                                                        }

                                                                        Pushgtagdata(
                                                                            "Transfer",
                                                                            "Submit",
                                                                            `${item.localizedName}_QuickTransfer`
                                                                        );
                                                                    }}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </React.Fragment>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                        </div>
                    </TabPane>
                    <TabPane tab={translate("普通转帐")} key="2">
                        {/* 新版普通轉帳 */}
                        <Form
                            className="transfer-form-wrap"
                            {...formItemLayout}
                            onSubmit={this.handleSubmit}
                        >
                            <Row gutter={16}>
                                <Col span={25}>
                                    <Item label={translate("来源账户")}>
                                        <div className="drop-area">
                                            {balanceList.length ? (
                                                getFieldDecorator(
                                                    "fromWallet",

                                                    {
                                                        initialValue:
                                                            this.state
                                                                .currentFromMoney,
                                                        rules: [
                                                            {
                                                                required: true,
                                                                message:
                                                                    "请选择转出钱包。",
                                                            },
                                                        ],
                                                    }
                                                )(
                                                    // defaultValue={fromWalletList[0].key}
                                                    <Select
                                                        dropdownClassName="transferWellet"
                                                        size="large"
                                                        placeholder="请选择账户"
                                                        onDropdownVisibleChange={() =>
                                                            this.handleSelectOpen(
                                                                "from"
                                                            )
                                                        }
                                                        suffixIcon={
                                                            selectFrom ? (
                                                                <img src={`${process.env.BASE_PATH}/img/wallet/dropdown-updown.svg`} />
                                                            ) : (
                                                                <img src={`${process.env.BASE_PATH}/img/wallet/icon-dropdown.svg`} />
                                                            )
                                                        }
                                                        onChange={
                                                            this
                                                                .handleFormSelect
                                                        }
                                                        getPopupContainer={(
                                                            triggerNode
                                                        ) =>
                                                            triggerNode.parentNode
                                                        }
                                                    >
                                                        {balanceList.map(
                                                            (value, index) => {
                                                                let node;
                                                                node = (
                                                                    <Option
                                                                        key={
                                                                            value.name
                                                                        }
                                                                        value={
                                                                            value.name
                                                                        }
                                                                        style={{
                                                                            display:
                                                                                getFieldValue(
                                                                                    "toWallet"
                                                                                ) !=
                                                                                    value.name &&
                                                                                value.name !=
                                                                                    "TotalBal"
                                                                                    ? "block"
                                                                                    : "none",
                                                                        }}
                                                                        disabled={
                                                                            value.state ==
                                                                            "UnderMaintenance"
                                                                        }
                                                                    >
                                                                        {value.state ==
                                                                        "UnderMaintenance" ? (
                                                                            <div className="allOption">
                                                                                <div className="optionItem">
                                                                                    {
                                                                                        value.localizedName
                                                                                    }
                                                                                </div>
                                                                                <div className="optionItem2">
                                                                                    维护中
                                                                                </div>
                                                                            </div>
                                                                        ) : (
                                                                            <div className="allOption">
                                                                                <div className="optionItem">
                                                                                    {
                                                                                        value.localizedName
                                                                                    }
                                                                                </div>
                                                                                {value.state ==
                                                                                "UnderMaintenance" ? (
                                                                                    <div className="optionItem2">
                                                                                        维护中
                                                                                    </div>
                                                                                ) : (
                                                                                    <div className="optionItem2">
                                                                                        ￥
                                                                                        {
                                                                                            value.balance
                                                                                        }
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </Option>
                                                                );
                                                                return node;
                                                            }
                                                        )}
                                                    </Select>
                                                )
                                            ) : (
                                                <Select
                                                    size="large"
                                                    value="加载中..."
                                                    disabled={true}
                                                    loading={true}
                                                />
                                            )}
                                        </div>
                                    </Item>
                                </Col>
                                <Col span={25}>
                                    <Item label={translate("目标账户")}>
                                        <div
                                            className="drop-area"
                                            id="drop-area2"
                                        >
                                            {balanceList.length ? (
                                                getFieldDecorator("toWallet", {
                                                    initialValue:
                                                        this.state
                                                            .currentToMoney,
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message:
                                                                "请选择转入钱包。",
                                                        },
                                                    ],
                                                })(
                                                    // defaultValue={fromWalletList[0].key}
                                                    <Select
                                                        dropdownClassName="transferWellet"
                                                        size="large"
                                                        placeholder="请选择账户"
                                                        onDropdownVisibleChange={() =>
                                                            this.handleSelectOpen(
                                                                "in"
                                                            )
                                                        }
                                                        suffixIcon={
                                                            selectIn ? (
                                                                <img src={`${process.env.BASE_PATH}/img/wallet/dropdown-updown.svg`} />
                                                            ) : (
                                                                <img src={`${process.env.BASE_PATH}/img/wallet/icon-dropdown.svg`} />
                                                            )
                                                        }
                                                        onSelect={
                                                            this.handleToSelect
                                                        }
                                                        getPopupContainer={(
                                                            triggerNode
                                                        ) =>
                                                            triggerNode.parentNode
                                                        }
                                                    >
                                                        {balanceList.map(
                                                            (value, index) => {
                                                                let node;
                                                                node = (
                                                                    <Option
                                                                        key={
                                                                            value.name
                                                                        }
                                                                        value={
                                                                            value.name
                                                                        }
                                                                        style={{
                                                                            display:
                                                                                getFieldValue(
                                                                                    "fromWallet"
                                                                                ) !=
                                                                                    value.name &&
                                                                                value.name !=
                                                                                    "TotalBal"
                                                                                    ? "block"
                                                                                    : "none",
                                                                        }}
                                                                        disabled={
                                                                            value.state ==
                                                                            "UnderMaintenance"
                                                                        }
                                                                    >
                                                                        <div className="allOption">
                                                                            <div className="optionItem">
                                                                                {
                                                                                    value.localizedName
                                                                                }
                                                                            </div>
                                                                            {value.state ==
                                                                            "UnderMaintenance" ? (
                                                                                <div className="optionItem2">
                                                                                    维护中
                                                                                </div>
                                                                            ) : (
                                                                                <div className="optionItem2">
                                                                                    ￥
                                                                                    {
                                                                                        value.balance
                                                                                    }
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </Option>
                                                                );
                                                                return node;
                                                            }
                                                        )}
                                                    </Select>
                                                )
                                            ) : (
                                                <Select
                                                    size="large"
                                                    value="加载中..."
                                                    disabled={true}
                                                    loading={true}
                                                />
                                            )}
                                        </div>
                                    </Item>
                                </Col>
                            </Row>
                            <Item
                                label={translate("转账金额")}
                                key={JSON.stringify(
                                    currentFromMoney + currentToMoney
                                )}
                            >
                                {getFieldDecorator("money", {
                                    initialValue: "",
                                    getValueFromEvent: (event) => {
                                        console.log(event.target.value);
                                        return event.target.value
                                            .replace(/[^\d.]/g, "")
                                            .replace(/\.{2,}/g, ".")
                                            .replace(".", "$#$")
                                            .replace(/\./g, "")
                                            .replace("$#$", ".");
                                    },
                                    rules: [
                                        {
                                            required: true,
                                            message: translate("输入金额"),
                                        },
                                        {
                                            validator: (
                                                rule,
                                                value,
                                                callback
                                            ) => {
                                                if (value && value == 0) {
                                                    callback(translate("输入金额"));
                                                }
                                                // 必須是數字，可帶兩位小數（一位和超過三位都不行）
                                                // if (
                                                //     value &&
                                                //     !/^\d+(\.\d{2})?$/.test(
                                                //         value
                                                //     )
                                                // ) {
                                                //     callback(
                                                //         "转帐金额格式若有小数点，需完整填写小数点后两位，例如: ¥100.10"
                                                //     );
                                                // }

                                                if (
                                                    value &&
                                                    this.checkInsufficientBalance(
                                                        value
                                                    )
                                                ) {
                                                    callback(translate("余额不足2"));
                                                }
                                                callback();
                                            },
                                        },
                                    ],
                                })(
                                    <Input
                                        placeholder={translate("输入金额")}
                                        size="large"
                                        autoComplete="off"
                                    />
                                )}
                            </Item>

                            {/* <div className="modal-prompt-info">请确认您所要转出额钱包有充足的余额。</div> */}
                            <BonusList
                                setLoading={this.props.setLoading}
                                getFieldDecorator={getFieldDecorator}
                                getFieldValue={getFieldValue}
                                bonusVal={this.state.bonusVal}
                                setBonusValue={(v, name, bonusList) => {
                                    this.setState(
                                        {
                                            bonusVal: v,
                                            bonusName: name,
                                        },
                                        () => {
                                            this.CallBonusdata(bonusList);
                                        }
                                    );
                                }}
                                targetValue={getFieldValue("toWallet")}
                                transactionType="Transfer"
                                openFunc={() =>
                                    this.handleSelectOpen("promote")
                                }
                                selectPromote={selectPromote}
                                CallBonusdata={(e) => this.CallBonusdata(e)}
                            />

                            {/* {Bonusdefault && this.state.bonusVal != 0 && (
                                <div className="PromoContent">
                                    <label>{Bonusdefault.title}</label>
                                    <div className="list">
                                        <div>
                                            <label>申请金额</label>
                                            <div>
                                                ￥
                                                {TransferMoney &&
                                                TransferMoney !== 0
                                                    ? Number(
                                                          TransferMoney
                                                      ).toFixed(2)
                                                    : 0}
                                            </div>
                                        </div>
                                        <div>
                                            <label>可得红利</label>
                                            <div>
                                                ￥
                                                {!TransferMoney
                                                    ? 0
                                                    : (Number(TransferMoney) *
                                                          Bonusdefault.givingRate >
                                                      Bonusdefault.maxGiving
                                                          ? Bonusdefault.maxGiving
                                                          : Number(
                                                                TransferMoney
                                                            ) *
                                                            Bonusdefault.givingRate
                                                      ).toFixed(2)}
                                            </div>
                                        </div>
                                        <div>
                                            <label>所需流水</label>
                                            <div>
                                                {!Bonusdefault.releaseValue
                                                    ? 0
                                                    : !TransferMoney
                                                    ? 0
                                                    : (Number(TransferMoney) *
                                                          Bonusdefault.givingRate >
                                                      Bonusdefault.maxGiving
                                                          ? (Bonusdefault.maxGiving /
                                                                Bonusdefault.givingRate +
                                                                Bonusdefault.maxGiving) *
                                                            Bonusdefault.releaseValue
                                                          : (Number(
                                                                TransferMoney
                                                            ) *
                                                                Bonusdefault.givingRate +
                                                                Number(
                                                                    TransferMoney
                                                                )) *
                                                            Bonusdefault.releaseValue
                                                      ).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )} */}

                            <Item {...tailFormItemLayout}>
                                <div className="btn-wrap">
                                    <Button
                                        disabled={
                                            Object.values(
                                                getFieldsError()
                                            ).some((v) => v !== undefined) ||
                                            getFieldValue("fromWallet") ==
                                                undefined ||
                                            getFieldValue("toWallet") ==
                                                undefined ||
                                            getFieldValue("money") ==
                                                undefined ||
                                            getFieldValue("money") == ""
                                            // this.state.currentFromMoney - getFieldValue('money') < 0
                                        }
                                        size="large"
                                        type="primary"
                                        htmlType="submit"
                                        block
                                    >
                                        {translate("转移")}
                                    </Button>
                                </div>
                            </Item>
                        </Form>
                        {/* 紧急公告弹窗 */}
                        <Announcement
                            optionType={'Transfer'}
                        />
                    </TabPane>
                </Tabs>
                {this.state.showSelfExclusionModal && (
                    <SelfExclusionModal
                        ModalType={this.state.showExceedLimit ? 2 : 1}
                        OpenModalUrl="Transfer"
                        afterCloseModal={() => {
                            this.setState({ showSelfExclusionModal: false });
                            this.props.onCancel();
                            Router.push("/");
                        }}
                    />
                )}
                {/* 游戏进行中 转账限制弹窗 */}
                <UnfinishedGamePopUp
                    visible={visiblePopUp}
                    unfinishedGames={unfinishedGames}
                    unfinishedGamesMessages={unfinishedGamesMessages}
                    CloseVisible={() => {
                        this.setState({
                            visiblePopUp: false,
                        });
                    }}
                />
            </React.Fragment>
        );
    }
}
export default Form.create({ name: "Transfer" })(Transfer);
