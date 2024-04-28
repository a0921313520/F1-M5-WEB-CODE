import React from "react";
import QRCode from "qrcode-react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Button, Input, Form, message } from "antd";
import { CommonPostConfirmPay } from "$DATA/wallet";
import { dateFormat } from "$ACTIONS/util";
import { Cookie } from "$ACTIONS/helper";
import { formItemLayout, tailFormItemLayout } from "$ACTIONS/constantsData";
import OtherAccount from "./../OtherAccount";

const { Item } = Form;
class SecondStep extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOtherAccount: false, // 是否存入其它账号
            isTip: true, // 提示
            isStatus: true, // 提交前狀態
        };
    }
    componentDidMount() {
        // 传递此方法到父元素
        this.props.setGoThirdStep(this.goThirdStep);
    }
    componentDidUpdate(prevProps, prevState) {}

    goThirdStep = (e) => {
        e && e.preventDefault();

        if (this.props.collectionInfo === null) return false;

        const sucessRun = (status) => {
            if (status) {
                Cookie.Create("isAlbSecond", null);
                Cookie.Create("isAlbThird", "true", { expires: 15 });
                Cookie.Create("dateTime", dateFormat(), { expires: 30 });
                this.props.setLbStep(3);
                this.props.form.resetFields();
            }

            this.props.setLoading(false);
        };

        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.setLoading(true);
                let postOtherInfo = {
                    transactionId: this.props.collectionInfo.transactionId,
                };
                this.state.isOtherAccount &&
                    values.lastSixNum &&
                    (postOtherInfo.depositingBankAcctNum = values.lastSixNum);
                CommonPostConfirmPay(postOtherInfo, (res) => {
                    sucessRun(res.isSuccess);
                    this.setState({ isTip: true, isStatus: true });
                    Cookie.Create("dateTime", null);
                    Cookie.Create("isAlbThird", null);
                });
            }
        });

        Pushgtagdata("Depositsuccess_Localalipay_deposit");
    };
    copySuccessCall() {
        message.success("复制成功！");
    }
    copyEvent() {
        global.showColorResultModal("已复制", true);
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { collectionInfo, showType } = this.props;
        console.log("----------------------->", collectionInfo);

        return (
            <Form
                className="form-wrap"
                style={{ display: this.props.lbStep === 2 ? "block" : "none" }}
                {...formItemLayout}
                onSubmit={this.goThirdStep}
            >
                {collectionInfo !== "null" &&
                    collectionInfo !== null &&
                    showType === "1" && (
                        <div className="tlc-deposit-receipt">
                            {" "}
                            {collectionInfo !== "null" &&
                            collectionInfo !== null &&
                            showType === "1" ? (
                                <ul>
                                    <li>
                                        <h2>
                                            二维码有效期{" "}
                                            <span className="theme-color">
                                                {this.props.remainingTime}
                                            </span>
                                            ，请在有效期内完成支付。
                                        </h2>
                                    </li>
                                    <li className="item-wrap">
                                        <span className="item-label">
                                            存款金额
                                        </span>
                                        <span>
                                            ￥{collectionInfo.uniqueAmount}
                                            <CopyToClipboard
                                                text={
                                                    collectionInfo.uniqueAmount
                                                }
                                                onCopy={this.copyEvent}
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
                                    {collectionInfo.redirectUrl ? (
                                        <li className="center">
                                            <QRCode
                                                size={200}
                                                value={
                                                    collectionInfo.redirectUrl
                                                }
                                            />
                                        </li>
                                    ) : null}
                                </ul>
                            ) : null}
                        </div>
                    )}

                {collectionInfo !== "null" &&
                    collectionInfo !== null &&
                    showType === "2" && (
                        <div>
                            <div className="TextLightYellow">
                                请在 {this.props.remainingTime}{" "}
                                分钟内完成支付，或者系统自动延迟交易
                            </div>
                            <br />
                            <div>
                                {collectionInfo !== "null" &&
                                collectionInfo !== null &&
                                showType === "2" ? (
                                    <div>
                                        <div className="tlc-deposit-receipt">
                                            <ul>
                                                {/* <li>
										<h2>
											请在 <span className="theme-color">{this.props.remainingTime}</span>{' '}
											内完成支付，以免存款延迟到账。
										</h2>
									</li> */}
                                                <li>
                                                    <h2>您的存款信息:</h2>
                                                </li>
                                                <li className="item-wrap">
                                                    <span className="item-label">
                                                        存款金额
                                                    </span>
                                                    <div>
                                                        ￥
                                                        {
                                                            collectionInfo.uniqueAmount
                                                        }
                                                        <CopyToClipboard
                                                            text={
                                                                collectionInfo.uniqueAmount
                                                            }
                                                            onCopy={
                                                                this.copyEvent
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
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="tlc-deposit-receipt">
                                            <ul>
                                                <li>
                                                    <h2>我们的收款账户:</h2>
                                                </li>
                                                <li className="item-wrap">
                                                    <span className="item-label">
                                                        银行名称
                                                    </span>
                                                    <span>
                                                        {
                                                            collectionInfo
                                                                .returnedBankDetails
                                                                .bankName
                                                        }
                                                        <CopyToClipboard
                                                            text={
                                                                collectionInfo
                                                                    .returnedBankDetails
                                                                    .bankName
                                                            }
                                                            onCopy={
                                                                this
                                                                    .copySuccessCall
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
                                                </li>
                                                <li className="item-wrap">
                                                    <span className="item-label">
                                                        账号
                                                    </span>
                                                    <span>
                                                        {
                                                            collectionInfo
                                                                .returnedBankDetails
                                                                .accountNumber
                                                        }
                                                        <CopyToClipboard
                                                            text={
                                                                collectionInfo
                                                                    .returnedBankDetails
                                                                    .accountNumber
                                                            }
                                                            onCopy={
                                                                this
                                                                    .copySuccessCall
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
                                                </li>
                                                <li className="item-wrap">
                                                    <span className="item-label">
                                                        账户姓名
                                                    </span>
                                                    <span>
                                                        {
                                                            collectionInfo
                                                                .returnedBankDetails
                                                                .accountHolderName
                                                        }
                                                        <CopyToClipboard
                                                            text={
                                                                collectionInfo
                                                                    .returnedBankDetails
                                                                    .accountHolderName
                                                            }
                                                            onCopy={
                                                                this
                                                                    .copySuccessCall
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
                                                </li>

                                                <li>
                                                    <div className="item-wrap">
                                                        <span className="item-label">
                                                            省/自治区
                                                        </span>
                                                        <span>
                                                            {
                                                                collectionInfo
                                                                    .returnedBankDetails
                                                                    .province
                                                            }{" "}
                                                            <CopyToClipboard
                                                                text={
                                                                    collectionInfo
                                                                        .returnedBankDetails
                                                                        .province
                                                                }
                                                                onCopy={
                                                                    this
                                                                        .copySuccessCall
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
                                                    <div className="item-wrap">
                                                        <span className="item-label">
                                                            城市/城镇
                                                        </span>
                                                        <span>
                                                            {
                                                                collectionInfo
                                                                    .returnedBankDetails
                                                                    .city
                                                            }{" "}
                                                            <CopyToClipboard
                                                                text={
                                                                    collectionInfo
                                                                        .returnedBankDetails
                                                                        .city
                                                                }
                                                                onCopy={
                                                                    this
                                                                        .copySuccessCall
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
                                                    <div className="item-wrap">
                                                        <span className="item-label">
                                                            分行
                                                        </span>
                                                        <span>
                                                            {
                                                                collectionInfo
                                                                    .returnedBankDetails
                                                                    .branch
                                                            }{" "}
                                                            <CopyToClipboard
                                                                text={
                                                                    collectionInfo
                                                                        .returnedBankDetails
                                                                        .branch
                                                                }
                                                                onCopy={
                                                                    this
                                                                        .copySuccessCall
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
                                                </li>
                                                <li>
                                                    <OtherAccount
                                                        getFieldDecorator={
                                                            getFieldDecorator
                                                        }
                                                        isOtherAccount={
                                                            this.state
                                                                .isOtherAccount
                                                        }
                                                        setOtherAccountStatus={() => {
                                                            this.setState({
                                                                isOtherAccount:
                                                                    !this.state
                                                                        .isOtherAccount,
                                                            });
                                                            Pushgtagdata(
                                                                "Otheracc_Localalipay_deposit"
                                                            );
                                                        }}
                                                    />
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                ) : null}
                                {/* <div className="tipBox" style={{ top: 82 }}>
								{this.state.isTip && (
									<div className="tipContent">
										<i
											className="tipArrow"
											style={{ right: `${showType === '1' ? '10%' : '17%'}` }}
										/>
										<p>支付宝转账时，必须转入系统生成的金额方能极速到账，请务必按显示金额充值，否则将延迟该笔充值到账。</p>
										<div
											className="closeTip"
											onClick={() => this.setState({ isTip: false, isStatus: false })}
										>
											知道了
										</div>
									</div>
								)}
							</div> */}
                            </div>
                        </div>
                    )}

                <Item {...tailFormItemLayout}>
                    <div className="btn-wrap">
                        <Button
                            size="large"
                            type="primary"
                            htmlType="submit"
                            block
                            disabled={false}
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
