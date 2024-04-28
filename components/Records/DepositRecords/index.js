import React from "react";
import {
    Row,
    Col,
    Modal,
    Pagination,
    Input,
    Button,
    Icon,
    Empty,
    message,
} from "antd";
import { get, post } from "$ACTIONS/TlcRequest";
import { ApiPort } from "$ACTIONS/TLCAPI";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { formatYearMonthDate,formatAmount,backToTop } from "$ACTIONS/util";
import UploadFile from "@/UploadFile";
import DepositRecordsDetail from "./DetailModal";
import {translate} from "$ACTIONS/Translate";

class DepsoitRecords extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentList: [], // 当前显示的数据
            currentPage: 1,
            currentDetail: {}, // 当前详情数据
            statusId: -1, // 当前列状态展开元素
            resubmitRedirectUrl: "", // 重新提交充值Vendor Iframe Url
            itemTransactionDetail:{
                data:{},
                visible: false
            }
        };

        this.formatRecords = this.formatRecords.bind(this); // 格式化充值记录
        this.changePage = this.changePage.bind(this); // 改变页数
        this.onePageSize = 10;

        // 充值记录备注按钮信息
        this.btnsInfo = [
            {
                id: "isAbleRequestRejectDeposit",
                text: translate("取消存款"),
                type: "primary",
                ghost: false,
                piwik: [
                    "Transaction Record",
                    "Click",
                    "Cancel_Deposit_TransactionRecord",
                ],
            },
            {
                id: "isContactCS",
                text: translate("在线客服"),
                type: "primary",
                ghost: true,
                piwik: ["CS", "Click", "LiveChat_TransactionRecord"],
            },
            {
                id: "isUploadSlip",
                text: translate("上传收据"),
                type: "primary",
                ghost: false,
                piwik: [
                    "Transaction Record",
                    "Click",
                    "UploadSlip_TransactionRecord",
                ],
            },
            // {
            //     id: "isUploadDocument",
            //     text: translate("上传存款凭证"),
            //     type: "link",
            //     ghost: true,
            // },
            {
                id: "resubmitFlag",
                text: translate("重新提交"),
                type: "primary",
                ghost: false,
                piwik: [
                    "Deposit Nav",
                    "Click",
                    "Resubmit_Deposit_TransactionRecord",
                ],
            },
            {
                id: "isSubmitNewTrans",
                text: translate("提交新的交易"),
                type: "primary",
                ghost: false,
                piwik: ["Deposit Nav", "Click", "Resubmit_FailedDeposit"],
            },
        ];
    }
    componentDidMount() {
        this.props.recordsData.length && this.formatRecords();
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.recordsData.length !== this.props.recordsData.length) {
            this.formatRecords();
        }
    }
    formatRecords() {
        this.props.recordsData.forEach((val) => {
            val.processingDatetimeTo = formatYearMonthDate(val.processingDateTime);
            val.approvedDatetimeTo = formatYearMonthDate(val.approvedDateTime);
            val.rejectedDateTimeTo = formatYearMonthDate(val.rejectedDateTime);
            val.submittedAtTo = formatYearMonthDate(val.submittedAt);
            val.timeoutDatetime = formatYearMonthDate(val.timeoutDateTime);

            // val.isAbleRequestRejectDeposit = true;
            // val.isUploadSlip = true;
            // val.resubmitFlag = true;
            // val.isSubmitNewTrans = true;
            // val.isContactCS = true;
            // val.isUploadDocument = true;
            const {
                isAbleRequestRejectDeposit,
                isUploadSlip,
                resubmitFlag,
                isSubmitNewTrans,
                isContactCS,
                isUploadDocument,
            } = val;
            const btns = {
                isAbleRequestRejectDeposit,
                isUploadSlip,
                resubmitFlag,
                isSubmitNewTrans,
                isUploadDocument,
                isContactCS,
            };
            val.btns = Object.keys(btns).filter((ele) => btns[ele]);
            if (val.statusId === 1) {
                if (val.methodType === "CHANNEL") {
                    val.amount = "-";
                }
                val.statusName = "待处理";
                val.statusType = "r-process";
                val.resultTimeTo = val.processingDatetimeTo;
                val.processOn = true;
            } else if (val.statusId === 4) {
                if (val.methodType === "CHANNEL") {
                    val.amount = "-";
                }
                val.statusName = "处理中";
                val.statusType = "r-process";
                val.resultTimeTo = val.processingDatetimeTo;
                val.processOn = true;
            } else if (val.statusId === 2) {
                val.statusName = "存款成功";
                val.statusType = "r-success";
                val.resultTimeTo = val.approvedDatetimeTo;
            } else if (val.statusId === 3) {
                val.statusName = "存款失败";
                val.statusType = "r-error";
                // 根据Api文档失败是使用rejectedDateTime，为了避免空白，多一个备用时间
                val.resultTimeTo =
                    val.rejectedDateTimeTo || val.approvedDatetimeTo;
            } else if (val.statusId === 5 ) {
                // 根据Api文档交易过期是使用TimeoutDatetime，为了避免空白，多一个备用时间
                val.statusName = "交易过期";
                val.statusType = "r-expired";
                val.resultTimeTo = val.timeoutDatetime || val.processingDatetimeTo;
            } else {
                val.statusName = "";
                val.statusType = "";
            }
        });

        const currPage =
            typeof this.state.currentPage === "number"
                ? this.state.currentPage - 1
                : 0;
        let startIndex = currPage * this.onePageSize;
        this.setState({
            currentList: this.props.recordsData.slice(
                startIndex,
                startIndex + this.onePageSize
            ), // 当前展示数据
        });
    }
    changePage(index) {
        const currPage = typeof index === "number" ? index - 1 : 0;
        let startIndex = currPage * this.onePageSize; // 当前起始下标
        this.setState({
            statusId: -1, // 切换页面时恢复充值状态栏位打开状态
            currentPage: index,
            currentList: this.props.recordsData.slice(
                startIndex,
                startIndex + this.onePageSize
            ), // 当前展示数据
        });
        backToTop();
    }
    MemberRequestDepositReject = (transactionId) => {
        this.props.setLoading(true);
        post(
            ApiPort.MemberRequestDepositReject +
                "&transactionId=" +
                transactionId
        )
            .then((res) => {
                // res.isSuccess
                this.props.getRecordslist(false, this.formatRecords);
                this.props.setLoading(false);
                this.props.recordAlert(res.result.message);
            })
            .catch((error) => {
                this.props.setLoading(false);
                console.log(error);
            });
    };
    CreateResubmitOnlineDeposit = (transactionId) => {
        return post(
            ApiPort.CreateResubmitOnlineDeposit +
                "&resubmitDepositID=" +
                transactionId +
                "&returnUrl=" +
                ApiPort.LOCAL_HOST
        )
            .then((res) => {
                if (res && res.result && res.result.resubmitRedirectUrl) {
                    this.props.getRecordslist(false, this.formatRecords);
                    // this.setState({
                    // 	resubmitRedirectUrl: res.ResubmitRedirectUrl,
                    // });
                    var RBWindow = window.open(
                        "",
                        "_blank",
                        "toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=1245, height=559"
                    );
                    RBWindow.document.write(res.result.resubmitRedirectUrl);
                    RBWindow.focus();
                }
            })
            .catch((error) => {
                message.error(error);
            });
    };

    btnClick = (id, recordItem) => {
        switch (id) {
            case "isAbleRequestRejectDeposit":
                Modal.confirm({
                    className: "confirm-modal-of-public",
                    icon: <div />,
                    centered: true,
                    title: translate("取消存款"),
                    content: (
                        <>
                            {translate("您确定想取消该金额的存款")} {recordItem.amount} ?
                        </>
                    ),
                    okText: translate("确定"),
                    cancelText: translate("不是"),
                    onOk: () => {
                        this.MemberRequestDepositReject(
                            recordItem.transactionId
                        );
                    },
                });
                break;
            case "resubmitFlag":
                const resubmitFlagModal = Modal.confirm({
                    className: "confirm-modal-of-public",
                    icon: <div />,
                    centered: true,
                    title: translate("重要提示"),
                    content: (
                        <div className="deposit-help-wrap">
                            <ul style={{ textAlign: "left" }}>
                                <p>{translate("请您按照以下提示操作重新提交：")} </p>
                                <li>{translate("单击“了解，继续”。")}</li>
                                <li>{translate("接下来，单击“完成”按钮。")}</li>
                                <li>{translate("您无需转账任何金额，请等待交易页面显示并关闭页面。")}</li>
                            </ul>
                        </div>
                        
                    ),
                    okText: translate("明白了，继续"),
                    cancelText: translate("在线客服"),
                    cancelButtonProps: {
                        ghost: true,
                        type: "primary",
                        onClick: () => {
                            resubmitFlagModal.destroy();
                            global.PopUpLiveChat();
                            Pushgtagdata(
                                "CS",
                                "Click",
                                "ContactCS_TransactionRecord"
                            );
                        },
                    },
                    onOk: () => {
                        Pushgtagdata(
                            "Deposit Nav",
                            "Next",
                            "Resubmit_TransactionRecord"
                        );
                        return get(
                            ApiPort.GetResubmitDepositDetails +
                                "&resubmitDepositID=" +
                                recordItem.transactionId
                        )
                            .then(({ result }) => {
                                Modal.info({
                                    className: "confirm-modal-of-public oneButton",
                                    icon: <div />,
                                    centered: true,

                                    title: translate("重新提交存款"),
                                    content: (
                                        <ul className="t-resubmit-list">
                                            <li>
                                                <div>{translate("存款方式")}</div>
                                                <div>
                                                    {result.paymentGatewayName}
                                                </div>
                                            </li>
                                            {result.methodTypeName &&
                                            result.methodTypeNameEng ? (
                                                <li>
                                                    <div>{translate("支付渠道")}</div>
                                                    <div>
                                                        {result.methodTypeName}
                                                    </div>
                                                </li>
                                            ) : null}
                                            <li style={{ borderBottom: "0px" }}>
                                                <div>{translate("金额")}</div>
                                                <div>
                                                    {formatAmount(result.resubmitAmount)} đ
                                                </div>
                                            </li>
                                            <li className="t-resubmit-tip ">
                                                {translate("无需从银行重新转账真实资金。 只需点击“删除”按钮即可，在交易屏幕出现之前请勿关闭页面。 任何中断都可能导致交易失败。")}
                                            </li>
                                        </ul>
                                    ),
                                    okText: translate("执行"),
                                    onOk: () => {
                                        Pushgtagdata(
                                            "Deposit",
                                            "Submit",
                                            "Resubmit_TransactionRecord"
                                        );
                                        return this.CreateResubmitOnlineDeposit(
                                            recordItem.transactionId
                                        );
                                    },
                                });
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    },
                });
                break;
            case "isSubmitNewTrans":
                global.showDialog({
                    key:
                        'wallet:{"type": "deposit", "currentPayValue": "' +
                        recordItem.paymentMethodId +
                        '"}',
                });
                // Pushgtagdata("Deposit Nav", "Click", "Resubmit_FailedDeposit");
                break;
            case "isContactCS":
                global.PopUpLiveChat();
                // Pushgtagdata("CS", "Click", "ContactCS_TransactionRecord​");
                break;
            default:
                break;
        }    
    };

    render() {
        const {
            itemTransactionDetail
        } = this.state;
        // 1	Pending - 待处理
        // 2	Approved - 交易成功
        // 3	Rejected - 交易失败
        // 4	Vendor Processing - 交易处理中
        return (
            <div className="records-list-wrap has-detail">
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
                                        {val.paymentMethodName}
                                        <i
                                            className="record-info-icon pointer"
                                            onClick={() => {
                                                this.setState({
                                                    itemTransactionDetail:{
                                                        data: val,
                                                        visible: true
                                                    }
                                                })
                                            }}
                                        ></i>
                                    </div>
                                    <div>
                                        {val.transactionId}
                                        <CopyToClipboard
                                            text={val.transactionId}
                                            onCopy={() => {
                                                this.props.recordAlert(translate("复制成功"));
                                            }}
                                        >
                                            <img
                                                width="12"
                                                style={{ marginLeft: "0.5rem",cursor:"pointer"  }}
                                                src={`${process.env.BASE_PATH}/img/icons/copy.png`}
                                            />
                                        </CopyToClipboard>
                                    </div>
                                </Col>
                                <Col span={3}>
                                    {val.amount === "-"
                                        ? "-"
                                        : "￥" + val.amount}
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
                                            {val.statusLocalizedName}
                                        </div>
                                        <div className="small-sign">
                                            {val.resultTimeTo}
                                        </div>
                                    </div>
                                    {val.processOn ? (
                                        <div className="open _short _1">
                                            <div className="small-circle">
                                                {translate("处理中")}
                                            </div>
                                            <div className="small-sign">
                                                {val.processingDatetimeTo}
                                            </div>
                                            <div className="small-circle">
                                                {translate("成功")}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="open _2">
                                            <div className="small-circle">
                                                {translate("处理中")}
                                            </div>
                                            <div className="small-sign">
                                                {val.processingDatetimeTo}
                                            </div>
                                            <div className="small-circle">
                                                {val.statusLocalizedName}
                                            </div>
                                            <div className="small-sign">
                                                {val.resultTimeTo}
                                            </div>
                                        </div>
                                    )}
                                    <Icon type="right" />
                                </Col>
                                <Col span={7} className="record-distance">
                                    <div
                                        className="reason-msg"
                                        style={{
                                            textAlign:
                                                val.reasonMsg &&
                                                val.reasonMsg.length > 16
                                                    ? "left"
                                                    : "center",
                                        }}
                                    >
                                        {val.reasonMsg}
                                    </div>
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
                                                    (currentBtn = vIn)
                                            );
                                            if (!!currentBtn) {
                                                if (
                                                    currentBtn.id ===
                                                    "isUploadSlip"
                                                ) {
                                                    return (
                                                        <UploadFile
                                                            key={i}
                                                            inline={true}
                                                            alertInfo="存款凭证已上传"
                                                            paymentType={
                                                                val.paymentMethodId
                                                            }
                                                            transactionId={
                                                                val.transactionId
                                                            }
                                                            setFileName={() => {
                                                                this.props.getRecordslist(
                                                                    false,
                                                                    this
                                                                        .formatRecords
                                                                );
                                                            }}
                                                            children={
                                                                <Button
                                                                    className="record-btn"
                                                                    size="small"
                                                                    type={
                                                                        currentBtn.type
                                                                    }
                                                                    ghost={
                                                                        currentBtn.ghost
                                                                    }
                                                                    onClick={() => {
                                                                        if (
                                                                            Pushgtagdata
                                                                        ) {
                                                                            Pushgtagdata(
                                                                                currentBtn
                                                                                    .piwik[0],
                                                                                currentBtn
                                                                                    .piwik[1],
                                                                                currentBtn
                                                                                    .piwik[2]
                                                                            );
                                                                        }
                                                                    }}
                                                                >
                                                                    {
                                                                        currentBtn.text
                                                                    }
                                                                </Button>
                                                            }
                                                        />
                                                    );
                                                } else {
                                                    return (
                                                        <Button
                                                            key={i}
                                                            className="record-btn"
                                                            size="small"
                                                            type={
                                                                currentBtn.type
                                                            }
                                                            ghost={
                                                                currentBtn.ghost
                                                            }
                                                            onClick={() => {
                                                                this.btnClick(
                                                                    currentBtn.id,
                                                                    val
                                                                );
                                                                if (
                                                                    Pushgtagdata
                                                                ) {
                                                                    Pushgtagdata(
                                                                        currentBtn
                                                                            .piwik[0],
                                                                        currentBtn
                                                                            .piwik[1],
                                                                        currentBtn
                                                                            .piwik[2]
                                                                    );
                                                                }
                                                            }}
                                                        >
                                                            {currentBtn.text}
                                                        </Button>
                                                    );
                                                }
                                            }
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
                <div className="line-distance" />
                <Pagination
                    className="gray-pagination"
                    current={this.state.currentPage}
                    defaultPageSize={this.onePageSize}
                    hideOnSinglePage={true}
                    total={this.props.recordsData.length}
                    onChange={this.changePage}
                />
                <Modal
                    title="重新提交充值"
                    className="records-modal"
                    width={900}
                    footer={null}
                    onCancel={() => {
                        this.setState({ resubmitRedirectUrl: "" });
                    }}
                    visible={!!this.state.resubmitRedirectUrl}
                >
                    <iframe
                        style={{ width: "100%", minHeight: 500, border: 0 }}
                        srcDoc={this.state.resubmitRedirectUrl}
                    ></iframe>
                </Modal>

                {itemTransactionDetail.visible && <DepositRecordsDetail
                    data={itemTransactionDetail.data}
                    visible={itemTransactionDetail.visible}
                    closeModal={()=>{
                        this.setState({
                            itemTransactionDetail:{
                                data:{},
                                visible:false
                            }
                        })
                    }}
                    setLoading={(v)=>this.props.setLoading(v)}
                />}
            </div>
        );
    }
}

export default DepsoitRecords;
