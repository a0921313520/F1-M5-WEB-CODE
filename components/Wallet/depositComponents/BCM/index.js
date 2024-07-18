import React from "react";
import { Button, Form, Modal, Select, message } from "antd";
import MoneyInput from "./../MoneyInput";
import TargetAccount from "./../TargetAccount";
import BankAccount from "./../BankAccount";
import { formItemLayout, tailFormItemLayout } from "$ACTIONS/constantsData";
import { ApiPort } from "$ACTIONS/TLCAPI";
import { CommonPostPay } from "$DATA/wallet";
import USDTBanner from "../../USDTBanner";
import FinishStep from "../FinishStep/";
const { Item } = Form;
const { Option } = Select;

class BCM extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bankCodeState: "", // 存款銀行Code值
            targetValue: "", // 目标账户State值
            targetName: "", // 目标账户名称
            bonusVal: 0, // 可申请优惠Val值
            bonusName: "", // 可申请优惠名称
        };

        this.payTypeCode = "BCM"; // 当前支付方式Code
    }
    componentDidMount() {
        // 设置在线支付的默认值
        this.props.bcTypeList.length &&
            this.props.changeBcType(this.props.bcTypeList[0].code, true);
    }
    payConfirm = (e) => {
        e.preventDefault();

        if (
            typeof this.props.depositStatusCheck(
                this.props.bcType,
                this.state.bankCodeState,
            ) === "undefined"
        )
            return; // 未完成真实姓名验证则呼出完善弹窗
        if (this.state.bankCodeState == "") {
            message.error("请选择银行");
            return;
        }
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
                        // BC 网银支付需要银行Code  BCM 快捷支付不需要银行Code
                        // "bankName": this.props.bcType === "BC" ? this.state.bankCodeState : "",
                        bankName: this.state.bankCodeState,
                        bonusId: this.state.bonusVal,
                        bonusCoupon: values.bonusCode || "",
                        cardExpiryDate: "",
                        cardName: "",
                        cardNumber: "",
                        cardPIN: "",
                        charges: 0,
                        couponText: "",
                        depositingBankAcctNum: "",
                        depositingWallet: this.state.targetValue, // 目标账户Code
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
                        paymentMethod: "BCM",
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

                        if (res.isSuccess) {
                            this.props.thirdPartyPay(res.result);
                            this.props.form.resetFields();
                            this.setState({
                                FinishData: res.result,
                                Finish: true,
                            });
                        }
                    },
                );
            }
        });

        Pushgtagdata("Deposit​", "Submit​", "Submit_onlinebankpay_Deposit");
    };

    goRecord = () => {
        this.props.onCancel();
        this.props.goUserCenter("records");
        sessionStorage.setItem("selectTabKey", "deposit");
        typeof global.changeRecordFilterType === "function" &&
            global.changeRecordFilterType("deposit");
    };

    submitBtnEnable = () => {
        let { banks, setting } = this.props.currDepositDetail;
        let errors = Object.values(this.props.form.getFieldsError()).some(
            (v) => v !== undefined,
        );
        let values = Object.values(this.props.form.getFieldsValue()).some(
            (v) => v == "" || v == undefined,
        );
        if (
            setting &&
            setting.showDepositorNameField &&
            !setting.prefillRegisteredName
        ) {
            return (
                !values &&
                this.props.form.getFieldValue("money") !== "" &&
                !errors &&
                banks &&
                banks.length > 0
            );
        }
        if (banks?.length) {
            return (
                this.props.form.getFieldValue("money") !== "" &&
                !errors &&
                banks &&
                banks.length > 0
            );
        }
        return this.props.form.getFieldValue("money") !== "" && !errors;
    };
    render() {
        let { setting, banks } = this.props.currDepositDetail; // 当前支付方式的详情
        const {
            getFieldsError,
            getFieldDecorator,
            getFieldValue,
            setFieldsValue,
            setFields,
            getFieldError,
        } = this.props.form;
        const { bcTypeList } = this.props;
        const { bankCodeState, targetValue, bonusVal, FinishData, Finish } =
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
                        <BankAccount
                            keyName={["name", "code"]}
                            isAutoAssign={setting && setting.isAutoAssign}
                            bankAccounts={banks}
                            bankCodeState={bankCodeState}
                            setBankCode={(v) => {
                                this.setState({ bankCodeState: v });
                            }}
                        />
                        <TargetAccount
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
                                    提交
                                </Button>
                            </div>
                        </Item>
                        {/* <div className="modal-prompt-info">您的款项, 将在15-30分钟内到账, 如有问题请联系<Button type="link" className="inline" onClick={global.PopUpLiveChat}>在线客服</Button>。</div> */}
                    </Form>
                )}

                {/* 温馨提示 */}
                <div className="deposit-help-wrap">
                    <h4>乐天使温馨提醒：</h4>

                    <ul>
                        <li>
                            会员可使用您的银联卡，维萨卡(VISA)或万事达卡(MasterCard)进行存款，只需输入符合要求的存款金额，点击提交即可操作。{" "}
                        </li>
                        <li>到账时间通常约1-10分钟</li>
                    </ul>
                </div>
            </React.Fragment>
        );
    }
}
export default Form.create({ name: "BCM" })(BCM);
