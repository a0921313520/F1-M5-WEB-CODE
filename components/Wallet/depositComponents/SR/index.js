import React from "react";
import { Button, Input, Form, Icon, Modal, message, Steps } from "antd";
import TargetAccount from "../TargetAccount";
import SecondStep from "./SecondStep";
import { post } from "$ACTIONS/TlcRequest";
import { CommonPostPay } from "$DATA/wallet";
import { ApiPort } from "$ACTIONS/TLCAPI";
import { formatSeconds, Cookie, dateFormat } from "$ACTIONS/util";
import { realyNameReg } from "$ACTIONS/reg";
import { formItemLayout, tailFormItemLayout } from "$ACTIONS/constantsData";
import USDTBanner from "../../USDTBanner";
import UploadFile from "@/UploadFile";
import MoneyInput from "./../MoneyInput";
import { BsCheckCircleFill, BsCircle } from "react-icons/bs";
import { CopyToClipboard } from "react-copy-to-clipboard";
const { Step } = Steps;
const { Item } = Form;

class SR extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOtherAccount: false, // 是否存入其它账号
            depositMoney: "", // 实际存款金额
            targetValue: "", // 目标账户State值
            targetName: "", // 目标账户名称
            bonusVal: 0, // 可申请优惠Val值
            bonusName: "", // 可申请优惠名称
            lbStep: 1, // 本银充值步骤
            remainingTime: "00:00", // 剩余时间
            amountValue: 0, // 用户选择的存款金额
            uploadFileName: "",
        };

        this.startCountDown = this.startCountDown.bind(this); // 第三步骤倒计时

        this.currBankAccount = {}; // 当前选中的收款银行账户信息（传递第二步骤需要）
        this.transactionId = ""; // 订单编号
        this.payTypeCode = "SR"; // 当前支付方式Code

        this.timeTimer = null; // 本银充值第三步骤倒计时Timer
        this.goThirdStep = null; // 前往第三部的方法
    }
    componentDidMount() {
        // 第三步骤倒计时记录
        // if (Cookie('isThird') === 'true') {
        // 	this.setState({ lbStep: 3 });
        // }
    }
    componentDidUpdate(prevProps, prevState) {
        // 本银充值第三步骤记录
        if (prevState.lbStep !== this.state.lbStep && this.state.lbStep !== 1) {
            this.state.lbStep === 2 && this.startCountDown();
            this.state.lbStep === 3 && this.startCountDown();
        }
    }
    componentWillUnmount() {
        clearInterval(this.timeTimer);
    }
    goLbHome = () => {
        // Cookie('isThird', null);
        clearInterval(this.timeTimer);
        this.setState({ lbStep: 1 });
    };
    goUserCenterRecords = () => {
        this.goLbHome();
        this.props.onCancel();
        this.props.goUserCenter("records");
        typeof global.changeRecordFilterType === "function" &&
            global.changeRecordFilterType("deposit");
        Pushgtagdata &&
            Pushgtagdata(
                "Transaction Record",
                "View",
                "View_TransactionRecord_Deposit"
            );
    };
    startCountDown() {
        clearInterval(this.timeTimer);
        this.setState({ remainingTime: "00:00" });
        const depositDateTime = Cookie("dateTime")
            .replace("-", "/")
            .replace("-", "/");
        let lastSeconds =
            1800 -
            (new Date().getTime() - new Date(depositDateTime).getTime()) / 1000;
        this.timeTimer = setInterval(() => {
            if (lastSeconds <= 0) {
                if (
                    this.state.lbStep == 3 &&
                    this.state.remainingTime == "00:00"
                ) {
                    // 第三步骤倒计时结束后回到第一步
                    // this.setState({ lbStep: 1 });
                    this.goUserCenterRecords();
                }
                if (this.state.lbStep == 2) {
                    this.goThirdStep();
                }
                clearInterval(this.timeTimer);
            }
            this.setState({ remainingTime: formatSeconds(lastSeconds--) });
        }, 1000);
    }
    goSecondStep = (e) => {
        e.preventDefault();

        // depositStatusCheck 第二个参数原先是银行户口类型的值，小额充值不需要它，所以传默认的空值
        // 未完成真实姓名验证则呼出完善弹窗
        if (
            typeof this.props.depositStatusCheck(this.payTypeCode, "") ===
            "undefined"
        )
            return;


        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.setLoading(true);
                CommonPostPay(
                    {
                        accountHolderName: "", //账户持有人姓名
                        accountNumber: "0", //帐号
                        amount: values.money,
                        bankName: "NIL", //银行名
                        city: "city",
                        province: "province",
                        branch: "branch",
                        language: "zh-cn",
                        paymentMethod: this.payTypeCode,
                        charges: 0,
                        transactionType: "Deposit",
                        domainName: ApiPort.LOCAL_HOST,
                        isMobile: false,
                        isSmallSet: false,
                        refNo: "0",
                        offlineDepositDate: "",
                        mgmtRefNo: "Fun88Desktop",
                        transferType: "", // 收款账户支持信息
                        offlineRefNo: "0",
                        depositingBankName: "",
                        depositingBankAcctNum: "",
                        isPreferredWalletSet: false, // 是否设为默认目标账户
                        isMobile: false,
                        depositingWallet: this.state.targetValue, // 目标账户Code
                        cardName: "",
                        cardNumber: "",
                        cardPIN: "",
                        cardExpiryDate: "",
                        bonusId: this.state.bonusVal,
                        bonusCoupon: values.bonusCode || "",
                        couponText: "",
                        fileBytes: "",
                        fileName: "",
                        secondStepModel: null,
                        successUrl: ApiPort.LOCAL_HOST,
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
                    },
                    (res) => {
                        let errorRes = res.errors[0];
                        this.props.setLoading(false);
                        let resData = res;
                        res = resData.result;
                        res.isSuccess = resData.isSuccess;
                        const submitStepTwoRun = () => {
                            this.currBankAccount = res.returnedBankDetails;
                            this.transactionId = res.transactionId;
                            Cookie(
                                "dateTime",
                                res.submittedAt
                                    .split("T")
                                    .join(" ")
                                    .split(".")[0],
                                { expires: 30 }
                            );
                            this.setState({
                                lbStep: 2,
                                depositMoney: res.uniqueAmount,
                            });
                            this.props.bonusApplication(res);
                            this.props.form.resetFields();
                        };
                        const tryOtherDialog = () => {
                            Modal.info({
                                className: "confirm-modal-of-public",
                                icon: <div />,
                                okText: "知道了",
                                cancelText: "刷新重试",
                                title: "温馨提醒",
                                closable: "",
                                content: (
                                    <div>
                                        <p>
                                            很抱歉，目前暂无可存款的银行，请尝试其他存款方式。
                                        </p>
                                    </div>
                                ),
                                onOk: () => {
                                    this.props.setCurrentPayMethod("JDP");
                                },
                            });
                        };
                        if (res.isSuccess) {
                            if (res.isPaybnbDepositWithDifferentRequestedBank) {
                                Modal.confirm({
                                    icon: null,
                                    centered: true,
                                    title: "温馨提示",
                                    content: (
                                        <div style={{ textAlign: "left" }}>
                                            抱歉 ，
                                            您选择的银行暂时无法使用，请使用其他银行进行充值或稍后再试。
                                        </div>
                                    ),
                                    okText: "知道了",
                                    cancelText: "取消",
                                    onOk: () => {
                                        submitStepTwoRun();
                                    },
                                    onCancel: () => {
                                        post(
                                            ApiPort.CancelPaybnbDeposit +
                                                "depositId=" +
                                                res.transactionId
                                        )
                                            .then((res) => {
                                                if (res) {
                                                    console.log(
                                                        res.errorMessage
                                                    );
                                                }
                                            })
                                            .catch((error) => {});
                                    },
                                });
                            } else {
                                submitStepTwoRun();
                                // 当返回的accountNumber全部为0的情况下新增提示信息
                                const accountNoArr =
                                    res.returnedBankDetails &&
                                    res.returnedBankDetails.accountNumber &&
                                    res.returnedBankDetails.accountNumber.split(
                                        ""
                                    );
                                if (
                                    Array.isArray(accountNoArr) &&
                                    !accountNoArr.some((v) => v !== "0")
                                ) {
                                    tryOtherDialog();
                                }
                            }
                        } else if (res.errorCode === "P111001") {
                            message.error(
                                errorRes.errorMessage || "目前没有合适的金额，请尝试不同的存款提交方法。"
                            );
                        } else if (
                            res.errorCode === "P111004"
                        ) {
                            Modal.info({
                                title: null,
                                centered: true,
                                okText:
                                    res.errorCode === "P111004"
                                        ? "重新提交"
                                        : "我知道了",
                                content: res.errorMessage,
                            });
                        } else if (res.errorCode === "P101007") {
                            tryOtherDialog();
                        } else if (res.errorCode === "SR99999") {
                            Modal.info({
                                title: null,
                                centered: true,
                                okText: "我知道了",
                                content: (
                                    <div>
                                        {" "}
                                        ，因请求异常导致您的充值未能成功，请重新提交或
                                        <Button
                                            type="link"
                                            onClick={global.PopUpLiveChat}
                                        >
                                            联系在线客服！
                                        </Button>
                                    </div>
                                ),
                            });
                        } else if (res.errorCode === "P101116") {
                            Modal.info({
                                title: "重要提示",
                                centered: true,
                                okText: "好的",
                                content: (
                                    <div>
                                        {res.errorMessage
                                            .split("\r\n")
                                            .map((str) => (
                                                <p
                                                    style={{
                                                        textAlign: "left",
                                                    }}
                                                >
                                                    {str}
                                                </p>
                                            ))}
                                    </div>
                                ),
                            });
                        } else if (errorRes && errorRes.errorCode === "P111001"){
                            message.error(
                                errorRes.description || "充值失败,请稍后再尝试!"
                            );
                        }else {
                            message.error(
                                res.errorMessage || "充值失败,请稍后再尝试!"
                            );
                        }
                    }
                );
            }
        });

        Pushgtagdata("Deposit​", "Submit​", "SmallRiver_Deposit");
    };
    render() {
        let { suggestedAmounts, setting } = this.props.currDepositDetail; // 当前支付方式的详情
        const {
            getFieldsError,
            getFieldDecorator,
            getFieldValue,
            setFieldsValue,
        } = this.props.form;
        const {
            targetName,
            targetValue,
            depositMoney,
            amountValue,
            bonusVal,
            lbStep,
        } = this.state;
        return (
            <React.Fragment>
                <USDTBanner />
                {/* 第一步骤 */}
                <Form
                    className="form-wrap"
                    style={{ display: lbStep === 1 ? "block" : "none" }}
                    {...formItemLayout}
                    onSubmit={this.goSecondStep}
                >
                    <div
                        className="modal-prompt-info"
                        style={{
                            display: this.props.isShowBankCardVerif
                                ? "block"
                                : "none",
                            color: "#2962FF",
                            textAlign: "center",
                            cursor: "pointer",
                        }}
                        onClick={() => this.props.openBankAccountVerif()}
                    >
                        <span className="spanText">开启更多充值和提现方式</span>
                        <p className="pText">
                            点击上方按钮完成验证，小同为您承担网银转账 5% 手续费
                        </p>
                    </div>
                    <MoneyInput
                        {...this.props.dialogTabKey}
                        getFieldDecorator={getFieldDecorator}
                        payTypeCode={this.payTypeCode}
                        payMethodList={this.props.payMethodList}
                        setCurrDepositDetail={this.props.setCurrDepositDetail}
                        setting={setting}
                    />
                    {/* {suggestedAmounts && suggestedAmounts.length ? (
                        <Item label="存款金额">
                            <div className="suggested-amount-wrap">
                                <ul>
                                    {suggestedAmounts.map((value, index) => {
                                        return (
                                            <li
                                                className={`${
                                                    amountValue == value.amount
                                                }${
                                                    !value.isActive
                                                        ? " disabled"
                                                        : ""
                                                }`}
                                                onClick={() => {
                                                    if (!value.isActive) {
                                                        return false;
                                                    }
                                                    this.setState({
                                                        amountValue:
                                                            value.amount,
                                                    });
                                                }}
                                                key={value.amount}
                                            >
                                                {value.amount}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </Item>
                    ) : null} */}
                    {/* {suggestedAmounts &&
                    suggestedAmounts.length &&
                    suggestedAmounts.every((item) => !item.isActive) ? (
                        <div className="modal-prompt-info error-color">
                            乐天使温馨提醒, 目前暂时不提供此充值选项;
                            请选择其他充值方式。
                        </div>
                    ) : null} */}
                    <TargetAccount
                        {...this.props.dialogTabKey}
                        getFieldValue={getFieldValue}
                        getFieldDecorator={getFieldDecorator}
                        setLoading={this.props.setLoading}
                        targetValue={targetValue}
                        setTargetValue={(v, name) => {
                            this.setState({ targetValue: v, targetName: name });
                        }}
                        bonusName={this.state.bonusName}
                        bonusVal={bonusVal}
                        setBonusValue={(v, name) => {
                            this.setState({ bonusVal: v, bonusName: name });
                        }}
                        depositMethod={this.payTypeCode}
                    />
                    <Item {...tailFormItemLayout}>
                        <div className="btn-wrap">
                            <Button
                                disabled={
                                    Object.values(getFieldsError()).some(
                                        (v) => v !== undefined
                                    ) || getFieldValue("money") == ""
                                }
                                size="large"
                                type="primary"
                                htmlType="submit"
                                block
                            >
                                提交
                            </Button>
                        </div>
                    </Item>
                    {/* 温馨提示 */}
                    <div
                        className="deposit-help-wrap"
                        style={{ display: lbStep === 1 ? "block" : "none" }}
                    >
                        <span>温馨提示：</span>
                        <ul>
                            <li>只允许使用银行转账进行交易。 </li>
                            <li>
                                乐天使温馨提醒, 您的转账交易须在 30 分钟内完成 ;
                                否则该交易将被拒绝, 金额不予退还。
                            </li>
                        </ul>
                    </div>
                </Form>
                {/* 第二步骤 */}
                <SecondStep
                    currBankAccount={this.currBankAccount} // 当前选中的银行信息
                    transactionId={this.transactionId} // 当前生成的订单编号
                    lbStep={lbStep}
                    setLbStep={(v) => {
                        this.setState({ lbStep: v });
                    }}
                    setLoading={this.props.setLoading}
                    targetName={targetName}
                    depositMoney={depositMoney}
                    remainingTime={this.state.remainingTime}
                    localMemberName={this.props.localMemberName}
                    setGoThirdStep={(v) => {
                        this.goThirdStep = v;
                    }}
                />
                {/* 第三步骤 */}
                <div
                    className="lb-third-step-wrap"
                    style={{ display: lbStep === 3 ? "block" : "none" }}
                >
                    <div style={{background: '#FFFFFF'}}>
                        <Icon type="check-circle" theme="filled" />
                        <div className="check-success">
                            <div style={{fontSize: '16px'}}>已成功提交</div>
                            {/* <div className="cuccess">
                                {this.state.remainingTime}
                            </div> */}
                        </div>
                        <div className="StepsBox">
                        <Steps current={0} direction="vertical" size="small">
                            <Step
                                className="firstStep"
                                title="提交成功"
                                description="处理中"
                                icon={
                                    <BsCheckCircleFill
                                        color="#00A5FD"
                                        size={17}
                                    />
                                }
                            />
                            <Step
                                className="lastStep"
                                title=""
                                description={`预计30:00分钟到账`}
                                icon={<BsCircle color="#999999" size={13} />}
                            />
                        </Steps>
                        </div>
                        <p className="smallRiver-p">
                            存款提交后，会员务必在<span>30 分钟内完成转账，</span>
                            以避免导致延迟到账。若会员转账后 30
                            分钟，仍尚未到账，请立即联系在线客服。
                        </p>
                        <div className="smallRiver-border">
                            <li className="item-wrap" style={{fontSize: '12px', color: '#222222'}}>
                                <span className="item-label">存款金额</span>
                                <span style={{fontWeight: 'bold'}}>
                                    ¥ {this.state.depositMoney}
                                </span>
                            </li>
                        </div>
                        <div className="smallRiver-border">
                            <li className="item-wrap" style={{fontSize: '12px', color: '#222222'}}>
                                <span className="item-label">交易单号</span>
                                <span>
                                    {this.transactionId}
                                    <CopyToClipboard
                                        text={this.transactionId}
                                        onCopy={this.copySuccessCall}
                                    >
                                        <Button type="link"><img src={`/cn/img/icons/Copys.svg`}/></Button>
                                    </CopyToClipboard>
                                </span>
                            </li>
                        </div>
                    </div>

                    <div className="tlc-deposit-receipt">
                        <div className="upload-wrapper smdeposit">
                            <div style={{ textAlign: "left", fontSize: '14px' }}>
                            上传存款凭证 <span style={{color: '#323232', background: '#FFE273', fontSize: '11px', fontWeight: 'bold', borderRadius: '5px', width: '50px', textAlign: 'center', lineHeight: '12px'}}>推荐使用</span>
                            </div>
                            {/* <span className="item-label">
                                小同建议 直接上传充值收据以便加快充值审核哦！
                            </span> */}
                            {!!this.state.uploadFileName ? (
                                <Button block>
                                    {this.state.uploadFileName}
                                </Button>
                            ) : (
                                <UploadFile
                                    paymentType="SR"
                                    transactionId={this.transactionId}
                                    uploadFileName={this.state.uploadFileName}
                                    setFileName={(v) => {
                                        this.setState({ uploadFileName: v });
                                    }}
                                    children={
                                        <Button block className="link" style={{fontSize: '13px'}}>
                                            <img src="/cn/img/icons/plus-upload.svg" /> &nbsp; 上传存款凭证以利款项快速到帐
                                        </Button>
                                    }
                                />
                            )}
                            <span className="item-label" style={{color: '#666666', fontSize: '12px'}}>
                                若您无法上传凭证，请联系在线客服
                                <Button
                                style={{fontSize: '12px'}}
                                    className="inline"
                                    type="link"
                                    onClick={global.PopUpLiveChat}
                                >
                                    <span style={{borderBottom: '1.5px solid #1C8EFF', lineHeight: '9px', color: '#1C8EFF', maxWidth: '100%'}}>在线客服</span>
                                </Button>
                            </span>
                        </div>
                    </div>
                    <div style={{color: '#999999', fontSize: '13px', marginBottom: '20px'}}>
                    您可以回到首页继续投注，请等待30分钟以刷新金额， 如果有任何问题，请联系我们的在线客服
                    </div>
                    <div className="btn-wrap">
                        <Button
                            size="large"
                            type="primary"
                            htmlType="submit"
                            onClick={this.goUserCenterRecords}
                            block
                        >
                            查看交易记录
                        </Button>
                        <Button size="large" htmlType="submit" onClick={this.goLbHome} block style={{border: '1px solid #00A5FD', color: '#00A5FD', marginTop: '15px'}}>
							到首页
						</Button>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
export default Form.create({ name: "SR" })(SR);
