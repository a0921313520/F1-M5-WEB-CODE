import React from "react";
import { Button, Form, Input } from "antd";
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

        this.payTypeCode = "QQ"; // 当前支付方式Code
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
                    },
                );
            }
        });

        Pushgtagdata("Deposit​", "Submit​", "Submit_onlineQQpay_Deposit");
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
        const moneyValue = parseInt(getFieldValue("money"));

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
                        onSubmit={(e) => {
                            let lodash = false;
                            if (!this.lodash) {
                                this.payConfirm(e);
                                lodash = true;
                            }
                            setTimeout(() => {
                                lodash = false;
                            }, 2000);
                        }}
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
                        {/* {moneyValue && !!setting.charges ? <Item label="实际到账">
							<Input size="large" className="tlc-input-disabled" disabled={true} value={moneyValue + setting.charges} />
						</Item> : null} */}
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
                                            (v) => v !== undefined,
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
                        {/* <div className="modal-prompt-info">
							收款商户将会不定时变动，请在充值前到此页面提交申请获取最新二维码。存款过程中切勿重复扫码，多次扫码会导致系统记录异常而无法成功到账。
						</div> */}
                    </Form>
                )}

                {/* 温馨提示 */}
                <div className="deposit-help-wrap">
                    <h4>乐天使温馨提醒：</h4>
                    {this.refs.Channeldefault &&
                    this.refs.Channeldefault.state.Channeldefault == "QQRP" ? (
                        <ul>
                            <li>
                                首先登入您的QQ账号，打开【我的QQ钱包】&#8250;【全部应用】&#8250;【QQ红包】的【QQ面对面红包】{" "}
                            </li>
                            <li>
                                在【QQ面对面红包】页面输入存款金额，点击确认之后将回生成二维码{" "}
                            </li>
                            <li>
                                将面对面红包二维码进行截图/若无法成功截图，若无法成功截图，建议使用其他设备进行拍摄
                            </li>
                            <li>
                                请记得在QQ红包支付渠道过程中，点击上传二维码截图以便顺利完成存款
                            </li>
                        </ul>
                    ) : (
                        <ul>
                            <li>键入存款金额。 </li>
                            <li>
                                点击提交后，页面下方会自动生成二维码(此二维码仅本次有效)
                                。{" "}
                            </li>
                            <li>使用手机打开QQ，扫描二维码转至付款页面。 </li>
                            <li>确保信息无误提交即可。</li>
                            <li>QQ支付到账时间为15分钟左右。 </li>
                            <li>QQ支付不支持信用卡存款。</li>
                        </ul>
                    )}
                </div>
            </React.Fragment>
        );
    }
}
export default Form.create({ name: "JDP" })(JDP);
