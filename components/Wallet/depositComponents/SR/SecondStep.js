import React from "react";
import { Button, Input, Form, message } from "antd";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { CommonPostConfirmPay } from "$DATA/wallet";
import { Cookie, dateFormat } from "$ACTIONS/util";
import { formItemLayout, tailFormItemLayout } from "$ACTIONS/constantsData";
// import OtherAccount from '../OtherAccount';

const { Item } = Form;
class SecondStep extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOtherAccount: false, // 是否存入其它账号
        };
    }
    componentDidMount() {
        // 传递此方法到父元素
        this.props.setGoThirdStep(this.goThirdStep);
    }
    componentDidUpdate(prevProps, prevState) {}
    copySuccessCall() {
        message.success("复制成功！");
    }
    goThirdStep = (e) => {
        e && e.preventDefault();
        const sucessRun = (status) => {
            if (status) {
                Cookie("dateTime", dateFormat(), { expires: 30 });
                this.props.form.resetFields();
                this.props.setLbStep(3);
            }

            this.props.setLoading(false);
        };

        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.setLoading(true);
                let postOtherInfo = { transactionId: this.props.transactionId };
                // this.state.isOtherAccount && values.lastSixNum && (postOtherInfo.depositingBankAcctNum = values.lastSixNum);
                CommonPostConfirmPay(postOtherInfo, (res) => {
                    sucessRun(res.isSuccess);
                });
            }
        });

        Pushgtagdata("Depositsuccess_Localbank_deposit");
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        const { currBankAccount } = this.props;
        // const { isOtherAccount } = this.state;

        return (
            <Form
                className="form-wrap"
                style={{ display: this.props.lbStep === 2 ? "block" : "none" }}
                {...formItemLayout}
                onSubmit={this.goThirdStep}
            >
                {/* <Item label="充值方式">
                    <Input
                        className="tlc-input-disabled"
                        size="large"
                        disabled={true}
                        value="小额充值"
                    />
                </Item> */}
                <div
                    className="modal-prompt-info"
                    style={{ margin: "0px 0px 1rem 0" }}
                >
                    <div>交易生成时间 {Cookie("dateTime") || dateFormat()}</div>
                    <div>
                        请在{" "}
                        <span
                            style={{
                                color: "#EB2121",
                                fontSize: "16px",
                                fontWeight: "bold",
                            }}
                        >
                            {this.props.remainingTime}
                        </span>{" "}
                        倒数时间内完成支付，或系统自动延迟交易。
                    </div>
                </div>
                <div className="tlc-deposit-receipt">
                    <ul>
                        <li>
                            <span className="item-label">您的存款信息:</span>
                        </li>
                        <li className="item-wrap">
                            <span className="item-label">存款金额</span>
                            <span>
                                {this.props.depositMoney}{" "}
                                <CopyToClipboard
                                    text={this.props.depositMoney}
                                    onCopy={this.copySuccessCall}
                                >
                                    <Button type="link">
                                        <img src={`/cn/img/icons/Copys.svg`} />
                                    </Button>
                                </CopyToClipboard>
                            </span>
                        </li>
                    </ul>
                    {/* <OtherAccount
            getFieldDecorator={getFieldDecorator}
            isOtherAccount={isOtherAccount}
            setOtherAccountStatus={() => {
              this.setState({ isOtherAccount: !isOtherAccount });
              Pushgtagdata("Otheracc_Localbank_deposit");
            }}
          /> */}
                </div>
                <div className="tlc-deposit-receipt">
                    <ul>
                        <li>
                            <span
                                className="item-label"
                                style={{ fontWeight: "bold" }}
                            >
                                我们的收款账户：
                            </span>
                        </li>
                        <li className="item-wrap">
                            <span className="item-label">银行名称</span>
                            <span>
                                {currBankAccount && currBankAccount.bankName}{" "}
                                <CopyToClipboard
                                    text={
                                        currBankAccount &&
                                        currBankAccount.bankName
                                    }
                                    onCopy={this.copySuccessCall}
                                >
                                    <Button type="link">
                                        <img src={`/cn/img/icons/Copys.svg`} />
                                    </Button>
                                </CopyToClipboard>
                            </span>
                        </li>
                        <li className="item-wrap">
                            <span className="item-label">账号</span>
                            <span>
                                {currBankAccount &&
                                    currBankAccount.accountNumber}{" "}
                                <CopyToClipboard
                                    text={
                                        currBankAccount &&
                                        currBankAccount.accountNumber
                                    }
                                    onCopy={this.copySuccessCall}
                                >
                                    <Button type="link">
                                        <img src={`/cn/img/icons/Copys.svg`} />
                                    </Button>
                                </CopyToClipboard>
                            </span>
                        </li>
                        <li className="item-wrap">
                            <span className="item-label">账户姓名</span>
                            <span>
                                {currBankAccount &&
                                    currBankAccount.accountHolderName}{" "}
                                <CopyToClipboard
                                    text={
                                        currBankAccount &&
                                        currBankAccount.accountHolderName
                                    }
                                    onCopy={this.copySuccessCall}
                                >
                                    <Button type="link">
                                        <img src={`/cn/img/icons/Copys.svg`} />
                                    </Button>
                                </CopyToClipboard>
                            </span>
                        </li>
                        {currBankAccount &&
                            (currBankAccount.province ||
                                currBankAccount.city ||
                                currBankAccount.branch) && (
                                <li>
                                    {currBankAccount &&
                                        currBankAccount.province && (
                                            <div className="item-wrap">
                                                <span className="item-label">
                                                    省/自治区
                                                </span>
                                                <span>
                                                    {currBankAccount.province}
                                                    <CopyToClipboard
                                                        text={
                                                            currBankAccount.province
                                                        }
                                                        onCopy={
                                                            this.copySuccessCall
                                                        }
                                                    >
                                                        <Button type="link">
                                                            <img
                                                                src={`/cn/img/icons/Copys.svg`}
                                                            />
                                                        </Button>
                                                    </CopyToClipboard>
                                                </span>
                                            </div>
                                        )}
                                    {currBankAccount &&
                                        currBankAccount.city && (
                                            <div className="item-wrap">
                                                <span className="item-label">
                                                    城市/城镇
                                                </span>
                                                <span>
                                                    {currBankAccount.city}
                                                    <CopyToClipboard
                                                        text={
                                                            currBankAccount.city
                                                        }
                                                        onCopy={
                                                            this.copySuccessCall
                                                        }
                                                    >
                                                        <Button type="link">
                                                            <img
                                                                src={`/cn/img/icons/Copys.svg`}
                                                            />
                                                        </Button>
                                                    </CopyToClipboard>
                                                </span>
                                            </div>
                                        )}
                                    {currBankAccount &&
                                        currBankAccount.branch && (
                                            <div className="item-wrap">
                                                <span className="item-label">
                                                    分行
                                                </span>
                                                <span>
                                                    {currBankAccount.branch}
                                                    <CopyToClipboard
                                                        text={
                                                            currBankAccount.branch
                                                        }
                                                        onCopy={
                                                            this.copySuccessCall
                                                        }
                                                    >
                                                        <Button type="link">
                                                            <img
                                                                src={`/cn/img/icons/Copys.svg`}
                                                            />
                                                        </Button>
                                                    </CopyToClipboard>
                                                </span>
                                            </div>
                                        )}
                                </li>
                            )}
                        <li className="item-wrap">
                            <Button
                                style={{
                                    color: "#1C8EFF",
                                    textAlign: "center",
                                    width: "100%",
                                }}
                                className="inline"
                                type="link"
                                onClick={global.PopUpLiveChat}
                            >
                                糟了! 我存到旧账号了
                            </Button>
                        </li>
                    </ul>
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
                <div className="deposit-help-wrap">
                    <span>乐天使温馨提醒：</span>
                    <ul>
                        <li>
                            只允许本地银行进行交易，请按照银行账户信息进行存款，请必须以选定的金额存款，否则将无法到账。{" "}
                        </li>
                        <li>
                            必须在30分钟内转账，若30分钟内未完成，交易将​被拒绝，若在30分钟后交易，金额将不予退还。{" "}
                        </li>
                        <li>
                            每次存款之前需先检查看最新的存款账号信息，避免存款过程中出现错误导致您的权益受损。{" "}
                        </li>
                        <li>小额存款不支持一卡通或超级网银交易。</li>
                    </ul>
                </div>
            </Form>
        );
    }
}
export default Form.create({ name: "SRSecondStep" })(SecondStep);
