import React from "react";
import { Modal, Button, Form, Radio, Steps, message } from "antd";
import SecondStep from "./SecondStep";
import MoneyInput from "./../MoneyInput";
import TargetAccount from "./../TargetAccount";
import { formItemLayout, tailFormItemLayout } from "$ACTIONS/constantsData";
import { ApiPort, CMSAPIUrl } from "$ACTIONS/TLCAPI";
import { GetPayDetail, CommonPostPay } from "$DATA/wallet";
import { get } from "$ACTIONS/TlcRequest";
import Router from "next/router";
import { dateFormat, formatSeconds, formatTime } from "$ACTIONS/util";
import { Cookie } from "$ACTIONS/helper";
import USDTBanner from "../../USDTBanner";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { BsCheckCircleFill, BsCircle } from "react-icons/bs";
const { Step } = Steps;
const { Item } = Form;
const NameObj = {
    "USDT-ERC20": "泰达币-ERC20",
    "USDT-TRC20": "泰达币-TRC20",
};
const PROMOINFO = {
    INVOICE: "第三方交易所", //'成功提交后会生成订单编号。',
    CHANNEL: "支付完成后会生成订单编号。",
    OTC: "人民币转账", // '交易为人民币，成功提交后会生成订单编号。',
    INVOICE_AUT: "需填入交易哈希。",
};
// const paymentReminder = {
//     INVOICE:'若使用泰达币支付，将无法申请优惠红利，可通过转账功能申请优惠红利。 部分平台将征收手续费，单日存款金额 1,000 元或以上可获得彩金返还，返还金额无上限。',
//     CHANNEL:'若使用泰达币支付，将无法申请优惠红利，可通过转账功能申请优惠红利。 部分平台将征收手续费，单日存款金额 1,000 元或以上可获得彩金返还，返还金额无上限。',
//     OTC:'若使用泰达币支付，将无法申请优惠红利，可通过转账功能申请优惠红利。 部分平台将征收手续费，单日存款金额 1,000 元或以上可获得彩金返还，返还金额无上限。',
//     INVOICE_AUT:'若使用泰达币支付，将无法申请优惠红利，可通过转账功能申请优惠红利。部分平台将征收手续费，首3次使用泰达币支付可获得手续费返还。',
// }
class CTC extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lbStep: 1, // 极速虚拟币支付步骤
            ctcMethodTypeList: [], // 支付方式类型（极速虚拟币支付、虚拟币支付）
            ctcMethodType: "", // 当前支付方式类型
            ctcMethod: "", // 支付方式（比特币、以太坊、泰达币）
            currentCtcMethod: null, // 极速虚拟币支付/当前支付方式
            transactionId: "", // 交易编码
            displayMoreTip: false, // tip
            hideTipButton: false, // hide tip button
            showHelpText: "block", // 是否显示USDT温馨提示
            remainingTime: "10:00", //OTC支付倒计时
            autRemainingTime: "10:00", //虚例币支付二倒计时
        };

        this.setGuessCurrency = this.setGuessCurrency.bind(this); // 设置加密货币
        this.changeCtcType = this.changeCtcType.bind(this); // 更换加密支付类型
        this.goFastCurrency = this.goFastCurrency.bind(this); // 极速虚拟币支付提交
        this.payTypeCode = "CTC"; // 当前支付方式Code

        this.currentCtcMethodType = ""; // 极速虚拟币  虚拟币
        this.ctcResultData = { res: null, methodObj: null }; // 极速虚拟币支付响应数据
        this.startCountDown = this.startCountDown.bind(this); // 倒计时
        this.timeTimer = null; // 倒计时Timer
        this.autTimeTimer = null; // 倒计时Timer
    }
    componentDidMount() {
        this.props.setLoading(true);
        //查看虚例币支付二是否还存在有未完成的交易，若有就跳转到虚例币支付二第二步
        get(
            ApiPort.FastvirtualCurrencyPaymentTwo +
                "&method=CTC&MethodCode=INVOICE_AUT",
        ).then((res) => {
            if (res && res.length && res[0].transactionId) {
                let methodObj = {
                    payMoney: res[0].amount,
                    id: res[0].transactionId,
                };
                this.ctcResultData = { res, methodObj };
                this.setState({
                    ctcMethodType: "INVOICE_AUT",
                    lbStep: 2,
                });
            }
        });
    }
    componentDidUpdate(prevProps, prevState) {
        if (
            Array.isArray(this.props.payMethodList) &&
            this.props.payMethodList.length &&
            !this.state.ctcMethodTypeList.length
        ) {
            const payMethodsDetail = this.props.payMethodList.find(
                (item) => item.code === this.payTypeCode,
            );
            if (payMethodsDetail && payMethodsDetail.availableMethods.length) {
                this.currentCtcMethodType =
                    payMethodsDetail.availableMethods[0].methodCode;
                this.setState({
                    ctcMethodTypeList: payMethodsDetail.availableMethods,
                    ctcMethodType: this.currentCtcMethodType,
                });
            }
        }
        // 设置加密货币默认值
        if (
            Array.isArray(this.props.currDepositDetail.banks) &&
            this.props.currDepositDetail.banks.length &&
            this.props.currDepositDetail.banks !==
                prevProps.currDepositDetail.banks &&
            this.props.currDepositDetail.banks.length === 1
        ) {
            this.setState({
                ctcMethod: this.props.currDepositDetail.banks[0].code,
            });
        }
        // 步骤切换添加温馨提示显隐联动
        if (
            this.state.lbStep !== prevState.lbStep &&
            this.state.ctcMethodType === "OTC"
        ) {
            this.setState({
                showHelpText: this.state.lbStep === 3 ? "none" : "block",
            });
        }
    }
    componentWillUnmount() {
        clearInterval(this.timeTimer);
        clearInterval(this.autTimeTimer);
    }
    changeCtcType({ target: { value } }) {
        this.setState({ ctcMethodType: value }, () => {
            this.props.onCtcMethodChange(this.state.ctcMethodType);
        });
        this.props.setLoading(true);
        GetPayDetail(
            this.payTypeCode,
            (data) => {
                this.props.setCurrDepositDetail(data.result);
                this.props.setLoading(false);
            },
            value,
        );
        switch (value) {
            case "CHANNEL":
                Pushgtagdata("Fastcrypto_crypto_deposit");
                break;
            case "INVOICE":
                Pushgtagdata("Cryto_crypto_deposit");
                break;
            case "OTC":
                Pushgtagdata("OTC_Crypto_deposit");
                break;
            default:
                break;
        }
    }
    goFastCurrency() {
        if (typeof this.props.depositStatusCheck() === "undefined") return;
        let { banks } = this.props.currDepositDetail; // 当前支付方式的详情
        if (Array.isArray(banks) && !banks.length) {
            message.error("请选择支付方式类型！");
            return;
        }
        if (this.state.ctcMethod === "") {
            message.error("请选择加密货币类型！");
            return;
        }
        const methodObj =
            Array.isArray(banks) &&
            banks.find((v) => v.code === this.state.ctcMethod);
        // 重要提示
        Modal.confirm({
            className: "confirm-modal-of-public ctc-confirm",
            icon: <div />,
            title: "重要提示",
            centered: true,
            okText: "确认",
            cancelText: "关闭",
            content: (
                <div
                    className={`ctc-wrapper ctc-prompt align-left ${
                        methodObj.code === "USDT-TRC20" ? "ctcfreeCharge" : ""
                    }`}
                >
                    <div className={`ctc-pay-method-item ${methodObj.code}`}>
                        <i className={`tlc-sprite ${methodObj.code}`} />
                        <p>
                            {NameObj[methodObj.code]} {methodObj.Name} (
                            {methodObj.code})
                        </p>
                    </div>
                    <span className="theme-color">
                        请确保 将 泰达币{" "}
                        {/* {methodObj.Name} ({methodObj.code}) */} 转入收款账户
                        ，若您使用其他虚拟货币支付，则可能造成资金损失。
                    </span>
                    <br />
                    当您点击“确认”，则表示您已同意承担上述风险。
                </div>
            ),
            onOk: () => {
                this.props.setLoading(true);

                get(
                    ApiPort.GetCryptocurrencyInfo +
                        "&ExchangeAmount=1&CoinsCurrency=" +
                        this.state.ctcMethod +
                        "&MethodCode=" +
                        this.state.ctcMethodType,
                ).then((res) => {
                    this.props.setLoading(false);
                    if (res && res.result.status === "SUCCESS") {
                        res = res.result;
                        this.ctcResultData = { res, methodObj };
                        this.setState({
                            lbStep: 2,
                        });
                        return;
                    }

                    if (res && res.result.status === "FAILED") {
                        message.error(res.Error);
                    }
                });

                Pushgtagdata("Confirm_crypto_deposti");
            },
        });

        Pushgtagdata(
            this.state.ctcMethod === "USDT-TRC20" ||
                this.state.ctcMethodType === "OTC"
                ? "Submit_Crypto_deposit"
                : "Next_crypto_deposit",
        );
    }
    setGuessCurrency(ctcMethod) {
        this.setState({ ctcMethod });
        switch (ctcMethod) {
            case "BTC":
                Pushgtagdata("BTC_crypto_deposit");
                break;
            case "ETH":
                Pushgtagdata("ETH_crypto_deposit");
                break;
            case "USDT-ERC20":
                Pushgtagdata("USDT_crypto_deposit");
                break;
            case "USDT-TRC20":
                Pushgtagdata("TRC20_Crypto_deposit");
                break;
            default:
                break;
        }
    }
    payConfirm = (e) => {
        e.preventDefault();
        // 充值前置条件判定
        if (typeof this.props.depositStatusCheck() === "undefined") return;
        if (this.state.ctcMethodType === "INVOICE_AUT") {
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    this.props.setLoading(true);
                    CommonPostPay(
                        {
                            paymentMethod: this.payTypeCode,
                            amount: values.money,
                            transactionType: "Deposit",
                            isMobile: false,
                            isSmallSet: false,
                            successUrl: ApiPort.LOCAL_HOST,
                            mgmtRefNo: "Fun88Desktop",
                            depositingWallet: this.state.targetValue, // 目标账户Code
                            merchantType: 0,
                            MethodCode: this.state.ctcMethodType,
                        },
                        (res) => {
                            this.props.setLoading(false);
                            let resData = res;
                            res = resData.result;
                            res.isSuccess = resData.isSuccess;
                            if (res.isSuccess) {
                                let type =
                                    this.state.ctcMethodTypeList.length &&
                                    this.state.ctcMethodTypeList.find(
                                        (item) =>
                                            item.methodCode ===
                                            this.state.ctcMethodType,
                                    ).methodType;
                                this.props.setLoading(true);
                                let methodObj = {
                                    payMoney: values.money,
                                    id: res.transactionId,
                                };

                                this.setState({
                                    money: values.money,
                                });
                                get(
                                    ApiPort.FastvirtualCurrencyPaymentTwo +
                                        "&method=CTC" +
                                        "&MethodCode=" +
                                        this.state.ctcMethodType +
                                        "&depositID=" +
                                        res.transactionId,
                                )
                                    .then((res) => {
                                        this.props.setLoading(false);
                                        res = res.result;
                                        if (res.length) {
                                            Cookie.Create(
                                                "INVOICE_AUT_DepositTime",
                                                dateFormat(),
                                                { expires: 20 },
                                            );
                                            this.ctcResultData = {
                                                res,
                                                methodObj,
                                            };
                                            this.setState({
                                                lbStep: 2,
                                            });
                                        }
                                        if (res && res.status === "FAILED") {
                                            message.error(res.Error);
                                        }
                                    })
                                    .catch((error) => {
                                        console.log(error);
                                    });
                            }
                        },
                    );
                }
            });
        } else {
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    this.props.setLoading(true);
                    CommonPostPay(
                        {
                            accountHolderName: this.props.localMemberName, // 账户持有人姓名
                            accountNumber: "0", //帐号
                            amount: values.money,
                            bankName: "", //银行名
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
                            offlineRefNo: "0",
                            BankLogID: "",
                            depositingBankAcctNum: "",
                            isPreferredWalletSet: false,
                            depositingWallet: this.state.targetValue, // 目标账户Code
                            bonusId: this.state.bonusVal,
                            bonusCoupon: values.bonusCode || "",
                            secondStepModel: null,
                            MethodCode: this.state.ctcMethodType,
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
                            transferType: {
                                ID: 27,
                                Sorting: 2,
                                Name: "LocalBank",
                                CurrencyCode: "CNY",
                                Code: "LocalBank",
                                IsActive: true,
                            },
                        },
                        (res) => {
                            this.props.setLoading(false);
                            let resData = res;
                            res = resData.result;
                            res.isSuccess = resData.isSuccess;
                            if (res.isSuccess) {
                                this.setState({
                                    lbStep: 3,
                                    transactionId: res.transactionId,
                                    money: values.money,
                                });
                                // 关掉充值教程入口
                                this.props.toggleLearnEntry(false);
                                // 跳到第三方支付
                                this.props.thirdPartyPay(res);
                                Cookie.Create("OTCDepositTime", dateFormat(), {
                                    expires: 10,
                                });
                                this.startCountDown();
                                // 重置表单
                                this.props.form.resetFields();
                            }
                        },
                    );
                }
            });
        }

        Pushgtagdata("Next_crypto_deposit");
    };
    startCountDown() {
        clearInterval(this.timeTimer);
        const time = Cookie.Get("OTCDepositTime")
            .replace("-", "/")
            .replace("-", "/");
        let lastSeconds = parseInt(
            600 - (new Date().getTime() - new Date(time).getTime()) / 1000,
        );
        this.setState({ remainingTime: lastSeconds });
        time !== null && time !== ""
            ? (this.timeTimer = setInterval(() => {
                  if (lastSeconds <= 0) {
                      Cookie.Create("OTCDepositTime", null);
                      clearInterval(this.timeTimer);
                  }
                  this.setState({
                      remainingTime: formatSeconds(lastSeconds--),
                  });
              }, 1000))
            : Cookie.Create("OTCDepositTime", null);
    }
    autStartCountDown = () => {
        clearInterval(this.autTimeTimer);
        const time = Cookie.Get("INVOICE_AUT_DepositSuccessTime")
            .replace("-", "/")
            .replace("-", "/");
        let lastSeconds = parseInt(
            600 - (new Date().getTime() - new Date(time).getTime()) / 1000,
        );
        this.setState({ autRemainingTime: lastSeconds });
        time !== null && time !== ""
            ? (this.autTimeTimer = setInterval(() => {
                  if (lastSeconds <= 0) {
                      Cookie.Create("INVOICE_AUT_DepositSuccessTime", null);
                      clearInterval(this.autTimeTimer);
                      this.setState({ lbStep: 1 });
                  }
                  this.setState({
                      autRemainingTime: formatSeconds(lastSeconds--),
                  });
              }, 1000))
            : Cookie.Create("INVOICE_AUT_DepositSuccessTime", null);
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
                "View_TransactionRecord_Deposit",
            );
    };
    copyEvent() {
        message.success("已复制");
    }
    render() {
        let { setting, banks } = this.props.currDepositDetail; // 当前支付方式的详情
        const { getFieldDecorator, getFieldValue, getFieldsError } =
            this.props.form;
        const {
            targetValue,
            bonusVal,
            lbStep,
            remainingTime,
            autRemainingTime,
        } = this.state;
        const { isShowBankCardVerif } = this.props;
        console.log("渠道-------------------->", banks);
        return (
            <div className="ctc-wrapper">
                <USDTBanner />
                {/* 第一步骤 */}
                <div style={{ display: lbStep === 1 ? "block" : "none" }}>
                    {/* <div className="modal-prompt-info clear-margin-bottom">{paymentReminder[this.state.ctcMethodType]}</div> */}
                    <div
                        className="modal-prompt-info"
                        style={{
                            display: isShowBankCardVerif ? "block" : "none",
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
                    <div className="modal-prompt-info clear-margin-bottom">
                        重要提示：若使用泰达币支付，部分平台将征收手续费。
                        当日总存款达相应金额可获得手续费无限返还福利。
                        *目前支持使用泰达币 (USDT-ERC20及USDT-TRC20协议)
                        进行存款。
                    </div>
                    {this.state.ctcMethodTypeList.length &&
                    this.state.ctcMethodTypeList ? (
                        <Item label="选择支付方式">
                            <Radio.Group
                                className="wallet-radio-wrap"
                                onChange={this.changeCtcType}
                                value={this.state.ctcMethodType}
                            >
                                {this.state.ctcMethodTypeList.map((item) => {
                                    return (
                                        <Radio
                                            key={item.methodCode}
                                            className="ant-input ant-input-lg wallet-radio"
                                            value={item.methodCode}
                                        >
                                            {item.methodType}
                                        </Radio>
                                    );
                                })}
                            </Radio.Group>
                        </Item>
                    ) : null}
                    <div className="modal-prompt-info TextLightGrey">
                        {PROMOINFO[this.state.ctcMethodType]}
                    </div>

                    {this.state.ctcMethodType === "CHANNEL" ? (
                        <React.Fragment>
                            {Array.isArray(banks) && banks.length ? (
                                <div className="ant-row ant-form-item">
                                    <div className="ant-col ant-form-item-label">
                                        <label className="" title="">
                                            加密货币
                                        </label>
                                    </div>
                                    <div className="ant-col ant-form-item-control-wrapper">
                                        {banks.map((item) => {
                                            return (
                                                <div
                                                    key={item.Id}
                                                    className={`ctc-pay-method-item ${
                                                        item.code ===
                                                        "USDT-TRC20"
                                                            ? "ctcfreeCharge"
                                                            : ""
                                                    } ${item.code}${
                                                        this.state.ctcMethod ===
                                                        item.code
                                                            ? " curr"
                                                            : ""
                                                    }`}
                                                    onClick={() => {
                                                        this.setGuessCurrency(
                                                            item.code,
                                                        );
                                                    }}
                                                >
                                                    {/* <div className="ctc-currency-tip">免手续费</div> */}
                                                    <i
                                                        className={`tlc-sprite ${item.code}`}
                                                    />

                                                    <p>
                                                        {NameObj[item.code] && (
                                                            <span>
                                                                {
                                                                    NameObj[
                                                                        item
                                                                            .code
                                                                    ]
                                                                }
                                                                <br />
                                                            </span>
                                                        )}
                                                        {item.Name} ({item.code}
                                                        )
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : null}
                            <Button
                                size="large"
                                type="primary"
                                onClick={this.goFastCurrency}
                                disabled={
                                    Object.values(getFieldsError()).some(
                                        (v) => v !== undefined,
                                    ) || this.state.ctcMethod === ""
                                }
                                block
                            >
                                下一步
                            </Button>
                        </React.Fragment>
                    ) : (
                        <Form
                            className="form-wrap"
                            {...formItemLayout}
                            onSubmit={this.payConfirm}
                        >
                            <MoneyInput
                                {...this.props.dialogTabKey}
                                getFieldDecorator={getFieldDecorator}
                                payTypeCode={this.payTypeCode}
                                payMethodList={this.props.payMethodList}
                                setCurrDepositDetail={
                                    this.props.setCurrDepositDetail
                                }
                                setting={setting}
                                depositMethod={this.state.ctcMethodType}
                            />
                            <TargetAccount
                                depositMethod={this.state.ctcMethodType}
                                {...this.props.dialogTabKey}
                                getFieldDecorator={getFieldDecorator}
                                getFieldValue={getFieldValue}
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
                                    this.setState({
                                        bonusVal: v,
                                        bonusName: name,
                                    });
                                }}
                            />
                            <Button
                                disabled={
                                    Object.values(getFieldsError()).some(
                                        (v) => v !== undefined,
                                    ) || !getFieldValue("money")
                                }
                                size="large"
                                type="primary"
                                htmlType="submit"
                                block
                            >
                                下一步
                            </Button>
                        </Form>
                    )}
                </div>
                {/* 第二步骤 */}
                <SecondStep
                    lbStep={lbStep}
                    setPromptInfo={this.props.setPromptInfo}
                    setLbStep={(v) => {
                        this.setState({ lbStep: v });
                    }}
                    setLoading={this.props.setLoading}
                    ctcResultData={this.ctcResultData}
                    ctcMethodType={this.state.ctcMethodType}
                    transactionId={(v) => {
                        this.setState({ transactionId: v });
                    }}
                    setStartCountDown={this.autStartCountDown}
                />

                {/* 第三步骤 */}
                <div
                    className="lb-third-step-wrap"
                    style={{ display: lbStep === 3 ? "block" : "none" }}
                >
                    <div className="stepDone">
                        {/* <Icon type="check-circle" theme="filled" /> */}

                        <img
                            src="/cn/img/icons/icon-success.png"
                            width={"60px"}
                            className="iconstatus"
                        />
                        <div className="successtext">已成功提交</div>
                        <div className="StepsBox">
                            <Steps
                                current={0}
                                direction="vertical"
                                size="small"
                            >
                                <Step
                                    title="提交成功"
                                    description="处理中"
                                    icon={
                                        <BsCheckCircleFill
                                            color="#108ee9"
                                            size={17}
                                        />
                                    }
                                />
                                <Step
                                    title=""
                                    description={`预计${this.state.remainingTime}分钟到账`}
                                    icon={
                                        <BsCircle color="#999999" size={12} />
                                    }
                                />
                            </Steps>
                        </div>
                        <div className="DepositInfo">
                            <div className="list">
                                <span>存款金额</span>
                                <span className="bold">
                                    ¥ {this.state.money}
                                </span>
                            </div>
                            <div className="list">
                                <span>交易单号</span>
                                <span>
                                    {this.state.transactionId}
                                    <CopyToClipboard
                                        text={this.state.transactionId}
                                        onCopy={this.copyEvent}
                                    >
                                        <img
                                            style={{
                                                marginLeft: "0.4rem",
                                                cursor: "pointer",
                                            }}
                                            src={`/cn/img/icons/Copys.svg`}
                                        />
                                    </CopyToClipboard>
                                </span>
                            </div>
                        </div>
                        {/* <div className="check-success">
							<div className="cuccess">{this.state.remainingTime}</div>
						</div>
						<p>交易需要一段时间，请稍后再检查您的目标账户。</p> */}
                    </div>
                    <center>
                        <p className="note">
                            您可以回到首页继续投注，请等待10分钟以刷新金额，
                            如果有任何问题，请联系我们的在线客服
                        </p>
                    </center>
                    <div className="btn-wrap">
                        <Button
                            size="large"
                            type="primary"
                            htmlType="submit"
                            onClick={this.goRecord}
                            block
                        >
                            查看交易记录
                        </Button>

                        <Button
                            ghost
                            size="large"
                            type="primary"
                            htmlType="submit"
                            onClick={() => {
                                this.props.onCancel();
                                setTimeout(() => {
                                    if (Router.router.pathname != "/cn") {
                                        Router.push("/cn");
                                    }
                                }, 300);
                            }}
                            block
                            style={{ marginTop: "15px" }}
                        >
                            回到首页
                        </Button>
                    </div>
                </div>

                {/* 温馨提示 */}
                {/* <div className="deposit-help-wrap" style={{display: this.state.showHelpText}}>
                    <h4><span className="fontBold">温馨提示：</span></h4>
                    <p>使用<span className="fontBold"> [泰达币] </span>充值方式的 们请注意：</p>
                    <ul>
                        <li>小同暂时仅接受在充值页面上所显示的加密货币进行交易，在您购买货币时请务必记得选择对的货币才购买哦。</li>
                        <li><span className="fontBold">极速虚拟币</span> - 这个支付渠道里所产生的二维码和收款地址都是您的专属收款地址，就像 的银行账号一样，所以在您进行极速虚拟币充值时，务必输入小同给予您的专属收款地址于提币地址那一栏来进行交易哦。</li>
                        <li><span className="fontBold">虚拟币支付</span> -  这个支付渠道第三方的页面里，每次交易所产生的二维码和收款地址<span className="redTip">仅限一次使用</span>。记住别重复使用哦！不然您的充值将无法到账哟。</li>
                        <li>当您使用第三方平台购买<span className="fontBold">比特币(BTC) 或 泰达币（ERC20 或 TRC20）</span>时，部分平台会收取手续费，手续费则以第三平台方所显示的为准。<br /></li>
                    </ul>
                    <p>* 不同的泰达币协定将征收不同数量的手续费，使用 TRC20 协定手续费会比 ERC20 协定来得划算哟！更多详情可<Button type="link" onClick={() => this.props.tutorial()}>查询充值教学</Button>。</p>
                </div> */}
            </div>
        );
    }
}
export default Form.create({ name: "CTC" })(CTC);
