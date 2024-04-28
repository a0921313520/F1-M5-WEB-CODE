import React from "react";
import { Radio, Select, Icon, Button } from "antd";
import moment from "moment";
import { GetPayList, GetWithdrawalMethods } from "$DATA/wallet";
import { get } from "$ACTIONS/TlcRequest";
import { ApiPort, APISETS } from "$ACTIONS/TLCAPI";
import DateRange from "@/DateRange";
import DepsoitRecords from "./DepositRecords";
import TransferRecords from "./TransferRecords";
import WithdrawRecords from "./WithdrawRecords";
import { LEARN_TIME } from "$ACTIONS/constantsData";
import { Cookie } from "$ACTIONS/util";
import Router from "next/router";
import {translate} from "$ACTIONS/Translate";
import { connect } from "react-redux";
import { userCenterActions } from "$STORE/userCenterSlice";

const { Option } = Select;
import { CaretDownOutlined } from "@ant-design/icons";
class Records extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filterType: sessionStorage.getItem("selectTabKey")
                ? sessionStorage.getItem("selectTabKey")
                : "deposit", // 查询类型
            formAccountCode: "", // 来源账户Code值
            toAccountCode: "", // 目标账户Code值
            methodValue: "", // 充值方法Code值
            withdrawMethodValue: "", // 提款方法Code值
            payMethods: [], // 充值方法
            withdrawMethodsList: [],
            recordsData: [], // 充值记录
            withdrawData: [], // 提款记录
            transferData: [], // 转账记录
            visibleDateRange: false, // 自定义时间范围
            definedDate: {
                startTime: moment()
                    .day(moment().day() - 6)
                    .format("YYYY-MM-DD"),
                endTime: moment().format("YYYY-MM-DD"),
            }, // 自定义时间值
            isShowLearnMask: false, // 是否显示交易记录教程
            alertInfo: "", // 充值记录提示信息
        };

        this.handleChange = this.handleChange.bind(this); // 改变充值方式获取记录
        this.handleWithdrawChange = this.handleWithdrawChange.bind(this); // 改变提款方式获取记录
        this.handleTranserChange = this.handleTranserChange.bind(this); // 改变来源、目标账户获取记录
        this.getTypeList = this.getTypeList.bind(this); // 自定义日期组件公用方法
        this.getRecordslist = this.getRecordslist.bind(this); // 获取充值记录
        this.getWithdrawlist = this.getWithdrawlist.bind(this); // 获取提款记录
        this.changeFilterType = this.changeFilterType.bind(this); // 改变筛选类型（充值、提款、转账）
        this.closeLearn = this.closeLearn.bind(this);
        this.recordInfoTimer = null;

        (this.fromWalletList = []), // 来源账户列表
            (this.toWalletList = []), // 目标账户列表
            (this.isFinishFrontData = []); // 是否已获取完成当前Page所需前置数据
    }
    componentDidMount() {
        this.props.setLoading(true);

        // 强制切换记录界面分类方法公用化
        global.changeRecordFilterType = (type) => {
            this.changeFilterType(type);
        };

        // 获取充值方式
        GetPayList((res) => {
            if (res.result && res.result.paymentMethods.length) {
                this.setState({
                    payMethods: [{ code: "", name: translate("全部") }].concat(
                        res.result.paymentMethods
                    ),
                });
            }
        });

        // 获取提款方式
        GetWithdrawalMethods((res) => {
            if (res.result && res.result.paymentMethods.length) {
                this.setState({
                    withdrawMethodsList: [{ code: "", name: translate("全部") }].concat(
                        res.result.paymentMethods
                    ),
                });
            }
        });

        if (sessionStorage.getItem("selectTabKey") === "deposit") {
            this.getRecordslist(true);
        } else if (sessionStorage.getItem("selectTabKey") === "withdraw") {
            this.getWithdrawlist(true);
        } else if (sessionStorage.getItem("selectTabKey") === "transfer") {
            this.getTransferlist(true);
        } else {
            this.getRecordslist(true);
        }

        let learnStepString = Cookie("learnStep");
        // typeof learnStepString === "string" &&
        //     learnStepString.substr(4, 1) === "0" &&
        // this.setState({ isShowLearnMask: true });
        global.Pushgtagpiwikurl &&
            global.Pushgtagpiwikurl("transaction_record");
    }
    componentDidUpdate(prevProps, prevState) {
        if (
            prevState.alertInfo !== this.state.alertInfo &&
            this.state.alertInfo
        ) {
            this.recordInfoTimer = setTimeout(() => {
                this.setState({ alertInfo: "" });
            }, 3000);
        }
        //在交易记录页进行充值/提款/转账 操作完成相对应操作后点击去交易记录按钮的判断
        if(prevProps.refreshCurrentPage !== this.props.refreshCurrentPage){
            ["deposit","withdraw","transfer"].some((item) => item === this.props.refreshCurrentPage) && this.changeFilterType(this.props.refreshCurrentPage);
        }
    }
    componentWillUnmount() {
        clearTimeout(this.recordInfoTimer);
        this.setState = () => false
    }
    closeLearn() {
        this.setState({ isShowLearnMask: false });
        // 设置开启的记录
        let LearnArr = Cookie("learnStep").split("");
        LearnArr.splice(4, 1, "1");
        Cookie("learnStep", LearnArr.join(""), { expires: LEARN_TIME });
        Pushgtagdata("Transactionrecord_userguide");
    }
    getTypeList() {
        switch (this.state.filterType) {
            case "deposit":
                this.getRecordslist();
                break;
            case "withdraw":
                this.getWithdrawlist();
                break;
            case "transfer":
                this.getTransferlist();
                break;
            default:
                break;
        }
    }
    /**
     * 获取充值记录
     * @param {boolean} isLoad 是否是第一次加载
     * @param {function} call 获取成功回调函数
     */
    getRecordslist(isLoad, call) {
        this.props.setLoading(true);
        // let newLen = null;
        // isLoad && (newLen = this.isFinishFrontData.push(0));

        get(
            ApiPort.BankingHistory +
                "&transactionType=Deposit&dateFrom=" +
                this.state.definedDate.startTime +
                "&dateTo=" +
                this.state.definedDate.endTime +
                (this.state.methodValue
                    ? "&method=" + this.state.methodValue
                    : "")
        )
            .then((res) => {
                if (res && res.result) {
                    this.setState({
                        recordsData: res.result,
                    });
                    typeof call === "function" && call();
                }
                this.props.setLoading(false);
                // if (isLoad) {
                //     this.isFinishFrontData.splice(newLen - 1, 1, 1);
                //     this.isFinishFrontData.length &&
                //         !~this.isFinishFrontData.indexOf(0) &&
                //         this.props.setLoading(false);
                // } else {
                //     this.props.setLoading(false);
                // }
            })
            .catch((error) => {
                console.log("BankingHistory", error);
            });
        // this.props.setLoading(false);
    }
    /**
     * 获取提款记录
     * @param {function} call 
     */
    getWithdrawlist(call) {
        this.props.setLoading(true);
        get(
            ApiPort.BankingHistory +
                "&transactionType=Withdrawal&dateFrom=" +
                this.state.definedDate.startTime +
                "&dateTo=" +
                this.state.definedDate.endTime +
                (this.state.withdrawMethodValue
                    ? "&method=" + this.state.withdrawMethodValue
                    : "")
        )
            .then((res) => {
                if (res && res.result) {
                    this.setState({
                        withdrawData: res.result,
                    });
                    typeof call === "function" && call();
                }
                this.props.setLoading(false);
            })
            .catch((error) => {
                console.log("GETWithdrawalReport" + error);
            });
    }
    /**
     * 获取转账记录
     * @param {function} call 
     */
    getTransferlist(call) {
        this.props.setLoading(true);
        get(
            ApiPort.GETTransferReport +
                "?dateFrom=" +
                this.state.definedDate.startTime +
                " 00:00:00.000&dateTo=" +
                this.state.definedDate.endTime +
                " 23:59:59.997" +
                APISETS
        )
            .then((res) => {
                if (res && res.result) {
                    this.setState({
                        transferData: res.result,
                    });
                    typeof call === "function" && call();
                }
                this.props.setLoading(false);
            })
            .catch((error) => {
                console.log("GETTransferReport", error);
            });
    }
    handleChange(val) {
        this.setState({ methodValue: val }, () => {
            this.getRecordslist();
        });
        switch (val) {
            case "CTC":
                Pushgtagdata("CDC_sorting_deposit");
                break;
            case "JDP":
                Pushgtagdata("JDwallet_sorting_deposit");
                break;
            case "UP":
                Pushgtagdata("Unionpay_sorting_deposit");
                break;
            case "LB":
                Pushgtagdata("Localbankpay_sorting_deposit");
                break;
            case "BCM":
                Pushgtagdata("Localbankexpress_sorting_deposit");
                break;
            case "ALB":
                Pushgtagdata("LocalAlipay_sorting_deposit");
                break;
            case "OA":
                Pushgtagdata("OnlineAlipay_sorting_deposit");
                break;
            case "WCLB":
                Pushgtagdata("LocalWechatpay_sorting_deposit");
                break;
            case "WC":
                Pushgtagdata("OnlineWechatpay_sorting_deposit");
                break;
            case "QQ":
                Pushgtagdata("OnlineQQpay_sorting_deposit");
                break;
            case "AP":
                Pushgtagdata("Astropay_sorting_deposit");
                break;
            case "CC":
                Pushgtagdata("TLCcard_sorting_deposit");
                break;
            case "PPB":
                Pushgtagdata("P2Pbanking_sorting_deposit");
                break;
            case "":
                Pushgtagdata("All_sorting_deposit");
                break;
            default:
                break;
        }
    }
    handleWithdrawChange(val) {
        this.setState({ withdrawMethodValue: val }, () => {
            this.getWithdrawlist();
        });
        switch (val) {
            case "LB":
                Pushgtagdata("Localbankpay_withdrawal_sorting");
                break;
            case "":
                Pushgtagdata("All_withdrawal_sorting");
                break;
            default:
                break;
        }
    }
    handleTranserChange(type, val) {
        this.setState({ [type]: val }, () => {
            this.getTransferlist();
        });
        switch (val) {
            case "MAIN":
                Pushgtagdata(
                    type === "formAccountCode"
                        ? "Main_from_sorting_transfer"
                        : "Main_to_sorting_transfer"
                );
                break;
            case "SB":
                Pushgtagdata(
                    type === "formAccountCode"
                        ? "BTiIMSPIMESTF_from_sorting_transfer"
                        : "BTiIMSPIMESTF_to_sorting_transfer"
                );
                break;
            case "SP":
                Pushgtagdata(
                    type === "formAccountCode"
                        ? "SPsport_from_sorting_transfer"
                        : "SPsport_to_sorting_transfer"
                );
                break;
            case "P2P":
                Pushgtagdata(
                    type === "formAccountCode"
                        ? "KYGP2P_from_sorting_transfer"
                        : "KYGP2P_to_sorting_transfer"
                );
                break;
            case "VR":
                Pushgtagdata(
                    type === "formAccountCode"
                        ? "VRkeno_from_sorting_transfer"
                        : "VRkeno_to_sorting_transfer"
                );
                break;
            case "KYG":
                Pushgtagdata(
                    type === "formAccountCode"
                        ? "KYG_from_sorting_transfer"
                        : "KYG_to_sorting_transfer"
                );
                break;
            case "LD":
                Pushgtagdata(
                    type === "formAccountCode"
                        ? "Live_from_sorting_transfer"
                        : "Live_to_sorting_transfer"
                );
                break;
            case "SLOT":
                Pushgtagdata(
                    type === "formAccountCode"
                        ? "Slot_from_sorting_transfer"
                        : "Slot_to_sorting_transfer"
                );
                break;
            case "PT":
                Pushgtagdata(
                    type === "formAccountCode"
                        ? "PT_from_sorting_transfer"
                        : "PT_to_sorting_transfer"
                );
                break;
            case "BOY2":
                Pushgtagdata(
                    type === "formAccountCode"
                        ? "BoleP2P_from_sorting_transfer"
                        : "BoleP2P_to_sorting_transfer"
                );
                break;
            case "KENO":
                Pushgtagdata(
                    type === "formAccountCode"
                        ? "BYkeno_from_sorting_transfer"
                        : "BYkeno_to_sorting_transfer"
                );
                break;
            case "AG":
                Pushgtagdata(
                    type === "formAccountCode"
                        ? "Fishing2slot_from_sorting_transfer"
                        : "Fishing2slot_to_sorting_transfer"
                );
                break;
            case "":
                Pushgtagdata(
                    type === "formAccountCode"
                        ? "All_from_sorting_transfer"
                        : "All_to_sorting_transfer"
                );
                break;
            default:
                break;
        }
    }
    changeFilterType(e) {
        const tempVal = typeof e === "string" ? e : e.target.value;
        sessionStorage.setItem("selectTabKey", tempVal);
        switch (tempVal) {
            case "deposit":
                this.getRecordslist(false, () => {
                    this.setState({ filterType: tempVal });
                });
                Pushgtagdata(
                    "Transaction Record",
                    "View",
                    "Deposit_TransactionRecord"
                );
                break;
            case "withdraw":
                this.getWithdrawlist(() => {
                    this.setState({ filterType: tempVal });
                });
                Pushgtagdata(
                    "Transaction Record",
                    "View",
                    "Ｗithdrawal_TransactionRecord​"
                );
                break;
            case "transfer":
                this.getTransferlist(() => {
                    this.setState({ filterType: tempVal });
                });
                Pushgtagdata(
                    "Transaction Record",
                    "View",
                    "Transfer_TransactionRecord​"
                );
                break;
            default:
                break;
        }
    }

    /**
     * 跳转page
     * @param {*} key 
     */
    navigationPage=(key)=>{
        switch(key){
            case "uploadFiles":
                this.props.changeUserCenterTabKey(key);
                Router.push("/me/upload-files");
                break;
            default:
                break;
        }
    }

    render() {
        return (
            <React.Fragment>
                {/* {this.state.isShowLearnMask ? (
                    <div className="usercenter-mask records">
                        <button
                            className="learn-knew"
                            onClick={this.closeLearn}
                        ></button>
                    </div>
                ) : null} */}
                {this.state.alertInfo ? (
                    <div className="t-alert-mask">
                        <div className="tHistorySuccess">
                            <img
                                style={{
                                    marginRight: "0.2rem",
                                    marginBottom: "0.15rem",
                                }}
                                src={`${process.env.BASE_PATH}/img/icon/greenTick.svg`}
                            />{" "}
                            {this.state.alertInfo}
                        </div>
                    </div>
                ) : null}
                <div className="account-wrap records">
                    <h2>
                        {translate("交易记录")}
                        {/* <a
                            className="usercenter-title-link"
                            onClick={() => {
                                Router.push(
                                "/help?type=Sub1&key=" + CMSOBJ[HostConfig.CMS_ID][27]
                                );
                                Pushgtagdata("Tutorial_myreward_profilepage");
                            }}
                            >
                            查看操作教学
                            </a> */}
                    </h2>
                    <div className="message-button">
                        <div className="usercenter-title-brief">
                            <Radio.Group
                                defaultValue="1"
                                buttonStyle="solid"
                                value={this.state.filterType}
                                onChange={this.changeFilterType}
                            >
                                <Radio.Button value="deposit">
                                    {translate("存款")}
                                </Radio.Button>
                                <Radio.Button value="transfer">
                                    {translate("转账")}
                                </Radio.Button>
                                <Radio.Button value="withdraw">
                                    {translate("提款")}
                                </Radio.Button>
                            </Radio.Group>
                        </div>
                        <div className="usercenter-title-tools">
                            {this.state.filterType === "deposit" &&
                            this.state.payMethods.length ? (
                                <Select
                                    suffixIcon={<CaretDownOutlined />}
                                    dropdownClassName="small-option"
                                    value={this.state.methodValue}
                                    dropdownStyle={{ width: 125, zIndex: 1 }}
                                    onFocus={() => {
                                        Pushgtagdata(
                                            "Sorting_deposit_transactionrecord"
                                        );
                                    }}
                                    onChange={this.handleChange}
                                >
                                    {this.state.payMethods.map((value) => {
                                        return (
                                            <Option
                                                key={"deposit" + value.code}
                                                value={value.code}
                                            >
                                                {value.code === "BC"
                                                    ? "网银支付"
                                                    : value.code === "BCM"
                                                    ? "快捷支付"
                                                    : value.name}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            ) : null}
                            {this.state.filterType === "withdraw" &&
                            this.state.withdrawMethodsList.length ? (
                                <Select
                                    suffixIcon={<CaretDownOutlined />}
                                    dropdownClassName="small-option"
                                    value={this.state.withdrawMethodValue}
                                    dropdownStyle={{ width: 125, zIndex: 1 }}
                                    onFocus={() => {
                                        Pushgtagdata(
                                            "Sorting_withdrawal_transactionrecord"
                                        );
                                    }}
                                    onChange={this.handleWithdrawChange}
                                >
                                    {this.state.withdrawMethodsList.map(
                                        (value) => {
                                            return (
                                                <Option
                                                    key={
                                                        "withdraw" + value.code
                                                    }
                                                    value={value.code}
                                                >
                                                    {value.name}
                                                </Option>
                                            );
                                        }
                                    )}
                                </Select>
                            ) : null}
                            <div
                                className="defined-time-wrap ant-calendar-picker-input ant-input"
                                style={{ margin: "0 0 0 10px" }}
                                onClick={() => {
                                    this.setState({ visibleDateRange: true });
                                }}
                            >
                                <span>{moment(this.state.definedDate.startTime).format("DD-MM-YYYY")}</span>
                                <Icon type="swap-right" />
                                <span>{moment(this.state.definedDate.endTime).format("DD-MM-YYYY")}</span>
                                <Icon type="calendar" />
                            </div>
                        </div>
                    </div>
                    {this.state.filterType === "deposit" ? (
                        <DepsoitRecords
                            memberInfo={this.props.memberInfo}
                            setLoading={this.props.setLoading}
                            recordsData={this.state.recordsData}
                            getRecordslist={this.getRecordslist}
                            recordAlert={(v) => {
                                this.setState({ alertInfo: v });
                            }}
                        />
                    ) : null}
                    {this.state.filterType === "withdraw" ? (
                        <WithdrawRecords
                            setLoading={this.props.setLoading}
                            withdrawData={this.state.withdrawData}
                            getWithdrawlist={this.getWithdrawlist}
                            getBalance={this.props.getBalance}
                            recordAlert={(v) => {
                                this.setState({ alertInfo: v });
                            }}
                            setChangeFilterType={this.changeFilterType}
                            navigationPage={this.navigationPage}
                        />
                    ) : null}
                    {this.state.filterType === "transfer" ? (
                        <TransferRecords
                            recordAlert={(v) => {
                                this.setState({ alertInfo: v });
                            }}
                            transferData={this.state.transferData}
                        />
                    ) : null}
                    <DateRange
                        classNameDatePicker="recordDateRange"
                        classNameModal="rebate-time-picker-modal promotion-modal"
                        title={translate("选择时间")}
                        dateRangeLimit={6}
                        visible={this.state.visibleDateRange}
                        closeRange={() => {
                            this.setState({ visibleDateRange: false });
                        }}
                        setDate={(v) => {
                            this.setState({ definedDate: v }, () => {
                                this.getTypeList();
                            });
                        }}
                    />
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = function (state) {
    return {
        refreshCurrentPage: state.userCenter.refreshCurrentPage,
    }
}
const mapDispatchToProps = function (dispatch) {
    return {
        changeUserCenterTabKey:(key)=>{
            dispatch(userCenterActions.changeUserCenterTabKey(key))
        }
    };
};
export default connect(mapStateToProps,mapDispatchToProps)(Records);
