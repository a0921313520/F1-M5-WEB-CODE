import React from "react";
import { Button, Form, Input, message } from "antd";
import MoneyInput from "./../MoneyInput";
import TargetAccount from "./../TargetAccount";
import { formItemLayout, tailFormItemLayout } from "$ACTIONS/constantsData";
import { ApiPort } from "$ACTIONS/TLCAPI";
import { CommonPostPay } from "$DATA/wallet";
import USDTBanner from "../../USDTBanner";
import FinishStep from "../FinishStep/";
const { Item } = Form;

class CC extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            targetValue: "", // 目标账户State值
            targetName: "", // 目标账户名称
            bonusVal: 0, // 可申请优惠Val值
            bonusName: "", // 可申请优惠名称
        };

        this.payTypeCode = "CC"; // 当前支付方式Code
        this.tlcCardNumberReg = /^[a-zA-Z0-9_]{1,}$/;
        this.tlcCardPasswordReg = /^[a-zA-Z0-9_]{1,}$/;
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
                        accountHolderName: "",
                        accountNumber: "0",
                        amount: values.money,
                        bankName: "",
                        bonusId: this.state.bonusVal,
                        bonusCoupon: values.bonusCode || "",
                        cardExpiryDate: "",
                        cardName: "",
                        cardNumber: values.tlccardnumber,
                        cardPIN: values.tlccardpin,
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
                        if (res.isSuccess) {
                            message.success("充值成功！");
                            this.props.form.resetFields();
                            if (!res.result.uniqueAmount) {
                                res.result.uniqueAmount = values.money;
                            }
                            this.setState({
                                FinishData: res.result,
                                Finish: true,
                            });
                        }
                    }
                );
            }
        });

        Pushgtagdata("Deposit​", "Submit​", "Submit_CashCard_Deposit");
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
        const { getFieldsError, getFieldValue, getFieldDecorator } =
            this.props.form;
        const { targetValue, bonusVal, Finish, FinishData } = this.state;
        const { isShowBankCardVerif } = this.props;
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
                                display: isShowBankCardVerif ? "block" : "none",
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
                        {/* <div className="modal-prompt-info">乐卡是一种充值预付卡，通过第三方平台轻松购买（乐卡），无需激活，无需透露个人银行资料。</div> */}
                        <MoneyInput
                            {...this.props.dialogTabKey}
                            getFieldDecorator={getFieldDecorator}
                            payTypeCode={this.payTypeCode}
                            payMethodList={this.props.payMethodList}
                            setCurrDepositDetail={
                                this.props.setCurrDepositDetail
                            }
                            setting={setting}
                        />
                        <Item label="序列号">
                            {getFieldDecorator("tlccardnumber", {
                                rules: [
                                    {
                                        required: true,
                                        message: "请填写乐卡序列号！",
                                    },
                                    {
                                        validator: (rule, value, callback) => {
                                            if (value) {
                                                if (
                                                    !this.tlcCardNumberReg.test(
                                                        value
                                                    )
                                                ) {
                                                    callback(
                                                        "乐卡序列号不接受字母"
                                                    );
                                                }
                                            }
                                            callback();
                                        },
                                    },
                                ],
                            })(
                                <Input
                                    size="large"
                                    placeholder="现金卡序列号"
                                    autoComplete="off"
                                    maxLength={16}
                                />
                            )}
                        </Item>
                        <Item label="密码">
                            {getFieldDecorator("tlccardpin", {
                                rules: [
                                    {
                                        required: true,
                                        message: "请填写乐卡密码！",
                                    },
                                    {
                                        validator: (rule, value, callback) => {
                                            if (value) {
                                                if (
                                                    !this.tlcCardPasswordReg.test(
                                                        value
                                                    )
                                                ) {
                                                    callback(
                                                        "密码只能包含数字，字母或者下划线"
                                                    );
                                                }
                                            }
                                            callback();
                                        },
                                    },
                                ],
                            })(
                                <Input.Password
                                    size="large"
                                    placeholder="现金卡密码"
                                    autoComplete="off"
                                    maxLength={10}
                                />
                            )}
                        </Item>
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
                                        ) ||
                                        !getFieldValue("money") ||
                                        !getFieldValue("tlccardpin") ||
                                        !getFieldValue("tlccardnumber")
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
                )}

                {/* 温馨提示 */}
                <div className="deposit-help-wrap">
                    <h4>乐天使温馨提醒：</h4>
                    <p>
                        乐卡是一种充值预付卡，通过第三方平台轻松购买(乐卡)，无需激活，无需透露个人银行资料.
                        一般到帐时间约15分钟 使用乐卡存款更方便快捷.
                        如果您想了解更多关于乐卡的存款或购买详情, 欢迎咨询
                        <span
                            className="blue"
                            onClick={() => {
                                global.PopUpLiveChat();
                            }}
                        >
                            在线客服
                        </span>
                        。
                    </p>
                    <p>依照以下3个简单的步骤即可存上：</p>
                    <ul>
                        <li>从乐天堂指定合作伙伴购买乐卡。</li>
                        <li>确保乐卡的货币与乐天堂账户上的保持一致。 </li>
                        <li>输入正确的乐卡序列号和密码。</li>
                    </ul>
                </div>
            </React.Fragment>
        );
    }
}
export default Form.create({ name: "CC" })(CC);
