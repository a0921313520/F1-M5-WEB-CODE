import React from "react";
import { Button, Form } from "antd";
import MoneyInput from "./../MoneyInput";
import TargetAccount from "./../TargetAccount";
import { formItemLayout, tailFormItemLayout } from "$ACTIONS/constantsData";
import { ApiPort } from "$ACTIONS/TLCAPI";
import { CommonPostPay } from "$DATA/wallet";
import USDTBanner from "../../USDTBanner";
import FinishStep from "../FinishStep/";
const { Item } = Form;

class JDP extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            targetValue: "", // 目标账户State值
            targetName: "", // 目标账户名称
            bonusVal: 0, // 可申请优惠Val值
            bonusName: "", // 可申请优惠名称
        };

        this.payTypeCode = "JDP"; // 当前支付方式Code
    }
    componentDidMount() {}
    payConfirm = (e) => {
        e.preventDefault();

        if (typeof this.props.depositStatusCheck() === "undefined") return; // 未完成真实姓名验证则呼出完善弹窗

        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.setLoading(true);
                CommonPostPay(
                    {
                        methodcode:
                            this.refs.Channeldefault.state.Channeldefault,
                        accountHolderName: "",
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
                        isPreferredWalletSet: false, // 是否设为默认目标账户,
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
                            this.props.thirdPartyPay(res);
                            this.setState({
                                FinishData: res,
                                Finish: true,
                            });
                            this.props.form.resetFields();
                        }
                    }
                );
            }
        });

        Pushgtagdata("Deposit​", "Submit​", "Submit_JDwallet_Deposit");
    };

    goRecord = () => {
        this.props.onCancel();
        this.props.goUserCenter("records");
        sessionStorage.setItem("selectTabKey", "deposit");
        typeof global.changeRecordFilterType === "function" &&
            global.changeRecordFilterType("deposit");
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
        const { targetValue, bonusVal, Finish, FinishData } = this.state;

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
                                        Object.values(getFieldsError()).some(
                                            (v) => v !== undefined
                                        ) || !getFieldValue("money")
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
                        {/* <div className="modal-prompt-info">收款商户将会不定时变动，请在充值前到此页面提交申请获取最新二维码。存款过程中切勿重复扫码，多次扫码会导致系统记录异常而无法成功到账。</div> */}
                    </Form>
                )}

                {/* 温馨提示 */}
                {/* <div className="deposit-help-wrap">
          <h4>充值步骤：</h4>
          <ul>
            <li>请输入存款金额点击 “提交”。</li>
            <li>接着，使用手机 银联 APP 扫描二维码。并且在 5 分钟之内完成支付，否则二维码将失效无法进行支付。</li>
            <li>扫描二维码后，银联 APP 将会显示付款信息点击“立即付款”继续付款过程。</li>
            <li>输入确认支付密码再点击“完成”即可。一旦支付过程完成，银联 APP 将显示一个通知页面，以确认支付成功。</li>
            <li>如有问题请联系<Button type="link" onClick={global.PopUpLiveChat}>在线客服</Button>。</li>
          </ul>
        </div> */}
            </React.Fragment>
        );
    }
}
export default Form.create({ name: "JDP" })(JDP);
