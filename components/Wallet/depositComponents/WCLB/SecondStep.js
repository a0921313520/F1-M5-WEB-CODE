import React from "react";
import { Button, Input, Form } from "antd";
import { CommonPostConfirmPay } from "$DATA/wallet";
import { dateFormat } from "$ACTIONS/util";
import { Cookie } from "$ACTIONS/helper";
import { formItemLayout, tailFormItemLayout } from "$ACTIONS/constantsData";
import OtherAccount from "./../OtherAccount";
import { CopyToClipboard } from "react-copy-to-clipboard";
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
    componentDidMount() {}

    copyEvent() {
        global.showColorResultModal("已复制", true);
    }
    goThirdStep = (e) => {
        e.preventDefault();
        const sucessRun = (status) => {
            if (status) {
                Cookie.Create("isWCThird", "true", { expires: 15 });
                this.props.form.resetFields();
                this.props.setLbStep(3);
            }

            this.props.setLoading(false);
        };

        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.setLoading(true);
                let postOtherInfo = { transactionId: this.props.transactionId };
                this.state.isOtherAccount &&
                    values.lastSixNum &&
                    (postOtherInfo.depositingBankAcctNum = values.lastSixNum);
                CommonPostConfirmPay(postOtherInfo, (res) => {
                    sucessRun(res.isSuccess);
                    this.setState({ isTip: true, isStatus: true });
                });
            }
        });

        Pushgtagdata("Depositsuccess_Localwechatpay_deposit");
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { currBankAccount } = this.props;
        const { isOtherAccount } = this.state;

        return (
            <Form
                className="form-wrap"
                style={{ display: this.props.lbStep === 2 ? "block" : "none" }}
                {...formItemLayout}
                onSubmit={this.goThirdStep}
            >
                {/* <Item label="充值方式">
          <Input className="tlc-input-disabled" size="large" disabled={true} value="微转账" />
        </Item> */}

                <div className="modal-prompt-info">
                    请在30分钟内完成支付，或者系统自动延迟交易。
                </div>
                <div className="tlc-deposit-receipt">
                    <ul>
                        <li>
                            <h2>您的存款信息:</h2>
                        </li>
                        {/* <li className="item-wrap">
							<span className="item-label">支付类型</span>
							<span>微转账</span>
						</li> */}
                        <li className="item-wrap">
                            <span className="item-label">存款金额</span>
                            <span>
                                ￥{this.props.depositMoney}{" "}
                                <CopyToClipboard
                                    text={this.props.depositMoney}
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
                        {/* <li className="item-wrap">
							<span className="item-label">目标账户</span>
							<span>{this.props.targetName}</span>
						</li> */}
                        {/* {this.props.bonusName ? (
							<li className="item-wrap">
								<span className="item-label">所参与红利优惠</span>
								<span>{this.props.bonusName}</span>
							</li>
						) : null} */}
                    </ul>
                    {/* <div className="tipBox">
						{this.state.isTip && (
							<div className="tipContent">
								<i className="tipArrow" />
								<p>微转账时，必须转入系统生成的金额方能极速到账，请务必按显示金额充值，否则将延迟该笔充值到账。</p>
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
                <div className="tlc-deposit-receipt">
                    <ul>
                        <li>
                            <h2>我们的收款账户：</h2>
                        </li>

                        <li className="item-wrap">
                            <span className="item-label">银行名称</span>
                            <span>
                                {currBankAccount && currBankAccount.BankName}
                                <CopyToClipboard
                                    text={
                                        currBankAccount &&
                                        currBankAccount.BankName
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
                        <li className="item-wrap">
                            <span className="item-label">账号</span>
                            <span>
                                {currBankAccount && currBankAccount.AccountNo}
                                <CopyToClipboard
                                    text={
                                        currBankAccount &&
                                        currBankAccount.AccountNo
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
                        <li className="item-wrap">
                            <span className="item-label">账户姓名</span>
                            <span>
                                {currBankAccount &&
                                    currBankAccount.AccountHolderName}
                                <CopyToClipboard
                                    text={
                                        currBankAccount &&
                                        currBankAccount.AccountHolderName
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

                        <li>
                            <div className="item-wrap">
                                <span className="item-label">省/自治区</span>
                                <span>
                                    {currBankAccount &&
                                        currBankAccount.Province}
                                    <CopyToClipboard
                                        text={
                                            currBankAccount &&
                                            currBankAccount.Branch
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
                            </div>
                            <div className="item-wrap">
                                <span className="item-label">城市/城镇</span>
                                <span>
                                    {currBankAccount && currBankAccount.City}
                                    <CopyToClipboard
                                        text={
                                            currBankAccount &&
                                            currBankAccount.Province
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
                            </div>
                            <div className="item-wrap">
                                <span className="item-label">分行</span>
                                <span>
                                    {currBankAccount && currBankAccount.Branch}
                                    <CopyToClipboard
                                        text={
                                            currBankAccount &&
                                            currBankAccount.Branch
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
                            </div>
                        </li>
                    </ul>
                    <OtherAccount
                        getFieldDecorator={getFieldDecorator}
                        isOtherAccount={isOtherAccount}
                        setOtherAccountStatus={() => {
                            this.setState({ isOtherAccount: !isOtherAccount });
                            Pushgtagdata("Otheracc_Localwechatpay_deposit");
                        }}
                    />
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
export default Form.create({ name: "WCLBSecondStep" })(SecondStep);
