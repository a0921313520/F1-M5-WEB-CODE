import React from "react";
import { Button, Form, Input, message, DatePicker } from "antd";
import dynamic from "next/dynamic";
import TargetAccount from "./../TargetAccount";
import { formItemLayout, tailFormItemLayout } from "$ACTIONS/constantsData";
import { ApiPort } from "$ACTIONS/TLCAPI";
import { formatAmount, mul } from "$ACTIONS/util";
import { CommonPostPay } from "$DATA/wallet";
import { depositMoneyInt } from "$ACTIONS/reg";
import USDTBanner from "../../USDTBanner";

const { Item } = Form;
const MonthPicker = dynamic(
    import("antd/lib/date-picker").then((mod) => mod.default.MonthPicker),
    {
        loading: () => (
            <div className="ant-skeleton ant-skeleton-with-avatar ant-skeleton-active">
                <div className="ant-skeleton-content">
                    <ul className="ant-skeleton-paragraph">
                        <li />
                    </ul>
                </div>
            </div>
        ),
    },
);

class AP extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            year: false,
            month: false,
            time: null,
            yeartime: null,
            monthtime: null,
            targetValue: "", // 目标账户State值
            targetName: "", // 目标账户名称
            bonusVal: 0, // 可申请优惠Val值
            bonusName: "", // 可申请优惠名称
            moneyType: "", // AstroPay 卡金额类型 (RMB)(USD)
            sudMonetary: 0, // 美金转换结果
        };

        this.payTypeCode = "AP"; // 当前支付方式Code
        this.moneyInfo = {
            Rate: 0,
            minBalVal: 0,
            maxBalVal: 0,
            minBal: 0,
            maxBal: 0,
            minBalUSDVal: 0,
            maxBalUSDVal: 0,
            minBalUSD: 0,
            maxBalUSD: 0,
        };
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
                        amount:
                            this.state.moneyType === "USD"
                                ? this.state.sudMonetary
                                : values.money, // 计算汇率后的金额 RMB
                        bankName: "",
                        bonusId: this.state.bonusVal,
                        bonusCoupon: values.bonusCode || "",
                        cardExpiryDate: values.carddate, // AstroPay有效期
                        cardName: "",
                        cardNumber: values.astromumber, // AstroPay的卡号
                        cardPIN: values.pin, // AstroPay的PIN码
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
                        paymentMethod: "AP",
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
                        }
                    },
                );
            }
        });

        Pushgtagdata("Deposit​", "Submit​", "Submit_astropay_Deposit");
    };

    handlePanelChange = (value, type) => {
        console.log(">>>>>", value);
        this.setState({
            [type + "time"]: value,
            [type]: false,
        });
        this.props.form.setFieldsValue({ carddate: value });
    };

    handleOpenChange = (status, type) => {
        // console.log(status)
        if (status) {
            this.setState({ [type]: true });
        } else {
            this.setState({ [type]: false });
        }
    };

    clearValue = () => {
        this.setState({
            [type + "time"]: null,
        });
        this.props.form.setFieldsValue({ carddate: null });
    };
    render() {
        let { setting } = this.props.currDepositDetail; // 当前支付方式的详情
        const { getFieldsError, getFieldValue, getFieldDecorator } =
            this.props.form;
        const { targetValue, bonusVal } = this.state;
        if (setting && setting.exchangeRates[0]) {
            (this.moneyInfo.Rate = setting.exchangeRates[0].rate),
                (this.moneyInfo.minBalVal = setting.minBal),
                (this.moneyInfo.maxBalVal = setting.maxBal),
                (this.moneyInfo.minBal = formatAmount(
                    this.moneyInfo.minBalVal,
                )),
                (this.moneyInfo.maxBal = formatAmount(
                    this.moneyInfo.maxBalVal,
                )),
                (this.moneyInfo.minBalUSDVal =
                    this.moneyInfo.minBalVal / this.moneyInfo.Rate),
                (this.moneyInfo.maxBalUSDVal =
                    this.moneyInfo.maxBalVal / this.moneyInfo.Rate),
                (this.moneyInfo.minBalUSD = formatAmount(
                    this.moneyInfo.minBalUSDVal,
                )),
                (this.moneyInfo.maxBalUSD = formatAmount(
                    this.moneyInfo.maxBalUSDVal,
                ));
        }

        return (
            <React.Fragment>
                <USDTBanner />
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
                        <span className="spanText">开启更多充值和提现方式</span>
                        <p className="pText">
                            点击上方按钮完成验证，小同为您承担网银转账 5% 手续费
                        </p>
                    </div>
                    <Item label="AstroPay卡号">
                        {getFieldDecorator("astromumber", {
                            rules: [
                                {
                                    required: true,
                                    message: "请输入AstroPay卡号！",
                                },
                                {
                                    validator: (rule, value, callback) => {
                                        if (value) {
                                            const isPassAstroPay =
                                                value.toString().length === 16;
                                            if (
                                                !depositMoneyInt.test(value) ||
                                                !isPassAstroPay
                                            ) {
                                                callback(
                                                    "AstroPay卡号格式有误",
                                                );
                                            }
                                            if (isPassAstroPay) {
                                                if (
                                                    value
                                                        .toString()
                                                        .substr(3, 1) === "6"
                                                ) {
                                                    this.setState({
                                                        moneyType: "USD",
                                                        sudMonetary:
                                                            formatAmount(
                                                                parseInt(
                                                                    mul(
                                                                        getFieldValue(
                                                                            "money",
                                                                        ),
                                                                        this
                                                                            .moneyInfo
                                                                            .Rate,
                                                                    ),
                                                                ),
                                                            ),
                                                    });
                                                } else {
                                                    this.setState({
                                                        moneyType: "RMB",
                                                    });
                                                }
                                                callback();
                                            }
                                        }
                                        callback();
                                    },
                                },
                            ],
                        })(
                            <Input
                                size="large"
                                placeholder="请输入AstroPay卡号"
                                autoComplete="off"
                                maxLength={16}
                            />,
                        )}
                    </Item>
                    <Item label="安全码">
                        {getFieldDecorator("pin", {
                            rules: [
                                { required: true, message: "请填写安全码！" },
                            ],
                        })(
                            <Input
                                size="large"
                                type="password"
                                placeholder="请输入安全码"
                                autoComplete="off"
                                maxLength={20}
                            />,
                        )}
                    </Item>

                    <Item label="有效日期">
                        {getFieldDecorator("carddate", {
                            rules: [
                                { required: true, message: "请选择有效日期！" },
                            ],
                        })(
                            <div className="PickerBox">
                                <DatePicker
                                    value={this.state.yeartime}
                                    mode="year"
                                    size="large"
                                    placeholder="请选择年份"
                                    format="YYYY"
                                    open={this.state.year}
                                    onOpenChange={(e) => {
                                        this.handleOpenChange(e, "year");
                                    }}
                                    onPanelChange={(e) => {
                                        this.handlePanelChange(e, "year");
                                    }}
                                    onChange={(e) => {
                                        this.clearValue(e, "year");
                                    }}
                                />
                                <DatePicker
                                    value={this.state.monthtime}
                                    placeholder="请选择月份"
                                    size="large"
                                    mode="month"
                                    format="MM"
                                    open={this.state.month}
                                    onOpenChange={(e) => {
                                        this.handleOpenChange(e, "month");
                                    }}
                                    onPanelChange={(e) => {
                                        this.handlePanelChange(e, "month");
                                    }}
                                    onChange={(e) => {
                                        this.clearValue(e, "month");
                                    }}
                                />
                            </div>,
                        )}
                    </Item>
                    <Item
                        label={`卡片面值${this.state.moneyType ? "（" + this.state.moneyType + "）" : ""}(USD/RMB)`}
                    >
                        {" "}
                        {/* label={`卡片面值(USD/RMB)`}  */}
                        {/* ${this.state.moneyType ? '（' + this.state.moneyType + '）' : ''} */}
                        {getFieldDecorator("money", {
                            initialValue: this.props.dialogTabKey.money,
                            rules: [
                                { required: true, message: "请填写金额！" },
                                {
                                    validator: (rule, value, callback) => {
                                        if (value) {
                                            if (!depositMoneyInt.test(value)) {
                                                callback(
                                                    "金额格式错误，只允许输入整数",
                                                );
                                            }
                                            if (
                                                this.state.moneyType === "USD"
                                            ) {
                                                if (
                                                    value >
                                                    this.moneyInfo.maxBalUSDVal
                                                ) {
                                                    callback(
                                                        "最高存款金额：$" +
                                                            this.moneyInfo
                                                                .maxBalUSD,
                                                    );
                                                }
                                                if (
                                                    value <
                                                    this.moneyInfo.minBalUSDVal
                                                ) {
                                                    callback(
                                                        "最低存款金额：$" +
                                                            this.moneyInfo
                                                                .minBalUSD,
                                                    );
                                                }
                                                if (
                                                    value <=
                                                        this.moneyInfo
                                                            .maxBalUSDVal &&
                                                    value >=
                                                        this.moneyInfo
                                                            .minBalUSDVal
                                                ) {
                                                    this.setState({
                                                        sudMonetary:
                                                            formatAmount(
                                                                parseInt(
                                                                    mul(
                                                                        value,
                                                                        this
                                                                            .moneyInfo
                                                                            .Rate,
                                                                    ),
                                                                ),
                                                            ),
                                                    });
                                                }
                                            } else {
                                                if (
                                                    value >
                                                    this.moneyInfo.maxBalVal
                                                ) {
                                                    callback(
                                                        "最高存款金额：" +
                                                            this.moneyInfo
                                                                .maxBal +
                                                            "元",
                                                    );
                                                }
                                                if (
                                                    value <
                                                    this.moneyInfo.minBalVal
                                                ) {
                                                    callback(
                                                        "最低存款金额：" +
                                                            this.moneyInfo
                                                                .minBal +
                                                            "元",
                                                    );
                                                }
                                            }
                                            callback();
                                        } else {
                                            this.setState({ sudMonetary: 0 });
                                            callback();
                                        }
                                    },
                                },
                            ],
                        })(
                            <Input
                                size="large"
                                autoComplete="off"
                                maxLength={20}
                                placeholder={`单笔存款范围:${this.moneyInfo.minBal} ($${this.moneyInfo.minBalUSD}) - ${this.moneyInfo.maxBal} ($${this.moneyInfo.maxBalUSD})`}
                            />,
                        )}
                    </Item>
                    {this.state.moneyType === "USD" ? (
                        <Item label="实际存入（RMB）">
                            <Input
                                size="large"
                                className="tlc-input-disabled"
                                disabled={true}
                                value={this.state.sudMonetary}
                            />
                        </Item>
                    ) : null}

                    <div className="modal-prompt-info">{`最低：${this.moneyInfo.minBal} 人民币（${this.moneyInfo.minBalUSD} 美元），最高金额 : ${this.moneyInfo.maxBal} 人民币（${this.moneyInfo.maxBalUSD} 美元）。`}</div>
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
                                    Object.values(getFieldsError()).some(
                                        (v) => v !== undefined,
                                    ) ||
                                    !this.state.yeartime ||
                                    !this.state.monthtime
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
                {/* 温馨提示 */}
                <div className="deposit-help-wrap">
                    <h4>乐天使温馨提醒：</h4>
                    <ul>
                        <li>
                            AstroPay卡是一种充值预付卡，在淘宝等网站均有出售不同面值
                            Astropay卡。{" "}
                        </li>
                        <li>
                            依次填写卡号、安全码、有效日期、卡片面值后点击提交。{" "}
                        </li>
                        <li>如有问题请联系在线客服。</li>
                    </ul>
                </div>
            </React.Fragment>
        );
    }
}
export default Form.create({ name: "AP" })(AP);
