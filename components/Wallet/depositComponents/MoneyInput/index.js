import React from "react";
import { Input, Form, Radio } from "antd";
import { formatAmount, mul, deteleObject } from "$ACTIONS/util";
import { get } from "$ACTIONS/TlcRequest";
import { depositMoneyDecimal, depositMoneyInt } from "$ACTIONS/reg";
import { ApiPort, APISETS } from "$ACTIONS/TLCAPI";
import { GetPayDetail, GetAvailableMethods } from "$DATA/wallet";
import WalletName from "@/RealyName/WalletName";
const { Item } = Form;
class MoneyInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Channeldefault: "",
            SuggestedAmount: "",
            Amountvalue: "",
            SuggestedAmounthide: false,
            Amountfalse: false,
            isSetAmountFromSuggested: false,
        };
        this.uniqueAmountStatus = true;
        this.ispayMethod = "";
        props.payMethodList.some((v) => {
            if (v.code === props.payTypeCode) {
                this.ispayMethod = v;
                this.uniqueAmountStatus = v.uniqueAmountStatus;
                return true;
            }
        });
        /* 只有这些需要有支付渠道 */
        this.Needlist = ["JDP", "OA", "UP", "QQ", "BC", "BCM", "WC", "PPB"];
        this.inputTimer = false;
    }

    componentDidMount() {
        this.setState({
            Channeldefault:
                this.ispayMethod != ""
                    ? GetAvailableMethods(this.ispayMethod)
                    : "",
        });
    }

    componentWillUnmount() {
        this.setState({ isSetAmountFromSuggested: false });
    }

    onChange = (e) => {
        this.setState({
            Channeldefault: e.target.value,
            SuggestedAmounthide: true,
            SuggestedAmount: "",
        });
        this.props.setFieldsValue({
            money: "",
        });

        this.props.setLoading(true);
        GetPayDetail(
            this.props.payTypeCode,
            (data) => {
                this.props.setCurrDepositDetail(data.result);
                this.props.setLoading(false);
            },
            e.target.value,
        );
    };

    Testamount = (value, payTypeCode) => {
        this.setState({ isSetAmountFromSuggested: false });
        if (!value) {
            return;
        }

        // 添加防抖节流
        // if (this.inputTimer) {
        //     return;
        // }

        //this.inputTimer = true;
        clearTimeout(this.inputTimer);
        this.props.setLoading(true);
        this.inputTimer = setTimeout(() => {
            get(`
                ${ApiPort.SuggestedAmount}?amount=${value}&method=${payTypeCode}&methodcode=${this.state.Channeldefault} ${APISETS}`).then(
                (res) => {
                    //this.inputTimer = false;
                    this.props.setLoading(false);

                    if (res && res.isSuccess && res.result.length != 0) {
                        this.setState(
                            {
                                SuggestedAmount: res.result,
                                SuggestedAmounthide: false,
                            },
                            // () => {
                            //     let error = this.props.getFieldError("money");
                            //     let haveData = false;
                            //     res.result.map((item) => {
                            //         if (item == value) {
                            //             this.props.setFieldsValue({
                            //                 money: value,
                            //             });
                            //             haveData = true;
                            //         }
                            //     });
                            //     if (!haveData) {
                            //         this.props.setFields({
                            //             money: {
                            //                 value: value,
                            //                 errors: [
                            //                     new Error(
                            //                         error
                            //                             ? error != "Error"
                            //                                 ? error
                            //                                 : ""
                            //                             : "请选择以上存款金额以便快速到账"
                            //                     ),
                            //                 ],
                            //             },
                            //         });
                            //     }
                            // }
                            () => {
                                let error = this.props.getFieldError("money");
                                this.props.setFields({
                                    money: {
                                        value: value,
                                        errors: [
                                            new Error(
                                                error
                                                    ? error != "Error"
                                                        ? error
                                                        : ""
                                                    : "",
                                            ),
                                        ],
                                    },
                                });
                            },
                        );
                    }
                },
            );
        }, 300);
    };

    render() {
        const {
            getFieldDecorator,
            payTypeCode,
            setFieldsValue,
            depositMethod,
        } = this.props;
        let setting = this.props.setting; // 当前支付方式的详情
        !setting && (setting = { MinBal: 0, MaxBal: 0, DayBal: 0 }); // 初始化Setting
        const minBal = formatAmount(setting.minBal),
            transferNumber = formatAmount(setting.transferNumber),
            maxBal = formatAmount(setting.maxBal);

        const charges =
            parseFloat(this.state.Amountvalue) +
            parseFloat(setting.charges * this.state.Amountvalue);
        // 0: {MethodType: "极速虚拟币支付", MethodCode: "CHANNEL"}
        // MethodCode: "CHANNEL"
        // MethodType: "极速虚拟币支付"
        // 1: {MethodType: "虚拟币交易所(OTC)", MethodCode: "OTC"}
        // MethodCode: "OTC"
        // MethodType: "虚拟币交易所(OTC)"
        // 2: {MethodType: "虚拟币支付 1", MethodCode: "INVOICE"}
        // MethodCode: "INVOICE"
        // MethodType: "虚拟币支付 1"
        // 3: {MethodType: "虚拟币支付 2", MethodCode: "INVOICE_AUT"}
        // MethodCode: "INVOICE_AUT"
        // MethodType: "虚拟币支付 2"
        const hasMaxMoney = payTypeCode !== "CTC";
        return (
            <React.Fragment>
                {this.Needlist.includes(payTypeCode) &&
                    this.ispayMethod != "" &&
                    this.ispayMethod.availableMethods.length != 0 && (
                        <div>
                            {this.ispayMethod.availableMethods.length == 1 &&
                            this.ispayMethod.availableMethods[0].methodCode ==
                                "DEFAULT" ? (
                                ""
                            ) : (
                                <Item
                                    label={
                                        <div>
                                            支付渠道
                                            {/* <span className="theme-color">
                                                {" "}
                                                *
                                            </span> */}
                                        </div>
                                    }
                                    className={`Pay_Radio ${payTypeCode}`}
                                >
                                    <Radio.Group
                                        onChange={(e) => this.onChange(e)}
                                        value={this.state.Channeldefault}
                                    >
                                        {deteleObject(
                                            this.ispayMethod.availableMethods,
                                        ).map((item, index) => {
                                            return (
                                                item.methodCode !=
                                                    "DEFAULT" && (
                                                    <Radio
                                                        key={
                                                            item.methodCode +
                                                            index
                                                        }
                                                        className={
                                                            item.methodCode
                                                        }
                                                        value={item.methodCode}
                                                    >
                                                        {item.methodType}
                                                    </Radio>
                                                )
                                            );
                                        })}
                                    </Radio.Group>
                                </Item>
                            )}
                        </div>
                    )}
                {payTypeCode == "WC" &&
                setting.charges &&
                setting.charges < 0 ? (
                    <div className="TextLightGreyInfo">
                        温馨提示：使用{this.ispayMethod.name}
                        进行存款时，第三方平台将征收手续费{" "}
                        {mul(Math.abs(setting.charges), 100)} %
                    </div>
                ) : null}
                <WalletName
                    payTypeCode={payTypeCode}
                    getFieldDecorator={getFieldDecorator}
                    showDepositorNameField={
                        setting && setting.showDepositorNameField
                    }
                    prefillRegisteredName={
                        setting && setting.prefillRegisteredName
                    }
                />
                <Item
                    label={
                        <div>
                            {`存款金额`}{" "}
                            {/* ${`（￥${minBal}~￥${maxBal}）`} */}
                            {/* <span className="theme-color">*</span> */}
                        </div>
                    }
                    className="deposit-moneyinput"
                >
                    {getFieldDecorator("money", {
                        initialValue: this.props.money || "",
                        getValueFromEvent: (event) => {
                            // 限制只能为数字并且数字最多带2位小数
                            const reg = /^(\.*)(\d+)(\.?)(\d{0,2}).*$/g;
                            switch (payTypeCode) {
                                case "WCLB":
                                case "ALB":
                                case "AP":
                                case "OA":
                                case "WC":
                                case "QQ":
                                case "JDP":
                                case "CC":
                                case "PPB":
                                case "CTC":
                                    return event.target.value.replace(
                                        reg,
                                        "$2$3$4",
                                    );
                                case "BCM":
                                case "BC":
                                    // regex \.(?=.*\.) 保留一個. 其餘的.全部抓取 ||  /^0(?=\d+)/ 抓取第一個輸入的0
                                    return event.target.value
                                        .replace(/[^\d.]|\.(?=.*\.)/g, "")
                                        .replace(reg, "$2$3$4")
                                        .replace(/^0(?=\d+)/g, "");
                                case "LB":
                                case "UP":
                                    return event.target.value
                                        .replace(/[^\d]+/g, "")
                                        .replace(/^(0)([\d]+)/, "$2");
                                default:
                                    return event.target.value.replace(
                                        /[^\d]+/g,
                                        "",
                                    );
                            }
                        },
                        rules: [
                            { required: true, message: "请输入金额" },
                            {
                                validator: (rule, value, callback) => {
                                    if (this.state.isSetAmountFromSuggested) {
                                        return callback();
                                    }
                                    if (value) {
                                        this.setState({
                                            Amountvalue: value,
                                        });

                                        if (
                                            payTypeCode === "WCLB" ||
                                            payTypeCode === "LB" ||
                                            payTypeCode === "ALB" ||
                                            payTypeCode === "AP" ||
                                            payTypeCode === "BCM" ||
                                            payTypeCode === "OA" ||
                                            payTypeCode === "WC" ||
                                            payTypeCode === "QQ" ||
                                            payTypeCode === "JDP" ||
                                            payTypeCode === "CC" ||
                                            payTypeCode === "PPB" ||
                                            payTypeCode === "BC" ||
                                            (payTypeCode === "CTC" &&
                                                setting.methodCode !== "OTC" &&
                                                setting.methodCode !==
                                                    "INVOICE_AUT")
                                        ) {
                                            !depositMoneyDecimal.test(value) &&
                                                callback(
                                                    "金额格式错误，最高保留1至2位小数",
                                                );
                                        } else {
                                            !depositMoneyInt.test(value) &&
                                                callback("金额格式错误");
                                        }
                                        if (value < setting.minBal) {
                                            callback(
                                                `最低存款金额 ${minBal} 元`,
                                            );
                                        }
                                        if (value > setting.maxBal) {
                                            callback(
                                                `最高存款金额 ${maxBal} 元​`,
                                            );
                                        }
                                        if (
                                            payTypeCode === "UP" ||
                                            payTypeCode === "BC" ||
                                            payTypeCode === "BCM"
                                        ) {
                                            const oddReg = /(\d*[34567]$)/;
                                            const isDecimal =
                                                String(value).includes(".");
                                            const isDecimalZero =
                                                isDecimal &&
                                                Number(
                                                    String(value).split(".")[1],
                                                ) === 0;
                                            if (!isDecimal || isDecimalZero) {
                                                // 只驗證整數部分
                                                if (
                                                    !oddReg.test(
                                                        String(value).split(
                                                            ".",
                                                        )[0],
                                                    )
                                                ) {
                                                    callback(
                                                        "金额尾数必须为 3 , 4 , 5 , 6 , 7",
                                                    );
                                                }
                                            }
                                        }
                                        if (
                                            this.uniqueAmountStatus &&
                                            value.toString().substr(-1) ===
                                                "0" &&
                                            payTypeCode !== "UP" &&
                                            payTypeCode !== "BC" &&
                                            payTypeCode !== "BCM"
                                        ) {
                                            callback('金额必须以 "1-9" 结尾');
                                        }
                                    }
                                    callback();
                                },
                            },
                        ],
                    })(
                        <Input
                            size="large"
                            placeholder={`${
                                hasMaxMoney
                                    ? `单笔存款范围: ${minBal}~${maxBal},每日可存款${transferNumber}次`
                                    : `单笔存款范围: ${minBal}~${maxBal}`
                            }`}
                            autoComplete="off"
                            maxLength={20}
                            onChange={(value) => {
                                if (!this.Needlist.includes(payTypeCode))
                                    return;
                                this.Testamount(
                                    value.target.value,
                                    payTypeCode,
                                );
                            }}
                        />,
                    )}

                    {/* 新需求 推荐金额 */}
                    {this.Needlist.includes(payTypeCode) &&
                        this.state.SuggestedAmount != "" && (
                            <div className="SuggestedAmountDiv">
                                <div className="arrow" />
                                <p>请选择以下存款金额以便快速到账</p>
                                <ul>
                                    {this.state.SuggestedAmount.map(
                                        (value, index) => {
                                            return (
                                                <li
                                                    className={`${
                                                        this.state
                                                            .Amountvalue ==
                                                        value
                                                    }`}
                                                    onClick={() => {
                                                        setFieldsValue({
                                                            money: value,
                                                        });
                                                        this.setState({
                                                            Amountvalue: value,
                                                            SuggestedAmounthide: true,
                                                            SuggestedAmount: "",
                                                            isSetAmountFromSuggested: true,
                                                        });
                                                    }}
                                                    key={value}
                                                >
                                                    {value}
                                                </li>
                                            );
                                        },
                                    )}
                                </ul>
                            </div>
                        )}
                </Item>
                {this.Needlist.includes(payTypeCode) &&
                setting &&
                setting.vendorCharges ? (
                    <div className="modal-prompt-info error-color">
                        温馨提示：此交易将征收第三方手续费，请于提交后确认交易详情，再进行转帐。
                    </div>
                ) : null}
                {payTypeCode != "WC" &&
                this.Needlist.find((item) => item == payTypeCode) &&
                setting.charges &&
                setting.charges < 0 ? (
                    <div className="TextLightGreyInfo">
                        温馨提示：使用{this.ispayMethod.name}
                        进行存款时，第三方平台将征收手续费{" "}
                        {mul(Math.abs(setting.charges), 100)} %
                    </div>
                ) : null}
                <div
                    className="modal-waining-info error-color"
                    style={{
                        display:
                            setting.methodCode === "AliBnBQR" ||
                            setting.methodCode === "WCBnBQR" ||
                            this.uniqueAmountStatus
                                ? "block"
                                : "none",
                    }}
                >
                    {/* {this.uniqueAmountStatus ? (
						'基于风控机制，建议提交充值的时候，尾数请避免输入0，建议提交1-9的金额，举例: 135元，128元等的，以免无法提交充值。'
					) : (
						'为了使您的充值快速到账，建议您输入以 “1-9” 结尾的整数金额进行充值，例如301，519元等。'
					)} */}
                </div>
                {/* <div className="modal-prompt-info">
					{hasMaxMoney ? (
						`单笔金额最低: ${minBal} 元; 最高: ${maxBal} 元 ，每日总允许金额 ${formatAmount(setting.dayBal)} 元`
					) : (
						`单笔最低金额: ${minBal} 元, 最高金额: ${maxBal} 元。`
					)}
				</div> */}
                {setting.charges !== 0 &&
                    (setting.methodCode !== "AliBnBQR" ||
                        setting.methodCode !== "WCBnBQR") && (
                        <Item label={`实际到账`} className="">
                            <Input
                                size="large"
                                placeholder={``}
                                value={charges ? charges.toFixed(2) : ""}
                                disabled
                                autoComplete="off"
                                maxLength={20}
                            />
                        </Item>
                    )}
            </React.Fragment>
        );
    }
}
export default MoneyInput;
