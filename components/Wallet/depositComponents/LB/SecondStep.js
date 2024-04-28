import React from "react";
import { Button, Input, Form } from "antd";
import { CommonPostConfirmPay } from "$DATA/wallet";
import { dateFormat } from "$ACTIONS/util";
import { Cookie } from "$ACTIONS/helper";
import { formItemLayout, tailFormItemLayout } from "$ACTIONS/constantsData";
import { CopyToClipboard } from "react-copy-to-clipboard";
import UploadFile from "@/UploadFile";
import OtherAccount from "./../OtherAccount";

const { Item } = Form;
class SecondStep extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOtherAccount: false, // 是否存入其它账号
            uploadFileName: "",
        };
    }
    componentDidMount() {}
    componentDidUpdate(prevProps, prevState) {}
    goThirdStep = (e) => {
        e.preventDefault();
        const sucessRun = (status) => {
            if (status) {
                // Cookie("isThird", "true", { expires: 30 });
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
                });
            }
        });

        Pushgtagdata("Depositsuccess_Localbank_deposit");
    };
    copyEvent() {
        global.showColorResultModal("已复制", true);
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { currBankAccount } = this.props;
        const { isOtherAccount } = this.state;

        return (
            <Form
                className="form-wrap"
                style={{ display: 'block' }}
                {...formItemLayout}
                onSubmit={this.goThirdStep}
            >
                {/* <Item label="充值方式">
                <Input className="tlc-input-disabled" size="large" disabled={true} value="本地银行" />
                </Item> */}
                {/* <div className="modal-prompt-info">请在未确认提交前，先登录您的银行账户自行转账并确认提交资料正确。</div> */}
                <div className="TextLightYellow">
                    交易生成时间 {Cookie.Get("dateTime") || dateFormat()}{" "}
                    请在30:00分钟内完成支付，或者系统自动延迟交易
                </div>
                <br />
                <div className="tlc-deposit-receipt">
                    <ul>
                        <li>
                            <h2>您的存款信息:</h2>
                        </li>
                        <li className="item-wrap">
                            <span className="item-label">存款金额</span>
                            <span>
                                ￥{this.props.depositMoney}
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
                        <li className="item-wrap">
                            <span className="item-label">存款人姓名</span>
                            <span>{this.props.localMemberName}</span>
                        </li>
                        <li className="item-wrap">
                            <span className="item-label">支付类型</span>
                            <span>银行卡</span>
                        </li>

                        {/* 						
						<li className="item-wrap">
							<span className="item-label">目标账户</span>
							<span>{this.props.targetName}</span>
						</li> */}
                        {this.props.bonusName ? (
                            <li className="item-wrap">
                                <span className="item-label">
                                    所参与红利优惠
                                </span>
                                <span>{this.props.bonusName}</span>
                            </li>
                        ) : null}
                    </ul>
                </div>
                <div className="tlc-deposit-receipt">
                    <ul>
                        <li>
                            <h2>我们的收款账户:</h2>
                        </li>
                        {/*<li>
							<h2 className="theme-color">交易生成时间 {Cookie('dateTime') || dateFormat()}</h2>
							<h2>请在30分钟内完成支付，或者系统自动延迟交易。</h2>
						</li> */}
                        <li className="item-wrap">
                            <span className="item-label">银行名称</span>
                            <span>
                                {currBankAccount && currBankAccount.bankName}{" "}
                                <CopyToClipboard
                                    text={
                                        currBankAccount &&
                                        currBankAccount.bankName
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
                            <span className="item-label">账户</span>
                            <span>
                                {currBankAccount &&
                                    currBankAccount.accountNumber}
                                <CopyToClipboard
                                    text={
                                        currBankAccount &&
                                        currBankAccount.accountNumber
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
                                    currBankAccount.accountHolderName}
                                <CopyToClipboard
                                    text={
                                        currBankAccount &&
                                        currBankAccount.accountHolderName
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
                                        currBankAccount.province}
                                    <CopyToClipboard
                                        text={
                                            currBankAccount &&
                                            currBankAccount.province
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
                                    {currBankAccount && currBankAccount.city}
                                    <CopyToClipboard
                                        text={
                                            currBankAccount &&
                                            currBankAccount.city
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
                                    {currBankAccount && currBankAccount.branch}
                                    <CopyToClipboard
                                        text={
                                            currBankAccount &&
                                            currBankAccount.branch
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
                            Pushgtagdata("Otheracc_Localbank_deposit");
                        }}
                    />
                </div>
                <div className="tlc-deposit-receipt">
                    <ul>
                        <li className="item-wrap upload-wrapper">
                            <h2>
                                上传存款凭证{" "}
                                <span className="BtnBg">推荐使用</span>
                            </h2>
                            <br />
                            {/* <span className="item-label">乐天使温馨提醒： 直接上传充值收据以便加快充值审核哦！</span> */}
                            {!!this.state.uploadFileName ? (
                                <Button block>
                                    {this.state.uploadFileName}
                                </Button>
                            ) : (
                                <UploadFile
                                    paymentType="LB"
                                    transactionId={this.props.transactionId}
                                    uploadFileName={this.state.uploadFileName}
                                    setFileName={(v) => {
                                        this.setState({ uploadFileName: v });
                                    }}
                                    children={
                                        <Button
                                            block
                                            className="link plus-upload"
                                        >
                                            <img src="/cn/img/icons/plus-upload.svg" />
                                            上传存款凭证以利款项快速到帐
                                        </Button>
                                    }
                                />
                            )}
                            <span className="item-label">
                                若您无法上传凭证， 请联系
                                <Button
                                    className="inline"
                                    type="link"
                                    onClick={global.PopUpLiveChat}
                                >
                                    在线客服
                                </Button>
                                。
                            </span>
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
            </Form>
        );
    }
}
export default Form.create({ name: "LBSecondStep" })(SecondStep);
