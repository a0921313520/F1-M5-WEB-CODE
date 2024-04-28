import React from "react";
import { Button, Form, Icon } from "antd";
import SecondStep from "./SecondStep";
import MoneyInput from "./../MoneyInput";
import TargetAccount from "./../TargetAccount";
import { formItemLayout, tailFormItemLayout } from "$ACTIONS/constantsData";
import { ApiPort } from "$ACTIONS/TLCAPI";
import { CommonPostPay } from "$DATA/wallet";
import { formatSeconds, mul } from "$ACTIONS/util";
import USDTBanner from "../../USDTBanner";
import FinishStep from "../FinishStep/";

const { Item } = Form;

class OA extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            targetValue: "", // 目标账户State值
            targetName: "", // 目标账户名称
            bonusVal: 0, // 可申请优惠Val值
            bonusName: "", // 可申请优惠名称
            Channeldefault: "",
            lbStep: 1, // 支付渠道，快速支付宝步骤
            countTimeStr: "30:00",
        };

        this.payTypeCode = "OA"; // 当前支付方式Code
        this.countTime = 1800; // 快速转账第三步骤倒计时
        this.oaResultData = {};
        this.timer = null;

        this.startCountDown = this.startCountDown.bind(this);
    }
    componentDidMount() {
        this.setState({
            Channeldefault: this.refs.Channeldefault.state.Channeldefault,
        });
    }
    componentDidUpdate(prevProps, prevState) {
        //  支付渠道，快速支付宝第三步骤记录
        if (prevState.lbStep !== this.state.lbStep) {
            this.state.lbStep === 3 && this.startCountDown();
        }
    }
    componentWillUnmount() {
        clearInterval(this.timer);
    }
    startCountDown() {
        this.timer = setInterval(() => {
            this.setState({ countTimeStr: formatSeconds(this.countTime--) });
        }, 1000);
    }
    payConfirm = (e) => {
        e.preventDefault();
        if (typeof this.props.depositStatusCheck() === "undefined") return; // 未完成真实姓名验证则呼出完善弹窗
        this.depositName = this.props.form.getFieldValue("accountHolderName");
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.setLoading(true);
                CommonPostPay(
                    {
                        methodcode:
                            this.refs.Channeldefault.state.Channeldefault,
                        accountHolderName:
                            this.depositName != null
                                ? this.depositName
                                : JSON.parse(localStorage.getItem("memberInfo"))
                                      .firstName,
                        accountNumber: "0",
                        amount: values.money,
                        bankName: "",
                        bonusId: this.state.bonusVal,
                        bonusCoupon: values.bonusCode || "",
                        cardExpiryDate: "",
                        cardName: "",
                        cardNumber: "",
                        cardPIN: "",
                        charges: 0,
                        couponText: "",
                        depositingBankAcctNum: "",
                        depositingWallet: this.state.targetValue, // 目标账户Code,
                        domainName: ApiPort.LOCAL_HOST,
                        fileBytes: "",
                        fileName: "",
                        isMobile: false,
                        isPreferredWalletSet: false, // 是否设为默认目标账户
                        isSmallSet: false,
                        language: "zh-cn",
                        mgmtRefNo: "Fun88Desktop",
                        offlineDepositDate: "",
                        offlineRefNo: "0",
                        paymentMethod: this.payTypeCode,
                        refNo: "0",
                        secondStepModel: null,
                        successUrl: ApiPort.LOCAL_HOST,
                        transactionType: "Deposit",
                        transferType: null,
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
                            this.oaResultData = res;
                            if (
                                this.props.currDepositDetail.setting &&
                                this.props.currDepositDetail.setting
                                    .methodCode === "AliBnBQR"
                            ) {
                                this.setState({ lbStep: 2 });
                            } else {
                                this.props.thirdPartyPay(res);
                                this.setState({ lbStep: 3 });
                            }

                            this.props.form.resetFields();
                        }
                    }
                );
            }
        });

        Pushgtagdata("Deposit​", "Submit​", "Submit_Onlinealipay_Deposit");
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

    submitBtnEnable = () => {
        let { setting } = this.props.currDepositDetail;
        let errors = Object.values(this.props.form.getFieldsError()).some(
            (v) => v !== undefined
        );
        let values = Object.values(this.props.form.getFieldsValue()).some(
            (v) => v == "" || v == undefined
        );
        if (
            setting &&
            setting.showDepositorNameField &&
            !setting.prefillRegisteredName
        ) {
            return (
                !values &&
                this.props.form.getFieldValue("money") !== "" &&
                !errors
            );
        }
        return this.props.form.getFieldValue("money") !== "" && !errors;
    };

    render() {
        let { setting } = this.props.currDepositDetail; // 当前支付方式的详情
        const {
            getFieldsError,
            getFieldValue,
            getFieldDecorator,
            setFieldsValue,
            getFieldInstance,
            setFields,
            getFieldError,
        } = this.props.form;
        const { targetValue, bonusVal, lbStep } = this.state;

        return (
            <React.Fragment>
                <USDTBanner />
                <Form
                    className="form-wrap"
                    style={{ display: lbStep === 1 ? "block" : "none" }}
                    {...formItemLayout}
                    onSubmit={this.payConfirm}
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
                        setFieldsValue={setFieldsValue}
                        setLoading={this.props.setLoading}
                        ref="Channeldefault"
                        setFields={setFields}
                        getFieldError={getFieldError}
                    />
                    <TargetAccount
                        {...this.props.dialogTabKey}
                        getFieldValue={getFieldValue}
                        getFieldDecorator={getFieldDecorator}
                        setLoading={this.props.setLoading}
                        targetValue={targetValue}
                        setTargetValue={(v, name) => {
                            this.setState({ targetValue: v, targetName: name });
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
                                {setting && setting.methodCode === "AliBnBQR"
                                    ? "下一步"
                                    : "提交"}
                            </Button>
                        </div>
                    </Item>
                </Form>
                {/* 第二步骤 */}
                <SecondStep
                    lbStep={lbStep}
                    setLbStep={(v) => {
                        this.setState({ lbStep: v });
                    }}
                    oaResultData={this.oaResultData}
                />
                {/* 第三步骤 */}
                {/* <div className="lb-third-step-wrap" style={{ display: lbStep === 3 ? 'block' : 'none' }}>
					<Icon type="check-circle" theme="filled" />
					<div className="check-success">
						<div>提交成功</div>
						<div className="cuccess">交易编码 : {this.oaResultData.transactionId}</div>
					</div>
					<p>您的存款将于 {this.state.countTimeStr} 内到账，感谢您的耐心等待。</p>
					<div className="btn-wrap">
						<Button size="large" type="primary" htmlType="submit" onClick={this.goRecord} block>
							查看交易记录
						</Button>
					</div>
				</div> */}

                {/* 成功提交的页面 */}
                {lbStep === 3 && (
                    <FinishStep
                        collectionInfo={this.oaResultData}
                        Time={this.state.countTimeStr}
                        goRecord={() => {
                            this.goRecord();
                        }}
                        goHome={() => {
                            this.props.onCancel("ToHome");
                        }}
                    />
                )}

                {/* 温馨提示 */}
                <div
                    className="deposit-help-wrap"
                    style={{
                        display:
                            setting &&
                            setting.methodCode === "AliBnBQR" &&
                            (lbStep === 1 || lbStep === 3)
                                ? "none"
                                : "block",
                    }}
                >
                    <h4>乐天使温馨提醒：</h4>
                    <ul>
                        <li>输入存款金额点击提交。 </li>
                        <li>打开支付宝，点击扫一扫完成支付即可。 </li>
                        <li>
                            使用在线支付宝和京东支付扫码存款时，请不要保留二维码后进行多次扫码存款，以免出现延迟到账的现象，谢谢您的配合。
                        </li>
                        {/* <li>
							{
								setting && setting.charges >= 0 ? '在线支付宝免手续费。' :
									`在线支付宝将收取 ${setting && setting.charges != 0 && mul(setting.charges, 100).toString().replace('-', '')}%手续费。`
							}
						</li>
						<li>点击 “提交” 后，请在 5 分钟之内完成支付。 </li>
						<li> 请注意，收款商户将会不定时更换，请在充值前到此页面提交申请获取最新的收款商户信息。充值过程中切勿重复提交或充值到旧商户，以免导致系统记录异常而无法成功到账。</li> */}
                    </ul>
                </div>
            </React.Fragment>
        );
    }
}
export default Form.create({ name: "OA" })(OA);
