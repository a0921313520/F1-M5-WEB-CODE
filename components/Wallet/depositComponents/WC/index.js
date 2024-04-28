import React from "react";
import { Button, Form, Icon } from "antd";
import MoneyInput from "./../MoneyInput";
import SecondStep from "./SecondStep";
import TargetAccount from "./../TargetAccount";
import { formItemLayout, tailFormItemLayout } from "$ACTIONS/constantsData";
import { ApiPort } from "$ACTIONS/TLCAPI";
import { CommonPostPay } from "$DATA/wallet";
import { formatSeconds, mul } from "$ACTIONS/util";
import USDTBanner from "../../USDTBanner";
import FinishStep from "../FinishStep/";
const { Item } = Form;

class WC extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            targetValue: "", // 目标账户State值
            targetName: "", // 目标账户名称
            bonusVal: 0, // 可申请优惠Val值
            bonusName: "", // 可申请优惠名称
            lbStep: 1, // 支付渠道，快速支付宝步骤
            countTimeStr: "30:00",
        };

        this.payTypeCode = "WC"; // 当前支付方式Code
        this.countTime = 1800; // 快速转账第三步骤倒计时
        this.oaResultData = {};
        this.timer = null;

        this.startCountDown = this.startCountDown.bind(this);
    }
    componentDidMount() {}
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
                            if (
                                this.props.currDepositDetail.setting &&
                                this.props.currDepositDetail.setting
                                    .methodCode === "WCBnBQR"
                            ) {
                                this.oaResultData = res;
                                this.setState({ lbStep: 2 });
                            } else {
                                this.setState({
                                    Finish: true,
                                    FinishData: res,
                                });
                                this.props.thirdPartyPay(res);
                            }

                            this.props.form.resetFields();
                        }
                    }
                );
            }
        });

        Pushgtagdata("Deposit​", "Submit​", "Submit_Onlinewechatpay_Deposit");
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
            setFields,
            getFieldError,
        } = this.props.form;
        const { targetValue, bonusVal, lbStep, Finish, FinishData } =
            this.state;

        return (
            <React.Fragment>
                <USDTBanner />
                {/* 成功提交的页面 */}
                {Finish && (
                    <FinishStep
                        collectionInfo={FinishData}
                        Time={"10:00"}
                        goRecord={() => {
                            this.goRecord();
                        }}
                        goHome={() => {
                            this.props.onCancel("ToHome");
                        }}
                    />
                )}

                {!Finish && (
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
                            <span className="spanText">
                                开启更多充值和提现方式
                            </span>
                            <p className="pText">
                                点击上方按钮完成验证，小同为您承担网银转账 5%
                                手续费
                            </p>
                        </div>
                        <div className="modal-prompt-info">
                            为避免款项延迟或掉单,
                            请于2分钟内完成扫码及转账动作。
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
                                    {setting && setting.methodCode === "WCBnBQR"
                                        ? "下一步"
                                        : "提交"}
                                </Button>
                            </div>
                        </Item>
                    </Form>
                )}

                {/* 第二步骤 */}
                <SecondStep
                    lbStep={lbStep}
                    setLbStep={(v) => {
                        // this.setState({ lbStep: v });
                        this.setState({
                            Finish: true,
                            FinishData: this.oaResultData,
                            lbStep: v,
                        });
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
                {/* 温馨提示 */}
                <div
                    className="deposit-help-wrap"
                    style={{
                        display:
                            setting &&
                            setting.methodCode === "WCBnBQR" &&
                            (lbStep === 1 || lbStep === 3)
                                ? "none"
                                : "block",
                    }}
                >
                    <h4>乐天使温馨提醒：</h4>
                    <ul>
                        <li>
                            v信支付简易快捷，仅需要两步即可完成！ <br />
                            a.输入预存金额提交
                            <br />
                            b.进入v信确认金额，输入支付密码即可成功支付
                        </li>

                        <li>
                            【限时优惠】刹那迟疑，后会有期！乐天堂v信支付免手续费
                        </li>
                    </ul>
                </div>
            </React.Fragment>
        );
    }
}
export default Form.create({ name: "WC" })(WC);
