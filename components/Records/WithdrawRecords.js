import React from "react";
import {
    Row,
    Col,
    Pagination,
    Button,
    Icon,
    Empty,
    Modal,
    message,
} from "antd";
import { get, post } from "$ACTIONS/TlcRequest";
import { ApiPort, APISET, APISETS } from "$ACTIONS/TLCAPI";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { formatYearMonthDate, formatAmount } from "$ACTIONS/util";
import SmallCountDown from "@/Records/SmallCountDown";
import { translate } from "$ACTIONS/Translate";

class WithdrawRecords extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentList: [], // 当前显示的数据
            currentPage: 1,
            statusId: -1, // 当前列状态展开元素
            visible: false,
            transactionId: "", //交易id
            subId: "",
            subAmt: "",
            showlist: false,
            showSubMithdrawModal: false,
            showSubMithdrawRes: "",
        };

        this.NoCancellation = this.NoCancellation.bind(this); // 撤销提款
        this.formatRecords = this.formatRecords.bind(this); // 格式化提款记录
        this.changePage = this.changePage.bind(this); // 改变页数
        this.onePageSize = 10;

        // 提现记录备注按钮信息
        this.btnsInfo = [
            {
                id: "Cancel",
                text: translate("取消提款"),
                type: "primary",
                ghost: false,
                piwik: [
                    "Transaction Record",
                    "Click",
                    "Cancel_Withdraw_TransactionRecord",
                ],
            },
            // { id: "isSubmitNewTrans", text: "再次提款", type: "default", ghost: false },
            {
                id: "isContactCS",
                text: translate("在线客服"),
                type: "primary",
                ghost: true,
                piwik: ["CS", "Click", "LiveChat_TransactionRecord"],
            },
            // {
            //     id: "ConfirmReceipt",
            //     text: "确认到账",
            //     type: "confirmReceipt",
            //     ghost: false,
            //     piwik: [
            //         "Transaction Record",
            //         "Click",
            //         "ConfirmReceipt_TransactionRecord",
            //     ],
            // },
            {
                id: "isUploadDocument",
                text: translate("上传收据"),
                type: "primary",
                ghost: false,
                piwik: [],
            },
        ];
    }
    componentDidMount() {
        this.props.withdrawData.length && this.formatRecords();
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.withdrawData !== this.props.withdrawData) {
            this.formatRecords();
        }
    }
    NoCancellation(id, Amount) {
        this.props.setLoading(true);
        post(`${ApiPort.POSTNoCancellation}${APISET}&transactionId=${id}`, {
            transactionType: "Withdrawal",
            remark: "test",
            amount: Amount,
        })
            .then((res) => {
                if (res.isSuccess == true) {
                    this.props.getBalance(() => {
                        this.props.getWithdrawlist(this.formatRecords);
                        this.props.recordAlert("提现申请已取消"); // TODO response.errors is an Array
                    });
                } else {
                    this.props.recordAlert(res.errors || "撤销申请提交失败");
                }
            })
            .catch((error) => {
                console.log("POSTNoCancellation" + error);
            })
            .finally(() => {
                this.props.setLoading(false);
            });
    }
    formatRecords() {
        this.props.withdrawData.forEach((val) => {
            val.pendingDateTimeTo = formatYearMonthDate(val.pendingDateTime);
            val.processingDatetimeTo = formatYearMonthDate(
                val.processingDateTime,
            );
            val.approvedDatetimeTo = formatYearMonthDate(val.approvedDateTime);
            val.rejectedDateTimeTo = formatYearMonthDate(val.rejectedDateTime);
            val.submittedAtTo = formatYearMonthDate(val.submittedAt);
            switch (val.statusId) {
                case 1:
                    val.processOn = true;
                    val.statusName = translate("待处理");
                    val.statusType = "r-pending";
                    val.resultTimeTo = val.pendingDateTimeTo;
                    // 待处理状态手动判定
                    val.Cancel = true;
                    break;
                case 2:
                case 3:
                case 7:
                case 8:
                case 9:
                    val.processOn = true;
                    val.statusName = translate("处理中");
                    val.statusType = "r-process";
                    val.resultTimeTo = val.processingDatetimeTo;
                    if (val.isAbleCompleteFromUI) {
                        // val.ConfirmReceipt = true;
                    }
                    break;
                case 4:
                    val.statusName = translate("成功");
                    val.statusType = "r-success";
                    val.resultTimeTo = val.approvedDatetimeTo;
                    break;
                case 5:
                    val.statusName = translate("失败​");
                    val.statusType = "r-error";
                    // 根据Api文档失败是使用rejectedDateTime，为了避免空白，多一个备用时间
                    val.resultTimeTo =
                        val.rejectedDateTimeTo || val.approvedDatetimeTo;
                    break;
                case 6:
                    //已取消
                    val.statusName = translate("失败2");
                    val.statusType = "r-error";
                    val.resultTimeTo =
                        val.rejectedDateTimeTo || val.approvedDatetimeTo;
                    break;
                case 10:
                    val.statusName = "部分成功";
                    val.statusType = "r-success";
                    val.resultTimeTo = val.approvedDatetimeTo;
                    break;
                default:
                    val.statusName = "";
                    val.statusType = "";
                    break;
            }

            switch (val.paymentMethodId) {
                case "LB":
                    val.name = val.paymentMethodName;
                    break;
                case "CCW":
                    val.name = val.paymentMethodName;
                    break;
                default:
                    val.name = val.paymentMethodName || "";
                    break;
            }
            // val.Cancel=true;
            // val.isContactCS=true
            // val.ConfirmReceipt=true
            // val.isUploadDocument = true;
            const {
                Cancel,
                isContactCS,
                // ConfirmReceipt,
                isUploadDocument,
            } = val;
            const btns = {
                Cancel,
                isContactCS,
                // ConfirmReceipt,
                isUploadDocument,
            };
            val.btns = Object.keys(btns).filter((ele) => btns[ele]);
        });

        const currPage =
            typeof this.state.currentPage === "number"
                ? this.state.currentPage - 1
                : 0;
        let startIndex = currPage * this.onePageSize;
        this.setState({
            currentList: this.props.withdrawData.slice(
                startIndex,
                startIndex + this.onePageSize,
            ), // 当前展示数据
        });
    }
    changePage(index) {
        const currPage = typeof index === "number" ? index - 1 : 0;
        let startIndex = currPage * this.onePageSize; // 当前起始下标
        this.setState({
            statusId: -1, // 切换页面时恢复充值状态栏位打开状态
            currentPage: index,
            currentList: this.props.withdrawData.slice(
                startIndex,
                startIndex + this.onePageSize,
            ), // 当前展示数据
        });
    }
    GetTransactionDetail = (recordItem) => {
        this.props.setLoading(true);
        get(
            ApiPort.GetTransactionDetail +
                "&transactionID=" +
                recordItem.transactionId +
                "&transactionType=Withdrawal",
        )
            .then((res) => {
                this.props.setLoading(false);
                if (!!res && res.result) {
                    Modal.info({
                        icon: null,
                        centered: true,
                        title: translate("交易明细"),
                        className: "blueHeaderModal dont-show-close-button",
                        content: (
                            <ul className="t-resubmit-list">
                                {recordItem.paymentMethodId === "CCW" ? (
                                    <>
                                        <li>
                                            <div>{translate("金额")}</div>
                                            <div>
                                                {formatAmount(
                                                    res.result.amount,
                                                )}{" "}
                                                đ
                                            </div>
                                        </li>
                                        <li>
                                            <div>{translate("汇率")}</div>
                                            <div>
                                                {translate("等级")} 1:
                                                1USDT-ERC20 = xxx,xxx.xx VND
                                                <br />
                                                {translate("等级")} 2:
                                                1USDT-ERC20 = xxx,xxx.xx VND
                                            </div>
                                        </li>
                                        {res.result.reasonMsg ? (
                                            <li className="t-resubmit-tip ">
                                                {res.result.reasonMsg || ""}
                                            </li>
                                        ) : null}
                                        <li>
                                            <div>{translate("钱包地址")}</div>
                                            <div>
                                                {res.result
                                                    .withdrawalWalletAddress ||
                                                    ""}
                                            </div>
                                        </li>
                                    </>
                                ) : null}

                                {recordItem.paymentMethodId === "LB" ? (
                                    <ul className="t-resubmit-list">
                                        <li>
                                            <div>
                                                {translate("账户持有者姓名")}
                                            </div>
                                            <div>
                                                {res.result.accountHolderName.replace(
                                                    /[^a-zA-Z ]/g,
                                                    "*",
                                                )}
                                            </div>
                                        </li>
                                        <li>
                                            <div>{translate("银行")}</div>
                                            <div>{res.result.bankName}</div>
                                        </li>
                                        <li>
                                            <div>{translate("金额")}</div>
                                            <div>
                                                <b>
                                                    ¥{" "}
                                                    {formatAmount(
                                                        res.result.amount,
                                                    )}{" "}
                                                    đ
                                                </b>
                                            </div>
                                        </li>
                                        {/* <li>
                                            <div>银行账号</div>
                                            <div>
                                                {res.result.withdrawalAccNumber.replace(
                                                    /\d(?=\d{3})/g,
                                                    "*"
                                                )}
                                            </div>
                                        </li>

                                        <li>
                                            <div>省/自治区</div>
                                            <div>
                                                {res.result.province
                                                    ? res.result.province
                                                    : "-"}
                                            </div>
                                        </li>
                                        <li>
                                            <div>城市/城镇</div>
                                            <div>
                                                {res.result.city
                                                    ? res.result.city
                                                    : "-"}
                                            </div>
                                        </li>
                                        <li>
                                            <div>分行</div>
                                            <div>
                                                {res.result.branch
                                                    ? res.result.branch
                                                    : "-"}
                                            </div>
                                        </li> */}
                                    </ul>
                                ) : null}
                            </ul>
                        ),
                        okText: translate("关闭"),
                    });
                }
            })
            .catch((err) => {
                this.props.setLoading(false);
                console.log(err);
            });
    };
    btnClick = (id, recordItem) => {
        switch (id) {
            case "Cancel":
                Modal.confirm({
                    icon: null,
                    centered: true,
                    title: translate("取消提款"),
                    content: (
                        <div>
                            {translate("您确定想取消该金额的提款")}{" "}
                            {formatAmount(recordItem.amount)} ?
                        </div>
                    ),
                    okText: translate("确定"),
                    cancelText: translate("不是"),
                    className: "confirm-modal-of-public",
                    onOk: () => {
                        this.NoCancellation(
                            recordItem.transactionId,
                            recordItem.amount,
                        );
                    },
                });
                break;
            // case "isSubmitNewTrans":
            //   global.showDialog({ key: 'wallet:{"type": "withdraw", "currentPayValue": "' + recordItem.paymentMethodId + '"}' });
            //   break;
            case "isContactCS":
                global.PopUpLiveChat();
                break;
            // case "ConfirmReceipt":
            // this.setState({
            //     transactionId: recordItem.transactionId,
            //     visible: true,
            // });
            // break;
            case "isUploadDocument":
                this.props.navigationPage("uploadFiles");
            default:
                break;
        }
    };

    /**
     * @param {*} 提现ID
     */
    confirmReceipt = () => {
        return;
        if (!this.state.transactionId) return;
        this.setState({ visible: false });
        let url = "";
        if (this.state.subId) {
            url =
                "?withdrawalId=" +
                this.state.transactionId +
                "&subWithdrawalId=" +
                this.state.subId +
                "&splitWithdrawalAmt=" +
                this.state.subAmt;
        } else {
            url = "?withdrawalId=" + this.state.transactionId;
        }
        this.props.setLoading(true);
        post(ApiPort.ConfirmWithdrawalComplete + url + APISETS)
            .then((res) => {
                this.props.setLoading(false);
                if (res && res.isSuccess) {
                    if (res.result.rebateAmount * 1 > 0) {
                        this.setState({ showSubMithdrawModal: false });
                        //有奖金
                        Modal.info({
                            title: "",
                            centered: true,
                            okText: "查看交易记录",
                            className: "confirmModalRecord",
                            closable: true,
                            content: (
                                <div>
                                    <i className="lbwicon-success">
                                        <img
                                            src={`${process.env.BASE_PATH}/img/icons/icon-checked.png`}
                                        />
                                    </i>
                                    <p>
                                        额外奖励 {res.result.rebateAmount}{" "}
                                        元已到账
                                        <br />
                                        可以前往交易记录里查询
                                    </p>
                                </div>
                            ),
                            onOk: () => {
                                this.props.setChangeFilterType("transfer");
                            },
                        });
                    } else {
                        //没有有奖金
                        message.success("确认到账", 2);
                        setTimeout(() => {
                            this.setState({ showSubMithdrawModal: false });
                        }, 2000);
                        // Modal.info({
                        //     title: ``,
                        //     centered: true,
                        //     content: `确认到账`,
                        //     className: "withdrawRecordsInfo-modal",
                        // });
                        // setTimeout(() => {
                        //     Modal.destroyAll();
                        // }, 2000);
                    }
                } else {
                    if (
                        res.ErrorCode === "P111003" ||
                        res.ErrorCode === "P111002"
                    ) {
                        Modal.info({
                            title: "",
                            centered: true,
                            okText: "联系在线客服",
                            className: "confirmModalRecord",
                            closable: true,
                            content: (
                                <div>
                                    <i className="lbwicon-success">
                                        <img
                                            src={`${process.env.BASE_PATH}/img/icons/icon-error.png`}
                                        />
                                    </i>
                                    {res.ErrorCode === "P111002" ? (
                                        <p>
                                            {res.ErrorMessage ||
                                                `确认到账更新失败，此笔交易仍在进行中。请确保您已收到提现金额后，再点击“确认到账”按钮。如需要任何协助，请联系在线客服。`}
                                        </p>
                                    ) : (
                                        <p>
                                            {res.ErrorMessage ||
                                                `系统错误，确认到账更新失败，请稍后再重试或联络在线客服。`}
                                        </p>
                                    )}
                                </div>
                            ),
                            onOk: () => {
                                global.PopUpLiveChat();
                            },
                        });
                    } else {
                        message.error(res.ErrorMessage || "");
                    }
                }
            })
            .catch((error) => {
                this.props.setLoading(false);
                console.log(error);
            });
        Pushgtagdata(
            "Transaction Record",
            "Submit",
            "Receive_SmallRiver_Withdrawal",
        );
    };

    getSubWithdrawal(id) {
        this.props.setLoading(true);
        get(
            ApiPort.SubWithdrawal +
                "/" +
                id +
                "/SubWithdrawalTransactionDetails" +
                APISET,
        )
            .then((res) => {
                this.props.setLoading(false);
                if (!!res && res.result) {
                    this.setState({
                        showSubMithdrawRes: res,
                        showSubMithdrawModal: true,
                    });
                }
            })
            .catch((err) => {
                this.props.setLoading(false);
                console.log(err);
            });
    }

    confirmSubWithdrawal(subId, subAmt, id) {
        this.setState({
            transactionId: id,
            visible: true,
            subId: subId,
            subAmt: subAmt,
        });
    }
    render() {
        let { showSubMithdrawRes } = this.state;
        let payoutMin =
            showSubMithdrawRes &&
            showSubMithdrawRes.result &&
            showSubMithdrawRes.result.PayoutDuration;
        let payoutTime;
        if (payoutMin && payoutMin < 60) {
            payoutTime = (
                <span>
                    <span style={{ color: "#00A6FF" }}>{payoutMin}</span>{" "}
                    {translate("分钟")}
                </span>
            );
        } else if (payoutMin && payoutMin / 60 >= 1) {
            if (payoutMin % 60 == 0) {
                payoutTime = (
                    <span>
                        <span style={{ color: "#00A6FF" }}>
                            {payoutMin / 60}
                        </span>{" "}
                        {translate("小时")}
                    </span>
                );
            } else {
                payoutTime = (
                    <span>
                        <span style={{ color: "#00A6FF" }}>
                            {parseInt(payoutMin / 60)}
                        </span>{" "}
                        {translate("小时")}{" "}
                        <span style={{ color: "#00A6FF" }}>
                            {payoutMin % 60}
                        </span>{" "}
                        {translate("分钟")}
                    </span>
                );
            }
        }
        return (
            <div className="records-list-wrap">
                {this.state.currentList.length ? (
                    <Row>
                        <Col span={4}>{translate("时间")}</Col>
                        <Col span={5}>{translate("交易方式")}</Col>
                        <Col span={3}>{translate("金额")}</Col>
                        <Col span={5}>{translate("状态")}</Col>
                        <Col span={7}>{translate("备注")}</Col>
                    </Row>
                ) : null}
                {this.state.currentList.length ? (
                    this.state.currentList.map((val, index) => {
                        return (
                            <Row key={index}>
                                <Col span={4} className="gray-color">
                                    {val.submittedAtTo}
                                </Col>
                                <Col span={5} className="left">
                                    <div>
                                        {val.name}
                                        <i
                                            className="record-info-icon pointer"
                                            onClick={() => {
                                                this.GetTransactionDetail(val);
                                            }}
                                        ></i>
                                    </div>
                                    <div>
                                        {val.transactionId}
                                        <CopyToClipboard
                                            text={val.transactionId}
                                            onCopy={() => {
                                                this.props.recordAlert(
                                                    translate("复制成功"),
                                                );
                                            }}
                                        >
                                            <img
                                                style={{
                                                    paddingLeft: "10px",
                                                    cursor: "pointer",
                                                }}
                                                src={`${process.env.BASE_PATH}/img/wallet/Copy_icon.svg`}
                                            />
                                        </CopyToClipboard>
                                    </div>
                                </Col>
                                <Col span={3} className="w-min-line-height">
                                    {(val.paymentMethodId !== "LB" ||
                                        (val.paymentMethodId == "LB" &&
                                            val.methodType ==
                                                "NormalProcessing")) &&
                                    val.paidAmount ? (
                                        <div>
                                            <p className="w-amount-tip">
                                                实际到账
                                            </p>
                                            <div>¥ {val.paidAmount}</div>
                                            <p className="w-amount-tip">
                                                提现申请
                                            </p>
                                            <div>¥ {val.amount}</div>
                                        </div>
                                    ) : val.paymentMethodId == "LB" &&
                                      (val.statusId == 2 ||
                                          val.statusId == 3 ||
                                          val.statusId == 7 ||
                                          val.statusId == 8 ||
                                          val.statusId == 9) ? (
                                        <div>
                                            <p className="w-amount-tip">
                                                处理中金额
                                            </p>
                                            <div>
                                                ¥{" "}
                                                {
                                                    val.processingSplitWithdrawalAmount
                                                }
                                            </div>
                                            <br />
                                            <p className="w-amount-tip">
                                                实际到账
                                            </p>
                                            <div>¥ {val.paidAmount}</div>
                                        </div>
                                    ) : (
                                        <span>¥ {val.amount}</span>
                                    )}
                                </Col>
                                <Col
                                    span={5}
                                    className={`left pointer ${
                                        val.statusType
                                    } ${(
                                        this.state.statusId === index
                                    ).toString()}`}
                                    onClick={() => {
                                        this.setState({
                                            statusId:
                                                this.state.statusId === index
                                                    ? -1
                                                    : index,
                                        });
                                    }}
                                >
                                    <div className="close">
                                        <div className="small-circle">
                                            {val.statusName}
                                        </div>
                                        <div className="small-sign">
                                            {val.resultTimeTo}
                                        </div>
                                    </div>
                                    {/* 待处理||处理中||部分成功 都属于未出现结果的类型 */}
                                    {val.processOn ? (
                                        <div
                                            className={`open _short _${
                                                val.statusType === "r-pending"
                                                    ? "1"
                                                    : "2"
                                            }`}
                                        >
                                            <div className="small-circle">
                                                {translate("待处理")}
                                            </div>
                                            <div className="small-sign">
                                                {val.pendingDateTimeTo}
                                            </div>
                                            {/* 提现申请部分成功也属于处理中，并且调用成功参数时间 */}
                                            <div className="small-circle">
                                                {translate("处理中")}
                                                {val.subTransactionCount
                                                    ? `(${val.subTransactionCount}/${val.totalTransactionCount})`
                                                    : ""}
                                            </div>
                                            <div className="small-sign">
                                                {val.statusType === "r-pending"
                                                    ? ""
                                                    : // : val.subTransactionCount && val.statusType !== "r-process"
                                                      // ? val.processingDatetimeTo
                                                      val.processingDatetimeTo}
                                            </div>
                                            <div className="small-circle 445">
                                                {translate("成功")}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="open _3">
                                            <div className="small-circle">
                                                {translate("待处理")}
                                            </div>
                                            <div className="small-sign">
                                                {val.pendingDateTimeTo}
                                            </div>
                                            <div className="small-circle">
                                                {translate("处理中")}
                                                {val.subTransactionCount
                                                    ? `(${val.subTransactionCount}/${val.totalTransactionCount})`
                                                    : ""}
                                            </div>
                                            <div className="small-sign">
                                                {val.processingDatetimeTo}
                                                {/* {val.subTransactionCount
                                                    ? val.approvedDatetimeTo
                                                    : val.processingDatetimeTo} */}
                                            </div>
                                            <div className="small-circle">
                                                {val.statusName}
                                            </div>
                                            <div className="small-sign">
                                                {val.resultTimeTo}
                                            </div>
                                        </div>
                                    )}
                                    <Icon type="right" />
                                </Col>
                                <Col span={7} className="record-distance">
                                    {val.reasonMsg != "" &&
                                        val.reasonMsgLine1 != "" && (
                                            <div
                                                className="reason-msg"
                                                style={{
                                                    textAlign:
                                                        val.reasonMsg &&
                                                        val.reasonMsg.length >
                                                            16
                                                            ? "left"
                                                            : "center",
                                                }}
                                            >
                                                {val.reasonMsg}
                                                <br />
                                                {val.reasonMsgLine1}
                                            </div>
                                        )}
                                    {val.reasonMsg != "" &&
                                        val.reasonMsgLine1 == "" && (
                                            <div
                                                className="reason-msg"
                                                style={{
                                                    textAlign:
                                                        val.reasonMsg &&
                                                        val.reasonMsg.length >
                                                            16
                                                            ? "left"
                                                            : "center",
                                                }}
                                            >
                                                {val.reasonMsg}
                                            </div>
                                        )}
                                    {val.reasonMsg == "" &&
                                        val.reasonMsgLine1 != "" && (
                                            <div
                                                className="reason-msg"
                                                style={{
                                                    textAlign:
                                                        val.reasonMsg &&
                                                        val.reasonMsg.length >
                                                            16
                                                            ? "left"
                                                            : "center",
                                                }}
                                            >
                                                {val.reasonMsgLine1}
                                            </div>
                                        )}
                                    {val.statusId == 6 &&
                                        val.paymentMethodId == "LB" && (
                                            <div
                                                className="reason-msg"
                                                style={{
                                                    textAlign: "left",
                                                }}
                                            >
                                                {translate(
                                                    "您的交易已按要求取消。",
                                                )}
                                            </div>
                                        )}
                                    {val.isShowSubWithdrawalDetails && (
                                        <div
                                            style={{
                                                textAlign: "left",
                                                marginLeft: "-3px",
                                            }}
                                        >
                                            <Button
                                                type="primary"
                                                ghost={false}
                                                className="record-btn"
                                                size="small"
                                                onClick={() => {
                                                    this.getSubWithdrawal(
                                                        val.transactionId,
                                                    );
                                                }}
                                            >
                                                到账细节
                                            </Button>
                                        </div>
                                    )}

                                    <div
                                        style={{
                                            textAlign: "left",
                                            marginLeft: "-3px",
                                        }}
                                    >
                                        {val.btns.map((v, i) => {
                                            let currentBtn = null;
                                            this.btnsInfo.some(
                                                (vIn) =>
                                                    vIn.id === v &&
                                                    (currentBtn = vIn),
                                            );

                                            return !!currentBtn ? (
                                                <Button
                                                    key={i}
                                                    className="record-btn"
                                                    size="small"
                                                    type={currentBtn.type}
                                                    ghost={currentBtn.ghost}
                                                    onClick={() => {
                                                        this.btnClick(
                                                            currentBtn.id,
                                                            val,
                                                        );
                                                        if (Pushgtagdata) {
                                                            Pushgtagdata(
                                                                currentBtn
                                                                    .piwik[0],
                                                                currentBtn
                                                                    .piwik[1],
                                                                currentBtn
                                                                    .piwik[2],
                                                            );
                                                        }
                                                    }}
                                                >
                                                    {currentBtn.text}
                                                </Button>
                                            ) : null;
                                        })}
                                    </div>
                                </Col>
                            </Row>
                        );
                    })
                ) : (
                    <Col className="center" span={24}>
                        <Empty
                            image={"/vn/img/icon/img-no-record.svg"}
                            className="big-empty-box"
                            description={translate("没有数据")}
                        />
                    </Col>
                )}
                <div className="line-distance"></div>
                <Modal
                    footer={null}
                    closable={true}
                    visible={this.state.showSubMithdrawModal}
                    title="到账细节"
                    className="blueHeaderModal"
                    centered={true}
                    wrapClassName="blueHeaderModal"
                    width="380px"
                    onCancel={() =>
                        this.setState({
                            showSubMithdrawModal: false,
                        })
                    }
                >
                    {showSubMithdrawRes && (
                        <ul
                            className="t-resubmit-list"
                            style={{
                                textAlign: "left",
                                color: "#222222",
                                padding: "1.5rem",
                            }}
                        >
                            {showSubMithdrawRes.result.RebatePercentage != 0 ? (
                                <div>
                                    {showSubMithdrawRes.result.Amount >=
                                    showSubMithdrawRes.result
                                        .MinWithdrawalAmount ? (
                                        <div>
                                            1. 当提交金额大于{" "}
                                            <span style={{ color: "#00A6FF" }}>
                                                {
                                                    showSubMithdrawRes.result
                                                        .MinWithdrawalAmount
                                                }
                                            </span>{" "}
                                            时，系统将会拆分成{" "}
                                            <span style={{ color: "#00A6FF" }}>
                                                {
                                                    showSubMithdrawRes.result
                                                        .MinSplitWithdrawalCount
                                                }
                                            </span>{" "}
                                            笔交易以上分批出款。
                                            <br />
                                            2. 此笔预约提款享有{" "}
                                            <span style={{ color: "#00A6FF" }}>
                                                {
                                                    showSubMithdrawRes.result
                                                        .RebatePercentage
                                                }
                                                %
                                            </span>{" "}
                                            红利，交易将于 {payoutTime}
                                            内完成，并于所有交易完成后一次性派发红利。
                                        </div>
                                    ) : (
                                        <div>
                                            1. 此笔预约提款享有{" "}
                                            <span style={{ color: "#00A6FF" }}>
                                                {
                                                    showSubMithdrawRes.result
                                                        .RebatePercentage
                                                }
                                                %
                                            </span>{" "}
                                            红利，交易将于 {payoutTime}
                                            内完成，并于所有交易完成后一次性派发红利。
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    {showSubMithdrawRes.result.Amount >=
                                    showSubMithdrawRes.result
                                        .MinWithdrawalAmount ? (
                                        <div>
                                            1. 当提交金额大于{" "}
                                            <span style={{ color: "#00A6FF" }}>
                                                {
                                                    showSubMithdrawRes.result
                                                        .MinWithdrawalAmount
                                                }
                                            </span>{" "}
                                            时，系统将会拆分成{" "}
                                            <span style={{ color: "#00A6FF" }}>
                                                {
                                                    showSubMithdrawRes.result
                                                        .MinSplitWithdrawalCount
                                                }
                                            </span>{" "}
                                            笔交易以上分批出款。
                                            <br />
                                            2. 交易将于 {payoutTime}内完成。
                                        </div>
                                    ) : (
                                        <div>
                                            1. 交易将于 {payoutTime}内完成。
                                        </div>
                                    )}
                                </div>
                            )}
                            <ul className="t-resubmit-list2">
                                <li style={{ borderBottom: "none" }}>
                                    <div>处理中金额</div>
                                    <div>实际到账</div>
                                </li>
                                <li
                                    style={{
                                        fontWeight: "bold",
                                        fontSize: "16px",
                                    }}
                                >
                                    <div style={{ color: "#222222" }}>
                                        ￥
                                        {
                                            showSubMithdrawRes.result
                                                .ProcessingSplitWithdrawalAmount
                                        }
                                    </div>
                                    <div style={{ color: "#222222" }}>
                                        ￥
                                        {
                                            showSubMithdrawRes.result
                                                .ApprovedSplitWithdrawalAmount
                                        }
                                    </div>
                                    {/* <div>{res.result.bankName}</div> */}
                                </li>
                                {showSubMithdrawRes.result.SubWithdrawalList &&
                                    showSubMithdrawRes.result.SubWithdrawalList.map(
                                        (list, index) => {
                                            return (
                                                <li
                                                    key={index}
                                                    style={{
                                                        display:
                                                            index > 4
                                                                ? this.state
                                                                      .showlist
                                                                    ? ""
                                                                    : "none"
                                                                : "",
                                                    }}
                                                >
                                                    <div>
                                                        ￥
                                                        {
                                                            list.SplitWithdrawalAmount
                                                        }
                                                    </div>
                                                    <div>
                                                        {list.RebateAmount ? (
                                                            <div className="greyWord">
                                                                <span>
                                                                    获得额外红利{" "}
                                                                    {
                                                                        list.RebateAmount
                                                                    }{" "}
                                                                    元{" "}
                                                                </span>
                                                            </div>
                                                        ) : list.IsAllowUIComplete ? (
                                                            <div className="greyWord">
                                                                <span>
                                                                    请点击
                                                                    【确认到账】
                                                                </span>
                                                            </div>
                                                        ) : null}
                                                        {list.IsAllowUIComplete ? (
                                                            <div>
                                                                <Button
                                                                    type="primary"
                                                                    ghost={
                                                                        false
                                                                    }
                                                                    className="record-btn"
                                                                    size="small"
                                                                    onClick={() => {
                                                                        this.confirmSubWithdrawal(
                                                                            list.SubWithdrawalID,
                                                                            list.SplitWithdrawalAmount,
                                                                            showSubMithdrawRes
                                                                                .result
                                                                                .WithdrawalID,
                                                                        );
                                                                    }}
                                                                >
                                                                    确认到账
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <div
                                                                style={{
                                                                    fontSize:
                                                                        "13px",
                                                                    width: "4rem",
                                                                    textAlign:
                                                                        "center",
                                                                }}
                                                            >
                                                                {list.StatusId ==
                                                                    1 ||
                                                                list.StatusId ==
                                                                    2 ||
                                                                list.StatusId ==
                                                                    5 ||
                                                                list.StatusId ==
                                                                    6 ||
                                                                list.StatusId ==
                                                                    7 ? (
                                                                    <span
                                                                        style={{
                                                                            color: "#F0A800",
                                                                        }}
                                                                    >
                                                                        处理中
                                                                    </span>
                                                                ) : list.StatusId ==
                                                                  3 ? (
                                                                    <span
                                                                        style={{
                                                                            color: "#F12F2F",
                                                                        }}
                                                                    >
                                                                        提款失败
                                                                    </span>
                                                                ) : (
                                                                    <span
                                                                        style={{
                                                                            color: "#23CC3C",
                                                                        }}
                                                                    >
                                                                        提款成功
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </li>
                                            );
                                        },
                                    )}
                                {showSubMithdrawRes.result.SubWithdrawalList
                                    .length > 5 ? (
                                    <Button
                                        style={{
                                            width: "100%",
                                            margin: "0.5rem 0",
                                        }}
                                        type="primary"
                                        ghost={true}
                                        className="record-btn"
                                        size="default"
                                        onClick={() => {
                                            this.setState({
                                                showlist: !this.state.showlist,
                                            });
                                        }}
                                    >
                                        {this.state.showlist ? (
                                            <span>
                                                隐藏部分{" "}
                                                <img src="/vn/img/icon/blueDown.svg" />
                                            </span>
                                        ) : (
                                            <span>
                                                显示全部{" "}
                                                <img src="/vn/img/icon/blueUp.svg" />
                                            </span>
                                        )}
                                    </Button>
                                ) : null}
                            </ul>
                        </ul>
                    )}
                </Modal>
                <Pagination
                    className="gray-pagination"
                    current={this.state.currentPage}
                    defaultPageSize={this.onePageSize}
                    hideOnSinglePage={true}
                    total={this.props.withdrawData.length}
                    onChange={this.changePage}
                />
                <SmallCountDown
                    visible={this.state.visible}
                    setVisible={(v) => {
                        this.setState({ visible: v });
                    }}
                    confirmReceipt={this.confirmReceipt}
                />
            </div>
        );
    }
}

export default WithdrawRecords;
