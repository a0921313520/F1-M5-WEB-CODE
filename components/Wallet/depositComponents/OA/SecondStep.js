import React from "react";
import QRCode from "qrcode-react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Button, Input, Form, message } from "antd";
import { formItemLayout, tailFormItemLayout } from "$ACTIONS/constantsData";

const { Item } = Form;
class SecondStep extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {}
    componentDidUpdate(prevProps, prevState) {}

    goThirdStep = (e) => {
        e && e.preventDefault();

        this.props.setLbStep(3);
        this.props.form.resetFields();
    };
    copySuccessCall() {
        message.success("复制成功！");
    }
    render() {
        const { oaResultData } = this.props;

        return (
            <Form
                className="form-wrap"
                style={{ display: this.props.lbStep === 2 ? "block" : "none" }}
                {...formItemLayout}
                onSubmit={this.goThirdStep}
            >
                <Item label="充值方式">
                    <Input
                        className="tlc-input-disabled"
                        size="large"
                        disabled={true}
                        value="ZFB 转快速支付宝"
                    />
                </Item>
                <div className="tlc-deposit-receipt">
                    {oaResultData.qrDeepLink ? (
                        <ul>
                            <li>
                                <h2>您的存款信息</h2>
                            </li>
                            <li className="item-wrap">
                                <span className="item-label">存款金额</span>
                                <span>￥{oaResultData.uniqueAmount}</span>
                            </li>
                            <li className="item-wrap">
                                <span className="item-label">二维码</span>
                                <span></span>
                            </li>
                            <li className="center">
                                <QRCode
                                    size={160}
                                    value={oaResultData.qrDeepLink}
                                />
                            </li>
                            <li className="item-wrap">
                                <span className="item-label">备注</span>
                                <span></span>
                            </li>
                            <li className="item-wrap">
                                <span
                                    style={{
                                        position: "relative",
                                        minWidth: "100%",
                                        textAlign: "left",
                                        padding: "8px 10px 6px 10px",
                                        backgroundColor: "#f5f5f5",
                                    }}
                                    className="modal-prompt-info clear-margin-bottom"
                                >
                                    {oaResultData.transactionId.substr(-6)}
                                    <CopyToClipboard
                                        text={oaResultData.transactionId.substr(
                                            -6
                                        )}
                                        onCopy={this.copySuccessCall}
                                    >
                                        <Button
                                            type="link"
                                            className="tlc-inline-btn"
                                        >
                                            复制
                                        </Button>
                                    </CopyToClipboard>
                                </span>
                                <p
                                    className="theme-color"
                                    style={{
                                        fontSize: 12,
                                        padding: "6px 6px 0",
                                    }}
                                >
                                    请务必于支付宝App交易页面填写备注代码​
                                </p>
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
                            我已成功充值
                        </Button>
                    </div>
                </Item>
            </Form>
        );
    }
}
export default Form.create({ name: "OASecondStep" })(SecondStep);
