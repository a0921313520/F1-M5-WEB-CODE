import React from "react";
import { Icon } from "antd";
import Withdrawal from "./WithdrawPage";
import Transfer from "./Transfer";
import ModalRedirector from "@/ModalRedirector";
import { Cookie } from "$ACTIONS/util";
import { LEARN_TIME } from "$ACTIONS/constantsData";
import { translate } from "$ACTIONS/Translate";
import DepositPage from "./DepositPage";
import { Methods } from "$Deposits/Web/deposit";
import { connect } from "react-redux";

function depositMethodGtag(key) {
    const type = "Deposit Nav";
    const action = "Click";
    switch (key) {
        case "ALB":
            Pushgtagdata(type, action, "Localalipay_DepositPage");
            break;
        case "AP":
            Pushgtagdata(type, action, "Astropay_DepositPage");
            break;
        case "BC":
        case "BCM":
            Pushgtagdata(type, action, "Onlinebankpay_DepositPage");
            break;
        case "CC":
            Pushgtagdata(type, action, "TLCcard_DepositPage");
            break;
        case "JDP":
            Pushgtagdata(type, action, "JDwallet_DepositPage");
            break;
        case "LB":
            Pushgtagdata(type, action, "Localbank_DepositPage");
            break;
        case "QQ":
            Pushgtagdata(type, action, "OnlineQQpay_DepositPage");
            break;
        case "UP":
            Pushgtagdata(type, action, "Unionpay_DepositPage");
            break;
        case "PPB":
            Pushgtagdata(type, action, "P2Pbanking_DepositPage");
            break;
        case "CTC":
            Pushgtagdata(type, action, "Cryptocurrency_DepositPage");
            break;
        case "OA":
            Pushgtagdata(type, action, "Onlinealipay_DepositPage");
            break;
        case "WCLB":
            Pushgtagdata(type, action, "Localwechatpay_DepositPage");
            break;
        case "WC":
            Pushgtagdata(type, action, "Onlinewechatpay_DepositPage");
        case "SR":
            Pushgtagdata(type, action, "SmallRiver_DepositPage");
        default:
            break;
    }
}
const DEPOSIT = "deposit";
const WITHDRAW = "withdraw";
class Main extends React.Component {
    setConstructor() {
        this.widhdrawal = null;
        this.state = {
            currentDepositKey: "",
            payMethodList: [],
            depositDownOpen: false, // 充值下拉是否展开
            withdrawDownOpen: false, // 提款下拉是否展开
            showLearnType: "", // 是否显示教程遮罩（空不显示、withdraw、transfer）
            promptInfo: "", // 充、提、转内置提示信息
            withdrawMethodsList: [], //提款方式
            currentWithdrawKey: "",
            currentWithdrawType: "", //当前的充值方式类型,
            isDeShowBankCardVerif: false, //银行卡资料验证就会是false，
            promptsAfterBoot: false, //引导教程后的提示，
        };

        this.closeLearn = this.closeLearn.bind(this);
        this.changeTab = this.changeTab.bind(this); // 切换Tab选项卡
        this.setPayList = this.setPayList.bind(this); // 设置充值方式
        this.setCurrentPayMethod = this.setCurrentPayMethod.bind(this); // 设置当前充值方式
        this.toggleDepositList = this.toggleDepositList.bind(this); // 切换充值列表显示状态
        this.setPromptInfo = this.setPromptInfo.bind(this); // 设置充、提、转内置提示信息
        this.setWithdrawList = this.setWithdrawList.bind(this); //提款
        this.setCurrentWithdrawMethod =
            this.setCurrentWithdrawMethod.bind(this); // 设置当前提现方式

        this.depositListWrapRef = React.createRef(); // 充值列表外层DOM
        this.depositListRef = React.createRef(); // 充值列表DOM
        this.withdrawListWrapRef = React.createRef(); // 提现列表外层DOM
        this.withdrawListRef = React.createRef(); // 提现列表DOM

        this.isOnLinePay = false; // 是否有在线存款支付方式
        this.bcTypeList = []; // 在线支付类别（网银存款，快捷支付）（移动到父元素是为了切换大分类保留此处充值方式数据）
        this.promptTimer = null;
    }
    componentDidMount() {}
    componentDidUpdate(prevProps) {
        if (this.props.dialogTabKey.type !== prevProps.dialogTabKey.type) {
            this.currentModalMap = { ...this.props.dialogTabKey };
            if (this.props.dialogTabKey.type === DEPOSIT) {
                this.toggleDepositList(this.props.dialogTabKey.type);
            } else if (this.props.dialogTabKey.type === WITHDRAW) {
                this.toggleWithdrawList(this.props.dialogTabKey.type);
            } else {
                this.changeTab(this.props.dialogTabKey.type);
            }
        }

        if (
            prevProps.Methods !== this.props.Methods &&
            this.props.Methods &&
            this.props.Methods.paymentMethods &&
            Array.isArray(this.props.Methods.paymentMethods) &&
            this.props.Methods.paymentMethods.length &&
            this.props.dialogTabKey.type === DEPOSIT
        ) {
            this.toggleDepositList(true);
        }
    }
    componentWillUnmount() {
        clearTimeout(this.promptTimer);
        this.setState = () => false;
    }
    closeLearn() {
        this.setState({ showLearnType: "", promptsAfterBoot: true });
        // 设置开启的记录
        let LearnArr = Cookie("learnStep").split("");
        LearnArr.splice(
            this.state.showLearnType === "withdraw" ? 5 : 6,
            1,
            "1",
        );
        Cookie("learnStep", LearnArr.join(""), { expires: LEARN_TIME });
        Pushgtagdata(
            this.state.showLearnType === "withdraw"
                ? "Withdrawal_userguide"
                : "Transfer_userguide",
        );
    }

    setCurrentPayMethod(key) {
        this.setState({ currentDepositKey: key });
    }
    // 设置充值方式并处理充值方式列表
    setPayList(list, currentKey) {
        let payList = [];

        list.forEach((val) => {
            if (~["MD", "QR", "ALBMD", "WLMD"].indexOf(val.code)) return null;
            if (val.code === "BC") {
                val.code === "BC" &&
                    (val.localName = "网银支付 - 需要插入U盾，进行存款");
                // 记录当前的在线支付类型
                this.bcTypeList.push(val);
                val.name = "网银支付";
            } else if (val.code === "BCM") {
                val.code === "BCM" &&
                    (val.localName = "快捷支付 - 接收短信认证，完成支付");
                this.bcTypeList.push(val);
                val.name = "快捷支付";
            }
            payList.push(val);
            console.log("checkbctypelist===", payList);
        });

        this.setState({ payMethodList: payList }, () => {
            this.toggleDepositList(true);
            if (!~list.findIndex((v) => v.code === currentKey)) {
                currentKey = payList[0].code;
            }
            this.setCurrentPayMethod(currentKey);
        });
    }

    // 设置提款方式并处理提款方式列表
    setWithdrawList(list, currentKey) {
        console.log(
            "🚀 ~ file: index.js:169 ~ Main ~ setWithdrawList ~ list:",
            list,
        );
        this.setState({ withdrawMethodsList: list }, () => {
            this.toggleWithdrawList(true);
            let type = "";
            const array = Array.from(list);
            for (const value of array) {
                if (
                    value.code === "LB" &&
                    value.availableMethods &&
                    value.availableMethods[0].methodCode
                ) {
                    type = value.availableMethods[0].methodCode;
                    this.setState({
                        currentWithdrawType: "DEFAULT",
                    });
                    break;
                } else {
                    currentKey = list[0].code;
                }
            }
            this.setCurrentWithdrawMethod(currentKey, type);
        });
    }

    setCurrentWithdrawMethod(key, type) {
        this.setState({ currentWithdrawKey: key });
        console.log("keytype:", key, type);
        switch (key) {
            case "LB":
                Pushgtagdata("Withdrawal Nav", "Click", "LB_WithdrawPage");
                break;
            case "CCW":
                Pushgtagdata("Withdrawal Nav", "Click", "Crypto_WithdrawPage");
                break;
            case "APW":
                Pushgtagdata(
                    "Withdrawal Nav",
                    "Click",
                    "AstroPay_WithdrawPage",
                );
                break;
        }
    }

    toggleDepositList(status) {
        this.toggleWithdrawList(false);
        if (status === DEPOSIT && this.props.dialogTabKey.type !== DEPOSIT) {
            this.currentModalMap.type = DEPOSIT;
            this.props.setModalTabKey(this.currentModalMap);
        }
        const currentWrapRef = this.depositListWrapRef.current;
        const currWrapHeight = currentWrapRef.clientHeight;
        const currHeight = this.depositListRef.current.clientHeight;
        switch (status) {
            case true:
                this.setState({ depositDownOpen: true });
                currentWrapRef.style.height = currHeight + "px";
                break;
            case false:
                this.setState({ depositDownOpen: false });
                currentWrapRef.style.height = 0;
                break;
            default:
                this.setState({ depositDownOpen: !currWrapHeight });
                currentWrapRef.style.height = currWrapHeight
                    ? 0
                    : currHeight + "px";
                break;
        }

        status === DEPOSIT && Pushgtagdata("Deposit_wallet");
    }

    toggleWithdrawList(status) {
        this.depositListWrapRef.current.style.height = 0;
        this.setState({ depositDownOpen: false });
        if (status === WITHDRAW && this.props.dialogTabKey.type !== WITHDRAW) {
            this.currentModalMap.type = WITHDRAW;
            this.props.setModalTabKey(this.currentModalMap);
        }
        const currentWrapRef = this.withdrawListWrapRef.current;
        const currWrapHeight = currentWrapRef.clientHeight;
        const currHeight = this.withdrawListRef.current.clientHeight;
        switch (status) {
            case true:
                this.setState({ withdrawDownOpen: true });
                currentWrapRef.style.height = currHeight + "px";
                break;
            case false:
                this.setState({ withdrawDownOpen: false });
                currentWrapRef.style.height = 0;
                break;
            default:
                this.setState({ withdrawDownOpen: !currWrapHeight });
                currentWrapRef.style.height = currWrapHeight
                    ? 0
                    : currHeight + "px";
                break;
        }

        status === WITHDRAW && Pushgtagdata("Withdraw_wallet");
    }

    changeTab(tabName) {
        this.currentModalMap.type = tabName;
        this.props.setModalTabKey(this.currentModalMap);
        this.toggleDepositList(false);
        this.toggleWithdrawList(false);
        switch (tabName) {
            case "transfer":
                Pushgtagdata("Transfer_wallet");
                break;
            default:
                break;
        }
    }
    setPromptInfo(str) {
        if (!str) return;
        this.setState({ promptInfo: str });
        this.promptTimer = setTimeout(() => {
            this.setState({ promptInfo: "" });
        }, 2000);
    }
    render() {
        let contentComponent;
        switch (this.props.dialogTabKey.type) {
            case DEPOSIT:
                contentComponent = (
                    <DepositPage
                        visible={this.props.visible}
                        setLoading={this.props.setLoading}
                        dialogTabKey={this.props.dialogTabKey}
                        payMethodList={this.state.payMethodList}
                        goUserCenter={this.props.goUserCenter}
                        onCancel={this.props.onCancel}
                        currentDepositKey={this.state.currentDepositKey}
                        setPayList={this.setPayList}
                        bcPayList={this.bcTypeList}
                        setCurrentPayMethod={this.setCurrentPayMethod}
                        setPromptInfo={this.setPromptInfo}
                        isDeShowBankCardVerif={this.state.isDeShowBankCardVerif}
                        setIsDeShowBankCardVerif={(v) => {
                            this.setState({ isDeShowBankCardVerif: v });
                        }}
                        GetThroughoutVerification={() => {
                            this.props.GetThroughoutVerification();
                        }}
                        bonusDetail={this.props.bonusDetail}
                    />
                );
                break;
            case "withdraw":
                contentComponent = (
                    <Withdrawal
                        visible={this.props.visible}
                        setLoading={this.props.setLoading}
                        getBalance={this.props.getBalance}
                        goUserCenter={this.props.goUserCenter}
                        goDeposit={this.toggleDepositList}
                        onCancel={this.props.onCancel}
                        setLearnType={(type) => {
                            this.setState({ showLearnType: type });
                        }}
                        setWithdrawList={this.setWithdrawList}
                        withdrawMethodsList={this.state.withdrawMethodsList}
                        setCurrentWithdrawMethod={this.setCurrentWithdrawMethod}
                        currentWithdrawKey={this.state.currentWithdrawKey}
                        dialogTabKey={this.props.dialogTabKey}
                        currentWithdrawType={this.state.currentWithdrawType}
                        currentModalMap={this.currentModalMap}
                        goTransfer={this.changeTab}
                        promptsAfterBoot={this.state.promptsAfterBoot}
                        setPromptsAfterBoot={(v) => {
                            this.setState({ promptsAfterBoot: v });
                        }}
                    />
                );
                break;
            case "transfer":
                contentComponent = (
                    <Transfer
                        visible={this.props.visible}
                        onCancel={this.props.onCancel}
                        setLoading={this.props.setLoading}
                        getBalance={this.props.getBalance}
                        balanceList={this.props.balanceList}
                        setLearnType={(type) => {
                            this.setState({ showLearnType: type });
                        }}
                        promptsAfterBoot={this.state.promptsAfterBoot}
                        setPromptsAfterBoot={(v) => {
                            this.setState({ promptsAfterBoot: v });
                        }}
                        goDeposit={this.toggleDepositList}
                        bonusDetail={this.props.bonusDetail}
                    />
                );
                break;
            default:
                contentComponent = null;
                break;
        }
        return (
            <React.Fragment>
                {/* {!!this.state.showLearnType ? (
					<div className={`wallet-learn-wrap ${this.state.showLearnType}`}>
						<button className="learn-knew" onClick={this.closeLearn} />
					</div>
				) : null} */}
                <div className="wallet-wrap">
                    {!!this.state.promptInfo ? (
                        <div className="prompt-center-box">
                            {this.state.promptInfo}
                        </div>
                    ) : null}
                    <div className="wallet-nav-wrap">
                        <div
                            className={`wallet-nav-item border-clear ${
                                this.state.depositDownOpen ? " open" : " close"
                            }`}
                            onClick={() => this.toggleDepositList(DEPOSIT)}
                        >
                            {translate("存款")}
                            <img
                                className="anticon"
                                src={`${process.env.BASE_PATH}/img/wallet/icon-arrow-up.svg`}
                            />
                        </div>
                        <div
                            className="deposit-list-wrap"
                            ref={this.depositListWrapRef}
                        >
                            <div
                                className="deposit-list"
                                ref={this.depositListRef}
                            >
                                {this.props.dialogTabKey.type === DEPOSIT ? (
                                    <Methods />
                                ) : null}
                            </div>
                        </div>
                        <div
                            className={`wallet-nav-item border-clear ${
                                this.state.withdrawDownOpen ? " open" : " close"
                            }`}
                            onClick={() => this.toggleWithdrawList(WITHDRAW)}
                        >
                            {translate("提款")}
                            <img
                                className="anticon"
                                src={`${process.env.BASE_PATH}/img/wallet/icon-arrow-up.svg`}
                            />
                        </div>
                        <div
                            className="deposit-list-wrap"
                            ref={this.withdrawListWrapRef}
                        >
                            <div
                                className="deposit-list"
                                ref={this.withdrawListRef}
                            >
                                {this.state.withdrawMethodsList.map(
                                    (val, idx) => {
                                        return (
                                            <div
                                                key={val.code + idx}
                                                className={`deposit-item ${val.isFast ? "isFast" : val.isNew ? "isNew" : ""}
                                                    ${this.state.currentWithdrawKey === val.code ? " active" : ""}`}
                                                onClick={() => {
                                                    this.setCurrentWithdrawMethod(
                                                        val.code,
                                                    );
                                                }}
                                            >
                                                <i
                                                    className={`deposit-sprite ${val.code}`}
                                                />
                                                <span>{val.name}</span>
                                            </div>
                                        );
                                    },
                                )}
                            </div>
                        </div>

                        <div
                            className={`wallet-nav-item${
                                this.props.dialogTabKey.type === "transfer"
                                    ? " active"
                                    : ""
                            }`}
                            onClick={() => this.changeTab("transfer")}
                        >
                            {translate("转账")}
                            <img
                                className="anticon"
                                src={`${process.env.BASE_PATH}/img/wallet/icon-arrow-up.svg`}
                            />
                        </div>
                    </div>
                    <div className="wallet-content-wrap">
                        {contentComponent}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
const mapStateToProps = (state) => ({
    Methods: state.Methods,
    MethodsActive: state.MethodsActive,
});
export default connect(mapStateToProps, null)(ModalRedirector(Main));
