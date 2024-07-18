import React from "react";
import QRCode from "qrcode-react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Button, Input, Form, message } from "antd";
import { CommonPostConfirmPay } from "$DATA/wallet";
import { Cookie, dateFormat } from "$ACTIONS/util";
import { formItemLayout, tailFormItemLayout } from "$ACTIONS/constantsData";

const { Item } = Form;
class SecondStep extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectUrl: "", // 充值详情跳转mobile地址
        };
    }
    componentDidMount() {
        // 传递此方法到父元素
        this.props.setGoThirdStep(this.goThirdStep);
    }
    componentDidUpdate(prevProps, prevState) {
        const { collectionInfo, hasTimeoutSeconds } = this.props;
        console.log(
            "🚀 ~ file: SecondStep.js:23 ~ SecondStep ~ componentDidUpdate ~ hasTimeoutSeconds",
            hasTimeoutSeconds,
        );
        if (prevProps.collectionInfo !== collectionInfo && collectionInfo) {
            // 二维码地址格式化
            const { vendorDepositBankDetails } = collectionInfo;

            const base64str = window.btoa(
                unescape(
                    encodeURIComponent(
                        `timeOutSec=${hasTimeoutSeconds}&` +
                            `submittedAt=${collectionInfo.submittedAt}&` +
                            `transferAmount=${encodeURIComponent(
                                vendorDepositBankDetails &&
                                    vendorDepositBankDetails.transferAmount
                                    ? vendorDepositBankDetails.transferAmount
                                    : "",
                            )}&` +
                            `bankName=${encodeURIComponent(
                                vendorDepositBankDetails &&
                                    vendorDepositBankDetails.bankName
                                    ? vendorDepositBankDetails.bankName
                                    : "",
                            )}&` +
                            `bankAccountName=${encodeURIComponent(
                                vendorDepositBankDetails &&
                                    vendorDepositBankDetails.bankAccountName
                                    ? vendorDepositBankDetails.bankAccountName
                                    : "",
                            )}&` +
                            `bankAccountNumber=${encodeURIComponent(
                                vendorDepositBankDetails &&
                                    vendorDepositBankDetails.bankAccountNumber
                                    ? vendorDepositBankDetails.bankAccountNumber
                                    : "",
                            )}&` +
                            `bankProvince=${encodeURIComponent(
                                vendorDepositBankDetails &&
                                    vendorDepositBankDetails.bankProvince
                                    ? vendorDepositBankDetails.bankProvince
                                    : "",
                            )}&` +
                            `bankCity=${encodeURIComponent(
                                vendorDepositBankDetails &&
                                    vendorDepositBankDetails.bankCity
                                    ? vendorDepositBankDetails.bankCity
                                    : "",
                            )}&` +
                            `bankBranch=${encodeURIComponent(
                                vendorDepositBankDetails &&
                                    vendorDepositBankDetails.bankBranch
                                    ? vendorDepositBankDetails.bankBranch
                                    : "",
                            )}&` +
                            `pgRemark=${encodeURIComponent(
                                vendorDepositBankDetails &&
                                    vendorDepositBankDetails.pgRemark
                                    ? vendorDepositBankDetails.pgRemark
                                    : "",
                            )}`,
                    ),
                ),
            );

            this.setState({
                redirectUrl: `${global.location.origin}/cn/mobile/depositInfo?data=${base64str}`,
            });
        }
    }

    goThirdStep = (e) => {
        e && e.preventDefault();

        if (this.props.collectionInfo === null) return false;

        Cookie("dateTime", dateFormat(), { expires: 10 });
        this.props.setLbStep(3);

        Pushgtagdata("Depositsuccess_P2Pbanking_deposit");
    };
    copySuccessCall() {
        message.success("复制成功！");
    }
    render() {
        const { collectionInfo } = this.props;

        return (
            <Form
                className="form-wrap"
                style={{ display: this.props.lbStep === 2 ? "block" : "none" }}
                {...formItemLayout}
                onSubmit={this.goThirdStep}
            >
                <div className="TextLightYellow">
                    请在 <span className="red">{this.props.remainingTime}</span>{" "}
                    分钟内完成支付和点击“我已成功存款”
                </div>

                <div className="tlc-deposit-receipt">
                    {collectionInfo !== null &&
                    collectionInfo.vendorDepositBankDetails ? (
                        <ul>
                            <li>
                                <h2>您的存款信息:</h2>
                            </li>

                            <li className="item-wrap">
                                <span className="item-label">存款金额</span>
                                <div>
                                    <span style={{ fontWeight: "bold" }}>
                                        ￥
                                        {
                                            collectionInfo
                                                .vendorDepositBankDetails
                                                .transferAmount
                                        }
                                    </span>{" "}
                                    <CopyToClipboard
                                        text={
                                            collectionInfo
                                                .vendorDepositBankDetails
                                                .transferAmount
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
                                </div>
                            </li>
                            <li className="red">
                                请按照上方显示的金额进行转账
                            </li>
                        </ul>
                    ) : null}
                </div>

                <div className="tlc-deposit-receipt">
                    {collectionInfo !== null &&
                    collectionInfo.vendorDepositBankDetails ? (
                        <ul>
                            <li>
                                <h2>我们的收款帐户:</h2>
                            </li>

                            <li className="item-wrap">
                                <span className="item-label">银行名称</span>
                                <span>
                                    {
                                        collectionInfo.vendorDepositBankDetails
                                            .bankName
                                    }{" "}
                                    <CopyToClipboard
                                        text={
                                            collectionInfo
                                                .vendorDepositBankDetails
                                                .bankName
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
                            <li className="item-wrap">
                                <span className="item-label">账号</span>
                                <span>
                                    {
                                        collectionInfo.vendorDepositBankDetails
                                            .bankAccountNumber
                                    }{" "}
                                    <CopyToClipboard
                                        text={
                                            collectionInfo
                                                .vendorDepositBankDetails
                                                .bankAccountNumber
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
                            <li className="item-wrap">
                                <span className="item-label">账户姓名</span>
                                <span>
                                    {
                                        collectionInfo.vendorDepositBankDetails
                                            .bankAccountName
                                    }{" "}
                                    <CopyToClipboard
                                        text={
                                            collectionInfo
                                                .vendorDepositBankDetails
                                                .bankAccountName
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

                            {collectionInfo.vendorDepositBankDetails
                                .bankProvince ||
                            collectionInfo.vendorDepositBankDetails.bankCity ||
                            collectionInfo.vendorDepositBankDetails
                                .bankBranch ? (
                                <li>
                                    {collectionInfo.vendorDepositBankDetails
                                        .bankProvince ? (
                                        <div className="item-wrap">
                                            <span className="item-label">
                                                省/自治区
                                            </span>
                                            <span>
                                                {
                                                    collectionInfo
                                                        .vendorDepositBankDetails
                                                        .bankProvince
                                                }
                                                <CopyToClipboard
                                                    text={
                                                        collectionInfo
                                                            .vendorDepositBankDetails
                                                            .bankProvince
                                                    }
                                                    onCopy={
                                                        this.copySuccessCall
                                                    }
                                                >
                                                    <img
                                                        style={{
                                                            marginLeft:
                                                                "0.4rem",
                                                            cursor: "pointer",
                                                        }}
                                                        src={`/cn/img/icons/Copys.svg`}
                                                    />
                                                </CopyToClipboard>
                                            </span>
                                        </div>
                                    ) : null}
                                    {collectionInfo.vendorDepositBankDetails
                                        .bankCity ? (
                                        <div className="item-wrap">
                                            <span className="item-label">
                                                城市/城镇
                                            </span>
                                            <span>
                                                {
                                                    collectionInfo
                                                        .vendorDepositBankDetails
                                                        .bankCity
                                                }
                                                <CopyToClipboard
                                                    text={
                                                        collectionInfo
                                                            .vendorDepositBankDetails
                                                            .bankCity
                                                    }
                                                    onCopy={
                                                        this.copySuccessCall
                                                    }
                                                >
                                                    <img
                                                        style={{
                                                            marginLeft:
                                                                "0.4rem",
                                                            cursor: "pointer",
                                                        }}
                                                        src={`/cn/img/icons/Copys.svg`}
                                                    />
                                                </CopyToClipboard>
                                            </span>
                                        </div>
                                    ) : null}
                                    {collectionInfo.vendorDepositBankDetails
                                        .bankBranch ? (
                                        <div className="item-wrap">
                                            <span className="item-label">
                                                分行
                                            </span>
                                            <span>
                                                {
                                                    collectionInfo
                                                        .vendorDepositBankDetails
                                                        .bankBranch
                                                }
                                                <CopyToClipboard
                                                    text={
                                                        collectionInfo
                                                            .vendorDepositBankDetails
                                                            .bankBranch
                                                    }
                                                    onCopy={
                                                        this.copySuccessCall
                                                    }
                                                >
                                                    <img
                                                        style={{
                                                            marginLeft:
                                                                "0.4rem",
                                                            cursor: "pointer",
                                                        }}
                                                        src={`/cn/img/icons/Copys.svg`}
                                                    />
                                                </CopyToClipboard>
                                            </span>
                                        </div>
                                    ) : null}
                                </li>
                            ) : null}
                            {collectionInfo.vendorDepositBankDetails
                                .pgRemark ? (
                                <li className="item-wrap">
                                    <span className="item-label">
                                        附言/备注
                                    </span>
                                    <span>
                                        {
                                            collectionInfo
                                                .vendorDepositBankDetails
                                                .pgRemark
                                        }{" "}
                                        <CopyToClipboard
                                            text={
                                                collectionInfo
                                                    .vendorDepositBankDetails
                                                    .pgRemark
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
                                    <p className="red">
                                        转账前请仔细核对以上所有信息，如有要求填写【附言】或【备註】，请务必填写，否则存款将无法到账。
                                    </p>
                                </li>
                            ) : null}
                        </ul>
                    ) : null}
                </div>

                <div className="tlc-deposit-receipt">
                    {collectionInfo !== null &&
                    collectionInfo.vendorDepositBankDetails ? (
                        <ul>
                            <li>
                                {/* <span className="item-label">二维码</span> */}
                                <center>
                                    <p style={{ color: "#999999" }}>
                                        您可以扫码查询银行账号和进行支付
                                    </p>
                                </center>
                                <div className="center">
                                    <QRCode
                                        size={200}
                                        value={this.state.redirectUrl}
                                    />
                                </div>
                            </li>
                        </ul>
                    ) : null}
                </div>

                <Item {...tailFormItemLayout}>
                    <div className="btn-wrap">
                        <Button
                            size="large"
                            type="primary"
                            htmlType="submit"
                            block
                        >
                            我已经成功存款
                        </Button>
                    </div>
                </Item>
            </Form>
        );
    }
}
export default Form.create({ name: "ALBSecondStep" })(SecondStep);
