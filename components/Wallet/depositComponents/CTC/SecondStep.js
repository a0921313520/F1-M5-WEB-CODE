import React from "react";
import { formItemLayout } from "$ACTIONS/constantsData";
import { formatSeconds, formatTime, dateFormat } from "$ACTIONS/util";
import { InvoiceAutDeposit, CancelTheDealMethod } from "$DATA/wallet";
import { Button, Col, Form, Input, message, Modal, Row } from "antd";
import QRCode from "qrcode-react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Cookie } from "$ACTIONS/helper";
const { Item } = Form;
class SecondStep extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOtherAccount: false, // 是否存入其它账号
            remainingTime: "20:00", //INVOICE_AUT支付倒计时
            showTimeOutModal: false, //INVOICE_AUT支付超时
            iNVOICEAUTValue: "", //交易哈希值
            errorTip: false, //交易哈希值错误的提示判断
            isCancelTheDealModal: false, //虚例币支付二取消交易
        };

        this.copySuccessCall = this.copySuccessCall.bind(this);
        this.startCountDown = this.startCountDown.bind(this); // 倒计时
        this.timeTimer = null; // 倒计时Timer
    }
    componentDidMount() {}
    componentDidUpdate(prevProps, prevState) {
        if (
            prevProps.lbStep !== this.props.lbStep &&
            this.props.ctcMethodType === "INVOICE_AUT" &&
            this.props.ctcResultData.res &&
            this.props.ctcResultData.methodObj
        ) {
            console.log("123123123");
            Cookie.Get("INVOICE_AUT_DepositTime") !== null
                ? this.startCountDown()
                : clearInterval(this.timeTimer);
        }
    }
    componentWillUnmount() {
        clearInterval(this.timeTimer);
    }
    goBackStep = (e) => {
        e && typeof e !== "string" && e.preventDefault();

        this.props.setLbStep(1);
        Pushgtagdata("Close_crypto_deposit");
        // e !== "notClear" && this.props.form.resetFields();
    };
    copySuccessCall() {
        message.success("已复制");
        Pushgtagdata("Copy_crypto_deposit");
    }
    startCountDown() {
        clearInterval(this.timeTimer);
        const time = Cookie.Get("INVOICE_AUT_DepositTime")
            .replace("-", "/")
            .replace("-", "/");
        let lastSeconds = parseInt(
            1200 - (new Date().getTime() - new Date(time).getTime()) / 1000
        );
        this.setState({ remainingTime: lastSeconds });
        time !== null && time !== ""
            ? (this.timeTimer = setInterval(() => {
                  if (lastSeconds <= 0) {
                      Cookie.Create("INVOICE_AUT_DepositTime", null);
                      clearInterval(this.timeTimer);
                      this.setState({ showTimeOutModal: true });
                  }
                  this.setState({
                      remainingTime: formatSeconds(lastSeconds--),
                  });
              }, 1000))
            : Cookie.Create("INVOICE_AUT_DepositTime", null);
    }
    closeModal = (e) => {
        e && typeof e !== "string" && e.preventDefault();
        this.setState({ showTimeOutModal: false });
        this.props.setLbStep(1);
        Pushgtagdata("Close_crypto_deposit");
    };
    onchangeInput = (e) => {
        const reg = /^(0x)[a-zA-Z0-9]{64}$/;
        let value = e.target.value;
        this.setState({ iNVOICEAUTValue: value }, () => {
            if (reg.test(value) === false) {
                this.setState({ errorTip: false });
            } else {
                this.setState({ errorTip: true });
            }
        });
    };
    ctcAUTMethodSubmit = (e) => {
        e && typeof e !== "string" && e.preventDefault();
        this.props.setLoading(true);
        let data = {
            transactionID: this.props.ctcResultData.res[0].transactionId,
            transactionHash: this.state.iNVOICEAUTValue,
        };
        InvoiceAutDeposit(data, (res) => {
            this.props.setLoading(false);
            if (res && res.isSuccess) {
                Cookie.Create("INVOICE_AUT_DepositSuccessTime", dateFormat(), {
                    expires: 10,
                });
                this.props.setLbStep(3);
                this.props.transactionId(res.result.transactionId);
                this.props.setStartCountDown();
            }
            if (res && res.errorMessage !== "" && res.isSuccess == false) {
                message.error(res.errorMessage);
            }
        });
        Pushgtagdata &&
            Pushgtagdata("Deposit", "Submit", "Submit_invoice2_Crypto_Deposit");
    };
    //取消交易
    cancelTheDeal = (e) => {
        e && typeof e !== "string" && e.preventDefault();

        let data = {
            transactionId: this.props.ctcResultData.res[0].transactionId,
        };
        this.props.setLoading(true);
        CancelTheDealMethod(data, (res) => {
            this.props.setLoading(false);
            if (res.isSuccess) {
                this.setState({ isCancelTheDealModal: false });
                this.props.setLbStep(1);
                // this.props.setPromptInfo('您的交易已撤消');
                message.success("交易已取消");
                this.setState({ iNVOICEAUTValue: "" });
            }
        });
    };
    render() {
        const { res, methodObj } = this.props.ctcResultData;
        const { ctcMethodType } = this.props;
        const {
            remainingTime,
            showTimeOutModal,
            iNVOICEAUTValue,
            errorTip,
            isCancelTheDealModal,
        } = this.state;

        return (
            <React.Fragment>
                {ctcMethodType === "CHANNEL" && (
                    <Form
                        className="form-wrap"
                        style={{
                            display: this.props.lbStep === 2 ? "block" : "none",
                        }}
                        {...formItemLayout}
                        onSubmit={this.goBackStep}
                    >
                        {/* <Item label="充值方式">
                        <Input className="tlc-input-disabled" size="large" disabled={true} value="加密货币" />
                        </Item> */}
                        <div className="tlc-deposit-receipt">
                            {methodObj && res ? (
                                <ul>
                                    {/* <li>
										<h2>您的存款信息</h2>
									</li>
									<li className="item-wrap">
										<span className="item-label">支付方式</span>
										<span>极速虚拟币支付</span>
									</li> */}
                                    <li
                                        className="item-wrap"
                                        style={{ flexDirection: "column" }}
                                    >
                                        {/* <span className="item-label">加密货币</span> */}
                                        <img
                                            src={`/cn/img/wallet/${methodObj.code}.jpg`}
                                        />

                                        <span>
                                            {methodObj.name} ({methodObj.code})
                                        </span>
                                    </li>
                                    <li className="item-wrap">
                                        <span className="item-label">
                                            参考汇率
                                        </span>
                                        <span>
                                            1 {res.BaseCurrency} ={" "}
                                            {res.exchangeAmount} 人民币
                                        </span>
                                        <p className="red">
                                            请注意在完成交易时，汇率可能会发生变化。
                                        </p>
                                    </li>
                                    <li className="item-wrap">
                                        <span className="item-label">
                                            二维码
                                        </span>
                                        <span />
                                    </li>
                                    <li className="center">
                                        <QRCode
                                            size={160}
                                            value={res.deepLink}
                                        />
                                    </li>
                                    <li className="item-wrap">
                                        <span className="item-label">
                                            收款地址
                                        </span>
                                        <span />
                                    </li>
                                    <li className="item-wrap">
                                        <span
                                            style={{
                                                color: "#222222",
                                                position: "relative",
                                                minWidth: "100%",
                                                textAlign: "left",
                                                padding: "8px 10px 6px 10px",
                                                backgroundColor: "#f5f5f5",
                                            }}
                                            className="modal-prompt-info clear-margin-bottom"
                                        >
                                            {res.walletAddress}
                                            <CopyToClipboard
                                                text={res.walletAddress}
                                                onCopy={this.copySuccessCall}
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
                                        {/* <p className="theme-color" style={{width: "100%", marginTop: 14, marginBottom: 0}}>最低存款数量：{res.minAmt} {res.BaseCurrency} </p> */}

                                        <p
                                            className="theme-color"
                                            style={{ paddingTop: "10px" }}
                                        >
                                            最低存款数量 : {res.minAmt}{" "}
                                            {res.BaseCurrency}.
                                            该收款地址是您的专属地址，可以多次使用。
                                        </p>
                                    </li>
                                </ul>
                            ) : null}
                        </div>
                        <Row gutter={20}>
                            {/* <Col span={12}>
								<Button
									size="large"
									type="primary"
									onClick={() => {
										this.props.setLbStep(1);
										Pushgtagdata('Back_crypto_deposit');
									}}
									ghost
									block
								>
									回上一步
								</Button>
							</Col> */}
                            <Col span={24}>
                                <Button
                                    size="large"
                                    type="primary"
                                    htmlType="submit"
                                    block
                                >
                                    关闭
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                )}

                {ctcMethodType === "INVOICE_AUT" && (
                    <Form
                        className="form-wrap INVOICE-AUT-form"
                        style={{
                            display: this.props.lbStep === 2 ? "block" : "none",
                        }}
                        {...formItemLayout}
                        onSubmit={this.ctcAUTMethodSubmit}
                    >
                        {/* <Item label="充值方式">
              <Input className="tlc-input-disabled" size="large" disabled={true} value="泰达币" />
            </Item> */}
                        <div className="tlc-deposit-receipt">
                            {methodObj && res[0] ? (
                                <ul>
                                    <li>
                                        <h2>您的存款信息</h2>
                                    </li>
                                    <li className="item-wrap">
                                        <span className="item-label">
                                            {/* 交易生成时间{formatTime(res[0].submittedAt)} */}
                                            请在{" "}
                                            <span style={{ color: "#f00" }}>
                                                {remainingTime}
                                            </span>{" "}
                                            分钟内完成交易并输入交易哈希，否则系统将自动取消交易。
                                        </span>
                                    </li>
                                    {/* <li className="item-wrap">
										<span className="item-label">支付渠道</span>
										<span>{res[0].methodType}</span>
									</li> */}
                                    <li className="item-wrap">
                                        <span className="item-label">金额</span>
                                        <span>
                                            {res[0].cryptocurrencyDetail
                                                .exchangeAmount +
                                                " " +
                                                res[0].convertedCurrencyCode}
                                        </span>
                                    </li>
                                    <li className="item-wrap">
                                        <span className="item-label">
                                            参考汇率
                                        </span>
                                        <span>
                                            1 {res[0].convertedCurrencyCode} ={" "}
                                            {res[0].cryptoExchangeRate} 人民币
                                        </span>
                                        <p className="red">
                                            USDT-ERC20
                                            交易需加上手续费。例：火币交易手续费为
                                            3 USDT 加上充值数量 15.88
                                            USDT，交易总量为 18.88 USDT。
                                        </p>
                                    </li>
                                    <li className="item-wrap">
                                        <span className="item-label">
                                            二维码
                                        </span>
                                        <span />
                                    </li>
                                    <li className="center">
                                        <QRCode
                                            size={160}
                                            value={
                                                res[0].cryptocurrencyDetail
                                                    .deepLink
                                            }
                                        />
                                    </li>
                                    <li className="item-wrap">
                                        <span className="item-label">
                                            收款地址
                                        </span>
                                        <span
                                            style={{
                                                position: "relative",
                                                minWidth: "100%",
                                                textAlign: "left",
                                                padding: "8px 6px 6px 6px",
                                                backgroundColor: "#f5f5f5",
                                            }}
                                            className="modal-prompt-info clear-margin-bottom"
                                        >
                                            {
                                                res[0].cryptocurrencyDetail
                                                    .walletAddress
                                            }
                                            <CopyToClipboard
                                                text={
                                                    res[0].cryptocurrencyDetail
                                                        .walletAddress
                                                }
                                                onCopy={this.copySuccessCall}
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
                                    </li>
                                </ul>
                            ) : null}
                        </div>
                        {methodObj && res[0] && (
                            <Row gutter={20} className="INVOICE_AUT_Row">
                                <Col span={24}>
                                    <Item label="交易哈希">
                                        <Input
                                            className="tlc-input-disabled"
                                            size="large"
                                            disabled={false}
                                            placeholder={`请输入交易哈希`}
                                            maxLength={66}
                                            onChange={this.onchangeInput}
                                            value={iNVOICEAUTValue}
                                        />
                                    </Item>
                                    {!errorTip && iNVOICEAUTValue !== "" && (
                                        <span className="errorTip">
                                            {iNVOICEAUTValue.length < 65
                                                ? `请输入以0x开头的66位字符，不包含空格和特殊字符。`
                                                : `您输入的交易哈希无效，请重新输入`}
                                        </span>
                                    )}
                                    {/* <div className="modal-prompt-info">{`必须以“0x”开头，为一串66个字符由英文字母与数字组成。不允许使用空格和任何特殊字符。`}</div> */}
                                </Col>
                            </Row>
                        )}
                        <Row gutter={20} style={{ marginTop: "20px" }}>
                            <Col span={12}>
                                <Button
                                    size="large"
                                    block
                                    onClick={() => {
                                        this.setState({
                                            isCancelTheDealModal: true,
                                        });
                                    }}
                                >
                                    取消交易
                                </Button>
                            </Col>
                            <Col span={12}>
                                <Button
                                    className={`${
                                        errorTip ? "btnActive" : "btnNoActive"
                                    }`}
                                    size="large"
                                    htmlType="submit"
                                    block
                                    disabled={!errorTip}
                                >
                                    我已成功存款
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                )}
                <Modal
                    title={`温馨提醒`}
                    className="modal-pubilc CTC-INVOICE-AUT"
                    visible={showTimeOutModal}
                    closable={false}
                    centered={true}
                    width={350}
                    footer={null}
                    zIndex={1500}
                >
                    <Row gutter={24}>
                        <Col span={24}>
                            操作超时，系统将自动取消该笔交易。若您已经完成交易，请联系在线客服。
                        </Col>
                        <Col
                            span={12}
                            onClick={() => {
                                global.PopUpLiveChat(), this.props.setLbStep(1);
                            }}
                        >
                            在线客服
                        </Col>
                        <Col span={12} onClick={this.closeModal}>
                            返回充值首页
                        </Col>
                    </Row>
                </Modal>

                <Modal
                    title={`温馨提醒`}
                    className="modal-pubilc CTC-INVOICE-AUT"
                    visible={isCancelTheDealModal}
                    closable={false}
                    centered={true}
                    width={380}
                    footer={null}
                    zIndex={1500}
                >
                    <Row gutter={24}>
                        <Col span={24} style={{ textAlign: "center" }}>
                            您确定要取消这笔交易吗?
                        </Col>
                        <Col
                            span={12}
                            onClick={() => {
                                this.setState({ isCancelTheDealModal: false });
                            }}
                        >
                            不取消
                        </Col>
                        <Col span={12} onClick={this.cancelTheDeal}>
                            是的，我要取消
                        </Col>
                    </Row>
                </Modal>
            </React.Fragment>
        );
    }
}
export default Form.create({ name: "CtcSecondStep" })(SecondStep);
