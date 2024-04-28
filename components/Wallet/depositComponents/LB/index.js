import React from "react";
import { Button, Input, Form, Icon, Modal, message } from "antd";
import MoneyInput from "./../MoneyInput";
import TargetAccount from "./../TargetAccount";
import BankAccount from "./../BankAccount";
import SecondStep from "./SecondStep";
import { post } from "$ACTIONS/TlcRequest";
import { CommonPostPay } from "$DATA/wallet";
import { ApiPort } from "$ACTIONS/TLCAPI";
import { formatSeconds } from "$ACTIONS/util";
import { Cookie } from "$ACTIONS/helper";
import { realyNameReg } from "$ACTIONS/reg";
import { formItemLayout, tailFormItemLayout } from "$ACTIONS/constantsData";
import USDTBanner from "../../USDTBanner";
import FinishStep from "../FinishStep/";
const { Item } = Form;

class LB extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOtherAccount: false, // 是否存入其它账号
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
        this.payTypeCode = "LB"; // 当前支付方式Code
        this.depositName = null; // 存款人姓名

        this.timeTimer = null; // 本银充值第三步骤倒计时Timer
    }
    componentDidMount() {
        // 第三步骤倒计时记录
        // if (Cookie('isThird') === 'true') {
        // 	this.setState({ lbStep: 3 });
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
        // Cookie('isThird', null);
        clearInterval(this.timeTimer);
        this.setState({ lbStep: 1 });
        this.depositName = null;
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
        const depositDateTime = Cookie.Get("dateTime")
            .replace("-", "/")
            .replace("-", "/");
        let lastSeconds =
            1800 -
            (new Date().getTime() - new Date(depositDateTime).getTime()) / 1000;
        this.timeTimer = setInterval(() => {
            if (lastSeconds <= 0) {
                this.setState({ lbStep: 1 });
                // Cookie('isThird', null);
                clearInterval(this.timeTimer);
            }
            this.setState({ remainingTime: formatSeconds(lastSeconds--) });
        }, 1000);
        // 以下是带Cookie记录的倒计时保留，根据新的需求移除此功能
        // const depositDateTime = Cookie('dateTime').replace('-', '/').replace('-', '/');
        // // 1800millisecond = 30minute * 60second
        // let lastSeconds = 1800 - (new Date().getTime() - new Date(depositDateTime).getTime()) / 1000;
        // depositDateTime !== null && depositDateTime !== ''
        // 	? (this.timeTimer = setInterval(() => {
        // 		if (lastSeconds <= 0) {
        // 			this.setState({ lbStep: 1 });
        // 			Cookie('isThird', null);
        // 			clearInterval(this.timeTimer);
        // 		}
        // 		this.setState({ remainingTime: formatSeconds(lastSeconds--) });
        // 	}, 1000))
        // 	: Cookie('isThird', null);
    }
    goSecondStep = (e) => {
        e.preventDefault();
        const Paybank =
            this.props.currDepositDetail.bankAccounts &&
            this.props.currDepositDetail.bankAccounts.find(
                (v) =>
                    v.bankCode === this.state.bankCodeState ||
                    v.enBankName === this.state.bankCodeState
            );
        // this.currBankAccount = Paybank; // 第二步收款银行数据初始化
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

        // const depositName = typeof this.depositName === 'object' ? this.props.localMemberName : this.depositName;
        // if (!realyNameReg.test(depositName)) {
        // 	return message.error('请输入正确格式的名字。');
        // }
        this.depositName = this.props.form.getFieldValue("lbRealName");
        if (
            this.depositName ===
            this.getMaskedText(this.props.localMemberName.length)
        ) {
            this.depositName = this.props.localMemberName;
        }
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.setLoading(true);

                CommonPostPay(
                    {
                        accountHolderName:
                            this.depositName != null
                                ? this.depositName
                                : this.props.localMemberName, //账户持有人姓名
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
                        transferType: Paybank.supportedBankInTypes[0] || "", // 收款账户支持信息
                        offlineRefNo: "0",
                        depositingBankName: !isAutoAssign
                            ? Paybank.enBankName
                            : "",
                        depositingBankAcctNum: "",
                        // depositingBankAcctNum:
                        //     !!Paybank.accountNo && isAutoAssign
                        //         ? Paybank.accountNo.substring(
                        //               Paybank.accountNo.length - 6
                        //           )
                        //         : "",
                        // depositingBankAcctNum: this.state.isOtherAccount ? values.lastSixNum : Paybank.accountNo.substring(Paybank.accountNo.length - 6),
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
                        let resData = res;
                        res = resData.result;
                        res.isSuccess = resData.isSuccess;
                        this.props.setLoading(false);
                        this.setState({
                            FinishData: res,
                        });
                        const submitStepTwoRun = () => {
                            this.currBankAccount = res.returnedBankDetails;
                            this.transactionId = res.transactionId;
                            Cookie.Create(
                                "dateTime",
                                res.submittedAt
                                    .split("T")
                                    .join(" ")
                                    .split(".")[0],
                                {
                                    expires: 30,
                                }
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
                                // 当返回的isDummyBank为true 的情况下新增提示信息
                                if (res.isDummyBank) {
                                    tryOtherDialog();
                                }
                            }
                        } else if (res.errorCode === "P101007") {
                            tryOtherDialog();
                        }
                    }
                );
            }
        });

        Pushgtagdata("Deposit​", "Submit​", "Submit_Localbank_Deposit");
    };

    getMaskedText = (length) => {
        return "*".repeat(length);
    };

    goRecord = () => {
        this.props.onCancel();
        this.props.goUserCenter("records");
        sessionStorage.setItem("selectTabKey", "deposit");
        typeof global.changeRecordFilterType === "function" &&
            global.changeRecordFilterType("deposit");
        Pushgtagdata &&
            Pushgtagdata(
                "Transaction Record",
                "View",
                "View_TransactionRecord_Deposit"
            );
    };
    render() {
        console.log("LB 支付方式详情数据", this.props.currDepositDetail);
        let { bankAccounts, setting } = this.props.currDepositDetail; // 当前支付方式的详情
        const {
            getFieldsError,
            getFieldDecorator,
            getFieldValue,
            setFieldsValue,
            getFieldError,
        } = this.props.form;
        const {
            bankCodeState,
            targetName,
            targetValue,
            depositMoney,
            bonusVal,
            lbStep,
            FinishData,
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
                    <div className="modal-prompt-info">
                        请确保“存款人姓名”和“存入金额”与您本人账户姓名和转入的金额保
                        持一致以便及时到账！
                    </div>

                    <MoneyInput
                        {...this.props.dialogTabKey}
                        getFieldDecorator={getFieldDecorator}
                        payTypeCode={this.payTypeCode}
                        payMethodList={this.props.payMethodList}
                        setCurrDepositDetail={this.props.setCurrDepositDetail}
                        setting={setting}
                        setFieldsValue={setFieldsValue}
                    />

                    <BankAccount
                        labelName="存款银行"
                        getFieldDecorator={getFieldDecorator}
                        // 是否存入旧帐户
                        isOtherAccount={this.state.isOtherAccount}
                        // 更新是否传入旧帐户
                        setOtherAccountStatus={() => {
                            this.setState({
                                isOtherAccount: !this.state.isOtherAccount,
                            });
                            Pushgtagdata("Otheracc_Localbank_deposit");
                        }}
                        // （中国人民银行）是否维护
                        IsPBCActive={setting && setting.isPBCActive}
                        isAutoAssign={setting && setting.isAutoAssign}
                        keyName={["bankName", "enBankName"]}
                        bankAccounts={bankAccounts}
                        bankCodeState={bankCodeState}
                        setBankCode={(v) => {
                            this.setState({ bankCodeState: v });
                        }}
                    />
                    {/* <Item label="存款人姓名">
						<Input
							size="large"
							// defaultValue={this.props.localMemberName}
							onChange={({ target: { value: v } }) => {
								this.depositName = v;
							}}
							placeholder="请输入存款人姓名"
						/>
					</Item> */}

                    <Item
                        label="存款人姓名"
                        errorMessage={getFieldError("lbRealName")}
                    >
                        {getFieldDecorator("lbRealName", {
                            initialValue: this.getMaskedText(
                                this.props.localMemberName
                                    ? this.props.localMemberName.length
                                    : 0
                            ),
                            //initialValue: this.props.localMemberName,
                            rules: [
                                { required: true, message: "请输入全名" },
                                {
                                    validator: (rule, value, callback) => {
                                        if (
                                            value &&
                                            value.indexOf("*") == -1 &&
                                            !realyNameReg.test(value)
                                        ) {
                                            callback("请输入正确格式的名字。");
                                        }
                                        callback();
                                    },
                                },
                            ],
                        })(<Input size="large" placeholder="存款人姓名" />)}
                    </Item>

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
                    />

                    <Item {...tailFormItemLayout}>
                        <div className="btn-wrap">
                            <Button
                                disabled={
                                    Object.values(getFieldsError()).some(
                                        (v) => v !== undefined
                                    ) ||
                                    getFieldValue("money") == "" ||
                                    getFieldValue("lbRealName") == "" ||
                                    (bankAccounts && bankAccounts.length == 0)
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
                    localMemberName={
                        this.depositName != null
                            ? this.depositName
                            : this.props.localMemberName
                    }
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
						
						<Button size="large" type="primary" htmlType="submit" onClick={this.goUserCenterRecords} block>
							查看交易记录
						</Button>
					</div>
				</div> */}
                {/* 成功提交的页面 */}
                {lbStep === 3 && (
                    <FinishStep
                        collectionInfo={FinishData}
                        Time={this.state.remainingTime}
                        goRecord={() => {
                            this.goRecord();
                        }}
                        goHome={() => {
                            clearInterval(this.timeTimer);
                            this.props.onCancel("ToHome");
                        }}
                    />
                )}
                {/* 温馨提示 */}
                <div className="deposit-help-wrap">
                    <h4>乐天使温馨提醒：</h4>

                    <ul>
                        <li>
                            请务必按照系统提示的银行及金额进行存款，否则您的存款将无法及时到账。{" "}
                        </li>
                        <li>
                            存款后，点击【我已成功存款】耐心等待到账，为了保证及时到账，请勿重复提交存款信息。
                        </li>
                    </ul>
                </div>
            </React.Fragment>
        );
    }
}
export default Form.create({ name: "LB" })(LB);
