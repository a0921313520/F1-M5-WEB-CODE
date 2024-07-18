import React from "react";
import { Row, Col, Modal, Button } from "antd";
import { formatSeconds } from "$ACTIONS/util";
import { showResultModal } from "$ACTIONS/helper";
/**
 * 完善开户名、身份证、银行账户、卡号所需的验证OTP弹窗
 * @method VerifyCode
 * @param {string} phoneNumber   所需验证手机号码
 * @param {boolean} visible   控制是否弹出当前 OTP 窗口
 * @param {int|""} remainingTime   重新发送验证码的倒计时
 * @param {int} submitOTPAttempts  剩余可尝试验证的次数
 * @param {function} onCancel  关闭 OTP 弹窗
 * @param {function} sendVerifyCode  重新发送验证码事件
 * @param {function} submitOTPCode  提交验证验证码
 * @param {function} bankAccountVerifySuccess  银行卡信息 OTP 验证成功则继续执行完善个人信息流程
 */
class VerifyCode extends React.Component {
    static defaultProps = {
        phoneNumber: "",
        visible: false,
        remainingTime: "",
        submitOTPAttempts: 0,
        onCancel: () => {},
        sendVerifyCode: () => {},
        submitOTPCode: () => {},
    };
    constructor(props) {
        super(props);
        this.state = {
            captchaNum: "",
            isEnableBtn: true,
        };

        this.inputFocus0 = React.createRef();
        this.inputFocus1 = React.createRef();
        this.inputFocus2 = React.createRef();
        this.inputFocus3 = React.createRef();
        this.inputFocus4 = React.createRef();
        this.inputFocus5 = React.createRef();
        this.localCaptcha = new Array(6).fill("");
    }
    componentDidMount() {}
    componentDidUpdate(prevProps, prevState) {
        // 默认发送验证码
        if (prevProps.visible !== this.props.visible && this.props.visible) {
            this.sendOTPCode();
        }
    }
    submitOTPCodeOwn = () => {
        const { captchaNum } = this.state;
        if (captchaNum.length === 6) {
            this.addLoding("验证中，请稍后…");
            this.props.submitOTPCode(
                {
                    verifyCode: captchaNum,
                    type: "BankCardValidation",
                },
                (res) => {
                    // showResultModal(res.result.message || "验证成功", true);
                    this.clearCaptcha();
                    this.props.onCancel();
                    this.props.bankAccountVerifySuccess();
                    this.loadingNode.destroy();

                    if (res.result && res.result.queleaReferreeStatus) {
                        global.GetThroughoutVerification();
                    }
                },
                (res) => {
                    this.clearCaptcha();
                    res.result.remainedAttempt !== 0 &&
                        showResultModal("验证码错误", false, 1501, "otp");
                    this.loadingNode.destroy();
                },
            );
        }
    };
    addLoding = (text) => {
        this.loadingNode = Modal.info({
            title: ``,
            centered: true,
            mask: false,
            content: (
                <div>
                    <div style={{ height: 45 }}>
                        <embed
                            type="image/jpg"
                            className="loading-animation"
                            src="/vn/img/icons/loading.svg"
                        />
                    </div>
                    <p
                        style={{
                            marginTop: 0,
                            marginBottom: 0,
                            padding: "0 14px",
                        }}
                    >
                        {text}
                    </p>
                </div>
            ),
            className: "showInfoModal hidden-btn opacity",
        });
    };
    // 本页发送验证码
    sendOTPCode = () => {
        this.addLoding("发送中 , 请稍后…");
        this.props.sendVerifyCode(() => {
            this.inputFocus0.current.focus(); // 发送完成默认设置焦点
            this.loadingNode.destroy();
        }, "BankCardValidation");
    };
    // 清除验证码框内容
    clearCaptcha = () => {
        if (this.inputFocus5.current) {
            this.setState({ captchaNum: "" }); // state records clear
            !this.state.isEnableBtn && this.setState({ isEnableBtn: true });
            this.localCaptcha = new Array(6).fill(""); // local variable clear
            this.localCaptcha.forEach((v, i) => {
                const tempFocus = this["inputFocus" + i].current;
                tempFocus.value = ""; // input value clear
                i === 0 ? tempFocus.focus() : tempFocus.blur(); // focus control
            });
        }
    };
    toEnd = (node) => {
        let current = node.current;
        current.focus();
        setTimeout(() => {
            current.selectionStart = current.value.length;
            current.selectionEnd = current.value.length;
        }, 0);
        // if (node.createTextRange) {
        //     // IE
        //     let range = node.createTextRange();
        //     range.moveStart("character", node.value.length);
        //     range.moveEnd("character", node.value.length);
        //     range.collapse(true);
        //     range.select();
        // } else {
        //     // 非IE
        //     node.setSelectionRange(node.value.length, node.value.length);
        //     node.focus();
        // }
    };
    // captcha input keydown event
    captchaKeydown = (event, i) => {
        if (!event) {
            event = window.event;
            event.target = event.srcElement;
        }
        if (i >= 0 && i < this.localCaptcha.length) {
            switch (event.keyCode) {
                case 8: // backspace
                    // 只要执行退格操作并且按钮启用状态则禁用按钮
                    !this.state.isEnableBtn &&
                        this.setState({ isEnableBtn: true });
                    event.target.value.length === 0 &&
                        i !== 0 &&
                        this["inputFocus" + (i - 1)].current.focus();
                    break;
                case 37: // 左键
                    i !== 0 && this.toEnd(this["inputFocus" + (i - 1)]);
                    break;
                case 39: // 右键
                    i !== this.localCaptcha.length - 1 &&
                        this["inputFocus" + (i + 1)].current.focus();
                    break;
                default:
                    break;
            }
        }
    };
    // captcha input onchange evnet
    changeCaptcha = (v, i) => {
        // 如果未绑定清除事件则绑定它
        if (this.inputFocus0.current && !this.inputFocus0.current.onKeydown) {
            this.localCaptcha.forEach((v, i) => {
                this["inputFocus" + i].current &&
                    (this["inputFocus" + i].current.onkeydown = (event) =>
                        this.captchaKeydown(event, i));
            });
        }

        let val = v.target.value;
        this.localCaptcha.splice(i, 1, val);

        // console.log("this.localCaptcha", this.localCaptcha.toString())

        // 中文输入法会导致字母和数字连续输入两次，非数字禁止输入
        if (val.length !== 1 || /\D/.test(val)) return;

        if (this.localCaptcha.toString().length === 11) {
            // 数组转String会带逗号，所以此处长度判定为11
            this.setState({
                isEnableBtn: false,
                captchaNum: this.localCaptcha.join(""),
            });
        }

        setTimeout(() => {
            // 二次排查处理中文输入法连续两次输入的问题
            i !== this.localCaptcha.length - 1 &&
                this["inputFocus" + (i + 1)].current.focus();
        });
    };
    render() {
        return (
            <Modal
                width={326}
                footer={false}
                maskClosable={false}
                closable={false}
                centered={true}
                visible={this.props.visible}
                onCancel={this.props.onCancel}
                className="banknumber-verify-otp"
            >
                <h3 className="center">信息验证</h3>
                <div className="center">
                    <embed src="/vn/img/icons/phone.svg" />
                </div>
                <p className="inline-link-btn">
                    验证码已发送至您的手机号 {this.props.phoneNumber}，请输入6
                    位验证码以完成验证。若需要协助，请联系
                    <Button type="link" onClick={global.PopUpLiveChat}>
                        在线客服
                    </Button>
                    。
                </p>
                <div className="verify-code-wrap">
                    <div className="input-otp-wrap">
                        {this.localCaptcha.map((v, i) => {
                            return (
                                <input
                                    key={"verifyCodeCaptcha" + i}
                                    maxLength="1"
                                    className="ant-input"
                                    ref={this["inputFocus" + i]}
                                    onInput={(e) =>
                                        (e.target.value =
                                            e.target.value.replace(/\D/g, ""))
                                    }
                                    onChange={(v) => this.changeCaptcha(v, i)}
                                />
                            );
                        })}
                    </div>
                </div>
                {this.props.remainingTime > 0 ? (
                    <button
                        type="button"
                        className="ant-btn retry-send ant-btn-link ant-btn-lg ant-btn-background-ghost ant-btn-block"
                    >
                        验证码将于{" "}
                        <span>{formatSeconds(this.props.remainingTime)}</span>{" "}
                        后失效。
                    </button>
                ) : (
                    <button
                        type="button"
                        className="ant-btn retry-send ant-btn-link ant-btn-lg ant-btn-background-ghost ant-btn-block"
                        onClick={this.sendOTPCode}
                    >
                        <span>重新发送</span>
                    </button>
                )}
                {this.props.submitOTPAttempts ? (
                    <div className="remain" style={{ marginBottom: 20 }}>
                        您还有 ({this.props.submitOTPAttempts}) 次尝试机会
                    </div>
                ) : null}
                <Row>
                    <Col offset={1} span={10}>
                        <Button
                            type="default"
                            size="large"
                            shape="round"
                            block
                            onClick={this.props.onCancel}
                        >
                            取消
                        </Button>
                    </Col>
                    <Col push={2} span={10}>
                        <Button
                            type="primary"
                            size="large"
                            shape="round"
                            block
                            disabled={this.state.isEnableBtn}
                            onClick={this.submitOTPCodeOwn}
                        >
                            确定
                        </Button>
                    </Col>
                </Row>
            </Modal>
        );
    }
}

export default VerifyCode;
