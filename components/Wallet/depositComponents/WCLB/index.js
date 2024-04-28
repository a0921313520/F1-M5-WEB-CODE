import React from "react";
import { Button, Input, Form, Icon, message, Modal } from "antd";
import MoneyInput from "./../MoneyInput";
import TargetAccount from "./../TargetAccount";
import BankAccount from "./../BankAccount";
import SecondStep from "./SecondStep";
import { CommonPostPay } from "$DATA/wallet";
import { ApiPort } from "$ACTIONS/TLCAPI";
import { formatSeconds } from "$ACTIONS/util";
import { Cookie } from "$ACTIONS/helper";
import { formItemLayout, tailFormItemLayout } from "$ACTIONS/constantsData";
import USDTBanner from "../../USDTBanner";
import FinishStep from "../FinishStep/";
const { Item } = Form;

class WCLB extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bankCodeState: "", // 收款银行Code值
            depositMoney: 0, // 存款金额
            targetValue: "", // 目标账户State值
            targetName: "", // 目标账户名称
            bonusVal: 0, // 可申请优惠Val值
            bonusName: "", // 可申请优惠名称
            lbStep: 1, // 本银充值步骤
            remainingTime: "00:00", // 剩余时间
        };

        this.startCountDown = this.startCountDown.bind(this); // 第三步骤倒计时

        this.currBankAccount = {}; // 当前选中的收款银行账户信息（传递第二步骤需要）
        this.transactionId = ""; // 订单编号
        this.payTypeCode = "WCLB"; // 当前支付方式Code

        this.timeTimer = null; // 本银充值第三步骤倒计时Timer
    }
    componentDidMount() {
        // 第三步骤倒计时记录
        // if (Cookie.Get("isWCThird") === "true") {
        //     this.setState({ lbStep: 3 });
        // }
    }
    componentDidUpdate(prevProps, prevState) {
        // 本银充值第三步骤记录
        if (prevState.lbStep !== this.state.lbStep && this.state.lbStep === 3) {
            this.startCountDown();
        }
    }
    componentWillUnmount() {
        clearInterval(this.timeTimer);
    }
    goLbHome = () => {
        Cookie.Create("isWCThird", null);
        clearInterval(this.timeTimer);
        this.setState({ lbStep: 1 });
    };
    startCountDown() {
        clearInterval(this.timeTimer);
        const depositDateTime = Cookie.Get("dateTime")
            .replace("-", "/")
            .replace("-", "/");
        // 900millisecond = 15minute * 60second
        let lastSeconds =
            1800 -
            (new Date().getTime() - new Date(depositDateTime).getTime()) / 1000;
        depositDateTime !== null && depositDateTime !== ""
            ? (this.timeTimer = setInterval(() => {
                  if (lastSeconds <= 0) {
                      this.setState({ lbStep: 1 });
                      Cookie.Create("isWCThird", null);
                      clearInterval(this.timeTimer);
                  }
                  this.setState({
                      remainingTime: formatSeconds(lastSeconds--),
                  });
              }, 1000))
            : Cookie.Create("isWCThird", null);
    }
    goSecondStep = (e) => {
        e.preventDefault();
        const Paybank =
            this.props.currDepositDetail.bankAccounts &&
            this.props.currDepositDetail.bankAccounts.find(
                (v) => v.bankCode === this.state.bankCodeState
            );
        const isAutoAssign =
            this.props.currDepositDetail.setting &&
            this.props.currDepositDetail.setting.isAutoAssign;
        if (
            typeof this.props.depositStatusCheck(
                this.payTypeCode,
                this.state.bankCodeState
            ) === "undefined"
        )
            return; // 未完成真实姓名验证则呼出完善弹窗
        if (Paybank == undefined) {
            return message.error("正在维护，请选择其他存款方式。");
        }

        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.setLoading(true);
                CommonPostPay(
                    {
                        accountHolderName: Paybank.AccountHolderName, //账户持有人姓名
                        accountNumber: Paybank.accountNo, //帐号
                        amount: values.money,
                        bankName: isAutoAssign ? Paybank.bankName : "NIL", //银行名
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
                        transferType: Paybank.supportedBankInTypes[0], // 收款账户支持信息
                        offlineRefNo: "0",
                        depositingBankName: !isAutoAssign
                        ? Paybank.enBankName
                        : "",
                        // depositingBankAcctNum: isAutoAssign
                        //     ? Paybank.accountNo.substring(
                        //           Paybank.accountNo.length - 6
                        //       )
                        //     : "",
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
                        this.props.setLoading(false);
                        let resData = res;
                        res = resData.result;
                        res.isSuccess = resData.isSuccess;
                        if (res.isSuccess) {
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
                            // 当返回的isDummyBank为true 的情况下新增提示信息
                            if (res.isDummyBank) {
                                tryOtherDialog();
                            }
                            this.currBankAccount = {
                                BankName:
                                    res.returnedBankDetails &&
                                    res.returnedBankDetails.bankName
                                        ? res.returnedBankDetails.bankName
                                        : "",
                                AccountHolderName:
                                    res.returnedBankDetails &&
                                    res.returnedBankDetails.accountHolderName
                                        ? res.returnedBankDetails
                                              .accountHolderName
                                        : "",
                                AccountNo:
                                    res.returnedBankDetails &&
                                    res.returnedBankDetails.accountNumber
                                        ? res.returnedBankDetails.accountNumber
                                        : "",
                                Province:
                                    res.returnedBankDetails &&
                                    res.returnedBankDetails.province
                                        ? res.returnedBankDetails.province
                                        : "",
                                City:
                                    res.returnedBankDetails &&
                                    res.returnedBankDetails.city
                                        ? res.returnedBankDetails.city
                                        : "",
                                Branch:
                                    res.returnedBankDetails &&
                                    res.returnedBankDetails.branch
                                        ? res.returnedBankDetails.branch
                                        : "",
                            };
                            this.transactionId = res.transactionId;
                            Cookie.Create(
                                "dateTime",
                                res.submittedAt
                                    .split("T")
                                    .join(" ")
                                    .split(".")[0],
                                { expires: 15 }
                            );
                            this.setState({
                                lbStep: 2,
                                depositMoney: res.uniqueAmount,
                            });
                            this.props.bonusApplication(res);
                            this.props.form.resetFields();
                        }
                    }
                );
            }
        });

        Pushgtagdata("Deposit​", "Submit​", "Submit_Localwechatpay_Deposit");
    };
    goRecord = () => {
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

    submitBtnEnable = () => {
        let { bankAccounts } = this.props.currDepositDetail;
        let errors = Object.values(this.props.form.getFieldsError()).some(
            (v) => v !== undefined
        );
        return (
            this.props.form.getFieldValue("money") !== "" &&
            !errors &&
            bankAccounts &&
            bankAccounts.length > 0
        );
    };

    render() {
        let { bankAccounts, setting } = this.props.currDepositDetail; // 当前支付方式的详情
        const {
            getFieldsError,
            getFieldDecorator,
            getFieldValue,
            setFieldsValue,
        } = this.props.form;
        const {
            bankCodeState,
            targetName,
            targetValue,
            depositMoney,
            bonusVal,
            lbStep,
            Finish,
        } = this.state;

        return (
            <React.Fragment>
                <USDTBanner />
                {/* 成功提交的页面 */}
                {Finish && (
                    <FinishStep
                        collectionInfo={{
                            transactionId: this.transactionId,
                            uniqueAmount: depositMoney,
                        }}
                        Time={this.state.remainingTime}
                        goRecord={() => {
                            this.goRecord();
                        }}
                        goHome={() => {
                            this.props.onCancel("ToHome");
                        }}
                    />
                )}

                {/* 第一步骤 */}
                {!Finish && (
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
                            <span className="spanText">
                                开启更多充值和提现方式
                            </span>
                            <p className="pText">
                                点击上方按钮完成验证，小同为您承担网银转账 5%
                                手续费
                            </p>
                        </div>

                        <MoneyInput
                            {...this.props.dialogTabKey}
                            getFieldDecorator={getFieldDecorator}
                            payTypeCode={this.payTypeCode}
                            payMethodList={this.props.payMethodList}
                            setCurrDepositDetail={
                                this.props.setCurrDepositDetail
                            }
                            setting={setting}
                            setFieldsValue={setFieldsValue}
                        />

                        <BankAccount
                            keyName={["bankName", "bankCode"]}
                            isAutoAssign={setting && setting.isAutoAssign}
                            bankAccounts={bankAccounts}
                            bankCodeState={bankCodeState}
                            setBankCode={(v) => {
                                this.setState({ bankCodeState: v });
                            }}
                        />
                        <TargetAccount
                            {...this.props.dialogTabKey}
                            getFieldValue={getFieldValue}
                            getFieldDecorator={getFieldDecorator}
                            setLoading={this.props.setLoading}
                            targetValue={targetValue}
                            setTargetValue={(v, name) => {
                                this.setState({
                                    targetValue: v,
                                    targetName: name,
                                });
                            }}
                            bonusVal={bonusVal}
                            setBonusValue={(v, name) => {
                                this.setState({ bonusVal: v, bonusName: name });
                            }}
                        />
                        <Item {...tailFormItemLayout}>
                            <div className="btn-wrap">
                                <Button
                                    disabled={
                                        // Object.values(getFieldsError()).some(
                                        //     (v) => v !== undefined
                                        // ) ||
                                        // !getFieldValue("money") ||
                                        // !getFieldValue("accountHolderName")
                                        !this.submitBtnEnable()
                                    }
                                    size="large"
                                    type="primary"
                                    htmlType="submit"
                                    block
                                >
                                    下一步
                                </Button>
                            </div>
                        </Item>
                    </Form>
                )}

                {/* 第二步骤 */}
                <SecondStep
                    currBankAccount={this.currBankAccount} // 当前选中的银行信息
                    transactionId={this.transactionId} // 当前生成的订单编号
                    lbStep={lbStep}
                    setLbStep={(v) => {
                        this.setState({
                            Finish: true,
                            lbStep: v,
                        });
                    }}
                    setLoading={this.props.setLoading}
                    bonusName={this.state.bonusName}
                    targetName={targetName}
                    depositMoney={depositMoney}
                />
                {/* 第三步骤 */}

                {/* <div className="lb-third-step-wrap" style={{ display: lbStep === 3 ? 'block' : 'none' }}>
					<Icon type="check-circle" theme="filled" />
					<div className="check-success">
						<div>提交成功</div>
						<div className="cuccess">{this.state.remainingTime}</div>
					</div>
					<p>交易需要一段时间，请稍后再检查您的目标账户。</p>
					<div className="btn-wrap">
					
						<Button size="large" type="primary" htmlType="submit" onClick={this.goRecord} block>
							查看交易记录
						</Button>
					</div>
				</div> */}
                {/* 温馨提示 */}
                <div className="deposit-help-wrap">
                    <h4>乐天使温馨提醒：</h4>
                    <ul>
                        <li>
                            每日晚上10:00PM - 凌晨1:00AM (GMT+8)
                            将进行例行维维修，期间建议您使用其他存款方式。{" "}
                        </li>
                        <li>
                            请务必按照系统提示的银行及金额进行存款，否则您的存款将无法及时到账。{" "}
                        </li>
                        <li>刹那迟疑，后会无期！微信转账免手续费。 </li>
                    </ul>
                </div>
            </React.Fragment>
        );
    }
}
export default Form.create({ name: "WCLB" })(WCLB);
